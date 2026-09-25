# Provenance and preservation

The input `awesome-iina-brand-assets.zip` is identified by SHA-256 in
`provenance/input.json`. Its complete 37-file tree is preserved byte-for-byte in
`archive/original-kit/`, including original asset manifests and checksum files.
Those files describe v1; they are not current-output manifests. Nothing in the original
kit was executed to create this revision.

The complete original README hero export is copied unchanged as
`assets/brand/readme-hero-retained.png`. The new canonical social card uses only a
bounded lower wave crop from the corresponding original composition. Coordinates
and transformation are recorded in `provenance/wave-crop.json`. Its old text and
player illustration are not pasted into the new card.

All compact geometry is newly constructed for this revision. Outlined letterforms
come from the documented local Inter installation; those are project-specific wordmark
paths, not a font file. New typography and palette are chosen, not “recovered” from
raster source. Font binaries and third-party official IINA marks are not bundled.

The original artwork contains credential metadata discussed in the prior audit.
Preservation of source bytes retains that evidence. Full C2PA signature, chain,
revocation and timestamp validation was not performed here. New exports do not copy
old credential signatures into modified images. No authenticated authorship conclusion
is implied by hashes or a provenance note.

One generated exploratory board shown in the conversation did not meet the requested
compact-symbol direction and is not part of the canonical asset lineage. It is not
represented here as an editable master, a tested composition, or selected brand artwork.

## Maintenance patch 2.1.1

Predecessor: `awesome-iina-brand-kit-v2.1.0.zip`, SHA-256 `13594f1061fa43d241b4e230611a97ac500aeb40bb447be1ec4f806dd1d95ec3`. All 35 artwork files and the archived 37-file original kit remain unchanged. The input audit/review records are under `provenance/audit-v2.1.0/`; the prior validation is under `provenance/v2.1.0-verification/`. Current evidence is under `qa/`.

This patch changes generator behavior, live SVG CSS and integration selection—not the source artwork or its original credential chunks. It does not create an authenticated content-credential chain for modified files or grant new artwork/font rights.
