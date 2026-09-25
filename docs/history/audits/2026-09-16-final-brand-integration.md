# Final source and brand integration audit

Reviewed 2026-09-16. Scope: recovered v6 source and supplied brand kit 2.1.1.
This is an authorized implementation pass. It is not a claim that semantic fixes are
behavior-preserving simplifications. No GitHub writes, deployment or plugin installation
were performed. See the [source lineage](../../../src/awesome_iina/repo/source-lineage.json) and
[brand policy](../../maintain/brand.md).

## Source reconstruction

The actual base is `wyattowalsh-awesome-iina-v6-copier-full-codebase.zip`, SHA-256
`36752563cc27b994e28edd3fccfa7c13f0536eee08cfd10e2ca822377843d70d`.
Later advertised v7/audited archives were not recoverable. None of their advertised
features or successful tests were inherited as evidence. The two real projects were
preserved: the catalog/discovery package and complete Copier starter. Structural moves
are recorded in the lineage map; the assurance archive supplies a per-file migration ledger.

The supplied identity archive SHA-256 is
`587900c6462a8f8c0603ba3d574298f06b49d9278f9843ec54366de6c8156fac`.
All 245 kit files are retained byte-for-byte under `src/awesome_iina/site/kit/`. The chosen 35 primary
assets are deployed with generated palette CSS; two wordmark copies serve standalone
starter documentation. No font binaries are distributed and no bundled kit script was run.
Historical kit and starter success logs remain historical, not new validation results.

## Findings and implemented remedies

| ID | Priority | Concrete issue and remedy | Implementation and regression evidence |
| --- | --- | --- | --- |
| FIN-01 | P1 | Partial enrichment defaulted missing fields and could erase observations. Merge only observed fields; distinguish explicit nulls and retain stable IDs/rename aliases. | `github.py`, `discovery.py`; partial-observation and rename regressions |
| FIN-02 | P1 | Duplicate pagination or capped results could obscure missing coverage. Count unique public identities/paths; detect no progress, cursor reuse, count drift and partial failure; preserve evidence and enforce non-exhaustive output. | `discovery.py`, `models.py`; repeated-page, private-result, cap and failure regressions |
| FIN-03 | P1 | Stalled subprocesses or repeated API waits lacked a complete bound. Add request timeouts, attempt and cumulative-wait budgets, pacing and deferred low-rate waits. | `github.py`; injected timeout, request/wait budget and deferred-wait tests |
| FIN-04 | P1 | A packaging failure could destroy the previous artifact. Build to a unique temporary file, verify the full inventory and CRC before replacement, and clean temporary files on failure. | both archive builders; injected verification failures and deterministic archive tests |
| FIN-05 | P1 | A score or repository label could imply endorsement, maintenance or installation. Keep heuristic decisions as review; require explicit overrides for acceptance; default missing maintenance to unknown and missing install evidence to upstream instructions. | `scoring.py`, `models.py`; acceptance/install/status regressions |
| FIN-06 | P2 | Resume needed an explicit correctness boundary. Add schema-versioned query checkpoints bound to effective config, dates, mode and source hashes; reject mismatches and private saved entries. | `discovery.py`; matching/mismatching and incomplete-query resume tests |
| FIN-07 | P2 | Scheduled failures could hide evidence, and curation rights were unnecessary. Use read-only permissions, explicit strict discovery output and always-run evidence upload, followed by a failure signal. | `.github/workflows/discovery.yml`; workflow-contract regression |
| FIN-08 | P2 | Brand integration could drift or accidentally rebrand consumer projects. Keep an immutable kit, hash-check selected copies, derive CSS tokens, and limit branding to catalog and maintainer surfaces. | `brand.py`, `site.py`; hash, path, SVG, output-confinement and escaping regressions |
| FIN-09 | P2 | The global editor exclusion could omit actual template source, and local secret variants could leak. Preserve template editor files; reject symlinks and common local secrets before source collection. Restore original executable modes after extraction. | archive builders; completeness, `.env.*`, symlink and exact-inventory tests |
| FIN-10 | P2 | Frozen source-audit evidence was coupled to later live snapshot updates. Validate frozen raw bytes against their own Git blob/SHA record, independently of the active snapshot. | provenance regression and `docs/discovery-coverage.md` |
| FIN-11 | P2 | Documentation claimed nonexistent SQLite, owner enumeration, fork traversal or code-size partitions. Replace claims with the exact implemented search and checkpoint boundaries. | `docs/discovery.md`, `docs/discovery-coverage.md`, maintainer runbook |
| FIN-12 | P3 | Source, citation and release documentation versions drifted. Align to package 0.4.0 and make the real lockfile a required hosted-release gate. | `CITATION.cff`, package-version tests, release workflow |

The HTTP source reader also now bounds configured URL content to 1,000,000 bytes, and
DNS failures in link auditing are indeterminate warnings rather than definitive dead links.
Those helpers are not a complete network sandbox: public-address checks followed by a
library connection do not prevent every DNS-rebinding scenario. Run link audits with
restricted egress, and review maintainer-configured source URLs. Candidate code is never
executed as part of discovery.

## Brand and browser implementation

The Indexed Media symbol, outlined light/dark wordmarks, palette, social cards, favicons,
application icons and manifest are used in the generated README, documentation entrances,
standalone starter documentation, and the new static catalog. The optional historical
README hero is retained but not substituted for the kit's primary assets. User-facing
identity consistently states that Awesome IINA is not affiliated with the IINA project.
The code license does not grant blanket artwork or trademark rights.

The browser catalog is generated only from curated data. Its 75 entries, including 60
native-plugin records, remain readable without JavaScript. JavaScript adds search,
category/type filters, live result feedback, reset/focus handling and theme selection.
HTML is escaped; untrusted project URL schemes and credentials are rejected. The site
contains no analytics, remote fonts, third-party frontend dependencies or installer.
Intended canonical/manifest configuration is not proof of deployment. The GitHub social
preview asset is provided but no repository setting was changed.

Visual inspection compared source branding with rendered header/hero marks, light/dark
palette, type hierarchy, input labels/focus, list spacing, independent-project copy, and
mobile overflow. The host's Chromium policy blocks HTTP/HTTPS/file navigation. The
successful harness uses in-memory HTML, the exact CSS and production JavaScript, inlined
source images and a history stub. It does not validate network delivery, CSP enforcement,
real URL/storage persistence, or hosted behavior. Screenshots and harness are in assurance.

## Fresh validation results

- Root Python tests: **186 passed**, no failures or skips; combined statement/branch
  coverage **87.60%** under the existing scope (CLI entry modules are excluded).
- Starter Python tests: **100 passed, 42 skipped**; missing real Copier is the skip cause.
- Offline rendered shapes: **32**. Generated project checks: **32 commands passed** across
  four presets and both preferences settings. These include **572 successful Node test
  executions**, with shared contracts repeated across eight variants.
- Fixture checks use **Node 22.16.0 and TypeScript 5.8.3 audit substitutes**, not a certification
  of the selected production toolchain.
- Root/README policy, source surfaces, JSON/YAML/Python syntax, catalog generation, all
  26 upstream-index entries, source hashes, schemas, local Markdown targets and pinned
  workflow-reference structure passed repository verification.
- **31 workflow shell steps** passed `bash -n`; this is not actionlint or hosted execution.
- A fresh 64x64 synthetic MKV was inspected with real ffprobe and its SHA-256 was unchanged.
- Brand hashes and production selection passed; no font binaries exist in the source ZIP.
- The final delivered ZIP receives separate inventory, clean-extraction and deterministic
  rebuild checks. Their exact final results accompany the ZIP, not an inferred release claim.

## Research and epistemic boundaries

The official GitHub plugin index was freshly fetched and its raw bytes matched Git blob
`18a16a6712e8600401f22e67e8c94bf67a517b57` (26 entries). IINA Store's own source identifies it
as a native plugin. Other retained catalog entries are not newly claimed to have received
an exhaustive fresh runtime/security review. Official indexing is not official authorship.

Primary documentation was reviewed for the 17 API module families, host CLI packaging and
linking, stable/development API distinctions, and GitHub search limits. The authored
[API map](../../catalog/authoring/iina-api-map.md) separates reference material, generated source, native packages,
and optional installed dependencies.

Sources checked 2026-09-16:

- [Official IINA API index](https://docs.iina.io/index.html)
- [IINA plugin creation and packaging](https://docs.iina.io/pages/creating-plugins.html)
- [Official plugin index](https://github.com/iina/iina/blob/develop/plugins.json)
- [IINA Store source](https://github.com/Kuameh/iina-store)
- [GitHub REST search limits](https://docs.github.com/en/rest/search/search)
- [GitHub API versions](https://docs.github.com/en/rest/about-the-rest-api/api-versions)
- [GitHub social-preview settings](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview)

## Deferred gates and preserved boundaries

No full authenticated live crawler, real Copier merge/trust run, selected-toolchain
installed-dependency build, native IINA playback/installation or hosted workflow was run.
Ruff, ty, actionlint and native just were unavailable. No resolved dependency lockfile,
Git history, external plugin source, font binary or release certificate was invented.
The hosted release workflow deliberately requires a reviewed real lockfile before publishing.

Keep the explicit main/global/UI/build separation, strict contracts, consumer-owned Copier
seeds, dual classification passes, separate repository/code query loops, explicit sharding
policy and individual media adapters. Reducing these to a generic abstraction would obscure
meaningful differences, not improve maintainability. Fresh native and selected-toolchain
checks remain release requirements rather than documentation claims.
