"""Featured Start here set is the short official onboarding list."""

from __future__ import annotations

from tests.helpers.paths import REPO_ROOT

from awesome_iina.catalog import load_catalog

_FEATURED_SLUGS = frozenset(
    {
        "iina",
        "official-user-scripts",
        "official-online-media",
        "official-opensubtitles",
        "plugin-template",
        "plugin-definition",
    }
)


def test_featured_set_is_short_official_onboarding() -> None:
    catalog = load_catalog(REPO_ROOT / "src/awesome_iina/catalog/catalog.yaml")
    featured = [project.slug for project in catalog.projects if project.featured]
    assert 5 <= len(featured) <= 8
    assert set(featured) == _FEATURED_SLUGS
