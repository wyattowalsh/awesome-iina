# Sources

## R01: Copier changelog

https://copier.readthedocs.io/en/stable/changelog/

9.18.2 is the current retrieved patched release; dated 2026-09-07.

## R02: Copier configuration

https://copier.readthedocs.io/en/stable/configuring/

StrictUndefined, custom delimiters, conditional destination exclusions, unsafe task/extension boundary.

## R03: Copier updates

https://copier.readthedocs.io/en/stable/updating/

Git lineage and answer history; reviewed updates and conflicts.

## R04: pnpm 12 release

https://pnpm.io/blog/releases/12.0

pnpm 12 stable; Rust rewrite; commands/settings/lockfile mostly carried over; unknown settings can fail under matching pin.

## R05: pnpm 12.4.1 release

https://github.com/pnpm/pnpm/releases/tag/v12.4.1

Latest GitHub stable release retrieved, published 2026-09-10. Dist-tag selection is separate.

## R06: pnpm build policy

https://pnpm.io/settings/build

allowBuilds, strictDepBuilds, verifyDepsBeforeRun; avoid default automatic install before run.

## R07: Node download

https://nodejs.org/en/download

24.21.0 LTS and 26.8.2 Current as retrieved; choose LTS as target.

## R08: TypeScript 7.0.2 release

https://github.com/microsoft/TypeScript/releases/tag/v7.0.2

Latest retrieved stable release, dated 2026-08-20.

## R09: TypeScript 7 announcement

https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/

No TS7 compiler API; official @typescript/typescript6 compatibility path; pin explicit target/types/rootDir.

## R10: esbuild release

https://github.com/evanw/esbuild/releases/tag/v0.28.2

Current retrieved release 0.28.2 dated August 8.

## R11: esbuild API

https://esbuild.github.io/api/

Explicit neutral/browser builds, IIFE output, metadata; syntax targets are not API polyfills.

## R12: IINA stable download

https://iina.io/

Stable download remains 1.4.4; app platform floor is not proof of this alpha compatibility.

## R13: IINA development guide

https://docs.iina.io/pages/dev-guide.html

Plugin context, manifest and permissions; moving docs may cover preview-only features.

## R14: IINA declarations

https://github.com/iina/iina-plugin-definition/blob/master/iina/index.d.ts

Inspected exact used symbols and overloads. Moving branch; inspected blob SHA 5b6e15053c57cc299b9f6d68bab69176bf019dc6, NOT a commit SHA.

## R15: IINA mpv API

https://docs.iina.io/interfaces/IINA.API.MPV.html

Player-only getString/getFlag and separate event API.

## R16: IINA native CLI

https://github.com/iina/iina/blob/v1.4.4/iina-plugin/main.swift

Pack shell command and basename-based .iinaplugin-dev links inspected in released code.

## R17: IINA webviews

https://docs.iina.io/pages/webviews.html

Distinct browser context and named JSON message bridge.

## R18: IINA preferences

https://docs.iina.io/pages/plugin-preferences.html

Native preference bindings; bool data-type; optional defaults.

## R19: Codex instructions

https://developers.openai.com/codex/guides/agents-md/

Official URL redirects to ChatGPT Learn; canonical AGENTS.md discovery.

## R20: Codex skills

https://developers.openai.com/codex/skills/

Repository .agents/skills and agents/openai.yaml allow_implicit_invocation policy.

## R21: Claude memory

https://code.claude.com/docs/en/memory

CLAUDE.md imports @AGENTS.md.

## R22: Claude skills

https://code.claude.com/docs/en/skills

Project .claude/skills, manual-only frontmatter, narrow descriptions and progressive loading.

## R23: Node test runner

https://nodejs.org/api/test.html

Built-in test runner; source/mock evidence distinct from native host tests.
