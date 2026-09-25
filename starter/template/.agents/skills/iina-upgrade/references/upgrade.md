# Copier template update (reference)

Read from `iina-upgrade` after `answers_lineage.py` and before `copier update`
or `pnpm run template:update`. Audience: IINA plugin authors in a **generated
IINA plugin repo**.

## `answers_lineage.py`

Path (plugin-root relative): `skills/iina-upgrade/scripts/answers_lineage.py`.
In a generated IINA plugin repo the same file is next to this skill
(`.cursor/skills/iina-upgrade/scripts/answers_lineage.py`, or the matching
`.claude` / `.agents` skill directory).

Argv: one positional path to the generated IINA plugin repo. Stdout: JSON.
Side effects: none (no Copier, no writes, no network). Do not run
`copier update` from this script.

```sh
uv run --with pyyaml python .cursor/skills/iina-upgrade/scripts/answers_lineage.py .
```

### Output schema

```json
{
  "$id": "iina-plugin-dev/answers_lineage.output",
  "type": "object",
  "additionalProperties": false,
  "required": ["ok", "reason", "src_path", "vcs_ref", "unsafe"],
  "properties": {
    "ok": {"type": "boolean"},
    "reason": {"type": ["string", "null"]},
    "src_path": {"type": ["string", "null"]},
    "vcs_ref": {"type": ["string", "null"]},
    "unsafe": {"type": "boolean"}
  }
}
```

Rules:

- `ok=false` if `.copier-answers.yml` is missing, unreadable, or `_src_path`
  contains `tests/fixtures`, `fixture`, or is empty.
- `unsafe=true` if answers imply tasks/migrations requiring `--UNSAFE` (this
  Copier source should be `false`; still detect `_tasks` surprise).
- Happy path returns `src_path` + `vcs_ref` from answers (`_src_path`,
  `_commit` / equivalent Copier lineage keys). No Copier subprocess.

Happy-path example:

```json
{
  "ok": true,
  "reason": null,
  "src_path": "gh:owner/repo",
  "vcs_ref": "0.2.0a2",
  "unsafe": false
}
```

Fixture refusal example:

```json
{
  "ok": false,
  "reason": "fixture _src_path is not a Copier source (git URL or ZIP)",
  "src_path": null,
  "vcs_ref": null,
  "unsafe": false
}
```

Other `ok=false` reasons the script emits: `missing .copier-answers.yml`,
`unreadable .copier-answers.yml`, `empty _src_path`, `expected one generated
IINA plugin repo path` (wrong argv; exit `2`).

`ok=false` → refuse the update. Do not invent a Copier source (git URL or ZIP).
Do not treat a fixture path as lineage.

`unsafe=true` → this Copier source should still be `false`. Stop and show the
JSON. Pass `--trust` / `--UNSAFE` only if the author explicitly confirms they
trust tasks, migrations, or Jinja extensions on **that** Copier source.

Keep `.copier-answers.yml` in Git. Do not hand-edit it to change answers,
preset, preferences, identity, or `hooks`. Those are application migrations,
not routine updates.

## Copier 9.18.2 argv

Pin: **9.18.2**. Custom delimiters `[[ ]]` / `[% %]` stay. This Copier source
has `_subdirectory: template` only: no template tasks/migrations, so
`--trust` / `--UNSAFE` are not required when lineage `unsafe=false`.

Do **not** pass `--overwrite`. Copier’s `--overwrite` flag **enables**
overwrite.

Do **not** pass `--trust` or `--UNSAFE` unless lineage `unsafe=true` and the
author confirmed that Copier source.

### `pnpm run template:check`

```sh
pnpm run template:check
```

That script is `uvx --from copier==9.18.2 copier check-update --output-format json`.
Read-only. Not an apply step.

### `pnpm run template:update` (stable refs)

```sh
pnpm run template:update -- <immutable-tag-or-sha>
```

`scripts/template-update.mjs` runs:

```text
uvx --from copier==9.18.2 copier update --defaults --vcs-ref=<ref>
```

It requires a clean tree and a `template-update/<name>` or `renovate/<name>`
branch. It accepts **one** revision. It does not add `--overwrite`,
`--trust`, `--UNSAFE`, `--prereleases`, answer flags, dependency install,
conflict resolution, or publish.

### Direct `copier update` (prerelease refs)

The pnpm wrapper omits `--prereleases`. When the **target** ref is a
prerelease (`a`, `b`, `rc`, `alpha`, `beta` as PEP 440 fragments;
`0.2.0a2` → include), run Copier yourself:

```sh
uvx --from copier==9.18.2 copier update --defaults --vcs-ref 0.2.0a2 --prereleases
```

Stable tags: prefer `pnpm run template:update -- <tag-or-sha>`.

Always:

- `--from copier==9.18.2`
- `--defaults` (reuse answers; do not re-ask to change them)
- `--vcs-ref <immutable-tag-or-sha>` the author named
- `--prereleases` iff that target is a prerelease
- no `--overwrite`
- no `--trust` / `--UNSAFE` unless lineage `unsafe=true` and confirmed

Never:

- `copier update` with no `--vcs-ref` (unnamed latest)
- `copier copy` / recopy as a substitute for update
- `--overwrite`
- `--trust` / `--UNSAFE` when `unsafe=false`

Lineage `src_path` / `vcs_ref` are the **current** Copier source (git URL or
ZIP) and the answers’ recorded commit. The update target is the new ref the
author named, not a guessed HEAD.

## Ownership (this Copier source)

Copier `_exclude` drops these paths on **update** (including deliberate
deletions of seeds):

| Kind | Paths | Update |
| --- | --- | --- |
| Seed | `src/**`, `tests/unit/**`, `Info.json`, `.iina-project.json`, `README.md`, `LICENSE` | Excluded |
| Consumer docs | `docs/content/**`, `docs.config.json`, `native-evidence.json` | Excluded |
| Managed | `scripts/**`, contract tests, runtime references, `.cursor/**`, `.claude/skills/**`, `.agents/skills/**`, `scripts/agent-guard.mjs` | Template updates apply; review diffs. Consumer edits merge; do not force |
| Shared | package/tool configuration and workflows | Normal Copier merge; conflicts reviewed |
| Generated contract | `AGENTS.md` | Stays generated from the template; do not exclude on update |

`.cursor/**` is managed, not Copier `_exclude`. Customizations in those trees
merge on update and must be reviewed.

Preset / preferences / identity / `hooks` changes are **application
migrations**, not answer edits. Lefthook vs agent hooks: Copier `hooks:` is
optional Lefthook; `hooks.json` files are agent hooks.

`Info.json` permissions are user-consent. The hook always denies
`Info.json` permission expansion. A permission migration is a human edit
outside the agent. Upgrade must not expand `permissions` or add
`allowedDomains` itself (including to make a check pass). Seed exclusion
means template Info.json changes do not overwrite the consumer file.

Do not embed the Agent Plugins kit in this tree. Workspace skills here are
development, package, and upgrade only (`iina-generate` (user-installed only)
is absent).

## After the diff

1. Resolve every conflict. Do not discard consumer seed deletions.
2. Reconcile the lockfile with an explicit `pnpm install`. Inspect new
   script decisions. The template ships no fabricated lockfile.
3. `pnpm run check`
4. Record template revision vs plugin version vs dependency graph vs host
   target vs end-user state schema. Changing one never silently changes the
   others.
5. Do not pack unless asked (`iina-package`). Never `pnpm pack`.
6. Do not restart, quit, or `killall` IINA. Do not `gh release` or publish.
7. JavaScriptCore APIs are not changed by upgrade alone. New host symbols
   still need `iina-development` plus `docs/agent/runtime.md`.

Evidence layers stay separate: a fixture is not a Copier source (git URL or
ZIP); Node VM is not JavaScriptCore; not-run is never passed.
