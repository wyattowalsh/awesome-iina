#!/usr/bin/env python3
"""Generate a site head and manifest without needing any font files or an image rebuild."""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from brandkit.core import BrandError, KIT_ROOT, atomic_write, read_json, render_site


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--site-url", help="HTTPS directory URL ending with /")
    p.add_argument("--app-id", help="Stable origin-relative ID; defaults to source/deployment.json, independent of --site-url")
    p.add_argument("--social", choices=("github", "opengraph"), default="github")
    p.add_argument("--output-dir", type=Path, help="Explicit output location; otherwise prints planned metadata")
    a = p.parse_args()
    try:
        url = a.site_url or read_json(KIT_ROOT / "source/deployment.json")["project_url"]
        payloads = render_site(KIT_ROOT, url, a.social, app_id=a.app_id)
        if a.output_dir:
            out = a.output_dir.resolve()
            if out.is_relative_to(KIT_ROOT / "archive") or out.is_relative_to(KIT_ROOT / "source"):
                raise BrandError("Do not replace archived evidence or source configuration with integration exports")
            for name, raw in payloads.items():
                target = out / name
                if target.exists() and target.read_bytes() != raw:
                    raise BrandError(f"Output exists and differs: {target}; select a new output directory")
            for name, raw in payloads.items():
                atomic_write(out / name, raw)
        print(payloads["deployment.json"].decode(), end="")
        return 0
    except (BrandError, OSError, ValueError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
