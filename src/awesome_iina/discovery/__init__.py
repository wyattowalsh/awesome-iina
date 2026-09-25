"""GitHub discovery pipeline. Findings are leads, not catalog entries."""

from awesome_iina.discovery.pipeline import (
    _candidate_for,
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

__all__ = [
    "_candidate_for",
    "add_official_plugin_evidence",
    "classify_candidates",
    "discover_code_query",
    "discover_repository_query",
    "enrich_candidates",
    "inspect_manifest",
    "load_discovery_run",
    "load_overrides",
    "reclassify_run",
    "run_discovery",
    "save_discovery_run",
]
