# Catalog maintenance

`src/awesome_iina/catalog/catalog.yaml` is the only hand-edited source for published project entries.

| Path | Role |
| --- | --- |
| `src/awesome_iina/catalog/catalog.yaml` | Reviewed catalog source of truth |
| `src/awesome_iina/catalog/templates/README.md.j2` | README generator |
| `src/awesome_iina/catalog/schemas/` | Generated JSON Schema |
| `src/awesome_iina/catalog/exports/catalog.json` | Generated machine catalog |
| `src/awesome_iina/discovery/discovery.yaml` | Discovery settings, queries, and source destinations |
| `src/awesome_iina/discovery/overrides.yaml` | Forced include, exclude, and score decisions |
| `src/awesome_iina/discovery/queries/` | Extra GitHub code and repository query files |
| `src/awesome_iina/discovery/snapshots/` | Committed IINA plugin-index and legacy-list snapshots |
| `output/discovery/` | Gitignored discovery run evidence |

## Required fields

Every project needs a stable slug, display name, original factual description, category, kind, status, and exactly one location: either a GitHub `owner/repo` or an external URL.

Descriptions must be concise, end with punctuation, and avoid unsupported quality claims. Tags are normalized and sorted by the model.

## Plugin identifiers

Known IINA plugins should include the identifier declared in `Info.json`. Duplicate identifiers are rejected because IINA treats identifiers as plugin identity. A collision can be represented only by setting `identifier_collision_allowed: true` on every involved entry and explaining the conflict in `notes`.

## Sources

Use the strongest available source:

1. official IINA organization or documentation;
2. IINA's official plugin index;
3. the project's own manifest and repository;
4. GitHub topic or discovery evidence;
5. third-party lists only as leads.

## Status

- `active`: current operation has been manually confirmed.
- `beta`: usable but explicitly pre-stable.
- `experimental`: proof of concept or high-risk integration.
- `unknown`: discovered, but current maintenance or compatibility has not been verified.
- `archived`: repository is archived or author-declared discontinued.
- `historical`: intentionally retained for implementation or migration context.

## Generation

```bash
just validate
just generate
just generate-check
```

Generation writes `README.md`, `src/awesome_iina/catalog/exports/catalog.json`, and every JSON Schema file produced by `generated_outputs()`, not only `src/awesome_iina/catalog/schemas/catalog.schema.json`. It is deterministic and contains no wall-clock timestamp.
