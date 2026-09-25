from __future__ import annotations

from awesome_iina.models import Category

CATEGORY_TITLES: dict[Category, str] = {
    Category.CORE: "IINA core and official resources",
    Category.OFFICIAL_PLUGIN: "Official plugins",
    Category.PLAYBACK: "Playback and navigation",
    Category.SUBTITLES: "Subtitles, translation, and language learning",
    Category.LIBRARIES: "Media libraries and online services",
    Category.CAPTURE: "Clipping, screenshots, and editing",
    Category.ENHANCEMENT: "Video, audio, and rendering enhancement",
    Category.CASTING: "Casting and device integrations",
    Category.TRACKING: "Scrobbling and watch tracking",
    Category.AUTOMATION: "Automation and companion workflows",
    Category.DEVELOPMENT: "Developer tools and references",
    Category.MEDIA_TOOLING: "Foundational media tooling",
    Category.HISTORICAL: "Historical and archived projects",
}

CATEGORY_DESCRIPTIONS: dict[Category, str] = {
    Category.CORE: (
        "The player, official website, build infrastructure, and authoritative references."
    ),
    Category.OFFICIAL_PLUGIN: "Plugins maintained in the IINA GitHub organization.",
    Category.PLAYBACK: (
        "Seeking, speed control, looping, playlists, browsing, and playback ergonomics."
    ),
    Category.SUBTITLES: (
        "Subtitle search, generation, translation, dictionaries, danmaku, and bilingual study."
    ),
    Category.LIBRARIES: "Jellyfin, online media, catalog browsing, and service integrations.",
    Category.CAPTURE: (
        "Frame-accurate capture, clipping, recording, screenshots, and review workflows."
    ),
    Category.ENHANCEMENT: (
        "Upscaling, shaders, normalization, HDR, VR conversion, and visual processing."
    ),
    Category.CASTING: "AirPlay, Chromecast, Home Assistant, and external playback targets.",
    Category.TRACKING: (
        "Trakt, AniList, MyShows, ListenBrainz, and playback-progress synchronization."
    ),
    Category.AUTOMATION: (
        "Browser handoff, file actions, workflow helpers, and companion utilities."
    ),
    Category.DEVELOPMENT: (
        "Templates, type definitions, APIs, examples, and developer infrastructure."
    ),
    Category.MEDIA_TOOLING: (
        "Cross-player tools used to inspect, transform, and understand media files."
    ),
    Category.HISTORICAL: (
        "Superseded or archived projects retained for research and migration context."
    ),
}

CATEGORY_ORDER: tuple[Category, ...] = tuple(CATEGORY_TITLES)
