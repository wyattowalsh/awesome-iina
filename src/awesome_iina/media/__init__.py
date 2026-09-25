from __future__ import annotations

import json
import shutil
import subprocess
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from awesome_iina.models import MediaReport, MediaTrack, ToolAvailability

_TOOL_COMMANDS: dict[str, tuple[str, ...]] = {
    "ffprobe": ("ffprobe", "-version"),
    "mediainfo": ("mediainfo", "--Version"),
    "mkvmerge": ("mkvmerge", "--version"),
    "mkvinfo": ("mkvinfo", "--version"),
    "exiftool": ("exiftool", "-ver"),
}


class MediaInspectionError(RuntimeError):
    """Raised when no supported inspector can read a media file."""


def _run(command: list[str], *, timeout: int = 120) -> subprocess.CompletedProcess[str]:
    return subprocess.run(  # noqa: S603
        command,
        text=True,
        capture_output=True,
        check=False,
        timeout=timeout,
    )


def tool_availability() -> list[ToolAvailability]:
    tools: list[ToolAvailability] = []
    for name, version_command in _TOOL_COMMANDS.items():
        executable = shutil.which(version_command[0])
        if not executable:
            tools.append(ToolAvailability(name=name, available=False))
            continue
        process = _run([executable, *version_command[1:]], timeout=15)
        combined = (process.stdout or process.stderr).strip().splitlines()
        version = combined[0].strip() if combined else None
        tools.append(
            ToolAvailability(
                name=name,
                executable=executable,
                available=process.returncode == 0,
                version=version,
            )
        )
    return tools


def _rational(value: str | None) -> str | None:
    if not value or value in {"0/0", "N/A"}:
        return None
    return value


def _integer(value: Any) -> int | None:
    if value in {None, "", "N/A"}:
        return None
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def _float(value: Any) -> float | None:
    if value in {None, "", "N/A"}:
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _hdr_markers(stream: dict[str, Any]) -> list[str]:
    markers: set[str] = set()
    transfer = str(stream.get("color_transfer") or "").casefold()
    if transfer == "smpte2084":
        markers.add("HDR10/PQ")
    elif transfer == "arib-std-b67":
        markers.add("HLG")
    for side_data in stream.get("side_data_list") or []:
        side_type = str(side_data.get("side_data_type") or "").casefold()
        if "dovi" in side_type or "dolby vision" in side_type:
            markers.add("Dolby Vision")
        if "hdr dynamic metadata" in side_type or "hdr10+" in side_type:
            markers.add("HDR10+")
        if "mastering display metadata" in side_type:
            markers.add("Mastering display metadata")
        if "content light level" in side_type:
            markers.add("Content light metadata")
    return sorted(markers)


def parse_ffprobe(payload: dict[str, Any]) -> tuple[list[MediaTrack], dict[str, Any]]:
    tracks: list[MediaTrack] = []
    attachments = 0
    for stream in payload.get("streams") or []:
        disposition = stream.get("disposition") or {}
        tags = stream.get("tags") or {}
        kind = str(stream.get("codec_type") or "unknown")
        if kind == "attachment":
            attachments += 1
        tracks.append(
            MediaTrack(
                index=int(stream.get("index", len(tracks))),
                kind=kind,
                codec=stream.get("codec_name"),
                codec_long_name=stream.get("codec_long_name"),
                language=tags.get("language"),
                title=tags.get("title"),
                default=bool(disposition.get("default")) if disposition else None,
                forced=bool(disposition.get("forced")) if disposition else None,
                width=_integer(stream.get("width")),
                height=_integer(stream.get("height")),
                frame_rate=_rational(stream.get("avg_frame_rate") or stream.get("r_frame_rate")),
                channels=_integer(stream.get("channels")),
                channel_layout=stream.get("channel_layout"),
                sample_rate=_integer(stream.get("sample_rate")),
                bit_rate=_integer(stream.get("bit_rate")),
                pixel_format=stream.get("pix_fmt"),
                color_space=stream.get("color_space"),
                color_transfer=stream.get("color_transfer"),
                color_primaries=stream.get("color_primaries"),
                hdr=_hdr_markers(stream),
            )
        )
    format_data = payload.get("format") or {}
    summary = {
        "container": format_data.get("format_long_name") or format_data.get("format_name"),
        "duration_seconds": _float(format_data.get("duration")),
        "overall_bit_rate": _integer(format_data.get("bit_rate")),
        "chapters": len(payload.get("chapters") or []),
        "attachments": attachments,
    }
    return tracks, summary


def _json_command(executable: str, args: list[str]) -> tuple[dict[str, Any] | None, str | None]:
    process = _run([executable, *args])
    if process.returncode != 0:
        return None, (process.stderr or process.stdout).strip()
    try:
        payload = json.loads(process.stdout)
    except json.JSONDecodeError:
        return None, "tool returned invalid JSON"
    if not isinstance(payload, dict):
        return None, "tool returned a non-object JSON document"
    return payload, None


def inspect_media(path: Path) -> MediaReport:
    resolved = path.expanduser().resolve()
    if not resolved.is_file():
        raise FileNotFoundError(resolved)

    tools = tool_availability()
    executables = {
        tool.name: tool.executable for tool in tools if tool.available and tool.executable
    }
    raw: dict[str, Any] = {}
    warnings: list[str] = []
    tracks: list[MediaTrack] = []
    summary: dict[str, Any] = {}

    if ffprobe := executables.get("ffprobe"):
        payload, error = _json_command(
            ffprobe,
            [
                "-v",
                "error",
                "-show_format",
                "-show_streams",
                "-show_chapters",
                "-show_programs",
                "-print_format",
                "json",
                str(resolved),
            ],
        )
        if payload:
            raw["ffprobe"] = payload
            tracks, summary = parse_ffprobe(payload)
        elif error:
            warnings.append(f"ffprobe: {error}")

    if mediainfo := executables.get("mediainfo"):
        payload, error = _json_command(mediainfo, ["--Output=JSON", str(resolved)])
        if payload:
            raw["mediainfo"] = payload
        elif error:
            warnings.append(f"mediainfo: {error}")

    if mkvmerge := executables.get("mkvmerge"):
        payload, error = _json_command(
            mkvmerge,
            ["--identify", "--identification-format", "json", str(resolved)],
        )
        if payload:
            raw["mkvmerge"] = payload
            if not summary.get("container"):
                summary["container"] = (
                    (payload.get("container") or {}).get("properties", {}).get("container_type")
                )
            summary["attachments"] = max(
                int(summary.get("attachments") or 0),
                len(payload.get("attachments") or []),
            )
            summary["chapters"] = max(
                int(summary.get("chapters") or 0),
                len(payload.get("chapters") or []),
            )
        elif error:
            warnings.append(f"mkvmerge: {error}")

    if mkvinfo := executables.get("mkvinfo"):
        process = _run([mkvinfo, str(resolved)])
        if process.returncode == 0:
            output = process.stdout
            maximum = 2_000_000
            if len(output) > maximum:
                output = output[:maximum] + "\n... output truncated ...\n"
                warnings.append("mkvinfo output exceeded 2 MB and was truncated")
            raw["mkvinfo"] = output
        else:
            warnings.append(f"mkvinfo: {(process.stderr or process.stdout).strip()}")

    if not raw:
        raise MediaInspectionError(
            "No available tool could inspect the file. Install ffmpeg, mediainfo, or mkvtoolnix."
        )

    return MediaReport(
        generated_at=datetime.now(UTC),
        path=str(resolved),
        size_bytes=resolved.stat().st_size,
        suffix=resolved.suffix.casefold(),
        container=summary.get("container"),
        duration_seconds=summary.get("duration_seconds"),
        overall_bit_rate=summary.get("overall_bit_rate"),
        tracks=tracks,
        chapters=int(summary.get("chapters") or 0),
        attachments=int(summary.get("attachments") or 0),
        tools=tools,
        raw=raw,
        warnings=warnings,
    )
