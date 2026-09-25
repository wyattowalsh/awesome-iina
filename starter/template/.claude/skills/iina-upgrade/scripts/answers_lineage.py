#!/usr/bin/env python3
"""Read-only Copier answers lineage for a generated IINA plugin repo.

Never runs Copier, never writes, never uses the network. One positional argv:
the generated IINA plugin repo. Stdout is JSON
``{ok, reason, src_path, vcs_ref, unsafe}``.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import TypedDict, cast

import yaml

ANSWERS_NAME = ".copier-answers.yml"
FIXTURE_REASON = "fixture _src_path is not a Copier source (git URL or ZIP)"
UNSAFE_KEYS = ("_tasks", "_migrations", "_jinja_extensions")


class Lineage(TypedDict):
    ok: bool
    reason: str | None
    src_path: str | None
    vcs_ref: str | None
    unsafe: bool


def _lineage(
    *,
    ok: bool,
    reason: str | None,
    src_path: str | None,
    vcs_ref: str | None,
    unsafe: bool,
) -> Lineage:
    return {
        "ok":       ok,
        "reason":   reason,
        "src_path": src_path,
        "vcs_ref":  vcs_ref,
        "unsafe":   unsafe,
    }


def _as_text(value: object) -> str | None:
    if isinstance(value, str):
        text = value.strip()
        return text or None
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        return str(value)
    return None


def _is_fixture(src_path: str) -> bool:
    normalized = src_path.replace("\\", "/").casefold()
    return "tests/fixtures" in normalized or "fixture" in normalized


def _executable_surface(value: object) -> bool:
    if value is None or value is False:
        return False
    if isinstance(value, str):
        return bool(value.strip())
    if isinstance(value, (list, tuple, dict, set)):
        return len(value) > 0
    return True


def _unsafe_from_answers(data: dict[str, object]) -> bool:
    return any(_executable_surface(data.get(key)) for key in UNSAFE_KEYS)


def _load_mapping(text: str) -> dict[str, object] | None:
    try:
        loaded = yaml.safe_load(text)
    except yaml.YAMLError:
        return None
    if not isinstance(loaded, dict):
        return None
    return cast(dict[str, object], loaded)


def read_lineage(repo: Path) -> Lineage:
    answers = Path(repo) / ANSWERS_NAME
    if not answers.is_file():
        return _lineage(
            ok=False,
            reason="missing .copier-answers.yml",
            src_path=None,
            vcs_ref=None,
            unsafe=False,
        )
    try:
        text = answers.read_text(encoding="utf-8")
    except OSError:
        return _lineage(
            ok=False,
            reason="unreadable .copier-answers.yml",
            src_path=None,
            vcs_ref=None,
            unsafe=False,
        )
    data = _load_mapping(text)
    if data is None:
        return _lineage(
            ok=False,
            reason="unreadable .copier-answers.yml",
            src_path=None,
            vcs_ref=None,
            unsafe=False,
        )
    unsafe   = _unsafe_from_answers(data)
    src_path = _as_text(data.get("_src_path"))
    vcs_ref  = _as_text(data.get("_commit"))
    if src_path is None:
        return _lineage(
            ok=False,
            reason="empty _src_path",
            src_path=None,
            vcs_ref=None,
            unsafe=unsafe,
        )
    if _is_fixture(src_path):
        return _lineage(
            ok=False,
            reason=FIXTURE_REASON,
            src_path=None,
            vcs_ref=None,
            unsafe=unsafe,
        )
    return _lineage(
        ok=True,
        reason=None,
        src_path=src_path,
        vcs_ref=vcs_ref,
        unsafe=unsafe,
    )


def _build_parser() -> argparse.ArgumentParser:
    """Human help only. Positional routing stays outside parse_args."""
    parser = argparse.ArgumentParser(
        prog="answers_lineage.py",
        description=(
            "Read-only Copier answers lineage for a generated IINA plugin repo. "
            "Never runs Copier, never writes, never uses the network."
        ),
        epilog=(
            "Stdout is JSON {ok, reason, src_path, vcs_ref, unsafe}. "
            "Wrong arity keeps that JSON contract (exit 2)."
        ),
    )
    parser.add_argument(
        "repo",
        metavar="REPO",
        help="path to the generated IINA plugin repo",
    )
    return parser


def main(argv: list[str] | None = None) -> int:
    args = list(sys.argv[1:] if argv is None else argv)
    parser = _build_parser()

    # Top-level help via argparse text; never SystemExit into callers.
    if args and args[0] in ("-h", "--help"):
        parser.print_help(sys.stdout)
        return 0

    # Wrong arity: existing JSON contract (not argparse errors).
    if len(args) != 1:
        payload = _lineage(
            ok=False,
            reason="expected one generated IINA plugin repo path",
            src_path=None,
            vcs_ref=None,
            unsafe=False,
        )
        print(json.dumps(payload), flush=True)
        return 2
    print(json.dumps(read_lineage(Path(args[0]))), flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
