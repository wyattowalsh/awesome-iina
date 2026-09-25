# Indexed Media · source and style conventions

## Primary and secondary roles

The primary identity consists of the index-tab/media-card symbol and project name.
Its expressive context uses the preserved cool luminous wave artwork. Every canonical
placement has one primary mark. The old full player illustration may appear as a
supplementary image with explicit live surrounding context, not as a second logo
beside the new one. Unchanged originals are controls, not current symbol candidates.

The selected working symbol is preserved in this maintenance patch; public adoption is not asserted. The offset tab keeps a catalog-like
relationship; it is not expected to explain independence or the entire project scope
without its wordmark and context. User recognition and potential official-product
confusion require human review; simplification alone cannot prove either conclusion.

## Geometry and optical sizes

The 32-unit design has a rounded card, one upper-left offset tab and a play cue.
The 24- and 16-unit designs alter border widths, corner radii, spacing and triangle
geometry. The 16-unit triangle is intentionally straight and simplified to preserve
usable negative space; large-size artwork uses subtly rounded geometry.

Default PNGs at 16 and 24 use their respective optical source. Larger PNGs use
32-unit geometry. `favicon-16@2x.png` is the 16-unit geometry sampled at 32 physical
pixels, not the separate 32-unit drawing. Equivalent 24@2x and 32@2x files are supplied.
This separates CSS size from source density. Browser icon selection remains platform-dependent.

Geometric master: `source/geometry.json`. Inspect rendered outputs after editing;
valid coordinates and hashes are not a visual quality score. The deployed SVG favicon
uses the small geometry; do not substitute it as a giant wordmark or hero symbol.

## Color roles

Values in `source/tokens.json` are proposed v2 values, not asserted original palette
extractions: background `#080F2B`; foreground `#F5FAFF`; secondary text `#D8E6FA`;
cyan `#43D9F5`; blue `#648CFF`; violet `#A392FF`. Light-surface symbols use darker
blue/violet. Monochrome variants use only a single foreground plus actual transparency.

Symbol gradients are optional identity treatments, not functional meaning. White
and ink versions retain the same recognizable geometry. New PNGs are tagged with
an sRGB profile. Untagged old pixels are interpreted as sRGB for the derived wave
texture; no original colorimetry is claimed to have been recovered or converted.

## Typography and layout

The newly chosen typography is Inter Display Bold and Medium, version and hashes in
`provenance/font-inventory.json`. This is not an identification of the earlier image's
font. New title and descriptor layers are live text in editable SVG; deployment SVG
wordmarks/card use outlined glyphs. No font file is embedded or bundled.

The title and two descriptor lines are the social card's only required reading
content. The title is 112 source pixels high in the layout; descriptor em size is
48 source pixels, corresponding to 12 CSS pixels at a 320px-wide stress test.
Those are explicit type sizes, unlike the audit's measured ink spans. The background
under the text is flat and defined. Wave texture starts below the copy.

No tiny category list, badges, unsupported “official” label, or native-app claim is
included. Longer scope information lives in real README or website text.

## Output architecture

- Symbol SVG: geometry only, genuine paths/rectangles and transparency.
- Wordmark SVG: outlined production typography; separately editable live-text source.
- Social SVG: hybrid; retained raster wave/background plus newly created vector typography.
- Social PNG: fixed composition with actual pixel dimensions and explicit sRGB.
- Retained README hero: unchanged original raster export; optional supplementary art.

The intended dark favicon tile is valid as a tile, not falsely labelled a transparent
cutout. True transparent marks are separately named. Manifest icons have `purpose: any`;
no maskable, App Store or native macOS app specification is asserted.

## Maintenance patch: typography and shipping policy

Editable SVG text explicitly sets **CSS** `font-kerning:none`. The former same-named SVG attribute did not enforce the intended policy in the tested Chromium. Production glyphs retain their existing unkerned advances, tracking, shape and coordinates; none of the outlined assets changed. Font hashes remain pinned.

The six existing text elements are checked at their native sizes and reduced 320-CSS-pixel width, at DPR 1 and 2. A 0.25 CSS-pixel character-origin tolerance is a declared regression criterion, not a universal typography standard. The maximum observed error and native-size sub-results are in `qa/type-parity/type-parity.json`. The test does not demand matching antialiasing across unrelated renderers.

The current wordmark is the demo default. The historical hero remains unchanged in the full kit but is excluded from default installation and the smaller production bundle through `source/shipping-selection.json`.
