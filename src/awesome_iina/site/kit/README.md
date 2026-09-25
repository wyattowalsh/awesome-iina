# Awesome IINA · brand kit 2.1.1

**Maintenance release:** `2.1.1` · **Unchanged identity:** `2.0.0-review.1` · **Date:** 16 September 2026

This patch fixes the final audited implementation defects without redesigning the **Indexed Media** artwork. It is a brand kit for an independent community catalog, not a new player, an official IINA product, or a replacement for the repository codebase.

Open **[review/index.html](review/index.html)** for assets and historical controls, or **[integration/demo/index.html](integration/demo/index.html)** for the current wordmark and live-text presentation.

## Final fixes

- **Stable manifest identity:** `source/deployment.json` sets `app_id: /awesome-iina/`. Template, generator, configurator and installer use that explicit ID. Launch-path changes and ordinary kit-version updates do not silently change it.
- **Faithful editable typography:** effective CSS `font-kerning:none` replaces the ineffective SVG attribute. The three editable SVGs now match the existing outlined type within the measured regression tolerance.
- **One default identity:** the demo uses the current wordmark; the historical hero is opt-in, excluded from the default installer and production-only ZIP. A checked allowlist is shared by both.
- **Regression coverage and traceability:** root/project/nested and independent-project identity checks, exact-font glyph-origin proofs, selection tests and a real old-to-new CLI upgrade/undo check. No public platform or user-recognition approval is inferred from these tests.

All **35 PNG/SVG/ICO artwork files** in the full kit remain byte-identical to v2.1.0. The 36th asset is the corrected website manifest. Default delivery selects 35 assets: 34 current artwork files and that manifest. The historical hero remains in the full kit alongside all 37 untouched original-kit files.

## Use the production assets

PNG, ICO and outlined SVG files do not require fonts. The smaller production ZIP contains the current shipping selection, README snippet, site head, selection record and asset-use boundaries. Read [release selection](docs/BRAND-RELEASE.md) before copying optional material from the full kit.

| Use | File |
| --- | --- |
| GitHub social preview | `assets/brand/github-social-preview-1280x640.png` |
| Website social alternative | `assets/brand/open-graph-1200x630.png` |
| Primary wordmarks | `assets/brand/wordmark-dark.svg`, `wordmark-light.svg` |
| Primary symbols | `assets/brand/symbol-dark.svg`, `symbol-light.svg` |
| Monochrome symbols | `assets/brand/symbol-white.svg`, `symbol-ink.svg` |
| Optical favicons | `assets/brand/favicon.ico`, `favicon.svg`, named PNGs |
| Corrected manifest | `assets/brand/site.webmanifest` |

GitHub's repository social preview must still be selected/uploaded in repository settings; copying an image or adding website Open Graph metadata does not set it automatically.

## Preview-first local installation

Python 3.10+ standard library is sufficient for the installer; no fonts, image packages, credentials or network are required. Use a separate existing project with a README.

```bash
python3 scripts/install_brand.py plan \
  --target /absolute/path/to/awesome-iina \
  --output /tmp/awesome-iina-brand-plan.json

# Inspect the JSON before applying.
python3 scripts/install_brand.py apply --plan /tmp/awesome-iina-brand-plan.json
```

Use the exact receipt path printed by `apply` for `check`, `undo` or `recover`. Conflicting files, stale plans, symlinks and later external edits are protected. The installer does not run your build, alter the catalog, commit, push or publish. [Integration and safe upgrade details](integration/README.md).

## Configure a website independently of its identity

```bash
python3 scripts/configure_site.py \
  --site-url https://example.org/relocated-catalog/ \
  --app-id /identities/awesome-iina \
  --social opengraph \
  --output-dir /tmp/awesome-iina-site-metadata
```

Omitting `--app-id` keeps the kit's explicitly configured `/awesome-iina/`, regardless of `--site-url`. Choose another ID for a genuinely separate same-origin application; preserve an established ID when relocating. ID and scope need not be the same path. The configurator writes only the explicit output directory and does not modify source configuration or a deployed app. Edit `source/deployment.json` for persistent kit build defaults.

## Rebuild and verify

Install the recorded Python requirements in a suitable environment. Obtain the exact Inter fonts separately; the builder checks their recorded hashes and never copies font binaries into the kit. Production assets and installer use do not require them.

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

`source/geometry.json`, `tokens.json`, `social-layout.json` and the builder remain the authoritative inputs. Editable SVGs are generated exchange files; arbitrary direct edits are not imported back into those inputs. `--accept-font-change` is an explicit opt-out from exact rebuilding, not a claim that substituted typography is equivalent.

## Verification and remaining decisions

Read [current verification](docs/VALIDATION.md), [audit-to-fix mapping](docs/PATCH-REMEDIATION.json), [release gates](docs/RELEASE-CHECKLIST.md), and [asset-use boundaries](docs/ASSET-USE.md). Prior reports are labelled under `provenance/v2.1.0-verification/`. Current QA does not transfer old test results to this release.

Actual GitHub/website delivery, native browser-tab/manifest behavior, Safari/iOS, owner public adoption and broad reuse permissions remain separate from local technical evidence. The Chromium renderer in this environment blocks loopback navigation; local byte-inlined rendering and separate HTTP probes are explicitly recorded. No font binaries, credentials or transplanted content-credential signatures are distributed. Nothing was pushed or published.
