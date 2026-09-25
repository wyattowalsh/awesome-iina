from __future__ import annotations

import json
import subprocess
from pathlib import Path
from typing import Any

import pytest

from awesome_iina.media import (
    MediaInspectionError,
    _float,
    _integer,
    _json_command,
    _rational,
    inspect_media,
    parse_ffprobe,
    tool_availability,
)
from awesome_iina.models import ToolAvailability


def test_parse_ffprobe_normalizes_tracks_and_hdr() -> None:
    payload = json.loads(Path("tests/fixtures/ffprobe.json").read_text())
    tracks, summary = parse_ffprobe(payload)
    assert summary["container"] == "Matroska / WebM"
    assert summary["chapters"] == 2
    assert summary["attachments"] == 1
    assert summary["duration_seconds"] == 7265.125
    video = tracks[0]
    assert video.width == 3840
    assert video.frame_rate == "24000/1001"
    assert "HDR10/PQ" in video.hdr
    assert "Dolby Vision" in video.hdr
    audio = tracks[1]
    assert audio.channels == 6
    assert audio.sample_rate == 48000
    subtitle = tracks[2]
    assert subtitle.forced is True


def test_scalar_parsers() -> None:
    assert _integer("42") == 42
    assert _integer("N/A") is None
    assert _integer("x") is None
    assert _float("1.5") == 1.5
    assert _float("x") is None
    assert _rational("24000/1001") == "24000/1001"
    assert _rational("0/0") is None


def test_tool_availability(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(
        "awesome_iina.media.shutil.which",
        lambda name: f"/usr/bin/{name}" if name == "ffprobe" else None,
    )
    monkeypatch.setattr(
        "awesome_iina.media._run",
        lambda command, timeout=120: subprocess.CompletedProcess(
            command,
            0,
            stdout="ffprobe version test\n",
            stderr="",
        ),
    )
    tools = tool_availability()
    ffprobe = next(tool for tool in tools if tool.name == "ffprobe")
    assert ffprobe.available is True
    assert ffprobe.version == "ffprobe version test"
    assert sum(tool.available for tool in tools) == 1


def test_json_command_success_and_errors(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(
        "awesome_iina.media._run",
        lambda command: subprocess.CompletedProcess(command, 0, stdout='{"ok": true}', stderr=""),
    )
    assert _json_command("tool", ["arg"]) == ({"ok": True}, None)

    monkeypatch.setattr(
        "awesome_iina.media._run",
        lambda command: subprocess.CompletedProcess(command, 1, stdout="", stderr="failed"),
    )
    assert _json_command("tool", ["arg"]) == (None, "failed")

    monkeypatch.setattr(
        "awesome_iina.media._run",
        lambda command: subprocess.CompletedProcess(command, 0, stdout="[]", stderr=""),
    )
    assert _json_command("tool", ["arg"])[1] == "tool returned a non-object JSON document"


def test_inspect_media_combines_tools(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    media = tmp_path / "fixture.mkv"
    media.write_bytes(b"matroska")
    ffprobe = json.loads(Path("tests/fixtures/ffprobe.json").read_text())
    tools = [
        ToolAvailability(name="ffprobe", executable="ffprobe", available=True, version="test"),
        ToolAvailability(name="mediainfo", executable="mediainfo", available=True, version="test"),
        ToolAvailability(name="mkvmerge", executable="mkvmerge", available=True, version="test"),
        ToolAvailability(name="mkvinfo", executable="mkvinfo", available=True, version="test"),
    ]
    monkeypatch.setattr("awesome_iina.media.tool_availability", lambda: tools)

    def fake_json(executable: str, args: list[str]) -> tuple[dict[str, Any] | None, str | None]:
        del args
        if executable == "ffprobe":
            return ffprobe, None
        if executable == "mediainfo":
            return {"media": {"track": []}}, None
        if executable == "mkvmerge":
            return {
                "container": {"properties": {"container_type": "Matroska"}},
                "attachments": [{"id": 1}, {"id": 2}],
                "chapters": [{"id": 1}],
            }, None
        return None, "unexpected"

    monkeypatch.setattr("awesome_iina.media._json_command", fake_json)
    monkeypatch.setattr(
        "awesome_iina.media._run",
        lambda command: subprocess.CompletedProcess(command, 0, stdout="EBML tree", stderr=""),
    )
    report = inspect_media(media)
    assert report.container == "Matroska / WebM"
    assert report.attachments == 2
    assert report.chapters == 2
    assert set(report.raw) == {"ffprobe", "mediainfo", "mkvmerge", "mkvinfo"}


def test_inspect_media_requires_file(tmp_path: Path) -> None:
    with pytest.raises(FileNotFoundError):
        inspect_media(tmp_path / "missing.mkv")


def test_inspect_media_requires_working_tool(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    media = tmp_path / "fixture.mkv"
    media.write_bytes(b"x")
    monkeypatch.setattr("awesome_iina.media.tool_availability", list)
    with pytest.raises(MediaInspectionError):
        inspect_media(media)
