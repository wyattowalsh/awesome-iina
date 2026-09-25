# Integration verification ledger

Date: 2026-09-16. Catalog tooling 0.3.0; embedded Copier starter 0.2.0a2.
**Complete source candidate. Not a real-Copier, installed-toolchain, or native release certificate.**

## Executed source and fixture checks

| Check | Result |
| --- | --- |
| Catalog/root Python suite | 120 passed, 0 failed, 0 skipped |
| Catalog combined statement/branch coverage | 87.30% |
| Embedded starter Python suite | 100 passed, 42 skipped Copier cases |
| Offline fixture shape checks | 32 combinations |
| Executable generated fixture variants | 8: four presets times two preferences settings |
| Generated commands | 32 passed: types, boundaries, manifests, Node suites |
| Node test executions | 572 passed, 0 failed, 0 skipped |
| Negative TypeScript checks | 11 executed cases in the starter suite |
| Mandatory Copier gate | Correctly refused missing Copier, exit 2 |
| Mandatory JUnit no-skip gate | Correctly refused 42 skipped required cases, exit 1 |

Coverage includes the existing configured Python package scope, not the template scripts or
all CLI paths. Repeated Node contracts across variants are test executions, not unique features.

Actual environment: Linux, Python 3.13.5, Node v22.16.0, TypeScript CLI and
compiler API 5.8.3, pytest 9.0.2, uv 0.10.0.
`IINA_AUDIT_TSC` and `IINA_AUDIT_TS_API` explicitly selected those existing audit tools.
They are not the declared Node 24 / TypeScript 7 / compiler API 6 production toolchain.

Logs and machine results: [starter ledger](../../../starter/VALIDATION.json),
[current starter evidence](../../../starter/evidence/current/),
[this ledger as JSON](2026-09-16-integration-verification.json).

## Required follow-through

The new real-Copier tests cover 32 fresh copies, four standalone updates, dirty-tree
rejection, four integrated-root updates, and a conflicting shared file. None was run
here because Copier could not be installed. Actual dependency-backed CI must exercise
both the template and the integrated root wrapper. These are pending gates, not successes.

Production esbuild, Starlight/Astro, formatters, Ruff/ty, distribution builds, native just,
workflow analyzers and hosted CI were not run. Native IINA GUI/link/reload/pack/updater
acceptance and authenticated full GitHub crawling were not run. No remote writes occurred.

## Archive verification

Full-source packaging guards require both catalog and Copier source surfaces, including
implementation modules, tests, workflow, manifest, template runtime, build scripts and
editor settings. External delivery results contain CRC, every-member SHA-256 comparison,
clean-extraction test results and deterministic rebuild comparisons for the exact ZIPs.
An archive checksum is integrity evidence, not a claim that real Copier or IINA ran.
