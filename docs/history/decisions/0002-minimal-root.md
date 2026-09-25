# ADR 0002: Keep the repository root intentionally small

- **Status:** Accepted (amended 2026-09-17)
- **Date:** 2026-09-13

## Context

The previous bundle placed governance, security, changelog, and contribution
files at the repository root. Those files are important, but a crowded root
makes the primary entry points harder to identify and encourages generated
reports to accumulate beside source files.

An earlier draft of this decision named root `schemas/` and `artifacts/`
directories. Live tooling already emits schemas under `src/awesome_iina/catalog/schemas/` and local
run evidence under gitignored `output/`. Recreating those names at the root
would grow the root instead of shrinking it.

A later pass still left a wide fan of peer folders (`config/`, `scripts/`,
`web/`, `assets/`, `branding/`, then `data/` and `brand/`). Reviewed catalog
YAML, discovery config, schemas, and the identity kit now nest beside the
Python packages under `src/awesome_iina/`.

## Decision

Retain only universally expected project entry points and tool configuration at
the root. Put community-health files in `.github/`, long-form documentation in
`docs/` (catalog, discovery, maintain, history), implementation and reviewed
machine inputs under `src/`, generated run evidence in ignored `output/`, and
the nested Copier project under `starter/`. JSON Schemas generate in
`src/awesome_iina/catalog/schemas/`. The identity kit is
`src/awesome_iina/site/kit/`.

Allowed root directories are `.github`, `docs`, `skills`, `src`, `starter`,
and `tests`.

Do **not** introduce root `schemas/`, `artifacts/`, `data/`, or `brand/`
directories.

`AGENTS.md` remains at the root because repository-scoped coding agents discover
instructions there. `LICENSE`, `README.md`, `pyproject.toml`, `CITATION.cff`,
`copier.yml`, and the `justfile` also remain root entry points. A reviewed
`uv.lock` belongs at the root once generated in a networked environment; the
repository does not fabricate one when dependencies cannot be resolved.

`SOURCE-MANIFEST.json` is generated inside source ZIP archives. A leftover
working-tree copy is not a project entry point.

## Consequences

GitHub can still discover supported community-health files from `.github/`.
Contributors get a cleaner first view, and root-policy drift can be checked
automatically. Schema consumers import `src/awesome_iina/catalog/schemas/`; local discovery and
preview products stay out of git. The identity kit and static catalog templates
travel with `src/awesome_iina/site/`; only `dist/site/` is deployable. Root
`data/` and `brand/` directories are policy violations.
