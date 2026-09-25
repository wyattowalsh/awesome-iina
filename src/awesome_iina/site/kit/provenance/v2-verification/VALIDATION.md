# Verification of the implemented revision

**Date:** 16 September 2026 · **Revision:** 2.0.0-review.1  
**Status:** locally verified implementation candidate; no public deployment or human brand approval asserted.

## Executed checks

| Check | Observed result |
| --- | --- |
| Independent file/content checks | **73/73 passed** |
| Browser/HTML/local-serving checks | **24/24 passed** |
| Current production assets | **36**; variants and derivatives, not 36 distinct concepts |
| GitHub social PNG | **1280 × 640; 198,593 bytes** |
| Preserved original kit | All 36 supplied checksum records match; the full 37-file payload is retained |
| Retained README hero | Byte-identical to the original 1800 × 600 export |
| SVG symbol construction | Genuine paths/rectangles, no raster image or visible lettering |
| Transparent PNGs | Real alpha transparency, not a flattened dark rectangle |
| Optical favicon construction | Independent 16/24 geometry; not simple reductions of the 32px PNG |
| ICO container | Seven frames (16/24/32/48/64/128/256), each matching its selected PNG |
| Source typography | Four editable text elements; production counterpart outlines the glyphs |
| Color interpretation | Explicit sRGB profile in new PNGs; retained old hero intentionally unchanged |
| Font packaging | No font binaries included |
| Rebuild reproducibility | **62** source/asset/integration files byte-identical after rebuilding |
| Task-plan structure | Acyclic; README/social work parallel; metadata preparation independent of icon exports |

The known role-text color has **14.924:1** contrast against the intended flat
background under assigned sRGB. This is a intended-color calculation—not an
anti-aliasing sample, a minimum over arbitrary backgrounds, or a whole-site WCAG certificate.
The 48px descriptor em size becomes 12 CSS px at a 320px-wide card; readability is
additionally shown in native-size proofs, not certified for every viewer.

## Browser method and environment limit

Chromium **144.0.7559.96** was available through Playwright. Normal navigation to
localhost returned **ERR_BLOCKED_BY_ADMINISTRATOR** under its managed policy.
No browser policy or security control was disabled to work around that restriction.

The completed rendering tests instead used `page.set_content` with the actual local
image bytes inlined as data URLs. This checked layout, responsive overflow, live text,
source typography bounds, theme controls, native CSS dimensions, and DPR 1/2 rendering
without network navigation. Unexpected browser network requests were blocked; none
occurred during the completed proof run. Images-disabled testing suppressed image
bytes before rendering and verified that essential live text remained visible.

The proposed `/awesome-iina/` serving paths were checked separately using a local
Python HTTP server and `urllib`: every tested response body matched its local asset
bytes. Those are actual loopback HTTP checks, **not a browser navigation/selection
check and not a public website test**. The local demo and production-style head paths
are intentionally distinguished.

Color-vision and grayscale proofs use Chromium's emulated vision-deficiency modes.
These are simulations, not observations from users with those conditions. Native
sheets report CSS size and source dimensions; DPR-2 images have two physical pixels
per CSS pixel and should not be compared as larger icons.

## Evidence files

- `qa/validation.json`: independent content, geometry, metadata and preservation checks.
- `qa/browser-results.json`: executed renderer checks, dimensions and method limits.
- `qa/rebuild-check.json`: repeatable generation over the same source/font/profile inputs.
- `qa/previews/`: rendered desktop/mobile, native icon and images-disabled proofs.
- `qa/comparisons/`: labelled original/new card and compact-control comparisons.
- `ASSET-MANIFEST.json`: current assets, roles, source mappings, sizes and hashes.

The original comparison and tighter-crop control are retained as controls, not additional
shipping identities. The selected indexed mark is a designer choice. A simple crop improves
the old mark's occupied area but does not remove its competing small details; the final
selection has not been validated by an unfamiliar-user recognition study.

## Remaining release checks

**Not performed:** actual GitHub upload/share rendering; real browser-tab favicon
selection and cache behavior; Safari/iOS/touch-icon behavior; hosted URLs and deployment;
calibrated physical-display comparison; user first-impression/matching tests; trademark
clearance; full C2PA signature/trust/revocation validation; owner adoption of public reuse terms.

Files resolve the implementation defects. They do not automatically resolve every
human decision or platform-dependent requirement. No numeric replacement score or
blanket “all P1 closed” approval is manufactured. The appropriate release statement is
**implemented and locally verified, pending owner/platform acceptance**.

## Reproduction

```bash
python scripts/build_assets.py --font-dir /path/to/inter/static/otf
python scripts/verify_assets.py --root .
python scripts/browser_checks.py --root . --chromium /path/to/chromium
python scripts/make_comparisons.py --root .
python scripts/package_kit.py --root . --output ../awesome-iina-brand-kit-v2.zip
```

The browser proof intentionally uses offline byte-inlining on all environments so
its method is explicit and repeatable. The user-facing review page remains an ordinary
HTML document with relative local assets and a working theme control. Open it directly
or use a local server where permitted. No font installation is required to use the
production PNGs, outlined wordmarks or path-based symbols.
