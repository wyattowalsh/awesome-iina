from __future__ import annotations

from pathlib import Path
from typing import Any, cast

import pytest

from awesome_iina.repo import doctor


def create_required_files(root: Path) -> None:
    for relative in (
        "pyproject.toml",
        "uv.lock",
        "src/awesome_iina/catalog/catalog.yaml",
        "src/awesome_iina/discovery/discovery.yaml",
    ):
        path = root / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text("test\n")


def test_core_doctor_succeeds_with_required_commands(
    tmp_path: Path,
    monkeypatch,
) -> None:
    create_required_files(tmp_path)

    monkeypatch.setattr(doctor.shutil, "which", lambda name: f"/bin/{name}")
    monkeypatch.setattr(doctor, "_run_version", lambda command, timeout=5.0: (True, "ok"))

    report = doctor.inspect_environment(tmp_path, "core")

    assert report.ok
    assert any(check.name == "ffprobe" for check in report.checks)


def test_discovery_doctor_requires_authenticated_gh(
    tmp_path: Path,
    monkeypatch,
) -> None:
    create_required_files(tmp_path)

    monkeypatch.setattr(
        doctor.shutil,
        "which",
        lambda name: None if name == "gh" else f"/bin/{name}",
    )
    monkeypatch.setattr(doctor, "_run_version", lambda command, timeout=5.0: (True, "ok"))

    report = doctor.inspect_environment(tmp_path, "discovery")

    assert not report.ok
    assert any(check.name == "github-cli" and check.status == "error" for check in report.checks)


def test_media_doctor_requires_ffprobe_for_media_profile(
    tmp_path: Path,
    monkeypatch,
) -> None:
    create_required_files(tmp_path)
    monkeypatch.setattr(
        doctor.shutil,
        "which",
        lambda name: None if name == "ffprobe" else f"/bin/{name}",
    )
    monkeypatch.setattr(doctor, "_run_version", lambda command, timeout=5.0: (True, "ok"))

    report = doctor.inspect_environment(tmp_path, "media")

    assert not report.ok
    assert any(check.name == "ffprobe" and check.required for check in report.checks)


def test_run_version_reports_process_failure_and_os_error(monkeypatch) -> None:
    class Process:
        returncode = 2
        stdout = ""
        stderr = "failed\nmore"

    monkeypatch.setattr(doctor.subprocess, "run", lambda *args, **kwargs: Process())
    assert doctor._run_version(["tool"])[0] is False
    assert doctor._run_version(["tool"])[1] == "failed"

    def raise_error(*args, **kwargs):
        raise OSError("missing")

    monkeypatch.setattr(doctor.subprocess, "run", raise_error)
    assert doctor._run_version(["tool"]) == (False, "missing")


def test_doctor_rejects_unknown_profile(tmp_path: Path) -> None:
    with pytest.raises(ValueError, match="unsupported"):
        doctor.inspect_environment(tmp_path, cast(Any, "invalid"))
