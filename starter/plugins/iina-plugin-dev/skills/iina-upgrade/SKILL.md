---
name: iina-upgrade
description: >-
  Use when applying a reviewed Copier template update in a generated IINA
  plugin repo: run answers_lineage.py first, refuse fixture or missing
  answers (ok=false), then `copier update` or `pnpm run template:update`
  pinned to Copier 9.18.2. NOT for creating a new tree from a Copier source
  (git URL or ZIP), catalog maintainer work, packing a native IINA plugin
  package, host/UI source work, `--overwrite`, or `--trust`/`--UNSAFE` when
  lineage `unsafe` is false.
license: MIT
---

# Copier template update

Apply a **reviewed** Copier template update in a **generated IINA plugin
repo**. Audience: IINA plugin authors. Run `answers_lineage.py` first. Do not
pass `--overwrite`. Do not pass `--trust` / `--UNSAFE` unless lineage
`unsafe=true` (this Copier source should be `false`).

## Permission posture

**side-effecting** (`copier update` / `template:update`). The hook denies
Info.json permission expansion. A permission migration is a human edit outside
the agent.

## Canonical terms

Copy these strings exactly. Do not invent synonyms.

| Term | In this skill |
| --- | --- |
| Agent Plugins kit | Authors may already have it as a user-installed plugin. Do not embed the Agent Plugins kit in a generated IINA plugin repo. |
| user-installed plugin | Where `iina-generate` (user-installed only) lives. This skill does not create a new tree. |
| generated IINA plugin repo | The tree this skill updates (`.copier-answers.yml`, `pnpm run template:update`). |
| Copier source (git URL or ZIP) | Lineage `_src_path` must already name one. This skill does not invent it. |
| catalog maintainer | Not this audience. Refuse that work. |
| native IINA plugin package | `.iinaplugin` / `.iinaplgz` from `pnpm run pack`. Not this skill. |
| Lefthook vs agent hooks | Copier `hooks:` installs optional **Lefthook** git-hook configuration. Cursor/Copilot `hooks.json` files are **agent hooks**. Do not use one name for both. Copier `hooks:` is not an agent hook. |
| `iina-generate` (user-installed only) | Sibling on the user-installed plugin. Route away. This skill does not create a new tree. |

## Dispatch

| `$ARGUMENTS` | Action |
| --- | --- |
| *(empty)* / `help` / "how does upgrade work" | **Gallery** then **stop** (no writes, no Copier) |
| lineage / `answers_lineage.py` / `.copier-answers.yml` | **Lineage** (required first step of every update) |
| `template:check` / `check-update` | **Check** after Lineage `ok=true` |
| upgrade / `template:update` / `copier update` / named tag or SHA | **Update** after Lineage `ok=true` |
| `ok=false` / fixture / `tests/fixtures` / missing answers | **Refuse** |
| `--overwrite` | **Refuse** |
| `--trust` / `--UNSAFE` while lineage `unsafe=false` | **Refuse** |
| `--trust` / `--UNSAFE` while lineage `unsafe=true` | **Stop** until the author explicitly confirms that Copier source |
| recopy / `copier copy` as a substitute for update | **Refuse** |
| pack / `pnpm pack` / `pnpm run pack` / `.iinaplugin` / native IINA plugin package | **Stop** → `iina-package` |
| host / UI / `Info.json` / `src/` without an explicit template update | **Stop** → `iina-development` |
| new plugin / Copier source (git URL or ZIP) / empty destination | **Stop** → `iina-generate` (user-installed only) |
| catalog maintainer | **Refuse** |
| `killall` IINA / `osascript` quit / `gh release` / publish | **Refuse** |
| Natural language that names template update, `copier update`, or `template:update` | Auto: Lineage, then Check/Update |

Ambiguous “update the plugin” without Copier / template / answers signals →
Gallery, then **stop**. Do not run Copier.

## Gallery (empty arguments)

When `$ARGUMENTS` is empty or the user only asks how upgrade works, print this
gallery and **stop**. Do not write files. Do not run Copier.

1. This skill: reviewed Copier template update in a **generated IINA plugin
   repo**.
2. Always run this skill’s `scripts/answers_lineage.py` first. Refuse when
   `ok=false` (missing, unreadable, empty, or fixture `_src_path`).
3. Happy path after `ok=true`: Copier **9.18.2** via `pnpm run template:update`
   or `uvx --from copier==9.18.2 copier update`. Never pass `--overwrite`.
4. Never pass `--trust` / `--UNSAFE` unless lineage `unsafe=true`. This Copier
   source should report `unsafe=false`.
5. Name an immutable tag or SHA. Do not update to an unnamed “latest”.
6. Siblings: `iina-development` (typed plugin work), `iina-package` (native
   IINA plugin package), `iina-generate` (user-installed only).
7. Lefthook vs agent hooks: Copier `hooks:` is Lefthook; workspace `hooks.json`
   are agent hooks.

## Confirm the tree

Skip on Gallery, refuse, and route-away.

Confirm the workspace is a generated IINA plugin repo: `Info.json`, `src/`,
`.copier-answers.yml`, and `pnpm` scripts (`template:update`). If it is not,
print the Gallery and stop. This skill does not create a new tree from a
Copier source (git URL or ZIP).

## Lineage (required first)

Run this skill’s `scripts/answers_lineage.py` **before** `template:check`,
`template:update`, or `copier update`. The script is read-only: it does not
run Copier, write files, or use the network. One positional argv: the
generated IINA plugin repo (usually `.`).

From the repo root, prefer the copy that sits next to this `SKILL.md`:

```sh
uv run --with pyyaml python .cursor/skills/iina-upgrade/scripts/answers_lineage.py .
```

If this skill loaded from `.claude/skills` or `.agents/skills`, use that
skill directory’s `scripts/answers_lineage.py` instead. `uv run --with pyyaml`
supplies PyYAML; the generated IINA plugin repo is a Node tree.

Stdout is JSON `{ok, reason, src_path, vcs_ref, unsafe}`. Schema, examples,
and refuse reasons: [references/upgrade.md](references/upgrade.md).

| Result | Action |
| --- | --- |
| `ok=false` | **Refuse**. Quote `reason`. Do not guess `_src_path`. Do not update. |
| `ok=true`, `unsafe=false` | Continue. Never pass `--trust` / `--UNSAFE`. |
| `ok=true`, `unsafe=true` | **Stop**. This Copier source should be `unsafe=false`. Show the JSON. Do not pass `--trust` / `--UNSAFE` unless the author explicitly confirms they trust tasks/migrations on that Copier source. |

Fixture `_src_path` (`tests/fixtures`, `fixture`, or empty) is not a Copier
source (git URL or ZIP). Refuse those answers.

If the script is missing, `uv` is missing, or the command fails before JSON:
**stop**. Do not parse `.copier-answers.yml` by hand as a substitute.

## Check, then update

Skip this section for Gallery, refuse, and route-away. Read
[references/upgrade.md](references/upgrade.md) for flags, ownership, and
after-diff.

1. Root `AGENTS.md` and `docs/agent/updating.md`.
2. Lineage JSON with `ok=true` (already required).
3. Commit or stash everything. Working tree must be clean.
4. Branch `template-update/<description>` or `renovate/<description>`.
5. `pnpm run template:check`
6. Apply **one** immutable tag or SHA the author named:
   - stable: `pnpm run template:update -- <tag-or-sha>`
   - prerelease (`a` / `b` / `rc` / `alpha` / `beta`, e.g. `0.2.0a2`): do not
     rely on the pnpm wrapper (it omits `--prereleases`). Run:

```sh
uvx --from copier==9.18.2 copier update --defaults --vcs-ref 0.2.0a2 --prereleases
```

Pin Copier **9.18.2** on every `uvx` line (`--from copier==9.18.2`). Include
`--defaults` so answers are reused. Include `--vcs-ref <ref>`. Never pass
`--overwrite`. Never pass `--trust` / `--UNSAFE` when `unsafe=false`.

The wrapper `scripts/template-update.mjs` already pins 9.18.2, passes
`--defaults` and `--vcs-ref`, and does not pass `--overwrite`, `--trust`, or
`--UNSAFE`. It accepts **one** revision. It does not change answers, install
dependencies, auto-resolve conflicts, or publish.

7. Review the complete diff and conflicts. Then follow After the diff in
   [references/upgrade.md](references/upgrade.md).

Do not recopy. Do not create a new destination. Do not pack unless asked
(`iina-package`). Do not restart IINA. JavaScriptCore APIs are not changed by
upgrade alone.

## Reference file index

| File | Content | Read when |
| --- | --- | --- |
| [references/upgrade.md](references/upgrade.md) | Lineage JSON schema, refuse reasons, Copier 9.18.2 argv, seed vs managed ownership, after-diff | Before Check/Update; on any `ok=false` or `unsafe=true` |

## Critical rules

1. Generated IINA plugin repo only. This skill does not create a new tree.
2. Empty args / help → Gallery, then stop.
3. Run `answers_lineage.py` first. Refuse `ok=false` (including fixtures).
4. Copier **9.18.2**. `copier update` / `template:update` with an explicit
   `--vcs-ref`. Never unnamed “latest”.
5. Never pass `--overwrite`.
6. Never pass `--trust` / `--UNSAFE` unless lineage `unsafe=true` (this
   Copier source should be `false`).
7. `pnpm run pack` is not this skill (`iina-package`). Never `pnpm pack`.
8. Host/UI/`Info.json` source work is `iina-development`.
9. A new tree from a Copier source (git URL or ZIP) is `iina-generate`
   (user-installed only).
10. Refuse catalog maintainer work.
11. Do not embed the Agent Plugins kit in this tree.
12. Lefthook vs agent hooks: never one name for both.
13. Not-run is never passed. Do not restart IINA.
