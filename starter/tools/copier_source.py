"""Minimal, byte-preserving source snapshots for real-Copier integration tests.

Synthetic Git histories created by tests are test evidence, never distributed lineage.
"""
from __future__ import annotations

import hashlib
import shutil
from pathlib import Path

EMBEDDED = Path("starter")
EXCLUDED = {"__pycache__", ".pytest_cache", "node_modules", ".build", ".git"}


def source_parts(root: Path) -> tuple[Path, ...]:
    if (root / EMBEDDED / "copier.yml").is_file():
        if not (root / "copier.yml").is_file():
            raise ValueError("integrated root is missing its Copier entrypoint")
        return (Path("copier.yml"), EMBEDDED / "copier.yml", EMBEDDED / "template")
    if (root / "copier.yml").is_file() and (root / "template/package.json.jinja").is_file():
        return (Path("copier.yml"), Path("template"))
    raise ValueError("source must contain a complete standalone or integrated Copier template")


def copy_source(root: Path, destination: Path) -> str:
    """Copy only Copier inputs; refuse symlinks and pre-existing destinations."""
    root = root.resolve()
    parts = source_parts(root)
    files: list[Path] = []
    for part in parts:
        path = root / part
        paths = [path, *path.rglob("*")] if path.is_dir() else [path]
        for item in paths:
            if any(component in EXCLUDED for component in item.relative_to(root).parts):
                continue
            if item.is_symlink():
                raise ValueError(f"refusing symlink in template source: {item.relative_to(root)}")
            if item.is_file():
                files.append(item)
    destination.mkdir(parents=True, exist_ok=False)
    digest = hashlib.sha256()
    for path in sorted(files):
        relative = path.relative_to(root)
        data = path.read_bytes()
        digest.update(relative.as_posix().encode() + b"\0" + hashlib.sha256(data).digest())
        target = destination / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(path, target)
    return digest.hexdigest()
