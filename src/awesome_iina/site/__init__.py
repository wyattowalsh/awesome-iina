"""Build the branded, progressively enhanced static catalog from curated data."""

from __future__ import annotations

import json
from collections.abc import Sequence
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urljoin, urlsplit

from jinja2 import Environment, FileSystemLoader, StrictUndefined, select_autoescape

from awesome_iina.catalog import catalog_as_json, listed_in_iina_plugin_index, load_catalog
from awesome_iina.constants import CATEGORY_ORDER, CATEGORY_TITLES
from awesome_iina.models import CatalogProject, Category, ProjectKind, ProjectStatus
from awesome_iina.site.brand import _write_bytes, brand_payloads, confined_path

_STATUS_LABELS: dict[ProjectStatus, str] = {
    ProjectStatus.ACTIVE: "Active",
    ProjectStatus.BETA: "Beta",
    ProjectStatus.EXPERIMENTAL: "Experimental",
    ProjectStatus.HISTORICAL: "Historical",
    ProjectStatus.ARCHIVED: "Archived",
    ProjectStatus.UNKNOWN: "Unverified",
}

_SECTION_COPY: tuple[tuple[str, str, str], ...] = (
    (
        "iina-core",
        "IINA core",
        "The player and first-party website. Official means an iina/ repository or iina.io URL plus a first-party source, not a quality ranking.",
    ),
    (
        "official-plugins",
        "Official plugins",
        "Plugins maintained in the IINA GitHub organization. IINA's README currently highlights User Scripts, Online Media, and OpenSubtitles; other iina/ plugins are listed here separately.",
    ),
    (
        "plugin-index",
        "IINA plugin index",
        "Community plugins published in IINA's plugins.json. Index listing is not first-party ownership, not a security audit, and does not set official or active.",
    ),
    (
        "community-plugins",
        "Other native plugins",
        "Reviewed installable IINA plugins that are not in the published plugin index.",
    ),
    (
        "companions",
        "Companions and workflows",
        "Browser handoff, launchers, and other tools that talk to IINA without being a native plugin.",
    ),
    (
        "developer-resources",
        "Developer resources",
        "Templates, type definitions, build tools, and other first-party or reviewed tooling for plugin authors.",
    ),
    (
        "media-tooling",
        "Foundational media tooling",
        "Upstream libraries and CLIs that power or inspect IINA workflows. They are not native IINA plugins.",
    ),
    (
        "historical",
        "Historical",
        "Superseded or archived projects retained only for migration or implementation context.",
    ),
)


@dataclass(frozen=True, slots=True)
class CatalogSiteSection:
    id: str
    title: str
    description: str
    projects: tuple[CatalogProject, ...]


def site_section_id(project: CatalogProject) -> str:
    """Assign each catalog row to exactly one public site section."""
    if project.category is Category.HISTORICAL:
        return "historical"
    if project.category is Category.CORE:
        return "iina-core"
    if project.official and project.kind is ProjectKind.PLUGIN:
        return "official-plugins"
    if listed_in_iina_plugin_index(project):
        return "plugin-index"
    if project.kind is ProjectKind.PLUGIN:
        return "community-plugins"
    if project.category is Category.MEDIA_TOOLING or project.kind is ProjectKind.MEDIA_TOOL:
        return "media-tooling"
    if project.category is Category.DEVELOPMENT or project.kind is ProjectKind.DEVELOPMENT_TOOL:
        return "developer-resources"
    return "companions"


def group_catalog_sections(projects: Sequence[CatalogProject]) -> list[CatalogSiteSection]:
    """Partition curated projects into exclusive, named site sections."""
    buckets: dict[str, list[CatalogProject]] = {
        section_id: [] for section_id, _, _ in _SECTION_COPY
    }
    for project in projects:
        buckets[site_section_id(project)].append(project)
    return [
        CatalogSiteSection(
            id=section_id,
            title=title,
            description=description,
            projects=tuple(buckets[section_id]),
        )
        for section_id, title, description in _SECTION_COPY
        if buckets[section_id]
    ]


def site_payloads(root: Path) -> dict[str, bytes]:
    """Render only curated projects. No network requests or plugin execution occur."""
    catalog = load_catalog(root / "src/awesome_iina/catalog/catalog.yaml")
    here = Path(__file__).resolve().parent
    brand = json.loads((root / "src/awesome_iina/site/kit/source/tokens.json").read_text())
    deployment = json.loads((root / "src/awesome_iina/site/kit/source/deployment.json").read_text())
    project_url = deployment["project_url"]
    url = urlsplit(project_url)
    if url.scheme != "https" or not url.netloc or url.username or url.password:
        raise ValueError("the configured site URL must be a public HTTPS URL without credentials")
    projects = sorted(catalog.projects, key=lambda item: item.sort_key)
    for project in projects:
        target = urlsplit(project.project_url)
        if target.scheme != "https" or not target.netloc or target.username or target.password:
            raise ValueError(f"unsafe catalog link for {project.slug}")
    environment = Environment(
        loader=FileSystemLoader(here / "templates"),
        undefined=StrictUndefined,
        autoescape=select_autoescape(default=True),
        keep_trailing_newline=True,
    )
    categories = [(c.value, CATEGORY_TITLES[c]) for c in CATEGORY_ORDER]
    kinds = [kind.value for kind in ProjectKind]
    statuses = [(status.value, _STATUS_LABELS[status]) for status in ProjectStatus]
    used_kinds = {project.kind.value for project in projects}
    html = environment.get_template("index.html.j2").render(
        projects=projects,
        sections=group_catalog_sections(projects),
        copy=brand["copy"],
        deployment=deployment,
        social_image=urljoin(project_url, "assets/og/open-graph-1200x630.png"),
        categories=categories,
        kinds=kinds,
        statuses=statuses,
        status_labels={status.value: _STATUS_LABELS[status] for status in ProjectStatus},
        plugin_count=sum(p.kind == ProjectKind.PLUGIN for p in projects),
        index_count=sum(listed_in_iina_plugin_index(p) for p in projects),
        in_plugin_index=listed_in_iina_plugin_index,
        chrome_categories_json=json.dumps(
            [{"value": value, "label": title} for value, title in categories],
            separators=(",", ":"),
        ),
        chrome_kinds_json=json.dumps(
            [
                {"value": value, "label": value.replace("-", " ")}
                for value in kinds
                if value in used_kinds
            ],
            separators=(",", ":"),
        ),
        chrome_statuses_json=json.dumps(
            [{"value": value, "label": label} for value, label in statuses],
            separators=(",", ":"),
        ),
    )
    result = {
        name: data
        for name, data in brand_payloads(root).items()
        if name.startswith("assets/brand/")
    }
    result["index.html"] = html.encode("utf-8")
    result["catalog.json"] = catalog_as_json(catalog).encode("utf-8")
    for name in ("catalog.css", "catalog.js", "icons.svg"):
        result[f"assets/{name}"] = (here / "static" / name).read_bytes()
    ui_dir = here / "static" / "ui"
    for name in ("catalog-ui.js", "catalog-ui.css"):
        path = ui_dir / name
        if not path.is_file():
            raise FileNotFoundError(
                f"missing {path.relative_to(root)}; run `just site-ui-build` before site-build"
            )
        result[f"assets/ui/{name}"] = path.read_bytes()
    og_dir = here / "static" / "og"
    for name in (
        "open-graph-1200x630.png",
        "github-social-preview-1280x640.png",
        "share-card-1200x630-light.png",
        "MANIFEST.json",
    ):
        path = og_dir / name
        if not path.is_file():
            raise FileNotFoundError(
                f"missing {path.relative_to(root)}; run `just site-ui-build` before site-build"
            )
        result[f"assets/og/{name}"] = path.read_bytes()
    # No service worker: the static catalog makes no offline-app guarantee.
    result[".nojekyll"] = b""
    return result


def build_site(root: Path, output: Path) -> int:
    """Write a deterministic site into a dedicated dist/ child, protecting sources."""
    root = root.resolve()
    output = output.absolute()
    dist = root / "dist"
    if output.is_symlink() or not output.resolve().is_relative_to(dist.resolve()):
        raise ValueError("site output must be a child of the repository dist/ directory")
    if output.resolve() == dist.resolve():
        raise ValueError("use a dedicated child such as dist/site, not dist itself")
    output = confined_path(root, output.relative_to(root).as_posix())
    payloads = site_payloads(root)  # Validate everything before replacing any output.
    paths = {name: confined_path(output, name) for name in payloads}
    for name, content in payloads.items():
        _write_bytes(paths[name], content)
    return len(payloads)
