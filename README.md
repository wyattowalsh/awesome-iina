# Awesome IINA

[![Awesome](https://awesome.re/badge.svg)](docs/catalog/policy/awesome-list-policy.md)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> A deeply curated, reproducible index of IINA plugins, integrations, developer resources, workflows, and foundational media tooling.

Independent of the IINA project. The Awesome badge marks list style only; this catalog is not an [awesome.re](https://awesome.re) listing.

**75** projects · **60** plugins · **12** official · **6** featured · [Handbook](docs/README.md)

## Contents

- [Start here](#start-here)
- [Curated ecosystem](#curated-ecosystem)
- [IINA core and official resources](#iina-core-and-official-resources)
- [Official plugins](#official-plugins)
- [Playback and navigation](#playback-and-navigation)
- [Subtitles, translation, and language learning](#subtitles-translation-and-language-learning)
- [Media libraries and online services](#media-libraries-and-online-services)
- [Clipping, screenshots, and editing](#clipping-screenshots-and-editing)
- [Video, audio, and rendering enhancement](#video-audio-and-rendering-enhancement)
- [Casting and device integrations](#casting-and-device-integrations)
- [Scrobbling and watch tracking](#scrobbling-and-watch-tracking)
- [Automation and companion workflows](#automation-and-companion-workflows)
- [Developer tools and references](#developer-tools-and-references)
- [Foundational media tooling](#foundational-media-tooling)
- [Historical and archived projects](#historical-and-archived-projects)
- [Handbook](#handbook)
- [Contributing](#contributing)

## Start here

- **[IINA](https://github.com/iina/iina)** `Official · Featured` The modern open-source media player for macOS, powered by mpv and designed for native Mac workflows. `macos` `media player` `mpv`
- **[IINA Plugin Definition](https://github.com/iina/iina-plugin-definition)** `Official · Featured` Official TypeScript definitions and generated API documentation for IINA plugin authors. `api` `types` `typescript`
- **[IINA Plugin Template](https://github.com/iina/iina-plugin-template)** `Official · Featured` Minimal official repository structure for starting a new IINA plugin. `scaffolding` `template`
- **[Online Media](https://github.com/iina/plugin-online-media)** `Official · Featured` Plays supported online media through yt-dlp and provides the official network-media integration for IINA. `online media` `yt-dlp` Shares plugin identifier io.iina.ytdl with slug legacy-plugin-ytdl, the archived predecessor.
- **[OpenSubtitles](https://github.com/iina/plugin-opensub)** `Official · Featured` Searches OpenSubtitles from IINA through the official subtitle-provider and sidebar integration. `opensubtitles` `subtitles`
- **[User Scripts](https://github.com/iina/plugin-userscript)** `Official · Featured` Runs user-authored JavaScript in IINA and exposes official examples for scripting, overlays, menus, and global hooks. `automation` `javascript` `userscripts`

First-party plugin path: [plugin template](https://github.com/iina/iina-plugin-template), [TypeScript definitions](https://github.com/iina/iina-plugin-definition), and [plugin documentation](https://docs.iina.io/pages/creating-plugins.html). Workflow notes: [Plugin development](docs/catalog/authoring/plugin-development.md).

## Curated ecosystem

<!-- This section is generated from src/awesome_iina/catalog/catalog.yaml. Do not edit entries directly. -->

### IINA core and official resources

The player, official website, build infrastructure, and authoritative references.

- **[IINA](https://github.com/iina/iina)** `Official · Featured` The modern open-source media player for macOS, powered by mpv and designed for native Mac workflows. `macos` `media player` `mpv`
- **[IINA website](https://github.com/iina/iina-website)** `Official` Source for the official IINA website, documentation entry points, downloads, and public project pages. `documentation` `website`


### Official plugins

Plugins maintained in the IINA GitHub organization.

- **[More Seeking](https://github.com/iina/plugin-more-seeking)** `Official` Adds extra seek controls and configurable seeking behavior through an official IINA plugin. `navigation` `seeking`
- **[Online Media](https://github.com/iina/plugin-online-media)** `Official · Featured` Plays supported online media through yt-dlp and provides the official network-media integration for IINA. `online media` `yt-dlp` Shares plugin identifier io.iina.ytdl with slug legacy-plugin-ytdl, the archived predecessor.
- **[OpenSubtitles](https://github.com/iina/plugin-opensub)** `Official · Featured` Searches OpenSubtitles from IINA through the official subtitle-provider and sidebar integration. `opensubtitles` `subtitles`
- **[User Scripts](https://github.com/iina/plugin-userscript)** `Official · Featured` Runs user-authored JavaScript in IINA and exposes official examples for scripting, overlays, menus, and global hooks. `automation` `javascript` `userscripts`


### Playback and navigation

Seeking, speed control, looping, playlists, browsing, and playback ergonomics.

- **[Auto Skip](https://github.com/pangziqiang/iina-auto-skip)** **Maintenance status unverified.** Lets users mark intro and outro ranges with an overlay, then skips those segments automatically. `intro skip` `outro skip`
- **[A–Z Loop](https://github.com/micro-JAY/iina-az-loop)** **Maintenance status unverified.** Adds a compact A–B style looping workflow for repeating selected playback ranges. `loop` `repeat`
- **[Bookmarks](https://github.com/wyattowalsh/iina-plugin-bookmarks)** **Maintenance status unverified.** Saves named timestamps and makes them manageable and reusable across IINA playback sessions. `bookmarks` `timestamps`
- **[CineMode](https://github.com/D0CA/iina-cinemode)** **Maintenance status unverified.** Fullscreen pause overlay and intro skipping, with an optional Stremio next-episode shortcut. `fullscreen` `skip-intro` Listed upstream; native compatibility has not been tested here.
- **[Detached Playlist](https://github.com/HowDidTheCatGetSoFat/iina-detached-playlist)** **Maintenance status unverified.** Displays the active IINA playlist in a separate floating window for multi-window workflows. `playlist` `window`
- **[File Viewer](https://github.com/qktechies/iina-plugin-file-viewer)** **Maintenance status unverified.** Bookmarks folders, browses directory contents, and opens local videos without leaving IINA. `file browser` `folders`
- **[Hold to Speed](https://github.com/Tommy12356F/iina-hold-to-speed)** **Maintenance status unverified.** Temporarily switches playback to 2× while the Space key is held. `keyboard` `speed`
- **[IINA Continue](https://github.com/muzipin/iina-continue)** **Maintenance status unverified.** Adds a continue-watching workflow for resuming previously opened media. `resume` `watch history`
- **[Jump to Frame](https://github.com/bbeny123/iina-jump-to-frame)** **Maintenance status unverified.** Seeks directly to a requested frame number for frame-oriented inspection and navigation. `frame accurate` `seeking`
- **[Multi Segment Repeat](https://github.com/nobuo-miura/iina-multi-segment-repeat)** **Maintenance status unverified.** Stores and repeats multiple selected media segments during one IINA session. `loop` `segments`
- **[PiP Toggle for IINA](https://github.com/nastarandarjani/iina-pip-toggle)** **Maintenance status unverified.** Adds a focused command for switching between Picture in Picture and fullscreen playback. `fullscreen` `picture in picture`
- **[Playlist Pro](https://github.com/CatCodeDanix/iina-playlist-pro)** **Maintenance status unverified.** Improves management of local and online playlists inside IINA. `online media` `playlist`
- **[Playlist Searchbox](https://github.com/icsarisakal/iina-playlist-searchbox)** **Maintenance status unverified.** Searches the current playlist by title and artist to speed up navigation in long queues. `playlist` `search`
- **[Playlist Sortings](https://github.com/dotWee/iina-playlist-sortings)** **Maintenance status unverified.** Adds alternative playlist sorting controls for IINA. `playlist` `sorting`
- **[Quick Folders](https://github.com/JakeCalkins/iina-quick-folders-plugin)** **Maintenance status unverified.** Provides quicker access to frequently used media folders from IINA. `folders` `navigation`
- **[Skip Intro](https://github.com/pparanoiidd/iina-skip-intro)** **Maintenance status unverified.** Detects and skips intros, recaps, and credits during episodic playback. `credits` `intro skip`


### Subtitles, translation, and language learning

Subtitle search, generation, translation, dictionaries, danmaku, and bilingual study.

- **[Bilingual Audio](https://github.com/glechic/iina-bilingual-audio)** **Maintenance status unverified.** Routes two audio tracks to separate left and right channels for bilingual viewing. `audio tracks` `language learning`
- **[Clickable Subtitles](https://github.com/kerim/iina-clickable-subtitles)** **Maintenance status unverified.** Makes subtitle words clickable and sends them to the macOS Look Up interface. `dictionary` `language learning`
- **[Danmaku](https://github.com/xjbeta/iina-plugin-danmaku)** **Maintenance status unverified.** Overlays time-synchronized scrolling comments from supported danmaku sources. `bilibili` `danmaku`
- **[Danmaku Cosmos](https://github.com/karappo-yu/iina-plugin-danmaku-cosmos)** **Maintenance status unverified.** Renders Niconico and Bilibili comments with CSS or Canvas and supports advanced comment art. `bilibili` `comment art` `danmaku`
- **[IINA SubMaster](https://github.com/ivLis-Studio/IINA-SubMaster)** **Maintenance status unverified.** Provides subtitle-oriented controls and workflows for IINA. `subtitles`
- **[iinatan](https://github.com/afn478/iinatan)** **Experimental.** Adds subtitle dictionary popups, local OCR, profiles, controller navigation, and optional Anki export to IINA. `anki` `dictionary` `language learning` `ocr` `subtitles` The project describes itself as experimental; dictionary and OCR behavior varies by language and media.
- **[PolyScript](https://github.com/SammoMichael/polyplugin-release)** **Maintenance status unverified.** Combines dual subtitles, hover definitions, and AI-assisted translation for language study. `ai translation` `dictionary` `dual subtitles`
- **[Realtime Speech Translator](https://github.com/isparkyou-github/iina-realtime-speech-translator)** **Experimental.** Explores live speech translation for media playing in IINA. `speech recognition` `translation`
- **[Save Subs](https://github.com/bbeny123/iina-save-subs)** **Maintenance status unverified.** Extracts or saves subtitle tracks from the current IINA media item. `export` `subtitles`
- **[SubTandem](https://github.com/janwee-sha/SubTandem)** **Maintenance status unverified.** Translates embedded or external text subtitles and renders the translated track in IINA. `ass` `srt` `translation` SubLingo was a predecessor name; its Info.json identifier was unrecovered.
- **[Subtitle Navigator](https://github.com/CoderChen01/IINA-subtitle-navigator)** **Experimental.** Provides a standalone subtitle browser with search, seek, line looping, and copy workflows for language study. `language learning` `looping` `subtitle navigation` `subtitles` The author explicitly does not promise long-term maintenance; current parsing is focused on external SRT files.
- **[Whisperina](https://github.com/yuxiqian/whisperina)** **Experimental.** Generates subtitle tracks from local media by connecting IINA to FFmpeg and whisper.cpp models. `ffmpeg` `speech recognition` `subtitles` `whisper.cpp` Requires local FFmpeg and whisper.cpp command-line tools plus separately downloaded models.


### Media libraries and online services

Jellyfin, online media, catalog browsing, and service integrations.

- **[Cinema IINA Plugin](https://github.com/hailp-vn38/cinema-iina-plugin)** **Experimental.** Experiments with a cinema-oriented media experience inside IINA. `cinema` `media browsing`
- **[Episode Info](https://github.com/Zain-Imam/iina-episode-info)** **Maintenance status unverified.** Shows TMDB movie or episode details on pause and includes subtitle-search support. `metadata` `tmdb`
- **[IINA Jellyfin Companion](https://github.com/yxwyoyoyo/iina-jellyfin-companion)** **Maintenance status unverified.** Adds companion functionality around Jellyfin playback in IINA. `companion` `jellyfin`
- **[IINA Store](https://github.com/Kuameh/iina-store)** **Maintenance status unverified.** Browse, search, and install community IINA plugins from a standalone window and companion sidebar. `catalog` `discovery` Independent third-party installer; its package and remote catalog were not executed or security-certified here. Info.json identifier com.example.iina-store is the upstream placeholder reverse-DNS id, not listed in IINA's official plugins.json index.
- **[Jellyfin](https://github.com/mhajder/iina-jellyfin)** **Maintenance status unverified.** Browses a Jellyfin server and plays its media directly in IINA. `jellyfin` `media server`
- **[Jellyfin IINA](https://github.com/ada-bee/jellyfin-iina)** **Maintenance status unverified.** Provides another community implementation for using Jellyfin with IINA. `jellyfin` `media server`
- **[YouTube IINA](https://github.com/ada-bee/youtube-iina)** **Maintenance status unverified.** Connects YouTube-oriented browsing or playback workflows with IINA. `online media` `youtube`


### Clipping, screenshots, and editing

Frame-accurate capture, clipping, recording, screenshots, and review workflows.

- **[DV Timecode](https://github.com/xingrz/iina-dv-timecode)** **Maintenance status unverified.** Surfaces DV-oriented timecode information while inspecting media in IINA. `dv` `timecode`
- **[HDR Screenshot](https://github.com/bbeny123/iina-hdr-screenshot)** Captures tone-mapped SDR screenshots from HDR media using FFmpeg within an IINA workflow. `ffmpeg` `hdr` `screenshots` `tone mapping` Requires FFmpeg; zscale mode additionally requires an FFmpeg build with libzimg.
- **[IINA Clip Maker](https://github.com/gridness/iina-clip-maker-plugin)** **Maintenance status unverified.** Adds a lightweight clip-creation workflow for the current IINA media item. `clipping` `editing`
- **[Multiple Clips](https://github.com/karthisnk/multi-cutter-iina)** **Maintenance status unverified.** Uses FFmpeg to batch-create clips, including vertical output and selectable formats. `batch clipping` `ffmpeg` Shares plugin identifier com.recorder.iina-plugin with slug recorder; review before installing both.
- **[Recorder](https://github.com/5thDimensionalVader/recorder-iina)** **Maintenance status unverified.** Creates video clips from IINA playback by invoking FFmpeg. `clipping` `ffmpeg` Shares plugin identifier com.recorder.iina-plugin with slug multiple-clips; review before installing both.


### Video, audio, and rendering enhancement

Upscaling, shaders, normalization, HDR, VR conversion, and visual processing.

- **[Anime4K for IINA](https://github.com/yorkyang2333/iina-anime4k)** **Maintenance status unverified.** Applies Anime4K shaders for real-time anime upscaling during IINA playback. `anime4k` `shader` `upscaling`
- **[Audio Normalize](https://github.com/Gabe-LS/iina-audio-normalize)** Analyzes playback audio with FFmpeg and applies cached peak or EBU R128 normalization in IINA. `audio` `ebu r128` `ffmpeg` `loudness normalization` Requires FFmpeg; optional BLAKE3 or xxHash tools accelerate cache fingerprinting.
- **[IINA Night Shift Fullscreen](https://github.com/leo-mathurin/iina-nightshift-fs)** **Maintenance status unverified.** Coordinates macOS Night Shift behavior with IINA fullscreen playback. `display` `night shift`
- **[IINA Video Cleaner](https://github.com/adamhl8/iina-video-cleaner)** **Maintenance status unverified.** Automates cleanup actions around video files opened in IINA. `cleanup` `video`
- **[IINA Video Upscaler](https://github.com/Fhlisherman/iina-video-upscaler)** **Experimental.** Applies FSRCNNX, Anime4K, CAS, and SSim shaders through IINA’s mpv rendering pipeline. `anime4k` `fsrcnnx` `glsl shaders` `super resolution` `upscaling`
- **[VR2D](https://github.com/fetzu/iina-plugin-vr2d)** **Maintenance status unverified.** Converts common 180° and 360° VR layouts into a pannable flat view for IINA. `180 video` `360 video` `vr`


### Casting and device integrations

AirPlay, Chromecast, Home Assistant, and external playback targets.

- **[IINA AirPlay](https://github.com/ozykhan/iina-airplay)** **Maintenance status unverified.** Adds an AirPlay-oriented handoff or casting workflow for IINA. `airplay` `casting`
- **[IINA Chromecast](https://github.com/dpacmittal/iina-chromecast)** **Experimental.** Explores casting IINA media to Chromecast-compatible devices. `casting` `chromecast`
- **[IINA Home Assistant](https://github.com/smintlife/iina-plugin-homeassistant)** **Maintenance status unverified.** Connects IINA playback events or controls with Home Assistant. `home assistant` `smart home`


### Scrobbling and watch tracking

Trakt, AniList, MyShows, ListenBrainz, and playback-progress synchronization.

- **[AniList Sync](https://github.com/gridness/anilist-sync)** **Maintenance status unverified.** Synchronizes anime-watching progress from IINA with AniList. `anilist` `anime` `tracking`
- **[ListenBrainz Scrobbler](https://git.notfire.cc/notfire/iina-listenbrainz)** **Maintenance status unverified.** Submits music-listening activity from IINA to ListenBrainz. `listenbrainz` `music` `scrobbling`
- **[MyShows](https://github.com/amiv1/iina-plugin-myshows)** **Maintenance status unverified.** Integrates IINA playback with the MyShows tracking service. `myshows` `tracking`
- **[Trakt Scrobbler](https://github.com/i3p9/iina-trakt-scrobbler)** **Maintenance status unverified.** Scrobbles IINA playback progress to Trakt. `scrobbling` `trakt`


### Automation and companion workflows

Browser handoff, file actions, workflow helpers, and companion utilities.

- **[Delete Video](https://github.com/Vahor/iina-delete-video)** **Maintenance status unverified.** Adds an explicit action for deleting the current video from an IINA workflow. `file management`
- **[IINA File Name Search](https://github.com/Robpol86/iina-file-name-search)** **Maintenance status unverified.** Searches for related media filenames from an IINA-centered workflow. `file search` `workflow`


### Developer tools and references

Templates, type definitions, APIs, examples, and developer infrastructure.

- **[IINA Dependency Build Scripts](https://github.com/iina/deps-buildscripts)** `Official` Build scripts used by IINA to prepare native media dependencies. `build` `dependencies`
- **[IINA Plugin Definition](https://github.com/iina/iina-plugin-definition)** `Official · Featured` Official TypeScript definitions and generated API documentation for IINA plugin authors. `api` `types` `typescript`
- **[IINA Plugin Template](https://github.com/iina/iina-plugin-template)** `Official · Featured` Minimal official repository structure for starting a new IINA plugin. `scaffolding` `template`
- **[Parcel Optimizer Webview](https://github.com/iina/parcel-optimizer-webview)** `Official` Official Parcel optimizer used when packaging webview assets for IINA plugins. `parcel` `webview`


### Foundational media tooling

Cross-player tools used to inspect, transform, and understand media files.

- **[Anime4K](https://github.com/bloc97/Anime4K)** Provides the upstream real-time anime upscaling algorithms and shaders used by compatible integrations. `anime` `shader` `upscaling`
- **[FFmpeg](https://github.com/FFmpeg/FFmpeg)** The core multimedia toolkit used by many IINA plugins for probing, transcoding, clipping, and filtering. `clipping` `encoding` `ffprobe`
- **[libass](https://github.com/libass/libass)** Renders ASS and SSA subtitles and underpins advanced subtitle presentation in mpv-based players. `ass` `rendering` `subtitles`
- **[libplacebo](https://github.com/haasn/libplacebo)** Provides GPU-accelerated rendering primitives used by modern video players and shader pipelines. `gpu` `rendering` `shaders`
- **[MediaInfo](https://github.com/MediaArea/MediaInfo)** Reports detailed container, codec, stream, HDR, language, and tag metadata for media files. `codecs` `metadata` `probing`
- **[MKVToolNix](https://github.com/mkvtoolnix/mkvtoolnix)** Inspects, multiplexes, edits, and validates Matroska containers with mkvmerge, mkvinfo, and related tools. `matroska` `metadata` `mkv`
- **[mpv](https://github.com/mpv-player/mpv)** The command-line media player and playback engine embedded by IINA. `media player` `playback engine`
- **[yt-dlp](https://github.com/yt-dlp/yt-dlp)** Resolves and downloads online media and is used by IINA’s official Online Media plugin. `downloader` `online media`


### Historical and archived projects

Superseded or archived projects retained for research and migration context.

- **[Legacy mpv-IINA Homebrew Tap](https://github.com/iina/homebrew-mpv-iina)** `Official` **Archived.** Archived Homebrew tap once used for IINA-specific mpv builds. `archived` `homebrew` Retained for historical build research only.
- **[Legacy YouTube-dl Plugin](https://github.com/iina/plugin-ytdl)** `Official` **Archived.** Archived predecessor to the current official Online Media plugin, retained for migration history. `archived` `online media` Shares plugin identifier io.iina.ytdl with slug official-online-media. Use iina/plugin-online-media for current installations.


## Handbook

Contributor map and runbooks live under [`docs/`](docs/README.md). Machine interfaces:

- Catalog SSOT: [`src/awesome_iina/catalog/catalog.yaml`](src/awesome_iina/catalog/catalog.yaml)
- Export + schemas: [`catalog.json`](src/awesome_iina/catalog/exports/catalog.json), [`schemas/`](src/awesome_iina/catalog/schemas/README.md)
- Copier starter: [`starter/`](starter/README.md) · [guide](docs/catalog/authoring/plugin-starter.md)
- Discovery: [`docs/discovery/`](docs/discovery/discovery.md)
- Scope and review: [`scope.md`](docs/catalog/policy/scope.md), [`curation-playbook.md`](docs/catalog/policy/curation-playbook.md)
- Agents: [`AGENTS.md`](AGENTS.md) · [`awesome-iina-maintainer`](skills/awesome-iina-maintainer/SKILL.md)
- Browser catalog: [`src/awesome_iina/site/`](src/awesome_iina/site/README.md) · identity kit notes in [`docs/maintain/brand.md`](docs/maintain/brand.md)

```bash
just validate && just generate && just check
just discover-nightly   # read-only GitHub scan; does not edit the catalog
just starter-info
```

## Contributing

Read [`.github/CONTRIBUTING.md`](.github/CONTRIBUTING.md), edit `src/awesome_iina/catalog/catalog.yaml`, then run `just validate && just generate && just check`. Suggest projects via the [project form](https://github.com/wyattowalsh/awesome-iina/issues/new?template=project.yml).

## License

Original curation, documentation, and tooling are [MIT](LICENSE). Linked projects keep their own licenses. Attribution and independence: [`docs/history/NOTICE.md`](docs/history/NOTICE.md).
