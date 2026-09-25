from __future__ import annotations

from datetime import UTC, datetime
from pathlib import Path

from typer.testing import CliRunner

from awesome_iina.cli import app
from awesome_iina.discovery import load_discovery_run, save_discovery_run
from awesome_iina.models import (
    Candidate,
    DiscoveryBackend,
    DiscoveryRun,
    RepositorySnapshot,
)

runner = CliRunner()


def _write_run(path: Path, backend: DiscoveryBackend, repository: str) -> None:
    run = DiscoveryRun(
        started_at=datetime(2026, 9, 16, tzinfo=UTC),
        finished_at=datetime(2026, 9, 16, 0, 1, tzinfo=UTC),
        config_sha256="a" * 64,
        mode="full",
        repository_backend=backend,
        candidates=[
            Candidate(
                repository=RepositorySnapshot(
                    node_id="R_fixture",
                    name_with_owner=repository,
                    url=f"https://github.com/{repository}",
                    description="A fixture IINA plugin used for CLI merge coverage.",
                )
            )
        ],
        outcomes=[],
    )
    save_discovery_run(run, path)


def test_merge_and_report_support_separate_review_outputs(tmp_path: Path) -> None:
    rest = tmp_path / "rest.json"
    graphql = tmp_path / "graphql.json"
    merged = tmp_path / "merged.json"
    report = tmp_path / "report.md"
    review = tmp_path / "review.yaml"
    _write_run(rest, DiscoveryBackend.REST, "example/old-name")
    _write_run(graphql, DiscoveryBackend.GRAPHQL, "example/new-name")

    merge_result = runner.invoke(
        app,
        [
            "merge-discovery",
            str(rest),
            str(graphql),
            "--output",
            str(merged),
        ],
    )
    assert merge_result.exit_code == 0, merge_result.output
    assert "unique public candidates" in merge_result.output
    merged_run = load_discovery_run(merged)
    assert merged_run.repository_backend is DiscoveryBackend.MERGED
    assert len(merged_run.candidates) == 1

    report_result = runner.invoke(
        app,
        [
            "report",
            str(merged),
            "--output",
            str(report),
            "--review-output",
            str(review),
        ],
    )
    assert report_result.exit_code == 0, report_result.output
    assert report.is_file()
    assert review.is_file()


def test_merge_requires_two_artifacts(tmp_path: Path) -> None:
    rest = tmp_path / "rest.json"
    _write_run(rest, DiscoveryBackend.REST, "example/plugin")
    result = runner.invoke(
        app,
        ["merge-discovery", str(rest), "--output", str(tmp_path / "merged.json")],
    )
    assert result.exit_code != 0
    assert "at least two" in result.output
