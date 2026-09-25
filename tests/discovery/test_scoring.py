from pathlib import Path

from awesome_iina.discovery.scoring import infer_categories, score_candidate
from awesome_iina.discovery.settings import DiscoveryConfig, load_config
from awesome_iina.github import repository_snapshot_from_graphql, rest_repository_as_graphql
from awesome_iina.models import (
    Candidate,
    CandidateDecision,
    Category,
    DiscoveryEvidence,
    EvidenceKind,
    OverrideRecord,
    PluginManifest,
    RepositorySnapshot,
)


def config() -> DiscoveryConfig:
    return DiscoveryConfig.model_validate(
        {
            "repository_queries": [],
            "code_queries": [],
            "negative_terms": ["liina"],
            "media_context_terms": ["iina", "video"],
        }
    )


def test_official_repository_requires_review() -> None:
    candidate = Candidate(
        repository=RepositorySnapshot(
            name_with_owner="iina/plugin-example",
            url="https://github.com/iina/plugin-example",
            description="Official IINA plugin.",
        )
    )
    score_candidate(candidate, config())
    assert candidate.decision is CandidateDecision.REVIEW
    assert candidate.score >= 70


def test_valid_manifest_is_strong_evidence() -> None:
    candidate = Candidate(
        repository=RepositorySnapshot(
            name_with_owner="example/player-addon",
            url="https://github.com/example/player-addon",
        ),
        manifest=PluginManifest(
            name="Example",
            version="1.0.0",
            identifier="dev.example",
            author="Example",
            entry="dist/index.js",
            ghRepo="example/player-addon",
        ),
    )
    score_candidate(candidate, config())
    assert candidate.decision is CandidateDecision.REVIEW
    assert any("valid Info.json" in reason for reason in candidate.reasons)


def test_redundant_same_source_evidence_does_not_double_count() -> None:
    candidate = Candidate(
        repository=RepositorySnapshot(
            name_with_owner="example/tool",
            url="https://github.com/example/tool",
        )
    )
    for query in ("one", "two"):
        candidate.add_evidence(
            DiscoveryEvidence(
                kind=EvidenceKind.REPOSITORY_SEARCH,
                source_id="same-source",
                query=query,
                weight=20,
            )
        )
    score_candidate(candidate, config())
    assert candidate.score == 20


def test_category_inference_finds_subtitles() -> None:
    candidate = Candidate(
        repository=RepositorySnapshot(
            name_with_owner="example/iina-translator",
            url="https://github.com/example/iina-translator",
            description="Translate subtitles for language learning.",
        )
    )
    assert infer_categories(candidate, config())[0].value == "subtitles-language"


def test_configured_iina_org_category_rules() -> None:
    cfg = config()
    core = Candidate(
        repository=RepositorySnapshot(
            name_with_owner="iina/iina",
            url="https://github.com/iina/iina",
        )
    )
    website = Candidate(
        repository=RepositorySnapshot(
            name_with_owner="iina/iina-website",
            url="https://github.com/iina/iina-website",
        )
    )
    plugin = Candidate(
        repository=RepositorySnapshot(
            name_with_owner="iina/plugin-opensub",
            url="https://github.com/iina/plugin-opensub",
        )
    )
    other = Candidate(
        repository=RepositorySnapshot(
            name_with_owner="iina/iina-plugin-definition",
            url="https://github.com/iina/iina-plugin-definition",
        )
    )
    assert infer_categories(core, cfg) == [Category.CORE]
    assert infer_categories(website, cfg) == [Category.CORE]
    assert infer_categories(plugin, cfg) == [Category.OFFICIAL_PLUGIN]
    assert infer_categories(other, cfg) == [Category.DEVELOPMENT]


def test_category_inference_reads_discovery_config() -> None:
    cfg = DiscoveryConfig.model_validate(
        {
            "repository_queries": [],
            "code_queries": [],
            "category_inference": {
                "official_org_prefix": "acme/",
                "core_repositories": ["acme/core"],
                "official_plugin_name_contains": ["/addon-"],
                "official_org_fallback": "development",
            },
        }
    )
    core = Candidate(
        repository=RepositorySnapshot(
            name_with_owner="acme/core",
            url="https://github.com/acme/core",
        )
    )
    addon = Candidate(
        repository=RepositorySnapshot(
            name_with_owner="acme/addon-player",
            url="https://github.com/acme/addon-player",
        )
    )
    leftover = Candidate(
        repository=RepositorySnapshot(
            name_with_owner="iina/iina",
            url="https://github.com/iina/iina",
        )
    )
    assert infer_categories(core, cfg) == [Category.CORE]
    assert infer_categories(addon, cfg) == [Category.OFFICIAL_PLUGIN]
    assert infer_categories(leftover, cfg)[0] is not Category.CORE


def test_live_discovery_yaml_keeps_core_and_plugin_rules() -> None:
    live = load_config(Path("src/awesome_iina/discovery/discovery.yaml"))
    names = {item.casefold() for item in live.category_inference.core_repositories}
    assert names == {"iina/iina", "iina/iina-website"}
    assert "/plugin-" in live.category_inference.official_plugin_name_contains


def test_rest_size_zero_empty_penalty_path() -> None:
    node = rest_repository_as_graphql(
        {
            "full_name": "example/empty",
            "html_url": "https://github.com/example/empty",
            "size": 0,
        }
    )
    candidate = Candidate(repository=repository_snapshot_from_graphql(node))
    score_candidate(candidate, config())
    assert candidate.repository.empty is True
    assert any("empty" in reason for reason in candidate.reasons)
    assert candidate.score <= -config().scoring.empty_penalty


def test_penalties_and_negative_terms() -> None:
    candidate = Candidate(
        repository=RepositorySnapshot(
            name_with_owner="example/liina",
            url="https://github.com/example/liina",
            archived=True,
            fork=True,
            empty=True,
            disabled=True,
        )
    )
    score_candidate(candidate, config())
    assert candidate.decision is CandidateDecision.REJECT
    assert candidate.score < 0
    assert any("disabled" in reason for reason in candidate.reasons)


def test_manual_override_controls_decision_categories_and_note() -> None:
    candidate = Candidate(
        repository=RepositorySnapshot(
            name_with_owner="example/ambiguous",
            url="https://github.com/example/ambiguous",
        )
    )
    score_candidate(
        candidate,
        config(),
        override=OverrideRecord(
            decision=CandidateDecision.ACCEPT,
            score_delta=5,
            categories=[Category.DEVELOPMENT],
            note="Reviewed manually.",
        ),
    )
    assert candidate.decision is CandidateDecision.ACCEPT
    assert candidate.inferred_categories == [Category.DEVELOPMENT]
    assert candidate.manual_note == "Reviewed manually."
