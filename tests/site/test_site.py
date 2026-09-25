"""Static catalog site: exclusive provenance sections and HTML contracts."""

from __future__ import annotations

from html import unescape

from awesome_iina.catalog import listed_in_iina_plugin_index, load_catalog
from awesome_iina.models import CatalogProject, Category, ProjectKind, SourceReference
from awesome_iina.site import group_catalog_sections, site_payloads, site_section_id
from tests.helpers.paths import REPO_ROOT

_INDEX_SOURCE = SourceReference(
    label="Official IINA plugin index",
    url="https://github.com/iina/iina/blob/develop/plugins.json",
)


def test_live_catalog_sections_are_exclusive_and_complete() -> None:
    catalog = load_catalog(REPO_ROOT / "src/awesome_iina/catalog/catalog.yaml")
    sections = group_catalog_sections(catalog.projects)
    slugs = [project.slug for section in sections for project in section.projects]
    assert sorted(slugs) == sorted(project.slug for project in catalog.projects)
    assert len(slugs) == len(set(slugs))
    by_id = {section.id: section for section in sections}
    assert "plugin-index" in by_id
    assert "community-plugins" in by_id
    for project in by_id["plugin-index"].projects:
        assert listed_in_iina_plugin_index(project)
        assert not project.official
        assert project.kind is ProjectKind.PLUGIN
    for project in by_id["community-plugins"].projects:
        assert not listed_in_iina_plugin_index(project)
        assert not project.official
        assert project.kind is ProjectKind.PLUGIN
    for project in by_id["official-plugins"].projects:
        assert project.official
        assert project.kind is ProjectKind.PLUGIN
        assert project.category is not Category.HISTORICAL


def test_plugin_index_does_not_steal_official_or_historical_rows() -> None:
    official = CatalogProject.model_validate(
        {
            "slug": "official-online-media",
            "name": "Online Media",
            "repo": "iina/iina-plugin-online-media",
            "description": "A first-party IINA plugin with an index citation as extra evidence.",
            "category": Category.OFFICIAL_PLUGIN,
            "kind": ProjectKind.PLUGIN,
            "official": True,
            "plugin_identifier": "io.iina.ytdl",
            "sources": [_INDEX_SOURCE],
        }
    )
    historical = CatalogProject.model_validate(
        {
            "slug": "legacy-plugin-ytdl",
            "name": "Legacy yt-dlp plugin",
            "repo": "iina/iina-plugin-ytdl",
            "description": "A superseded official plugin retained only for identifier history.",
            "category": Category.HISTORICAL,
            "kind": ProjectKind.PLUGIN,
            "official": True,
            "plugin_identifier": "io.iina.ytdl",
            "sources": [_INDEX_SOURCE],
        }
    )
    assert site_section_id(official) == "official-plugins"
    assert site_section_id(historical) == "historical"


def test_site_html_splits_plugin_index_and_preserves_head_contracts() -> None:
    catalog = load_catalog(REPO_ROOT / "src/awesome_iina/catalog/catalog.yaml")
    html = site_payloads(REPO_ROOT)["index.html"].decode()
    assert 'id="plugin-index"' in html
    assert "IINA plugin index" in html
    assert "Other native plugins" in html
    assert html.count('class="project"') == len(catalog.projects)
    assert "twitter:image" in html
    assert "assets/og/open-graph-1200x630.png" in html
    assert 'name="theme-color"' in html
    assert "composition-legend" in html
    assert 'id="featured-title"' in html
    assert 'id="theme-root"' in html
    featured = next(project for project in catalog.projects if project.featured)
    assert f'href="#{featured.slug}"' in html
    assert "plugins.json" in html


def test_site_keeps_theme_dropdown_and_enhancement_contracts() -> None:
    payloads = site_payloads(REPO_ROOT)
    html = payloads["index.html"].decode()
    css = payloads["assets/catalog.css"].decode()
    ui_js = payloads["assets/ui/catalog-ui.js"].decode()
    assert 'id="theme-root"' in html
    assert 'id="catalog-chrome-root"' in html
    assert "Dark theme" not in html
    assert "Toggle theme" in ui_js
    assert '"Light"' in ui_js
    assert '"Dark"' in ui_js
    assert '"System"' in ui_js
    assert "prefers-color-scheme" in ui_js
    assert "ToggleGroup" not in ui_js
    assert "html.dark" in css
    assert 'id="empty"' in html
    assert 'id="contents-title"' in html
    assert 'href="#start-here"' in html
    assert 'href="#selection-policy"' in html
    assert 'href="#contributing"' in html
    assert "Catalog labels" in ui_js
    assert "aria-controls" in ui_js
    assert "connect-src 'none'" in html
    assert "default-src 'self'" in html
    assert "style-src 'self' 'unsafe-inline'" in html
    assert "assets/ui/catalog-ui.js" in html
    assert "prefers-reduced-motion" in css
    assert "min-height: 44px" in css
    assert "container-type: inline-size" in css
    assert "#theme-root" in css
    assert ".project-meta" in css
    for token in (
        "--background",
        "--foreground",
        "--card",
        "--primary",
        "--primary-foreground",
        "--muted",
        "--muted-foreground",
        "--border",
        "--ring",
        "--radius",
    ):
        assert token in css
    assert "--brand-light-cyan" in css
    assert "--brand-cyan" in css


def test_site_ships_icon_sprite_and_project_metadata() -> None:
    catalog = load_catalog(REPO_ROOT / "src/awesome_iina/catalog/catalog.yaml")
    payloads = site_payloads(REPO_ROOT)
    html = payloads["index.html"].decode()
    sprite = payloads["assets/icons.svg"]
    assert sprite.startswith(b"<svg")
    assert b'id="search"' in sprite
    assert b'id="chevron-down"' in sprite
    used_kinds = {project.kind.value for project in catalog.projects}
    kinds_attr = html.split("data-kinds=", 1)[1]
    quote = kinds_attr[0]
    kinds_json = unescape(kinds_attr[1:].split(quote, 1)[0])
    for kind in ProjectKind:
        token = f'"value":"{kind.value}"'
        if kind.value in used_kinds:
            assert token in kinds_json
        else:
            assert token not in kinds_json
    sections = group_catalog_sections(catalog.projects)
    if not any(section.id == "companions" for section in sections):
        assert 'id="companions"' not in html
    assert "README groups by category." in html
    assert html.count('class="project-meta"') == len(catalog.projects)
    assert html.count("<dt>Category</dt>") == len(catalog.projects)
    assert html.count("<dt>Type</dt>") == len(catalog.projects)
    assert html.count("<dt>Repository</dt>") == sum(
        1 for project in catalog.projects if project.repo
    )
    assert html.count("<dt>Plugin ID</dt>") == sum(
        1 for project in catalog.projects if project.plugin_identifier
    )
    assert html.count("<dt>License</dt>") == sum(
        1 for project in catalog.projects if project.license
    )
    assert html.count("<dt>Sources</dt>") == sum(
        1 for project in catalog.projects if project.sources
    )
    assert html.count('class="tag"') == sum(len(project.tags) for project in catalog.projects)
    sample = next(
        project for project in catalog.projects if project.plugin_identifier and project.repo
    )
    assert f'id="{sample.slug}"' in html
    assert sample.plugin_identifier is not None
    assert sample.repo is not None
    assert sample.plugin_identifier in html
    assert sample.repo in html
    assert "awesome-list-policy.md" in html
    assert "actions/workflows/ci.yml" not in html


def test_companion_kind_is_not_filed_as_a_plugin() -> None:
    project = CatalogProject.model_validate(
        {
            "slug": "browser-handoff",
            "name": "Browser handoff",
            "repo": "example/iina-handoff",
            "description": "A companion that opens media in IINA from another app.",
            "category": Category.AUTOMATION,
            "kind": ProjectKind.COMPANION,
        }
    )
    assert site_section_id(project) == "companions"
