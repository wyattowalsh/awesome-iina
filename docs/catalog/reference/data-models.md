# Data models and compatibility

## Curated catalog

`src/awesome_iina/catalog/catalog.yaml` is the only hand-curated source of truth. It has strict validation and rejects unknown fields, duplicate slugs, duplicate repositories, and undeclared plugin-identifier collisions. Each entry records a category, project kind, maintenance status, description, install methods, evidence sources, and optional plugin metadata.

Schema-breaking catalog changes require incrementing `metadata.version`, documenting migration behavior, and regenerating all outputs.

## Discovery configuration

`src/awesome_iina/discovery/discovery.yaml` declares the public search space. Query IDs are durable provenance keys. Renaming one loses continuity between audits, so prefer disabling a query over silently repurposing its identifier.

## Source snapshots

Each configured upstream source is committed as a typed snapshot with its retrieval time, source URL, original raw-byte SHA-256, canonical parsed-content SHA-256, and parsed content. Refreshes are no-ops when both hashes and the source URL are unchanged, so scheduled audits do not create timestamp-only pull requests.

## Discovery run

A run contains:

- immutable timing, mode, and configuration digest;
- the repository-search backend (`rest`, `graphql`, or `merged`) and per-query backend
  provenance;
- deduplicated repository candidates;
- repository and code-search evidence;
- verified or rejected manifest probes;
- candidate scores, categories, reasons, and manual notes;
- per-query counts and completeness;
- batch-level warnings that did not prevent the audit from continuing.

Saved runs preserve the distinction between a field omitted by a partial API response and
an explicitly returned `null`. Weekly reconciliation deduplicates by stable GitHub node or
database identity before considering names and aliases. Conflicting stable identities are
not collapsed merely because they currently share a repository name.

Candidate decisions are triage state, not catalog state. `accept` means a maintainer supplied
an explicit include override, `review` means human review remains unresolved, and `reject`
means the candidate is excluded by heuristics or override. The review queue contains both
non-rejected states; neither automatically changes `src/awesome_iina/catalog/catalog.yaml`.

The `complete` property means every configured query completed according to the reported API counts. It does not imply discovery outside the declared search space.

## Media report

A media report combines a normalized summary with raw inspector output. The normalized layer is stable enough for comparison and support tooling. The raw layer remains tool-version-specific and should not be treated as a stable API.

## Generated JSON catalog

`src/awesome_iina/catalog/exports/catalog.json` is optimized for consumers. It adds derived project URLs and aggregate statistics to the reviewed catalog without live GitHub metadata. This avoids silently turning transient stars or activity into curation claims.
