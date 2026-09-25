from datetime import UTC, datetime
from pathlib import Path

import yaml

from awesome_iina.discovery.reporting import render_discovery_report, write_review_queue
from awesome_iina.models import (
    Candidate,
    CandidateDecision,
    Category,
    DiscoveryRun,
    EvidenceKind,
    PluginManifest,
    QueryOutcome,
    RepositorySnapshot,
)


def run() -> DiscoveryRun:
    candidates = [
        Candidate(
            repository=RepositorySnapshot(
                name_with_owner="example/accepted",
                url="https://github.com/example/accepted",
                description="Accepted IINA plugin.",
            ),
            score=100,
            decision=CandidateDecision.ACCEPT,
            inferred_categories=[Category.PLAYBACK],
            manifest=PluginManifest(
                name="Accepted",
                version="1.0.0",
                identifier="dev.example.accepted",
                author="Example",
                entry="index.js",
                permissions=["network-request", "file-system"],
                allowedDomains=["*"],
            ),
        ),
        Candidate(
            repository=RepositorySnapshot(
                name_with_owner="example/review",
                url="https://github.com/example/review",
                description="Review IINA plugin.",
            ),
            score=50,
            decision=CandidateDecision.REVIEW,
            inferred_categories=[Category.SUBTITLES],
            reasons=["manual review"],
        ),
    ]
    return DiscoveryRun(
        started_at=datetime.now(UTC),
        finished_at=datetime.now(UTC),
        config_sha256="abc",
        mode="quick",
        candidates=candidates,
        outcomes=[
            QueryOutcome(
                query_id="capped",
                query="IINA in:readme",
                kind=EvidenceKind.REPOSITORY_SEARCH,
                total_count=1200,
                returned_count=1000,
                complete=False,
                incomplete_reason="cap",
            )
        ],
    )


def test_render_report_contains_coverage_and_candidates() -> None:
    text = render_discovery_report(run())
    assert "Query coverage complete: **no**" in text
    assert "Repository backend: `unknown`" in text
    assert "Manually included by override: **1**" in text
    assert "| Backend | Query |" in text
    assert "example/accepted" in text
    assert "example/review" in text
    assert "IINA in:readme" in text
    assert "network-request" in text
    assert "file-system" in text
    assert "wildcard domains" in text
    assert "| Permissions |" in text


def test_zero_outcomes_does_not_claim_no_coverage_gap() -> None:
    discovery = run().model_copy(update={"outcomes": []})
    text = render_discovery_report(discovery)
    assert "Query coverage complete: **no**" in text
    assert "No query outcomes were recorded" in text
    assert "unresolved coverage gap" not in text


def test_write_review_queue(tmp_path: Path) -> None:
    path = tmp_path / "review.yaml"
    write_review_queue(run(), path)
    payload = yaml.safe_load(path.read_text())
    assert len(payload["candidates"]) == 2
    assert [item["repository"] for item in payload["candidates"]] == [
        "example/accepted",
        "example/review",
    ]
    assert [item["triage_status"] for item in payload["candidates"]] == [
        "accept",
        "review",
    ]
    assert all(item["decision"] is None for item in payload["candidates"])
