---
name: iina-generate
description: >-
  Use when creating a new IINA plugin tree from a Copier source (git URL or
  ZIP) the author names: run copy_argv.py describe, then
  uvx --from copier==9.18.2 copier copy with the returned argv (--vcs-ref
  required; --prereleases when argv says so) into an empty destination.
  NOT for catalog maintainer work, generated IINA plugin repo
  development/package/upgrade, embedding the Agent Plugins kit, inventing
  Copier argv, or wrapping Copier in Python.
license: MIT
---

# Generate an IINA plugin

Create a **generated IINA plugin repo** from a **Copier source (git URL or ZIP)**
the author names. Audience: IINA plugin authors using this **user-installed
plugin**. Not catalog maintainers.

This skill lives only on the **user-installed plugin**. A generated IINA plugin
repo must not include it.

## Permission posture

`side-effecting`. The happy path tells the author to run
`uvx --from copier==9.18.2 copier copy` with the argv from `copy_argv.py`; that
copy writes the destination. `copy_argv.py` stays read-only (`describe` / `plan`
only; no Copier exec, mkdir, git, or network). Do not add skill-scoped `hooks:`
frontmatter.

## Canonical terms

Copy these strings exactly. Do not invent synonyms.

| Term | Meaning |
| --- | --- |
| Agent Plugins kit | This directory (`starter/plugins/iina-plugin-dev/`): closed Agent Plugins v1.0.0 `plugin.json`, skills, rules, agents, and agent hooks. No `mcp.json`. Downstream IINA plugin authors install it into their own harness. It is not catalog-maintainer tooling in the awesome-iina checkout. Do not embed this directory in a generated IINA plugin repo. |
| user-installed plugin | The Agent Plugins kit after the author installs it locally (host install or the opt-in `just starter-agent-plugin-install` symlink into `~/.cursor/plugins/local/`). `just starter-agent-plugin-install` never joins `just check`. |
| generated IINA plugin repo | A consumer plugin tree Copier emits from a Copier source. Workspace skills are development, package, and upgrade only. It must not contain `iina-generate`, must not nest the Agent Plugins kit, and must not receive catalog-root `.cursor/` or catalog-root `plugin.json`. |
| Copier source (git URL or ZIP) | The template the **author names**: a git URL (`gh:owner/repo` or `https://github.com/owner/repo.git`) plus `--vcs-ref`, or a release ZIP the author already unzipped and `git init` + tagged per the starter README. Generate never invents the source, never runs `git init`, and never executes Copier itself. |
| catalog maintainer | Someone working in the awesome-iina checkout. Catalog-root `skills/` exposes `awesome-iina-maintainer` and symlinks to these plugin-dev skills. Do not add a separate `iina-plugin-starter` router. |
| native IINA plugin package | The `.iinaplugin` / `.iinaplgz` archive from `pnpm run pack` in a generated IINA plugin repo. Agent files must never appear in that archive. This is not the Agent Plugins kit. |
| Lefthook vs agent hooks | Copier `hooks:` installs optional **Lefthook** git-hook configuration. Cursor/Copilot `hooks.json` files are **agent hooks**. Do not use one name for both. Copier `hooks:` is not an agent hook. |
| `iina-generate` (user-installed only) | The generate skill lives only on the user-installed plugin (and nested `starter/.cursor/skills` while authoring the starter). Generated IINA plugin repos must not include it. Happy path is `copy_argv.py` then `uvx copier copy`. |

## Dispatch

| `$ARGUMENTS` | Action |
| --- | --- |
| *(empty)* / `help` / "how does generate work" | **Gallery** then **stop** (no Copier, no argv invention) |
| git URL / `gh:owner/repo` / GitHub HTTPS + tag or SHA + empty destination | **Describe**, then **Copy** |
| ZIP / unzipped local Copier source + tag or SHA + empty destination | **Describe**, then **Copy** |
| `copy_argv.py` / `describe` / `plan` | **Describe** (script only; it never runs Copier) |
| `--pretend` / dry-run | **Describe** with `pretend: true`, then show argv and **stop** |
| missing Copier source, `--vcs-ref`, or destination | Gallery, then **stop**. Ask the author to name all three. |
| `ok=false` / no `.git` on a ZIP/path source | **Refuse**. Quote `error`. Do not run `git init`. |
| invent Copier argv / skip `copy_argv.py` | **Refuse** |
| extra Copier flags beyond returned argv | **Refuse** |
| `--trust` | **Refuse** |
| host / UI / `Info.json` / `src/` in an existing generated IINA plugin repo | **Stop** → `iina-development` |
| pack / `pnpm pack` / `pnpm run pack` / `.iinaplugin` / native IINA plugin package | **Stop** → `iina-package` |
| upgrade / `template:update` / `copier update` | **Stop** → `iina-upgrade` |
| embed the Agent Plugins kit in the new repo | **Refuse** |
| catalog maintainer | **Refuse** |
| `killall` IINA / `osascript` quit / `gh release` / publish | **Refuse** |
| Natural language that names a new plugin from a Copier source (git URL or ZIP) | Auto: require named source + ref + empty destination, then Describe → Copy |

Ambiguous “make a plugin” with no Copier source (git URL or ZIP) → Gallery, then
**stop**. Do not invent a source.

## Gallery (empty arguments)

When `$ARGUMENTS` is empty or the user only asks how generate works, print this
gallery and **stop**. Do not run Copier. Do not invent argv.

1. This skill: new **generated IINA plugin repo** from a **Copier source (git URL
   or ZIP)** the **author names**.
2. Required inputs: Copier source (git URL or ZIP), immutable `--vcs-ref`
   (tag or SHA), empty destination directory.
3. Run this skill’s `scripts/copy_argv.py describe`, then
   `uvx --from copier==9.18.2 copier copy` with the **returned argv** as-is.
4. `--vcs-ref` is required. Include `--prereleases` only when argv says so.
5. After copy, development / package / upgrade live in the **generated IINA
   plugin repo**. Do not embed the Agent Plugins kit in that repo.
6. ZIP path: the author already unzipped and `git init` + tagged the Copier
   source. This skill does not run `git init`. `describe` fails closed without
   `.git`.
7. Siblings in the generated IINA plugin repo: `iina-development`,
   `iina-package`, `iina-upgrade`. This skill stays on the user-installed plugin.
8. Lefthook vs agent hooks: Copier `hooks:` is Lefthook; `hooks.json` files are
   agent hooks.

## Confirm inputs (mutating generate only)

Skip on Gallery, refuse, and route-away.

The author must name all of:

1. Copier source (git URL or ZIP) — `gh:owner/repo`,
   `https://github.com/owner/repo.git`, or a local unzipped path.
2. `vcs_ref` — an immutable tag or SHA. Not an unnamed “latest”.
3. `destination` — a **new empty directory** (absent or empty). Not an existing
   plugin tree. Not inside the Copier source.

If any are missing, print the Gallery and stop.

## `copy_argv.py` then Copier

`scripts/copy_argv.py` sits next to this `SKILL.md`. Subcommands: `describe`,
`plan`. No `copy`, `run`, or `execute`. Stdout is JSON. Side effects: none (no
Copier, no mkdir, no git, no network).

Schemas, argv rules, and worked JSON: [references/generate.md](references/generate.md).

From this skill directory:

```sh
uv run python scripts/copy_argv.py describe '{"source":"git","url":"gh:<owner>/<repo>","vcs_ref":"<tag-or-sha>","destination":"<destination>"}'
```

ZIP / local path (author already `git init` + tagged):

```sh
uv run python scripts/copy_argv.py describe '{"source":"zip","path":"<unzipped-copier-source>","vcs_ref":"<tag-or-sha>","destination":"<destination>"}'
```

`plan` is `describe` plus a `human` shell line. Still no exec. Prefer `plan`
when you need a pasteable command.

| Result | Action |
| --- | --- |
| `ok=false` | **Stop**. Quote `error`. Do not invent argv. Do not run Copier. Do not run `git init`. |
| `ok=true` | Show `argv` (or `human`). Run **exactly** that argv. Do not add flags. |

`--vcs-ref` is always in a successful argv. `--prereleases` is present only when
`vcs_ref` is a PEP 440 prerelease (`a` / `b` / `rc` / `alpha` / `beta`;
`0.2.0a2` → include). Do not add `--prereleases` yourself if argv omitted it.
Do not drop it if argv included it.

Happy-path git example (prerelease argv; do not add extra flags):

```sh
uvx --from copier==9.18.2 copier copy --vcs-ref "<tag-or-sha>" --prereleases "gh:<owner>/<repo>" "<destination>"
```

Pin Copier **9.18.2** (`--from copier==9.18.2`). Copier stays this user-visible
`uvx` command. Authors usually omit `data_file` and answer the questionnaire
(preset: `command` / `sidebar` / `overlay` / `controller`; Copier `hooks:` is
Lefthook). JavaScriptCore code is generated by Copier, not invented here.

If the script is missing, `uv` is missing, or the command fails before JSON:
**stop**. Do not hand-build Copier argv.

## After copy

Work continues in the **generated IINA plugin repo**, not in this skill:

| Need | Skill |
| --- | --- |
| Typed host / UI / `Info.json` / bootstrap / `pnpm run check` | `iina-development` |
| native IINA plugin package | `iina-package` |
| later template update | `iina-upgrade` |

Do **not** embed the Agent Plugins kit in the new repo. Do not copy this skill
or `plugins/iina-plugin-dev/` into the destination. Workspace skills there are
development, package, and upgrade only.

Do not pack as a side effect of generate. Do not restart IINA.

## Reference file index

| File | Content | Read when |
| --- | --- | --- |
| [references/generate.md](references/generate.md) | `copy_argv.py` JSON schemas, argv rules, git/ZIP examples | Before Describe/Copy; on any `ok=false` |

## Critical rules

1. User-installed plugin only. This skill does not live in a generated IINA
   plugin repo.
2. Empty args / help → Gallery, then stop.
3. The author names the Copier source (git URL or ZIP), `--vcs-ref`, and an
   empty destination. Never invent them.
4. Run `copy_argv.py describe` (or `plan`) first. Then run the returned argv
   with `uvx --from copier==9.18.2 copier copy`. No extra flags.
5. `--vcs-ref` is required. `--prereleases` only when argv says so.
6. ZIP/path without `.git` → refuse. This skill does not run `git init`.
7. After copy, development / package / upgrade live in the generated IINA
   plugin repo.
8. Do not embed the Agent Plugins kit in the new repo.
9. Refuse catalog maintainer work.
10. Lefthook vs agent hooks: never one name for both.
11. `pnpm run pack` is not this skill (`iina-package`). Never `pnpm pack`.
12. Refuse `--trust`. Use only the argv `copy_argv.py` returned.
13. Not-run is never passed. Do not restart IINA.
