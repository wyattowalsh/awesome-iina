# Releasing

The Git repository and `src/awesome_iina/catalog/catalog.yaml` remain the source of truth. Release ZIPs are deterministic convenience artifacts and must contain the complete source tree, including `src/`, `tests/`, workflows, schemas, and catalog data.

## Preconditions

```bash
just bootstrap
just generate
just check
just links
```

Before tagging:

1. inspect generated README, JSON catalog, schemas, source snapshots, and discovery coverage gaps;
2. confirm the root policy and Awesome-list policy pass;
3. confirm the working tree contains no credentials, local media reports, caches, or raw private discovery data;
4. review external-link warnings manually, treating authentication, blocking, and rate limits as indeterminate rather than automatically broken;
5. update [`CHANGELOG.md`](../../history/CHANGELOG.md);
6. build the archive twice and require byte-identical output;
7. extract the archive into a clean directory and rerun deterministic checks.

## Versioning

The Python tooling follows semantic versioning. Catalog-only additions may ship as patch releases unless they change a schema, remove a compatibility guarantee, or alter downstream data semantics. Routine discovery evidence does not itself require a release.

## Tag and archive

```bash
git tag -s v0.5.0 -m "awesome-iina v0.5.0"
git push origin v0.5.0
```

The release workflow must:

- require a reviewed committed `uv.lock`; the workflow deliberately refuses release publication without it;
- run verification before packaging;
- package only selected source material;
- generate a SHA-256 checksum and per-file manifest;
- test ZIP integrity;
- upload the ZIP and checksum without modifying catalog decisions.

Discovery automation is never permission to auto-promote candidates into the curated list.

## Post-release

- verify the published archive and checksum;
- inspect the archive listing for `src/`, `tests/`, `.github/workflows/`, `src/awesome_iina/catalog/catalog.yaml`, and `src/awesome_iina/catalog/schemas/`;
- confirm badges and local links resolve;
- open the next changelog section;
- review the next scheduled discovery run for newly introduced coverage gaps.

The source archive delivered during development is not a tagged release. A successful
local archive check does not substitute for the unexecuted formatter, type checker,
selected starter toolchain, or hosted release workflow gates.
