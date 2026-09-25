from __future__ import annotations

from datetime import date, datetime
from enum import StrEnum
from typing import Any, Literal, Self

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


class StrictModel(BaseModel):
    """Base model for committed data whose schema must remain explicit."""

    model_config = ConfigDict(extra="forbid", validate_assignment=True)


class Category(StrEnum):
    CORE = "core"
    OFFICIAL_PLUGIN = "official-plugin"
    PLAYBACK = "playback"
    SUBTITLES = "subtitles-language"
    LIBRARIES = "libraries-streaming"
    CAPTURE = "capture-editing"
    ENHANCEMENT = "enhancement-rendering"
    CASTING = "casting-integrations"
    TRACKING = "tracking-scrobbling"
    AUTOMATION = "automation-companions"
    DEVELOPMENT = "development"
    MEDIA_TOOLING = "media-tooling"
    HISTORICAL = "historical"


class ProjectKind(StrEnum):
    APP = "app"
    PLUGIN = "plugin"
    COMPANION = "companion"
    DEVELOPMENT_TOOL = "development-tool"
    MEDIA_TOOL = "media-tool"
    SCRIPT = "script"
    SHADER = "shader"
    CONFIG = "config"
    GUIDE = "guide"
    LIBRARY = "library"
    SERVICE = "service"


class ProjectStatus(StrEnum):
    ACTIVE = "active"
    BETA = "beta"
    EXPERIMENTAL = "experimental"
    HISTORICAL = "historical"
    ARCHIVED = "archived"
    UNKNOWN = "unknown"


class InstallKind(StrEnum):
    IINA_GITHUB = "iina-github"
    IINA_PACKAGE = "iina-package"
    HOMEBREW = "homebrew"
    MANUAL = "manual"
    BUNDLED = "bundled"
    EXTERNAL = "external"


class InstallMethod(StrictModel):
    kind: InstallKind
    value: str | None = None
    note: str | None = None


class SourceReference(StrictModel):
    label: str
    url: str


class CatalogProject(StrictModel):
    slug: str = Field(pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    name: str = Field(min_length=2, max_length=100)
    repo: str | None = Field(default=None, pattern=r"^[^/\s]+/[^/\s]+$")
    url: str | None = None
    description: str = Field(min_length=20, max_length=240)
    category: Category
    kind: ProjectKind
    status: ProjectStatus = ProjectStatus.UNKNOWN
    official: bool = False
    featured: bool = False
    plugin_identifier: str | None = None
    identifier_collision_allowed: bool = False
    minimum_iina: str | None = None
    license: str | None = None
    tags: list[str] = Field(default_factory=list)
    install: list[InstallMethod] = Field(default_factory=list)
    sources: list[SourceReference] = Field(default_factory=list)
    notes: str | None = None

    @field_validator("description")
    @classmethod
    def validate_description(cls, value: str) -> str:
        cleaned = " ".join(value.split())
        if cleaned[-1] not in ".!?)":
            raise ValueError("description must end with punctuation")
        return cleaned

    @field_validator("tags")
    @classmethod
    def normalize_tags(cls, value: list[str]) -> list[str]:
        return sorted({tag.strip().lower() for tag in value if tag.strip()})

    @model_validator(mode="after")
    def validate_location(self) -> Self:
        if bool(self.repo) == bool(self.url):
            raise ValueError("exactly one of repo or url must be set")
        return self

    @property
    def project_url(self) -> str:
        return self.url or f"https://github.com/{self.repo}"

    @property
    def sort_key(self) -> tuple[str, str]:
        return (self.name.casefold(), self.slug)


class CatalogMetadata(StrictModel):
    title: str = "Awesome IINA"
    description: str
    version: int = 1
    repository: str = "wyattowalsh/awesome-iina"
    generated_notice: str = "Catalog sections are generated from src/awesome_iina/catalog/catalog.yaml. Edit the catalog, not README.md."


class Catalog(StrictModel):
    metadata: CatalogMetadata
    projects: list[CatalogProject]

    @model_validator(mode="after")
    def validate_uniqueness(self) -> Self:
        def duplicates(values: list[str]) -> set[str]:
            seen: set[str] = set()
            repeated: set[str] = set()
            for value in values:
                key = value.casefold()
                if key in seen:
                    repeated.add(value)
                seen.add(key)
            return repeated

        slug_dupes = duplicates([project.slug for project in self.projects])
        repo_dupes = duplicates([project.repo for project in self.projects if project.repo])
        identifier_groups: dict[str, list[CatalogProject]] = {}
        for project in self.projects:
            if project.plugin_identifier:
                identifier_groups.setdefault(project.plugin_identifier.casefold(), []).append(
                    project
                )
        identifier_dupes: set[str] = set()
        identifier_note_gaps: set[str] = set()
        for key, grouped in identifier_groups.items():
            if len(grouped) < 2:
                continue
            identifier = grouped[0].plugin_identifier or key
            if not all(item.identifier_collision_allowed for item in grouped):
                identifier_dupes.add(identifier)
            if not all(item.notes and item.notes.strip() for item in grouped):
                identifier_note_gaps.add(identifier)
        errors: list[str] = []
        if slug_dupes:
            errors.append(f"duplicate slugs: {sorted(slug_dupes)}")
        if repo_dupes:
            errors.append(f"duplicate repositories: {sorted(repo_dupes)}")
        if identifier_dupes:
            errors.append(f"duplicate plugin identifiers: {sorted(identifier_dupes)}")
        if identifier_note_gaps:
            errors.append(
                "colliding plugin identifiers require non-empty notes: "
                f"{sorted(identifier_note_gaps)}"
            )
        if errors:
            raise ValueError("; ".join(errors))
        return self


class EvidenceKind(StrEnum):
    REPOSITORY_SEARCH = "repository-search"
    CODE_SEARCH = "code-search"
    OFFICIAL_ORG = "official-org"
    OFFICIAL_PLUGIN_INDEX = "official-plugin-index"
    PLUGIN_MANIFEST = "plugin-manifest"
    LEGACY_LIST = "legacy-list"
    MANUAL = "manual"


class DiscoveryEvidence(StrictModel):
    kind: EvidenceKind
    source_id: str
    query: str | None = None
    path: str | None = None
    url: str | None = None
    weight: int = 0
    details: dict[str, Any] = Field(default_factory=dict)

    @property
    def identity(self) -> tuple[str, str, str, str]:
        return (self.kind.value, self.source_id, self.query or "", self.path or "")


class RepositorySnapshot(StrictModel):
    node_id: str | None = None
    database_id: int | None = None
    name_with_owner: str
    url: str
    description: str | None = None
    homepage_url: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None
    pushed_at: datetime | None = None
    archived: bool = False
    disabled: bool = False
    empty: bool = False
    fork: bool = False
    mirror: bool = False
    template: bool = False
    stars: int = 0
    forks: int = 0
    watchers: int = 0
    open_issues: int = 0
    open_pull_requests: int = 0
    disk_usage_kb: int | None = None
    license_spdx: str | None = None
    primary_language: str | None = None
    languages: dict[str, int] = Field(default_factory=dict)
    topics: list[str] = Field(default_factory=list)
    default_branch: str | None = None
    latest_release_tag: str | None = None
    latest_release_at: datetime | None = None
    release_count: int = 0
    parent: str | None = None
    private: bool = False
    aliases: list[str] = Field(default_factory=list)

    @field_validator("topics")
    @classmethod
    def normalize_topics(cls, value: list[str]) -> list[str]:
        return sorted({topic.casefold() for topic in value})


class PluginAuthor(StrictModel):
    name: str
    email: str | None = None
    url: str | None = None


class PluginManifest(BaseModel):
    """Tolerant subset of IINA's Info.json plugin manifest."""

    model_config = ConfigDict(extra="allow")

    name: str
    version: str
    identifier: str
    author: PluginAuthor | str
    entry: str
    description: str | None = None
    globalEntry: str | None = None  # noqa: N815
    preferencesPage: str | None = None  # noqa: N815
    helpPage: str | None = None  # noqa: N815
    permissions: list[str] = Field(default_factory=list)
    allowedDomains: list[str] = Field(default_factory=list)  # noqa: N815
    ghRepo: str | None = None  # noqa: N815
    ghVersion: int | None = None  # noqa: N815


class DiscoveryBackend(StrEnum):
    REST = "rest"
    GRAPHQL = "graphql"
    MERGED = "merged"


class CandidateDecision(StrEnum):
    ACCEPT = "accept"
    REVIEW = "review"
    REJECT = "reject"


class Candidate(StrictModel):
    repository: RepositorySnapshot
    evidence: list[DiscoveryEvidence] = Field(default_factory=list)
    manifest: PluginManifest | None = None
    manifest_path: str | None = None
    manifest_errors: list[str] = Field(default_factory=list)
    score: int = 0
    decision: CandidateDecision = CandidateDecision.REVIEW
    inferred_categories: list[Category] = Field(default_factory=list)
    reasons: list[str] = Field(default_factory=list)
    manual_note: str | None = None

    def add_evidence(self, evidence: DiscoveryEvidence) -> None:
        identities = {item.identity for item in self.evidence}
        if evidence.identity not in identities:
            self.evidence.append(evidence)


class SearchShard(StrictModel):
    query_id: str
    base_query: str
    created_from: date
    created_to: date
    stars_min: int | None = None
    stars_max: int | None = None
    size_min: int | None = None
    size_max: int | None = None
    depth: int = 0

    def compile_query(self) -> str:
        parts = [
            self.base_query,
            f"created:{self.created_from.isoformat()}..{self.created_to.isoformat()}",
        ]
        if self.stars_min is not None and self.stars_max is not None:
            parts.append(f"stars:{self.stars_min}..{self.stars_max}")
        if self.size_min is not None and self.size_max is not None:
            parts.append(f"size:{self.size_min}..{self.size_max}")
        return " ".join(parts)


class QueryOutcome(StrictModel):
    query_id: str
    query: str
    kind: EvidenceKind
    backend: DiscoveryBackend | None = None
    total_count: int
    returned_count: int
    complete: bool
    incomplete_reason: str | None = None


class DiscoveryRun(StrictModel):
    exhaustive: Literal[False] = False
    coverage_scope: Literal["configured-public-search-results"] = "configured-public-search-results"
    schema_version: int = 1
    started_at: datetime
    finished_at: datetime
    config_sha256: str
    mode: str
    repository_backend: DiscoveryBackend | None = None
    candidates: list[Candidate]
    outcomes: list[QueryOutcome]
    warnings: list[str] = Field(default_factory=list)

    @property
    def accepted(self) -> int:
        return sum(candidate.decision is CandidateDecision.ACCEPT for candidate in self.candidates)

    @property
    def review(self) -> int:
        return sum(candidate.decision is CandidateDecision.REVIEW for candidate in self.candidates)

    @property
    def rejected(self) -> int:
        return sum(candidate.decision is CandidateDecision.REJECT for candidate in self.candidates)

    @property
    def complete(self) -> bool:
        return bool(self.outcomes) and all(outcome.complete for outcome in self.outcomes)


class OverrideRecord(StrictModel):
    decision: CandidateDecision | None = None
    score_delta: int = 0
    categories: list[Category] | None = None
    note: str | None = None


class OverrideFile(StrictModel):
    version: int = 1
    repositories: dict[str, OverrideRecord] = Field(default_factory=dict)

    @field_validator("repositories")
    @classmethod
    def normalize_repository_keys(
        cls, value: dict[str, OverrideRecord]
    ) -> dict[str, OverrideRecord]:
        return {key.casefold(): item for key, item in value.items()}


class OfficialPluginEntry(StrictModel):
    name: str
    url: str
    desc: str
    id: str

    @property
    def github_repository(self) -> str | None:
        prefix = "https://github.com/"
        if not self.url.startswith(prefix):
            return None
        remainder = self.url.removeprefix(prefix).strip("/")
        parts = remainder.split("/")
        return "/".join(parts[:2]) if len(parts) >= 2 else None


class SourceSnapshot(StrictModel):
    schema_version: int = 1
    source_id: str
    fetched_at: datetime
    source_url: str
    sha256: str
    content_sha256: str
    content: Any


class ToolAvailability(StrictModel):
    name: str
    executable: str | None = None
    available: bool
    version: str | None = None


class MediaTrack(StrictModel):
    index: int
    kind: str
    codec: str | None = None
    codec_long_name: str | None = None
    language: str | None = None
    title: str | None = None
    default: bool | None = None
    forced: bool | None = None
    width: int | None = None
    height: int | None = None
    frame_rate: str | None = None
    channels: int | None = None
    channel_layout: str | None = None
    sample_rate: int | None = None
    bit_rate: int | None = None
    pixel_format: str | None = None
    color_space: str | None = None
    color_transfer: str | None = None
    color_primaries: str | None = None
    hdr: list[str] = Field(default_factory=list)


class MediaReport(StrictModel):
    schema_version: int = 1
    generated_at: datetime
    path: str
    size_bytes: int
    suffix: str
    container: str | None = None
    duration_seconds: float | None = None
    overall_bit_rate: int | None = None
    tracks: list[MediaTrack] = Field(default_factory=list)
    chapters: int = 0
    attachments: int = 0
    tools: list[ToolAvailability] = Field(default_factory=list)
    raw: dict[str, Any] = Field(default_factory=dict)
    warnings: list[str] = Field(default_factory=list)
