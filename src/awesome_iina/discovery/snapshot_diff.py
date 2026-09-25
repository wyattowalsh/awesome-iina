from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from awesome_iina.models import Candidate, DiscoveryRun, RepositorySnapshot


@dataclass(frozen=True, slots=True)
class RepositoryRename:
    identity: str
    old_name: str
    new_name: str


@dataclass(frozen=True, slots=True)
class RepositoryChange:
    identity: str
    name_with_owner: str
    fields: dict[str, dict[str, Any]]


@dataclass(frozen=True, slots=True)
class CandidateChange:
    identity: str
    name_with_owner: str
    fields: dict[str, dict[str, Any]]


@dataclass(frozen=True, slots=True)
class SnapshotDiff:
    added: list[str] = field(default_factory=list)
    removed: list[str] = field(default_factory=list)
    renamed: list[RepositoryRename] = field(default_factory=list)
    changed: list[RepositoryChange] = field(default_factory=list)
    candidate_changes: list[CandidateChange] = field(default_factory=list)

    @property
    def empty(self) -> bool:
        return not (
            self.added or self.removed or self.renamed or self.changed or self.candidate_changes
        )


def repository_identity(repository: RepositorySnapshot) -> str:
    """Return the most stable identity available for a repository snapshot."""

    if repository.node_id:
        return f"node:{repository.node_id}"
    if repository.database_id is not None:
        return f"database:{repository.database_id}"
    return f"name:{repository.name_with_owner.casefold()}"


def _candidate_map(run: DiscoveryRun) -> dict[str, Candidate]:
    return {repository_identity(candidate.repository): candidate for candidate in run.candidates}


def _comparable(repository: RepositorySnapshot) -> dict[str, Any]:
    payload = repository.model_dump(mode="json")
    for transient in ("url", "name_with_owner"):
        payload.pop(transient, None)
    return payload


def _candidate_comparable(candidate: Candidate) -> dict[str, Any]:
    return {
        "score": candidate.score,
        "triage_status": candidate.decision.value,
        "categories": [category.value for category in candidate.inferred_categories],
        "manifest_path": candidate.manifest_path,
        "manifest": (
            candidate.manifest.model_dump(mode="json", exclude_none=True)
            if candidate.manifest
            else None
        ),
        "manifest_errors": sorted(candidate.manifest_errors),
    }


def compare_discovery_runs(old: DiscoveryRun, new: DiscoveryRun) -> SnapshotDiff:
    """Compare discovery snapshots while preserving stable repository identity."""

    old_map = _candidate_map(old)
    new_map = _candidate_map(new)
    old_ids = set(old_map)
    new_ids = set(new_map)

    added = sorted(
        (new_map[identity].repository.name_with_owner for identity in new_ids - old_ids),
        key=str.casefold,
    )
    removed = sorted(
        (old_map[identity].repository.name_with_owner for identity in old_ids - new_ids),
        key=str.casefold,
    )
    renamed: list[RepositoryRename] = []
    changed: list[RepositoryChange] = []
    candidate_changes: list[CandidateChange] = []

    for identity in sorted(old_ids & new_ids):
        old_repository = old_map[identity].repository
        new_repository = new_map[identity].repository
        if old_repository.name_with_owner != new_repository.name_with_owner:
            renamed.append(
                RepositoryRename(
                    identity=identity,
                    old_name=old_repository.name_with_owner,
                    new_name=new_repository.name_with_owner,
                )
            )
        old_payload = _comparable(old_repository)
        new_payload = _comparable(new_repository)
        fields = {
            key: {"old": old_payload.get(key), "new": new_payload.get(key)}
            for key in sorted(old_payload.keys() | new_payload.keys())
            if old_payload.get(key) != new_payload.get(key)
        }
        if fields:
            changed.append(
                RepositoryChange(
                    identity=identity,
                    name_with_owner=new_repository.name_with_owner,
                    fields=fields,
                )
            )

        old_candidate_payload = _candidate_comparable(old_map[identity])
        new_candidate_payload = _candidate_comparable(new_map[identity])
        candidate_fields = {
            key: {
                "old": old_candidate_payload.get(key),
                "new": new_candidate_payload.get(key),
            }
            for key in sorted(old_candidate_payload.keys() | new_candidate_payload.keys())
            if old_candidate_payload.get(key) != new_candidate_payload.get(key)
        }
        if candidate_fields:
            candidate_changes.append(
                CandidateChange(
                    identity=identity,
                    name_with_owner=new_repository.name_with_owner,
                    fields=candidate_fields,
                )
            )

    return SnapshotDiff(
        added=added,
        removed=removed,
        renamed=renamed,
        changed=changed,
        candidate_changes=candidate_changes,
    )


def render_snapshot_diff(diff: SnapshotDiff) -> str:
    lines = ["# Discovery snapshot diff", ""]
    lines.append(
        f"Added: **{len(diff.added)}** · Removed: **{len(diff.removed)}** · "
        f"Renamed: **{len(diff.renamed)}** · Metadata changed: **{len(diff.changed)}** · "
        f"Candidate changed: **{len(diff.candidate_changes)}**"
    )
    lines.append("")

    def section(title: str, values: list[str]) -> None:
        lines.extend([f"## {title}", ""])
        lines.extend(f"- `{value}`" for value in values)
        if not values:
            lines.append("_None._")
        lines.append("")

    section("Added", diff.added)
    section("Removed", diff.removed)

    lines.extend(["## Renamed", ""])
    if diff.renamed:
        lines.extend(
            f"- `{item.old_name}` → `{item.new_name}` ({item.identity})" for item in diff.renamed
        )
    else:
        lines.append("_None._")
    lines.append("")

    lines.extend(["## Metadata changes", ""])
    if not diff.changed:
        lines.append("_None._")
    for item in diff.changed:
        lines.append(f"### {item.name_with_owner}")
        lines.append("")
        for name, values in item.fields.items():
            lines.append(f"- `{name}`: `{values['old']}` → `{values['new']}`")
        lines.append("")

    lines.extend(["## Candidate and manifest changes", ""])
    if not diff.candidate_changes:
        lines.append("_None._")
    for item in diff.candidate_changes:
        lines.append(f"### {item.name_with_owner}")
        lines.append("")
        for name, values in item.fields.items():
            lines.append(f"- `{name}`: `{values['old']}` → `{values['new']}`")
        lines.append("")
    return "\n".join(lines).rstrip() + "\n"
