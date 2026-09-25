<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../src/awesome_iina/site/kit/assets/brand/wordmark-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="../src/awesome_iina/site/kit/assets/brand/wordmark-light.svg">
  <img alt="Awesome IINA" src="../src/awesome_iina/site/kit/assets/brand/wordmark-light.svg" width="440" height="71">
</picture>

# Documentation

Start here. The generated catalog in [`catalog.json`](../src/awesome_iina/catalog/exports/catalog.json) is for applications. `src/awesome_iina/catalog/catalog.yaml` is the reviewed source of truth. This page is the contributor map.

> [!NOTE]
> This tree is the contributor handbook. The public catalog website is built from [`src/awesome_iina/site/`](../src/awesome_iina/site/README.md) into `dist/site/`. GitHub Pages deploys that site, not HTML from `docs/`.

## Repository layout

Root holds entry points only: `README.md`, `LICENSE`, `justfile`, `pyproject.toml`, `uv.lock`, `AGENTS.md`, `CITATION.cff`, and `copier.yml` (`_subdirectory` only). Named domains:

| Folder | Open this when you need… |
| --- | --- |
| [`src/awesome_iina/`](../src/awesome_iina/) | Nested catalog, discovery, GitHub, site, media, and repo packages. Catalog YAML, discovery config, snapshots, schemas, and the identity kit live beside those packages. |
| [`docs/catalog/`](catalog/) | Inclusion, curation, plugin authoring |
| [`docs/discovery/`](discovery/) | GitHub search pipeline and coverage |
| [`docs/maintain/`](maintain/) | Runbooks, architecture, identity, examples |
| [`docs/history/`](history/) | ADRs, audits, changelog, roadmap, notice |
| [`tests/`](../tests/README.md) | Tests grouped to match those domains |
| [`starter/`](../starter/README.md) | Nested Copier plugin project (do not mix with this package) |
| [`skills/`](../skills/README.md) | Maintainer skill plus symlinks to the portable plugin-dev skills |
| [`.github/`](../.github/CONTRIBUTING.md) | Contributing, security, issue templates |

Generated and local junk belongs in gitignored `output/` (and `dist/`), never beside source. JSON Schemas are generated under `src/awesome_iina/catalog/schemas/`. `SOURCE-MANIFEST.json` is written *inside* source ZIPs, not kept as a root entry point. The static catalog templates live in [`src/awesome_iina/site/`](../src/awesome_iina/site/README.md); deploy only `dist/site/`.

## Catalog

- [`catalog/policy/scope.md`](catalog/policy/scope.md) — what belongs in the catalog
- [`catalog/reference/catalog.md`](catalog/reference/catalog.md) — how to edit `src/awesome_iina/catalog/catalog.yaml`
- [`catalog/policy/curation-playbook.md`](catalog/policy/curation-playbook.md) — evidence and review
- [`catalog/reference/data-models.md`](catalog/reference/data-models.md) — field contracts
- [`catalog/policy/ecosystem-taxonomy.md`](catalog/policy/ecosystem-taxonomy.md)
- [`catalog/policy/awesome-list-policy.md`](catalog/policy/awesome-list-policy.md)
- [`catalog/authoring/iina-api-map.md`](catalog/authoring/iina-api-map.md)
- [`catalog/authoring/plugin-development.md`](catalog/authoring/plugin-development.md)
- [`catalog/authoring/plugin-starter.md`](catalog/authoring/plugin-starter.md)

## Discovery

- [`discovery/discovery.md`](discovery/discovery.md) — GitHub collection pipeline
- [`discovery/discovery-automation.md`](discovery/discovery-automation.md) — nightly and weekly Actions
- [`discovery/discovery-coverage.md`](discovery/discovery-coverage.md) — measured coverage, not global exhaustiveness
- [`discovery/reporting.md`](discovery/reporting.md) — review queues and audit reports

## Maintenance

- [`maintain/runbooks/maintenance.md`](maintain/runbooks/maintenance.md) — maintainer runbook
- [`maintain/runbooks/releasing.md`](maintain/runbooks/releasing.md)
- [`maintain/architecture.md`](maintain/architecture.md)
- [`maintain/runbooks/agent-workflows.md`](maintain/runbooks/agent-workflows.md)
- [`maintain/runbooks/media-inspection.md`](maintain/runbooks/media-inspection.md)
- [`maintain/brand.md`](maintain/brand.md) — identity integration
- [`maintain/design.md`](maintain/design.md) — visual system, token names, and catalog vs starter identity split
- [`maintain/template-layout.md`](maintain/template-layout.md)
- [`maintain/examples/`](maintain/examples/) — committed media-report fixture

## History

- [`history/decisions/`](history/decisions/) — architecture decision records
- [`history/audits/`](history/audits/) — dated reviews
- [`history/CHANGELOG.md`](history/CHANGELOG.md) · [`history/ROADMAP.md`](history/ROADMAP.md) · [`history/NOTICE.md`](history/NOTICE.md)

[Brand integration](maintain/brand.md) · [Design system](maintain/design.md) · [Browser catalog](../src/awesome_iina/site/README.md)

[Final release and scheduled discovery audit](history/audits/2026-09-16-final-nightly-discovery.md) · [Brand integration audit](history/audits/2026-09-16-final-brand-integration.md)
