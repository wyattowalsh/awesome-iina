# Verification: brand kit 2.1.0

**Date:** 16 September 2026 · **Visual identity:** 2.0.0-review.1

This is a continued integration/release pass over the actual v2-fixed ZIP, not another
concept design or a claim of owner approval. All original source and selected artwork
preservation checks were rerun on local bytes.

## Executed results

| Check | Result |
| --- | --- |
| New regression suite | **70 passed; 0 failures/errors/skips** |
| Asset/file checks | **73/73 passed** |
| Browser/HTML/loopback-serving checks | **24/24 passed** |
| Original kit | All 36 original checksum records pass; complete 37-file payload retained |
| Production delivery | 36 files: 35 PNG/SVG/ICO artworks plus the manifest |
| Artwork reproducibility | All 35 artwork hashes unchanged after rebuilding and equal to v2-fixed |
| Font dependency | Actual local Inter files matched the recorded source hashes before outlining |
| Font distribution | No font files included; no fonts are needed for ordinary asset use or installation |
| CLI integration smoke | Plan/apply/check/repeat/undo/check passed in a synthetic temporary project |
| CLI write scope | 39 planned files; original README bytes restored; catalog untouched |
| Conflict safety | Tests cover stale plans, unowned files, edited undo targets, symlink paths, backup tampering and locks |
| Interruption safety | Injected write failure rolls back; tested recovery of interrupted apply and undo |
| Deployment configuration | Root/subpath sites and both 1280×640 / 1200×630 cards tested |
| Package policy | Determinism, manifests, font signatures, credentials/caches and symlink behavior tested |

Counts describe different checks, not a single 167-test coverage claim. No line/branch
coverage percentage, accessibility certificate, brand score or all-platform approval
is inferred from those counts.

## Readable evidence files

- `qa/regression-tests.json`: automated regression totals.
- `qa/validation.json`: asset/file check details, dimensions, alpha, profiles and ICO frames.
- `qa/browser-results.json`: rendering/serving results and exact method limitations.
- `qa/integration-smoke.json`: actual CLI cycle in a temporary, synthetic project.
- `qa/rebuild-check.json`: real rebuild and predecessor artwork-hash comparison.
- `qa/navigation-attempt.json`: the attempted browser loopback-navigation result.
- `qa/environment.json`: local package/runtime versions; no font binaries.
- `qa/visual-review.json`: inspected screenshots and intentional differences.
- `qa/release-checks.json`: current structure, document links and manifest hashes.

Previous v2 reports are kept separately under `provenance/v2-verification/`. They are
history, not silently reused as current execution evidence.

## Browser method

The Browser plugin/skill was not listed; container Playwright used installed Chromium
144.0.7559.96. A fresh ordinary loopback navigation attempt returned
`ERR_BLOCKED_BY_ADMINISTRATOR`. No security policy was disabled. Browser tests used the
existing documented `page.set_content` method with local image bytes inlined as data URLs.

The proofs cover DPR 1/2, native icon sizes, theme-toggle state, desktop and 390px
layout, live essential copy with images disabled, typography bounds, OG fields and
unexpected browser requests. Separate Python HTTP requests verified the loopback asset
routes. They are not browser navigation, actual tab icon selection, GitHub upload or
public hosting tests. Color-vision/grayscale views are labelled simulations.

## Rebuild and transactional boundaries

The asset builder was executed using the recorded local Inter OTFs. Exact artwork
bytes matched both the pre-build files and the prior ZIP. Only deployment metadata
formatting is separate from that 35-artwork preservation statement. Generated token
and layout sources remain the source of truth; no direct editable-SVG round-trip
import is claimed.

Installer plans/apply/undo use no third-party Python modules or network. Tests use
synthetic temporary projects rather than claiming integration into your actual checkout.
File writes are atomic individually; the transaction is journaled and recoverable, not
an OS-wide atomic replacement. Undo/recovery refuse unexplained external edits. Do not
run concurrent editors or remove locks without verifying the installing process ended.
The receipt is not a signed security boundary against an attacker who controls local files.

## Remaining checks, stated explicitly

Not performed: applying to your actual working repository; running its build or code tests;
GitHub commits/pushes/social-preview upload; public website deployment; browser-tab favicon
selection/cache behavior; Safari/iOS devices; calibrated display testing; human recognition;
trademark clearance; full C2PA authentication; owner asset-use policy adoption.

The `just` binary and Ruff were unavailable here. Direct Python equivalents were run;
the optional just recipes are supplied but not claimed as executable-tested in this
environment. No dependency installer or browser download was run.

The source packager creates both full and production-only bundles with internal hashes
and deterministic metadata. Final extracted-archive verification is recorded with the
distributed ZIPs; filesystem checks are distinct from source authorship or approval.

## Reproduce

```bash
python3 scripts/verify_assets.py --root .
python3 scripts/check_release.py
python3 -m pytest -q
python3 scripts/build_assets.py --root . --font-dir /path/to/inter/static/otf
python3 scripts/browser_checks.py --root . --chromium /path/to/chromium
python3 scripts/package_kit.py --root . --output ../brand-kit.zip
python3 scripts/package_kit.py --root . --delivery-only --output ../production-assets.zip
```

The full kit preserves the original artwork and audit evidence. The smaller production
ZIP intentionally omits editable sources, test methods and historical context; it is
for copying assets, not reproducing the audit or rebuilding typography.
