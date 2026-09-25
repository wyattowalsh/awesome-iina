"""Catalog chrome contracts: filter IA, theme control, provenance, UI island."""

from __future__ import annotations

from awesome_iina.site import site_payloads
from tests.helpers.paths import REPO_ROOT


def test_filters_precede_start_here_and_theme_is_shadcn_mode_toggle() -> None:
    payloads = site_payloads(REPO_ROOT)
    html = payloads["index.html"].decode()
    ui_js = payloads["assets/ui/catalog-ui.js"].decode()
    assert html.index('id="catalog-chrome-root"') < html.index('id="start-here"')
    assert 'id="theme-root"' in html
    assert "Toggle theme" in ui_js
    assert '"Light"' in ui_js
    assert '"Dark"' in ui_js
    assert '"System"' in ui_js
    assert "dropdown-menu" in ui_js
    assert "prefers-color-scheme" in ui_js
    assert "awesome-iina-theme" in ui_js
    assert "filters-open" in ui_js or "Catalog filters" in ui_js
    assert "Dark theme" not in html
    assert "ToggleGroup" not in ui_js
    assert "Appearance options" not in ui_js
    assert 'class="logo logo-light"' in html
    assert 'alt=""' in html
    assert "html.dark" in payloads["assets/catalog.css"].decode()
    assert "overflow-x: clip" in payloads["assets/catalog.css"].decode()
    assert "prefers-reduced-motion" in payloads["assets/catalog.css"].decode()
    for section_id in ("plugin-index", "community-plugins", "official-plugins", "iina-core"):
        assert f'id="{section_id}"' in html
    start = html.split('id="start-here"', 1)[1].split('id="results-status"', 1)[0]
    assert start.count("<li>") == 6


def test_catalog_ships_react_chrome_island() -> None:
    payloads = site_payloads(REPO_ROOT)
    html = payloads["index.html"].decode().casefold()
    assert "assets/ui/catalog-ui.js" in html
    assert "assets/ui/catalog-ui.css" in html
    assert "assets/ui/catalog-ui.js" in payloads
    assert "assets/ui/catalog-ui.css" in payloads
    ui_js = payloads["assets/ui/catalog-ui.js"].decode()
    assert "Catalog labels" in ui_js
    assert "Filtered" in ui_js
    assert "filters" in ui_js
    assert "labels-dialog-title" in ui_js
    assert 'getElementById("labels-dialog-title")' in ui_js
    assert ".focus()" in ui_js
    assert "onOpenAutoFocus" in ui_js
    assert "tabIndex" in ui_js
