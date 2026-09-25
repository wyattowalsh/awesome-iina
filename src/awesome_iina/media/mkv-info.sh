#!/usr/bin/env bash
set -euo pipefail

usage() {
  printf 'usage: %s MEDIA_FILE\n' "${0##*/}" >&2
}

if [[ $# -ne 1 ]]; then
  usage
  exit 64
fi

file=$1
if [[ ! -f $file ]]; then
  printf 'error: file does not exist: %s\n' "$file" >&2
  exit 66
fi

ran=0
run_if_available() {
  local name=$1
  shift
  if command -v "$name" >/dev/null 2>&1; then
    printf '\n=== %s ===\n' "$name"
    "$@"
    ran=1
  fi
}

run_if_available ffprobe \
  ffprobe -v error -show_format -show_streams -show_chapters -show_programs \
  -print_format json "$file"
run_if_available mediainfo mediainfo --Output=JSON "$file"
run_if_available mkvmerge \
  mkvmerge --identify --identification-format json "$file"
run_if_available mkvinfo mkvinfo "$file"
run_if_available exiftool exiftool -G -a -s -j "$file"

if [[ $ran -eq 0 ]]; then
  printf '%s\n' \
    'error: no supported inspector found; install ffmpeg, mediainfo, mkvtoolnix, or exiftool' \
    >&2
  exit 69
fi
