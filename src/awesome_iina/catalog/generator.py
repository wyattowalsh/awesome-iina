from __future__ import annotations

import json
from collections import defaultdict
from pathlib import Path
from typing import Any

from jinja2 import Environment, FileSystemLoader, StrictUndefined, select_autoescape

from awesome_iina.catalog import catalog_as_json, catalog_schema, catalog_stats
from awesome_iina.constants import CATEGORY_DESCRIPTIONS, CATEGORY_ORDER, CATEGORY_TITLES
from awesome_iina.discovery.settings import DiscoveryConfig
from awesome_iina.io_utils import atomic_write_text
from awesome_iina.models import (
    Catalog,
    CatalogProject,
    Category,
    DiscoveryRun,
    MediaReport,
    OverrideFile,
    ProjectStatus,
    SourceSnapshot,
)

_STATUS_LABELS: dict[ProjectStatus, str] = {
    ProjectStatus.ACTIVE: "",
    ProjectStatus.BETA: " **Beta.**",
    ProjectStatus.EXPERIMENTAL: " **Experimental.**",
    ProjectStatus.HISTORICAL: " **Historical.**",
    ProjectStatus.ARCHIVED: " **Archived.**",
    ProjectStatus.UNKNOWN: " **Maintenance status unverified.**",
}


def markdown_escape(value: str) -> str:
    return value.replace("|", "\\|").replace("<", "&lt;").replace(">", "&gt;")


def render_project(project: CatalogProject) -> str:
    flags: list[str] = []
    if project.official:
        flags.append("Official")
    if project.featured:
        flags.append("Featured")
    flag_text = f" `{' · '.join(flags)}`" if flags else ""
    status = _STATUS_LABELS[project.status]
    tags = ""
    if project.tags:
        tags = " " + " ".join(f"`{markdown_escape(tag)}`" for tag in project.tags[:5])
    notes = f" {project.notes}" if project.notes else ""
    return (
        f"- **[{markdown_escape(project.name)}]({project.project_url})**{flag_text}"
        f"{status} {markdown_escape(project.description)}{tags}{notes}"
    )


def _render_context(catalog: Catalog) -> dict[str, Any]:
    grouped: dict[Category, list[CatalogProject]] = defaultdict(list)
    for project in catalog.projects:
        grouped[project.category].append(project)
    sections = [
        {
            "category": category,
            "title": CATEGORY_TITLES[category],
            "description": CATEGORY_DESCRIPTIONS[category],
            "projects": sorted(grouped[category], key=lambda item: item.sort_key),
        }
        for category in CATEGORY_ORDER
        if grouped[category]
    ]
    return {
        "catalog": catalog,
        "stats": catalog_stats(catalog),
        "sections": sections,
        "featured": sorted(
            (project for project in catalog.projects if project.featured),
            key=lambda item: item.sort_key,
        ),
    }


def render_readme(catalog: Catalog, template_path: Path) -> str:
    environment = Environment(
        loader=FileSystemLoader(template_path.parent),
        undefined=StrictUndefined,
        autoescape=select_autoescape(default=False),
        trim_blocks=False,
        lstrip_blocks=True,
        keep_trailing_newline=True,
    )
    environment.filters["project"] = render_project
    template = environment.get_template(template_path.name)
    rendered = template.render(**_render_context(catalog))
    return rendered.rstrip() + "\n"


def schema_outputs(directory: Path = Path("src/awesome_iina/catalog/schemas")) -> dict[Path, str]:
    """Return deterministic JSON Schemas for every persisted public model."""

    models = {
        "catalog.schema.json": catalog_schema(),
        "discovery-config.schema.json": DiscoveryConfig.model_json_schema(),
        "discovery-run.schema.json": DiscoveryRun.model_json_schema(),
        "media-report.schema.json": MediaReport.model_json_schema(),
        "overrides.schema.json": OverrideFile.model_json_schema(),
        "source-snapshot.schema.json": SourceSnapshot.model_json_schema(),
    }
    return {
        directory / name: json.dumps(schema, indent=2, ensure_ascii=False, sort_keys=True) + "\n"
        for name, schema in models.items()
    }


def generated_outputs(
    catalog: Catalog,
    *,
    template_path: Path,
    readme_path: Path,
    catalog_json_path: Path = Path("src/awesome_iina/catalog/exports/catalog.json"),
    schema_directory: Path = Path("src/awesome_iina/catalog/schemas"),
) -> dict[Path, str]:
    return {
        readme_path: render_readme(catalog, template_path),
        catalog_json_path: catalog_as_json(catalog),
        **schema_outputs(schema_directory),
    }


def write_or_check(outputs: dict[Path, str], *, check: bool) -> list[Path]:
    changed: list[Path] = []
    for path, expected in outputs.items():
        current = path.read_text(encoding="utf-8") if path.exists() else None
        if current == expected:
            continue
        changed.append(path)
        if not check:
            atomic_write_text(path, expected)
    return changed
