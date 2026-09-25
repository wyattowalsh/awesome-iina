# JSON Schemas

These files are generated from the Pydantic models and committed for downstream
structural validation:

- `catalog.schema.json`: curated `src/awesome_iina/catalog/catalog.yaml` model;
- `discovery-config.schema.json`: `src/awesome_iina/discovery/discovery.yaml` model;
- `discovery-run.schema.json`: normalized discovery output;
- `media-report.schema.json`: normalized media-inspection output;
- `overrides.schema.json`: `src/awesome_iina/discovery/overrides.yaml` model;
- `source-snapshot.schema.json`: `src/awesome_iina/discovery/snapshots/*.json` snapshot envelope.

JSON Schema is structural. Uniqueness of catalog slugs, repositories, and plugin
identifiers remains a Pydantic validator and catalog-policy concern; published
JSON Schema does not encode those rules.

Regenerate all schemas with:

```bash
just schema
```

Do not hand-edit generated schema files.
