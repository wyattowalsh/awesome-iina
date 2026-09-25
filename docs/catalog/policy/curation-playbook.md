# Curation playbook

> [!NOTE]
> Discovery output is evidence, not catalog content. Review an entry before adding it to `src/awesome_iina/catalog/catalog.yaml`.

## Review order

1. Confirm the repository or project is directly useful to IINA users or plugin authors.
2. Open the canonical upstream source and verify ownership, purpose, license, current default branch, and installation path.
3. Inspect `Info.json` for plugin identity, entry points, permissions, allowed domains, update metadata, and declared repository.
4. Check releases and recent issues for compatibility evidence. Absence of recent commits alone is not proof of abandonment.
5. Identify forks, renamed repositories, archived predecessors, and identifier collisions.
6. Write an original neutral description. Do not copy marketing claims or imply a security audit.
7. Choose status, category, tags, install method, and evidence sources.
8. Run the full local assurance suite and inspect the generated README diff.

## Status decisions

- `active`: current compatibility or maintenance has credible evidence.
- `beta`: usable project explicitly presented as prerelease.
- `experimental`: proof of concept, research project, or narrow unverified implementation.
- `unknown`: relevance is clear but maintenance or compatibility has not been confirmed.
- `historical`: superseded project retained for implementation or migration context.
- `archived`: upstream is archived and retained only with an explicit reason.

## Featured decisions

Featured entries should be unusually useful starting points, official references, or foundational tools. Stars are not a sufficient reason. Archived and historical projects cannot be featured.

## Security boundary

Catalog review does not execute plugin code. Reviewers may inspect source, manifests, releases, checksums, and build instructions, but inclusion is never a security certification.
