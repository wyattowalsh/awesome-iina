from __future__ import annotations

import json
import os
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

_IDENTIFIER = re.compile(r"^([\w-]+\.)+[\w-]+$")
_GITHUB_REPOSITORY = re.compile(r"^[A-Za-z0-9-]+/[A-Za-z0-9_.-]+$")
_KNOWN_PERMISSIONS = {
    "network-request",
    "show-osd",
    "show-alert",
    "video-overlay",
    "file-system",
}
_DANGEROUS_PERMISSIONS = {"network-request", "file-system"}
_PATH_FIELDS = ("entry", "globalEntry", "preferencesPage", "helpPage")


@dataclass(frozen=True, slots=True)
class ManifestFinding:
    severity: str
    code: str
    field: str | None
    message: str


@dataclass(frozen=True, slots=True)
class ManifestInspection:
    path: str
    package_root: str
    valid: bool
    identifier: str | None
    name: str | None
    version: str | None
    permissions: list[str] = field(default_factory=list)
    dangerous_permissions: list[str] = field(default_factory=list)
    package_size_bytes: int = 0
    findings: list[ManifestFinding] = field(default_factory=list)


def _load_json_with_duplicate_detection(path: Path) -> tuple[dict[str, Any] | None, list[str]]:
    duplicates: list[str] = []

    def pairs_hook(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
        output: dict[str, Any] = {}
        for key, value in pairs:
            if key in output:
                duplicates.append(key)
            output[key] = value
        return output

    try:
        value = json.loads(path.read_text(encoding="utf-8"), object_pairs_hook=pairs_hook)
    except (OSError, UnicodeDecodeError, json.JSONDecodeError):
        return None, duplicates
    return value if isinstance(value, dict) else None, duplicates


def _package_size(root: Path) -> int:
    total = 0
    for directory, _, filenames in os.walk(root, followlinks=False):
        base = Path(directory)
        for filename in filenames:
            path = base / filename
            try:
                if path.is_symlink():
                    continue
                total += path.stat().st_size
            except OSError:
                continue
    return total


def _resolve_owned_path(root: Path, value: str) -> tuple[Path | None, str | None]:
    candidate = Path(value)
    if candidate.is_absolute():
        return None, "path must be relative to the plugin package"
    resolved = (root / candidate).resolve()
    try:
        resolved.relative_to(root.resolve())
    except ValueError:
        return None, "path escapes the plugin package"
    return resolved, None


def inspect_manifest(path: Path) -> ManifestInspection:
    """Inspect an IINA ``Info.json`` without executing plugin code."""

    path = path.resolve()
    root = path.parent
    findings: list[ManifestFinding] = []
    payload, duplicates = _load_json_with_duplicate_detection(path)
    if payload is None:
        findings.append(
            ManifestFinding("error", "invalid-json", None, "manifest is not a JSON object")
        )
        return ManifestInspection(
            path=str(path),
            package_root=str(root),
            valid=False,
            identifier=None,
            name=None,
            version=None,
            package_size_bytes=_package_size(root) if root.is_dir() else 0,
            findings=findings,
        )

    findings.extend(
        ManifestFinding("error", "duplicate-key", key, f"duplicate JSON key: {key}")
        for key in sorted(set(duplicates))
    )

    required_types: dict[str, type] = {
        "name": str,
        "author": dict,
        "identifier": str,
        "version": str,
        "entry": str,
    }
    for key, expected_type in required_types.items():
        if key not in payload:
            findings.append(
                ManifestFinding("error", "required-field-missing", key, f"missing {key}")
            )
        elif not isinstance(payload[key], expected_type):
            findings.append(
                ManifestFinding(
                    "error",
                    "field-type",
                    key,
                    f"{key} must be {expected_type.__name__}",
                )
            )

    author = payload.get("author")
    if isinstance(author, dict) and not isinstance(author.get("name"), str):
        findings.append(
            ManifestFinding(
                "error", "author-name-missing", "author.name", "author.name is required"
            )
        )

    identifier = payload.get("identifier") if isinstance(payload.get("identifier"), str) else None
    if identifier and not _IDENTIFIER.fullmatch(identifier):
        findings.append(
            ManifestFinding(
                "error",
                "identifier-format",
                "identifier",
                "identifier must use reverse-domain notation",
            )
        )

    permissions_value = payload.get("permissions", [])
    permissions: list[str] = []
    if not isinstance(permissions_value, list) or not all(
        isinstance(item, str) for item in permissions_value
    ):
        findings.append(
            ManifestFinding(
                "error",
                "permissions-type",
                "permissions",
                "permissions must be an array of strings",
            )
        )
    else:
        permissions = sorted(set(permissions_value))
        findings.extend(
            ManifestFinding(
                "warning",
                "unknown-permission",
                "permissions",
                f"IINA may ignore unknown permission: {permission}",
            )
            for permission in permissions
            if permission not in _KNOWN_PERMISSIONS
        )

    allowed_domains = payload.get("allowedDomains", [])
    if allowed_domains and (
        not isinstance(allowed_domains, list)
        or not all(isinstance(item, str) for item in allowed_domains)
    ):
        findings.append(
            ManifestFinding(
                "error",
                "allowed-domains-type",
                "allowedDomains",
                "allowedDomains must be an array of strings",
            )
        )
    elif "network-request" in permissions:
        if not allowed_domains:
            findings.append(
                ManifestFinding(
                    "warning",
                    "network-domains-empty",
                    "allowedDomains",
                    "network-request is declared without allowedDomains",
                )
            )
        elif "*" in allowed_domains:
            findings.append(
                ManifestFinding(
                    "warning",
                    "network-domains-wildcard",
                    "allowedDomains",
                    "wildcard network access should be justified and documented",
                )
            )

    for field_name in _PATH_FIELDS:
        value = payload.get(field_name)
        if value is None:
            continue
        if not isinstance(value, str):
            findings.append(
                ManifestFinding(
                    "error",
                    "path-field-type",
                    field_name,
                    f"{field_name} must be a string",
                )
            )
            continue

        lexical_target = root / Path(value)
        if lexical_target.is_symlink():
            findings.append(
                ManifestFinding(
                    "error",
                    "referenced-symlink",
                    field_name,
                    f"referenced path must not be a symlink: {value}",
                )
            )

        target, error = _resolve_owned_path(root, value)
        if error:
            findings.append(ManifestFinding("error", "unsafe-path", field_name, error))
        elif target is not None and not target.is_file():
            findings.append(
                ManifestFinding(
                    "error" if field_name in {"entry", "globalEntry"} else "warning",
                    "referenced-file-missing",
                    field_name,
                    f"referenced file does not exist: {value}",
                )
            )

    if "global" in payload and "globalEntry" not in payload:
        findings.append(
            ManifestFinding(
                "warning",
                "legacy-global-key",
                "global",
                "current IINA source reads globalEntry; verify compatibility before publishing",
            )
        )

    gh_repo = payload.get("ghRepo")
    if gh_repo is not None and (
        not isinstance(gh_repo, str) or not _GITHUB_REPOSITORY.fullmatch(gh_repo)
    ):
        findings.append(
            ManifestFinding(
                "error",
                "github-repository-format",
                "ghRepo",
                "ghRepo must have owner/repository form",
            )
        )
    gh_version = payload.get("ghVersion")
    if gh_version is not None and (not isinstance(gh_version, int) or gh_version < 1):
        findings.append(
            ManifestFinding(
                "error",
                "github-version-format",
                "ghVersion",
                "ghVersion must be a positive integer",
            )
        )
    if bool(gh_repo) != bool(gh_version):
        findings.append(
            ManifestFinding(
                "warning",
                "github-update-fields-incomplete",
                None,
                "ghRepo and ghVersion should normally be declared together",
            )
        )

    package_size = _package_size(root)
    if package_size > 50 * 1024 * 1024:
        findings.append(
            ManifestFinding(
                "warning",
                "large-package",
                None,
                f"plugin package is unusually large ({package_size / 1024 / 1024:.1f} MiB)",
            )
        )

    errors = [finding for finding in findings if finding.severity == "error"]
    return ManifestInspection(
        path=str(path),
        package_root=str(root),
        valid=not errors,
        identifier=identifier,
        name=payload.get("name") if isinstance(payload.get("name"), str) else None,
        version=payload.get("version") if isinstance(payload.get("version"), str) else None,
        permissions=permissions,
        dangerous_permissions=sorted(_DANGEROUS_PERMISSIONS & set(permissions)),
        package_size_bytes=package_size,
        findings=findings,
    )
