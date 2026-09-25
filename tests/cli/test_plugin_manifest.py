from __future__ import annotations

import json
from pathlib import Path

from awesome_iina.repo.plugin_manifest import inspect_manifest


def valid_manifest(root: Path) -> Path:
    (root / "dist").mkdir()
    (root / "dist/index.js").write_text("console.log('ok');\n")
    path = root / "Info.json"
    path.write_text(
        json.dumps(
            {
                "name": "Example",
                "identifier": "dev.example.plugin",
                "version": "1.0.0",
                "author": {"name": "Example Author"},
                "entry": "dist/index.js",
                "permissions": ["show-osd", "file-system"],
                "ghRepo": "example/iina-plugin",
                "ghVersion": 1,
            }
        )
        + "\n"
    )
    return path


def test_manifest_inspection_accepts_valid_package(tmp_path: Path) -> None:
    report = inspect_manifest(valid_manifest(tmp_path))

    assert report.valid
    assert report.identifier == "dev.example.plugin"
    assert report.dangerous_permissions == ["file-system"]
    assert report.findings == []


def test_manifest_inspection_detects_duplicate_key(tmp_path: Path) -> None:
    (tmp_path / "index.js").write_text("// ok\n")
    path = tmp_path / "Info.json"
    path.write_text(
        '{"name":"A","name":"B","identifier":"dev.example.plugin",'
        '"version":"1","author":{"name":"A"},"entry":"index.js"}\n'
    )

    report = inspect_manifest(path)

    assert not report.valid
    assert any(finding.code == "duplicate-key" for finding in report.findings)


def test_manifest_inspection_rejects_escape_and_string_author(tmp_path: Path) -> None:
    path = tmp_path / "Info.json"
    path.write_text(
        json.dumps(
            {
                "name": "Example",
                "identifier": "dev.example.plugin",
                "version": "1.0.0",
                "author": "Example",
                "entry": "../outside.js",
            }
        )
        + "\n"
    )

    report = inspect_manifest(path)
    codes = {finding.code for finding in report.findings}

    assert not report.valid
    assert "field-type" in codes
    assert "unsafe-path" in codes


def test_manifest_inspection_warns_about_wildcard_network_access(tmp_path: Path) -> None:
    path = valid_manifest(tmp_path)
    payload = json.loads(path.read_text())
    payload["permissions"] = ["network-request"]
    payload["allowedDomains"] = ["*"]
    path.write_text(json.dumps(payload) + "\n")

    report = inspect_manifest(path)

    assert report.valid
    assert any(finding.code == "network-domains-wildcard" for finding in report.findings)


def test_manifest_inspection_reports_invalid_json_and_missing_fields(tmp_path: Path) -> None:
    invalid = tmp_path / "Info.json"
    invalid.write_text("not json\n")
    assert inspect_manifest(invalid).findings[0].code == "invalid-json"

    missing = tmp_path / "Missing.json"
    missing.write_text("{}\n")
    report = inspect_manifest(missing)
    assert not report.valid
    assert sum(finding.code == "required-field-missing" for finding in report.findings) == 5


def test_manifest_inspection_reports_manifest_semantics(tmp_path: Path) -> None:
    (tmp_path / "existing.js").write_text("// ok\n")
    path = tmp_path / "Info.json"
    path.write_text(
        json.dumps(
            {
                "name": "Example",
                "identifier": "invalid",
                "version": "1.0.0",
                "author": {},
                "entry": "missing.js",
                "global": "existing.js",
                "preferencesPage": 42,
                "permissions": ["unknown-permission", "network-request"],
                "allowedDomains": "*",
                "ghRepo": "bad-format",
                "ghVersion": 0,
            }
        )
        + "\n"
    )

    report = inspect_manifest(path)
    codes = {finding.code for finding in report.findings}

    assert not report.valid
    assert {
        "author-name-missing",
        "identifier-format",
        "unknown-permission",
        "allowed-domains-type",
        "path-field-type",
        "referenced-file-missing",
        "legacy-global-key",
        "github-repository-format",
        "github-version-format",
    } <= codes


def test_manifest_inspection_reports_symlink_and_incomplete_update_fields(tmp_path: Path) -> None:
    (tmp_path / "target.js").write_text("// ok\n")
    (tmp_path / "entry.js").symlink_to(tmp_path / "target.js")
    path = tmp_path / "Info.json"
    path.write_text(
        json.dumps(
            {
                "name": "Example",
                "identifier": "dev.example.plugin",
                "version": "1.0.0",
                "author": {"name": "Example"},
                "entry": "entry.js",
                "ghRepo": "example/project",
            }
        )
        + "\n"
    )

    report = inspect_manifest(path)
    codes = {finding.code for finding in report.findings}

    assert "referenced-symlink" in codes
    assert "github-update-fields-incomplete" in codes


def test_manifest_inspection_accepts_dotted_gh_repo(tmp_path: Path) -> None:
    path = valid_manifest(tmp_path)
    payload = json.loads(path.read_text())
    payload["ghRepo"] = "example/foo.js"
    path.write_text(json.dumps(payload) + "\n")

    report = inspect_manifest(path)

    assert report.valid
    assert not any(finding.code == "github-repository-format" for finding in report.findings)
