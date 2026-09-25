#!/usr/bin/env python3
"""Plan, apply, verify or undo branding in an existing local repository.

Plan is read-only unless --output is explicitly supplied. Apply accepts the exact
reviewed plan and refuses intervening edits. No credentials or network are used.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from brandkit.core import BrandError, KIT_ROOT, atomic_write, json_bytes, read_json
from brandkit.install import apply_plan, check_receipt, create_plan, undo_receipt, recover_receipt


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)
    plan = sub.add_parser("plan", help="Preview changes without editing the target")
    plan.add_argument("--target", required=True, type=Path)
    plan.add_argument("--site-url", help="HTTPS directory URL, ending with /")
    plan.add_argument("--app-id", help="Explicit origin-relative application ID; keep an established identity on relocation")
    plan.add_argument("--include-legacy-hero", action="store_true", help="Opt in to copying the historical illustration; never selected in the README")
    plan.add_argument("--social", choices=("github", "opengraph"), default="github")
    plan.add_argument("--readme", default="README.md", help="Existing README or generator template")
    plan.add_argument("--rendered-readme", default="README.md", help="Path where its links will be rendered")
    plan.add_argument("--public-dir", default="", help="Use public for a framework public/ asset root")
    plan.add_argument("--replace-existing", action="store_true", help="Explicitly allow differing assets, with backups")
    plan.add_argument("--output", type=Path, help="Write the reviewable plan to this JSON file")
    apply = sub.add_parser("apply", help="Apply an exact, unchanged plan with backups")
    apply.add_argument("--plan", type=Path, required=True)
    for command in ("check", "undo", "recover"):
        p = sub.add_parser(command)
        p.add_argument("--receipt", type=Path, required=True)
    args = parser.parse_args()
    try:
        if args.command == "plan":
            options = vars(args).copy()
            options.pop("command")
            output = options.pop("output")
            result = create_plan(**options)
            if output:
                output = output.expanduser().absolute()
                target = Path(result["options"]["target"])
                if output.is_relative_to(target) or output.is_relative_to(KIT_ROOT):
                    raise BrandError("Write plans outside the target and kit to keep preview read-only")
                atomic_write(output, json_bytes(result))
            print(json_bytes(result).decode(), end="")
            return 2 if result["conflicts"] else 0
        if args.command == "apply":
            result = apply_plan(read_json(args.plan))
        elif args.command == "check":
            result = check_receipt(args.receipt.absolute())
        elif args.command == "undo":
            result = undo_receipt(args.receipt.absolute())
        else:
            result = recover_receipt(args.receipt.absolute())
        print(json.dumps(result, indent=2))
        return 2 if result.get("status") == "drift" else 0
    except (BrandError, OSError, ValueError, KeyError, TypeError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
