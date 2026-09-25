# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and releases follow semantic
versioning for the repository tooling and data schema.

## [Unreleased]

### Added

- Nested design contract at `docs/maintain/design.md` (kit tokens, shadcn aliases,
  identity split, Tailwind pins for Starlight only).

### Removed

- Catalog-root `skills/iina-plugin-starter/` generate router. Catalog `skills/`
  documents only `awesome-iina-maintainer`. Authors generate with `iina-generate`
  on the user-installed Agent Plugins kit from a named git URL or ZIP Copier
  source.

### Changed

- Catalog site is the awesome-* web app: Contents, Start here, list-row grammar,
  native filters, Catalog labels dialog, and JSDoc `catalog.js`. Light theme uses
  `--brand-light-cyan`; dark theme uses `--brand-cyan` (`#43D9F5` is not light-theme
  text).
- Maintainer Starlight maps kit hues with the same light/dark split. Generated Copier
  Starlight keeps shadcn variable names and Starlight-safe neutrals, without catalog
  `--brand-*` hues.

## [0.5.0] - 2026-09-16

### Added

- Nightly quick REST discovery at 03:17 America/New_York and a weekly full
  REST/GraphQL reconciliation at 04:43 every Sunday.
- Best-effort prior-run baselines, stable-identity snapshot diffs, workflow summaries, and
  failure-preserving Actions artifacts.
- Deterministic multi-run discovery merging with backend provenance, repository rename
  aliases, sparse metadata preservation, and manifest-disagreement warnings.
- Separate report and review-queue output paths for concurrent backend audits.

### Changed

- Distinguish manually included overrides, unresolved review candidates, and excluded
  candidates so discovery cannot be mistaken for catalog approval.
- Split discovery automation into explicit nightly and weekly workflows while retaining
  read-only repository permissions and human-gated catalog promotion.
- Preserve unset fields and explicit nulls across saved discovery runs and checkpoints.

### Verification

- Added workflow contracts, merger tests, sparse-serialization tests, CLI merge/report
  coverage, and deterministic archive completeness requirements for the new surfaces.
- Final local gate: 200 root tests passed with 88.03% combined statement/branch
  coverage; repository integrity, brand synchronization, static-site generation,
  workflow shell syntax, and 32 starter source/offline shapes passed.

## [0.4.0] - 2026-09-16

### Added

- Recoverable v6 source restructured around an independent Copier project under `starter/`.
- Supplied Indexed Media brand kit integrated without rebranding generated consumer plugins.
- Static curated catalog with search, filters, themes, and supplied social/favicon assets.

### Changed

- Hardened REST/GraphQL discovery, query checkpoints, private filtering, metadata merges,
  completeness reporting, and staged archive replacement.
- Defaulted missing installation and maintenance evidence conservatively.
- Kept scheduled discovery read-only and attached failure evidence.
- Recorded current validation separately from imported historical logs.

## [0.3.0] - 2026-09-16

### Added

- Complete supplied Copier starter as a separate embedded source project, not a scaffold.
- Root include/subdirectory entrypoint, explicit generation helper, task recipes and CI.
- Four-preset root-entrypoint update tests, merge-conflict regression, source contracts.
- Independent starter export and dual-surface archive completeness requirements.
- Provenance, integration decision and candid layered verification ledgers.

### Fixed

- Generated manifest author validation and fixture-lineage rejection before updates.
- Template editor settings no longer lost to a global archive exclusion.
- Catalog version-source drift; canonical destination and archive policy reuse.

### Verification

- Native IINA and real Copier/selected-toolchain checks are separate gates. A source
  version number does not assert remote release publication or passing native tests.


## [0.2.0] - 2026-09-13

### Added

- Enforced minimal-root policy and an Awesome-list structural linter.
- Environment doctor, stable-identity discovery snapshot diffing, and safe local IINA
  manifest inspection.
- Dated architecture decisions, discovery coverage semantics, ecosystem taxonomy, and a
  documentation index.
- Curated entries for iinatan, Subtitle Navigator, and Whisperina, plus stronger evidence
  for recent media-enhancement plugins.
- Full-source archive safeguards that reject documentation-only bundles.

### Changed

- Moved community-health documents under `.github/` and project history under
  `docs/project/`.
- Required release bundles to contain the complete codebase and pass clean-extraction
  checks.
- Reframed discovery as measurable public-index coverage rather than an absolute census.
- Hardened external-link auditing with public-network validation, bounded concurrency,
  retries, and redirect revalidation.

## [0.1.0] - 2026-09-12

### Added

- High-recall GitHub discovery through GraphQL repository search, REST code search,
  official-source ingestion, and manifest verification.
- Recursive creation-date, star-count, and repository-size sharding for repository
  queries that exceed GitHub search-result limits.
- Typed Pydantic models for the curated catalog, discovery runs, source snapshots, plugin
  manifests, overrides, and media reports.
- Deterministic README, JSON catalog, and JSON Schema generation.
- Human-review queue and coverage-audit report generation.
- Combined ffprobe, MediaInfo, mkvmerge, and mkvinfo inspection with normalized MKV and
  media metadata.
- Weekly and monthly discovery automation, CI, link auditing, deterministic release
  archives, Dependabot, pre-commit, and an Agent Skill.
- Curated launch catalog covering official IINA resources, current plugins, integrations,
  developer tooling, foundational media tools, and historical projects.

### Changed

- Source synchronization follows the current `main` branch of the earlier
  `cxwx/awesome-iina` list.
- Discovery failures are preserved as query outcomes and run warnings instead of
  aborting the entire audit.
- Invalid plugin manifests are retained as review diagnostics rather than silently
  terminating discovery.
