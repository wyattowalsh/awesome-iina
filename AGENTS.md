# Agent instructions

## Repository purpose

Maintain a high-precision public catalog of the IINA ecosystem and a high-recall, auditable GitHub discovery pipeline. Discovery findings are leads. `src/awesome_iina/catalog/catalog.yaml` is the reviewed source of truth. The contributor layout map is [`docs/README.md`](docs/README.md).

## Required workflow

1. Read the nearest implementation, model, test, and documentation before changing behavior.
2. Edit source data or templates, never generated catalog sections directly.
3. Preserve evidence provenance and report incomplete search coverage honestly.
4. Add or update tests for any non-trivial Python change.
5. Run `just check` before finishing.
6. Regenerate `README.md`, `src/awesome_iina/catalog/exports/catalog.json`, and every file under `src/awesome_iina/catalog/schemas/` after catalog, model, or template changes.

## Data rules

- Use `owner/repo`, not a mutable GitHub URL, for GitHub projects.
- Do not mark a project official without an authoritative IINA source.
- Do not infer active maintenance from stars, a topic, or repository existence.
- Do not silently resolve duplicate plugin identifiers. Represent and explain collisions.
- Keep project descriptions original, factual, concise, and punctuated.
- Prefer `unknown` over guessing a project's current status.
- Preserve archived projects only with a documented historical or migration reason.

## Discovery rules

- GitHub's search index and result caps prevent an absolute claim of global completeness.
- A full run is complete only when every configured `QueryOutcome.complete` is true.
- Never drop an incomplete query, inaccessible repository, or invalid manifest without recording the failure.
- Query overlap is intentional for recall. Scoring must cap inflation from redundant evidence.
- Manual overrides belong in `src/awesome_iina/discovery/overrides.yaml`, not hard-coded repository conditionals.
- Scheduled discovery must remain `contents: read`, upload partial evidence on failure, and
  save a comparison baseline only after a successful source refresh and complete scan.
- REST/GraphQL reconciliation must preserve conflicting stable identities and must not use a
  repository name alone when that name is ambiguous.

## Python conventions

- Python 3.13, Pydantic v2, Typer, uv, Ruff, ty, and pytest.
- Use strict models and explicit enums for persisted data.
- Keep network and process boundaries injectable and testable.
- Use `pathlib.Path`, timezone-aware datetimes, deterministic output, and atomic writes.
- Avoid new dependencies when the standard library provides a clear, maintainable solution.

## Safety

Never commit tokens, personal media metadata, service credentials, or raw private discovery data. Treat plugin network/filesystem permissions and externally downloaded binaries as security-relevant evidence, not implementation trivia.

## Copier starter boundary

`starter/` is a complete separate tooling project, not generated junk.
Preserve its files, license, tests, and documented runtime/ownership policy. Edit its
canonical questionnaire, not a duplicate at root. Root `copier.yml` may override only
`_subdirectory`. Run `python starter/repo_wrapper.py verify` for offline contracts, then the
starter's own tests. Fixture rendering is never a fallback for missing real Copier.
Run the required real-Copier and installed-toolchain matrix before certifying updates.
Keep source/answers/ref evidence; never initialize user Git history or add `--trust` silently.
Do not package Node tools, tests, agent files, docs build sources or fixture answers into a
native plugin. Do package the full nested source tree in this repository's source ZIP.

Portable Agent Plugins source is `starter/plugins/iina-plugin-dev/` (closed `plugin.json`,
skills, no `mcp.json`). Sync with `just starter-sync-agent-kit` / `--check`. Nested
`starter/.cursor/skills/` is allowed; catalog-root `.cursor/` and catalog-root `plugin.json`
are not. Generated consumers get workspace `.cursor/skills` without `iina-generate`.
Copier `hooks:` is Lefthook, not an agent hook. `just starter-agent-plugin-install` is an
opt-in symlink and must never run from `just check`.

## Learned User Preferences

- Keep the repository nested in named domain folders. Do not leave a flat root or a flat `docs/` / `tests/` dump.
- Keep the catalog website grouped into exclusive provenance sections, with IINA's published `plugins.json` index split from other native plugins and from official plugins.
- Treat the catalog site in `src/awesome_iina/site/` as a designed UI surface (hierarchy, contrast, section navigation), not a single inventory list.
- Treat `starter/plugins/iina-plugin-dev/` as a portable Agent Plugins kit for downstream IINA plugin authors using their own harness, not as catalog-maintainer tooling in this checkout.
- In Plannotator/goal flows, do not stall on unchecked out-of-scope boxes; encode them as rejectable facts and continue.

## Learned Workspace Facts

- Root membership is the contract in `src/awesome_iina/repo/root-policy.toml` and ADR 0002: entry points only; allowed directories are `.github`, `docs`, `skills`, `src`, `starter`, and `tests`. Do not add root `schemas/`, `artifacts/`, `data/`, `brand/`, or `goals/` directories. Nested goal packages live under `docs/maintain/goals/`.
- Package code lives in nested `src/awesome_iina/{catalog,discovery,github,site,media,repo}/`. Catalog YAML, schemas, and the README template live in `catalog/`. Discovery config, overrides, queries, and snapshots live in `discovery/`. Site templates, `brand.json`, and the identity kit live in `site/`. Generated output is `dist/site/`.
- Identity lives in `src/awesome_iina/site/kit/`. Built site URLs still use `assets/brand/`.
- JSON Schemas generate under `src/awesome_iina/catalog/schemas/`; local run evidence belongs in gitignored `output/`; `SOURCE-MANIFEST.json` is written inside source ZIPs only.
- `.cursor` stays in `ignored_directories`, not `allowed_directories`.
- Listing in IINA's `plugins.json` is not officialness and is not first-party ownership.
- Package tests group by domain under `tests/{catalog,discovery,github,media,site,cli,repo}/`. Do not use `tests/awesome_iina/`, which would shadow the installable package.
- Design SSOT is [`docs/maintain/design.md`](docs/maintain/design.md). The public catalog in `src/awesome_iina/site/` (built to `dist/site/`) is the awesome-* web app; `docs/` is the contributor handbook, not a site. Generated Copier plugins must not receive catalog hues (`consumer_plugins_receive_catalog_identity: false` in `src/awesome_iina/site/brand.json`); maintainer `starter/site/` may map kit tokens, Copier Starlight CSS must not.
- Catalog-root `skills/` is maintainer-only (`awesome-iina-maintainer`). Do not add a catalog-root `iina-plugin-starter` router; `iina-generate` belongs in the user-installed portable plugin. Nested `starter/.cursor/skills/` may expose the portable kit in this checkout.
- Origin GitHub publish is operator-gated; never push silently.
