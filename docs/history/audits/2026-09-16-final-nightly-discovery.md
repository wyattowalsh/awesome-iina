# Final release and scheduled discovery audit

Reviewed 2026-09-16. Scope: the branded Awesome IINA catalog/discovery codebase,
complete Copier starter, static catalog, supplied brand kit, and scheduled GitHub
Actions automation. This audit supersedes earlier automation descriptions where they
conflict. No repository write, deployment, plugin installation, or catalog promotion
was performed.

## Final architecture

The repository contains two independent but coordinated products:

1. `src/awesome_iina/` maintains reviewed ecosystem data, discovers public candidates,
   inspects plugin manifests, renders the Awesome list and static catalog, and packages
   deterministic source bundles.
2. `starter/` is a complete Copier project for creating IINA plugins. It has its own
   tests, tooling, references, update policy, and native-runtime validation boundary.

The root stays limited to project entrypoints and metadata. Community-health files live
under `.github/`; generated catalog exports and schemas live under `data/`; the complete
identity kit lives under `src/awesome_iina/site/kit/`; selected deployment assets live under
`assets/brand/`.

## Scheduled discovery design

Discovery is now split by cost and evidence depth:

- `discovery-nightly.yml` runs a quick REST scan every day at 03:17
  `America/New_York`.
- `discovery-deep.yml` runs full REST and GraphQL scans every Sunday at 04:43,
  reconciles them by stable GitHub identity, and reports backend disagreements.
- Both may also be invoked manually.

Each workflow uses only `contents: read`, has explicit concurrency and time limits,
retains checkpoints and source/config evidence, uploads results even when a later gate
fails, and exits nonzero only after evidence preservation. A successful run may update
its Actions cache baseline; an incomplete or failed run cannot replace that baseline.

Neither workflow edits `src/awesome_iina/catalog/catalog.yaml`, commits generated output, opens a pull
request, installs candidate code, or treats a heuristic score as approval. Promotion
remains a human-reviewed catalog change.

## Findings and final remedies

| ID | Priority | Finding | Implemented remedy |
| --- | --- | --- | --- |
| REL-01 | P1 | The former weekly workflow provided no nightly signal or stable previous-run comparison. | Added separate nightly and deep workflows with successful-run baselines, deterministic diffs, and always-uploaded evidence. |
| REL-02 | P1 | REST and GraphQL observations could not be reconciled into one review surface. | Added deterministic multi-run merging with backend provenance, sparse-field preservation, stable-ID deduplication, rename aliases, and manifest-disagreement warnings. |
| REL-03 | P1 | Reclassification by repository name could collapse distinct GitHub identities that share a name. | Reclassify candidates individually; reject ambiguous name-only overrides and preserve each stable identity. |
| REL-04 | P1 | A cached baseline from an incomplete scan could hide future gaps. | Save baselines only when source refresh, context capture, discovery, and reporting all succeed and strict coverage passes. |
| REL-05 | P2 | Prior diffs omitted manifest and triage changes. | Extended snapshot comparison to manifest state/errors, score, category, triage, repository metadata, additions, removals, and renames. |
| REL-06 | P2 | The review queue omitted manually included candidates. | Emit every non-rejected candidate with machine triage status and a separate blank human decision field. |
| REL-07 | P2 | Scheduled source refreshes lacked complete provenance in failure artifacts. | Preserve configuration, pre/post source snapshots, source hashes, and the source diff patch beside discovery output. |
| REL-08 | P2 | Workflow documentation and recipes did not expose the new operating model. | Added the automation runbook, nightly/deep `just` recipes, architecture notes, data-model updates, and release history. |
| REL-09 | P2 | A source archive could omit new automation surfaces while still appearing complete. | Expanded archive completeness policy to require both workflows, merger implementation/tests, and the automation runbook. |
| REL-10 | P3 | Release metadata had drifted across package, citation, starter-integration, and examples. | Aligned active metadata and release examples to 0.5.0 while preserving historical audit records as historical evidence. |

## Verification performed

The release candidate passed the following local gates:

- 200 root tests with combined statement/branch coverage of 88.03%, above the
  configured 85% threshold.
- Repository integrity checks covering source surfaces, the embedded Copier source,
  root and Awesome-list policies, Python/YAML/JSON syntax, generated outputs, source
  snapshots, JSON Schemas, action pins, scheduled-workflow policy, shell syntax, local
  Markdown targets, and text hygiene.
- Brand deployment hash checks and a fresh static catalog build.
- Starter source/offline contract verification across 32 generated shapes.
- Starter tests completed with environment-dependent real-Copier and typechecker cases
  explicitly skipped rather than counted as verified.

The exact delivered archive receives additional CRC, inventory, per-file SHA-256,
clean-extraction, fresh-test, and deterministic-rebuild checks. Those results are
recorded outside the source tree alongside the final archive.

## Current external facts used

- GitHub scheduled workflows support cron plus an IANA timezone, execute from the
  default branch, and may be delayed during high-load periods. Off-hour minute values
  were chosen intentionally.
- Public-repository schedules may be disabled after extended repository inactivity, so
  the maintainer runbook includes this operational caveat.
- The official IINA plugin index remains an upstream observation source, not automatic
  catalog approval.

## Deferred gates

The following remain explicitly unverified in this environment:

- an authenticated full live GitHub crawl and persisted Actions cache lifecycle;
- hosted GitHub Actions execution;
- native IINA installation, plugin loading, playback, and macOS UI behavior;
- real Copier create/update/merge/trust behavior;
- the selected Node/pnpm production dependency build;
- Ruff, ty, actionlint, and native `just` execution when their binaries cannot be
  obtained in the network-isolated runtime;
- a registry-resolved and reviewed `uv.lock` and Python distribution build.

No missing gate is represented as a pass, and no lockfile, Git ancestry, runtime result,
or external-plugin trust decision was fabricated.
