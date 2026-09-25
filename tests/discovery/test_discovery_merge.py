from __future__ import annotations

from datetime import UTC, datetime, timedelta
from pathlib import Path

import pytest

from awesome_iina.discovery import reclassify_run
from awesome_iina.discovery.merge import merge_discovery_runs
from awesome_iina.discovery.settings import load_config
from awesome_iina.models import (
    Candidate,
    CandidateDecision,
    DiscoveryBackend,
    DiscoveryEvidence,
    DiscoveryRun,
    EvidenceKind,
    OverrideFile,
    PluginManifest,
    QueryOutcome,
    RepositorySnapshot,
)


def _run(
    backend: DiscoveryBackend,
    candidate: Candidate,
    *,
    offset: int = 0,
    complete: bool = True,
) -> DiscoveryRun:
    started = datetime(2026, 9, 16, tzinfo=UTC) + timedelta(minutes=offset)
    return DiscoveryRun(
        started_at=started,
        finished_at=started + timedelta(seconds=10),
        config_sha256="a" * 64,
        mode="full",
        repository_backend=backend,
        candidates=[candidate],
        outcomes=[
            QueryOutcome(
                query_id="topic-iina-plugin",
                query="topic:iina-plugin",
                kind=EvidenceKind.REPOSITORY_SEARCH,
                backend=backend,
                total_count=1,
                returned_count=1,
                complete=complete,
                incomplete_reason=None if complete else "fixture gap",
            )
        ],
        warnings=[] if complete else ["fixture gap"],
    )


def test_merge_deduplicates_by_node_id_and_preserves_sparse_metadata() -> None:
    rest = Candidate(
        repository=RepositorySnapshot.model_validate(
            {
                "node_id": "R_fixture",
                "database_id": 10,
                "name_with_owner": "example/old-name",
                "url": "https://github.com/example/old-name",
                "description": "A discovered IINA plugin.",
                "stars": 10,
                "topics": ["iina"],
            }
        ),
        evidence=[
            DiscoveryEvidence(
                kind=EvidenceKind.REPOSITORY_SEARCH,
                source_id="rest",
                query="topic:iina",
            )
        ],
    )
    graphql = Candidate(
        repository=RepositorySnapshot.model_validate(
            {
                "node_id": "R_fixture",
                "database_id": 10,
                "name_with_owner": "example/new-name",
                "url": "https://github.com/example/new-name",
                "stars": 11,
                "topics": ["iina-plugin"],
            }
        ),
        evidence=[
            DiscoveryEvidence(
                kind=EvidenceKind.REPOSITORY_SEARCH,
                source_id="graphql",
                query="topic:iina-plugin",
            )
        ],
    )

    merged = merge_discovery_runs(
        [
            _run(DiscoveryBackend.REST, rest),
            _run(DiscoveryBackend.GRAPHQL, graphql, offset=1),
        ]
    )

    assert merged.repository_backend is DiscoveryBackend.MERGED
    assert len(merged.candidates) == 1
    repository = merged.candidates[0].repository
    assert repository.name_with_owner == "example/new-name"
    assert repository.aliases == ["example/old-name"]
    assert repository.description == "A discovered IINA plugin."
    assert repository.stars == 11
    assert repository.topics == ["iina", "iina-plugin"]
    assert {item.source_id for item in merged.candidates[0].evidence} == {
        "rest",
        "graphql",
    }
    assert {item.backend for item in merged.outcomes} == {
        DiscoveryBackend.REST,
        DiscoveryBackend.GRAPHQL,
    }


def test_merge_does_not_collapse_conflicting_stable_identities() -> None:
    first = Candidate(
        repository=RepositorySnapshot(
            node_id="R_first",
            database_id=1,
            name_with_owner="example/plugin",
            url="https://github.com/example/plugin",
        )
    )
    second = Candidate(
        repository=RepositorySnapshot(
            node_id="R_second",
            database_id=2,
            name_with_owner="example/plugin",
            url="https://github.com/example/plugin",
        )
    )

    merged = merge_discovery_runs(
        [
            _run(DiscoveryBackend.REST, first),
            _run(DiscoveryBackend.GRAPHQL, second, offset=1),
        ]
    )

    assert len(merged.candidates) == 2


def test_reclassify_retains_conflicting_stable_identities() -> None:
    first = Candidate(
        repository=RepositorySnapshot(
            node_id="R_first",
            database_id=1,
            name_with_owner="example/plugin",
            url="https://github.com/example/plugin",
        )
    )
    second = Candidate(
        repository=RepositorySnapshot(
            node_id="R_second",
            database_id=2,
            name_with_owner="example/plugin",
            url="https://github.com/example/plugin",
        )
    )
    run = merge_discovery_runs(
        [
            _run(DiscoveryBackend.REST, first),
            _run(DiscoveryBackend.GRAPHQL, second, offset=1),
        ]
    )

    reclassify_run(
        run, load_config(Path("src/awesome_iina/discovery/discovery.yaml")), OverrideFile()
    )

    assert len(run.candidates) == 2
    assert {candidate.repository.node_id for candidate in run.candidates} == {
        "R_first",
        "R_second",
    }
    assert all(candidate.decision is CandidateDecision.REJECT for candidate in run.candidates)


def test_reclassify_does_not_apply_name_override_to_ambiguous_identities() -> None:
    candidates = [
        Candidate(
            repository=RepositorySnapshot(
                node_id=node_id,
                database_id=database_id,
                name_with_owner="example/plugin",
                url="https://github.com/example/plugin",
            )
        )
        for node_id, database_id in (("R_first", 1), ("R_second", 2))
    ]
    run = merge_discovery_runs(
        [
            _run(DiscoveryBackend.REST, candidates[0]),
            _run(DiscoveryBackend.GRAPHQL, candidates[1], offset=1),
        ]
    )
    overrides = OverrideFile.model_validate(
        {"repositories": {"example/plugin": {"decision": "accept"}}}
    )

    reclassify_run(run, load_config(Path("src/awesome_iina/discovery/discovery.yaml")), overrides)

    assert all(candidate.decision is CandidateDecision.REJECT for candidate in run.candidates)
    assert any("ambiguous repository name" in warning for warning in run.warnings)


def test_merge_does_not_attach_idless_observation_to_ambiguous_name() -> None:
    candidates = [
        Candidate(
            repository=RepositorySnapshot(
                node_id="R_first",
                database_id=1,
                name_with_owner="example/plugin",
                url="https://github.com/example/plugin",
            )
        ),
        Candidate(
            repository=RepositorySnapshot(
                node_id="R_second",
                database_id=2,
                name_with_owner="example/plugin",
                url="https://github.com/example/plugin",
            )
        ),
        Candidate(
            repository=RepositorySnapshot(
                name_with_owner="example/plugin",
                url="https://github.com/example/plugin",
                description="An idless third observation.",
            )
        ),
    ]

    merged = merge_discovery_runs(
        [
            _run(DiscoveryBackend.REST, candidates[0]),
            _run(DiscoveryBackend.GRAPHQL, candidates[1], offset=1),
            _run(DiscoveryBackend.REST, candidates[2], offset=2),
        ]
    )

    assert len(merged.candidates) == 3


def test_merge_retains_first_manifest_and_records_disagreement() -> None:
    base = {
        "name": "Example",
        "identifier": "dev.example.plugin",
        "version": "1.0.0",
        "author": {"name": "Example"},
        "entry": "main.js",
    }
    first = Candidate(
        repository=RepositorySnapshot(
            node_id="R_fixture",
            name_with_owner="example/plugin",
            url="https://github.com/example/plugin",
        ),
        manifest=PluginManifest.model_validate(base),
        manifest_path="Info.json",
    )
    second = Candidate(
        repository=RepositorySnapshot(
            node_id="R_fixture",
            name_with_owner="example/plugin",
            url="https://github.com/example/plugin",
        ),
        manifest=PluginManifest.model_validate({**base, "version": "2.0.0"}),
        manifest_path="dist/Info.json",
    )

    merged = merge_discovery_runs(
        [
            _run(DiscoveryBackend.REST, first),
            _run(DiscoveryBackend.GRAPHQL, second, offset=1),
        ]
    )

    assert merged.candidates[0].manifest is not None
    assert merged.candidates[0].manifest.version == "1.0.0"
    assert any("manifest disagreement" in warning for warning in merged.warnings)


def test_merge_filters_private_candidates() -> None:
    private = Candidate(
        repository=RepositorySnapshot(
            node_id="R_private",
            name_with_owner="example/private",
            url="https://github.com/example/private",
            private=True,
        )
    )
    merged = merge_discovery_runs([_run(DiscoveryBackend.REST, private)])
    assert merged.candidates == []


def test_merge_requires_at_least_one_run() -> None:
    with pytest.raises(ValueError, match="at least one"):
        merge_discovery_runs([])
