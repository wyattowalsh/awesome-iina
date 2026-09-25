from __future__ import annotations

import hashlib
import json
import logging
from collections import deque
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from pydantic import ValidationError

from awesome_iina.discovery.scoring import score_candidate
from awesome_iina.discovery.settings import (
    CodeQueryConfig,
    DiscoveryConfig,
    RepositoryQueryConfig,
    config_digest,
)
from awesome_iina.discovery.sharding import split_shard
from awesome_iina.discovery.sources import try_load_official_plugins
from awesome_iina.github import (
    GhError,
    GithubContentClient,
    GithubDiscoveryClient,
    decode_json_content,
    repository_snapshot_from_graphql,
)
from awesome_iina.io_utils import load_model, write_json
from awesome_iina.models import (
    Candidate,
    DiscoveryBackend,
    DiscoveryEvidence,
    DiscoveryRun,
    EvidenceKind,
    OfficialPluginEntry,
    OverrideFile,
    PluginManifest,
    QueryOutcome,
    RepositorySnapshot,
    SearchShard,
)

logger = logging.getLogger(__name__)

_MANIFEST_PATHS = (
    "Info.json",
    "dist/Info.json",
    "src/Info.json",
    "plugin/Info.json",
    "build/Info.json",
)

_OFFICIAL_PLUGIN_SOURCE_ID = "official-iina-plugins"


def _placeholder_snapshot(repository: str) -> RepositorySnapshot:
    return RepositorySnapshot(
        name_with_owner=repository,
        url=f"https://github.com/{repository}",
    )


def _github_hosted(candidate: Candidate) -> bool:
    name = candidate.repository.name_with_owner
    url = candidate.repository.url.casefold()
    if "://" in name:
        return False
    return url.startswith(("https://github.com/", "http://github.com/"))


def _url_keyed_official_candidate(
    candidates: dict[str, Candidate],
    plugin: OfficialPluginEntry,
) -> Candidate:
    key = plugin.url.casefold()
    existing = candidates.get(key)
    if existing is not None:
        return existing
    candidate = Candidate(
        repository=RepositorySnapshot(
            name_with_owner=plugin.url,
            url=plugin.url,
        )
    )
    candidates[key] = candidate
    return candidate


def _candidate_for(
    candidates: dict[str, Candidate],
    repository: str,
    *,
    snapshot: RepositorySnapshot | None = None,
) -> Candidate:
    key = repository.casefold()
    existing = candidates.get(key)
    if existing is None and snapshot:
        existing = next(
            (
                item
                for item in candidates.values()
                if (snapshot.node_id and item.repository.node_id == snapshot.node_id)
                or item.repository.name_with_owner.casefold()
                in {alias.casefold() for alias in snapshot.aliases}
            ),
            None,
        )
    if existing:
        if snapshot:
            old_key = existing.repository.name_with_owner.casefold()
            update = snapshot.model_dump(exclude_unset=True)
            # Placeholder observations cannot erase known identity or objective metadata.
            update = {
                k: v
                for k, v in update.items()
                if k not in {"node_id", "database_id"} or v is not None
            }
            if snapshot.name_with_owner.casefold() != old_key:
                update["aliases"] = sorted(
                    set(
                        existing.repository.aliases
                        + snapshot.aliases
                        + [existing.repository.name_with_owner]
                    )
                )
            elif "aliases" in update:
                update["aliases"] = sorted(set(existing.repository.aliases + snapshot.aliases))
            existing.repository = existing.repository.model_copy(update=update)
            if old_key != key:
                candidates.pop(old_key, None)
                candidates[key] = existing
        return existing
    candidate = Candidate(repository=snapshot or _placeholder_snapshot(repository))
    candidates[key] = candidate
    return candidate


def _collect_page_nodes(
    page: dict[str, Any],
    *,
    candidates: dict[str, Candidate],
    query: RepositoryQueryConfig,
    compiled_query: str,
    seen: set[str] | None = None,
) -> int:
    count = 0
    seen = seen if seen is not None else set()
    for node in page.get("nodes", []):
        if not isinstance(node, dict) or not node.get("nameWithOwner"):
            continue
        if node.get("isPrivate"):
            continue
        identity = str(node.get("id") or node["nameWithOwner"].casefold())
        if identity in seen:
            continue
        seen.add(identity)
        snapshot = repository_snapshot_from_graphql(node)
        candidate = _candidate_for(
            candidates,
            snapshot.name_with_owner,
            snapshot=snapshot,
        )
        kind = (
            EvidenceKind.OFFICIAL_ORG
            if snapshot.name_with_owner.casefold().startswith("iina/")
            else EvidenceKind.REPOSITORY_SEARCH
        )
        candidate.add_evidence(
            DiscoveryEvidence(
                kind=kind,
                source_id=query.id,
                query=compiled_query,
                url=snapshot.url,
                weight=query.weight,
            )
        )
        count += 1
    return count


def _paginate_repository_shard(
    client: GithubDiscoveryClient,
    query: RepositoryQueryConfig,
    shard: SearchShard,
    first_page: dict[str, Any],
    candidates: dict[str, Candidate],
) -> QueryOutcome:
    compiled = shard.compile_query()
    total = int(first_page.get("repositoryCount", 0))
    seen: set[str] = set()
    cursors: set[str] = set()
    page = first_page
    returned = 0
    reason = None
    has_next = False
    while True:
        before = returned
        returned += _collect_page_nodes(
            page, candidates=candidates, query=query, compiled_query=compiled, seen=seen
        )
        if page.get("incomplete_results"):
            reason = "GitHub marked repository-search results incomplete"
        if int(page.get("repositoryCount", total)) != total:
            reason = "Repository count changed during pagination; search is not a frozen snapshot"
        info = page.get("pageInfo") or {}
        has_next = bool(info.get("hasNextPage"))
        cursor = info.get("endCursor")
        if not has_next:
            break
        if not cursor or str(cursor) in cursors:
            reason = "Missing or repeated repository pagination cursor"
            break
        if returned == before:
            reason = "Repository pagination made no unique public progress"
            break
        if returned >= client.config.search_cap:
            reason = "GitHub search cap reached"
            break
        cursors.add(str(cursor))
        try:
            page = client.search_repositories_page(compiled, cursor=cursor)
        except GhError as error:
            reason = f"Repository pagination failed after partial results: {error}"
            break
    complete = reason is None and returned == total and not has_next
    return QueryOutcome(
        query_id=query.id,
        query=compiled,
        kind=EvidenceKind.REPOSITORY_SEARCH,
        backend=DiscoveryBackend(client.config.repository_backend),
        total_count=total,
        returned_count=returned,
        complete=complete,
        incomplete_reason=None if complete else reason or "Repository count mismatch or search cap",
    )


def discover_repository_query(
    client: GithubDiscoveryClient,
    query: RepositoryQueryConfig,
    config: DiscoveryConfig,
    candidates: dict[str, Candidate],
) -> list[QueryOutcome]:
    created_to = config.github.created_to or datetime.now(UTC).date()
    pending: deque[SearchShard] = deque(
        [
            SearchShard(
                query_id=query.id,
                base_query=query.query,
                created_from=config.github.created_from,
                created_to=created_to,
            )
        ]
    )
    outcomes: list[QueryOutcome] = []
    while pending:
        shard = pending.popleft()
        compiled = shard.compile_query()
        try:
            first_page = client.search_repositories_page(compiled)
        except GhError as error:
            outcomes.append(
                QueryOutcome(
                    query_id=query.id,
                    query=compiled,
                    kind=EvidenceKind.REPOSITORY_SEARCH,
                    backend=DiscoveryBackend(client.config.repository_backend),
                    total_count=0,
                    returned_count=0,
                    complete=False,
                    incomplete_reason=f"Repository shard failed: {error}",
                )
            )
            continue
        total = int(first_page.get("repositoryCount", 0))
        if total > config.github.search_cap and query.date_sharding:
            if shard.depth >= config.github.max_shard_depth:
                outcomes.append(
                    QueryOutcome(
                        query_id=query.id,
                        query=compiled,
                        kind=EvidenceKind.REPOSITORY_SEARCH,
                        backend=DiscoveryBackend(client.config.repository_backend),
                        total_count=total,
                        returned_count=_collect_page_nodes(
                            first_page, candidates=candidates, query=query, compiled_query=compiled
                        ),
                        complete=False,
                        incomplete_reason=(
                            "maximum shard depth reached before search cap was cleared"
                        ),
                    )
                )
                continue
            children = split_shard(shard)
            if children is None:
                outcomes.append(
                    QueryOutcome(
                        query_id=query.id,
                        query=compiled,
                        kind=EvidenceKind.REPOSITORY_SEARCH,
                        backend=DiscoveryBackend(client.config.repository_backend),
                        total_count=total,
                        returned_count=_collect_page_nodes(
                            first_page, candidates=candidates, query=query, compiled_query=compiled
                        ),
                        complete=False,
                        incomplete_reason=(
                            "unsplittable query shard still exceeds GitHub's 1,000-result cap"
                        ),
                    )
                )
                continue
            pending.extendleft(reversed(children))
            continue
        outcomes.append(_paginate_repository_shard(client, query, shard, first_page, candidates))
    return outcomes


def discover_code_query(
    client: GithubDiscoveryClient,
    query: CodeQueryConfig,
    candidates: dict[str, Candidate],
) -> QueryOutcome:
    page = 1
    seen: set[tuple[str, str]] = set()
    total: int | None = None
    reason: str | None = None
    while len(seen) < client.config.search_cap:
        try:
            response = client.search_code_page(query.query, page=page)
        except GhError as error:
            reason = f"Code-search pagination failed after partial results: {error}"
            break
        observed_total = int(response.get("total_count", 0))
        if total is not None and observed_total != total:
            reason = "Code-search count changed during pagination"
        if total is None:
            total = observed_total
        if response.get("incomplete_results"):
            reason = "GitHub marked code-search results incomplete"
        items = response.get("items") or []
        before = len(seen)
        for item in items:
            repository_data = item.get("repository") or {}
            repository = repository_data.get("full_name")
            if not repository or repository_data.get("private"):
                continue
            path = item.get("path")
            if not isinstance(path, str):
                reason = "Code-search item missing its file path"
                continue
            identity = (str(repository_data.get("node_id") or repository.casefold()), path)
            if identity in seen:
                continue
            seen.add(identity)
            # Supply only metadata actually returned by this code-search observation.
            snapshot_data = {
                "name_with_owner": repository,
                "url": repository_data.get("html_url") or f"https://github.com/{repository}",
            }
            for old, new in (
                ("node_id", "node_id"),
                ("id", "database_id"),
                ("description", "description"),
                ("fork", "fork"),
                ("private", "private"),
            ):
                if old in repository_data:
                    snapshot_data[new] = repository_data[old]
            candidate = _candidate_for(
                candidates, repository, snapshot=RepositorySnapshot.model_validate(snapshot_data)
            )
            candidate.add_evidence(
                DiscoveryEvidence(
                    kind=EvidenceKind.CODE_SEARCH,
                    source_id=query.id,
                    query=query.query,
                    path=path,
                    url=item.get("html_url"),
                    weight=query.weight,
                    details={"blob_sha": item.get("sha")} if item.get("sha") else {},
                )
            )
        if items and len(seen) == before:
            reason = "Code-search pagination made no unique public progress"
            break
        if len(items) < client.config.page_size or not items:
            break
        page += 1
    total = total or 0
    if total > client.config.search_cap:
        reason = reason or "code-search query exceeds GitHub's 1,000-result cap"
    if len(seen) != total:
        reason = reason or "code-search pagination ended before all reported results were returned"
    return QueryOutcome(
        query_id=query.id,
        query=query.query,
        kind=EvidenceKind.CODE_SEARCH,
        backend=DiscoveryBackend.REST,
        total_count=total,
        returned_count=len(seen),
        complete=reason is None,
        incomplete_reason=reason,
    )


def add_official_plugin_evidence(
    plugins: list[OfficialPluginEntry],
    candidates: dict[str, Candidate],
    *,
    weight: int,
) -> list[str]:
    warnings: list[str] = []
    for plugin in plugins:
        repository = plugin.github_repository
        if repository is None:
            warnings.append(
                "official-index URL has no GitHub repository: "
                f"{plugin.name} ({plugin.id}) {plugin.url}"
            )
            candidate = _url_keyed_official_candidate(candidates, plugin)
        else:
            candidate = _candidate_for(candidates, repository)
        candidate.add_evidence(
            DiscoveryEvidence(
                kind=EvidenceKind.OFFICIAL_PLUGIN_INDEX,
                source_id=_OFFICIAL_PLUGIN_SOURCE_ID,
                url=plugin.url,
                weight=weight,
                details={"name": plugin.name, "id": plugin.id, "description": plugin.desc},
            )
        )
    return warnings


def _candidate_manifest_paths(candidate: Candidate) -> list[str]:
    evidence_paths = [
        evidence.path
        for evidence in candidate.evidence
        if evidence.path and evidence.path.casefold().endswith("info.json")
    ]
    return list(dict.fromkeys([*evidence_paths, *_MANIFEST_PATHS]))


def inspect_manifest(client: GithubContentClient, candidate: Candidate) -> None:
    if not _github_hosted(candidate):
        return
    repository = candidate.repository.name_with_owner
    for path in _candidate_manifest_paths(candidate):
        try:
            content = client.get_content(repository, path, ref=candidate.repository.default_branch)
        except GhError as error:
            candidate.manifest_errors.append(f"{path}: request failed: {error}")
            continue
        if content is None:
            continue
        try:
            payload = decode_json_content(content, source=f"{repository}:{path}")
            manifest = PluginManifest.model_validate(payload)
        except (GhError, ValidationError, ValueError) as error:
            candidate.manifest_errors.append(f"{path}: {error}")
            logger.debug("Ignoring invalid plugin manifest at %s:%s", repository, path)
            continue
        candidate.manifest = manifest
        candidate.manifest_path = path
        candidate.add_evidence(
            DiscoveryEvidence(
                kind=EvidenceKind.PLUGIN_MANIFEST,
                source_id="manifest-probe",
                path=path,
                url=(
                    f"https://github.com/{repository}/blob/"
                    f"{candidate.repository.default_branch or 'HEAD'}/{path}"
                ),
                weight=0,
                details={"identifier": manifest.identifier, "version": manifest.version},
            )
        )
        return


def enrich_candidates(client: GithubDiscoveryClient, candidates: dict[str, Candidate]) -> list[str]:
    enriched, warnings = client.enrich_repositories(
        candidate.repository.name_with_owner
        for candidate in candidates.values()
        if _github_hosted(candidate)
    )
    for key, snapshot in enriched.items():
        if snapshot.private:
            # Remove all prior public observations if current enrichment says private.
            for old_key, candidate in list(candidates.items()):
                if old_key == key or (
                    snapshot.node_id and candidate.repository.node_id == snapshot.node_id
                ):
                    del candidates[old_key]
            warnings.append("A non-public enrichment result was excluded")
            continue
        _candidate_for(candidates, snapshot.name_with_owner, snapshot=snapshot)
    return warnings


def load_overrides(path: Path) -> OverrideFile:
    if not path.exists():
        return OverrideFile()
    return load_model(path, OverrideFile)


def classify_candidates(
    candidates: dict[str, Candidate],
    config: DiscoveryConfig,
    overrides: OverrideFile,
) -> None:
    for key, candidate in candidates.items():
        score_candidate(candidate, config, override=overrides.repositories.get(key))


def _candidate_sort_key(candidate: Candidate) -> tuple[int, str]:
    return (-candidate.score, candidate.repository.name_with_owner.casefold())


def _failed_query_outcome(
    query: RepositoryQueryConfig | CodeQueryConfig,
    kind: EvidenceKind,
    message: str,
    *,
    backend: DiscoveryBackend,
) -> QueryOutcome:
    return QueryOutcome(
        query_id=query.id,
        query=query.query,
        kind=kind,
        backend=backend,
        total_count=0,
        returned_count=0,
        complete=False,
        incomplete_reason=message,
    )


def run_discovery(
    *,
    config_path: Path,
    config: DiscoveryConfig,
    client: GithubDiscoveryClient,
    mode: str,
    checkpoint: Path | None = None,
    resume: bool = False,
) -> DiscoveryRun:
    if mode not in {"quick", "full"}:
        raise ValueError("mode must be 'quick' or 'full'")
    started = datetime.now(UTC)
    candidates: dict[str, Candidate] = {}
    outcomes: list[QueryOutcome] = []
    warnings: list[str] = []

    official_plugins, official_warnings = try_load_official_plugins(
        config.paths.official_plugins_snapshot
    )
    warnings.extend(official_warnings)
    source_weight = next(
        (source.weight for source in config.sources if source.id == _OFFICIAL_PLUGIN_SOURCE_ID),
        100,
    )
    warnings.extend(
        add_official_plugin_evidence(official_plugins, candidates, weight=source_weight)
    )

    # Pin an implicit date range for this invocation and bind checkpoint identity to it.
    config = config.model_copy(deep=True)
    config.github.created_to = config.github.created_to or started.date()
    input_hashes = {}
    for source_path in (config.paths.official_plugins_snapshot, config.paths.overrides):
        input_hashes[str(source_path)] = (
            hashlib.sha256(source_path.read_bytes()).hexdigest() if source_path.is_file() else None
        )
    binding = hashlib.sha256(
        json.dumps(
            {"config": config.model_dump(mode="json"), "mode": mode, "inputs": input_hashes},
            sort_keys=True,
        ).encode()
    ).hexdigest()
    completed: set[str] = set()
    if resume:
        if checkpoint is None or not checkpoint.is_file():
            raise ValueError("Resume requires an existing explicit checkpoint")
        saved = json.loads(checkpoint.read_text(encoding="utf-8"))
        if saved.get("schema_version") != 1 or saved.get("binding") != binding:
            raise ValueError(
                "Checkpoint does not match this config, date range, mode, or source inputs"
            )
        completed = set(saved["completed"])
        candidates = {
            key: Candidate.model_validate(value) for key, value in saved["candidates"].items()
        }
        candidates = {
            key: value for key, value in candidates.items() if not value.repository.private
        }
        outcomes = [QueryOutcome.model_validate(value) for value in saved["outcomes"]]
        outcomes = [
            value for value in outcomes if f"{value.kind.value}:{value.query_id}" in completed
        ]

    if official_warnings:
        reason = official_warnings[0]
        already_recorded = any(
            outcome.query_id == _OFFICIAL_PLUGIN_SOURCE_ID
            and outcome.kind is EvidenceKind.OFFICIAL_PLUGIN_INDEX
            for outcome in outcomes
        )
        if not already_recorded:
            outcomes.append(
                QueryOutcome(
                    query_id=_OFFICIAL_PLUGIN_SOURCE_ID,
                    query=str(config.paths.official_plugins_snapshot),
                    kind=EvidenceKind.OFFICIAL_PLUGIN_INDEX,
                    total_count=0,
                    returned_count=0,
                    complete=False,
                    incomplete_reason=reason,
                )
            )

    def save_checkpoint() -> None:
        if checkpoint is not None:
            write_json(
                checkpoint,
                {
                    "schema_version": 1,
                    "binding": binding,
                    "completed": sorted(completed),
                    "candidates": {
                        key: value.model_dump(mode="json", exclude_unset=True)
                        for key, value in candidates.items()
                        if not value.repository.private
                    },
                    "outcomes": [
                        value.model_dump(mode="json", exclude_unset=True) for value in outcomes
                    ],
                },
            )

    repository_queries = [
        query
        for query in config.repository_queries
        if query.enabled and (mode == "full" or query.quick)
    ]
    for query in repository_queries:
        task = f"repository-search:{query.id}"
        if task in completed:
            continue
        before_outcomes = len(outcomes)
        logger.info("Repository discovery: %s", query.id)
        try:
            outcomes.extend(discover_repository_query(client, query, config, candidates))
        except GhError as error:
            message = f"repository query {query.id} failed: {error}"
            warnings.append(message)
            outcomes.append(
                _failed_query_outcome(
                    query,
                    EvidenceKind.REPOSITORY_SEARCH,
                    message,
                    backend=DiscoveryBackend(config.github.repository_backend),
                )
            )

        if outcomes[before_outcomes:] and all(
            outcome.complete for outcome in outcomes[before_outcomes:]
        ):
            completed.add(task)
        save_checkpoint()

    code_queries = [
        query for query in config.code_queries if query.enabled and (mode == "full" or query.quick)
    ]
    for query in code_queries:
        task = f"code-search:{query.id}"
        if task in completed:
            continue
        logger.info("Code discovery: %s", query.id)
        try:
            outcomes.append(discover_code_query(client, query, candidates))
        except GhError as error:
            message = f"code query {query.id} failed: {error}"
            warnings.append(message)
            outcomes.append(
                _failed_query_outcome(
                    query,
                    EvidenceKind.CODE_SEARCH,
                    message,
                    backend=DiscoveryBackend.REST,
                )
            )

        if outcomes[-1].complete:
            completed.add(task)
        save_checkpoint()

    warnings.extend(
        outcome.incomplete_reason
        for outcome in outcomes
        if not outcome.complete
        and outcome.incomplete_reason
        and outcome.incomplete_reason not in warnings
    )
    warnings.extend(enrich_candidates(client, candidates))
    overrides = load_overrides(config.paths.overrides)
    classify_candidates(candidates, config, overrides)

    inspectable = sorted(
        candidates.values(),
        key=_candidate_sort_key,
    )[: config.github.deep_candidate_limit]
    for candidate in inspectable:
        if candidate.score < config.scoring.review_threshold:
            continue
        if not _github_hosted(candidate):
            continue
        inspect_manifest(client, candidate)
    classify_candidates(candidates, config, overrides)

    ordered = sorted(
        candidates.values(),
        key=_candidate_sort_key,
    )
    return DiscoveryRun(
        started_at=started,
        finished_at=datetime.now(UTC),
        config_sha256=config_digest(config_path),
        mode=mode,
        repository_backend=DiscoveryBackend(config.github.repository_backend),
        candidates=ordered,
        outcomes=outcomes,
        warnings=warnings,
    )


def save_discovery_run(run: DiscoveryRun, path: Path) -> None:
    write_json(path, run, exclude_none=False, exclude_unset=True)


def load_discovery_run(path: Path) -> DiscoveryRun:
    return DiscoveryRun.model_validate_json(path.read_text(encoding="utf-8"))


def reclassify_run(
    run: DiscoveryRun,
    config: DiscoveryConfig,
    overrides: OverrideFile,
) -> DiscoveryRun:
    name_counts: dict[str, int] = {}
    for candidate in run.candidates:
        key = candidate.repository.name_with_owner.casefold()
        name_counts[key] = name_counts.get(key, 0) + 1

    for candidate in run.candidates:
        key = candidate.repository.name_with_owner.casefold()
        override = overrides.repositories.get(key) if name_counts[key] == 1 else None
        score_candidate(candidate, config, override=override)
        if name_counts[key] > 1 and key in overrides.repositories:
            warning = (
                "manual override was not applied to ambiguous repository name: "
                f"{candidate.repository.name_with_owner}"
            )
            if warning not in run.warnings:
                run.warnings.append(warning)
    run.candidates = sorted(
        run.candidates,
        key=_candidate_sort_key,
    )
    return run
