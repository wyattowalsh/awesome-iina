#!/usr/bin/env python3
"""Verify packaged image hashes, dimensions, alpha state, ICO frames and links."""
from __future__ import annotations

import hashlib
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.references = []

    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if name in {"href", "src"} and value:
                self.references.append(value)


def main() -> None:
    manifest = json.loads((ROOT / "ASSET-MANIFEST.json").read_text(encoding="utf-8"))
    for record in manifest["assets"]:
        path = (ROOT / record["path"]).resolve()
        assert path.is_relative_to(ROOT), record["path"]
        assert hashlib.sha256(path.read_bytes()).hexdigest() == record["sha256"], path
        with Image.open(path) as image:
            image.load()
            assert image.size == (record["width"], record["height"]), path
            assert image.format == record["format"], path
            assert path.stat().st_size == record["bytes"], path
            alpha = image.getchannel("A").getextrema() if "A" in image.getbands() else None
            assert record["has_transparency"] == bool(alpha and alpha[0] < 255), path
    social = ROOT / "exports/social/github-social-preview-1280x640.png"
    assert social.stat().st_size < 1_000_000
    with Image.open(ROOT / "exports/web/favicon.ico") as ico:
        expected = {(n, n) for n in (16, 24, 32, 48, 64)}
        assert ico.ico.sizes() == expected
        for size in expected:
            frame = ico.ico.getimage(size)
            assert frame.size == size
            frame.load()
    webmanifest = json.loads((ROOT / "exports/web/site.webmanifest").read_text())
    for icon in webmanifest["icons"]:
        file = ROOT / "exports/web" / icon["src"]
        with Image.open(file) as image:
            assert icon["sizes"] == f"{image.width}x{image.height}"
        assert icon["purpose"] == "any"
    preview = ROOT / "review/index.html"
    parser = Links()
    parser.feed(preview.read_text(encoding="utf-8"))
    relative_count = 0
    for reference in parser.references:
        if reference.startswith("#") or urlsplit(reference).scheme:
            continue
        assert (preview.parent / reference.split("#")[0]).is_file(), reference
        relative_count += 1
    print(json.dumps({
        "status": "passed",
        "image_files_verified": len(manifest["assets"]),
        "originals_preserved": sum(r["kind"] == "original" for r in manifest["assets"]),
        "github_preview_pixels": [1280, 640],
        "github_preview_bytes": social.stat().st_size,
        "github_under_1000000_bytes": True,
        "ico_sizes": [list(x) for x in sorted(expected)],
        "preview_local_links_resolved": relative_count,
        "unperformed_checks": [
            "Live GitHub upload/render", "Real browser/device favicon test",
            "Color-managed display validation", "Independent brand/design audit",
            "Human recognition study", "Trademark or licensing clearance",
        ],
    }, indent=2))


if __name__ == "__main__":
    main()
