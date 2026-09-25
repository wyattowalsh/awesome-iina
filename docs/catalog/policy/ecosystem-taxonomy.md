# IINA ecosystem taxonomy

The taxonomy prevents unrelated media software from being presented as a native
IINA extension.

## Resource kinds

### Native plugin

An installable IINA plugin with an `Info.json` manifest and a concrete plugin
identifier. Official and community plugins are distinguished by provenance, not
quality assumptions.

### Developer resource

An API definition, template, CLI, example, documentation set, build tool, test
fixture, or agent instruction set used to create or maintain IINA plugins.

### Companion integration

A browser extension, launcher workflow, media-server bridge, macOS automation,
or application that invokes, controls, or exchanges media with IINA.

### Upstream foundation

A project such as mpv, FFmpeg, yt-dlp, MKVToolNix, or MediaInfo that powers or
materially supports IINA workflows. Upstream foundations require an explicit
IINA relevance note.

### Configuration or asset

A shader, mpv script, profile, input configuration, subtitle tool, or reusable
media asset that can be used through IINA's mpv integration.

### Research candidate

A discovered repository that has not completed curation. Candidates never
appear in the generated Awesome list merely because they scored highly.

## Functional categories

Native plugins and companions may additionally be classified by function:
playback, subtitles, language learning, streaming, media servers, playlists,
metadata, clipping and capture, visual enhancement, audio, automation,
accessibility, developer tooling, AI, or experimental.

A resource should have one primary category and only the minimum useful set of
secondary tags.
