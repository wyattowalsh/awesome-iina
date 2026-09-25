# Roadmap

The roadmap prioritizes trustworthiness and maintainability over raw list size. Dates are
intentionally omitted because upstream API behavior and reviewer capacity are the limiting
factors.

## Completed foundation

- Publish a reviewed catalog, contribution policy, machine-readable export, and static site.
- Keep discovery evidence separate from human-curated recommendations.
- Run nightly quick REST discovery and weekly full REST/GraphQL reconciliation in read-only
  GitHub Actions workflows.
- Preserve incomplete search evidence, stable repository identities, aliases, and prior-run
  diffs without claiming a complete census of GitHub.
- Detect plugin identifier collisions and validate `Info.json` without executing plugin code.
- Provide a complete Copier-based IINA plugin starter with separate validation gates.
- Integrate the supplied brand system across repository, documentation, and browser surfaces.

## Next: richer compatibility evidence

- Record release cadence, declared minimum IINA version, package assets, and manifest
  permissions as review evidence rather than inferred guarantees.
- Add reproducible macOS/IINA smoke-test records without running untrusted candidate code in
  the general discovery workflow.
- Expand repository ownership-transfer and alias review for renamed or transferred projects.
- Track official-index additions and removals as dedicated review events.
- Add maintainer-facing notifications for meaningful nightly changes while retaining
  read-only catalog permissions.

## Next: plugin engineering toolkit

- Validate `.iinaplgz` archive structure without installing or executing it.
- Add optional local macOS helpers for IINA launch, development linking, reload, and log capture.
- Exercise the starter against the selected Node, TypeScript, pnpm, Copier, and IINA toolchain
  on hosted macOS runners.
- Expand the bundled Agent Skill with debugging, compatibility, and release workflows.

## 1.0: dependable ecosystem registry

- Establish documented maintainer succession and review service levels.
- Require evidence-backed compatibility and maintenance status for every featured entry.
- Publish signed release archives, a reviewed dependency lock, schema compatibility notes,
  and migration guarantees.
- Expose stable machine-readable feeds for downstream clients while retaining human curation.

## Explicit non-goals

- Automatically endorsing every discovered repository.
- Executing untrusted plugin code in discovery CI.
- Claiming mathematically complete discovery outside the declared public GitHub query space.
- Replacing IINA's official plugin index, documentation, security process, or native runtime.
