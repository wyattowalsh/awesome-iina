"""Generated README landing stays short, branded, and free of fork attribution."""

from __future__ import annotations

from tests.helpers.paths import REPO_ROOT

_README = REPO_ROOT / "README.md"
_TEMPLATE = REPO_ROOT / "src/awesome_iina/catalog/templates/README.md.j2"
_FEATURED_NAMES = (
    "IINA",
    "IINA Plugin Definition",
    "IINA Plugin Template",
    "Online Media",
    "OpenSubtitles",
    "User Scripts",
)


def test_readme_landing_omits_cxwx_and_keeps_awesome_contract() -> None:
    readme = _README.read_text(encoding="utf-8")
    template = _TEMPLATE.read_text(encoding="utf-8")
    for surface in (readme, template):
        assert "cxwx" not in surface.casefold()
        assert "https://awesome.re/badge.svg" in surface
        assert "](docs/catalog/policy/awesome-list-policy.md)" in surface
        assert "generated from src/awesome_iina/catalog/catalog.yaml" in surface
        assert "## Start here" in surface
        assert "## Contents" in surface
        assert ".github/CONTRIBUTING.md" in surface
        assert "docs/history/NOTICE.md" in surface
        assert "wordmark-light.svg" not in surface
        assert "wordmark-dark.svg" not in surface
        assert "open-graph-1200x630.png" not in surface
        assert "share-card-1200x630-light.png" not in surface
        assert surface.count("# Awesome IINA") == 1
        assert "badge.svg)](https://github.com" not in surface
        assert "img.shields.io/github/actions" not in surface
        assert "workflows/" not in surface.split("## Start here", 1)[0]

    assert "# Awesome IINA" in readme
    for name in _FEATURED_NAMES:
        assert f"**[{name}](" in readme
    assert (REPO_ROOT / "src/awesome_iina/site/static/og/open-graph-1200x630.png").is_file()
    assert (REPO_ROOT / "src/awesome_iina/site/static/og/share-card-1200x630-light.png").is_file()
