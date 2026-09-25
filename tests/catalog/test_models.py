import json
from pathlib import Path

import pytest
import yaml
from pydantic import ValidationError

from awesome_iina.catalog import catalog_as_json, load_catalog
from awesome_iina.models import (
    Catalog,
    CatalogMetadata,
    CatalogProject,
    Category,
    OfficialPluginEntry,
    ProjectKind,
)


def _collision_project(slug: str, repo: str, **updates: object) -> CatalogProject:
    data: dict[str, object] = {
        "slug": slug,
        "name": "Example",
        "repo": repo,
        "description": "A sufficiently descriptive IINA plugin entry.",
        "category": Category.PLAYBACK,
        "kind": ProjectKind.PLUGIN,
        "plugin_identifier": "dev.example.same",
    }
    data.update(updates)
    return CatalogProject.model_validate(data)


def test_plugin_does_not_invent_installability() -> None:
    project = CatalogProject(
        slug="example",
        name="Example",
        repo="example/iina-plugin",
        description="A sufficiently descriptive IINA plugin entry.",
        category=Category.PLAYBACK,
        kind=ProjectKind.PLUGIN,
    )
    assert project.install == []
    assert project.model_dump(mode="json")["install"] == []


def test_yaml_without_install_does_not_get_synthetic_manual_install() -> None:
    payload = yaml.safe_load(
        """
        metadata:
          description: A test catalog for install injection.
        projects:
          - slug: example
            name: Example
            repo: example/iina-plugin
            description: A sufficiently descriptive IINA plugin entry.
            category: playback
            kind: plugin
        """
    )
    catalog = Catalog.model_validate(payload)
    dumped = catalog.model_dump(mode="json")
    assert dumped["projects"][0]["install"] == []
    json_payload = json.loads(catalog_as_json(catalog))
    assert json_payload["projects"][0]["install"] == []
    assert not any(
        method.get("kind") == "manual" for method in json_payload["projects"][0]["install"]
    )


def test_project_requires_exactly_one_location() -> None:
    with pytest.raises(ValidationError):
        CatalogProject(
            slug="missing",
            name="Missing",
            description="This project has no repository or external URL.",
            category=Category.PLAYBACK,
            kind=ProjectKind.PLUGIN,
        )


def test_duplicate_identifier_requires_explicit_collision_acknowledgement() -> None:
    with pytest.raises(ValidationError, match="duplicate plugin identifiers"):
        Catalog(
            metadata=CatalogMetadata(description="A test catalog."),
            projects=[
                _collision_project("one", "example/one"),
                _collision_project("two", "example/two"),
            ],
        )


def test_identifier_collision_without_notes_is_rejected() -> None:
    with pytest.raises(ValidationError, match="require non-empty notes"):
        Catalog(
            metadata=CatalogMetadata(description="A test catalog."),
            projects=[
                _collision_project("one", "example/one", identifier_collision_allowed=True),
                _collision_project("two", "example/two", identifier_collision_allowed=True),
            ],
        )


@pytest.mark.parametrize("notes", ["", "   "])
def test_identifier_collision_rejects_blank_notes(notes: str) -> None:
    with pytest.raises(ValidationError, match="require non-empty notes"):
        Catalog(
            metadata=CatalogMetadata(description="A test catalog."),
            projects=[
                _collision_project(
                    "one",
                    "example/one",
                    identifier_collision_allowed=True,
                    notes=notes,
                ),
                _collision_project(
                    "two",
                    "example/two",
                    identifier_collision_allowed=True,
                    notes="Shares plugin identifier dev.example.same with slug one.",
                ),
            ],
        )


def test_explicit_identifier_collision_is_allowed() -> None:
    catalog = Catalog(
        metadata=CatalogMetadata(description="A test catalog."),
        projects=[
            _collision_project(
                "one",
                "example/one",
                identifier_collision_allowed=True,
                notes="Shares plugin identifier dev.example.same with slug two.",
            ),
            _collision_project(
                "two",
                "example/two",
                identifier_collision_allowed=True,
                notes="Shares plugin identifier dev.example.same with slug one.",
            ),
        ],
    )
    assert len(catalog.projects) == 2


def test_official_entry_extracts_github_repository() -> None:
    entry = OfficialPluginEntry(
        name="Example",
        url="https://github.com/example/iina-plugin/tree/main",
        desc="Example plugin.",
        id="dev.example",
    )
    assert entry.github_repository == "example/iina-plugin"


def test_committed_catalog_loads() -> None:
    catalog = load_catalog(Path("src/awesome_iina/catalog/catalog.yaml"))
    assert len(catalog.projects) >= 60
    assert any(project.slug == "iina" for project in catalog.projects)
