# v2.1.1 release selection

This is a maintenance patch to the **Indexed Media** identity, not another design round. The user authorized the final fixes; no public publication, legal clearance, new asset license or user-recognition study is inferred from that instruction. The visual identity version remains `2.0.0-review.1`.

## Primary and optional files

`source/shipping-selection.json` is the authoritative allowlist used by both the installer and production-only packager. It classifies all 36 asset records exactly once: 35 current primary-delivery files (34 artwork files plus the manifest) and one optional historical hero. No extra file dropped into the directory automatically becomes a shipping asset.

The full kit retains all **35 artwork files** from v2.1.0 byte-for-byte, including the optional old hero. The website manifest is the one non-artwork asset being corrected. The smaller production ZIP excludes the historical hero; it is not an alternate primary logo.

The default demo and README integration use current outlined wordmarks plus live scope and independence text. The gallery can show old artwork as explicitly labelled historical controls. No new hero, icon geometry, colors, gradients or output sizes were created.

## Scope-specific acceptance

- **GitHub artwork:** no redesign required; correct file selection and actual upload remain user operations.
- **Website manifest:** fixed source generation and URL computations; use a deliberate stable `app_id` and verify the actual host. An ID may lie outside the start/scope path.
- **Editable exchange files:** supported CSS policy now matches the existing outlines within the recorded Chromium tolerance. JSON geometry/layout and the builder remain the authoritative editable inputs.
- **Public reuse permissions:** current limits are documented in `ASSET-USE.md`. The kit does not grant broad rights on the owner's behalf.

For machine-readable status and the original audit IDs, see [patch remediation](PATCH-REMEDIATION.json). The older `REMEDIATION.json` is explicitly labelled as design-history findings, whose F01-F08 labels are unrelated to this audit's F01-F06. No score is manufactured or incremented.
