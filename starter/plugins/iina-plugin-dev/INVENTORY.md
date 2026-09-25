# iina-plugin-dev inventory

Frozen SSOT for the portable **Agent Plugins kit**: vocabulary later skills copy
verbatim, expected plugin paths, agent-hook policy, Copier helper-script contracts,
and native-packaging allowlist. Tests treat the **Expected plugin paths** list as
the authoritative tree (plus files that `sync_agent_kit.py` projects out of this
directory). This file has no per-file checksums.

**Ownership:** Wave 0 only. Later waves must not edit this file unless a gate
proves a path mismatch, and then only a designated W0-fix agent.

This kit has **no** `mcp.json`. Catalog-root `.cursor/` and catalog-root
`plugin.json` are forbidden (ADR 0002). Nested `starter/.cursor/skills/` is
allowed. Copier `hooks:` means Lefthook configuration, not agent hooks.

## Vocabulary

Copy these terms **verbatim**. Do not invent synonyms in skills, agents, or
plugin README copy.

| Term | Meaning |
| --- | --- |
| Agent Plugins kit | This directory (`starter/plugins/iina-plugin-dev/`): closed Agent Plugins v1.0.0 `plugin.json`, skills, rules, agents, and agent hooks. No `mcp.json`. Downstream IINA plugin authors install it into their own harness. It is not catalog-maintainer tooling in the awesome-iina checkout. Do not embed this directory in a generated IINA plugin repo. |
| user-installed plugin | The Agent Plugins kit after the author installs it locally (host install or the opt-in `just starter-agent-plugin-install` symlink into `~/.cursor/plugins/local/`). `just starter-agent-plugin-install` never joins `just check`. |
| generated IINA plugin repo | A consumer plugin tree Copier emits from a Copier source. Workspace skills are development, package, and upgrade only. It must not contain `iina-generate`, must not nest the Agent Plugins kit, and must not receive catalog-root `.cursor/` or catalog-root `plugin.json`. |
| Copier source (git URL or ZIP) | The template the **author names**: a git URL (`gh:owner/repo` or `https://github.com/owner/repo.git`) plus `--vcs-ref`, or a release ZIP the author already unzipped and `git init` + tagged per the starter README. Generate never invents the source, never runs `git init`, and never executes Copier itself. |
| catalog maintainer | Someone working in the awesome-iina checkout. Catalog-root `skills/` exposes `awesome-iina-maintainer` and symlinks to these plugin-dev skills. Do not add a separate `iina-plugin-starter` router. |
| native IINA plugin package | The `.iinaplugin` / `.iinaplgz` archive from `pnpm run pack` in a generated IINA plugin repo. Agent files must never appear in that archive. This is not the Agent Plugins kit. |
| Lefthook vs agent hooks | Copier `hooks:` installs optional **Lefthook** git-hook configuration. Cursor/Copilot `hooks.json` files are **agent hooks**. Do not use one name for both. Copier `hooks:` is not an agent hook. |
| `iina-generate` (user-installed only) | The generate skill lives only on the user-installed plugin (and nested `starter/.cursor/skills` while authoring the starter). Generated IINA plugin repos must not include it. Happy path is `copy_argv.py` then `uvx copier copy`, not `just starter-generate` and not `repo_wrapper.py`. |

## Dual-manifest load strategy

This directory contains both:

1. Root `plugin.json` — Agent Plugins v1.0.0 closed schema (skills + optional MCP; we ship no MCP).
2. `.cursor-plugin/plugin.json` — Cursor Plugin manifest that **explicitly** lists
   `skills`, `rules`, `agents`, and `hooks`.

Human post-install check (not CI): Cursor Customize must show rules + skills + hooks.
If only skills appear, Cursor loaded the Agent Plugins manifest and ignored `.cursor-plugin`.
Do not invent a third package until that split is proven necessary. Never symlink out of
the plugin root (Agent Plugins §4.1).

## Forbidden

- `mcp.json`
- `.jinja` suffix on any agent-kit file
- `[%` or `[[` in any directory name
- Catalog-root `.cursor/` or catalog-root `plugin.json`
- `iina-generate` inside `starter/template/` (generated Copier trees)
- Agent files inside native `.iinaplugin` / `.build/<slug>/` stages
- Copilot fields on the portable root `plugin.json`
- `just starter-agent-plugin-install` as part of `just check`
- Embedding the Agent Plugins kit in a generated IINA plugin repo
- `beforeFileEdit` as a Cursor agent hook (Cursor does not document it; delete it from Copilot YAML)

## Expected plugin paths

Relative to this plugin root. `test_inventory_matches_plugin_tree` compares this
fence to `rglob` files. Auditor `evals/evals.json` files are listed here and are
not projected into generated trees.

```
INVENTORY.md
LICENSE
README.md
plugin.json
.claude-plugin/plugin.json
.cursor-plugin/plugin.json
.github/hooks/copilot-setup-steps.yml
agents/iina-plugin-developer.md
agents/iina-plugin-packager.md
com.github.copilot/hooks.json
com.github.copilot/rules/iina-evidence.mdc
com.github.copilot/rules/iina-pack-name.mdc
com.github.copilot/rules/iina-permissions.mdc
com.github.copilot/rules/iina-runtimes.mdc
hooks/hooks.json
rules/iina-evidence.mdc
rules/iina-pack-name.mdc
rules/iina-permissions.mdc
rules/iina-runtimes.mdc
scripts/agent-guard.mjs
scripts/rules.mjs
skills/iina-development/SKILL.md
skills/iina-development/evals/evals.json
skills/iina-development/references/runtime-brief.md
skills/iina-generate/SKILL.md
skills/iina-generate/evals/evals.json
skills/iina-generate/references/generate.md
skills/iina-generate/scripts/copy_argv.py
skills/iina-package/SKILL.md
skills/iina-package/evals/evals.json
skills/iina-upgrade/SKILL.md
skills/iina-upgrade/evals/evals.json
skills/iina-upgrade/references/upgrade.md
skills/iina-upgrade/scripts/answers_lineage.py
```

`com.github.copilot/rules/*.mdc` are sync projections of `rules/*.mdc`, not a second
hand-edited source.

## Expected overlay snippets

```
starter/tools/agent_kit_overlays/claude-package.frontmatter.yaml
starter/tools/agent_kit_overlays/codex-package.openai.yaml
```

## Expected projections (outside this plugin directory)

Owned by `starter/tools/agent_kit_projections.json` / `sync_agent_kit.py`.

```
starter/.cursor/skills/iina-development/**
starter/.cursor/skills/iina-generate/**
starter/.cursor/skills/iina-upgrade/**
starter/template/.cursor/skills/iina-development/**
starter/template/.cursor/skills/iina-package/**
starter/template/.cursor/skills/iina-upgrade/**
starter/template/.cursor/rules/*.mdc
starter/template/.cursor/hooks.json
starter/template/.claude/skills/iina-development/**
starter/template/.claude/skills/iina-package/**
starter/template/.claude/skills/iina-upgrade/**
starter/template/.agents/skills/iina-development/**
starter/template/.agents/skills/iina-package/**
starter/template/.agents/skills/iina-upgrade/**
starter/template/scripts/agent-guard.mjs
starter/template/scripts/rules.mjs
starter/tools/sync_agent_kit.py
starter/tools/agent_kit_projections.json
```

Generated trees must **not** include `iina-generate`. Nested `starter/.cursor/skills`
and this SSOT **may**. After W1, nested `starter/.cursor/skills/iina-generate/` must
also receive `scripts/copy_argv.py` via sync (do not hand-edit projection trees).

Do not add `starter/.cursor/hooks.json` (catalog workspace hooks require a local plugin
install; nested starter hooks would not run for awesome-iina).

## Skill audiences

| Skill | SSOT | Nested starter `.cursor/skills` | Generated template |
| --- | --- | --- | --- |
| `iina-development` | yes | yes | `.cursor`, `.claude`, `.agents` |
| `iina-package` | yes | no | `.cursor`, `.claude` (overlay), `.agents` (overlay) |
| `iina-generate` | yes | yes | **absent** (`iina-generate` (user-installed only)) |
| `iina-upgrade` | yes | yes | `.cursor`, `.claude`, `.agents` |

Package overlays (sync-time only):

- Claude: `disable-model-invocation: true`
- Codex: `agents/openai.yaml` with `allow_implicit_invocation: false`

Those fields are **not** in portable Agent Skills frontmatter.

## Hook policy

**Lefthook vs agent hooks:** Copier `hooks:` is Lefthook. This section is agent
hooks only.

Guard: Node `scripts/agent-guard.mjs` plus pure matchers in `scripts/rules.mjs`.
Stdin/stdout JSON. Exit `2` = deny. No `.env` reads. Log **rule id** only; never log
command strings (they may contain tokens). `--self-test` runs the fixture table.

`classify({command, toolName, toolInput, filePath})` must keep command-string
matchers **and** inspect Write/StrReplace payloads. `preToolUse` Write does not
send a shell `command`; without `tool_input` / `filePath` handling, Info.json
permission expansion is ungated.

Write/StrReplace rule: if `toolName` is `Write` or `StrReplace` and `filePath` or
the path in `toolInput` ends with `Info.json` / `Info.json.jinja`, run the same
permission-key checks on new contents when present in `edits` / `toolInput`. If
contents are unavailable, deny with `agent_message` asking to show the Info.json
diff (fail closed).

`pnpm run pack` is allowed. Bare `pnpm pack` is denied.

Shipped Cursor `hooks/hooks.json` uses `preToolUse` for Shell/Bash, Write, and
StrReplace, plus compensatory `afterFileEdit`. Copilot uses `beforeShellExecution`
and has no `beforeFileEdit`. Do not register `beforeFileEdit`.

Info.json permission expansion is always denied. Cursor `preToolUse` input has no
trusted user-prompt field (`user_message` is a deny output). A permission migration
is a human edit outside the agent. Do not treat a payload phrase as confirmation.
`rules.mjs` does not read `transcript_path`.

`copy_argv.py` subcommands are `describe` and `plan` only. `answers_lineage.py`
takes one repo path. `--help` prints human text and exits 0. Bad input still
prints JSON on stdout. Neither script emits `--trust`, `--UNSAFE`, `--overwrite`,
or runs Copier.

Auditor `evals/` directories stay on this plugin tree. `sync_agent_kit.py` skips
any path with an `evals` part. Generated IINA plugin repos do not receive them.

`repo_wrapper.py` is a catalog-maintainer offline helper documented in
`starter/README.md`. It is not the author happy path and is not part of
`iina-generate`.

### Permission posture

Body sections only. Do not add skill-scoped `hooks:` frontmatter.

| Skill | Posture |
| --- | --- |
| `iina-generate` | `side-effecting` (`uvx copier copy` writes the destination; `copy_argv.py` stays read-only) |
| `iina-development` | `write-scoped` |
| `iina-package` | `side-effecting` (`pnpm run pack` writes artifacts) |
| `iina-upgrade` | `side-effecting` (`copier update` / `template:update`) |
| Plugin-root hooks | `privileged-hooked` |

### Cursor agent hooks (`hooks/hooks.json`)

Cursor `preToolUse` matcher is **tool type** (`Shell`, `Write`, `StrReplace`; Bash
counts as shell). Documented file hook is `afterFileEdit`.

Do **not** register `beforeFileEdit`. Cursor does not list it. Do not list it as a
Cursor hook.

| Event | Matcher | failClosed | Deny rule id | Decision |
| --- | --- | --- | --- | --- |
| `preToolUse` | `Shell` or `Bash`; `--trust` as a CLI flag (not `--trusted*`) | `true` | `deny-copier-trust` | deny |
| `preToolUse` | `Shell` or `Bash`; `killall` targeting `IINA` | `true` | `deny-iina-killall` | deny |
| `preToolUse` | `Shell` or `Bash`; `osascript` quit/restart of IINA | `true` | `deny-iina-osascript-restart` | deny |
| `preToolUse` | `Shell` or `Bash`; `gh release` | `true` | `deny-gh-release` | deny |
| `preToolUse` | `Shell` or `Bash`; bare `pnpm pack` / `npm pack` (not `pnpm run pack`) | `true` | `deny-bare-pnpm-pack` | deny |
| `preToolUse` | `Shell` or `Bash`; `copier copy` destination overlapping the source tree | `true` | `deny-copier-overlap` | deny |
| `preToolUse` | `Shell` or `Bash` (no matcher; default) | `false` | — | allow unknown; fail-open |
| `preToolUse` | `Write`; path ends with `Info.json` / `Info.json.jinja` | `true` | `deny-info-permission-expansion` | always deny `allowedDomains` or extra permissions; a payload phrase is not confirmation; fail closed if new contents are missing |
| `preToolUse` | `StrReplace`; path ends with `Info.json` / `Info.json.jinja` | `true` | `deny-info-permission-expansion` | same as `preToolUse` Write |
| `afterFileEdit` | `Info\\.json` | `true` | `deny-info-permission-expansion` | **compensatory only** — the file is already written; this hook cannot unwrite it. `agent_message` must say **revert Info.json permission expansion** |

Keep Shell/Bash `preToolUse`. Add `preToolUse` matchers for `Write` **and**
`StrReplace` (two entries, or one regex if the host allows). Both call
`agent-guard.mjs`. Keep `afterFileEdit` on `Info.json` as compensatory deny+message.
`failClosed` stays `true` on deny matchers.

### Copilot equivalents (`com.github.copilot/hooks.json`)

| Event | Matcher | failClosed | Deny rule id | Decision |
| --- | --- | --- | --- | --- |
| `beforeShellExecution` | same shell deny matchers as Cursor `preToolUse` Shell/Bash | `true` | same rule ids | deny |
| `beforeShellExecution` | (no matcher; default) | `false` | — | allow unknown; fail-open |
| `preToolUseCommand` (if the host exposes it) | Info.json permission expansion in the command/tool payload | `true` | `deny-info-permission-expansion` | deny; Copilot has no documented `beforeFileEdit` equivalent |

Delete `beforeFileEdit` from Copilot YAML. Do not re-add it. Fail closed on
Info.json via the command matcher remains.

Allow examples (default hook, fail-open): `pnpm run pack`, `pnpm run check`,
`pnpm run build`, `node scripts/boundaries.mjs`, unknown commands.

Generated workspace `.cursor/hooks.json` uses `node ./scripts/agent-guard.mjs`.
Plugin `hooks/hooks.json` and Copilot `com.github.copilot/hooks.json` use
`node ./scripts/agent-guard.mjs` relative to the plugin root.

## Scripts: do / do-not

Skill-creator guidance: scripts beat prompt-only Copier; each script is a **narrow
bridge** (JSON in/out, no hidden I/O, no network, no writes to `~/.cursor`).

### Required (ship in W1)

| Script | Path (plugin-root relative) | stdin/argv | stdout | Side effects | Why it exists |
| --- | --- | --- | --- | --- | --- |
| `copy_argv.py` | `skills/iina-generate/scripts/copy_argv.py` | `describe` or `plan` + JSON flags | JSON object | None (no Copier exec, no mkdir, no git) | Agents must not invent Copier argv. One function builds the exact argv list from frozen rules. |
| `answers_lineage.py` | `skills/iina-upgrade/scripts/answers_lineage.py` | path to generated IINA plugin repo | JSON `{ok, reason, src_path, vcs_ref, unsafe}` | Read-only | Upgrade must refuse fixture/missing `.copier-answers.yml` instead of guessing `_src_path`. |
| `rules.mjs` (extend) | `scripts/rules.mjs` | existing `classify({command, toolName, toolInput, filePath})` | `{permission, agent_message?}` | None | `preToolUse` Write/StrReplace does not send a shell `command`. Without this, Info.json permission expansion is ungated. |
| `agent-guard.mjs` (extend) | `scripts/agent-guard.mjs` | hook stdin JSON | hook stdout JSON | stderr logs only | Adapter: parse Cursor vs Copilot vs Claude payloads into `classify()`. |

Keep existing `skills/iina-package/scripts/boundaries.py` and
`skills/iina-package/scripts/validate_iinaplugin.py` when present. Do not duplicate
them into generate or upgrade. Do not add them to Expected plugin paths until those
files exist in this tree.

### Rejected (do not add)

| Idea | Why not |
| --- | --- |
| Copier executor / `run_copier.sh` | Network + writes + `--trust` temptation; Copier must stay a user-visible `uvx` command |
| `~/.cursor/plugins` installer | `just starter-agent-plugin-install` already copies; a skill script that writes home dir is a supply-chain footgun |
| `pnpm pack` / `restart.py` wrappers | `iina-package` already documents the exact commands; wrappers hide `pack` vs `run pack` |
| HTML/dashboard templates | This is not a dashboard skill |
| `detect_layout.py` as a third script | Fold into `copy_argv.py describe` |
| Eval harness / `VALIDATION.json` | Do not fake evals |
| Duplicate `boundaries.py` | Already SSOT under iina-package when shipped |

## `copy_argv.py` closed contract

Implement in W1.A. Subcommands: `describe`, `plan`. No `copy`, `run`, `execute`.

Copier pin: **9.18.2**. Custom delimiters `[[ ]]` / `[% %]` stay. This template has
no tasks/migrations (`starter/copier.yml` has `_subdirectory: template` only), so
`--trust` / `--UNSAFE` are never required and must never be emitted.

Skill documentation may say `--overwrite NEVER`. Copier’s `--overwrite` flag
**enables** overwrite; the script and skill must **not** pass `--overwrite`.

Happy-path generate command the skill must emit (git source) after a successful
`describe`/`plan` (do not pass `--overwrite`):

```bash
uvx --from copier==9.18.2 copier copy \
  --vcs-ref "<tag-or-sha>" --prereleases \
  "gh:<owner>/<repo>" "<destination>"
```

ZIP path: author unzipped, `git init` + tag already done per starter README; Copier
`copy` from that local path, still `--vcs-ref`. `copy_argv.py describe` fails closed
if the source tree has no git metadata. Generate must not also `git init`.

### `describe` input schema

```json
{
  "$id": "iina-plugin-dev/copy_argv.describe.input",
  "type": "object",
  "additionalProperties": false,
  "required": ["source", "vcs_ref", "destination"],
  "properties": {
    "source": {"enum": ["git", "zip", "path"]},
    "url": {"type": "string"},
    "path": {"type": "string"},
    "vcs_ref": {"type": "string", "minLength": 1},
    "destination": {"type": "string", "minLength": 1},
    "data_file": {"type": "string"},
    "pretend": {"type": "boolean"}
  }
}
```

### `describe` output schema

```json
{
  "$id": "iina-plugin-dev/copy_argv.describe.output",
  "type": "object",
  "additionalProperties": false,
  "required": ["ok", "layout", "copier", "argv", "notes"],
  "properties": {
    "ok": {"type": "boolean"},
    "layout": {
      "anyOf": [
        {"enum": ["plugin-root", "nested-template"]},
        {"type": "null"}
      ]
    },
    "copier": {"const": "9.18.2"},
    "argv": {
      "anyOf": [
        {"type": "array", "items": {"type": "string"}},
        {"type": "null"}
      ]
    },
    "error": {"type": "string"},
    "notes": {"type": "array", "items": {"type": "string"}}
  }
}
```

`plan` is `describe` plus a `human` string: the exact shell line for the skill to
show. Still no exec.

```json
{
  "$id": "iina-plugin-dev/copy_argv.plan.output",
  "allOf": [
    {"$ref": "iina-plugin-dev/copy_argv.describe.output"},
    {
      "type": "object",
      "required": ["human"],
      "properties": {
        "human": {"type": "string"}
      }
    }
  ]
}
```

### Argv rules (W1.A must not invent flags)

- Layout detection (read-only): if `<src>/copier.yml` exists and `_subdirectory` is
  `template`, `layout=plugin-root`. If `<src>/template/copier.yml` or the tree **is**
  the template dir (has `Info.json.jinja`), `layout=nested-template`. Else `ok=false`.
- Always include `--vcs-ref <ref>`.
- Include `--prereleases` iff `vcs_ref` looks pre-release (`a`, `b`, `rc`, `alpha`,
  `beta` as PEP 440 fragments). `0.2.0a2` → include.
- Include `--data-file <path>` iff provided (maps to existing `starter/answers/*.yml`
  for maintainers; authors usually omit and answer the questionnaire).
- Include `--pretend` iff `pretend=true`.
- **Never** emit `--trust`, `--UNSAFE`, `--overwrite`, or `git init`.
- ZIP/path source: if `path` has no `.git`, `ok=false` with error
  `initialize git and tag the source before Copier copy`.
- Git source: if `url` missing, `ok=false`. Accept `gh:owner/repo` or
  `https://github.com/owner/repo.git`; normalize to Copier’s documented form.

### Worked `describe` examples

Git prerelease (include `--prereleases`):

```json
{
  "ok": true,
  "layout": "plugin-root",
  "copier": "9.18.2",
  "argv": [
    "uvx",
    "--from",
    "copier==9.18.2",
    "copier",
    "copy",
    "--vcs-ref",
    "0.2.0a2",
    "--prereleases",
    "gh:owner/repo",
    "../my-iina-plugin"
  ],
  "notes": []
}
```

ZIP/path without `.git` (fail closed):

```json
{
  "ok": false,
  "layout": null,
  "copier": "9.18.2",
  "argv": null,
  "error": "initialize git and tag the source before Copier copy",
  "notes": []
}
```

## `answers_lineage.py` closed contract

Implement in W1.B. Read `<repo>/.copier-answers.yml` only. Do not run
`copier update`.

Argv: one positional path to the generated IINA plugin repo.

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
  template should be `false`; still detect `_tasks` surprise).
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

## Native packaging

`validate.mjs` stage allowlist is exact. Agent files (`AGENTS.md`, `.cursor/**`,
skills, `plugin.json`, `scripts/agent-guard.mjs`, `scripts/rules.mjs`) must never
appear in `.build/<slug>/` or a native IINA plugin package. Generated IINA plugin
repos must not receive the Agent Plugins kit directory.
