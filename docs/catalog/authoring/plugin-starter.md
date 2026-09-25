# Copier plugin starter

This repository embeds the complete supplied IINA starter, rather than rebuilding it from
an empty scaffold. It is independent community tooling, not an official IINA SDK.
The catalog/discovery package remains usable without Node or Copier.

Catalog-root `skills/` is [`awesome-iina-maintainer`](../../../skills/awesome-iina-maintainer/SKILL.md)
only. Authors do not generate plugins from a catalog-root skill.

## Source ownership

`copier.yml` at the repository root includes
`starter/copier.yml` and overrides only `_subdirectory`. The nested
questionnaire and `template/` directory are canonical. There is one template with four
presets, not four independent templates or multiple diverging questionnaires.

`src/awesome_iina/catalog/templates/README.md.j2` continues to generate the Awesome list. It is unrelated to Copier's
consumer README template. Do not edit generated `README.md` or put plugin implementations
in the curated catalog's Python package.

See [the integration decision](../../history/decisions/0004-embedded-copier-starter.md) and
[the source audit](../../history/audits/2026-09-16-copier-integration.md).

## Author path: install the kit, then Copier from git or ZIP

Downstream authors:

1. Install the portable Agent Plugins kit (`starter/plugins/iina-plugin-dev/`) into
   their own harness. From this checkout, opt-in
   `just starter-agent-plugin-install` symlinks that directory into
   `~/.cursor/plugins/local/iina-plugin-dev`. That recipe is never part of
   `just check`. Do not add catalog-root `.cursor/` or catalog-root `plugin.json`.
2. Name a Copier source: a git URL plus an immutable `--vcs-ref`, or a release ZIP
   they already unzipped and `git init` + tagged (see the starter README). Do not
   invent the source.
3. Generate with `iina-generate` on that user-installed plugin, or run Copier
   directly. Pin Copier **9.18.2**. Always pass `--vcs-ref`. Pass `--prereleases`
   when the ref is a pre-release (`0.2.0a2`). Do **not** pass `--overwrite` or
   `--trust`.

Git source:

```sh
uvx --from copier==9.18.2 copier copy --vcs-ref "<tag-or-sha>" --prereleases \
  "gh:<owner>/<repo>" ../my-iina-plugin
```

ZIP source (after the author has initialized git and tagged the extracted tree;
generate never runs `git init`):

```sh
cd iina-plugin-starter
uvx --from copier==9.18.2 copier copy --vcs-ref=v0.2.0a2 --prereleases . ../my-iina-plugin
```

The package and ZIP name `iina-plugin-starter` is the template archive. It is not a
catalog-root skill. `iina-generate` lives only on the user-installed plugin.
Generated projects receive workspace `.cursor/skills` for development, package, and
upgrade — never `iina-generate`.

A remote `gh:wyattowalsh/awesome-iina` source becomes usable only after these files
are actually published. This delivery does not publish that repository or create a
release.

## Independent source export

```sh
just starter-export dist/iina-plugin-starter.zip
```

The exported starter contains its own questionnaire, full template, docs, tests, CI,
bundler, source manifest, and evidence. It does not contain the Awesome list. It can become
a separate repository after explicit publication, but then owns separate tags/history.
The integrated repository uses Awesome IINA's repository tags. Always choose an explicit
ref; do not imply two independent tag namespaces inside one Git history.

The archive deliberately contains no fabricated `.git` directory or `.copier-answers.yml`
at the repository root. Preserve the extracted source in a permanent location. In a **new,
previously uninitialized** directory, inspect the contents, then create genuine history
before Copier copy (authors do this; `iina-generate` does not run `git init`):

```sh
cd iina-plugin-starter
git init -b main
git add .
git commit -m "Initialize reviewed IINA template source"
git tag v0.2.0a2
```

Do not reinitialize an existing repository, overwrite tags, or manufacture old history.

## Catalog-maintainer offline helper

`starter/repo_wrapper.py` and `just starter-new` are the catalog-maintainer offline
path for this checkout. They are **not** the author happy path. Authors use the
user-installed plugin plus Copier from a named git URL or ZIP.

The wrapper requires the source to be committed and clean, and refuses existing
destinations or destinations overlapping this repository.

```sh
# Print exact argv only. Does not install Copier, create files, or need Git history.
uv run python starter/repo_wrapper.py new ../my-iina-plugin --ref HEAD --preset sidebar --dry-run

# Run real Copier. uvx installs the pinned Copier environment on this explicit command.
uv run python starter/repo_wrapper.py new ../my-iina-plugin --ref HEAD \
  --preset sidebar --preferences true --docs markdown \
  --name 'My IINA Plugin' --slug my-iina-plugin \
  --identifier com.example.my-iina-plugin --author 'Your Name'
```

Equivalent root task shortcuts:

```sh
just starter-info
just starter-verify
just starter-plan ../my-iina-plugin HEAD sidebar
just starter-new ../my-iina-plugin HEAD sidebar true markdown
```

The source argument used by the helper is the **repository root**, preserving its update
lineage. Use an explicit reviewed commit or tag.

## Presets and optional profiles

| Preset | Starting behavior | Runtime boundary |
| --- | --- | --- |
| `command` | Small player-local menu action | JavaScriptCore, no browser or Node globals |
| `sidebar` | Player-local title/playback view | Typed local-to-webview protocol |
| `overlay` | Video overlay with view handshake | Adds only the baseline `video-overlay` permission |
| `controller` | Global controller with a standalone view | Separate `globalEntry` and player entry |

`preferences=true` adds a settings page. `docs_profile=starlight` adds an Astro/Starlight
site around canonical Markdown; `markdown` avoids that dependency set. `hooks=true`
includes optional Lefthook configuration, but does not install hooks. There are 32 rendered
shapes across preset, preferences, docs, and hooks answers.

The generated app uses three separately checked environments: main, global, and UI.
Build scripts run under Node, which does not make Node APIs available inside IINA.
Types are a deliberately narrow local contract, not a replacement for all upstream types.
The controller is not a general session-restoration or all-window-inventory implementation.

## Bootstrap, build, and native checks

Inside a project generated by **real Copier**:

```sh
mise install                 # optional when the selected versions are already installed
pnpm run bootstrap           # explicit dependency resolution, not a Copier task
pnpm run fmt                 # normalize freshly rendered source
pnpm run check
pnpm run build
pnpm run verify:stage
pnpm run docs:prepare
pnpm run doctor
```

Review and commit the resulting lockfile and formatted source before frozen CI.
`pnpm run docs:build` needs the Starlight profile and its installed dependencies.
Do not broadly allow dependency lifecycle scripts just to make installation pass.

Production bundling uses esbuild with separate runtime targets and a strict package
allowlist. `.build/<slug>/` is the staged plugin, not the template source distribution.
No `node_modules`, tests, source maps, agent instructions, or build scripts belong there.

On macOS, after source/package review, use `pnpm run link` and `pnpm run pack` for IINA's
own CLI. The starter checks platform and link ownership. Native tests must still cover
player-local/global lifecycle, reloads, event cleanup, sidebar/overlay behavior, preferences,
and real installation/update. A browser preview or a source-bound native-report validator
is not evidence that those tests happened.

## Update contract

Keep the genuine consumer `.copier-answers.yml`, including `_src_path` and `_commit`.
The generated updater rejects fixture/unversioned answers, requires a clean consumer and
an explicit update branch, and accepts one explicit Git reference. It never adds `--trust`
or silently changes permissions, dependencies, preset, or documentation profile.

```sh
git switch -c template-update/reviewed-release
pnpm run template:update -- v0.3.1
```

`v0.3.1` is an example of a **future reviewed ref**, not a release shipped here.
Use the next existing ref in the same recorded source history.

| Ownership | Paths | Intended update behavior |
| --- | --- | --- |
| Consumer seed | `src/**`, `tests/unit/**`, `Info.json`, `.iina-project.json`, README, LICENSE | Excluded during updates, including deliberately deleted seeds |
| Consumer documentation | `docs/content/**`, `docs.config.json`, `native-evidence.json` | Preserve local content; new seeds require an explicit migration |
| Shared | Package/tool configuration and workflows | Normal Copier merge, conflicts reviewed rather than forced away |
| Managed tooling | `scripts/**`, contract tests, runtime references, `.cursor/**`, `.claude/skills/**`, `.agents/skills/**` | Review template changes and run checks after merging. Agent-kit copies are managed, not Copier `_exclude`. |

## Agent kit

Portable Agent Plugins v1.0.0 source lives at `starter/plugins/iina-plugin-dev/`
(closed `plugin.json` plus skills; **no** `mcp.json`). `sync_agent_kit.py --check` is
part of starter verify. Generated projects load `.cursor/skills` (development, package,
upgrade — never `iina-generate`), `.cursor/rules`, and `.cursor/hooks.json`. Nested
`starter/.cursor/skills/` is how Cursor sees generate/upgrade/development while working
in this catalog. Catalog-root `.cursor/` is forbidden.

Copier `hooks:` is Lefthook, not an agent hook. `just starter-agent-plugin-install` is
an optional symlink into `~/.cursor/plugins/local`; it is never part of `just check`.
Do not package agent files into native `.iinaplugin` archives. After a local Cursor
plugin install, Customize should show rules + skills + hooks (human check).

Changing preset/docs/hooks answers after creation can alter the runtime/build shape and is
not advertised as an automatic migration. Moving an existing consumer from the standalone
starter repository to this integrated source also requires deliberate lineage migration.
Do not hand-edit `_src_path` and hope unrelated Git histories merge.

## Validation layers

```sh
just starter-verify              # offline source/fixture contracts, not Copier
just starter-test                # isolated starter Python environment
just starter-upgrade-test        # Copier required; cannot pass via skipped Copier tests
just starter-fixtures sidebar    # generated fixture checks, no update proof
just starter-integration sidebar true starlight  # real Copier + installed toolchain
```

`.github/workflows/starter.yml` requires real-Copier copy/update tests and 16 installed
build combinations: four presets, two preferences settings, two docs profiles. The
nested CI works for a separately exported template; it does not run merely by being nested.
The required aggregate job is successful only if both test jobs succeed.

Current evidence is [the integration verification report](../../history/audits/2026-09-16-integration-verification.md)
and [the starter's validation ledger](../../../starter/VALIDATION.json).
Historical imported logs are under the starter's `history/`, not current verification.
