# MKV and media inspection

No single metadata tool exposes every useful fact. `awesome-iina media inspect` runs every supported local inspector and merges a normalized summary while preserving raw evidence.

## Install tools on macOS

```bash
brew install ffmpeg mediainfo mkvtoolnix exiftool
awesome-iina media doctor
```

## Inspect a file

```bash
awesome-iina media inspect movie.mkv --output output/media-reports/movie.mkv.json
```

Or through `just`:

```bash
just inspect-media movie.mkv
```

## Tool roles

### ffprobe

Best general structured stream model. The command captures format, streams, chapters, programs, dispositions, color metadata, and side data:

```bash
ffprobe -v error \
  -show_format -show_streams -show_chapters -show_programs \
  -print_format json movie.mkv
```

### MediaInfo

Useful for human-oriented codec profiles, commercial format names, HDR format strings, channel layouts, encoders, writing applications, and container-specific tags:

```bash
mediainfo --Output=JSON movie.mkv
```

### mkvmerge

Authoritative Matroska-oriented identification for tracks, attachments, chapters, tags, and container properties:

```bash
mkvmerge --identify --identification-format json movie.mkv
```

### mkvinfo

Provides a detailed EBML tree and is invaluable when debugging malformed or unusual Matroska structure:

```bash
mkvinfo movie.mkv
```

The CLI retains up to 2 MB of text to prevent an unexpectedly large report.

### ExifTool

Useful as an additional tag and metadata cross-check:

```bash
exiftool -G -a -s movie.mkv
```

The current normalized report records ExifTool availability but does not duplicate its full output by default.

## Normalized fields

- path, size, suffix, container, duration, and overall bitrate;
- track index and kind;
- codec, codec long name, dimensions, pixel format, and frame rate;
- audio channels, layout, sample rate, and bitrate;
- language, title, default, and forced dispositions;
- color space, transfer, primaries, HDR10/PQ, HLG, Dolby Vision, HDR10+, mastering display, and content-light markers;
- chapter and attachment counts;
- exact inspector versions;
- raw JSON or text output for traceability.

## Interpreting HDR

A PQ transfer (`smpte2084`) suggests HDR10-style signaling but does not by itself prove that all required static metadata is present. Dolby Vision and HDR10+ are detected from side-data labels when exposed by the installed ffprobe build. Cross-check with MediaInfo and mkvmerge before making remuxing or playback-compatibility decisions.

## Common Matroska questions

### Which subtitles are embedded?

Inspect tracks where `kind` is `subtitle`, then compare codec, language, title, default, and forced flags.

### Are fonts attached for ASS subtitles?

Use the attachment count and inspect `raw.mkvmerge.attachments`. Missing fonts can cause layout differences even when subtitles render.

### Why does seeking or duration look wrong?

Compare ffprobe's duration with Matroska container metadata, inspect chapters and cues, and run `mkvinfo`. A remux with `mkvmerge` can repair some index and metadata issues without re-encoding streams.

### How do I produce a compact support report?

Share the normalized top-level fields and track list first. Raw output can contain filenames, titles, encoder strings, or other private metadata, so review it before publishing.
