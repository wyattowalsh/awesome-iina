"""WCAG relative-luminance contrast for light catalog filter chrome."""

from __future__ import annotations

import re

from awesome_iina.site import site_payloads
from tests.helpers.paths import REPO_ROOT

_INK = (0x13 / 255, 0x25 / 255, 0x55 / 255)
_ICE = (0xF5 / 255, 0xFA / 255, 0xFF / 255)


def _channel(value: float) -> float:
    return value / 12.92 if value <= 0.04045 else ((value + 0.055) / 1.055) ** 2.4


def _relative_luminance(rgb: tuple[float, float, float]) -> float:
    red, green, blue = (_channel(component) for component in rgb)
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue


def _mix(ink_pct: float) -> tuple[float, float, float]:
    ice_pct = 1.0 - ink_pct
    mixed = tuple(ink * ink_pct + ice * ice_pct for ink, ice in zip(_INK, _ICE, strict=True))
    red, green, blue = mixed
    return (red, green, blue)


def _contrast(
    foreground: tuple[float, float, float], background: tuple[float, float, float]
) -> float:
    lighter = max(_relative_luminance(foreground), _relative_luminance(background))
    darker = min(_relative_luminance(foreground), _relative_luminance(background))
    return (lighter + 0.05) / (darker + 0.05)


def test_light_border_vs_card_meets_three_to_one() -> None:
    css = site_payloads(REPO_ROOT)["assets/catalog.css"].decode()
    match = re.search(
        r"--border:\s*color-mix\(in srgb,\s*var\(--brand-ink\)\s+(\d+(?:\.\d+)?)%",
        css,
    )
    assert match is not None
    border_mix = float(match.group(1)) / 100.0
    card = _mix(0.05)
    border = _mix(border_mix)
    assert _contrast(border, card) >= 3.0
    assert "--radius: 7px" in css
    assert "min-height: 44px" in css
    light_block = css.split("@media (prefers-color-scheme: dark)", 1)[0]
    assert "#43D9F5" not in light_block
    assert "#43d9f5" not in light_block
