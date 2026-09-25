---
name: iina-package
description: >-
  Use when the user asked to pack a generated IINA plugin repo into a native
  IINA plugin package (`.iinaplugin` / `.iinaplgz`) with `pnpm run pack` after
  check, build, and `verify:stage`. NOT for host/UI/Info.json source work,
  Copier template updates, `pnpm pack` / `npm pack`, publishing, `gh release`,
  catalog maintainer work, `iina-generate`, or restarting IINA.
license: MIT
disable-model-invocation: true
---

# Native IINA plugin package

Work in a **generated IINA plugin repo**. JavaScriptCore host code is already
built; this skill archives the staged plugin. A **native IINA plugin package**
is the `.iinaplugin` / `.iinaplgz` archive from `pnpm run pack`. It is not the
**Agent Plugins kit**.

Portable frontmatter has **no** Claude `disable-model-invocation` and **no** Codex
`allow_implicit_invocation`. Hosts that need those apply overlays at sync time.

## Permission posture

**side-effecting** (`pnpm run pack` writes artifacts). Body only; do not add
skill-scoped `hooks:` frontmatter. The hook denies Info.json permission
expansion always. A permission migration is a human edit outside the agent.

## Canonical terms

Copy these strings exactly. Do not invent synonyms.

| Term | In this skill |
| --- | --- |
| native IINA plugin package | The `.iinaplugin` / `.iinaplgz` archive from `pnpm run pack`. Agent files must never appear in that archive. This is not the Agent Plugins kit. |
| Agent Plugins kit | Authors may already have it as a user-installed plugin. Do not embed the Agent Plugins kit in a generated IINA plugin repo or stage it into a native IINA plugin package. |
| generated IINA plugin repo | The tree this skill packs (`Info.json`, `src/`, `pnpm run pack`). |
| Lefthook vs agent hooks | Copier `hooks:` installs optional **Lefthook** git-hook configuration. Cursor/Copilot `hooks.json` files are **agent hooks**. Do not use one name for both. Copier `hooks:` is not an agent hook. Neither belongs in the native IINA plugin package. |
| catalog maintainer | Not this audience. Refuse that work. |
| `iina-generate` (user-installed only) | Sibling on the user-installed plugin. Route away. This skill does not create a new tree. |

## Empty args / help

When `$ARGUMENTS` is empty, or the user only asks how packing works (`help`),
print this gallery and **stop**. Do not run pack. Do not write files.

1. Dispatch table (this skill vs `iina-development` vs `iina-upgrade`)
2. `pnpm run pack` vs `pnpm pack`: `pnpm run pack` is the IINA packer; `pnpm pack` / `npm pack` are npm tarballs
3. Sequence: `pnpm run check` → `pnpm run build` → `pnpm run verify:stage` → `pnpm run pack`
4. Stage **allowlist** is exact; no agent files in `.iinaplugin` (native IINA plugin package)
5. Record artifact path and SHA-256; not-run native checks are never passed
6. Do not publish, `gh release`, or restart IINA

## Dispatch

| `$ARGUMENTS` / intent | Action |
| --- | --- |
| *(empty)* / `help` / how packing works | Empty-args gallery, then **stop** |
| pack / `.iinaplugin` / `.iinaplgz` / native IINA plugin package | This skill |
| `pnpm pack` / `npm pack` | **Refuse**. Use `pnpm run pack`. |
| Host, UI, global, shared TypeScript, or `Info.json` without an explicit pack request | Stop → `iina-development` |
| `template:update` / Copier update | Stop → `iina-upgrade` |
| new plugin / scaffold / Copier source (git URL or ZIP) / generate | **Stop** → `iina-generate` (user-installed only). This skill does not generate. |
| catalog maintainer | **Refuse** |
| `pnpm run link` / `unlink` / `.iinaplugin-dev` | **Refuse** here. Link is not pack. |
| publish / `gh release` / GitHub upload | **Refuse** |
| restart / quit / `killall` IINA / `osascript` restart | **Refuse** |
| Expand `Info.json` permissions or `allowedDomains` so pack succeeds | **Refuse** |
| Copier `--trust` | **Refuse** |

Natural language that names pack, `.iinaplugin`, `.iinaplgz`, or a native IINA
plugin package → this skill. Ambiguous “ship it” without those signals → gallery
and stop. Do not pack as a side effect of development or upgrade work.

## Pack sequence

Skip this section for empty args / help.

1. Read the repo `AGENTS.md` and `docs/agent/native.md`. For release notes see
   `docs/content/packaging.md`.
2. `pnpm run check`
3. `pnpm run build`
4. `pnpm run verify:stage`
5. `pnpm run pack` — the `package.json` script `pack` (`node scripts/iina-cli.mjs pack`).
   **Never** `pnpm pack`. Agent hooks allow `pnpm run pack` and deny bare
   `pnpm pack` / `npm pack` (`deny-bare-pnpm-pack`). Do not add a wrapper that
   hides `pack` vs `run pack`.

Official IINA CLI packing requires macOS. Set `IINA_CLI` when IINA is not at
`/Applications/IINA.app/Contents/MacOS/iina-plugin`. The packer never restarts
IINA.

Copy lands under `artifacts/`. Record the artifact path, SHA-256, and any native
checks that were **not** run. Not-run is never passed. `node scripts/doctor.mjs`
is read-only metadata, not native execution proof. Python 3 is used only for
stdlib ZIP inspection of the archive against the stage.

## `pnpm run pack` vs `pnpm pack`

| Command | Result |
| --- | --- |
| `pnpm run pack` | native IINA plugin package (`.iinaplugin` / `.iinaplgz`) |
| `pnpm pack` / `npm pack` | npm package tarball — wrong artifact |

## Allowlist

`scripts/validate.mjs` `expectedFiles()` is the exact stage allowlist.
`pnpm run verify:stage` and `pnpm run pack` both require `.build/<slug>/` to
match it **exactly**. Extra files fail. Missing files fail.

| Preset | Staged files |
| --- | --- |
| Always | `Info.json`, `LICENSE`, `dist/main.js` |
| controller also | `dist/global.js` |
| non-command also | `ui/index.html`, `ui/index.js`, `ui/style.css` |
| preferences also | `preferences/index.html` |

The native IINA plugin package must contain only those files. **No agent files
in `.iinaplugin`** (or `.iinaplgz`, or `.build/<slug>/`):

- `AGENTS.md`
- `.cursor/**`
- skills trees
- `plugin.json` (Agent Plugins kit manifest; this is not `Info.json`)
- `scripts/agent-guard.mjs`, `scripts/rules.mjs`
- the Agent Plugins kit directory

**Lefthook vs agent hooks:** Copier `hooks:` installs optional Lefthook git-hook
configuration. Cursor/Copilot `hooks.json` files are agent hooks. Neither belongs
in the native IINA plugin package.

Also rejected: executable bits, staging-root symlinks, archive path escape,
external UI `src`/`href`, `allowedDomains`, permission expansion, docs, tests,
and Node tooling.

## Never

- Publish the artifact or `gh release`
- Restart, quit, or `killall` IINA
- Pass Copier `--trust`
- Expand `Info.json` permissions or add `allowedDomains` to make pack succeed
- Stage agent files into `.build/<slug>/` or a native IINA plugin package

## Critical Rules

1. `pnpm run pack` only. Never `pnpm pack` / `npm pack`.
2. No agent files in `.iinaplugin` / `.iinaplgz` / `.build/<slug>/`.
3. Never publish or `gh release`.
4. Never restart, quit, or `killall` IINA.
5. Never expand `Info.json` permissions or add `allowedDomains` so pack succeeds.
   The hook denies Info.json permission expansion always. A permission migration
   is a human edit outside the agent.
6. Never pass Copier `--trust`.
7. Empty args / help → gallery, then stop.
8. Refuse catalog maintainer work. `iina-generate` is user-installed only;
   this skill does not generate.
9. Lefthook vs agent hooks: never one name for both.
10. Not-run is never passed.
