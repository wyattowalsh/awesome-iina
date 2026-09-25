# Architecture

`awesome-iina` deliberately separates discovery, review, and publication.

```text
GitHub REST / GraphQL       IINA official sources
          │                         │
          └──────────┬──────────────┘
                     ▼
          output/discovery/latest.json
                     │
          scoring + manual overrides
                     ▼
       review queue + audit report
                     │
             human curation
                     ▼
             src/awesome_iina/catalog/catalog.yaml
                     │
             deterministic build
          ┌──────────┼───────────┐
          ▼          ▼           ▼
       README.md  catalog.json  src/awesome_iina/catalog/schemas + static HTML
```

## Boundaries

### Discovery is high recall

Discovery attempts to find any repository that might be IINA-related. False positives are acceptable here. Every candidate retains its repository snapshot, queries, matching file paths, source records, score, and reasons.

### The catalog is high precision

`src/awesome_iina/catalog/catalog.yaml` is manually reviewed. No discovery job writes directly to it. This prevents an abandoned, malicious, duplicated, or merely keyword-matching repository from becoming an implicit recommendation.

### Generated documents are reproducible

The README, machine-readable catalog, and JSON Schema are generated from committed inputs. CI fails when generated files are stale.

## Python package

Nested under `src/awesome_iina/`:

- `catalog/`: reviewed `catalog.yaml`, schemas, exports, the README template, loading, statistics, and deterministic Jinja generation.
- `discovery/`: `discovery.yaml`, overrides, query files, committed snapshots, query execution, merge, scoring, reporting, and snapshot diff.
- `github/`: authenticated `gh api` transport, pacing, retries, REST, GraphQL, and batch enrichment.
- `site/`: branded static catalog, `brand.json`, and the identity kit. Dist still emits `assets/brand/`.
- `media/`: local media-tool detection, execution, normalization, and raw evidence retention.
- `repo/`: root policy, Awesome-list lint, doctor, plugin-manifest inspect, verify, archive, and link audit.
- `cli.py`, `models.py`, `io_utils.py`, `constants.py`: command surface and shared contracts.

## Data contracts

Pydantic v2 validates all committed catalog and discovery models with unknown fields rejected unless an upstream format is intentionally open-ended, such as IINA's plugin manifest. JSON output uses ISO-8601 timestamps and stable sorted keys.

## Failure strategy

Network failures are retried with exponential backoff. Secondary rate limits and low GraphQL budgets pause execution. API caps, incomplete results, cursor inconsistencies, inaccessible repositories, invalid manifests, and unavailable media tools remain visible in outputs rather than being treated as successful absence.

## Presentation and project boundaries

`src/awesome_iina/site/kit/` retains the exact supplied identity archive. `site/brand.py` verifies kit
hashes and SVG policy; `site/` generates the browser catalog under `dist/site/assets/brand/`.
The independent Copier project is in `starter/`; generated consumer plugins do not inherit
the catalog identity.
