# iina-plugin-dev

This directory is the **Agent Plugins kit**. After you install it locally, it is a
**user-installed plugin** for IINA plugin authors. Community tooling, not an official
IINA project. There is **no** `mcp.json`.

It is not tooling for a **catalog maintainer**. Do not embed this directory in a
**generated IINA plugin repo**.

## Workflow

1. Install this **user-installed plugin** in your own harness.
2. Generate a **generated IINA plugin repo** from a **Copier source (git URL or ZIP)**
   you name. That path is **`iina-generate` (user-installed only)**.
3. Develop, package, and upgrade in the **generated IINA plugin repo**.

```text
install user-installed plugin
        ↓
generate from Copier source (git URL or ZIP) you name
        ↓
develop in the generated IINA plugin repo
```

## Install

This directory is the plugin root (`plugin.json` at the top). Skills live at
`skills/<name>/SKILL.md`.

Copy or symlink it into your harness as `iina-plugin-dev`. Cursor’s local plugin
directory:

```sh
mkdir -p ~/.cursor/plugins/local
ln -sfn /path/to/iina-plugin-dev ~/.cursor/plugins/local/iina-plugin-dev
```

If you already have this tree inside a starter checkout, the opt-in
`just starter-agent-plugin-install` recipe performs that same symlink. It never
joins `just check`.

A **generated IINA plugin repo** does not install this package. Copier emits
workspace `.cursor/skills` (plus `.claude/skills` and `.agents/skills`) for
development, package, and upgrade only. Those trees must not contain
`iina-generate`, must not nest the Agent Plugins kit, and must not receive
catalog-root `.cursor/` or catalog-root `plugin.json`.

## Generate from a Copier source (git URL or ZIP)

**`iina-generate` (user-installed only)** lives on this user-installed plugin. You
name:

1. The **Copier source (git URL or ZIP)** — `gh:owner/repo`,
   `https://github.com/owner/repo.git`, or a local unzipped path.
2. An immutable `--vcs-ref` (tag or SHA).
3. An empty destination directory.

The skill runs `copy_argv.py describe` / `plan`, then the returned
`uvx --from copier==9.18.2 copier copy …` argv. It does not invent the source,
does not run `git init`, and does not execute Copier itself. Copier stays a
user-visible `uvx` command.

ZIP path: unzip, `git init`, and tag the Copier source yourself before generate
(per the starter README). `describe` fails closed if that tree has no `.git`.

Do not pass `--trust`, `--UNSAFE`, or `--overwrite`. Do not treat
`just starter-generate` or `repo_wrapper.py` as the author happy path.

## Develop in the generated IINA plugin repo

After copy, work in the **generated IINA plugin repo**:

| Skill | When |
| --- | --- |
| `iina-development` | Typed host / sidebar / overlay / controller work |
| `iina-package` | A **native IINA plugin package** (`.iinaplugin` / `.iinaplgz`) via `pnpm run pack` |
| `iina-upgrade` | Template update from real Copier lineage in that repo |

Info.json permissions are user-consent. Agent files must never appear in a
**native IINA plugin package**.

## Dual-manifest

| File | Format | What it loads |
| --- | --- | --- |
| `plugin.json` | Agent Plugins closed schema | Portable metadata; skills via `skills/` |
| `.cursor-plugin/plugin.json` | Cursor Plugin | Explicit `skills`, `rules`, `agents`, `hooks` |

After a local Cursor install, Customize must show **rules + skills + hooks**. If only
skills appear, Cursor loaded Agent Plugins and ignored `.cursor-plugin`. That is a
human check, not a CI claim.

Client extras stay in namespaces: `.claude-plugin/`, `com.github.copilot/`. Do not put
Copilot fields on the portable root `plugin.json`.

## Lefthook vs agent hooks

Copier’s `hooks:` question installs optional **Lefthook** git-hook configuration.
Cursor/Copilot `hooks.json` files are **agent hooks**. Do not use one name for both.
Copier `hooks:` is not an agent hook.

## Guards

`scripts/agent-guard.mjs` reads hook JSON on stdin and writes JSON on stdout. Exit `2`
denies. Fail-closed for `--trust`, bare `pnpm pack`, IINA restart, `gh release`, and
`Info.json` permission expansion. Fail-open for unknown commands. `pnpm run pack` is
allowed.
