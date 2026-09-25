# Review of the new Awesome IINA brand audit

**Reviewed:** 16 September 2026  
**Actual target:** Awesome IINA brand kit 2.1.0, identity `2.0.0-review.1`, direction **Indexed Media**  
**Decision:** Accept the audit's main findings. Keep the current production artwork; make a narrow corrective release rather than another redesign.

## What this audit changes

The audit explicitly clears the current GitHub social PNG and outlined wordmarks for the scoped repository presentation, subject to owner selection and correct placement. It does not approve a live deployment. It retains the compact geometry, optical icon drawings, monochrome variants and current card hierarchy. No P0 and no necessary missing production design were established. [A, sections A and D]

That is the consequential result—not treating 76.5/100 as a completion percentage. I checked the arithmetic and obtained 76.5 points on 100 assessed weight. I did not compute a cross-audit improvement score: roles, scopes and reviewer judgments must be comparable before making that claim.

The new audit is bound to the exact 2.1.0 ZIP most recently delivered in this conversation. The nested source is byte-identical to that ZIP, and the citable standalone audit is byte-identical to `audit/AUDIT.md` in the supplied wrapper. This is not criticism of an obsolete visual variant with a similar filename. See `evidence/source-binding.json`.

## Findings I independently confirmed

### F01: real website-manifest configuration defect, not an artwork failure

Both the template and emitted manifest set `id`, `start_url` and `scope` to `../../`. The generator reads that template unchanged. At the intended manifest location beneath `/awesome-iina/assets/brand/`, start and scope resolve to `/awesome-iina/`. The `id` does not: its documented base is the origin of the resolved start URL, so it resolves to the origin root. [A, F01; W1; W2]

I independently reproduced this resolution for the supplied configuration and checked a root site, a nested catalog, and a second project on the same host. The root deployment happens to match, while distinct subdirectory projects receive the same root identifier. These are standards-based URL computations, **not a browser installation or processed-manifest test**.

**Corrective scope:** configure a stable, same-origin application identity in the authoritative source/generator. `/awesome-iina/` is a reasonable explicit initial identity for this intended project. Do not merely edit the emitted JSON, and do not blindly replace every `../../`: start and scope currently resolve correctly for the documented layout. No symbol, palette, PNG, ICO or outlined wordmark needs to change.

**Important qualification:** an app ID need not equal its launch URL or navigation scope. It identifies the application, not its current location. Once that public identity exists, do not change it automatically when moving the site or bumping the kit version. A migration from an already installed root-identified app would need separate consideration; no such installed population is evidenced here. [W1]

If this release is only repository branding, the manifest can be omitted. F01 is not a blocker to uploading a static GitHub preview.

### F02: real editable-source/export spacing mismatch

The live SVG text uses an attribute named `font-kerning="none"`. In the tested Chromium it does not enforce the intended CSS property: the computed value is `auto`. The outlined export uses explicitly positioned, unkerned glyph advances. [A, F02; W3]

I reproduced this with Chromium **144.0.7559.96** and local Inter Display fonts matching both recorded SHA-256 values. No fallback font was used in the checked wordmark. The measured wordmark advance was **280.90625 px** for the unchanged editable source and **284.421875 px** after applying CSS `font-kerning:none` in memory—exactly the audit's values.

The independent follow-through covered **both editable wordmarks and all four social text elements**. Comparing visible glyph origins to the production SVG's path translations, the largest residual error with CSS `none` was **0.014355 CSS px** at native size. Every checked line was inside the audit's proposed 0.25 px tolerance. That supports the narrow repair; it does not assert identical antialiasing across different renderers. See `evidence/type-parity.json`.

**Corrective scope:** fix the editable branch in `Type.text`, regenerate the three exchange SVGs, and add a typography-parity regression test. Preserve the existing outlined outputs. The in-memory diagnostic proved the cause but was not saved back as a corrected brand asset.

These two bugs were missed by the earlier kit's verification. Hash consistency and visually plausible output are not semantic manifest tests or proof of editable/outlined typography parity. The next tests should cover those exact behaviors rather than add unrelated export counts.

### F03: align the default showcase, not another visual redesign

The current README prefix already uses the new outlined wordmark and live independent-catalog wording. The local demo, however, still prominently shows `readme-hero-retained.png`, which carries the old player/puzzle/sparkle identity. Its label as supplementary does not make the primary example automatically communicate the new selection. [A, F03; supplied `REPO-README-PREFIX.md` and `integration/demo/index.html`]

Use the current wordmark and live copy as the unmistakable default in the demo and production-selection documentation. Keep the historical image unchanged as optional illustration or reference. There is no reason to commission a replacement hero to resolve this inconsistency in examples.

### F04–F06: preserve their conditions; do not turn them into an endless redesign gate

The uncaptioned symbol still evokes playback. That does not establish mistaken official affiliation, user confusion, or a need to invent a more literal catalog metaphor. The current contextual copy is part of the brand. Formative recognition work is useful before deciding on a broader redesign, not proof that the present graphics are unfit. [A, F04]

Actual GitHub rendering, browser-tab selection, Safari/iOS behavior and live manifest processing remain separate platform tests. Current local proofs must not be relabelled as those tests. Broad artwork-reuse permissions remain an owner decision; passing technical checks does not adopt a license on the owner's behalf. These are bounded evidence and governance issues, not missing image files. [A, F05–F06]

## Independent checks and limits

| Check | Result |
| --- | --- |
| New wrapper source binding | Nested 2.1.0 ZIP matches the last delivered kit exactly |
| Outer manifests/checksums | 41/41 payload records and 42/42 checksum records match |
| Audit checksum records | 37/37 match |
| Kit manifests/checksums | 184/184 payload records, 185/185 checksums and 36/36 asset records match |
| Historical checksums | 36/36 match |
| Image/container inspection | 66 PNGs decoded; 23 SVGs scanned; both ICO files present; all seven current ICO frames equal their named PNGs |
| Independent production rendering | Social SVG and dark/light symbol SVGs produce their corresponding PNG pixels exactly |
| Optional Open Graph adaptation | Uniform resize and 15-pixel top/bottom padding reproduced exactly |
| Text contrast | Four selected intended-color calculations reproduce the audit's values |
| Typography | Exact fonts; six live text elements checked across three source SVGs; CSS-only diagnostic resolves measured origin drift |
| Task graph | Eight tasks, valid references and no cycles |

The social PNG is **1280 × 640, 198,593 bytes, RGB with an embedded profile**. GitHub's current guidance recommends those dimensions for best display and PNG/JPG/GIF under 1 MB. File suitability and actual hosted display remain separate. [W4]

I visually reviewed the audit's native-size icon and social proofs and the independently produced typography diagnostic. I did not rerun its entire contextual screenshot matrix. The audit's reduced social card is visibly much clearer than its included historical control; this is reviewer observation, not a user-study recognition result.

No original file, bundled script or installer was executed or modified. Independent scripts read the assets and create only review evidence. SVGs were scanned before rendering, no unexpected browser requests occurred, page JavaScript was disabled, and no fonts were redistributed. Chromium loaded an independently authored in-memory document; this is not a workaround claiming hosted-page or browser-tab validation. Full build/installer execution, hosted GitHub tests, native processed manifests, other browsers/devices, human recognition and legal/provenance authentication are unperformed.

## Recommended next release

Treat this as a **proposed 2.1.1 maintenance patch**, not a new identity.

1. Add an explicit stable manifest-identity policy to source configuration and generation. Test root/project/nested and same-origin multi-project cases. Keep platform processing checks separate.
2. Enforce kerning with CSS in editable SVG output. Confirm exact fonts and character origins; preserve current outlined wordmarks, social PNG and icons byte-for-byte.
3. Make the current identity the default demo/production selection. Preserve old artwork only in an explicitly optional/reference role.
4. Add focused regression tests, regenerate affected documentation/metadata/manifests/checksums, and verify a clean extracted package.
5. Record only the external platform and owner decisions still outstanding. Do not silently assert them as passed or make optional tests prerequisites for unrelated artwork.

The audit's new dependency graph is acyclic and sensibly scoped. Its conditional requirements are recorded as prose, not executable conditions. If a task runner consumes it, represent `applicable`, `deferred`, and `verified` explicitly so GitHub-only packaging does not inadvertently wait for every website/user-research task.

**No production-image redesign is justified by the demonstrated defects.** Prefer a short corrective release and focused regression tests over more icon variants or another broad audit cycle.

## Sources

**A:** Supplied `audit/AUDIT.md`; its source hash and identical Library snapshot are bound in `evidence/source-binding.json`. Supporting files: `additional-measurements.json`, `text-position-measurements.json`, `findings.json`, `tasks.json`, `scorecard.json`, and `shipping-selection.json`.

**W1:** MDN, Web app manifest `id`, checked 16 September 2026: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/id

**W2:** W3C Web Application Manifest, Working Draft of 13 August 2026, `id` processing, checked 16 September 2026: https://www.w3.org/TR/appmanifest/#id-member

**W3:** MDN, CSS `font-kerning`, checked 16 September 2026: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-kerning

**W4:** GitHub, repository social-media preview, checked 16 September 2026: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview
