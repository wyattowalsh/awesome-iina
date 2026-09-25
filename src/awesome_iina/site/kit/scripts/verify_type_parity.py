#!/usr/bin/env python3
"""Check editable SVG glyph origins against production outlines in local Chromium.

Font binaries are verified, embedded only in an in-memory browser document, and
never written into the kit or screenshots' metadata. This is a renderer proof,
not a hosted-browser, favicon selection, or user-recognition test.
"""
from __future__ import annotations

import argparse
import base64
import hashlib
import json
import math
import re
import shutil
from pathlib import Path
from xml.etree import ElementTree as ET

from playwright.sync_api import sync_playwright

NS = "{http://www.w3.org/2000/svg}"
PAIRS = [
    ("wordmark-dark-editable.svg", "wordmark-dark.svg", "#080F2B"),
    ("wordmark-light-editable.svg", "wordmark-light.svg", "#FFFFFF"),
    ("social-card-editable.svg", "github-social-preview.svg", "#080F2B"),
]


def outlined_origins(path: Path) -> list[dict]:
    groups = []
    for group in ET.parse(path).getroot().iter(NS + "g"):
        if "aria-label" not in group.attrib:
            continue
        label = group.attrib["aria-label"]
        positions = []
        for child in group.findall(NS + "path"):
            match = re.fullmatch(
                r"translate\(([-+\d.e]+) ([-+\d.e]+)\) scale\(([-+\d.e]+) ([-+\d.e]+)\)",
                child.attrib.get("transform", ""),
            )
            if match is None:
                raise ValueError(f"Unexpected outline positioning in {path.name}")
            positions.append([float(match[1]), float(match[2])])
        if len(positions) != sum(not c.isspace() for c in label):
            raise ValueError("Visible-character and outline counts differ; extend the checker explicitly")
        groups.append({"text": label, "positions": positions})
    return groups


def checked_font_css(root: Path, directory: Path) -> tuple[str, list[dict]]:
    inventory = json.loads((root / "provenance/font-inventory.json").read_text())
    faces, evidence = [], []
    for record in inventory:
        name = record["file"]
        if Path(name).name != name:
            raise ValueError("Unsafe font inventory filename")
        raw = (directory / name).read_bytes()
        digest = hashlib.sha256(raw).hexdigest()
        if digest != record["sha256"]:
            raise ValueError(f"Font hash mismatch: {name}; do not substitute a fallback")
        weight = 700 if record["role"] == "bold" else 500
        faces.append('@font-face{font-family:"Inter Display";font-style:normal;'
                     f'font-weight:{weight};src:url(data:font/otf;base64,'
                     + base64.b64encode(raw).decode() + ') format("opentype");}')
        evidence.append({"file": name, "sha256": digest, "hash_verified": True, "weight": weight})
    return "".join(faces), evidence


def run(root: Path, fonts: Path, chromium: str, output: Path, tolerance: float = .25) -> dict:
    if not math.isfinite(tolerance) or tolerance <= 0:
        raise ValueError("Tolerance must be a positive finite CSS-pixel value")
    css, font_evidence = checked_font_css(root, fonts)
    output.mkdir(parents=True, exist_ok=True)
    checks, rows, screenshots, unexpected, errors = [], [], [], [], []

    def check(ident: str, success: bool, detail: object) -> None:
        checks.append({"id": ident, "pass": bool(success), "detail": detail})

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path=chromium, headless=True, args=["--no-sandbox"])
        version = browser.version
        for dpr in (1, 2):
            context = browser.new_context(device_scale_factor=dpr, viewport={"width": 1280, "height": 640})
            def block(route):
                unexpected.append(route.request.url.split("?", 1)[0]); route.abort()
            context.route("**/*", block)
            page = context.new_page()
            page.on("pageerror", lambda err: errors.append(str(err)))
            page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
            for source_name, production_name, background in PAIRS:
                source = root / "source" / source_name
                tree = ET.parse(source).getroot()
                w, h = float(tree.attrib["width"]), float(tree.attrib["height"])
                expected = outlined_origins(root / "assets/brand" / production_name)
                for display_width in (int(w), 320):
                    ratio = display_width / w
                    display_height = math.ceil(h * ratio)
                    page.set_viewport_size({"width": display_width, "height": display_height})
                    # Font data live only here; do not serialize this document to the bundle.
                    document = '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Editable typography parity</title><style>' + css
                    document += f'body{{margin:0;background:{background}}}svg{{display:block;width:{display_width}px;height:auto}}'
                    document += '</style></head><body>' + source.read_text() + '</body></html>'
                    page.set_content(document)
                    page.evaluate('''async () => {
                        await Promise.all([...document.querySelectorAll('text')].map(e => {
                            const s = getComputedStyle(e);
                            return document.fonts.load(`${s.fontWeight} ${s.fontSize} "Inter Display"`, e.textContent);
                        }));
                        await document.fonts.ready;
                    }''')
                    observed = page.locator("text").evaluate_all('''elements => elements.map(e => {
                        const s = getComputedStyle(e);
                        return {text:e.textContent, kerning:s.fontKerning, font:s.fontFamily,
                            fontLoaded:document.fonts.check(`${s.fontWeight} ${s.fontSize} "Inter Display"`, e.textContent),
                            length:e.getComputedTextLength(),
                            positions:[...e.textContent].map((c,i) => {
                                const p=e.getStartPositionOfChar(i);
                                return {character:c,x:p.x,y:p.y};
                            }).filter(p => !/\\s/.test(p.character))};
                    })''')
                    label = f"{source_name}:{display_width}:dpr{dpr}"
                    check("count:" + label, len(observed) == len(expected), len(observed))
                    for index, (current, target) in enumerate(zip(observed, expected)):
                        same = current["text"] == target["text"]
                        lengths = len(current["positions"]) == len(target["positions"])
                        errors_by_character = [max(abs(a["x"] - b[0]), abs(a["y"] - b[1])) * ratio
                                               for a, b in zip(current["positions"], target["positions"])]
                        largest = max(errors_by_character, default=0)
                        success = same and lengths and current["kerning"] == "none" and current["fontLoaded"] and largest <= tolerance
                        row = {"source": "source/" + source_name, "production": "assets/brand/" + production_name,
                               "text_index": index, "text": current["text"], "css_width": display_width,
                               "dpr": dpr, "kerning": current["kerning"], "font_loaded": current["fontLoaded"],
                               "text_advance_user_units": current["length"],
                               "maximum_origin_error_css_px": largest, "tolerance_css_px": tolerance,
                               "visible_character_count": len(current["positions"]), "passed": success}
                        rows.append(row); check("origins:" + label + f":{index}", success, row)
                    if dpr == 1:
                        name = source_name.removesuffix(".svg") + f"-{display_width}.png"
                        page.screenshot(path=str(output / name))
                        screenshots.append(name)
            context.close()
        browser.close()
    check("no-unexpected-network", not unexpected, unexpected)
    check("no-browser-errors", not errors, errors)
    report = {"schema_version": 1, "kit_revision": json.loads((root / "source/release.json").read_text())["revision"],
              "status": "passed" if all(c["pass"] for c in checks) else "failed",
              "browser": "Chromium " + version, "browser_plugin": "not available; regular Playwright used",
              "method": "In-memory SVG with exact hash-checked local fonts; compare SVG character origins to existing outlined path translations",
              "fonts": font_evidence, "fonts_distributed": False, "source_files_checked": len(PAIRS),
              "distinct_text_elements": sum(len(outlined_origins(root / "assets/brand" / p)) for _, p, _ in PAIRS),
              "text_observations": len(rows), "checks_passed": sum(c["pass"] for c in checks), "checks_total": len(checks),
              "maximum_origin_error_css_px": max(r["maximum_origin_error_css_px"] for r in rows),
              "observations": rows, "checks": checks, "screenshots": screenshots,
              "limitations": ["Not identical antialiasing across renderers", "Not public-site navigation or a user study", "Production art was not modified"]}
    (output / "type-parity.json").write_text(json.dumps(report, indent=2) + "\n")
    print(f"Typography parity: {report['checks_passed']}/{report['checks_total']}; max error {report['maximum_origin_error_css_px']:.6f} CSS px")
    return report


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--font-dir", type=Path, required=True)
    parser.add_argument("--chromium", default=shutil.which("chromium"))
    parser.add_argument("--output-dir", type=Path)
    parser.add_argument("--tolerance", type=float, default=.25)
    args = parser.parse_args()
    if not args.chromium:
        parser.error("Provide an installed Chromium executable; no download is performed")
    root = args.root.resolve(strict=True)
    report = run(root, args.font_dir, args.chromium, args.output_dir or root / "qa/type-parity", args.tolerance)
    raise SystemExit(0 if report["status"] == "passed" else 1)
