#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import re
import stat
import tempfile
import zipfile
from pathlib import Path, PurePosixPath

_EXCLUDED_PARTS = {
    ".git",
    ".idea",
    ".mypy_cache",
    ".pytest_cache",
    ".ruff_cache",
    ".tox",
    ".ty_cache",
    ".venv",
    "node_modules",
    ".astro",
    ".build",
    "__pycache__",
    "artifacts",
    "build",
    "dist",
    "htmlcov",
    "media-reports",
    "output",
}
_EXCLUDED_NAMES = {".coverage", ".DS_Store"}
_EXCLUDED_SUFFIXES = {".pyc", ".pyo", ".zip", ".ttf", ".otf", ".woff", ".woff2"}
_FIXED_TIMESTAMP = (1980, 1, 1, 0, 0, 0)
_REQUIRED_SOURCE_MEMBERS = {
    ".github/workflows/ci.yml",
    ".github/workflows/discovery-nightly.yml",
    ".github/workflows/discovery-deep.yml",
    "copier.yml",
    "starter/repo_wrapper.py",
    ".github/workflows/starter.yml",
    "src/awesome_iina/repo/starter-integration.json",
    "starter/tools/verify_source.py",
    "starter/tools/copier_source.py",
    "starter/plugins/iina-plugin-dev/plugin.json",
    "starter/tools/sync_agent_kit.py",
    "starter/tools/agent_kit_projections.json",
    "starter/template/.cursor/hooks.json",
    "starter/template/scripts/agent-guard.mjs",
    "starter/template/scripts/template-lineage.mjs",
    "starter/tests/test_integration_source.py",
    "starter/copier.yml",
    "starter/template/package.json.jinja",
    "starter/template/Info.json.jinja",
    "starter/template/.vscode/settings.json",
    "starter/template/src/main/index.ts.jinja",
    "starter/template/scripts/build.mjs",
    "starter/template/tests/contracts/stage.test.mjs",
    "starter/tests/test_real_copier.py",
    "README.md",
    "src/awesome_iina/site/kit/assets/brand/wordmark-dark.svg",
    "src/awesome_iina/site/kit/assets/brand/wordmark-light.svg",
    "src/awesome_iina/site/kit/assets/brand/github-social-preview-1280x640.png",
    "src/awesome_iina/site/kit/source/shipping-selection.json",
    "src/awesome_iina/site/brand.json",
    "src/awesome_iina/site/brand.py",
    "src/awesome_iina/site/__init__.py",
    "src/awesome_iina/site/templates/index.html.j2",
    "src/awesome_iina/catalog/catalog.yaml",
    "pyproject.toml",
    "src/awesome_iina/catalog/schemas/catalog.schema.json",
    "src/awesome_iina/repo/archive.py",
    "src/awesome_iina/cli.py",
    "src/awesome_iina/discovery/pipeline.py",
    "src/awesome_iina/discovery/merge.py",
    "src/awesome_iina/github/__init__.py",
    "tests/catalog/test_catalog.py",
    "tests/discovery/test_discovery.py",
    "tests/discovery/test_discovery_merge.py",
    "docs/discovery/discovery-automation.md",
}


def included(path: Path, root: Path, output: Path) -> bool:
    if path.resolve() == output.resolve():
        return False
    relative = path.relative_to(root)
    # Root editor state is local; template/.vscode contains intentional generated source.
    if relative.parts[0] == ".vscode":
        return False
    if path.name in {"SOURCE-MANIFEST.json", "FILE-HASHES.json"}:
        return False
    if relative.parts[:2] == ("starter", "reports"):
        return False
    if relative.parts[:3] in {
        ("starter", "site", "public"),
        ("starter", "examples", "sidebar-preview"),
    } or relative.parts[:5] == ("starter", "site", "src", "content", "docs"):
        return False
    if path.name in _EXCLUDED_NAMES:
        return False
    if any(part in _EXCLUDED_PARTS for part in relative.parts):
        return False
    if path.suffix.casefold() in _EXCLUDED_SUFFIXES:
        return False
    if relative.parts[:3] in {
        ("data", "discovery", "raw"),
        ("data", "discovery", "cache"),
    }:
        return False
    return path.is_file() and not path.is_symlink()


def collect_files(root: Path, output: Path) -> list[Path]:
    root = root.resolve()
    output = output.resolve()
    for path in root.rglob("*"):
        relative = path.relative_to(root)
        if any(part in _EXCLUDED_PARTS for part in relative.parts):
            continue
        if (
            path.name in {"id_rsa", "id_ed25519"}
            or path.suffix == ".pem"
            or (
                (path.name == ".env" or path.name.startswith(".env."))
                and path.name not in {".env.example", ".env.sample", ".env.template"}
            )
        ):
            raise RuntimeError(f"refusing to bundle a possible local secret: {relative}")
        if path.is_symlink():
            raise RuntimeError(f"refusing to silently omit a source symlink: {relative}")
    return sorted(
        (path for path in root.rglob("*") if included(path, root, output)),
        key=lambda path: path.relative_to(root).as_posix(),
    )


def _relative_member(name: str, prefix: str | None) -> str:
    if prefix is None:
        return name
    base = f"{prefix}/"
    return name.removeprefix(base) if name.startswith(base) else name


def _is_package_test_module(relative: str) -> bool:
    path = PurePosixPath(relative)
    return (
        len(path.parts) >= 2
        and path.parts[0] == "tests"
        and "helpers" not in path.parts
        and path.suffix == ".py"
        and path.name.startswith("test_")
    )


def source_surface_violations(names: set[str], prefix: str | None = None) -> list[str]:
    """One completeness policy for both source selection and serialized ZIP contents."""
    base = f"{prefix}/" if prefix is not None else ""
    missing = sorted({f"{base}{name}" for name in _REQUIRED_SOURCE_MEMBERS} - names)
    relatives = {_relative_member(name, prefix) for name in names}
    source_count = sum(
        relative.startswith("src/awesome_iina/") and relative.endswith(".py")
        for relative in relatives
    )
    test_count = sum(_is_package_test_module(relative) for relative in relatives)
    if source_count < 10:
        label = "source modules in ZIP" if prefix is not None else "src/awesome_iina/*.py files"
        missing.append(f"at least 10 {label} (found {source_count})")
    if test_count < 10:
        label = "test modules in ZIP" if prefix is not None else "tests/**/test_*.py files"
        missing.append(f"at least 10 {label} (found {test_count})")
    return missing


def verify_source_selection(root: Path, files: list[Path]) -> None:
    missing = source_surface_violations({path.relative_to(root).as_posix() for path in files})
    if missing:
        rendered = "\n".join(f"- {item}" for item in missing)
        raise RuntimeError(f"refusing to create an incomplete source archive:\n{rendered}")


def create_archive(root: Path, output: Path, prefix: str) -> list[Path]:
    if not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9._-]*", prefix):
        raise ValueError("archive prefix must be one safe directory name")
    root = root.resolve()
    if output.is_symlink():
        raise ValueError("archive output cannot be a symlink")
    output = output.absolute()
    if output.suffix != ".zip":
        raise ValueError("archive output must end in .zip")
    output.parent.mkdir(parents=True, exist_ok=True)
    files = collect_files(root, output)
    verify_source_selection(root, files)
    inventory = {}
    with tempfile.NamedTemporaryFile(
        prefix=".archive-", suffix=".zip", dir=output.parent, delete=False
    ) as stream:
        temporary = Path(stream.name)
    try:
        with zipfile.ZipFile(
            temporary, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9
        ) as archive:
            for path in files:
                relative = path.relative_to(root).as_posix()
                payload = path.read_bytes()
                permissions = 0o755 if path.stat().st_mode & stat.S_IXUSR else 0o644
                inventory[relative] = {
                    "sha256": hashlib.sha256(payload).hexdigest(),
                    "bytes": len(payload),
                    "mode": permissions,
                }
                _write_member(archive, f"{prefix}/{relative}", payload, permissions)
            manifest = (
                json.dumps(
                    {"schema_version": 1, "files": inventory}, indent=2, sort_keys=True
                ).encode()
                + b"\n"
            )
            _write_member(archive, f"{prefix}/SOURCE-MANIFEST.json", manifest, 0o644)
        # Do not destroy a previous good artifact unless every staged check succeeds.
        verify_archive(temporary, prefix)
        temporary.replace(output)
    finally:
        temporary.unlink(missing_ok=True)
    return files


def _write_member(archive: zipfile.ZipFile, name: str, data: bytes, permissions: int) -> None:
    info = zipfile.ZipInfo(name, _FIXED_TIMESTAMP)
    info.compress_type = zipfile.ZIP_DEFLATED
    info.external_attr = (stat.S_IFREG | permissions) << 16
    info.create_system = 3
    archive.writestr(info, data)


def verify_archive(path: Path, prefix: str) -> None:
    with zipfile.ZipFile(path) as archive:
        if corrupted := archive.testzip():
            raise RuntimeError(f"archive CRC verification failed at {corrupted}")
        members = archive.namelist()
        if len(members) != len(set(members)):
            raise RuntimeError("duplicate archive member")
        names = set(members)
        missing = source_surface_violations(names, prefix)
        if missing:
            raise RuntimeError("archive is incomplete: " + ", ".join(missing))
        manifest_name = f"{prefix}/SOURCE-MANIFEST.json"
        if manifest_name not in names:
            raise RuntimeError("archive is missing its per-file manifest")
        inventory = json.loads(archive.read(manifest_name))["files"]
        expected_names = {f"{prefix}/{relative}" for relative in inventory} | {manifest_name}
        if names != expected_names:
            raise RuntimeError("archive inventory does not exactly match its manifest")
        for relative, expected in inventory.items():
            name = f"{prefix}/{relative}"
            if (
                ".." in Path(relative).parts
                or Path(relative).is_absolute()
                or "\\" in relative
                or any(ord(c) < 32 for c in relative)
            ):
                raise RuntimeError("unsafe archive member path")
            payload = archive.read(name)
            if (
                len(payload) != expected["bytes"]
                or hashlib.sha256(payload).hexdigest() != expected["sha256"]
            ):
                raise RuntimeError(f"archive member hash mismatch: {relative}")


def write_file_manifest(root: Path, files: list[Path], destination: Path) -> None:
    root = root.resolve()
    destination.parent.mkdir(parents=True, exist_ok=True)
    lines = [
        f"{hashlib.sha256(path.read_bytes()).hexdigest()}  {path.relative_to(root).as_posix()}"
        for path in files
    ]
    destination.write_text("\n".join(lines) + "\n", encoding="utf-8")
