#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import re
import subprocess
import tomllib
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

import yaml
from jsonschema import Draft202012Validator
from pydantic import ValidationError

from awesome_iina.catalog import (
    audit_official_plugins,
    load_catalog,
    validate_catalog_policy,
)
from awesome_iina.catalog.generator import generated_outputs, write_or_check
from awesome_iina.discovery.settings import load_config
from awesome_iina.discovery.sources import (
    content_sha256,
    destination_for,
    load_official_plugins,
    load_source_snapshot,
)
from awesome_iina.io_utils import load_model
from awesome_iina.models import DiscoveryRun, MediaReport, OverrideFile
from awesome_iina.repo.awesome_lint import lint_awesome_repository
from awesome_iina.repo.root_policy import load_root_policy, validate_root

ROOT = Path(__file__).resolve().parents[3]
_MARKDOWN_LINK = re.compile(r"\[[^\]]*\]\(([^)]+)\)")
_ACTION_USE = re.compile(r"^\s*uses:\s*([^#\s]+)(?:\s+#\s*(.*))?$", re.MULTILINE)
_FULL_COMMIT_SHA = re.compile(r"[0-9a-f]{40}")
_BINARY_SUFFIXES = {".gif", ".iinaplgz", ".jpeg", ".jpg", ".png", ".ico", ".pyc", ".webp", ".zip"}
_STARTER = ROOT / "starter"
_IGNORED_PARTS = {
    ".git",
    ".pytest_cache",
    ".ruff_cache",
    ".ty_cache",
    ".venv",
    "__pycache__",
    "node_modules",
}


class VerificationError(RuntimeError):
    """Raised when a repository integrity invariant fails."""


def _owned_by_starter(path: Path) -> bool:
    return (
        path.is_relative_to(_STARTER)
        or path.is_relative_to(ROOT / "src/awesome_iina/site/kit")
        or path.is_relative_to(ROOT / "src/awesome_iina/site/static/ui")
        or path.is_relative_to(ROOT / "src/awesome_iina/site/ui/node_modules")
        or path.is_relative_to(ROOT / "dist")
        or path.is_relative_to(ROOT / "output")
    )


def _relative(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def verify_repository_surfaces() -> None:
    required = (
        "src/awesome_iina/cli.py",
        "src/awesome_iina/discovery/pipeline.py",
        "src/awesome_iina/discovery/merge.py",
        "src/awesome_iina/github/__init__.py",
        "tests/catalog/test_catalog.py",
        "tests/discovery/test_discovery.py",
        "tests/discovery/test_discovery_merge.py",
        ".github/workflows/ci.yml",
        ".github/workflows/discovery-nightly.yml",
        ".github/workflows/discovery-deep.yml",
        "src/awesome_iina/catalog/catalog.yaml",
        "src/awesome_iina/catalog/schemas/catalog.schema.json",
        "src/awesome_iina/repo/archive.py",
    )
    missing = [relative for relative in required if not (ROOT / relative).is_file()]
    source_files = [
        path for path in (ROOT / "src/awesome_iina").rglob("*.py") if not _owned_by_starter(path)
    ]
    test_files = [
        path for path in (ROOT / "tests").rglob("test_*.py") if "helpers" not in path.parts
    ]
    if len(source_files) < 10:
        missing.append(f"expected at least 10 Python source modules, found {len(source_files)}")
    if len(test_files) < 10:
        missing.append(f"expected at least 10 test modules, found {len(test_files)}")
    if missing:
        raise VerificationError(
            "repository source surfaces are incomplete:\n"
            + "\n".join(f"- {item}" for item in missing)
        )


def verify_root_and_awesome_policy() -> None:
    root_violations = validate_root(
        ROOT,
        load_root_policy(ROOT / "src/awesome_iina/repo/root-policy.toml"),
    )
    awesome_issues = lint_awesome_repository(
        ROOT,
        ROOT / "README.md",
        ROOT / "src/awesome_iina/catalog/catalog.yaml",
    )
    messages = [
        *(f"root [{item.code}] {item.path}: {item.message}" for item in root_violations),
        *(
            f"awesome [{item.code}] {item.path}"
            f"{f':{item.line}' if item.line else ''}: {item.message}"
            for item in awesome_issues
        ),
    ]
    if messages:
        raise VerificationError("repository policy violations:\n" + "\n".join(messages))


def verify_syntax() -> None:
    for path in sorted(ROOT.rglob("*.py")):
        if _owned_by_starter(path) or any(part in _IGNORED_PARTS for part in path.parts):
            continue
        compile(path.read_text(encoding="utf-8"), str(path), "exec")
    for path in sorted(ROOT.rglob("*.json")):
        if _owned_by_starter(path) or any(part in _IGNORED_PARTS for part in path.parts):
            continue
        json.loads(path.read_text(encoding="utf-8"))
    for pattern in ("*.yaml", "*.yml"):
        for path in sorted(ROOT.rglob(pattern)):
            if _owned_by_starter(path) or any(part in _IGNORED_PARTS for part in path.parts):
                continue
            if path != ROOT / "copier.yml":
                yaml.safe_load(path.read_text(encoding="utf-8"))
    with (ROOT / "pyproject.toml").open("rb") as handle:
        tomllib.load(handle)


def verify_catalog_and_generation() -> None:
    config = load_config(ROOT / "src/awesome_iina/discovery/discovery.yaml")
    catalog = load_catalog(ROOT / "src/awesome_iina/catalog/catalog.yaml")
    policy_errors = validate_catalog_policy(catalog)
    official_errors = audit_official_plugins(
        catalog,
        load_official_plugins(ROOT / "src/awesome_iina/discovery/snapshots/iina-plugins.json"),
    )
    errors = [*policy_errors, *official_errors]
    if errors:
        raise VerificationError("catalog errors:\n" + "\n".join(f"- {error}" for error in errors))
    verify_override_file(ROOT / config.paths.overrides)
    outputs = generated_outputs(
        catalog,
        template_path=ROOT / config.paths.readme_template,
        readme_path=ROOT / config.paths.readme,
        catalog_json_path=ROOT / "src/awesome_iina/catalog/exports/catalog.json",
        schema_directory=ROOT / "src/awesome_iina/catalog/schemas",
    )
    stale = write_or_check(outputs, check=True)
    if stale:
        rendered = ", ".join(_relative(path) for path in stale)
        raise VerificationError(f"generated files are stale: {rendered}")


def verify_override_file(path: Path) -> None:
    try:
        load_model(path, OverrideFile)
    except (OSError, UnicodeDecodeError, yaml.YAMLError, ValidationError) as error:
        raise VerificationError(
            f"{path.as_posix()} failed OverrideFile validation: {error}"
        ) from error


def raw_sidecar_path(snapshot_path: Path) -> Path:
    return snapshot_path.with_name(f"{snapshot_path.stem}.raw.json")


def raw_sidecar_hash_violations(snapshot_path: Path, expected_sha256: str) -> list[str]:
    sidecar = raw_sidecar_path(snapshot_path)
    if not sidecar.is_file():
        return []
    actual = hashlib.sha256(sidecar.read_bytes()).hexdigest()
    if actual == expected_sha256:
        return []
    return [f"{sidecar.as_posix()}: raw SHA-256 mismatch ({actual} != {expected_sha256})"]


def _validate_schema(path: Path, instance: Any) -> None:
    schema = json.loads(path.read_text(encoding="utf-8"))
    Draft202012Validator.check_schema(schema)
    errors = sorted(
        Draft202012Validator(schema).iter_errors(instance),
        key=lambda error: [str(part) for part in error.absolute_path],
    )
    if not errors:
        return
    rendered = "\n".join(
        f"- {'/'.join(str(part) for part in error.absolute_path) or '<root>'}: {error.message}"
        for error in errors[:20]
    )
    raise VerificationError(f"{_relative(path)} rejected its example:\n{rendered}")


def verify_source_snapshots() -> None:
    config = load_config(ROOT / "src/awesome_iina/discovery/discovery.yaml")
    violations: list[str] = []
    for source in config.sources:
        if not source.enabled:
            continue
        destination = destination_for(source, config)
        path = ROOT / destination
        if not path.exists():
            violations.append(f"{destination}: missing source snapshot")
            continue
        snapshot = load_source_snapshot(path)
        expected = content_sha256(snapshot.content)
        if snapshot.content_sha256 != expected:
            violations.append(
                f"{destination}: content SHA-256 mismatch ({snapshot.content_sha256} != {expected})"
            )
        violations.extend(raw_sidecar_hash_violations(path, snapshot.sha256))
    if violations:
        raise VerificationError("source snapshot violations:\n" + "\n".join(violations))


def verify_schemas() -> None:
    config = load_config(ROOT / "src/awesome_iina/discovery/discovery.yaml")
    catalog = load_catalog(ROOT / "src/awesome_iina/catalog/catalog.yaml")
    media_report = MediaReport.model_validate_json(
        (ROOT / "docs/maintain/examples/media-report.example.json").read_text(encoding="utf-8")
    )
    empty_run = DiscoveryRun(
        started_at=datetime(2026, 9, 12, tzinfo=UTC),
        finished_at=datetime(2026, 9, 12, tzinfo=UTC),
        config_sha256="0" * 64,
        mode="quick",
        candidates=[],
        outcomes=[],
    )
    overrides = load_model(ROOT / config.paths.overrides, OverrideFile)
    snapshot = load_source_snapshot(ROOT / config.paths.official_plugins_snapshot)
    instances = {
        "catalog.schema.json": catalog.model_dump(mode="json"),
        "discovery-config.schema.json": config.model_dump(mode="json"),
        "discovery-run.schema.json": empty_run.model_dump(mode="json"),
        "media-report.schema.json": media_report.model_dump(mode="json"),
        "overrides.schema.json": overrides.model_dump(mode="json"),
        "source-snapshot.schema.json": snapshot.model_dump(mode="json"),
    }
    for name, instance in instances.items():
        _validate_schema(ROOT / "src/awesome_iina/catalog/schemas" / name, instance)


def verify_workflow_action_pins() -> None:
    violations: list[str] = []
    for path in sorted((ROOT / ".github/workflows").glob("*.yml")):
        text = path.read_text(encoding="utf-8")
        for match in _ACTION_USE.finditer(text):
            value, comment = match.groups()
            if value.startswith(("./", "docker://")):
                continue
            action, separator, reference = value.rpartition("@")
            if not separator or not action or not _FULL_COMMIT_SHA.fullmatch(reference):
                violations.append(f"{_relative(path)}: unpinned action {value}")
            if not comment:
                violations.append(f"{_relative(path)}: pin {value} lacks a version comment")
    if violations:
        raise VerificationError("workflow pin violations:\n" + "\n".join(violations))


def verify_discovery_workflows() -> None:
    expected = {
        "discovery-nightly.yml": ("17 3 * * *", "--mode quick --backend rest"),
        "discovery-deep.yml": ("43 4 * * 0", "--mode full --backend rest"),
    }
    violations: list[str] = []
    for name, (cron, mode_fragment) in expected.items():
        path = ROOT / ".github/workflows" / name
        workflow = yaml.load(path.read_text(encoding="utf-8"), Loader=yaml.BaseLoader)  # noqa: S506
        if workflow.get("permissions") != {"contents": "read"}:
            violations.append(f"{name}: workflow permissions must be contents: read")
        schedules = workflow.get("on", {}).get("schedule", [])
        if not schedules or schedules[0].get("cron") != cron:
            violations.append(f"{name}: unexpected schedule")
        if not schedules or schedules[0].get("timezone") != "America/New_York":
            violations.append(f"{name}: missing America/New_York schedule timezone")
        steps = workflow.get("jobs", {}).get("discover", {}).get("steps", [])
        shell = "\n".join(step.get("run", "") for step in steps)
        if mode_fragment not in shell or "--strict" not in shell or "--checkpoint" not in shell:
            violations.append(f"{name}: required bounded discovery command is missing")
        if any(fragment in shell for fragment in ("git push", "gh pr create", "catalog generate")):
            violations.append(f"{name}: discovery automation crosses the human curation boundary")
        uploaders = [
            step
            for step in steps
            if str(step.get("uses", "")).startswith("actions/upload-artifact@")
        ]
        if len(uploaders) != 1 or uploaders[0].get("if") != "always()":
            violations.append(f"{name}: failure-preserving artifact upload is missing")
        violations.extend(
            f"{name}: {action.removesuffix('@')} is missing"
            for action in ("actions/cache/restore@", "actions/cache/save@")
            if not any(str(step.get("uses", "")).startswith(action) for step in steps)
        )
        if name == "discovery-deep.yml":
            violations.extend(
                f"{name}: deep reconciliation is missing {fragment}"
                for fragment in ("--backend graphql", "merge-discovery", "backend-diff.md")
                if fragment not in shell
            )
    if violations:
        raise VerificationError("discovery workflow violations:\n" + "\n".join(violations))


def verify_workflow_shell_syntax() -> None:
    violations: list[str] = []
    expression = re.compile(r"\$\{\{.*?\}\}")
    for path in sorted((ROOT / ".github/workflows").glob("*.yml")):
        workflow = yaml.load(path.read_text(encoding="utf-8"), Loader=yaml.BaseLoader)  # noqa: S506
        for job_name, job in workflow.get("jobs", {}).items():
            for index, step in enumerate(job.get("steps", []), start=1):
                script = step.get("run")
                if not script:
                    continue
                result = subprocess.run(
                    ["bash", "-n"],  # noqa: S607
                    input=expression.sub("GITHUB_EXPRESSION", script),
                    text=True,
                    capture_output=True,
                    check=False,
                )
                if result.returncode:
                    label = step.get("name", f"step {index}")
                    violations.append(
                        f"{_relative(path)} [{job_name} / {label}]: {result.stderr.strip()}"
                    )
    if violations:
        raise VerificationError("workflow shell syntax violations:\n" + "\n".join(violations))


def verify_markdown_links() -> None:
    missing: list[str] = []
    for path in sorted(ROOT.rglob("*.md")):
        if _owned_by_starter(path) or any(part in _IGNORED_PARTS for part in path.parts):
            continue
        for target in _MARKDOWN_LINK.findall(path.read_text(encoding="utf-8")):
            target = target.split()[0].strip("<>")
            if target.startswith(("#", "http://", "https://", "mailto:")):
                continue
            target = target.split("#", 1)[0]
            if not target or "{{" in target or "{%" in target:
                continue
            resolved = (path.parent / target).resolve()
            if not resolved.exists():
                missing.append(f"{_relative(path)} -> {target}")
    if missing:
        raise VerificationError("missing local Markdown targets:\n" + "\n".join(missing))


def verify_text_hygiene() -> None:
    violations: list[str] = []
    for path in sorted(ROOT.rglob("*")):
        if (
            not path.is_file()
            or _owned_by_starter(path)
            or any(part in _IGNORED_PARTS for part in path.parts)
        ):
            continue
        if path.suffix.casefold() in _BINARY_SUFFIXES:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        if text and not text.endswith("\n"):
            violations.append(f"{_relative(path)}: missing final newline")
        for number, line in enumerate(text.splitlines(), start=1):
            if line.rstrip() != line:
                violations.append(f"{_relative(path)}:{number}: trailing whitespace")
    if violations:
        raise VerificationError("text hygiene violations:\n" + "\n".join(violations))


def verify_starter_source() -> None:
    # This reads and renders fixtures only. It never installs packages or runs Copier tasks.
    import subprocess
    import sys

    subprocess.run(  # noqa: S603
        [sys.executable, str(ROOT / "starter/repo_wrapper.py"), "verify"],
        cwd=ROOT,
        check=True,
    )


def main() -> None:
    checks = (
        ("source surfaces", verify_repository_surfaces),
        ("embedded Copier source", verify_starter_source),
        ("root and Awesome-list policy", verify_root_and_awesome_policy),
        ("syntax", verify_syntax),
        ("catalog and generated outputs", verify_catalog_and_generation),
        ("source snapshots", verify_source_snapshots),
        ("JSON Schemas", verify_schemas),
        ("workflow action pins", verify_workflow_action_pins),
        ("scheduled discovery workflow policy", verify_discovery_workflows),
        ("workflow shell syntax", verify_workflow_shell_syntax),
        ("local Markdown links", verify_markdown_links),
        ("text hygiene", verify_text_hygiene),
    )
    for label, check in checks:
        check()
        print(f"ok: {label}")
    print("repository integrity verified")


if __name__ == "__main__":
    main()
