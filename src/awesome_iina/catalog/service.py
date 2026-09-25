from __future__ import annotations

import copy
import json
from collections import Counter
from pathlib import Path
from typing import TYPE_CHECKING, Any
from urllib.parse import urlparse

from pydantic import TypeAdapter

from awesome_iina.io_utils import load_model
from awesome_iina.models import Catalog, CatalogProject, Category, ProjectStatus

if TYPE_CHECKING:
    from awesome_iina.models import OfficialPluginEntry

_GITHUB_URL_HOST_PATTERN = (
    r"(?i)^https?://([^/?#]*@)?(([^/?#]*\.)?github\.com|"
    r"([^/?#]*\.)?githubusercontent\.com)([:/?#]|$)"
)


def load_catalog(path: Path) -> Catalog:
    return load_model(path, Catalog)


def catalog_schema() -> dict[str, Any]:
    schema = copy.deepcopy(TypeAdapter(Catalog).json_schema())
    _apply_project_location_contract(schema)
    return schema


def catalog_stats(catalog: Catalog) -> dict[str, Any]:
    by_category = Counter(project.category.value for project in catalog.projects)
    by_status = Counter(project.status.value for project in catalog.projects)
    plugin_count = sum(project.kind.value == "plugin" for project in catalog.projects)
    external_count = sum(project.repo is None for project in catalog.projects)
    return {
        "projects": len(catalog.projects),
        "plugins": plugin_count,
        "featured": sum(project.featured for project in catalog.projects),
        "official": sum(project.official for project in catalog.projects),
        "external": external_count,
        "categories": dict(sorted(by_category.items())),
        "statuses": dict(sorted(by_status.items())),
    }


def catalog_as_json(catalog: Catalog) -> str:
    payload = {
        "metadata": catalog.metadata.model_dump(mode="json"),
        "stats": catalog_stats(catalog),
        "projects": [
            {
                **project.model_dump(mode="json", exclude_none=True),
                "project_url": project.project_url,
            }
            for project in sorted(catalog.projects, key=lambda item: item.sort_key)
        ],
    }
    return json.dumps(payload, indent=2, ensure_ascii=False, sort_keys=True) + "\n"


def validate_catalog_policy(catalog: Catalog) -> list[str]:
    errors: list[str] = []
    for project in catalog.projects:
        if (
            project.status in {ProjectStatus.ARCHIVED, ProjectStatus.HISTORICAL}
            and project.category is not Category.HISTORICAL
            and not project.notes
        ):
            errors.append(
                f"{project.slug}: archived/historical projects outside the historical section "
                "must explain why they remain useful"
            )
        if project.official and not (
            _is_first_party_location(project) and _has_first_party_source(project)
        ):
            errors.append(
                f"{project.slug}: official=true requires an iina/ repository or "
                "iina.io / github.com/iina/ URL, plus a first-party source"
            )
        if project.kind.value == "plugin" and project.official and not project.plugin_identifier:
            errors.append(f"{project.slug}: official plugin entries must include plugin_identifier")
        if project.featured and project.status in {
            ProjectStatus.ARCHIVED,
            ProjectStatus.HISTORICAL,
        }:
            errors.append(f"{project.slug}: archived projects cannot be featured")
    return errors


def audit_official_plugins(
    catalog: Catalog,
    plugins: list[OfficialPluginEntry],
) -> list[str]:
    by_repository = {
        project.repo.casefold(): project for project in catalog.projects if project.repo is not None
    }
    by_url = {
        project.url.casefold(): project for project in catalog.projects if project.url is not None
    }
    errors: list[str] = []
    for plugin in plugins:
        project = None
        if repository := plugin.github_repository:
            project = by_repository.get(repository.casefold())
        else:
            project = by_url.get(plugin.url.casefold())
        if project is None:
            errors.append(f"missing official-index plugin: {plugin.name} ({plugin.url})")
            continue
        if project.plugin_identifier != plugin.id:
            errors.append(
                f"{project.slug}: identifier {project.plugin_identifier!r} does not match "
                f"official index {plugin.id!r}"
            )
    return errors


def _apply_project_location_contract(schema: dict[str, Any]) -> None:
    defs = schema.get("$defs")
    project = defs.get("CatalogProject") if isinstance(defs, dict) else None
    if not isinstance(project, dict):
        raise ValueError("generated catalog schema is missing $defs.CatalogProject")
    url_schema = project.get("properties", {}).get("url")
    if not isinstance(url_schema, dict):
        raise ValueError("generated catalog schema is missing CatalogProject.url")
    _reject_github_url_hosts(url_schema)
    project["oneOf"] = [
        {
            "properties": {
                "repo": {"type": "string"},
                "url": {"type": "null"},
            },
            "required": ["repo"],
        },
        {
            "properties": {
                "repo": {"type": "null"},
                "url": {"type": "string"},
            },
            "required": ["url"],
        },
    ]


def _reject_github_url_hosts(url_schema: dict[str, Any]) -> None:
    github_host_not = {"pattern": _GITHUB_URL_HOST_PATTERN}
    options = url_schema.get("anyOf")
    if isinstance(options, list):
        for option in options:
            if isinstance(option, dict) and option.get("type") == "string":
                option["not"] = github_host_not
        return
    if url_schema.get("type") == "string":
        url_schema["not"] = github_host_not


def _is_first_party_location(project: CatalogProject) -> bool:
    if project.repo and project.repo.casefold().startswith("iina/"):
        return True
    if project.url is None:
        return False
    return _is_first_party_location_url(project.url)


def _has_first_party_source(project: CatalogProject) -> bool:
    return any(_is_first_party_source_url(source.url) for source in project.sources)


def _is_first_party_source_url(url: str) -> bool:
    return _is_first_party_location_url(url) and not _is_iina_plugin_index_url(url)


def _is_first_party_location_url(url: str) -> bool:
    parsed = urlparse(url)
    host = (parsed.hostname or "").casefold()
    if host == "iina.io" or host.endswith(".iina.io"):
        return True
    if host not in {"github.com", "www.github.com"}:
        return False
    parts = [part for part in parsed.path.split("/") if part]
    return bool(parts) and parts[0].casefold() == "iina"


def listed_in_iina_plugin_index(project: CatalogProject) -> bool:
    """Return True when a source URL is IINA's published plugins.json index."""
    return any(_is_iina_plugin_index_url(source.url) for source in project.sources)


def _is_iina_plugin_index_url(url: str) -> bool:
    parsed = urlparse(url)
    host = (parsed.hostname or "").casefold()
    githubish = host in {
        "github.com",
        "www.github.com",
        "raw.githubusercontent.com",
    } or host.endswith(".githubusercontent.com")
    if not githubish:
        return False
    parts = [part.casefold() for part in parsed.path.split("/") if part]
    return (
        len(parts) >= 3
        and parts[0] == "iina"
        and parts[1] == "iina"
        and parts[-1] == "plugins.json"
    )
