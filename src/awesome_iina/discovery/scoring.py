from __future__ import annotations

from collections import defaultdict

from awesome_iina.discovery.settings import DiscoveryConfig
from awesome_iina.models import (
    Candidate,
    CandidateDecision,
    Category,
    OverrideRecord,
)

_CATEGORY_TERMS: dict[Category, tuple[str, ...]] = {
    Category.PLAYBACK: (
        "seek",
        "speed",
        "playlist",
        "loop",
        "skip intro",
        "continue",
        "chapter",
        "frame",
        "pip",
        "playback",
    ),
    Category.SUBTITLES: (
        "subtitle",
        "subtitles",
        "translate",
        "translation",
        "dictionary",
        "danmaku",
        "caption",
        "speech",
        "language",
    ),
    Category.LIBRARIES: (
        "jellyfin",
        "plex",
        "emby",
        "youtube",
        "online media",
        "media server",
        "tmdb",
    ),
    Category.CAPTURE: (
        "clip",
        "record",
        "screenshot",
        "capture",
        "cutter",
        "timecode",
    ),
    Category.ENHANCEMENT: (
        "upscale",
        "anime4k",
        "shader",
        "hdr",
        "normalize",
        "vr2d",
        "audio",
        "video cleaner",
    ),
    Category.CASTING: (
        "airplay",
        "chromecast",
        "cast",
        "home assistant",
    ),
    Category.TRACKING: (
        "trakt",
        "anilist",
        "listenbrainz",
        "scrobble",
        "myshows",
        "tracking",
    ),
    Category.AUTOMATION: (
        "browser extension",
        "companion",
        "workflow",
        "automation",
        "delete video",
        "file name search",
    ),
    Category.DEVELOPMENT: (
        "template",
        "definition",
        "typescript",
        "plugin api",
        "developer",
        "parcel",
        "buildscript",
    ),
}


def infer_categories(candidate: Candidate, config: DiscoveryConfig) -> list[Category]:
    repository = candidate.repository
    haystack = " ".join(
        filter(
            None,
            [
                repository.name_with_owner,
                repository.description,
                repository.homepage_url,
                " ".join(repository.topics),
                candidate.manifest.name if candidate.manifest else None,
                candidate.manifest.description if candidate.manifest else None,
            ],
        )
    ).casefold()

    rules = config.category_inference
    name = repository.name_with_owner.casefold()
    prefix = rules.official_org_prefix.casefold()
    if name.startswith(prefix):
        core = {item.casefold() for item in rules.core_repositories}
        if name in core:
            return [Category.CORE]
        needles = [token.casefold() for token in rules.official_plugin_name_contains]
        if any(token in name for token in needles):
            return [Category.OFFICIAL_PLUGIN]
        return [Category(rules.official_org_fallback)]

    ranked: list[tuple[int, Category]] = []
    for category, terms in _CATEGORY_TERMS.items():
        matches = sum(term in haystack for term in terms)
        if matches:
            ranked.append((matches, category))
    ranked.sort(key=lambda item: (-item[0], item[1].value))
    return [category for _, category in ranked[:3]] or [Category.AUTOMATION]


def score_candidate(
    candidate: Candidate,
    config: DiscoveryConfig,
    *,
    override: OverrideRecord | None = None,
) -> Candidate:
    scoring = config.scoring
    repository = candidate.repository
    reasons: list[str] = []

    # A broad query matrix should improve recall, not create unbounded score inflation.
    # Count the strongest occurrence of each independently configured source.
    by_source: dict[str, int] = defaultdict(int)
    for evidence in candidate.evidence:
        by_source[evidence.source_id] = max(by_source[evidence.source_id], evidence.weight)
    evidence_score = min(sum(by_source.values()), 150)
    score = evidence_score
    if evidence_score:
        reasons.append(f"discovery evidence +{evidence_score}")

    topics = set(repository.topics)
    name = repository.name_with_owner.casefold()
    description = (repository.description or "").casefold()

    if name.startswith("iina/"):
        score += scoring.official_org_bonus
        reasons.append(f"official IINA organization +{scoring.official_org_bonus}")
    if "iina-plugin" in topics:
        score += scoring.topic_iina_plugin_bonus
        reasons.append(f"iina-plugin topic +{scoring.topic_iina_plugin_bonus}")
    elif "iina" in topics:
        score += scoring.topic_iina_bonus
        reasons.append(f"iina topic +{scoring.topic_iina_bonus}")
    if "iina" in name:
        score += scoring.name_iina_bonus
        reasons.append(f"IINA in repository name +{scoring.name_iina_bonus}")
    if "iina" in description:
        score += scoring.description_iina_bonus
        reasons.append(f"IINA in description +{scoring.description_iina_bonus}")

    if candidate.manifest:
        score += scoring.valid_manifest_bonus
        reasons.append(f"valid Info.json +{scoring.valid_manifest_bonus}")
        declared_repo = candidate.manifest.ghRepo
        if declared_repo and declared_repo.casefold() == name:
            score += scoring.gh_repo_match_bonus
            reasons.append(f"Info.json ghRepo matches +{scoring.gh_repo_match_bonus}")

    penalties: tuple[tuple[bool, int, str], ...] = (
        (repository.archived, scoring.archived_penalty, "archived"),
        (repository.fork, scoring.fork_penalty, "fork"),
        (repository.empty, scoring.empty_penalty, "empty"),
        (repository.disabled, scoring.disabled_penalty, "disabled"),
    )
    for applies, amount, label in penalties:
        if applies:
            score -= amount
            reasons.append(f"{label} -{amount}")

    haystack = f"{name} {description}"
    negative_hits = [term for term in config.negative_terms if term.casefold() in haystack]
    context_hit = any(term.casefold() in haystack for term in config.media_context_terms)
    if negative_hits and not context_hit:
        penalty = min(15 * len(negative_hits), 45)
        score -= penalty
        reasons.append(f"ambiguous/non-media name terms -{penalty}")

    categories = infer_categories(candidate, config)
    # Relevance is not human acceptance. Only explicit override decisions may accept.
    decision = (
        CandidateDecision.REVIEW if score >= scoring.review_threshold else CandidateDecision.REJECT
    )
    if score >= scoring.accept_threshold:
        reasons.append("high-priority review; not an automatic catalog recommendation")

    if override:
        score += override.score_delta
        if override.score_delta:
            reasons.append(f"manual score delta {override.score_delta:+d}")
        if override.categories is not None:
            categories = override.categories
            reasons.append("categories set by manual override")
        if override.decision is not None:
            decision = override.decision
            reasons.append(f"decision forced to {decision.value}")
        candidate.manual_note = override.note

    candidate.score = score
    candidate.decision = decision
    candidate.inferred_categories = categories
    candidate.reasons = reasons
    return candidate
