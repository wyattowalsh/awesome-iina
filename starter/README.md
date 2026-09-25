# IINA Plugin Starter

Full Copier template source, version **0.2.0a2**. Community tooling, not an official IINA project.

Generate TypeScript command, sidebar, overlay or global-controller plugins with optional
preferences, optional Astro/Starlight documentation, and explicitly installed Git hooks.
Development infrastructure is separate from the installed plugin's JavaScript and assets.

Authors install the portable Agent Plugins kit under `plugins/iina-plugin-dev/` into
their own harness, then generate with `iina-generate` (user-installed only) from a
git URL or ZIP they name. Catalog-root `skills/` in awesome-iina is
`awesome-iina-maintainer` only; this package/ZIP name is not a catalog skill.

**Read VALIDATION.json before making compatibility claims.** This archive contains actual
source files and executable workflows, not only a blueprint. Package installation, real
Copier operations, production bundling, Starlight builds and native IINA checks were not
possible in the preparation environment. Executed fixture/contract results are recorded
separately in evidence/current. A workflow file is not proof that GitHub has run it.

## Generate from git or the downloaded source

Pin Copier **9.18.2**. Always pass `--vcs-ref`. Pass `--prereleases` for this
pre-release tag. Do **not** pass `--overwrite` or `--trust`. Prefer
`iina-generate` on the user-installed plugin so argv stays closed.

Git source (after the template is published):

```sh
uvx --from copier==9.18.2 copier copy --vcs-ref=v0.2.0a2 --prereleases \
  "gh:<owner>/<repo>" ../my-iina-plugin
```

The ZIP is not a Git repository and carries no fabricated template lineage. Extract it to
a persistent directory, inspect it, then initialize a *new* local template repository
**before** Copier copy (`iina-generate` never runs `git init`):

```sh
cd iina-plugin-starter
git init -b main
git add .
git commit -m "Initialize reviewed IINA template source"
git tag v0.2.0a2
uvx --from copier==9.18.2 copier copy --vcs-ref=v0.2.0a2 --prereleases . ../my-iina-plugin
```

Answer the questions, or pass `--data-file answers/<preset>.yml` (not `-a`).
Do not run Git initialization over an existing repository. Do not overwrite a tag.
Preserve this source and its history for later updates. For a multi-machine/team
workflow, publish the reviewed template source first and generate from that
repository rather than an ephemeral local path.

## Bootstrap the generated plugin

```sh
cd ../my-iina-plugin
mise install
pnpm run bootstrap
pnpm run fmt
pnpm run check
pnpm run build
pnpm run doctor
```

mise is optional if the matching tools are installed manually. Dependency installation and
first-render formatting are explicit. Review and commit the dependency lock and normalized
source before frozen CI. Strict lifecycle-script policy may require reviewed exact-version
exceptions after resolving the selected dependency graph; do not enable all scripts.

On macOS, `pnpm run link` and `pnpm run pack` use the native IINA CLI. UI preview is a
loopback browser simulation. No script implicitly restarts IINA, publishes a repository,
installs global agent configuration or reads a personal media library.

## Included

- `copier.yml` and the complete `template/` tree, with all four runtime presets.
- Expanded justfile, optional mise provisioning, formatter/linter configuration, watch mode,
  browser simulation, privacy-aware diagnostics, fixture generation and package verification.
- Generated plugin CI, optional GitHub Pages deployment, candidate-release workflow,
  Renovate, VS Code settings/schemas, contributor templates, and optional Lefthook configuration.
- Canonical Markdown documentation, optional Starlight site, generated commands and LLM exports.
- Starlight theming uses Tailwind with shadcn-named variables and Starlight-safe neutrals.
  Copier updates overwrite generated `site/**`; `docs/content/**` is excluded, so keep
  plugin-specific docs copy there rather than only in `site/`.
- Maintainer Starlight site, CI and true Copier integration/upgrade tests with fail-closed gates.
- Source/contract tests, negative runtime compilation, archive validation, and current evidence.
- Claude Code/Codex project instructions and skills, with no required MCP service or paid API.
- Agent Plugins kit under `plugins/iina-plugin-dev/` (skills, Cursor rules/agents/hooks, Node
  guard). Authors install this kit; `iina-generate` lives on that user-installed plugin.
  Sync with `just starter-sync-agent-kit`. Generated trees include `.cursor/skills`
  without `iina-generate`. Lefthook is not an agent hook.

## Catalog-maintainer offline helper

`starter/repo_wrapper.py` is the catalog-maintainer offline helper (`describe`,
`verify`, `new`). It is not the author happy path. Authors use the user-installed
`iina-plugin-dev` kit and `copy_argv.py` plus `uvx copier copy`.

## Test and maintain the template

```sh
uv sync
uv run --no-sync pytest tests
REQUIRE_COPIER=1 uv run --no-sync pytest tests/test_real_copier.py
uv run --no-sync python tools/integration_matrix.py --preset sidebar --docs starlight
pnpm install
pnpm run docs:build
```

The integration command uses *actual Copier*, then explicit bootstrap/format/check/build.
It never substitutes the offline fixture renderer. Commit real `uv.lock`, `pnpm-lock.yaml`
and `mise.lock` after resolution/review; none was synthesized in this environment.

`python3 tools/bundle.py --output dist/iina-plugin-starter.zip` packages the source with a
hash inventory. `just workflow-lint` invokes independently installed actionlint and zizmor;
structural Python workflow checks do not pretend to replace those analyzers.

## Scope and release gates

Runtime imports remain local-only until a dependency and its licenses/capabilities are
reviewed. Consumer source and documentation are seed-owned. Preset/docs-profile switches
are migrations, not casual answer changes. Fumadocs and React/Vue profiles are deferred,
not empty folders pretending to be implemented.

GitHub publication remains manual. The release workflow produces a candidate stage;
local release preparation requires tagged clean source, a committed dependency lock and
source-bound recorded native results. It validates that report; it does not itself drive
IINA's GUI. See docs/content/verification.md and HANDOFF.md for remaining acceptance work.

## Integrated-source revision

This revision preserves the supplied template and adds author validation, fixture-lineage
rejection, integrated-root copy/update tests and a source-contract verifier. Author validation
changes accepted input intentionally; it is not a behavior-preserving formatting change.
Generated contribution/security documents now live in `.github/`.

`python3 tools/verify_source.py` checks all 32 offline fixture shapes. An optional
`--preset sidebar` on `tools/audit_matrix.py` bounds an audit run. That audit still uses
fixtures, not Copier. The original import's validation and logs live under
`history/import-0.2.0a1-*`; `VALIDATION.json` records this revision's actual checks.

The same source can be embedded by a root Copier include/subdirectory wrapper. Real tests
exercise that form as well as standalone copy/update semantics. Standalone exports remain
complete, independently testable source distributions, with no fabricated Git lineage.
