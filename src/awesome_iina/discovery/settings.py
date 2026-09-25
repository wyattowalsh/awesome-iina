from __future__ import annotations

from datetime import date
from hashlib import sha256
from pathlib import Path
from typing import Literal

import yaml
from pydantic import Field

from awesome_iina.models import StrictModel


class RepositoryQueryConfig(StrictModel):
    id: str
    query: str
    weight: int = 20
    enabled: bool = True
    quick: bool = False
    date_sharding: bool = True


class CodeQueryConfig(StrictModel):
    id: str
    query: str
    weight: int = 45
    enabled: bool = True
    quick: bool = False


class SourceConfig(StrictModel):
    id: str
    kind: str
    repository: str | None = None
    path: str | None = None
    ref: str | None = None
    url: str | None = None
    destination: Path | None = None
    weight: int = 80
    enabled: bool = True


class ScoringConfig(StrictModel):
    accept_threshold: int = 70
    review_threshold: int = 35
    archived_penalty: int = 20
    fork_penalty: int = 12
    empty_penalty: int = 40
    disabled_penalty: int = 80
    valid_manifest_bonus: int = 90
    gh_repo_match_bonus: int = 25
    official_org_bonus: int = 80
    topic_iina_plugin_bonus: int = 45
    topic_iina_bonus: int = 20
    name_iina_bonus: int = 20
    description_iina_bonus: int = 15


class CategoryInferenceConfig(StrictModel):
    official_org_prefix: str = "iina/"
    core_repositories: list[str] = Field(default_factory=lambda: ["iina/iina", "iina/iina-website"])
    official_plugin_name_contains: list[str] = Field(default_factory=lambda: ["/plugin-"])
    official_org_fallback: str = "development"


class GithubConfig(StrictModel):
    host: str = "github.com"
    api_version: str = "2026-03-10"
    page_size: int = Field(default=100, ge=1, le=100)
    search_cap: int = Field(default=1000, ge=1, le=1000)
    repository_backend: Literal["graphql", "rest"] = "graphql"
    request_timeout_seconds: float = Field(default=45.0, gt=0, le=300)
    max_requests: int = Field(default=2000, ge=1)
    max_total_wait_seconds: float = Field(default=900.0, ge=0)
    max_content_bytes: int = Field(default=1_000_000, ge=1, le=10_000_000)
    repository_search_delay_seconds: float = Field(default=2.1, ge=0)
    repository_request_delay_seconds: float = Field(default=0.35, ge=0)
    code_search_delay_seconds: float = Field(default=6.2, ge=0)
    max_retries: int = Field(default=6, ge=0)
    initial_backoff_seconds: float = Field(default=2.0, ge=0)
    max_backoff_seconds: float = Field(default=120.0, ge=1)
    max_shard_depth: int = Field(default=30, ge=1)
    created_from: date = date(2007, 1, 1)
    created_to: date | None = None
    enrichment_batch_size: int = Field(default=20, ge=1, le=50)
    deep_candidate_limit: int = Field(default=500, ge=1)


class PathsConfig(StrictModel):
    discovery_output: Path = Path("output/discovery/latest.json")
    review_output: Path = Path("output/discovery/review.yaml")
    report_output: Path = Path("output/discovery-latest.md")
    official_plugins_snapshot: Path = Path("src/awesome_iina/discovery/snapshots/iina-plugins.json")
    catalog: Path = Path("src/awesome_iina/catalog/catalog.yaml")
    overrides: Path = Path("src/awesome_iina/discovery/overrides.yaml")
    readme_template: Path = Path("src/awesome_iina/catalog/templates/README.md.j2")
    readme: Path = Path("README.md")


class DiscoveryConfig(StrictModel):
    version: int = 1
    github: GithubConfig = Field(default_factory=GithubConfig)
    scoring: ScoringConfig = Field(default_factory=ScoringConfig)
    category_inference: CategoryInferenceConfig = Field(default_factory=CategoryInferenceConfig)
    paths: PathsConfig = Field(default_factory=PathsConfig)
    repository_queries: list[RepositoryQueryConfig]
    code_queries: list[CodeQueryConfig]
    sources: list[SourceConfig] = Field(default_factory=list)
    negative_terms: list[str] = Field(default_factory=list)
    media_context_terms: list[str] = Field(default_factory=list)


def load_config(path: Path) -> DiscoveryConfig:
    raw = path.read_bytes()
    data = yaml.safe_load(raw)
    return DiscoveryConfig.model_validate(data)


def config_digest(path: Path) -> str:
    return sha256(path.read_bytes()).hexdigest()
