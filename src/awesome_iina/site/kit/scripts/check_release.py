#!/usr/bin/env python3
"""Offline source/asset integration sanity checks for the current release."""
from __future__ import annotations

import ast
import json
import re
from pathlib import Path
from urllib.parse import unquote, urlsplit

from brandkit.core import KIT_ROOT, asset_records, read_json, render_site, selected_asset_records


def check(root: Path) -> dict:
    errors = []
    python_files = list((root / "scripts").rglob("*.py")) + list((root / "tests").rglob("*.py"))
    for file in python_files:
        ast.parse(file.read_text(), filename=str(file.relative_to(root)))
    manifest = read_json(root / "ASSET-MANIFEST.json")
    release = read_json(root / "source/release.json")
    if manifest["release"] != release["revision"]:
        errors.append("Asset manifest release does not match source/release.json")
    assets = asset_records(root)
    selection = selected_asset_records(root)
    deployment = read_json(root / 'source/deployment.json')
    rendered = render_site(root, deployment['project_url'], deployment.get('social_variant', 'github'))
    for name, target in [('site.webmanifest','assets/brand/site.webmanifest'),('website-head.html','integration/website-head.html')]:
        if (root / target).read_bytes() != rendered[name]:
            errors.append(f'Configured output differs from its authoritative generator: {target}')
    # Current docs only: untouched historical audits may link to evidence not copied into v2.
    docs = list(root.glob("*.md")) + list((root / "docs").glob("*.md")) + list((root / "integration").glob("*.md"))
    links = 0
    for file in docs:
        if file.name == "REVIEW-PROMPT.md":
            continue
        text = re.sub(r"```.*?```", "", file.read_text(), flags=re.S)
        for target in re.findall(r"\[[^\]]+\]\(([^\s)]+)\)", text):
            if urlsplit(target).scheme or target.startswith(("#", "//")):
                continue
            target = unquote(target.split("#", 1)[0])
            links += 1
            if not (file.parent / target).is_file():
                errors.append(f"Broken local doc link: {file.relative_to(root)} -> {target}")
    return {"status": "passed" if not errors else "failed", "kit_revision": release["revision"],
            "python_files_parsed": len(python_files), "production_assets_verified": len(assets),
            "current_document_links_checked": links, "primary_delivery_assets": len(selection), "errors": errors,
            "scope": "Offline current-release structure and asset hashes; not external links or deployment"}


if __name__ == "__main__":
    report = check(KIT_ROOT)
    print(json.dumps(report, indent=2))
    raise SystemExit(0 if report["status"] == "passed" else 1)
