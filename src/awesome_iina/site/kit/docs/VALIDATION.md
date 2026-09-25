# v2.1.1 verification — final maintenance fixes

**Release:** 2.1.1 · **Unchanged visual identity:** 2.0.0-review.1 · **Date:** 16 September 2026

The manifest identity, editable SVG kerning and default demo/shipping selection are corrected. All **35 artwork files** from v2.1.0 remain byte-identical. This report describes local technical verification, not public publication, user recognition or legal approval.

## Results actually executed

| Check | Result |
| --- | --- |
| Predecessor baseline tests | 70 passed before patching |
| Current regression suite | **114 passed; 0 failures, 0 errors, 0 skipped** |
| Asset/file/content checks | **82/82 passed** |
| Renderer and local serving checks | **35/35 passed**, including 7 separate Python HTTP probes |
| Exact-font editable/outlined type checks | **38/38 passed** |
| Type proof scope | Six text elements, three SVGs, native and 320-CSS-pixel widths, DPR 1 and 2; 24 text observations |
| Largest native-size glyph-origin difference | **0.014355 CSS px** |
| Largest difference including reduced widths | **0.108676 CSS px**, within the declared 0.25 px regression tolerance |
| Full real asset rebuild | **68/68 monitored files byte-identical** after rebuilding |
| Artwork preservation | **35/35** predecessor artwork files unchanged, including the optional historical hero |
| Original-kit preservation | **37/37** original files unchanged |
| Actual installer CLI upgrade/undo | v2.1.0 install → v2.1.1 plan/apply/check/repeat → undo → original-kit undo passed in a temporary project |
| Catalog/README safety | Catalog unchanged; original README content, BOM/CRLF and rollback bytes preserved |

These numbers count specific automated assertions, not independent experts or concept variations. Exact anti-aliasing equality between live browser text and outlined SVG is not required. The parity test checks character origins with exact hash-verified Inter Display Bold/Medium fonts, and computes the effective CSS kerning value. It does not rewrite or re-outline production typography.

## Manifest behavior

The source configuration owns a stable `app_id` (`/awesome-iina/` by default). The template uses `{{APP_ID}}`; the generator, configurator and installer resolve that explicit policy rather than assigning `../../` to identity. `start_url`, `scope` and icon paths keep their appropriate manifest-relative behavior.

Tests cover root, project, nested and separate same-origin projects, explicit IDs outside launch scope, relocation, ordinary version changes, invalid identities and CLI propagation. A separate Chromium JavaScript URL-constructor matrix checks the generated fixtures. **These are URL-semantics checks, not native installed-manifest processing.** An existing installed root-ID population would need a deliberate migration decision; none is claimed here.

## Current demo and shipping selection

The responsive demo now uses the existing light/dark outlined wordmarks and live independent-catalog copy. At 390 and 1200 pixels, the real theme button changes the visible wordmark and accessible pressed state; a second click restores it. Image-suppressed rendering retains essential live meaning. The historical hero is absent from the primary demo.

An explicit shared allowlist selects 35 default delivery files (34 artwork files and the manifest). The full kit retains the optional historical hero; it is omitted from the production-only ZIP and normal install plan. An explicit `--include-legacy-hero` allows a deliberate copy without inserting it into the README. Upgrading a prior installation does not silently delete its now-unselected historical file.

## Environment and actual rendering method

Python **3.13.5** on **Linux x86_64**; Chromium **144.0.7559.96** via Playwright. The Browser plugin was not available, so regular Playwright was used. Package versions are in `qa/environment.json`. No dependencies or fonts were downloaded for this patch; no font files are distributed.

An ordinary loopback navigation was attempted and returned **ERR_BLOCKED_BY_ADMINISTRATOR**. No browser policy was changed or bypassed. Renderer tests used `page.set_content` with exact local image bytes; the separate typography runner loaded verified font data only in browser memory. Font-containing HTML was never serialized into the package. HTTP route checks used Python's loopback client separately. This separation is not a hosted-page, browser-tab or native manifest approval claim.

The previous reports are preserved under `provenance/v2.1.0-verification/`. Current reused historical artwork comparison images remain valid byte-level controls, not evidence of a new user study. Current renderer screenshots and result files were regenerated.

## Evidence and reproduction

- [Summary](../qa/patch-summary.json), [regressions](../qa/regression-tests.json), [asset checks](../qa/validation.json).
- [Renderer/HTTP checks](../qa/browser-results.json), [navigation limitation](../qa/navigation-attempt.json).
- [Typography positions and exact font hashes](../qa/type-parity/type-parity.json).
- [Rebuild and preservation](../qa/rebuild-check.json), [old-to-new installer smoke test](../qa/upgrade-smoke.json).
- [Audit finding closure and remaining external decisions](PATCH-REMEDIATION.json).

```bash
python3 scripts/build_assets.py --root . --font-dir /path/to/inter/static/otf
python3 scripts/verify_assets.py --root .
python3 scripts/check_release.py
python3 -m pytest -q
python3 scripts/browser_checks.py --root . --chromium /path/to/chromium
python3 scripts/verify_type_parity.py --root . \
  --font-dir /path/to/inter/static/otf --chromium /path/to/chromium
python3 scripts/package_kit.py --root . --output ../awesome-iina-brand-kit-v2.1.1.zip
python3 scripts/package_kit.py --root . --delivery-only --output ../awesome-iina-production-assets-v2.1.1.zip
```

## Remaining limits, not missing code fixes

No change was applied to the user's checkout or public website, and nothing was pushed or uploaded to GitHub. Actual GitHub/README/social rendering, native manifest processing/installation, favicon selection and cache behavior, Safari/iOS, other browsers/devices, calibrated displays and recognition research remain separate acceptance work. No new broad public asset license, trademark clearance or content-credential authentication was adopted.

Ruff and the `just` executable were not available. Direct Python equivalents and syntax/regression checks were run; those missing executable checks are not claimed as passed. Neither the old audit score nor a manufactured new score is used as a completion metric.

**Disposition:** file-level and locally testable fixes complete; preserve current artwork and perform only the owner/platform acceptance relevant to the actual publication.
