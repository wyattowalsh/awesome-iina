#!/usr/bin/env python3
"""Explicit entrypoints for the embedded Copier project. No implicit trust or publication."""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
STARTER = ROOT / "starter"
PRESETS = ("command", "sidebar", "overlay", "controller")


def verify_wrapper(root: Path = ROOT) -> None:
    """Check the tiny include wrapper without implementing Copier's YAML loader."""
    documents = list(yaml.compose_all((root / "copier.yml").read_text(encoding="utf-8")))
    if len(documents) != 2:
        raise ValueError("root copier.yml must have exactly an include and a subdirectory override")
    include, override = documents
    if not isinstance(include, yaml.ScalarNode) or include.tag != "!include":
        raise ValueError("root Copier entrypoint must include the canonical questionnaire")
    if include.value != "starter/copier.yml":
        raise ValueError("unexpected questionnaire include")
    if not isinstance(override, yaml.MappingNode) or len(override.value) != 1:
        raise ValueError("only _subdirectory may be overridden at the root")
    key, value = override.value[0]
    if key.value != "_subdirectory" or value.value != "starter/template":
        raise ValueError("root Copier template directory mismatch")


def toolchain() -> dict[str, str]:
    return json.loads((STARTER / "toolchain.json").read_text(encoding="utf-8"))


def copy_command(args: argparse.Namespace) -> list[str]:
    """Build shell-free argv. Copier's own validators remain the answer authority."""
    destination = Path(args.destination).expanduser().resolve()
    if destination == ROOT or destination.is_relative_to(ROOT) or ROOT.is_relative_to(destination):
        raise ValueError(
            "create the consumer in a separate directory outside this source repository"
        )
    if destination.exists():
        raise ValueError("destination already exists; this command will not overwrite a consumer")
    if not args.ref or args.ref.startswith("-"):
        raise ValueError("an explicit tag or commit reference is required")
    command = [
        "uvx",
        "--from",
        f"copier=={toolchain()['copier']}",
        "copier",
        "copy",
        "--vcs-ref",
        args.ref,
    ]
    if args.defaults:
        command.append("--defaults")
    for key, value in (
        ("preset", args.preset),
        ("preferences", args.preferences),
        ("docs_profile", args.docs),
        ("hooks", args.hooks),
        ("plugin_name", args.name),
        ("plugin_slug", args.slug),
        ("plugin_identifier", args.identifier),
        ("user_name", args.author),
    ):
        if value is not None:
            command.extend(["--data", f"{key}={value}"])
    command.extend([str(ROOT), str(destination)])
    return command


def require_committed_source(ref: str) -> None:
    """Do not silently pin generated projects to a transient, dirty, or parent checkout."""

    def git(*args: str) -> str:
        return subprocess.run(  # noqa: S603
            ["git", *args],  # noqa: S607
            cwd=ROOT,
            check=True,
            text=True,
            capture_output=True,
            timeout=20,
        ).stdout.strip()

    if Path(git("rev-parse", "--show-toplevel")).resolve() != ROOT:
        raise ValueError("initialize this extracted repository itself, not an ancestor directory")
    if git("status", "--porcelain", "--untracked-files=all"):
        raise ValueError(
            "commit the reviewed template source before generating updateable consumers"
        )
    git("rev-parse", "--verify", f"{ref}^{{commit}}")
    git("cat-file", "-e", f"{ref}:copier.yml")
    git("cat-file", "-e", f"{ref}:starter/template/package.json.jinja")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    commands.add_parser("describe", help="show profiles and selected versions; no installation")
    commands.add_parser(
        "verify", help="validate source contracts with offline fixtures; not Copier"
    )
    new = commands.add_parser(
        "new", help="generate through real Copier from a committed source ref"
    )
    new.add_argument("destination")
    new.add_argument("--ref", required=True, help="reviewed local Git tag or commit, e.g. HEAD")
    new.add_argument("--preset", choices=PRESETS, default="command")
    new.add_argument("--preferences", choices=("true", "false"), default="false")
    new.add_argument("--docs", choices=("markdown", "starlight"), default="markdown")
    new.add_argument("--hooks", choices=("true", "false"), default="false")
    for flag in ("name", "slug", "identifier", "author"):
        new.add_argument(f"--{flag}")
    new.add_argument("--defaults", action="store_true", help="accept unanswered defaults")
    new.add_argument(
        "--dry-run", action="store_true", help="print argv only, do not install or create"
    )
    args = parser.parse_args(argv)
    try:
        verify_wrapper()
        if args.command == "describe":
            print(
                json.dumps(
                    {
                        "template": str(STARTER),
                        "presets": PRESETS,
                        "selected_toolchain": toolchain(),
                        "automatic_tasks": False,
                        "native_verification": "separate required acceptance gate",
                    },
                    indent=2,
                )
            )
        elif args.command == "verify":
            subprocess.run(  # noqa: S603
                [sys.executable, str(STARTER / "tools/verify_source.py")],
                cwd=STARTER,
                check=True,
                timeout=180,
            )
        else:
            command = copy_command(args)
            if args.dry_run:
                print(json.dumps({"argv": command, "executed": False}, indent=2))
            else:
                require_committed_source(args.ref)
                # Interactive operation: no timeout, shell, --trust, or overwrite escalation.
                subprocess.run(command, cwd=ROOT, check=True)  # noqa: S603
        return 0
    except (OSError, ValueError, subprocess.SubprocessError) as error:
        print(f"starter: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
