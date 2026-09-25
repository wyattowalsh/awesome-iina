# Awesome IINA — brand asset kit

The four existing generated artworks from this conversation, preserved byte-for-byte,
plus 19 practical raster/ICO exports and a detailed audit prompt. This is an export
and review kit, not a claim that the brand has passed a full identity audit.

## Start here

- **GitHub social preview:** `exports/social/github-social-preview-1280x640.png`.
- **README hero:** `exports/headers/readme-hero-1800x600.png`.
- **Large brand icon:** `exports/icons/brand-icon-1024.png`.
- **Favicons and web icons:** `exports/web/`.
- **Visual review:** open `review/index.html` after extracting the complete ZIP.
- **Audit prompt:** copy `BRAND-AUDIT-PROMPT.md` into a new conversation and attach this ZIP.

The GitHub export is **1280×640 pixels and 794,030 bytes**, below the currently
documented 1 MB limit. It uses the complete 2:1 source artwork without cropping,
stretching, or palette reduction. Source requirements are linked in
`docs/PLATFORM-REFERENCES.md`.

## What is included

| Group | Files and purpose |
| --- | --- |
| `originals/` | Master icon, simplified icon, social artwork, and panoramic hero: four untouched PNGs |
| `exports/icons/` | Master artwork at 1024, 512, 256 and 128 pixels; simplified artwork at 512 and 256 pixels |
| `exports/social/` | GitHub 1280×640 export; optional 1200×630 website card with explicit top/bottom padding |
| `exports/headers/` | 1800×600 and 1200×400 README headers |
| `exports/web/` | 16/24/32/48/64-pixel favicon PNGs, five-size ICO, 180-pixel touch icon, 192/512-pixel manifest icons, and example web manifest |
| `review/` | Offline HTML viewer showing source art, reduced previews and light/dark icon contexts |
| `integration/` | Copyable README and website-head snippets; no automatic deployment |
| `scripts/` | Pillow-based reproducible export and independent integrity-verification scripts |
| Root records | Asset inventory, derivation provenance, per-file hashes, and verification report |

## Original source dimensions

| Original | Dimensions | Pixel format |
| --- | --- | --- |
| `awesome-iina-master-icon.png` | 1254×1254 | RGB PNG |
| `awesome-iina-simplified-icon.png` | 1254×1254 | RGB PNG |
| `awesome-iina-social-artwork.png` | 1774×887 | RGB PNG |
| `awesome-iina-readme-hero.png` | 2172×724 | RGB PNG |

All four originals are opaque and have no embedded ICC profile. They are raster
artwork: banner typography is baked into the pixels. There is **no transparent
knockout, editable text file, vector master, monochrome master, or font file** in
this kit. There is no PNG disguised as an SVG.

The favicon PNGs and ICO are **resized evaluation exports**, not a newly drawn,
pixel-hinted or optically simplified favicon design. The review page deliberately
shows their small-size limits. Technical format validity does not imply that the
visual design is ideal at 16 pixels.

The optional 1200×630 card contains the full social source resized to 1200×600,
with 15 pixels of solid padding above and below, sampled from the source's upper-left
pixel. It is a layout option, not a universal Open Graph size requirement.

## Use the files

For the repository social preview, upload the GitHub export through the repository's
**Settings → Social preview → Edit** controls. Adding an image to the README does
not set this field. No remote changes were performed to prepare this kit.

For a README, copy the chosen hero to an appropriate repository asset folder and
adapt `integration/readme-snippet.md`. Do not copy the entire review kit into the
public repository unless those review materials are intentionally part of the project.

For a website, copy the contents of `exports/web/` into a served asset folder and
adapt `integration/website-head.example.html`. `site.webmanifest` uses relative icon
paths, `purpose: any`, and no maskable claim. These assets alone do not make a site
an installable or offline application. The Open Graph URL placeholder must be replaced
with an absolute public URL after deployment.

## Regenerate and verify

With Python and Pillow installed:

```bash
python scripts/export_assets.py
python scripts/verify_assets.py
```

The exporter checks the four original hashes before doing any work. PNG re-encoding
may produce different bytes under another Pillow/zlib version; regenerate hashes
for intentional changes rather than claiming cross-version byte identity. The
originals themselves remain unchanged.

`SHA256SUMS` inventories the packaged files other than itself. `ASSET-MANIFEST.json`
records the source and operation for every image. `QUALITY-CHECKS.json` records
technical checks, not brand approval or browser-platform certification.

See `docs/PROVENANCE.md` for transformations and missing source capabilities.
