from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from awesome_iina.discovery.settings import DiscoveryConfig, GithubConfig
from awesome_iina.discovery.sources import content_sha256
from awesome_iina.io_utils import write_json
from awesome_iina.models import RepositorySnapshot


def node(repository: str, *, description: str = "An IINA plugin.") -> dict[str, Any]:
    return {
        "id": f"R_{repository}",
        "databaseId": 1,
        "nameWithOwner": repository,
        "url": f"https://github.com/{repository}",
        "description": description,
        "createdAt": "2025-01-01T00:00:00Z",
        "updatedAt": "2026-01-01T00:00:00Z",
        "pushedAt": "2026-01-01T00:00:00Z",
        "isArchived": False,
        "isDisabled": False,
        "isEmpty": False,
        "isFork": False,
        "isMirror": False,
        "isTemplate": False,
        "stargazerCount": 5,
        "forkCount": 1,
        "repositoryTopics": {"nodes": [{"topic": {"name": "iina-plugin"}}]},
        "defaultBranchRef": {"name": "main"},
    }


class FakeClient:
    def __init__(self) -> None:
        self.config = GithubConfig(
            page_size=1,
            search_cap=1000,
            repository_request_delay_seconds=0,
            code_search_delay_seconds=0,
        )
        self.repository_calls: list[tuple[str, str | None]] = []
        self.code_calls: list[tuple[str, int]] = []

    def search_repositories_page(
        self, query: str, *, cursor: str | None = None, page_size: int | None = None
    ) -> dict[str, Any]:
        del page_size
        self.repository_calls.append((query, cursor))
        if cursor is None:
            return {
                "repositoryCount": 2,
                "nodes": [node("example/first")],
                "pageInfo": {"hasNextPage": True, "endCursor": "cursor-1"},
            }
        return {
            "repositoryCount": 2,
            "nodes": [node("example/second")],
            "pageInfo": {"hasNextPage": False, "endCursor": "cursor-2"},
        }

    def search_code_page(self, query: str, *, page: int, per_page: int | None = None) -> dict:
        del per_page
        self.code_calls.append((query, page))
        if page == 1:
            return {
                "total_count": 1,
                "incomplete_results": False,
                "items": [
                    {
                        "path": "Info.json",
                        "html_url": "https://github.com/example/code/blob/main/Info.json",
                        "repository": {
                            "full_name": "example/code",
                            "html_url": "https://github.com/example/code",
                            "description": "IINA plugin code result.",
                            "fork": False,
                        },
                    }
                ],
            }
        return {"total_count": 1, "incomplete_results": False, "items": []}

    def enrich_repositories(
        self, repositories: Any
    ) -> tuple[dict[str, RepositorySnapshot], list[str]]:
        return (
            {
                repository.casefold(): RepositorySnapshot(
                    name_with_owner=repository,
                    url=f"https://github.com/{repository}",
                    description="An IINA plugin.",
                    topics=["iina-plugin"],
                    default_branch="main",
                )
                for repository in repositories
            },
            [],
        )

    def get_content(self, repository: str, path: str, *, ref: str | None = None) -> bytes | None:
        del ref
        if path != "Info.json":
            return None
        return json.dumps(
            {
                "name": "Example",
                "version": "1.0.0",
                "identifier": f"dev.{repository.replace('/', '.')}",
                "author": "Test",
                "entry": "dist/index.js",
                "ghRepo": repository,
            }
        ).encode()


def write_official_snapshot(path: Path, content: list[dict[str, Any]]) -> None:
    write_json(
        path,
        {
            "schema_version": 1,
            "source_id": "official-iina-plugins",
            "fetched_at": "2026-01-01T00:00:00Z",
            "source_url": "https://example.test/plugins.json",
            "sha256": "0" * 64,
            "content_sha256": content_sha256(content),
            "content": content,
        },
    )


def config(tmp_path: Path) -> DiscoveryConfig:
    cfg = DiscoveryConfig.model_validate(
        {
            "github": {
                "page_size": 1,
                "search_cap": 1000,
                "repository_request_delay_seconds": 0,
                "code_search_delay_seconds": 0,
                "created_from": "2025-01-01",
                "created_to": "2025-01-01",
            },
            "paths": {
                "discovery_output": str(tmp_path / "run.json"),
                "review_output": str(tmp_path / "review.yaml"),
                "report_output": str(tmp_path / "report.md"),
                "official_plugins_snapshot": str(tmp_path / "plugins.json"),
                "catalog": "src/awesome_iina/catalog/catalog.yaml",
                "overrides": str(tmp_path / "overrides.yaml"),
                "readme_template": "src/awesome_iina/catalog/templates/README.md.j2",
                "readme": "README.md",
            },
            "repository_queries": [
                {
                    "id": "test-repositories",
                    "query": "topic:iina-plugin",
                    "weight": 40,
                    "quick": True,
                    "date_sharding": False,
                }
            ],
            "code_queries": [
                {
                    "id": "test-code",
                    "query": "ghRepo filename:Info.json",
                    "weight": 50,
                    "quick": True,
                }
            ],
            "sources": [{"id": "official-iina-plugins", "kind": "github-json", "weight": 100}],
        }
    )
    write_official_snapshot(cfg.paths.official_plugins_snapshot, [])
    return cfg
