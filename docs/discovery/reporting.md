# Discovery reports

`awesome-iina report INPUT.json` creates the configured Markdown audit report (by default
`output/discovery-latest.md`) and review queue. `--output PATH.md` changes the report path.

The report distinguishes explicitly accepted human overrides, heuristic review candidates,
and rejected or low-relevance results. It also shows query completion, warnings, source
provenance, identities, and manifest observations. A review queue is generated evidence,
not the human-curated source of truth. Store durable choices in the overrides or catalog,
not only in a generated queue that the next run replaces.

Neither the report nor the scheduled workflow edits `src/awesome_iina/catalog/catalog.yaml`. No plugin code is
executed while producing these reports. See [discovery](discovery.md) for coverage limits.
