# Source changes

## 0.2.0a2, unpublished source candidate (2026-09-17)

Added portable Agent Plugins source under `plugins/iina-plugin-dev/` (skills, Cursor
plugin manifest, Node guard, sync projections). This is **source**, not a claim that
Claude, Codex, or Cursor client evaluations were executed. See VALIDATION.json for
actual executed layers.

Removed the catalog-root generate router. Authors install this kit, then generate
with `iina-generate` (user-installed only) from a named git URL or ZIP. Catalog
`skills/` documents only `awesome-iina-maintainer`.

Documentation and consumer-pin alignment with `pyproject.toml` version `0.2.0a2`.
Getting-started Git tags use this revision. Copier copy from a prepared answers
YAML uses `--data-file answers/<preset>.yml`, not `-a`.

## 0.2.0a1, unpublished source candidate (2026-09-13)

Compared with the prior alpha:

- Added optional Starlight documentation and explicitly activated hook configuration.
- Implemented generated-plugin CI, candidate-release staging, optional Pages deployment,
  maintainer generation/upgrade CI, and rejection of skipped required integration tests.
- Expanded just commands, mise provisioning, formatting/linting configuration, editor
  schemas, Renovate, contributor guidance, read-only diagnostics, and support reports.
- Added a serialized watch/rebuild loop and restricted loopback browser simulation.
- Added deterministic Markdown exports, command reference, and documentation sources.
- Added release source/report binding, first-party media fixture generation, and
  source ZIP inventory verification.
- Expanded fixture shape coverage to 32 combinations; added developer-tool regression tests.

This is a source delivery, not a published or native-certified release. Read VALIDATION.json
for actual environments, executed tests, skipped integration cases, and remaining gates.
