#!/usr/bin/env python3
"""Export existing raster artwork; never regenerate, trace or redesign it.

Run from the extracted kit: python scripts/export_assets.py
Requires Pillow. Original image bytes are never overwritten.
"""
from __future__ import annotations

import csv
import hashlib
import json
from io import BytesIO
from pathlib import Path

from PIL import Image, __version__ as pillow_version

ROOT = Path(__file__).resolve().parents[1]
SOURCES = {
    "master": "originals/awesome-iina-master-icon.png",
    "simple": "originals/awesome-iina-simplified-icon.png",
    "social": "originals/awesome-iina-social-artwork.png",
    "hero": "originals/awesome-iina-readme-hero.png",
}
SOURCE_ORIGINS = {
    "master": "neon_media_player_plugin_icon.png",
    "simple": "neon_media_player_icon.png",
    "social": "awesome_iina_neon_ecosystem_banner.png",
    "hero": "awesome_iina_neon_plugin_hero.png",
}
EXPECTED = {
    "master": "dffb97febac14aac4d1f4a62674bd564bf597e2699336d331e3a16f1da39ac0b",
    "simple": "647899bf2df686e87208879e7b6a33c8f7302d146ee2c65ed7400f5b546edb9d",
    "social": "0e1ee00c430784df72b092d212aa2f64b0eff2e22366dd84527c5f5218c5fcd0",
    "hero": "fa6e93ae2e241c5c12a954624bb2b682ccc9e6e87bd14295409895289794f4c5",
}


def image_record(path: str, kind: str, source: str, operation: str, role: str) -> dict:
    file = ROOT / path
    raw = file.read_bytes()
    with Image.open(file) as image:
        image.load()
        alpha = image.getchannel("A").getextrema() if "A" in image.getbands() else None
        record = {
            "path": path,
            "kind": kind,
            "source": source,
            "operation": operation,
            "intended_role": role,
            "format": image.format,
            "width": image.width,
            "height": image.height,
            "mode": image.mode,
            "bytes": len(raw),
            "sha256": hashlib.sha256(raw).hexdigest(),
            "has_alpha_channel": "A" in image.getbands(),
            "has_transparency": bool(alpha and alpha[0] < 255) or "transparency" in image.info,
            "embedded_icc_profile": bool(image.info.get("icc_profile")),
        }
        if image.format == "ICO":
            record["ico_sizes"] = [list(size) for size in sorted(image.ico.sizes())]
        return record


def main() -> None:
    records = []
    images = {}
    for key, relative in SOURCES.items():
        file = ROOT / relative
        if not file.is_file() or hashlib.sha256(file.read_bytes()).hexdigest() != EXPECTED[key]:
            raise ValueError(f"Missing or changed original: {relative}")
        with Image.open(file) as image:
            images[key] = image.convert("RGB")
        records.append(image_record(relative, "original", SOURCE_ORIGINS[key],
                                    "Byte-for-byte copy of current-conversation PNG", key))

    def png(key: str, relative: str, size: tuple[int, int], role: str,
            padding: bool = False, maximum_bytes: int | None = None) -> None:
        source = images[key]
        if size[0] > source.width and not padding:
            raise ValueError("Upsampling originals is not permitted")
        if padding:
            # Preserve all source content: exact 2:1 art centered at 1200x600,
            # with 15 px padding above and below. Never stretch to 1200x630.
            fitted = source.resize((1200, 600), Image.Resampling.LANCZOS)
            output = Image.new("RGB", size, source.getpixel((0, 0)))
            output.paste(fitted, (0, 15))
            operation = "Lanczos 1200x600; center in 1200x630 with 15px top/bottom padding sampled from source pixel (0,0); no crop"
        else:
            if abs(source.width / source.height - size[0] / size[1]) > 1e-8:
                raise ValueError("Unexpected aspect ratio change")
            output = source.resize(size, Image.Resampling.LANCZOS)
            operation = "Lanczos resize only; aspect ratio and all source content preserved"
        buffer = BytesIO()
        output.save(buffer, format="PNG", optimize=True, compress_level=9)
        raw = buffer.getvalue()
        if maximum_bytes is not None and len(raw) >= maximum_bytes:
            raise ValueError(f"PNG over budget: {relative} ({len(raw)} bytes)")
        path = ROOT / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(raw)
        records.append(image_record(relative, "derived-export", SOURCES[key], operation, role))

    for size in (1024, 512, 256, 128):
        png("master", f"exports/icons/brand-icon-{size}.png", (size, size), "Large brand illustration/icon; opaque background")
    for size in (512, 256):
        png("simple", f"exports/icons/simplified-icon-{size}.png", (size, size), "Simplified source icon, not a vector/flat master")
    png("social", "exports/social/github-social-preview-1280x640.png", (1280, 640),
        "GitHub social upload; dimensions and byte budget checked", maximum_bytes=1_000_000)
    png("social", "exports/social/open-graph-1200x630-padded.png", (1200, 630),
        "Optional website share-card composition; padded, not a universal platform requirement", padding=True)
    for size in ((1800, 600), (1200, 400)):
        png("hero", f"exports/headers/readme-hero-{size[0]}x{size[1]}.png", size,
            "README/website header; contains rasterized typography")
    favicon_sizes = (16, 24, 32, 48, 64)
    for size in favicon_sizes:
        png("simple", f"exports/web/favicon-{size}x{size}.png", (size, size),
            "Evaluation favicon: resized source, not optically redesigned")
    png("simple", "exports/web/apple-touch-icon.png", (180, 180), "Touch icon; opaque square source")
    for size in (192, 512):
        png("simple", f"exports/web/icon-{size}.png", (size, size), "Web manifest icon; purpose any, not maskable")
    ico = ROOT / "exports/web/favicon.ico"
    images["simple"].resize((64, 64), Image.Resampling.LANCZOS).save(
        ico, format="ICO", sizes=[(n, n) for n in favicon_sizes],
        append_images=[Image.open(ROOT / f"exports/web/favicon-{n}x{n}.png").convert("RGBA")
                       for n in favicon_sizes if n != 64],
    )
    records.append(image_record("exports/web/favicon.ico", "derived-export", SOURCES["simple"],
                                "Multiresolution ICO assembled from resized simplified source", "Browser favicon; 16/24/32/48/64 frames"))
    manifest = {
        "schema_version": 1,
        "project": "Awesome IINA",
        "intended_repository": "wyattowalsh/awesome-iina",
        "original_artwork_count": 4,
        "image_file_count": len(records),
        "pillow_version": pillow_version,
        "transformation_policy": "Originals preserved; derived exports resize or explicitly pad. No tracing, generative editing, sharpening, or background removal.",
        "limitations": [
            "All four source PNGs are opaque RGB without embedded ICC profiles.",
            "No editable vector master, editable text layers, transparent knockout, or monochrome identity is included.",
            "Favicon exports are resizing candidates; native-size visual design has not been approved.",
            "A web manifest and icon files alone do not provide app functionality, offline behavior, or guaranteed installability.",
            "Image text comes from existing generated raster artwork, not a newly typeset editable source.",
        ],
        "assets": records,
    }
    (ROOT / "ASSET-MANIFEST.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    columns = ("path", "kind", "source", "format", "width", "height", "bytes", "mode",
               "has_transparency", "embedded_icc_profile", "intended_role")
    with (ROOT / "ASSET-INDEX.csv").open("w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=columns, lineterminator="\n", extrasaction="ignore")
        writer.writeheader()
        writer.writerows(records)
    print(json.dumps({"originals": 4, "image_files": len(records),
                      "github_preview_bytes": next(r["bytes"] for r in records if "github-social-preview" in r["path"])}, indent=2))


if __name__ == "__main__":
    main()
