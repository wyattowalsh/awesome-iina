from __future__ import annotations

import tomllib
from dataclasses import dataclass
from pathlib import Path
from typing import Any


@dataclass(frozen=True, slots=True)
class RootPolicy:
    """Declarative rules for the repository root."""

    version: int
    allowed_files: frozenset[str]
    required_files: frozenset[str]
    ignored_files: frozenset[str]
    allowed_directories: frozenset[str]
    ignored_directories: frozenset[str]
    relocations: dict[str, str]


@dataclass(frozen=True, slots=True)
class RootViolation:
    """A single root-layout policy violation."""

    code: str
    path: str
    message: str
    suggestion: str | None = None


def _string_set(data: dict[str, Any], key: str) -> frozenset[str]:
    value = data.get(key, [])
    if not isinstance(value, list) or not all(isinstance(item, str) for item in value):
        raise ValueError(f"{key} must be an array of strings")
    return frozenset(value)


def load_root_policy(path: Path) -> RootPolicy:
    """Load and validate a root policy TOML document."""

    with path.open("rb") as handle:
        data = tomllib.load(handle)
    version = data.get("version")
    if version != 1:
        raise ValueError(f"unsupported root-policy version: {version!r}")
    relocations = data.get("relocations", {})
    if not isinstance(relocations, dict) or not all(
        isinstance(source, str) and isinstance(target, str)
        for source, target in relocations.items()
    ):
        raise ValueError("relocations must be a table of string paths")
    policy = RootPolicy(
        version=version,
        allowed_files=_string_set(data, "allowed_files"),
        required_files=_string_set(data, "required_files"),
        ignored_files=_string_set(data, "ignored_files"),
        allowed_directories=_string_set(data, "allowed_directories"),
        ignored_directories=_string_set(data, "ignored_directories"),
        relocations=dict(relocations),
    )
    missing_allowances = policy.required_files - policy.allowed_files
    if missing_allowances:
        raise ValueError(
            "required_files must also appear in allowed_files: "
            + ", ".join(sorted(missing_allowances))
        )
    return policy


def validate_root(root: Path, policy: RootPolicy) -> list[RootViolation]:
    """Return every policy violation found at *root*."""

    root = root.resolve()
    violations: list[RootViolation] = []

    if not root.is_dir():
        return [
            RootViolation(
                code="root-missing",
                path=str(root),
                message="repository root does not exist or is not a directory",
            )
        ]

    for required in sorted(policy.required_files):
        target = root / required
        if not target.is_file():
            violations.append(
                RootViolation(
                    code="required-file-missing",
                    path=required,
                    message=f"required root file is missing: {required}",
                )
            )

    for old_path, new_path in sorted(policy.relocations.items()):
        old_target = root / old_path
        new_target = root / new_path
        if old_target.exists() or old_target.is_symlink():
            violations.append(
                RootViolation(
                    code="misplaced-root-file",
                    path=old_path,
                    message=f"{old_path} belongs at {new_path}",
                    suggestion=f"move {old_path} to {new_path}",
                )
            )
        if not new_target.is_file():
            violations.append(
                RootViolation(
                    code="relocation-target-missing",
                    path=new_path,
                    message=f"expected relocated file is missing: {new_path}",
                    suggestion=f"restore {new_path}",
                )
            )

    for entry in sorted(root.iterdir(), key=lambda item: item.name.casefold()):
        name = entry.name
        if entry.is_symlink():
            violations.append(
                RootViolation(
                    code="root-symlink-forbidden",
                    path=name,
                    message="root-level symlinks are not allowed",
                    suggestion="replace the symlink with a tracked file or directory",
                )
            )
            continue
        if entry.is_file() and name in policy.ignored_files:
            continue
        if entry.is_file() and name not in policy.allowed_files:
            violations.append(
                RootViolation(
                    code="unexpected-root-file",
                    path=name,
                    message=f"unexpected file at repository root: {name}",
                    suggestion="move it to .github/, docs/, src/, starter/, or another owned area",
                )
            )
        elif entry.is_dir() and name not in policy.allowed_directories:
            if name in policy.ignored_directories:
                continue
            violations.append(
                RootViolation(
                    code="unexpected-root-directory",
                    path=name,
                    message=f"unexpected directory at repository root: {name}",
                    suggestion="declare it in src/awesome_iina/repo/root-policy.toml or move it under an owned area",
                )
            )

    return violations
