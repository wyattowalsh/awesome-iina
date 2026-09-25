"""Plugin webview chrome: plugin name, empty-title fallback, preview controls."""

from __future__ import annotations

from tools.fixture_render import PRESETS, render


def test_webview_uses_plugin_name_and_fallback(tmp_path) -> None:
    for preset in PRESETS:
        if preset == "command":
            continue
        dest = tmp_path / preset
        render(
            dest,
            dict(
                preset=preset,
                preferences=False,
                docs_profile="markdown",
                hooks=False,
                plugin_name="Demo Plugin",
            ),
        )
        html = (dest / "src/ui/index.html").read_text()
        css = (dest / "src/ui/style.css").read_text()
        ts = (dest / "src/ui/index.ts").read_text()
        assert "<title>Demo Plugin</title>" in html
        assert 'aria-label="Demo Plugin"' in html
        assert "CanvasText" in css
        assert 'No media' in ts
        assert "max-inline-size" in css


def test_preview_bridge_names_select_and_allows_aside_pointer_events() -> None:
    from pathlib import Path

    preview = Path(__file__).resolve().parents[1] / "template/scripts/preview.mjs"
    text = preview.read_text()
    assert "preview-scenario" in text
    assert "pointer-events:auto" in text
    assert "heading.textContent='Connecting'" in text or 'heading.textContent="Connecting"' in text
