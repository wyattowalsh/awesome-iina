from __future__ import annotations

from collections import Counter
from pathlib import Path

from awesome_iina.io_utils import write_yaml
from awesome_iina.models import Candidate, CandidateDecision, DiscoveryRun


def _escape_cell(value: str) -> str:
    return value.replace("|", "\\|").replace("\n", " ")


def _permissions_cell(candidate: Candidate) -> str:
    manifest = candidate.manifest
    if manifest is None:
        return ""
    parts = list(manifest.permissions)
    if any(domain == "*" for domain in manifest.allowedDomains):
        parts.append("wildcard domains")
    elif manifest.allowedDomains:
        parts.append("allowedDomains: " + ", ".join(manifest.allowedDomains))
    return _escape_cell(", ".join(parts))


def _candidate_row(candidate: Candidate) -> str:
    repository = candidate.repository
    categories = ", ".join(category.value for category in candidate.inferred_categories)
    identifier = candidate.manifest.identifier if candidate.manifest else ""
    description = _escape_cell(repository.description or "")
    if len(description) > 120:
        description = description[:117].rstrip() + "..."
    return (
        f"| [{repository.name_with_owner}]({repository.url}) | {candidate.score} | "
        f"{categories} | {identifier} | {_permissions_cell(candidate)} | {description} |"
    )


def render_discovery_report(run: DiscoveryRun) -> str:
    kind_counts = Counter(
        evidence.kind.value for candidate in run.candidates for evidence in candidate.evidence
    )
    incomplete = [outcome for outcome in run.outcomes if not outcome.complete]
    lines = [
        "# IINA ecosystem discovery audit",
        "",
        f"- Started: `{run.started_at.isoformat()}`",
        f"- Finished: `{run.finished_at.isoformat()}`",
        f"- Mode: `{run.mode}`",
        f"- Repository backend: `{run.repository_backend.value if run.repository_backend else 'unknown'}`",
        f"- Candidates: **{len(run.candidates)}**",
        f"- Manually included by override: **{run.accepted}**",
        f"- Needs review: **{run.review}**",
        f"- Excluded by heuristic or override: **{run.rejected}**",
        f"- Query coverage complete: **{'yes' if run.complete else 'no'}**",
        "",
        (
            "> Discovery is a high-recall audit input, not an endorsement. "
            "A human must review projects before adding them to the curated catalog."
        ),
        "",
        "## Evidence coverage",
        "",
    ]
    for kind, count in sorted(kind_counts.items()):
        lines.append(f"- `{kind}`: {count}")

    lines.extend(["", "## Incomplete or capped queries", ""])
    if incomplete:
        lines.extend(
            [
                "| Backend | Query | Returned / reported | Reason |",
                "| --- | --- | ---: | --- |",
                *[
                    f"| `{item.backend.value if item.backend else 'unknown'}` | `{item.query}` | "
                    f"{item.returned_count} / {item.total_count} | "
                    f"{item.incomplete_reason or 'unknown'} |"
                    for item in incomplete
                ],
            ]
        )
    elif not run.outcomes:
        lines.append(
            "No query outcomes were recorded. Coverage is incomplete; this is not "
            "evidence that the search space has no coverage gap."
        )
    else:
        lines.append("No configured query reported an unresolved coverage gap.")

    lines.extend(["", "## Run warnings", ""])
    if run.warnings:
        lines.extend(f"- {warning}" for warning in run.warnings)
    else:
        lines.append("No non-query warnings were recorded.")

    for decision, title in (
        (CandidateDecision.ACCEPT, "Manually included candidates"),
        (CandidateDecision.REVIEW, "Manual-review queue"),
        (CandidateDecision.REJECT, "Excluded or low-priority findings"),
    ):
        candidates = [item for item in run.candidates if item.decision is decision]
        lines.extend(
            [
                "",
                f"## {title}",
                "",
                "| Repository | Score | Categories | Plugin identifier | Permissions | Description |",
                "| --- | ---: | --- | --- | --- | --- |",
            ]
        )
        lines.extend(_candidate_row(candidate) for candidate in candidates)
        if not candidates:
            lines.append("| _None_ | | | | | |")

    lines.extend(
        [
            "",
            "## Reproducibility",
            "",
            f"Configuration SHA-256: `{run.config_sha256}`",
            "",
            (
                "The JSON discovery artifact retains each repository snapshot, evidence item, "
                "query outcome, manifest diagnostic, scoring reason, run warning, and manual "
                "override note."
            ),
        ]
    )
    return "\n".join(lines).rstrip() + "\n"


def write_review_queue(run: DiscoveryRun, path: Path) -> None:
    rows = []
    for candidate in run.candidates:
        if candidate.decision is CandidateDecision.REJECT:
            continue
        repository = candidate.repository
        rows.append(
            {
                "repository": repository.name_with_owner,
                "url": repository.url,
                "score": candidate.score,
                "categories": [category.value for category in candidate.inferred_categories],
                "description": repository.description,
                "manifest": (
                    candidate.manifest.model_dump(mode="json", exclude_none=True)
                    if candidate.manifest
                    else None
                ),
                "manifest_errors": candidate.manifest_errors,
                "reasons": candidate.reasons,
                "evidence": [
                    item.model_dump(mode="json", exclude_none=True) for item in candidate.evidence
                ],
                "triage_status": candidate.decision.value,
                "decision": None,
                "review_notes": None,
            }
        )
    write_yaml(path, {"schema_version": 1, "candidates": rows})
