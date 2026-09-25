from __future__ import annotations

from datetime import UTC, datetime

from awesome_iina.discovery.snapshot_diff import compare_discovery_runs, render_snapshot_diff
from awesome_iina.models import (
    Candidate,
    CandidateDecision,
    Category,
    DiscoveryRun,
    PluginManifest,
    RepositorySnapshot,
)


def run(*repositories: RepositorySnapshot) -> DiscoveryRun:
    timestamp = datetime(2026, 9, 13, tzinfo=UTC)
    return DiscoveryRun(
        started_at=timestamp,
        finished_at=timestamp,
        config_sha256="0" * 64,
        mode="quick",
        candidates=[Candidate(repository=repository) for repository in repositories],
        outcomes=[],
    )


def repository(name: str, node_id: str, stars: int = 0) -> RepositorySnapshot:
    return RepositorySnapshot(
        node_id=node_id,
        name_with_owner=name,
        url=f"https://github.com/{name}",
        stars=stars,
    )


def test_snapshot_diff_distinguishes_rename_add_remove_and_change() -> None:
    old = run(repository("owner/old", "NODE1", 1), repository("owner/removed", "NODE2"))
    new = run(repository("owner/new", "NODE1", 2), repository("owner/added", "NODE3"))

    diff = compare_discovery_runs(old, new)

    assert diff.added == ["owner/added"]
    assert diff.removed == ["owner/removed"]
    assert diff.renamed[0].old_name == "owner/old"
    assert diff.renamed[0].new_name == "owner/new"
    assert diff.changed[0].fields["stars"] == {"old": 1, "new": 2}
    rendered = render_snapshot_diff(diff)
    assert "owner/old" in rendered
    assert "owner/new" in rendered


def test_repository_identity_falls_back_to_database_and_name() -> None:
    from awesome_iina.discovery.snapshot_diff import repository_identity

    assert (
        repository_identity(
            RepositorySnapshot(
                database_id=42,
                name_with_owner="owner/repo",
                url="https://github.com/owner/repo",
            )
        )
        == "database:42"
    )
    assert (
        repository_identity(
            RepositorySnapshot(
                name_with_owner="Owner/Repo",
                url="https://github.com/Owner/Repo",
            )
        )
        == "name:owner/repo"
    )


def test_snapshot_diff_can_be_empty() -> None:
    same = run(repository("owner/repo", "NODE1", 1))

    diff = compare_discovery_runs(same, same)

    assert diff.empty
    assert "_None._" in render_snapshot_diff(diff)


def test_snapshot_diff_reports_manifest_and_triage_changes() -> None:
    timestamp = datetime(2026, 9, 13, tzinfo=UTC)
    repository_snapshot = repository("owner/plugin", "NODE1", 1)
    old = DiscoveryRun(
        started_at=timestamp,
        finished_at=timestamp,
        config_sha256="0" * 64,
        mode="quick",
        candidates=[Candidate(repository=repository_snapshot)],
        outcomes=[],
    )
    new = DiscoveryRun(
        started_at=timestamp,
        finished_at=timestamp,
        config_sha256="0" * 64,
        mode="quick",
        candidates=[
            Candidate(
                repository=repository_snapshot,
                score=90,
                decision=CandidateDecision.REVIEW,
                inferred_categories=[Category.PLAYBACK],
                manifest=PluginManifest(
                    name="Plugin",
                    identifier="dev.example.plugin",
                    version="2.0.0",
                    author={"name": "Example"},
                    entry="main.js",
                ),
                manifest_path="Info.json",
            )
        ],
        outcomes=[],
    )

    diff = compare_discovery_runs(old, new)

    assert len(diff.candidate_changes) == 1
    assert diff.candidate_changes[0].fields["score"] == {"old": 0, "new": 90}
    assert diff.candidate_changes[0].fields["manifest"]["new"]["version"] == "2.0.0"
    rendered = render_snapshot_diff(diff)
    assert "Candidate and manifest changes" in rendered
    assert "dev.example.plugin" in rendered
