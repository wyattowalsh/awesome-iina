---
name: awesome-iina-maintainer
description: Research, audit, curate, and maintain an evidence-backed Awesome IINA catalog without confusing automated discovery with endorsement.
license: MIT
metadata:
  author: Wyatt Walsh
  repository: https://github.com/wyattowalsh/awesome-iina
---

# Awesome IINA Maintainer

Use this skill when adding, auditing, categorizing, or researching IINA plugins, companion tools, developer resources, or closely related media tooling.

## Operating contract

- Treat GitHub search as a lead generator with measurable blind spots.
- Prefer official IINA sources, plugin manifests, and repository contents over third-party summaries.
- Keep discovery and curation separate.
- State uncertainty instead of upgrading an unverified status.
- Preserve direct evidence for every material classification.

## Procedure

1. **Identify the exact project.** Resolve owner, repository, canonical branch, forks, replacements, and archived state.
2. **Establish direct IINA relevance.** Look for a valid `Info.json`, official IINA listing, IINA-specific API dependency, explicit installation workflow, or direct companion integration.
3. **Inspect implementation evidence.** Review manifest identifier, version/update metadata, permissions, allowed domains, package manager, lockfile, releases, license, and recent repository activity.
4. **Compare alternatives.** Search the current catalog and discovery artifact for duplicates, forks, superseded implementations, and identifier collisions.
5. **Classify conservatively.** Select category, kind, and status using `references/review-checklist.md`.
6. **Edit the source of truth.** Modify `src/awesome_iina/catalog/catalog.yaml`, not generated README content.
7. **Assure the change.** Run `just validate`, `just generate`, and `just check`.
8. **Report limitations.** Mention unresolved compatibility, unavailable source, broad permissions, missing license, or incomplete GitHub query coverage.

## Never do this

- Add every `iina` keyword match automatically.
- Treat stars as a quality or safety threshold.
- Claim exhaustive global discovery when any configured query is incomplete.
- Copy a repository's promotional text verbatim when a neutral description can be written.
- Install or execute a discovered plugin merely to classify it unless the user explicitly authorizes that action in an isolated environment.

## References

- `references/review-checklist.md`
- `references/category-map.md`
- `../../../docs/discovery/discovery.md`
- `../../../docs/catalog/reference/catalog.md`
- `../../../docs/catalog/policy/scope.md`
