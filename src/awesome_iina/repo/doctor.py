from __future__ import annotations

import platform
import shutil
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Literal

Profile = Literal["core", "discovery", "media", "all"]
Status = Literal["ok", "warning", "error"]


@dataclass(frozen=True, slots=True)
class DoctorCheck:
    name: str
    status: Status
    required: bool
    detail: str
    remediation: str | None = None


@dataclass(frozen=True, slots=True)
class DoctorReport:
    profile: Profile
    root: str
    checks: list[DoctorCheck]

    @property
    def ok(self) -> bool:
        return not any(check.status == "error" for check in self.checks)


def _run_version(command: list[str], timeout: float = 5.0) -> tuple[bool, str]:
    try:
        process = subprocess.run(  # noqa: S603
            command,
            capture_output=True,
            text=True,
            timeout=timeout,
            check=False,
        )
    except (OSError, subprocess.TimeoutExpired) as error:
        return False, str(error)
    output = (process.stdout or process.stderr).strip().splitlines()
    detail = output[0] if output else f"exit {process.returncode}"
    return process.returncode == 0, detail


def _command_check(
    name: str,
    executable: str,
    version_arguments: list[str],
    *,
    required: bool,
    remediation: str,
) -> DoctorCheck:
    path = shutil.which(executable)
    if path is None:
        return DoctorCheck(
            name=name,
            status="error" if required else "warning",
            required=required,
            detail=f"{executable} is not installed or is not on PATH",
            remediation=remediation,
        )
    succeeded, version = _run_version([path, *version_arguments])
    return DoctorCheck(
        name=name,
        status="ok" if succeeded else ("error" if required else "warning"),
        required=required,
        detail=f"{path}: {version}",
        remediation=None if succeeded else remediation,
    )


def _file_check(root: Path, relative: str, *, required: bool = True) -> DoctorCheck:
    target = root / relative
    exists = target.is_file()
    return DoctorCheck(
        name=f"file:{relative}",
        status="ok" if exists else ("error" if required else "warning"),
        required=required,
        detail="present" if exists else "missing",
        remediation=None if exists else f"restore {relative}",
    )


def _python_check() -> DoctorCheck:
    version = sys.version_info
    supported = version >= (3, 13)
    return DoctorCheck(
        name="python",
        status="ok" if supported else "error",
        required=True,
        detail=f"{platform.python_implementation()} {platform.python_version()}",
        remediation=None if supported else "install Python 3.13 or newer",
    )


def _github_auth_check(required: bool) -> DoctorCheck:
    gh = shutil.which("gh")
    if gh is None:
        return DoctorCheck(
            name="github-auth",
            status="error" if required else "warning",
            required=required,
            detail="GitHub CLI is unavailable",
            remediation="install gh and run `gh auth login`",
        )
    succeeded, detail = _run_version([gh, "auth", "status"], timeout=10.0)
    return DoctorCheck(
        name="github-auth",
        status="ok" if succeeded else ("error" if required else "warning"),
        required=required,
        detail=detail,
        remediation=None if succeeded else "run `gh auth login` and grant repository-read access",
    )


def inspect_environment(root: Path, profile: Profile = "core") -> DoctorReport:
    """Inspect local prerequisites without modifying the environment."""

    root = root.resolve()
    if profile not in {"core", "discovery", "media", "all"}:
        raise ValueError(f"unsupported doctor profile: {profile}")

    checks: list[DoctorCheck] = [
        _python_check(),
        _file_check(root, "pyproject.toml"),
        _file_check(root, "uv.lock", required=False),
        _file_check(root, "src/awesome_iina/catalog/catalog.yaml"),
        _file_check(root, "src/awesome_iina/discovery/discovery.yaml"),
        _command_check(
            "uv",
            "uv",
            ["--version"],
            required=True,
            remediation="install uv from https://docs.astral.sh/uv/",
        ),
        _command_check(
            "git",
            "git",
            ["--version"],
            required=True,
            remediation="install Git",
        ),
        _command_check(
            "just",
            "just",
            ["--version"],
            required=False,
            remediation="install just for the documented task interface",
        ),
    ]

    if profile in {"discovery", "all"}:
        checks.extend(
            [
                _command_check(
                    "github-cli",
                    "gh",
                    ["--version"],
                    required=True,
                    remediation="install GitHub CLI from https://cli.github.com/",
                ),
                _github_auth_check(required=True),
            ]
        )
    else:
        checks.append(_github_auth_check(required=False))

    media_required = profile in {"media", "all"}
    checks.extend(
        [
            _command_check(
                "ffprobe",
                "ffprobe",
                ["-version"],
                required=media_required,
                remediation="install FFmpeg, for example `brew install ffmpeg`",
            ),
            _command_check(
                "mkvmerge",
                "mkvmerge",
                ["--version"],
                required=False,
                remediation="install MKVToolNix, for example `brew install mkvtoolnix`",
            ),
            _command_check(
                "mediainfo",
                "mediainfo",
                ["--Version"],
                required=False,
                remediation="install MediaInfo, for example `brew install mediainfo`",
            ),
        ]
    )

    return DoctorReport(profile=profile, root=str(root), checks=checks)
