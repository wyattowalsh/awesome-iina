#!/usr/bin/env python3
"""Build Copier 9.18.2 argv for iina-generate. describe/plan only; never execute Copier."""

from __future__ import annotations

import argparse
import json
import re
import shlex
import sys
from pathlib import Path
from typing import Any

COPIER = "9.18.2"
SUBCOMMANDS = frozenset({"describe", "plan"})
SOURCES = frozenset({"git", "zip", "path"})
ALLOWED_KEYS = frozenset(
    {"source", "url", "path", "vcs_ref", "destination", "data_file", "pretend"}
)
MISSING_GIT_ERROR = "initialize git and tag the source before Copier copy"
FORBIDDEN_FLAGS = ("--trust", "--UNSAFE", "--overwrite")

_GH_SHORT = re.compile(r"^gh:([^/]+)/([^/]+?)(?:\.git)?/?$")
_GH_HTTPS = re.compile(
    r"^https://github\.com/([^/]+)/([^/]+?)(?:\.git)?/?$",
    re.IGNORECASE,
)
_PEP440_PRERELEASE = re.compile(
    r"""
    ^(?:v)?
    (?:\d+!)?
    \d+(?:\.\d+)*
    (?:a|b|rc|alpha|beta)\d*
    (?:\.post\d+)?
    (?:\.dev\d+)?
    $
    """,
    re.IGNORECASE | re.VERBOSE,
)


def looks_prerelease(vcs_ref: str) -> bool:
    """True iff vcs_ref is a PEP 440 version with a/b/rc/alpha/beta fragments."""
    return _PEP440_PRERELEASE.fullmatch(vcs_ref.strip()) is not None


def normalize_git_url(url: str) -> str | None:
    """Accept gh:owner/repo or https://github.com/owner/repo.git; emit gh:owner/repo."""
    text = url.strip()
    match = _GH_SHORT.fullmatch(text) or _GH_HTTPS.fullmatch(text)
    if match is None:
        return None
    owner = match.group(1)
    repo  = match.group(2)
    if not owner or not repo:
        return None
    return f"gh:{owner}/{repo}"


def build_argv(
    *,
    source_ref: str,
    destination: str,
    vcs_ref: str,
    data_file: str | None,
    pretend: bool,
) -> list[str]:
    """Exact Copier argv. Never emits --trust, --UNSAFE, --overwrite, or git init."""
    argv = [
        "uvx",
        "--from",
        f"copier=={COPIER}",
        "copier",
        "copy",
        "--vcs-ref",
        vcs_ref,
    ]
    if looks_prerelease(vcs_ref):
        argv.append("--prereleases")
    if data_file:
        argv.extend(["--data-file", data_file])
    if pretend:
        argv.append("--pretend")
    argv.extend([source_ref, destination])
    return argv


def _fail(error: str, notes: list[str] | None = None) -> dict[str, Any]:
    return {
        "ok":     False,
        "layout": None,
        "copier": COPIER,
        "argv":   None,
        "error":  error,
        "notes":  list(notes or []),
    }


def _ok(layout: str, argv: list[str], notes: list[str] | None = None) -> dict[str, Any]:
    return {
        "ok":     True,
        "layout": layout,
        "copier": COPIER,
        "argv":   argv,
        "notes":  list(notes or []),
    }


def _subdirectory(copier_yml: Path) -> str | None:
    try:
        text = copier_yml.read_text(encoding="utf-8")
    except OSError:
        return None
    for raw in text.splitlines():
        stripped = raw.strip()
        if not stripped or stripped.startswith("#"):
            continue
        if stripped.startswith("_subdirectory:"):
            value = stripped.split(":", 1)[1].split("#", 1)[0].strip().strip("'\"")
            return value or None
    return None


def detect_layout(src: Path) -> str | None:
    """Read-only: plugin-root vs nested-template. None if neither contract matches."""
    copier_yml = src / "copier.yml"
    if copier_yml.is_file() and _subdirectory(copier_yml) == "template":
        return "plugin-root"
    nested_config = src / "template" / "copier.yml"
    if nested_config.is_file() or (src / "Info.json.jinja").is_file():
        return "nested-template"
    return None


def _has_git(path: Path) -> bool:
    return (path / ".git").exists()


def _validate(payload: dict[str, Any]) -> str | None:
    extra = set(payload) - ALLOWED_KEYS
    if extra:
        keys = ", ".join(sorted(extra))
        return f"unknown fields: {keys}"
    missing = [key for key in ("source", "vcs_ref", "destination") if key not in payload]
    if missing:
        return f"missing fields: {', '.join(missing)}"
    source = payload.get("source")
    if source not in SOURCES:
        return "source must be git, zip, or path"
    vcs_ref = payload.get("vcs_ref")
    if not isinstance(vcs_ref, str) or not vcs_ref.strip():
        return "vcs_ref must be a non-empty string"
    destination = payload.get("destination")
    if not isinstance(destination, str) or not destination.strip():
        return "destination must be a non-empty string"
    if "url" in payload and not isinstance(payload["url"], str):
        return "url must be a string"
    if "path" in payload and not isinstance(payload["path"], str):
        return "path must be a string"
    if "data_file" in payload and not isinstance(payload["data_file"], str):
        return "data_file must be a string"
    if "pretend" in payload and not isinstance(payload["pretend"], bool):
        return "pretend must be a boolean"
    return None


def describe(payload: dict[str, Any]) -> dict[str, Any]:
    """Return argv JSON. No Copier exec, mkdir, git, or network."""
    error = _validate(payload)
    if error:
        return _fail(error)

    source      = payload["source"]
    vcs_ref     = payload["vcs_ref"].strip()
    destination = payload["destination"].strip()
    data_file   = payload.get("data_file") or None
    if isinstance(data_file, str):
        data_file = data_file.strip() or None
    pretend = payload.get("pretend") is True
    raw_path = payload.get("path")
    layout_src: Path | None = None
    source_ref: str

    if source == "git":
        raw_url = payload.get("url")
        if not isinstance(raw_url, str) or not raw_url.strip():
            return _fail("git source requires url")
        normalized = normalize_git_url(raw_url)
        if normalized is None:
            return _fail("git source requires gh:owner/repo or a GitHub HTTPS URL")
        source_ref = normalized
        if isinstance(raw_path, str) and raw_path.strip():
            layout_src = Path(raw_path.strip())
            layout = detect_layout(layout_src)
            if layout is None:
                return _fail("cannot detect plugin-root or nested-template layout")
        else:
            layout = "plugin-root"
    else:
        if not isinstance(raw_path, str) or not raw_path.strip():
            return _fail("zip/path source requires path")
        layout_src = Path(raw_path.strip())
        if not _has_git(layout_src):
            return _fail(MISSING_GIT_ERROR)
        layout = detect_layout(layout_src)
        if layout is None:
            return _fail("cannot detect plugin-root or nested-template layout")
        source_ref = raw_path.strip()

    argv = build_argv(
        source_ref  = source_ref,
        destination = destination,
        vcs_ref     = vcs_ref,
        data_file   = data_file,
        pretend     = pretend,
    )
    for flag in FORBIDDEN_FLAGS:
        if flag in argv:
            return _fail(f"internal argv produced forbidden flag {flag}")
    for index, token in enumerate(argv[:-1]):
        if token == "git" and argv[index + 1] == "init":
            return _fail("internal argv produced git init")
    return _ok(layout, argv)


def plan(payload: dict[str, Any]) -> dict[str, Any]:
    """describe plus a human shell line. Still no exec."""
    result = describe(payload)
    argv = result.get("argv")
    result["human"] = shlex.join(argv) if isinstance(argv, list) else ""
    return result


def _load_payload(args: list[str]) -> dict[str, Any]:
    if not args or args[0] == "-":
        raw = sys.stdin.read()
    else:
        raw = args[0]
        if not raw.lstrip().startswith("{") and Path(raw).is_file():
            raw = Path(raw).read_text(encoding="utf-8")
    try:
        payload = json.loads(raw)
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON: {exc.msg}") from exc
    if not isinstance(payload, dict):
        raise ValueError("payload must be a JSON object")
    return payload


def _build_parser() -> argparse.ArgumentParser:
    """Human help only. Subcommand routing stays outside parse_args."""
    parser = argparse.ArgumentParser(
        prog="copy_argv.py",
        usage="%(prog)s [-h] {describe,plan} [PAYLOAD]",
        description=(
            "Build Copier 9.18.2 argv for iina-generate. "
            "describe/plan only; never execute Copier."
        ),
        epilog=(
            "PAYLOAD may be a JSON object string, '-' (stdin), or a file path. "
            "Never emits --trust, --UNSAFE, or --overwrite."
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "subcommand",
        nargs="?",
        metavar="{describe,plan}",
        help="describe (argv JSON) or plan (argv JSON plus human shell line)",
    )
    parser.add_argument(
        "payload",
        nargs="?",
        metavar="PAYLOAD",
        help="JSON object string, '-' for stdin, or a file path",
    )
    return parser


def _emit_json(result: dict[str, Any]) -> None:
    json.dump(result, sys.stdout, indent=2)
    sys.stdout.write("\n")


def main(argv: list[str] | None = None) -> int:
    args = list(sys.argv[1:] if argv is None else argv)
    parser = _build_parser()

    # Top-level help via argparse text; never SystemExit into callers.
    if args and args[0] in ("-h", "--help"):
        parser.print_help(sys.stdout)
        return 0

    # Unknown / missing subcommand: existing JSON contract (not argparse errors).
    if not args or args[0] not in SUBCOMMANDS:
        _emit_json(_fail("unsupported subcommand; use describe or plan"))
        return 2

    command = args[0]
    try:
        payload = _load_payload(args[1:])
    except ValueError as exc:
        result: dict[str, Any] = _fail(str(exc))
        if command == "plan":
            result["human"] = ""
        _emit_json(result)
        return 1
    result = plan(payload) if command == "plan" else describe(payload)
    _emit_json(result)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
