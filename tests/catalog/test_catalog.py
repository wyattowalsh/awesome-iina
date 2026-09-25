from pathlib import Path

from jsonschema import Draft202012Validator

from awesome_iina.catalog import (
    audit_official_plugins,
    catalog_schema,
    catalog_stats,
    listed_in_iina_plugin_index,
    load_catalog,
    validate_catalog_policy,
)
from awesome_iina.catalog.generator import generated_outputs, schema_outputs, write_or_check
from awesome_iina.discovery.settings import load_config
from awesome_iina.discovery.sources import load_official_plugins
from awesome_iina.models import (
    Catalog,
    CatalogMetadata,
    CatalogProject,
    Category,
    OfficialPluginEntry,
    ProjectKind,
    ProjectStatus,
    SourceReference,
)

_INDEX_SOURCE = SourceReference(
    label="Official IINA plugin index",
    url="https://github.com/iina/iina/blob/develop/plugins.json",
)
_ORG_SOURCE = SourceReference(
    label="IINA GitHub organization",
    url="https://github.com/iina",
)


def base_project(**updates: object) -> CatalogProject:
    data: dict[str, object] = {
        "slug": "example",
        "name": "Example",
        "repo": "example/plugin",
        "description": "A sufficiently descriptive IINA project entry.",
        "category": Category.PLAYBACK,
        "kind": ProjectKind.PLUGIN,
    }
    data.update(updates)
    return CatalogProject.model_validate(data)


def test_listed_in_iina_plugin_index_is_source_url_not_label() -> None:
    listed = base_project(sources=[_INDEX_SOURCE])
    org_only = base_project(sources=[_ORG_SOURCE])
    assert listed_in_iina_plugin_index(listed) is True
    assert listed_in_iina_plugin_index(org_only) is False


def _policy_errors(project: CatalogProject) -> list[str]:
    return validate_catalog_policy(
        Catalog(metadata=CatalogMetadata(description="Test catalog."), projects=[project])
    )


def _schema_project(**updates: object) -> dict[str, object]:
    payload: dict[str, object] = {
        "slug": "example",
        "name": "Example",
        "description": "A sufficiently descriptive IINA project entry.",
        "category": "playback",
        "kind": "plugin",
        "repo": "example/plugin",
    }
    payload.update(updates)
    return payload


def _schema_catalog(projects: list[dict[str, object]]) -> dict[str, object]:
    return {
        "metadata": {"description": "A test catalog for JSON Schema coverage."},
        "projects": projects,
    }


def test_catalog_policy_and_official_index_coverage() -> None:
    catalog = load_catalog(Path("src/awesome_iina/catalog/catalog.yaml"))
    official = [project for project in catalog.projects if project.official]
    assert len(official) == 12
    assert all(
        project.repo is not None and project.repo.casefold().startswith("iina/")
        for project in official
    )
    assert validate_catalog_policy(catalog) == []
    plugins = load_official_plugins(Path("src/awesome_iina/discovery/snapshots/iina-plugins.json"))
    assert audit_official_plugins(catalog, plugins) == []


def test_live_catalog_satisfies_location_schema() -> None:
    catalog = load_catalog(Path("src/awesome_iina/catalog/catalog.yaml"))
    schema = catalog_schema()
    Draft202012Validator.check_schema(schema)
    Draft202012Validator(schema).validate(catalog.model_dump(mode="json"))


def test_catalog_stats() -> None:
    stats = catalog_stats(load_catalog(Path("src/awesome_iina/catalog/catalog.yaml")))
    assert stats["projects"] >= 60
    assert stats["plugins"] >= 40
    assert stats["categories"]["official-plugin"] == 4


def test_generated_outputs_are_current() -> None:
    config = load_config(Path("src/awesome_iina/discovery/discovery.yaml"))
    catalog = load_catalog(Path("src/awesome_iina/catalog/catalog.yaml"))
    outputs = generated_outputs(
        catalog,
        template_path=config.paths.readme_template,
        readme_path=config.paths.readme,
    )
    assert write_or_check(outputs, check=True) == []


def test_generated_outputs_include_all_schema_outputs() -> None:
    config = load_config(Path("src/awesome_iina/discovery/discovery.yaml"))
    catalog = load_catalog(Path("src/awesome_iina/catalog/catalog.yaml"))
    outputs = generated_outputs(
        catalog,
        template_path=config.paths.readme_template,
        readme_path=config.paths.readme,
    )
    schema_paths = set(schema_outputs().keys())
    assert schema_paths <= set(outputs.keys())
    assert Path("src/awesome_iina/catalog/schemas/overrides.schema.json") in outputs
    assert Path("src/awesome_iina/catalog/schemas/source-snapshot.schema.json") in outputs


def test_policy_reports_archived_without_note() -> None:
    catalog = Catalog(
        metadata=CatalogMetadata(description="Test catalog."),
        projects=[base_project(status=ProjectStatus.ARCHIVED)],
    )
    assert "must explain" in validate_catalog_policy(catalog)[0]


def test_policy_reports_invalid_official_and_featured_archived() -> None:
    project = base_project(
        official=True,
        featured=True,
        status=ProjectStatus.ARCHIVED,
        notes="Historical value.",
    )
    errors = _policy_errors(project)
    assert any("official=true" in error for error in errors)
    assert any("cannot be featured" in error for error in errors)
    assert any("official plugin entries" in error for error in errors)


def test_official_index_listing_is_not_officialness() -> None:
    project = base_project(
        slug="auto-skip",
        name="Auto Skip",
        repo="pangziqiang/iina-auto-skip",
        description="Lets users mark intro and outro ranges with an overlay, then skips those segments automatically.",
        official=True,
        featured=True,
        plugin_identifier="io.iina.auto-skip",
        sources=[_INDEX_SOURCE],
    )
    errors = _policy_errors(project)
    assert any("official=true" in error for error in errors)


def test_iina_org_repo_without_sources_is_not_official() -> None:
    project = base_project(
        slug="just",
        name="Just",
        repo="iina/just",
        official=True,
        category=Category.DEVELOPMENT,
        kind=ProjectKind.DEVELOPMENT_TOOL,
    )
    errors = _policy_errors(project)
    assert any("official=true" in error for error in errors)
    assert errors == [
        "just: official=true requires an iina/ repository or "
        "iina.io / github.com/iina/ URL, plus a first-party source"
    ]


def test_iina_org_repo_with_first_party_source_may_be_official() -> None:
    project = base_project(
        slug="just",
        name="Just",
        repo="iina/just",
        official=True,
        category=Category.DEVELOPMENT,
        kind=ProjectKind.DEVELOPMENT_TOOL,
        sources=[_ORG_SOURCE],
    )
    assert _policy_errors(project) == []


def test_iina_org_repo_with_only_index_source_is_not_official() -> None:
    project = base_project(
        slug="just",
        name="Just",
        repo="iina/just",
        official=True,
        category=Category.DEVELOPMENT,
        kind=ProjectKind.DEVELOPMENT_TOOL,
        sources=[_INDEX_SOURCE],
    )
    assert any("official=true" in error for error in _policy_errors(project))


def test_audit_official_reports_missing_and_mismatch() -> None:
    catalog = Catalog(
        metadata=CatalogMetadata(description="Test catalog."),
        projects=[base_project(plugin_identifier="wrong")],
    )
    plugins = [
        OfficialPluginEntry(
            name="Example",
            url="https://github.com/example/plugin",
            desc="Example plugin.",
            id="expected",
        ),
        OfficialPluginEntry(
            name="Missing",
            url="https://github.com/example/missing",
            desc="Missing plugin.",
            id="missing",
        ),
    ]
    errors = audit_official_plugins(catalog, plugins)
    assert len(errors) == 2
    assert any("does not match" in error for error in errors)
    assert any("missing official-index plugin" in error for error in errors)


def test_catalog_schema_rejects_neither_repo_nor_url() -> None:
    schema = catalog_schema()
    Draft202012Validator.check_schema(schema)
    project = _schema_project()
    del project["repo"]
    errors = list(Draft202012Validator(schema).iter_errors(_schema_catalog([project])))
    assert errors


def test_catalog_schema_rejects_github_url_host() -> None:
    schema = catalog_schema()
    project = _schema_project(url="https://github.com/example/plugin")
    del project["repo"]
    errors = list(Draft202012Validator(schema).iter_errors(_schema_catalog([project])))
    assert errors


def test_catalog_schema_accepts_external_url_without_repo() -> None:
    schema = catalog_schema()
    project = _schema_project(url="https://git.notfire.cc/notfire/iina-listenbrainz")
    del project["repo"]
    Draft202012Validator(schema).validate(_schema_catalog([project]))


def test_catalog_schema_does_not_encode_uniqueness() -> None:
    schema = catalog_schema()
    instance = _schema_catalog(
        [
            _schema_project(slug="same", repo="example/one"),
            _schema_project(slug="same", name="Other", repo="example/two"),
        ]
    )
    Draft202012Validator(schema).validate(instance)
