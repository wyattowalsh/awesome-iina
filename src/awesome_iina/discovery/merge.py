from __future__ import annotations

import hashlib
from collections.abc import Iterable

from awesome_iina.models import (
    Candidate,
    CandidateDecision,
    DiscoveryBackend,
    DiscoveryRun,
    QueryOutcome,
    RepositorySnapshot,
)


def _merge_repository(
    current: RepositorySnapshot,
    incoming: RepositorySnapshot,
) -> RepositorySnapshot:
    """Merge a later sparse observation without erasing fields it omitted."""

    update = incoming.model_dump(exclude_unset=True)
    update = {
        key: value
        for key, value in update.items()
        if key not in {"node_id", "database_id"} or value is not None
    }

    aliases = set(current.aliases) | set(incoming.aliases)
    if incoming.name_with_owner.casefold() != current.name_with_owner.casefold():
        aliases.add(current.name_with_owner)
    aliases.discard(incoming.name_with_owner)
    update["aliases"] = sorted(aliases, key=str.casefold)

    if "topics" in incoming.model_fields_set:
        update["topics"] = sorted(set(current.topics) | set(incoming.topics))
    if "languages" in incoming.model_fields_set:
        languages = current.languages.keys() | incoming.languages.keys()
        update["languages"] = {
            language: max(
                current.languages.get(language, 0),
                incoming.languages.get(language, 0),
            )
            for language in languages
        }
    return current.model_copy(update=update, deep=True)


def _merge_candidate(
    current: Candidate,
    incoming: Candidate,
    warnings: list[str],
) -> None:
    current.repository = _merge_repository(current.repository, incoming.repository)
    for evidence in incoming.evidence:
        current.add_evidence(evidence)

    if current.manifest is None and incoming.manifest is not None:
        current.manifest = incoming.manifest.model_copy(deep=True)
        current.manifest_path = incoming.manifest_path
    elif current.manifest is not None and incoming.manifest is not None:
        if current.manifest.model_dump(mode="json") != incoming.manifest.model_dump(mode="json"):
            warnings.append(
                f"manifest disagreement for {current.repository.name_with_owner}; "
                "the first parsed manifest was retained"
            )
        elif current.manifest_path is None:
            current.manifest_path = incoming.manifest_path

    current.manifest_errors = sorted(set(current.manifest_errors) | set(incoming.manifest_errors))
    current.inferred_categories = sorted(
        set(current.inferred_categories) | set(incoming.inferred_categories),
        key=lambda category: category.value,
    )
    current.reasons = list(dict.fromkeys([*current.reasons, *incoming.reasons]))
    current.score = max(current.score, incoming.score)
    current.decision = CandidateDecision.REVIEW
    current.manual_note = current.manual_note or incoming.manual_note


def _find_existing(
    incoming: Candidate,
    *,
    by_node: dict[str, Candidate],
    by_database: dict[int, Candidate],
    by_name: dict[str, Candidate],
    ambiguous_names: set[str],
) -> Candidate | None:
    repository = incoming.repository
    if repository.node_id and repository.node_id in by_node:
        return by_node[repository.node_id]
    if repository.database_id is not None and repository.database_id in by_database:
        return by_database[repository.database_id]

    names = [repository.name_with_owner, *repository.aliases]
    for name in names:
        normalized_name = name.casefold()
        if normalized_name in ambiguous_names:
            continue
        candidate = by_name.get(normalized_name)
        if candidate is None:
            continue
        existing = candidate.repository
        node_conflict = (
            repository.node_id and existing.node_id and repository.node_id != existing.node_id
        )
        database_conflict = (
            repository.database_id is not None
            and existing.database_id is not None
            and repository.database_id != existing.database_id
        )
        if not node_conflict and not database_conflict:
            return candidate
    return None


def _register_candidate(
    candidate: Candidate,
    *,
    by_node: dict[str, Candidate],
    by_database: dict[int, Candidate],
    by_name: dict[str, Candidate],
    ambiguous_names: set[str],
) -> None:
    repository = candidate.repository
    if repository.node_id:
        by_node[repository.node_id] = candidate
    if repository.database_id is not None:
        by_database[repository.database_id] = candidate
    for name in [repository.name_with_owner, *repository.aliases]:
        normalized_name = name.casefold()
        if normalized_name in ambiguous_names:
            continue
        existing = by_name.get(normalized_name)
        if existing is not None and existing is not candidate:
            by_name.pop(normalized_name, None)
            ambiguous_names.add(normalized_name)
            continue
        by_name[normalized_name] = candidate


def _merge_outcomes(runs: Iterable[DiscoveryRun]) -> list[QueryOutcome]:
    merged: dict[tuple[str, str, str, str], QueryOutcome] = {}
    for run in runs:
        for outcome in run.outcomes:
            backend = outcome.backend or run.repository_backend
            normalized = outcome.model_copy(update={"backend": backend}, deep=True)
            key = (
                backend.value if backend else "unknown",
                normalized.kind.value,
                normalized.query_id,
                normalized.query,
            )
            existing = merged.get(key)
            if existing is None:
                merged[key] = normalized
                continue

            reasons = [
                reason
                for reason in (
                    existing.incomplete_reason,
                    normalized.incomplete_reason,
                )
                if reason
            ]
            merged[key] = existing.model_copy(
                update={
                    "total_count": max(
                        existing.total_count,
                        normalized.total_count,
                    ),
                    "returned_count": max(
                        existing.returned_count,
                        normalized.returned_count,
                    ),
                    "complete": existing.complete and normalized.complete,
                    "incomplete_reason": "; ".join(dict.fromkeys(reasons)) or None,
                }
            )
    return [merged[key] for key in sorted(merged)]


def merge_discovery_runs(runs: Iterable[DiscoveryRun]) -> DiscoveryRun:
    """Combine independently collected runs for one human review pass."""

    source_runs = list(runs)
    if not source_runs:
        raise ValueError("at least one discovery run is required")

    candidates: list[Candidate] = []
    by_node: dict[str, Candidate] = {}
    by_database: dict[int, Candidate] = {}
    by_name: dict[str, Candidate] = {}
    ambiguous_names: set[str] = set()
    warnings: list[str] = []

    for run in sorted(source_runs, key=lambda item: item.started_at):
        label = run.repository_backend.value if run.repository_backend else "unknown"
        warnings.extend(f"[{label}] {warning}" for warning in run.warnings)
        for incoming in run.candidates:
            if incoming.repository.private:
                continue
            existing = _find_existing(
                incoming,
                by_node=by_node,
                by_database=by_database,
                by_name=by_name,
                ambiguous_names=ambiguous_names,
            )
            if existing is None:
                existing = incoming.model_copy(deep=True)
                candidates.append(existing)
            else:
                _merge_candidate(existing, incoming, warnings)
            _register_candidate(
                existing,
                by_node=by_node,
                by_database=by_database,
                by_name=by_name,
                ambiguous_names=ambiguous_names,
            )

    config_hashes = sorted({run.config_sha256 for run in source_runs})
    config_sha256 = (
        config_hashes[0]
        if len(config_hashes) == 1
        else hashlib.sha256("\n".join(config_hashes).encode()).hexdigest()
    )
    ordered = sorted(
        candidates,
        key=lambda item: item.repository.name_with_owner.casefold(),
    )
    return DiscoveryRun(
        started_at=min(run.started_at for run in source_runs),
        finished_at=max(run.finished_at for run in source_runs),
        config_sha256=config_sha256,
        mode="full" if any(run.mode == "full" for run in source_runs) else "quick",
        repository_backend=DiscoveryBackend.MERGED,
        candidates=ordered,
        outcomes=_merge_outcomes(source_runs),
        warnings=list(dict.fromkeys(warnings)),
    )
