from __future__ import annotations

import hashlib
from pathlib import Path

import pytest

from awesome_iina.discovery.sources import load_source_snapshot
from awesome_iina.io_utils import write_yaml
from awesome_iina.repo import verify


def load_verify_repository():
    return verify


def test_verify_override_file_accepts_committed_overrides() -> None:
    module = load_verify_repository()
    module.verify_override_file(Path("src/awesome_iina/discovery/overrides.yaml"))


def test_verify_override_file_rejects_invalid_payload(tmp_path: Path) -> None:
    module = load_verify_repository()
    path = tmp_path / "overrides.yaml"
    write_yaml(path, {"version": 1, "repositories": {"not-a-repo": {"decision": "nope"}}})
    with pytest.raises(module.VerificationError, match="failed OverrideFile validation"):
        module.verify_override_file(path)


def test_raw_sidecar_hash_is_skipped_when_absent(tmp_path: Path) -> None:
    module = load_verify_repository()
    snapshot = tmp_path / "iina-plugins.json"
    snapshot.write_text("{}\n", encoding="utf-8")
    assert module.raw_sidecar_hash_violations(snapshot, "abc") == []


def test_raw_sidecar_hash_detects_mismatch(tmp_path: Path) -> None:
    module = load_verify_repository()
    snapshot = tmp_path / "iina-plugins.json"
    sidecar = tmp_path / "iina-plugins.raw.json"
    snapshot.write_text("{}\n", encoding="utf-8")
    sidecar.write_bytes(b"drifted")
    violations = module.raw_sidecar_hash_violations(snapshot, "0" * 64)
    assert len(violations) == 1
    assert "raw SHA-256 mismatch" in violations[0]


def test_raw_sidecar_hash_accepts_matching_bytes(tmp_path: Path) -> None:
    module = load_verify_repository()
    snapshot = tmp_path / "iina-plugins.json"
    sidecar = tmp_path / "iina-plugins.raw.json"
    payload = b'[{"id":"example"}]'
    snapshot.write_text("{}\n", encoding="utf-8")
    sidecar.write_bytes(payload)
    expected = hashlib.sha256(payload).hexdigest()
    assert module.raw_sidecar_hash_violations(snapshot, expected) == []


def test_committed_raw_plugin_index_matches_snapshot_sha256() -> None:
    module = load_verify_repository()
    snapshot_path = Path("src/awesome_iina/discovery/snapshots/iina-plugins.json")
    snapshot = load_source_snapshot(snapshot_path)
    assert module.raw_sidecar_hash_violations(snapshot_path, snapshot.sha256) == []
    module.verify_source_snapshots()


def test_verify_repository_surfaces_find_nested_tests() -> None:
    module = load_verify_repository()
    module.verify_repository_surfaces()


def test_verify_main_passes_on_this_repository(capsys) -> None:
    module = load_verify_repository()
    module.main()
    captured = capsys.readouterr()
    assert "repository integrity verified" in captured.out
