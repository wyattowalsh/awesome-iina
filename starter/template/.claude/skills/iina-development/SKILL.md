---
name: iina-development
description: >-
  Use when developing, testing, or debugging a typed IINA plugin in a generated
  IINA plugin repo: JavaScriptCore host (main/global), sidebar/overlay/controller
  WKWebView UI, shared protocol, Info.json, and `pnpm run check`. NOT for
  creating a project from a Copier source (git URL or ZIP), `iina-generate` (user-installed only),
  template upgrade, packing a native IINA plugin package, catalog maintainer work,
  or substituting `pnpm pack` for `pnpm run pack`.
license: MIT
---

# IINA plugin development

Develop a typed IINA plugin in a **generated IINA plugin repo**. Audience: IINA
plugin authors. Info.json permissions are user-consent.

## Canonical terms

Copy these strings exactly. Do not invent synonyms.

| Term | In this skill |
| --- | --- |
| Agent Plugins kit | Authors may already have it as a user-installed plugin. Do not embed the Agent Plugins kit in a generated IINA plugin repo. |
| user-installed plugin | Where `iina-generate` (user-installed only) lives. This skill does not generate. |
| generated IINA plugin repo | The tree this skill edits (`Info.json`, `src/`, `AGENTS.md`). |
| Copier source (git URL or ZIP) | How a new tree is created elsewhere. This skill does not generate. |
| catalog maintainer | Not this audience. Refuse that work. |
| native IINA plugin package | `.iinaplugin` / `.iinaplgz` from `pnpm run pack`. Not this skill. |
| Lefthook vs agent hooks | Copier `hooks:` installs optional **Lefthook** git-hook configuration. Cursor/Copilot `hooks.json` files are **agent hooks**. Do not use one name for both. Copier `hooks:` is not an agent hook. |
| `iina-generate` (user-installed only) | Sibling skill on the user-installed plugin. This skill does not generate. |

## Dispatch

| `$ARGUMENTS` | Action |
| --- | --- |
| *(empty)* / `help` / "what does this skill do" | **Gallery** then **stop** (no writes, no checks, this skill does not generate) |
| main / host / menu / `mpv` / player events | **Main** JavaScriptCore |
| global / `globalEntry` / controller without a selected player | **Global** JavaScriptCore |
| sidebar / overlay / standalone / WKWebView / UI HTML/CSS | **UI** webview |
| shared / protocol / `src/shared` | **Shared** (no host, no DOM) |
| preferences HTML / `data-pref-key` | **Preferences** page |
| `Info.json` / permissions / `allowedDomains` | **Manifest** (user-consent; no silent expansion) |
| `pnpm run check` / typecheck / `boundaries` / iterate / debug | **Iterate** |
| `pnpm run link` / unlink / doctor | **Native-dev** (no IINA restart) |
| pack / `pnpm pack` / `pnpm run pack` / `.iinaplugin` / native IINA plugin package | **Stop** → `iina-package` |
| upgrade / `template:update` / `copier update` | **Stop** → `iina-upgrade` |
| new plugin / scaffold / Copier source (git URL or ZIP) / generate | **Stop**. That is `iina-generate` (user-installed only). This skill does not generate. |
| catalog maintainer | **Refuse** |
| `killall` IINA / `osascript` quit / `gh release` / publish | **Refuse** |
| Natural language about host/UI/shared/Info.json in this tree | Auto: matching surface above |

Ambiguous "fix the plugin" in a generated IINA plugin repo → **Iterate** on the nearest
existing surface after First reads. Ambiguous work that is not this tree → Gallery, stop.

## Gallery (empty arguments)

When `$ARGUMENTS` is empty or the user only asks how development works, print this
gallery and **stop**. Do not write files. Do not run checks. This skill does not generate.

1. This skill: typed IINA plugin in a **generated IINA plugin repo** (command, sidebar,
   overlay, or controller presets).
2. First reads (only after the user names a surface): root `AGENTS.md` → nearest
   `src/main`, `src/ui`, `src/global`, `src/shared`, or `src/preferences` →
   `docs/agent/runtime.md` → [references/runtime-brief.md](references/runtime-brief.md).
3. Dispatch surfaces: Main JSC, Global JSC, UI WKWebView, Shared, Preferences, Manifest,
   Iterate, Native-dev.
4. Info.json permissions are user-consent. Overlay baseline is `video-overlay` only.
   Do not add `allowedDomains` or extra permissions to make a check pass.
5. Siblings: `iina-package` (native IINA plugin package), `iina-upgrade` (template
   update), `iina-generate` (user-installed only). This skill does not generate.
6. Lefthook vs agent hooks: Copier `hooks:` is Lefthook; workspace `hooks.json` are
   agent hooks.

## First reads (mutating work only)

Skip on Gallery, refuse, and route-away.

1. Root `AGENTS.md`.
2. Nearest implementation for the dispatched surface.
3. `docs/agent/runtime.md`.
4. [references/runtime-brief.md](references/runtime-brief.md) before any new IINA symbol.

Never invent host callbacks, a general-purpose execution bridge, or APIs absent from
those pinned notes.

Confirm the workspace is a generated IINA plugin repo (`Info.json` + `src/` + `pnpm`
scripts). If it is not, print the Gallery and stop. This skill does not generate.

## Runtimes (do not mix)

| Surface | Process | Player `mpv` / events / core | DOM |
| --- | --- | --- | --- |
| Main | JavaScriptCore | Yes (player-local) | No |
| Global | JavaScriptCore | No | No |
| UI (sidebar / overlay / standalone) | WKWebView | No | Yes, plus a narrow message port |
| Shared | None of the above | No | No |

Main JSC is not Node and not a browser. Global JSC has no current player. UI has no
host APIs. Shared has neither. Do not use `any`, `@ts-ignore`, dynamic evaluation, or
a broad ambient import to cross these boundaries.

`types/` are original narrow interfaces for the used subset, not redistributed official
declarations and not proof every IINA release supports them.

## Info.json (user-consent)

`permissions` and `allowedDomains` in `Info.json` are user-consent. IINA shows them at
install. They are not an implementation shortcut.

| Key | Baseline in this tree |
| --- | --- |
| Overlay `permissions` | `video-overlay` only |
| Other presets | `[]` unless the user explicitly requested a permission migration |
| `allowedDomains` | Omit. No wildcards. |

Extra keys (`network-request`, `file-system`, `show-osd`, `show-alert`) require an
explicit permission migration the user asked for. Agent hooks deny silent expansion.
`afterFileEdit` cannot unwrite the file; if a hook says **revert Info.json permission
expansion**, revert.

## Permission posture

write-scoped. The hook denies Info.json permission expansion. A permission migration
is a human edit outside the agent.

## Iterate

Smallest relevant check, then the complete available suite:

```sh
pnpm run check
node scripts/boundaries.mjs
```

`pnpm run build` and `pnpm run verify:stage` before claiming a packageable result.
`pnpm run dev` watches and rebuilds; it never restarts IINA or promises host hot reload.
`pnpm run preview` is a loopback simulated bridge, not IINA's WKWebView.
`node scripts/doctor.mjs` is read-only metadata, not native proof.

## Native-dev (optional)

`pnpm run link` / `pnpm run unlink` manage a local `.iinaplugin-dev` symlink. Never
`killall` IINA, never `osascript` quit/restart, never `gh release`, never publish.
Native IINA checks are a separate evidence layer from Node.

Packaging a native IINA plugin package is `iina-package` and must be explicit.

## Evidence layers (never collapse)

- A Jinja fixture is not Copier.
- Node VM is not JavaScriptCore.
- Browser WebKit is not IINA's WKWebView.
- Not-run is never passed.

Report source checks, mock contracts, production bundle checks, and native IINA checks
separately.

## Reference file index

| File | Content | Read when |
| --- | --- | --- |
| [references/runtime-brief.md](references/runtime-brief.md) | Pinned IINA 1.4.4 used subset, user-consent permission keys, sources, limits | Before any new IINA symbol; Manifest; Main/Global/UI |

## Critical rules

1. Typed IINA plugin in a **generated IINA plugin repo** only. This skill does not generate.
2. Empty args / help → Gallery, then stop.
3. Info.json permissions are user-consent. No silent `allowedDomains` or extra permissions.
4. Do not mix Main, Global, UI, and Shared runtimes.
5. Confirm new symbols in `docs/agent/runtime.md` and `references/runtime-brief.md`.
6. `pnpm run pack` is not this skill (`iina-package`). Never `pnpm pack`.
7. Template update is `iina-upgrade`. New trees from a Copier source (git URL or ZIP)
   are `iina-generate` (user-installed only).
8. Refuse catalog maintainer work.
9. Do not embed the Agent Plugins kit in this tree.
10. Lefthook vs agent hooks: never one name for both.
11. Not-run is never passed. Do not restart IINA.
