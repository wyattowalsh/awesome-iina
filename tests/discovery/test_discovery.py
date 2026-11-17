from __future__ import annotations

import json
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from tests.helpers.discovery_fakes import FakeClient, config, write_official_snapshot

from awesome_iina.discovery import (
    add_official_plugin_evidence,
    classify_candidates,
    discover_code_query,
    discover_repository_query,
    enrich_candidates,
    inspect_manifest,
    load_discovery_run,
    load_overrides,
    reclassify_run,
    run_discovery,
    save_discovery_run,
)
from awesome_iina.io_utils import write_yaml
from awesome_iina.models import (
    Candidate,
    CandidateDecision,
    DiscoveryRun,
    EvidenceKind,
    OfficialPluginEntry,
    OverrideFile,
    RepositorySnapshot,
)


def test_same_name_with_different_node_ids_stay_separate() -> None:
    from awesome_iina.discovery.pipeline import _candidate_for

    candidates: dict[str, Candidate] = {}
    first = _candidate_for(
        candidates,
        "example/plugin",
        snapshot=RepositorySnapshot(
            node_id="R_first",
            database_id=1,
            name_with_owner="example/plugin",
            url="https://github.com/example/plugin",
        ),
    )
    second = _candidate_for(
        candidates,
        "example/plugin",
        snapshot=RepositorySnapshot(
            node_id="R_second",
            database_id=2,
            name_with_owner="example/plugin",
            url="https://github.com/example/plugin",
        ),
    )
    assert first is not second
    assert {item.repository.node_id for item in candidates.values()} == {"R_first", "R_second"}
    renamed = _candidate_for(
        candidates,
        "example/other",
        snapshot=RepositorySnapshot(
            node_id="R_second",
            database_id=2,
            name_with_owner="example/other",
            url="https://github.com/example/other",
        ),
    )
    assert renamed is second
    assert first.repository.node_id == "R_first"
    assert list(candidates.values()).count(second) == 1
    assert len(candidates) == 2


def test_repository_pagination_continues_after_a_private_only_page(tmp_path: Path) -> None:
    from awesome_iina.discovery.settings import GithubConfig

    class PrivateThenPublic:
        def __init__(self) -> None:
            self.config = GithubConfig(
                page_size=1,
                search_cap=1000,
                repository_request_delay_seconds=0,
                code_search_delay_seconds=0,
            )

        def get_content(
            self, repository: str, path: str, *, ref: str | None = None
        ) -> bytes | None:
            del repository, path, ref
            raise AssertionError("repository pagination does not fetch content")

        def search_code_page(
            self, query: str, *, page: int, per_page: int | None = None
        ) -> dict[str, Any]:
            del query, page, per_page
            raise AssertionError("repository pagination does not search code")

        def enrich_repositories(
            self, repositories: object
        ) -> tuple[dict[str, RepositorySnapshot], list[str]]:
            del repositories
            raise AssertionError("repository pagination does not enrich")

        def search_repositories_page(
            self,
            query: str,
            *,
            cursor: str | None = None,
            page_size: int | None = None,
        ) -> dict[str, Any]:
            del query, page_size
            if cursor is None:
                return {
                    "repositoryCount": 2,
                    "nodes": [
                        {
                            "id": "R_private",
                            "nameWithOwner": "secret/hidden",
                            "isPrivate": True,
                        }
                    ],
                    "pageInfo": {"hasNextPage": True, "endCursor": "cursor-1"},
                }
            return {
                "repositoryCount": 2,
                "nodes": [
                    {
                        "id": "R_public",
                        "nameWithOwner": "example/public",
                        "url": "https://github.com/example/public",
                        "isPrivate": False,
                    }
                ],
                "pageInfo": {"hasNextPage": False, "endCursor": "cursor-2"},
            }

    candidates: dict[str, Candidate] = {}
    outcomes = discover_repository_query(
        PrivateThenPublic(),
        config(tmp_path).repository_queries[0],
        config(tmp_path),
        candidates,
    )
    assert "example/public" in candidates
    assert outcomes[0].returned_count == 1


def test_repository_pagination_stops_when_private_pages_do_not_end(tmp_path: Path) -> None:
    from awesome_iina.discovery.settings import GithubConfig

    class EndlessPrivate:
        def __init__(self) -> None:
            self.config = GithubConfig(
                page_size=1,
                search_cap=3,
                repository_request_delay_seconds=0,
                code_search_delay_seconds=0,
            )
            self.calls = 0

        def get_content(
            self, repository: str, path: str, *, ref: str | None = None
        ) -> bytes | None:
            del repository, path, ref
            return None

        def search_code_page(
            self, query: str, *, page: int, per_page: int | None = None
        ) -> dict[str, Any]:
            del query, page, per_page
            return {"total_count": 0, "items": []}

        def enrich_repositories(
            self, repositories: object
        ) -> tuple[dict[str, RepositorySnapshot], list[str]]:
            del repositories
            return {}, []

        def search_repositories_page(
            self,
            query: str,
            *,
            cursor: str | None = None,
            page_size: int | None = None,
        ) -> dict[str, Any]:
            del query, cursor, page_size
            self.calls += 1
            return {
                "repositoryCount": 99,
                "nodes": [
                    {
                        "id": f"R_private_{self.calls}",
                        "nameWithOwner": "secret/hidden",
                        "isPrivate": True,
                    }
                ],
                "pageInfo": {"hasNextPage": True, "endCursor": f"cursor-{self.calls}"},
            }

    client = EndlessPrivate()
    outcomes = discover_repository_query(
        client,
        config(tmp_path).repository_queries[0],
        config(tmp_path),
        {},
    )
    assert client.calls == 3
    assert outcomes[0].complete is False
    assert outcomes[0].incomplete_reason is not None
    assert "page bound" in outcomes[0].incomplete_reason


def test_repository_query_paginates(tmp_path: Path) -> None:
    client = FakeClient()
    candidates: dict[str, Candidate] = {}
    cfg = config(tmp_path)
    outcomes = discover_repository_query(
        client,
        cfg.repository_queries[0],
        cfg,
        candidates,
    )
    assert outcomes[0].complete is True
    assert outcomes[0].returned_count == 2
    assert set(candidates) == {"example/first", "example/second"}
    assert len(client.repository_calls) == 2


def test_code_query_collects_paths(tmp_path: Path) -> None:
    client = FakeClient()
    candidates: dict[str, Candidate] = {}
    outcome = discover_code_query(client, config(tmp_path).code_queries[0], candidates)
    assert outcome.complete is True
    candidate = candidates["example/code"]
    assert candidate.evidence[0].path == "Info.json"


def test_official_evidence_and_manifest_probe(tmp_path: Path) -> None:
    candidates: dict[str, Candidate] = {}
    warnings = add_official_plugin_evidence(
        [
            OfficialPluginEntry(
                name="Example",
                url="https://github.com/example/plugin",
                desc="Example IINA plugin.",
                id="dev.example",
            )
        ],
        candidates,
        weight=100,
    )
    assert warnings == []
    candidate = candidates["example/plugin"]
    inspect_manifest(FakeClient(), candidate)
    assert candidate.manifest is not None
    assert candidate.manifest_path == "Info.json"


def test_enrich_and_classify(tmp_path: Path) -> None:
    candidates = {
        "example/plugin": Candidate(
            repository=RepositorySnapshot(
                name_with_owner="example/plugin",
                url="https://github.com/example/plugin",
            )
        )
    }
    client = FakeClient()
    enrich_candidates(client, candidates)
    classify_candidates(candidates, config(tmp_path), OverrideFile())
    assert candidates["example/plugin"].repository.topics == ["iina-plugin"]
    assert candidates["example/plugin"].decision is CandidateDecision.REVIEW


def test_run_save_load_and_reclassify(tmp_path: Path) -> None:
    cfg = config(tmp_path)
    config_path = tmp_path / "config.yaml"
    write_yaml(config_path, cfg)
    source_content = [
        {
            "name": "Official Example",
            "url": "https://github.com/example/official",
            "desc": "Official example plugin.",
            "id": "dev.example.official",
        }
    ]
    write_official_snapshot(cfg.paths.official_plugins_snapshot, source_content)
    write_yaml(cfg.paths.overrides, {"version": 1, "repositories": {}})

    run = run_discovery(
        config_path=config_path,
        config=cfg,
        client=FakeClient(),
        mode="quick",
    )
    assert len(run.candidates) == 4
    assert run.accepted == 0
    assert run.review >= 1
    destination = tmp_path / "saved.json"
    save_discovery_run(run, destination)
    loaded = load_discovery_run(destination)
    reclassify_run(loaded, cfg, load_overrides(cfg.paths.overrides))
    assert loaded.config_sha256 == run.config_sha256


def test_non_github_official_index_url_produces_warning(tmp_path: Path) -> None:
    url = "https://git.notfire.cc/notfire/iina-listenbrainz"
    candidates: dict[str, Candidate] = {}
    warnings = add_official_plugin_evidence(
        [
            OfficialPluginEntry(
                name="ListenBrainz Scrobbler",
                url=url,
                desc="Scrobble your music to ListenBrainz.",
                id="cc.notfire.iina-listenbrainz",
            )
        ],
        candidates,
        weight=100,
    )
    assert any(url in warning for warning in warnings)
    candidate = candidates[url.casefold()]
    assert candidate.repository.url == url
    assert candidate.repository.name_with_owner == url
    assert candidate.evidence[0].kind is EvidenceKind.OFFICIAL_PLUGIN_INDEX
    assert candidate.evidence[0].details["id"] == "cc.notfire.iina-listenbrainz"

    cfg = config(tmp_path)
    config_path = tmp_path / "config.yaml"
    write_yaml(config_path, cfg)
    write_official_snapshot(
        cfg.paths.official_plugins_snapshot,
        [
            {
                "name": "ListenBrainz Scrobbler",
                "url": url,
                "desc": "Scrobble your music to ListenBrainz.",
                "id": "cc.notfire.iina-listenbrainz",
            }
        ],
    )
    write_yaml(cfg.paths.overrides, {"version": 1, "repositories": {}})
    run = run_discovery(
        config_path=config_path,
        config=cfg,
        client=FakeClient(),
        mode="quick",
    )
    assert any(url in warning for warning in run.warnings)
    keyed = next(
        item for item in run.candidates if item.repository.url.casefold() == url.casefold()
    )
    assert keyed.repository.url == url
    assert keyed.decision is CandidateDecision.REVIEW
    assert run.complete is True


def test_missing_official_snapshot_is_not_complete(tmp_path: Path) -> None:
    cfg = config(tmp_path)
    cfg.paths.official_plugins_snapshot.unlink()
    config_path = tmp_path / "config.yaml"
    write_yaml(config_path, cfg)
    write_yaml(cfg.paths.overrides, {"version": 1, "repositories": {}})
    run = run_discovery(
        config_path=config_path,
        config=cfg,
        client=FakeClient(),
        mode="quick",
    )
    assert run.complete is False
    assert any("official plugin snapshot is missing" in warning for warning in run.warnings)
    official_outcomes = [
        outcome for outcome in run.outcomes if outcome.kind is EvidenceKind.OFFICIAL_PLUGIN_INDEX
    ]
    assert official_outcomes
    assert all(not outcome.complete for outcome in official_outcomes)


def test_load_missing_overrides_returns_empty(tmp_path: Path) -> None:
    assert load_overrides(tmp_path / "missing.yaml").repositories == {}


def test_discovery_run_counts() -> None:
    run = DiscoveryRun(
        started_at=datetime.now(UTC),
        finished_at=datetime.now(UTC),
        config_sha256="x",
        mode="quick",
        candidates=[],
        outcomes=[],
    )
    assert run.complete is False
    assert run.accepted == run.review == run.rejected == 0


def test_invalid_manifest_is_recorded_without_aborting() -> None:
    class InvalidManifestClient:
        def get_content(
            self, repository: str, path: str, *, ref: str | None = None
        ) -> bytes | None:
            del repository, ref
            return b"{" if path == "Info.json" else None

    candidate = Candidate(
        repository=RepositorySnapshot(
            name_with_owner="example/invalid",
            url="https://github.com/example/invalid",
            default_branch="main",
        )
    )
    inspect_manifest(InvalidManifestClient(), candidate)
    assert candidate.manifest is None
    assert candidate.manifest_errors
    assert candidate.manifest_errors[0].startswith("Info.json:")


def test_run_records_query_failures_and_continues(tmp_path: Path) -> None:
    from awesome_iina.github import GhError

    class FailingClient(FakeClient):
        def search_repositories_page(
            self, query: str, *, cursor: str | None = None, page_size: int | None = None
        ) -> dict[str, Any]:
            del query, cursor, page_size
            raise GhError("503 temporary failure")

        def search_code_page(
            self, query: str, *, page: int, per_page: int | None = None
        ) -> dict[str, Any]:
            del query, page, per_page
            raise GhError("secondary rate limit")

    cfg = config(tmp_path)
    config_path = tmp_path / "config.yaml"
    write_yaml(config_path, cfg)
    write_yaml(cfg.paths.overrides, {"version": 1, "repositories": {}})
    run = run_discovery(
        config_path=config_path,
        config=cfg,
        client=FailingClient(),
        mode="quick",
    )
    assert run.complete is False
    assert len(run.warnings) == 2
    assert all(not outcome.complete for outcome in run.outcomes)


def test_saved_discovery_preserves_sparse_and_explicit_null_fields(tmp_path: Path) -> None:
    snapshot = RepositorySnapshot.model_validate(
        {
            "name_with_owner": "example/sparse",
            "url": "https://github.com/example/sparse",
            "description": None,
        }
    )
    run = DiscoveryRun(
        started_at=datetime.now(UTC),
        finished_at=datetime.now(UTC),
        config_sha256="f" * 64,
        mode="quick",
        candidates=[Candidate(repository=snapshot)],
        outcomes=[],
    )
    destination = tmp_path / "sparse.json"

    save_discovery_run(run, destination)

    payload = json.loads(destination.read_text(encoding="utf-8"))
    repository = payload["candidates"][0]["repository"]
    assert repository["description"] is None
    assert "stars" not in repository
    loaded = load_discovery_run(destination)
    assert "description" in loaded.candidates[0].repository.model_fields_set
    assert "stars" not in loaded.candidates[0].repository.model_fields_set
