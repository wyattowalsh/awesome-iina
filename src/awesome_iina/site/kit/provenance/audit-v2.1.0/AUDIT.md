# Awesome IINA: brand-system release audit

**Review date:** 16 September 2026  
**Target:** `awesome-iina-brand-kit-v2.1.0(1).zip`  
**Source SHA-256:** `13594f1061fa43d241b4e230611a97ac500aeb40bb447be1ec4f806dd1d95ec3`  
**Verdict:** **Ship after specified fixes**, with a narrower **Ship** recommendation for the current GitHub artwork.  
**Score:** **76.5 assessed points / 100 assessed weight; 100% rubric coverage.** This is structured judgment, not market validation or 100% execution-test coverage.

All asset paths below are relative to `awesome-iina-brand-kit-v2.1.0/` inside the supplied archive. Findings describe this supplied state, not an assumed published repository or a previously approved identity. The audit package contains observations and labelled test derivatives, not replacement branding.

## A. Executive verdict

**Keep the current “Indexed Media” direction. Do not commission another wholesale visual redesign on this evidence.** Its offset card, play cue and restrained wave treatment form a useful system rather than merely a compelling large illustration. The current social card has clear hierarchy, the icon has intentional small-size drawings, and actual light/dark and monochrome variants exist.

The strongest quality is **scale-aware execution**. In the native-size content proofs, the current 16–32 CSS-pixel marks retain a discernible frame, offset tab and play cue. The supplied historical favicon loses more of its illustrative detail at the same sizes. The current social descriptor remains readable to this reviewer at the selected 320-pixel width. Those are visual observations, not findings from user testing.

The most consequential delivery defect is **F01: the optional website manifest identifies the origin root rather than the project path**. It should be corrected before releasing that manifest. It does not block uploading the current GitHub social PNG or using the outlined README wordmarks. A second, smaller defect, **F02**, makes the editable live-text SVGs use different kerning from the outlined outputs in the tested browser.

The underlying concept's principal limitation is different: **the uncaptioned mark still communicates “media/playback” more readily than “independent curated catalog.”** The offset tab helps, but the contextual wording does essential strategic work. Retain that wording at first contact instead of loading more visual detail into the favicon.

Recommended release scope:

| Release surface | Decision |
|---|---|
| Current GitHub social PNG and outlined README wordmarks | **Ship**, after owner selection and correct placement; no actual hosted result is certified |
| Current symbols, monochrome variants, favicon artwork and padded image tiles | **Keep**; select only the formats actually needed |
| Website manifest | **Ship after F01**, or omit it when no website manifest is needed |
| Editable source exchange files | **Refine F02**; existing production outlines need not change |
| Historical player/puzzle artwork and retained old hero | **Reference or explicitly secondary illustration**, not the primary identity |

No P0 defect and no required missing logo, favicon, banner or proprietary design file was established. The important limits are the absence of owner adoption, unaided recognition testing, actual GitHub/Safari/iOS/X delivery checks, a full build run, and independent ownership or legal clearance evidence. The bundled reports do not fill those gaps merely by asserting a pass.

## B. Scope, inventory and requirements

### What was supplied

One archive was supplied, so this is a **single-state kit audit with explicitly labelled historical controls**, not a comparison against an independently supplied predecessor. The archive contains **186 files**, occupies **15,120,391 bytes**, and expands to **15,766,670 bytes**. Internal documentation identifies kit **2.1.0**, identity **2.0.0-review.1**, and direction **Indexed Media**. Those declarations agree with the observed organization; they are not proof of a public release or approval history.

The archive references an earlier `awesome-iina-brand-kit-v2-fixed.zip`. That archive was not supplied or retrieved. The claim that 35 image files match that predecessor was therefore **not independently verified**. In contrast, the retained hero's equality to the included historical export was independently verified.

| Group | Files | Treatment |
|---|---:|---|
| `assets/brand/` | 36 | Current delivery: 35 images/containers plus one manifest |
| `source/` | 25 | Parametric sources, exchange SVGs, textures, configuration and profile |
| `archive/original-kit/` | 37 | Historical controls, not competing approved shipping assets |
| `qa/` | 28 | Supplied evidence and proof material, not inherited test results |
| `provenance/` | 17 | Source and dependency claims, checked where possible |
| Other documentation/tooling | 43 | Branding-relevant instructions and integration references only |

The actual formats include **66 PNGs, 23 SVGs, two ICOs, 37 JSON documents/manifests, one ICC profile and 57 other UTF-8 text files**. All PNGs are single-frame. No supplied motion asset, proprietary design document, font binary or nested archive required a separate review route.

Archive paths were enumerated before bounded extraction. Limits were 40,000,000 bytes per member, 200,000,000 aggregate bytes, and a compression ratio below 200. No encryption, traversal, unsafe link, duplicate archive pathname, special-file entry or CRC/read failure was encountered. These checks establish readable bounded contents, **not a security certification of bundled programs**. Bundled Python, scripts and active HTML were not executed. Originals were not modified.

### Production reality, rather than filename assumptions

**Symbols:** the canonical SVGs contain real paths and rectangles, not embedded icon bitmaps. The master geometry is `source/geometry.json`, with intentional 16-, 24- and 32-unit drawings. `symbol-dark.svg` and `symbol-light.svg` use 32-unit geometry; ink and white variants preserve the silhouette without the color treatment. Standalone symbols contain no visible lettering. Metadata titles are not drawn lettering.

**Favicons:** the dark tiles have genuine transparent corner pixels, but are not transparent cutout symbols. The separate symbol PNGs are genuine transparent marks. All seven current ICO frames, at 16, 24, 32, 48, 64, 128 and 256 pixels, match their corresponding named PNGs pixel-for-pixel. The 16@2x file is the 16-unit drawing sampled at 32 physical pixels, not the separate 32-unit design. This distinction is valuable and should remain documented.

**Type:** the production wordmarks are outlined geometry, not editable text. Editable counterparts exist in `source/`, but the authoritative generation inputs are the documented JSON configuration, geometry and builder, not arbitrary edits to generated exchange files. Exact locally installed Inter Display Bold and Medium files matched both recorded SHA-256 values; Chromium reported the expected Inter Display font, not fallback. No font files are included in this audit. The upstream Inter license is documented separately from any artwork-use policy. [S09](https://raw.githubusercontent.com/rsms/inter/master/LICENSE.txt)

**Social artwork:** `github-social-preview.svg` is an honest hybrid: one embedded 1280×640 background PNG, plus genuine vector mark and outlined text. Its embedded raster matches `source/social-background.png`. The production PNG is **1280×640, 198,593 bytes, RGB and sRGB-tagged**. An independent CairoSVG render of the production SVG matches that PNG pixel-for-pixel. The 1200×630 alternative contains the composition uniformly resized to 1200×600 with 15-pixel top and bottom padding; the fit was pixel-verified. It is not stretched.

**Color and provenance:** newly produced PNGs are tagged sRGB; the byte-preserved old hero remains untagged. The source documentation explicitly treats old untagged RGB as sRGB when deriving the wave texture. That is an assumption about interpretation, not recovery of original colorimetry. The recorded crop exactly matches the historical source pixels. No old player or baked title is present in the canonical social background.

All 36 asset-manifest records, 184 bundle-manifest records and 185 top-level checksum entries matched their files. The historical checksum file's 36 entries also matched. The nine exact-duplicate groups are mostly intentional source/export equivalences, the retained hero, and copied evidence. The five pixel-equivalence groups include two ICO-largest-frame comparisons; those are **not** claims that complete ICO containers are identical to PNG files.

### Applicable requirements register

The full register is `requirements.json`; sources and access dates are in `sources.json`.

| Basis | Applicable rule or convention | Result |
|---|---|---|
| Explicit request | No lettering in standalone symbols; independent catalog positioning | Met in inspected symbols and current contextual copy |
| GitHub documentation | PNG/JPG/GIF under 1 MB; separate repository preview upload | Current PNG fits the documented guidance; upload not performed |
| GitHub recommendation | At least 640×320; 1280×640 for best display | Current PNG meets the recommended best-display dimensions |
| Manifest semantics | `id` uses a different resolution base from `start_url` and `scope` | **F01**, conditional on website use |
| Icon metadata | Actual format, size and local path should agree with declarations | Local consistency passes; browser selection untested |
| Open Graph | Basic metadata and truthful image properties | Present and locally consistent; no universal 1200×630 mandate invented |
| Applicable accessibility context | Essential text contrast and appropriate alternatives; logo-specific exceptions | Strong measured contrast; no whole-site compliance claim |
| Reviewer conventions | Native scale, matched backgrounds, reduced cards and optional masks | Completed as labelled simulations, not platform specifications |

GitHub presents its size and format guidance as a documented “should,” with dimensions explicitly recommended. This audit did not experimentally determine server rejection boundaries or universal crops. [S01](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview) The Open Graph protocol's metadata requirements are distinct from individual social-service display policies. [S07](https://ogp.me/)

No App Store, native macOS icon, maskable, motion, standalone PWA or additional proprietary master was imposed. Supplied website icons use `purpose: any`, not an unsupported `maskable` claim. [S13](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/icons)

### Test conditions and coverage

All 186 files received bulk inventory; all 66 PNGs decoded, all 23 SVGs received structural/dependency scanning, and both ICO containers were inspected. Detailed visual inspection sampled meaningful differences, not every resized export equally.

Own static Chromium **144.0.7559.96** proofs cover 50 icon conditions at each of DPR 1 and 2; 128/256 CSS-pixel symbols; padded tiles; social cards at 640/390/320 widths; wordmarks at 400/320/240 widths; the historical hero at 640/342 widths; and four synthetic narrow README contexts. These constitute nine context cases and 126 image placements, plus separate source/export and historical-original comparisons. Explicit paths appear in `coverage.json`.

The native proof index preserves stated CSS widths rather than shrinking them to fit a narrow viewer. Its 2x screenshot is displayed at half its physical pixel width. Grayscale and arbitrary circular masks are labelled simulations. No color-vision-deficiency model, calibrated display test or human recognition study was run.

The current social text region is a measured flat `#080F2B` above the wave. Solid-color contrast is **17.96:1** for `#F5FAFF`, **14.92:1** for descriptor `#D8E6FA`, and **11.21:1** for cyan `#43D9F5`. Light-surface ink `#132555` against white measures **14.75:1**. These ratios support text legibility but cannot establish recognition, minimum usable type size or total accessibility. WCAG exempts logotypes from its text contrast requirement; informative descriptors and functional contexts need their own evaluation. [S05](https://www.w3.org/TR/WCAG22/)

The README's empty image alternative is reasonable **in the supplied context**, because the adjacent live text supplies the project name and role. It must not be copied into a new functional or informative context without review. [S06](https://www.w3.org/WAI/tutorials/images/)

## C. Prioritized findings and meaningful disagreements

### F01 · P1 only for website-manifest release: project identity resolves to `/`

**Evidence:** Measured file contents; researched semantics; inferred resolution. **Confidence:** high for the standards-based result, native manifest processing untested. Affected files: `assets/brand/site.webmanifest`, `source/manifest.template.json`, and `scripts/brandkit/core.py` around `render_site`.

The manifest assigns `../../` to `id`, `start_url` and `scope`. At the intended deployment, the latter two resolve to `/awesome-iina/`. The identity resolves against the **origin** of the start URL, producing `/` instead. Current W3C draft and MDN documentation agree on that distinction. [S02](https://www.w3.org/TR/appmanifest/#id-member) [S03](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/id)

This is not invalid JSON or an observed installation failure. It is an unintended, non-project-specific identity that can collide with another root-identified application on the same origin. The generator currently reads the unchanged manifest template, so merely fixing the exported JSON would leave the problem reproducible.

**Correction:** omit the unused manifest, or configure a stable project-specific root-relative identity, proposed `/awesome-iina/` for the default deployment. Keep identity independent of kit version. **Acceptance:** independently resolve the identity, start and scope at root, project and nested deployment paths; confirm different project manifests do not inadvertently share identity; verify native processed output before claiming browser approval. This P1 does **not** block a GitHub-only release.

### F02 · P2: editable SVG kerning does not match production outlines

**Evidence:** Measured and visually observed in Chromium with exact recorded fonts. Affected files: `source/wordmark-{dark,light}-editable.svg`, `source/social-card-editable.svg`, and the `Type.text` editable branch in `scripts/build_assets.py`.

The sources set the SVG attribute `font-kerning="none"`, but the tested renderer computes CSS kerning as `auto`. Its 43-pixel wordmark text advances **280.90625 pixels**. An in-memory diagnostic applying CSS `font-kerning:none` changes that to **284.421875 pixels**. The production builder separately positions outlined glyphs with unkerned advances. This is not font fallback or merely a compression difference.

**Consequence:** a maintainer can approve a live-text preview that differs from the actual outlined export. The current production typography remains attractive and usable.

**Correction:** express the selected policy through supported CSS, or derive both outputs from one shaping result. Do not change the chosen font or force a new visual direction. [S08](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-kerning) **Acceptance:** computed kerning matches the intended policy and corresponding character origins agree within an explicit tolerance, proposed 0.25 CSS pixel at native size. Review all social text lines and both wordmarks. Do not demand identical antialiasing across unrelated renderers.

### F03 · P2: keep the preserved old hero out of the primary shipping selection

**Evidence:** Measured byte identity, visual observation and inferred deployment risk. Affected files: `assets/brand/readme-hero-retained.png`, `integration/demo/index.html`, and `docs/STYLE.md`.

The archive properly labels the old player/puzzle/sparkle artwork as supplementary. Its mere presence is **not** a system inconsistency. However, it still lives in the delivery directory and dominates the supplied demo. Its baked descriptor is not usefully readable at the reviewed 342-pixel width, and its mark differs substantially from the new symbol.

**Correction:** make the current wordmark plus live copy the primary example and record a shipping allowlist. Preserve the old hero as an optional illustration or reference, never the sole carrier of required information. **Acceptance:** each primary header/card/icon uses the current mark; optional historical artwork does not become a second primary logo. No new hero illustration is needed.

### F04 · P2: contextual clarity is stronger than unaided differentiation

**Evidence:** Visual observation and inference; user recognition untested. Affected family: current symbols, favicon, social card and README context.

The new silhouette is cleaner than the historical illustration, but its dominant triangle remains a generic media cue. The offset rear tab may suggest a collection, overlapping windows or another media utility. The explicit independent-catalog wording is therefore valuable, not redundant.

The limited reference check found these specific relationships:

- **IINA:** its inspected official 60-pixel website icon combines a filled blue play form, adjacent blue/violet bars and a dark rounded tile. The audited mark shares the palette and play vocabulary but uses an outlined front card and open rear corner rather than that filled construction. This is a limited silhouette comparison, not a high-resolution artwork or trademark investigation. [S10](https://iina.io/images/iina-icon-60.png)
- **mpv:** its official mark uses a circular purple/radial construction around playback imagery; the audited symbol is offset and rectilinear. The shared triangle denotes the same media category, not proof of copying. [S11](https://mpv.io/images/mpv-logo-128-0baae5aa.png)
- **Awesome:** the upstream pink sunglasses and angular wordmark are visually unlike this kit. “Awesome” affiliation in naming does not require imitation of those shapes. [S12](https://raw.githubusercontent.com/sindresorhus/awesome/main/media/logo.png)

**Correction:** retain clear first-contact context and run a small formative recognition check before a broader redesign. **Acceptance:** record unprompted descriptions of symbol-only and contextual placements; resolve recurring official-player or AI-player interpretations of the complete identity. Do not invent a statistical recognition rate or claim clearance from this small comparison.

### F05 · P2 evidence gap: do not turn static proofs into platform approval

**Evidence:** measured scope of completed tests; remaining behavior untested. Affected paths: README snippet, website head, favicon files, manifest and supplied QA.

The local content renderings do not establish actual browser-tab icon choice, GitHub manual-theme behavior, Safari/iOS clipping, social-service crops or HTTP delivery. A native manifest inspection attempt was blocked by environment policy and was not retried through a bypass. Bundled scripts and browser assertions were not executed.

A narrow synthetic README test produced a 342×64 image element under max-width-only styling and 342×54.71875 under height-auto styling. The actual SVG graphic retained its aspect ratio in the inspected images; the former mostly adds vertical slack. **No GitHub distortion defect is established.** This is a host-verification note, not grounds to redesign the wordmark.

**Correction and acceptance:** before claiming an integration works, retain an actual dated host-native capture, request/metadata checks and the browser/theme/viewport. State unsupported destinations explicitly. Browser icon selection depends on more than the existence of one good PNG. [S04](https://html.spec.whatwg.org/multipage/links.html#rel-icon)

### F06 · P2 governance: public artwork-use terms remain a proposal

**Evidence:** measured wording of `docs/ASSET-USE.md`; ownership untested. That file expressly does not adopt a new artwork license, assert third-party ownership or provide trademark clearance. This honesty is a strength.

**Correction:** have the owner adopt the intended permissions or clearly state their limits before advertising broad reuse. Maintain separate font dependency and artwork-use records. **Acceptance:** publication accurately reflects the owner's selected identity and actual permissions without unsupported official-affiliation, originality or legal-clearance claims. Legal review is appropriate for a concrete concern or requested clearance, not an invented universal launch requirement.

### Five simulated perspectives, applied once

These are complementary analytical roles, not real reviewers or endorsements.

| Perspective and relevance | Position and strongest challenge |
|---|---|
| Brand strategy: catalog positioning and independence | Keep the independent-catalog copy. Challenge to icon redesign: a symbol need not explain the entire product by itself. |
| Identity/icon craft: geometry and optical sizes | Keep the offset-tab silhouette and three optical drawings. Challenge to preservation: do not mistake a clean generic symbol for proven distinctiveness. |
| Interface/accessibility: small-scale and contextual use | Keep current high-contrast text and live equivalents. Challenge to prettier historical art: its tiny baked descriptor is not an adequate mobile information layer. |
| Production/integration: reproducibility and deployment | Correct F01 and F02, preserve working outlines. Challenge to hash-based confidence: correct checksums cannot validate URL semantics or text shaping. |
| Independent critique: strongest case against both directions | The current mark could still read as a player utility; the old illustration has more expressive personality. But adding effects, puzzles or labels to remedy that can recreate the exact small-size losses the new system solves. |

The meaningful unresolved question is whether greater distinctiveness justifies new geometry. The visual and technical evidence does not yet justify that cost. Contextual recognition testing, not another concept board, is the appropriate next discriminator.

## D. Scorecard and asset dispositions

The requested weights are unchanged. Half-points express intermediate judgments; weighted points equal weight × score / 5. All dimensions have evidence sufficient for a scoped assessment, while confidence and unperformed tests remain explicit.

| Dimension | Weight | Score / 5 | Points | Main limitation |
|---|---:|---:|---:|---|
| Distinctiveness and strategic fit | 25 | 3.5 | 17.5 | Generic play/stack association; no unaided-recognition evidence |
| Recognition and scalability | 25 | 4.0 | 20.0 | Strong optical work, but 16px identity remains terse |
| Shipping-system coherence | 15 | 4.0 | 12.0 | Optional legacy hero needs careful selection |
| Typography, hierarchy, composition | 15 | 4.0 | 12.0 | Good production hierarchy; descriptor is small at 320px |
| Accessibility/context adaptability | 10 | 4.0 | 8.0 | Strong variants and contrast; host-wide accessibility untested |
| Technical delivery/maintainability | 10 | 3.5 | 7.0 | Manifest semantics and editable kerning parity |
| **Total** | **100** | | **76.5** | Conditional P1 gate overrides an aggregate |

Confidence is medium for differentiation and whole-context accessibility, medium-high for scale, and high for directly measured production properties. There is no comparative score delta: the archived controls have a different role and scope, and the named predecessor was not supplied.

**Keep:** current symbol geometry; light/dark and mono variants; optical favicon family; current production wordmarks; current social PNG/SVG and optional 1200×630 adaptation; padded avatar/website tiles where needed; secondary wave texture.

**Refine:** live-text exchange SVGs and website manifest. **Retain as exploration/reference:** historical artwork and the old hero, unless deliberately used as supplementary illustration. **Redesign:** no current production family requires wholesale replacement on the evidence. **Missing and required:** none identified for the scoped repository release.

Compared like-for-like with the included historical reference, the current 1280×640 card has larger useful supporting copy and fewer competing symbols. Small icons avoid the former glow/sparkle collapse. The tradeoff is less illustrative personality and greater reliance on a familiar playback sign. These are visual differences within the supplied package, not a claim that all changes occurred between independently verified releases.

## E. Recommended improvement strategy

**Prefer targeted refinement.** Preserve the current offset tab, rounded media card, play cue, intentional small-size geometry, dark/light palette roles, Inter Display outlines and current two-line descriptor. Preserve the wave as secondary atmosphere, including its source lineage. Keep the genuine mono versions as independent evidence that the symbol does not require a gradient to exist.

Rebuild only the defective delivery behaviors: manifest identity resolution and editable type policy. Clarify which files are canonical in primary examples. Leave working PNG compression, ICO frames, outlined typography and the 1200×630 fit alone. Do not add more resolutions, native-app formats, badges, animation or a replacement hero merely to make the kit larger.

A broader redesign has a legitimate possible benefit: a more specific curation/index cue and less player-product ambiguity. Its cost is discarding a functioning optical system, repeating export validation and potentially losing the simple silhouette. Authorize that route only when contextual user feedback establishes a recurring problem or the owner deliberately chooses a substantially different positioning. The current evidence favors preservation with precise repairs, not preservation at any cost.

## F. Dependency-aware execution plan

These are recommended tasks, not work executed during this audit. **Small** means bounded single-discipline work; **medium** means cross-file/renderer verification or human coordination. They are not time promises. New filenames are expressly proposed.

| Task | Priority / findings | Dependencies | Responsible discipline | Effort | Deliverable and acceptance |
|---|---|---|---|---|---|
| **T01** Select scope and primary identity | Decision; F03/F04/F06 | None | Owner + brand strategy | Small | Proposed `docs/BRAND-RELEASE.md`: GitHub-only vs website, current symbol selection, optional hero role |
| **T02** Correct or omit manifest | Conditional P1; F01 | T01 | Frontend/platform | Small | Existing template/generator/export; proposed `tests/test_manifest_identity.py`; root/project/nested resolution matrix passes |
| **T03** Align editable typography | P2; F02 | T01 | Type production + tooling | Small–medium | Existing live SVGs and builder agree on kerning and character origins; production design preserved |
| **T04** Align primary example/allowlist | P2; F03 | T01 | Brand systems + docs | Small | Existing demo/snippet and proposed release document consistently identify one primary mark |
| **T05** Verify claimed destination contexts | Validation; F01/F05 | T01, T02 where applicable, T04 | Frontend QA + accessibility | Medium | Proposed `qa/host-native-validation.json` and `qa/host-native-previews/`; actual evidence for each claimed host |
| **T06** Formative recognition check | Optional P2; F04 | T01 | UX research + strategy | Medium | Proposed `qa/recognition-notes.md`; record unprompted answers without claiming market-level validation |
| **T07** Adopt/clarify reuse terms | P2; F06 | T01 | Owner/governance | Small | Existing `docs/ASSET-USE.md` accurately states adopted permissions or limitations |
| **T08** Bind the changed release | P1 for a new package | Applicable T02–T05 and T07 branches | Release/asset QA | Small–medium | Updated existing manifests/checksums, repeat changed-asset proofs, documented deferrals and no accidental old primary mark |

T02 is not applicable when no manifest ships. T06 is not a dependency for unchanged GitHub artwork. Optional T03/T07 work may be explicitly deferred for an appropriately scoped release; a deferred issue must not become an unsupported claim. `tasks.json` contains the complete graph, conditions, paths and acceptance tests.

## G. Copy-ready revision briefs

### Brief 1: correct website identity, not the visual design

> **Objective:** make the supplied website manifest identify Awesome IINA at its configured project path, or omit the manifest when it is out of release scope. Preserve `display: browser`, existing names, descriptions, icon geometry, dimensions, file formats and measured color roles. No new native-app or maskable promise. Correct the authoritative `source/manifest.template.json` and `scripts/brandkit/core.py`, then regenerate the manifest. For the default project deployment, the proposed stable ID is `/awesome-iina/`; root and nested deployments must use their explicitly configured identities. Typography and backgrounds are unchanged. Pass only after independent URL-resolution checks show the intended same-origin identity and correct icon paths across deployment cases. Browser processing remains unverified until actually inspected. Do not add a version number to the identity merely because the kit version changes.

### Brief 2: make editable type faithfully represent outlined exports

> **Objective:** remove live-text/export spacing drift without redesigning the wordmark or card. Preserve the current project name, Inter Display Bold/Medium dependencies and recorded font hashes; preserve production outlines, symbol geometry and current title/descriptor hierarchy. The existing wordmark uses a 400×64 canvas, text x=86, baseline=47, 43px type and −0.7 tracking. The existing social layout is 1280×640: 112px title, −2.2 tracking, and 48px descriptor lines. Preserve measured colors: background `#080F2B`, foreground `#F5FAFF`, secondary text `#D8E6FA`, cyan `#43D9F5`, and the existing light-surface roles. Express the intended no-kerning policy with effective CSS or shared shaping data rather than relying on the currently ineffective SVG attribute. Review at native 400px/1280px and reduced 320px width. Pass when computed typography matches the intended policy and character positions agree with outlines within the declared tolerance, proposed 0.25 CSS pixel at native size. Do not substitute fonts silently or redistribute font binaries.

### Brief 3: clarify the primary README/demo selection

> **Objective:** make the current identity the unmistakable default without commissioning more artwork. Use the supplied 400×64 outlined light/dark wordmarks with adjacent live independent-catalog wording and the non-affiliation statement. Preserve intrinsic aspect ratio and verify narrow host behavior. The standalone symbol remains text-free. Do not put the old 3D player beside the new mark as a second logo, and do not rely on the old hero's baked descriptor. Keep the old image unchanged as explicitly optional supplementary artwork or historical reference. No new color, font, format or hero file is required. Pass when primary examples and the release allowlist agree, and essential project information remains available with images disabled.

These are briefs for future changes. No requested revision asset was created by this audit.

## H. Release gates and unresolved questions

**Technical validation:** archive readability, bulk image properties, declared hashes, all ICO frames, SVG dependency structure, selected source/export equality and native content renderings were independently checked. F01 remains the only conditional P1 defect. F02 remains a real source-maintenance correction. A full build, installer behavior and bundled QA suite were not executed.

**Visual judgment:** current production symbols, wordmarks and social card are suitable for the scoped uses reviewed. Historical controls should not become the primary identity. The 320-pixel descriptor judgment is a reviewer observation, not a universal font-size guarantee.

**User recognition:** no participant evidence exists. Test whether the complete first-contact identity is understood as an independent catalog and whether repeated symbol-only exposure leads to recognition. A small formative study can reveal recurring confusion but cannot certify uniqueness or market performance.

**Owner and rights decisions:** confirm the selected direction and actual public reuse permissions. The checksum establishes byte consistency only. No trademark search, ownership adjudication or originality certification was performed. No legal review is made mandatory absent a concrete concern or an explicit request.

**Platform evidence:** actual GitHub upload/README, Safari/iOS, Firefox, browser-tab favicon selection, live manifests and X card rendering remain untested. Apple material consulted for web clips was archived, not treated as a current exhaustive size specification. An older official X documentation URL redirected without usable constraints, so no current X crop or dimension guarantee is asserted.

**Decision boundary:** the current repository artwork can be used without another concept round. A website manifest must be corrected or omitted before that integration is approved. The kit should not advertise exact live-text parity or universal platform approval until the corresponding checks are completed.

## Audit package map

`asset-inventory.csv` inventories every accessible file; `archive-inventory.csv` retains archive-level paths and compression data. `asset-measurements.json`, `additional-measurements.json`, `text-position-measurements.json`, `browser-measurements.json`, `integrity-checks.json` and `duplicates.json` carry the underlying measurements. `requirements.json`, `sources.json`, `findings.json`, `tasks.json`, `scorecard.json`, `asset-dispositions.json` and `shipping-selection.json` make the decision implementable. `coverage.json` records inspected paths. `METHODS.md` explains tooling and limits. Start visual review with `previews/index.html` at 100% browser zoom.
