"""Takumi-derived catalog share cards stay on kit tokens and known sizes."""

from __future__ import annotations

import json
import struct

from awesome_iina.site import site_payloads
from tests.helpers.paths import REPO_ROOT

_OG = REPO_ROOT / "src/awesome_iina/site/ui/og"
_SCRIPT = REPO_ROOT / "src/awesome_iina/site/ui/scripts/render-og.tsx"
_PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"
_DEMO_TRADE_DRESS = ("#16130f", "#ff4d4d", "takumi.kane.tw")


def _png_size(data: bytes) -> tuple[int, int]:
    assert data.startswith(_PNG_SIGNATURE)
    width, height = struct.unpack(">II", data[16:24])
    return width, height


def test_takumi_sources_use_kit_identity_not_demo_trade_dress() -> None:
    card = (_OG / "catalog-card.tsx").read_text()
    script = _SCRIPT.read_text()
    combined = f"{card}\n{script}".casefold()
    for token in _DEMO_TRADE_DRESS:
        assert token not in combined
    assert "var(--brand-background)" in card
    assert "var(--brand-foreground)" in card
    assert "var(--brand-cyan)" in card
    assert "var(--brand-violet)" in card
    assert "WAVE_BARS" in card
    assert "Independent catalog" in script
    assert "for the IINA ecosystem" in script
    assert "takumi-js" in (_OG / "README.md").read_text()
    assert "kit/archive" not in script
    assert "static/og" in script
    assert "output/og" in script
    assert "var(--brand-blue)" in script or "blue" in script


def test_site_ships_takumi_open_graph_cards() -> None:
    payloads = site_payloads(REPO_ROOT)
    html = payloads["index.html"].decode()
    og = payloads["assets/og/open-graph-1200x630.png"]
    social = payloads["assets/og/github-social-preview-1280x640.png"]
    light = payloads["assets/og/share-card-1200x630-light.png"]
    manifest = json.loads(payloads["assets/og/MANIFEST.json"].decode())
    assert "assets/og/open-graph-1200x630.png" in html
    assert 'property="og:image:width" content="1200"' in html
    assert 'property="og:image:height" content="630"' in html
    assert _png_size(og) == (1200, 630)
    assert _png_size(social) == (1280, 640)
    assert _png_size(light) == (1200, 630)
    assert manifest["schema_version"] == 1
    names = {item["path"] for item in manifest["assets"]}
    assert names == {
        "assets/og/open-graph-1200x630.png",
        "assets/og/github-social-preview-1280x640.png",
        "assets/og/share-card-1200x630-light.png",
    }
    kit_og = REPO_ROOT / "src/awesome_iina/site/kit/assets/brand/open-graph-1200x630.png"
    assert kit_og.is_file()
    assert kit_og.read_bytes() != og
