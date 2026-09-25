# Awesome IINA: brand-system release audit

**Review date:** 16 September 2026  
**Target:** `awesome-iina-brand-assets (1).zip`  
**Review mode:** one supplied export/review kit, assessed independently. No prior chats, older kits, unpublished repository or hypothetical approved design were used.

## A. Executive verdict

**Do not ship this package as an approved, general-purpose identity system yet. A narrower repository-first selection can ship after specified fixes.** No P0 failure was found. The blockers are specific to positioning, reduced descriptive copy, and the primary-symbol/favicon role, not corrupt or incorrectly sized exports.

The strongest quality is the **large-format illustration and its disciplined delivery**. The luminous cyan/blue/violet media imagery is welcoming, visually coherent, and relevant to IINA users. The supplied naming, inventory, source preservation, and candid limitations are substantially better than an undocumented folder of generated images. All 36 packaged checksum entries match; all 23 image files decode; the five ICO frames match their corresponding PNGs.

The most consequential weakness is the **gap between an attractive media-player illustration and a distinctive catalog identity**. At small sizes, the plugin detail recedes while the window, play triangle, and sparkle remain. In the social card, the text that explains “catalog & discovery toolkit” is also the text that becomes difficult to read when reduced. This compounds the positioning problem.

**Recommended direction:** retain the rich illustration language for headers and promotional art; refine the social composition and independence copy; perform a bounded redesign of the compact symbol and its optical-size variants. Do not flatten or replace all the artwork merely because the favicon needs simpler, more deliberate construction.

| Release scope | Verdict | Conditions |
| --- | --- | --- |
| Internal/export review kit | **Ship as review material** | Preserve its explicit unapproved status. This is not brand approval or a security certification. |
| Repository header plus social preview | **Ship after specified fixes** | Live independent-catalog title/description; shorter readable social role line; maintainer selection and authorization. No need to wait for optional website icons. |
| Primary standalone identity and favicon family | **Do not ship yet** | Resolve F01 and F02, then approve optical exports under native-size tests. |
| Website branding/metadata | **Ship after specified fixes, conditional on a website release** | Above identity work if used, plus F04. No actual deployment was supplied or tested. |

**Evidence limits:** no user recognition study, real GitHub upload/unfurl, Safari/iOS home-screen test, browser-tab icon selection/cache test, calibrated-display comparison, full C2PA authenticity validation, or trademark/legal clearance was performed. These limits do not invalidate the completed file and visual inspection, but they constrain approval claims.

## B. Scope, inventory and requirements

### B1. Archive identity and safe inspection

| Property | Observed value |
| --- | --- |
| Exact supplied filename | `awesome-iina-brand-assets (1).zip` |
| ZIP size | 9,759,321 bytes |
| SHA-256 | `88df69ad75dd231dcb8f8fed6e4e69bbdd781102cb51e163fb546b54d7b75d59` |
| Root directory | `awesome-iina-brand-kit/` |
| Entries / expanded bytes | 37 files / 9,842,958 bytes |
| Apparent project | Awesome IINA; manifest names the intended `wyattowalsh/awesome-iina` repository |
| Artwork version | **Not established.** `schema_version: 1` describes metadata structure, not a brand release. `(1)` is not treated as a revision number. |
| Design scope | Four raster compositions in one related direction, plus derivatives and review/integration support |

All source paths below are relative to `awesome-iina-brand-kit/`. The archive was listed before extraction. Each entry was screened for absolute/traversal paths, duplicate names, links, encryption and abnormal size/expansion, then read individually with ZIP CRC verification. Limits were 2,000 entries, 50 MB per entry, 200 MB total, and rejection of ratios above 100:1 for files larger than 1 MB. None required rejection. No nested archive was unpacked. No supplied script, HTML page, macro, installer or active document was executed. Working copies were marked read-only; the supplied ZIP remains unchanged.

The attachment service returned archive metadata but no indexed text. The audit therefore read the mounted ZIP directly, including every accessible support document. [Complete inventory](asset-inventory.csv), [archive entries](evidence/archive-entries.json), [independent results](evidence/inspection-results.json), and [complete inert text review](evidence/source-text-review.txt) establish the local evidence trail. The `L` labels in that last file are local per-file line numbers, not external citation IDs.

### B2. Reconstructed system

| Family | Actual assets | Role and evidence |
| --- | --- | --- |
| Master illustration | `originals/awesome-iina-master-icon.png`, 1254×1254; exports at 128/256/512/1024 | Inset dark tile, perspective player window, play triangle, waves, puzzle panel, sparkle. |
| Simplified illustration | `originals/awesome-iina-simplified-icon.png`, 1254×1254; exports at 256/512 | Removes some scene detail, but keeps window/play/traffic dots/puzzle/sparkle. It is not a separate micro-icon construction. |
| Social composition | `originals/awesome-iina-social-artwork.png`, 1774×887 | Title, catalog descriptor and category row with large left-hand media illustration. |
| Social derivatives | `exports/social/github-social-preview-1280x640.png`; `open-graph-1200x630-padded.png` | 794,030 and 706,048 bytes respectively. The latter preserves a 1200×600 resize with 15-pixel top/bottom bars. |
| README composition | `originals/awesome-iina-readme-hero.png`, 2172×724 | Wide illustration with project title and explanatory tagline. |
| README derivatives | `exports/headers/readme-hero-1200x400.png`; `readme-hero-1800x600.png` | 439,553 and 931,563 bytes. Different delivery densities, not different designs. |
| Web delivery | `exports/web/` | PNG favicons at 16/24/32/48/64, one five-frame ICO, 180-pixel touch icon, 192/512 manifest icons, and manifest. |
| Support | 14 non-image files | Inventory, manifest, checksums, README, provenance/platform notes, audit prompt, two scripts, review HTML, manifest, and integration examples. |

There are **22 PNG files and one ICO container**, not 23 distinct designs. The duplicate `exports/icons/simplified-icon-512.png` and `exports/web/icon-512.png` is byte-identical and pixel-identical. It serves two named delivery roles; it is not an additional concept or automatically a packaging defect. No other byte-identical image pair was found.

The four source PNGs are RGB, opaque raster artwork. All image containers are fully opaque, including ICO frames whose alpha values are uniformly 255. No brand vector, layered source, editable image text, actual transparent knockout, or designed monochrome mark was found. Exact font identification is unavailable. No font binaries are included.

**Important metadata distinction:** all four original PNGs contain `caBX` Content Credentials data. Their decoded assertions name `gpt-image` version `2.0`, `OpenAI Media Service API`, and algorithmic creation; `allActionsIncluded` is false. The declared image-data hashes match when independently recomputed with the stated exclusions. **Signatures, trust chain, timestamps and revocation were not validated**, so these are parsed assertions plus a narrow content-binding check, not authenticated authorship. [Embedded evidence](evidence/embedded-provenance.json). C2PA treats content binding and signature/trust validation as distinct steps. [S13]

Those records also contain an SVG generator icon. That is provenance metadata, **not an editable Awesome IINA symbol or a competing concept**. Resized PNG exports omit `caBX`; preserving the untouched originals retains that evidence. The archive timestamps indicate September 12, while creation assertions use September 13 UTC. Without a common verified clock basis, neither establishes a revision sequence or a contradiction. No comparison with the named but absent earlier-conversation files was attempted.

### B3. Coverage and test conditions

**Bulk coverage:** 37/37 files inventoried; all 14 support files read as inert text; 23/23 image files decoded; 22/22 PNGs checked at chunk level; all five ICO frames inspected. All 36 checksums match and all 209 PNG chunk CRC checks pass. Every one of the 18 derivative PNGs is an exact decoded-pixel match to an independently performed source resize/pad operation. This is stronger than accepting the bundled `QUALITY-CHECKS.json` at face value. It is not execution of the bundled generator.

**Visual coverage:** all four distinct source compositions were inspected, all 23 image containers appear in the contact sheet, and high-risk derivatives received detailed native-size/context review. Repeated resolutions were not given artificial independent concept critiques. Master and simplified families were tested at 16/24/32/48/64/128/256 CSS pixels; the master has no supplied 16–64 export, so those are explicitly browser-scaled tests of its 256-pixel export. Supplied favicon PNGs were used directly at their named sizes. Additional same-CSS comparisons distinguish 16-source from 32-source pixels and equivalent 24/48 and 32/64 pairs.

Chromium **144.0.7559.96**, through Playwright, rendered an independently authored, network-blocked, JavaScript-disabled proof page at DPR 1 and 2. Forty-two image placements per page have recorded natural and CSS dimensions. These tests render images, **not browser tab chrome or GitHub**. Python 3.13.5, Pillow 12.3.0, NumPy, standard ZIP/hash/JSON/XML tools and CairoSVG for a reference logo were used. An independently written bounded JUMBF/CBOR reader inspected selected metadata; it is not a C2PA validator.

Social tests used the supplied 1280×640 delivery and uncropped 640×320/320×160 presentations. README tests included 1200, 960, 640 and 390 CSS-pixel widths, preserving the 3:1 aspect ratio. These are proposed desktop/mobile-like stress conditions, **not documented platform crops or safe zones**. No distortion or guessed universal crop was applied.

Grayscale and alpha-only diagnostics distinguish color loss from an actual one-color identity. Chromium protanopia, deuteranopia and tritanopia simulations were performed and labeled. The play/frame geometry remains, but the small-detail problem remains too. These are simulated views, not user testing. [S12]

[Native-size browser proof](previews/browser-native.html) · [Icon strip](previews/01-icon-native-strip.png) · [Social reductions](previews/03-social-reduced.png) · [README reductions](previews/04-readme-reduced.png) · [All image files](previews/06-all-image-files.png) · [Color-vision simulations](previews/09-color-vision-simulations.png)

View native sheets at 100%; chat previews may be scaled. Nearest-neighbor magnifications explain pixel structure but were not used as proof of small-size usability. Full DPR-2 screenshots contain twice the device pixels per CSS dimension; they are not a larger-icon success case.

### B4. Applicable requirements register

The supplied manifest, readme examples and web exports justify assessing repository delivery and **conditional** website delivery. They do not establish that a website, PWA or native application is scheduled for launch.

| IDs / classification | Requirement or convention | Result |
| --- | --- | --- |
| R01–R02 / explicit user | Independent catalog positioning; no lettering in standalone symbols | Letter-free symbols pass. Independence is not explicit in public artwork; reduced catalog copy is weak. |
| R03 / verified GitHub requirement | PNG/JPG/GIF under 1 MB | The 794,030-byte PNG passes. [S01] |
| R04 / GitHub recommendation | At least 640×320; 1280×640 recommended for best display | Supplied delivery matches 1280×640. This is not a universal mandatory social ratio. [S01] |
| R05 / OG protocol requirement | `og:title`, `og:type`, `og:image`, `og:url` | Conditional example gap: `og:type` and `og:url` absent. [S02] |
| R06–R07 / browser semantics | Correct icon sizes/paths; `any` is not `maskable` | Manifest's two relative paths and dimensions pass in the package. Actual serving and selection untested. [S03–S04] |
| R08–R09 / context-dependent accessibility | Ordinary supporting text and alternatives depend on actual use; logo exceptions do not exempt all copy | No whole-page compliance verdict. README advice to keep live text is sound but not implemented in an actual supplied page. [S05–S07] |
| R10–R11 / proposed reviewer tests | Native micro-icon recognition; readable role line in reduced social card | Current family needs work. Sizes are test conditions, not newly invented platform mandates. |
| R12–R14 / maintainability and evidence recommendations | Editable masters, font/color records, approval/reuse terms, accurate provenance claims | Improvements identified. Not all are one-off GitHub upload blockers. |

The full machine-readable register is [requirements.json](requirements.json). Mandatory App Store icon sets, PWA installation support, maskable assets, light/monochrome variants, and a vector-only brand system are **not imposed**.

**Absent versus required:** editable brand sources, transparent/light/monochrome treatments, public reuse terms, and an actual integrated site are missing from this archive. A compact primary mark is required for a release that actually uses one; live README meaning is required for the recommended header integration. A PWA manifest expansion, native icon set, and extra social ratios are not required for a repository-first launch.

## C. Prioritized findings and disagreements

Evidence labels: **Measured** means computed from actual bytes or recorded rendering; **Visually observed** means reviewer inspection; **Researched** means sourced external behavior; **Inferred** means interpretation rather than direct proof; **Untested** identifies missing validation. Full observation/interpretation/consequence/correction records are in [findings.json](findings.json).

### F01 · P1 · Micro-icon recognition requires optical construction

**Affected:** `originals/awesome-iina-simplified-icon.png`, simplified exports, all supplied favicon PNGs and `exports/web/favicon.ico`. **Condition:** especially 16–32 CSS pixels. **Confidence:** high for detail loss, medium for unfamiliar-user recognition.

**Measured:** the favicon family is mechanical resampling. In the 1254-pixel simplified original, a relative-luminance-above-0.18 diagnostic bounds bright content at 866×685 source pixels, about **11.05×8.74 pixels at a 16-pixel display**. This is a brightness proxy, not an exact object silhouette or optimal-margin rule. **Visually observed:** the puzzle cue becomes a patch; the window, play triangle and star retain more prominence. The star creates a competing point of emphasis above the primary frame.

**Consequence:** sufficient visibility is not the same as distinctive recognition. The current icon is more reliably “some media player” than “this catalog.” P1 applies to the primary-symbol/favicon release, not a decorative repository header.

**Correction:** increase useful occupied area, select one distinguishing geometric cue, and separately construct the 16–32 optical treatment. Eliminate tiny traffic dots, redundant panes or sparkle where they compete with that cue. **Acceptance:** inspect real 16/24/32 exports at 100% CSS size and DPR 1/2 on light/dark surroundings; verify that a distinctive cue survives without color or glow alone; conduct a small matching/confusion review before approval. Do not substitute a larger raster or aggressive sharpening for this work.

### F02 · P1 · Positioning depends too heavily on explanatory copy

**Affected:** both icon originals, the social card, README hero and website description. **Condition:** standalone use and reduced compositions. **Confidence:** medium.

**Visually observed:** the system depicts application playback, extensions and a sparkle. The social artwork explicitly says “Curated IINA ecosystem catalog & discovery toolkit” at full size, which is a positive distinction. It does not explicitly identify the project as independent/community-led, and neither does the hero. **Inferred:** an unfamiliar viewer could interpret the standalone icon as an application or an official extension product. An AI association from the sparkle is only a possible reading, not a measured finding or the central reason for rejection.

**Limited identity comparison:** official IINA's inspected icon combines a charcoal rounded-square backing, cyan/blue play triangle and purple vertical bars; the current kit shares dark-tile/cool-play vocabulary but adds window chrome, a plugin panel, sparkle and richer perspective. It is not a pixel duplicate. The official mpv mark puts its play cue inside a purple circular form, a clearer outer silhouette. Awesome's official logo uses pink sunglasses with an “awesome” wordmark, signaling a different catalog/community tradition; the kit does not visibly borrow that construction. The IINA reference was a 60-pixel official image, so fine-geometry comparison is limited. [S08–S11]

**Consequence:** the package's best catalog explanation is fragile under reduction. P1 is a positioning decision, not an allegation of infringement. A limited similarity check is not trademark searching, originality certification, or ownership clearance.

**Correction:** make “independent community catalog” explicit in live text and the short social descriptor; treat player imagery as illustration rather than the sole primary identifier. **Acceptance:** a maintainer approves the exact role statement, and a formative first-impression review does not reveal persistent official-player/store interpretations in the complete public composition. Do not demand that an unfamiliar abstract symbol explain the entire business without context.

### F03 · P1 · Long raster descriptions fail the reduced presentation

**Affected:** both social exports and both README header exports; `integration/readme-snippet.md` is relevant to the remedy. **Confidence:** high for measured geometry and observed loss of legibility.

At 320×160, the social title remains readable but the long descriptor/category row is not dependable reading content. The detected source ink spans are 23 pixels for the descriptor and 15 for category labels, equivalent to **5.75 and 3.75 CSS pixels** at this presentation. At a 390-pixel column, the hero's descriptor spans approximately **5.2 CSS pixels** in height. These are measured raster-ink spans, **not inferred font sizes**. [Text diagnostics](evidence/text-size-and-contrast-diagnostics.json)

Representative text-core/background spot samples are 12.88:1, 16.43:1 and 18.44:1 assuming sRGB, with coordinates and RGB values recorded. They are not worst-case text contrast values. The important observed defect is smallness, not evidence that all the text lacks contrast. Raising contrast alone would not repair it.

**Correction:** shorten the social role line and increase its available area. Remove the tiny category inventory or move it to live text. For the README, retain the attractive header as supplementary art and supply live heading, scope and independence text adjacent to it. The bundled snippet already recommends live text, so this is an integration gate rather than proof of a broken deployed README.

**Acceptance:** name plus short role line can be read without zoom at the agreed minimum social presentation, using 320×160 as a proposed stress test. README meaning remains intact at 390 pixels and with the image disabled. Ordinary descriptive text should be assessed in the final presentation; WCAG's logotype exception does not automatically cover the supporting description. Appropriate alt text depends on whether the image is informative or duplicates nearby live content. [S05–S07]

### F04 · P1, website only · Example metadata is incomplete

**Affected:** `integration/website-head.example.html`, lines 10–17; deployed manifest/icon routing. **Confidence:** high for the supplied snippet, untested for any actual site.

The example contains an intentional image URL placeholder and omits `og:type` and `og:url`. The protocol identifies four basic required properties, not merely title plus image. [S02] The current declared 1280×640 dimensions match the GitHub-size export; using the optional 1200×630 export requires changing those declarations.

The apparent `assets/brand/...` targets are not found beside the example, but its comments explicitly instruct copying and adapting paths. **That is not a broken deployed-link finding.** Likewise, the supplied manifest's two icon paths resolve correctly relative to the manifest in this kit. [S03]

**Correction/acceptance:** complete canonical URL/type, resolve the image placeholder, serve actual assets under the chosen base path, and verify response content/dimensions. Check the repository social-preview setting separately from website metadata. No deployment was performed, and website work is not a repository-only blocker.

### F05–F08 · P2 · Maintainability and reuse boundaries

**F05: editable brand sources.** All four artworks are flattened PNGs; resizing scripts cannot revise typography or geometry. The embedded credential SVG is not brand artwork. Create editable compact geometry and text/layout sources as dependencies of the approved revisions, while retaining raster illustration where justified. Accept only an actual editable layout and path-based brand source, not a whole-image wrapper labeled SVG. This is not a mandatory-vector rule for the hero.

**F06: background adaptability.** All images are opaque. Light surroundings expose dark rectangular backings, which may be intentional tiles. No actual transparent, light-background or one-color variant exists. Add only variants demanded by a confirmed placement; measure alpha and check edges on multiple backgrounds. An alpha-only conversion of these files is a rectangle, not a monochrome mark. No blocker is assigned merely because optional variants are absent.

**F07: approval, reuse and provenance policy.** Source hashes and embedded claims are useful evidence, not a license. Original credential chunks are present; derivative chunks are absent; full authentication was not performed. Record that boundary and explicit maintainer selection/reuse terms. Preserve original credentials; do not copy a signature unchanged onto modified pixels. A verified-credential claim needs an actual validator report. Legal review is appropriate for a concrete rights concern or requested legal assurance, not an automatic prerequisite invented for every repository logo. [S13]

**F08: color interpretation.** No PNG includes ICC, sRGB, gAMA, cHRM or cICP declarations. This is a maintenance risk, not proof of incorrect visible color. After design approval, document output interpretation and named color roles. Record whether sRGB is an assigned assumption or a conversion from a known profile. Do not claim exact original palette tokens from visual resemblance. Test the revised source/output in the target workflow.

### The five simulated perspectives and the material disagreement

These are analytical perspectives, not real reviewers or endorsements.

| Perspective / relevance | Position and strongest challenge |
| --- | --- |
| Brand strategy: role and independence | A player-first primary identity is risky for a catalog. Challenges “just simplify” because a clearer play button can communicate the wrong category more effectively. Missing evidence: first-impression responses from actual users. |
| Identity/icon craft: silhouette and optical behavior | Preserve the attractive large illustration, but build a deliberate compact form. Challenges a wholesale redesign because it discards useful warmth and media relevance without evidence that the whole direction fails. |
| Interface/accessibility: presentation and comprehension | Separate visible logo, readable scope copy and functional controls. Challenges an indiscriminate “WCAG failure” verdict because an isolated decorative logotype has different obligations from live descriptive text or a link. Actual pages are absent. |
| Production/integration: delivery and maintenance | Existing exports are technically strong; do not rebuild a working packaging system to fix concept problems. Challenges “it passes hashes, so ship” because integrity and dimension checks cannot validate identity or final URLs. |
| Independent critique: necessity and opportunity cost | A repository-only launch could use the existing hero, clear live copy and a refined card without any new icon work. Challenges making optional favicons, monochrome assets or vector illustration a launch dependency. Conversely, merely adding files will not fix small-size recognition. |

**Synthesis:** separate release scopes. Keep the rich hero, correct meaning and hierarchy for the repository, and withhold approval of the general-purpose standalone identity until bounded design/optical review. No evidence justifies compulsory flatness, a wholesale visual restart, or declaring the current motif legally unsafe.

## D. Scorecard and asset dispositions

The user's weights are unchanged. Half-point scores distinguish mixed evidence within the 0–5 anchors. This is structured review judgment, not market validation. All six dimensions have evidence, but actual deployment and human perception remain partly untested.

| Dimension | Weight | Score / 5 | Points | Principal deduction / confidence |
| --- | ---: | ---: | ---: | --- |
| Distinctiveness and strategic fit | 25 | 2.5 | 12.5 | Player-first signal; independence relies on context. Medium. |
| Recognition and scalability | 25 | 2.0 | 10.0 | Micro-icon detail and reduced descriptions. Medium-high. |
| Coherence | 15 | 4.0 | 12.0 | Strong family; primary versus illustration role unsettled. High. |
| Typography, hierarchy, composition | 15 | 3.0 | 9.0 | Strong title/desktop art, weak supporting-text reduction. Medium-high. |
| Accessibility/context adaptability | 10 | 3.0 | 6.0 | Useful luminance structure; small details, background range and actual integration unresolved. Medium. |
| Technical delivery/maintainability | 10 | 4.5 | 9.0 | Excellent byte/format/derivation work; editable sources and deployment details incomplete. High on tested properties. |
| **Total** | **100 assessed** | | **58.5 assessed points** | **100% dimension coverage, not 100% test coverage** |

No score delta is reported: no supported baseline revision exists. The aggregate cannot override the P1 findings. The score concerns the supplied multi-use package, not a prediction that the hero will fail on a repository page.

| Family | Disposition | Shipping treatment |
| --- | --- | --- |
| README hero and both exports | **Keep** | Supplementary art with live title/description. 1200 export is a lighter option; 1800 may benefit higher-density wide display. Choose by real placement rather than filename. |
| GitHub social card | **Refine** | Retain illustration, rebuild readable role hierarchy and independent/community wording. |
| Optional padded OG card | **Refine if used** | Padding itself is correct. Do not require a separate ratio without a destination. |
| Master and simplified large icon illustrations | **Retain as exploration/reference** | May serve as secondary illustrations after approval; not approved universal primary symbols. |
| Favicon and web-icon identity family | **Redesign** | Bounded compact/optical redesign. Large touch/manifest exports are not encoding failures; they await the canonical symbol choice. |
| README/website examples and manifest | **Refine selectively** | Keep sound live-text advice and manifest `any` semantics; complete real integration. |
| Originals, inventory, hashes, source notes and review tooling | **Keep** | Preservation and review material; not all files belong in a public runtime asset folder. |
| Selected compact master and real live README context | **Missing and required for their respective scopes** | Compact master for primary-icon launch; integrated title/description for the recommended repository launch. |

[Machine-readable scorecard](scorecard.json) · [Exact family dispositions](dispositions.json)

## E. Recommended improvement strategy

**Choose a two-level system: expressive illustration plus deliberate compact identity.** This preserves the package's strongest work without pretending the small icon is solved.

Preserve the broad dark/cool-luminous color relationship, welcoming media context, large title hierarchy, and coherent source-to-export bookkeeping. Keep the hero's waves and depth unless they obstruct the selected layout. They are not inherently defects.

Simplify only where the use demands it. For a compact symbol, competing window chrome, multiple panels, traffic dots and the star should each justify their presence. A distinctive catalog/extension relationship should outrank a generic playback triangle. The exact geometric remedy is a design decision still to make, not a replacement created in this audit.

Rebuild the social text layer as editable typography. Keep the name, one useful independent-catalog descriptor, and only supporting content that remains legible. Move the exhaustive ecosystem list into live README/website copy.

**Targeted refinement** has lower disruption and preserves the established mood, but merely deleting detail could leave an even more generic player logo. **A wholesale redesign** could deliver a stronger curation metaphor, but would discard coherent illustration and spend effort beyond the evidenced faults. Start with the bounded compact-identity exercise and an unchanged-hero control. Escalate to a broader concept change only if the compact candidates still read as another player or cannot be distinguished in the intended contexts.

Do not reward additional files, gradients, effects or export sizes by themselves. Do not change correctly encoded exports until their source design has been approved. Do not gate a repository-only release on optional website work.

## F. Dependency-aware execution plan

All deliverable names below are **proposed paths, not files created during this audit**. “Small” is bounded copy/configuration work; “Medium” is one asset or integration workstream with QA; “Large” is identity construction requiring alternatives and judgment. These are effort bands, not time promises.

| Task | Priority / findings | Depends on | Discipline / effort | Proposed deliverable and acceptance |
| --- | --- | --- | --- | --- |
| **T01** Release scope and role statement | P1 / F02 | None | Maintainer + strategy / Small | `brand/RELEASE-SCOPE.md`: choose repository-only versus full identity/web; approve independence copy and required placements. |
| **T02** Canonical compact symbol | P1 / F01,F02,F05 | T01 | Identity designer / Large | `brand/source/symbol.svg`: letter-free, deliberate non-generic cue; compare against current art and official references at equal sizes. |
| **T03** Optical icon family | P1 / F01,F06 | T02 | Icon designer + production / Medium | `brand/source/symbol-small.svg`, `assets/brand/web/`: native 16–64 CSS checks at DPR1/2; ICO frames equal approved PNGs. |
| **T04** Readable social card | P1 / F02,F03,F05 | T01 | Brand/content design / Medium | `brand/source/social-card.svg`, `assets/brand/github-social-preview.png`: editable name/role line; readable reduced view; valid GitHub export. Existing illustration may remain secondary. |
| **T05** README meaning/integration | P1 / F02,F03 | T01 | Maintainer + accessibility / Small | `README.md`, `assets/brand/readme-hero.png`: complete live scope and independence statement; actual narrow/wide rendering; image-disabled test. |
| **T06** Website metadata and routes | P1, website only / F04 | T01,T03,T04 | Web developer / Small | Site head path to be chosen; proposed `site/public/brand/site.webmanifest`: resolved URLs, four OG properties, accurate dimensions, actual icon selection checks. |
| **T07** Provenance and reuse policy | P2 / F07 | T01 | Maintainer/release / Small | `brand/PROVENANCE.md`, `brand/ASSET-USE.md`: retain source evidence, qualify credentials, document authorization and reuse terms. |
| **T08** Source/type/color conventions | P2 / F05,F08 | T01 | Production + developer / Medium | `brand/STYLE.md`, `brand/FONT-DEPENDENCIES.md`, `brand/EXPORTS.json`: editable inputs, chosen output interpretation, font/license records and traceable exports. |
| **T09** Scoped release review | P1 / applicable findings | T01,T04,T05; conditional dependencies below | Maintainer, reviewers, representative users / Medium | `brand/RELEASE-CHECKS.md`: no applicable P1 open; selected-output hashes; native/context checks; separate human and technical review results. |

**Repository path:** T01, then T04 and T05 in parallel, then T09. Record the applicable maintainer authorization decision before publication. T02/T03/T06 do not block this narrower release.

**Primary identity/web path:** T01 → T02 → T03, with T04 in parallel; T06 waits for T03 and T04; T09 additionally waits for all required web work. Apply T08 conventions to changed sources. A public reuse or verified-credential claim additionally needs the relevant T07 evidence. The complete task graph, including conditional dependencies and acceptance tests, is [tasks.json](tasks.json).

## G. Copy-ready revision briefs

These are instructions for future revisions. No replacement brand assets or implementation changes have been produced in this audit.

### Brief 1: compact symbol and optical icon family

> **Objective:** create a letter-free primary symbol for an independent IINA ecosystem catalog, distinguishable from an official player icon and recognizable at 16–32 CSS pixels.
>
> **Preserve:** welcoming media relevance and, unless testing argues otherwise, the existing dark/cool-luminous relationship. Preserve the rich current illustrations as references, not immutable geometry.
>
> **Change:** make one distinctive relationship or silhouette carry recognition. Reduce application chrome, traffic dots, competing panels and sparkle where they survive only as noise. Do not simply enlarge or sharpen the existing 1254-pixel illustration. Do not replace the mark with an undifferentiated play triangle.
>
> **Geometry:** establish a compact master plus a separate 16–32 optical treatment where necessary. Increase useful occupied area relative to the current export, but choose margins by the actual 16/24/32 previews rather than a invented platform percentage. Protect essential negative spaces at 1×. No lettering.
>
> **Color/backgrounds:** use named roles such as dark backing, primary luminous edge, secondary accent and key foreground. Exact colors remain to be sampled and approved or explicitly proposed. Deliver either a documented intentional tile or a genuine alpha cutout for the selected placement. No exact palette or font is prescribed here.
>
> **Targets:** inspect 16/24/32/48/64/128/256 CSS pixels. Produce only selected production sizes, with adequate source density for the chosen display. PNG and a multi-frame ICO are appropriate for the supplied web pattern; a genuine editable vector master is proposed for maintainability. SVG raster wrappers do not satisfy that source requirement.
>
> **Pass/fail:** no letters; distinctive cue survives native 16–32 and grayscale; no essential feature depends on sparkle or hue alone; higher-density tests preserve the same identity; alpha and ICO frame contents match declarations. Final browser-tab selection and human matching remain separate checks.

### Brief 2: social preview and short role copy

> **Objective:** identify the project and its independent catalog role in a reduced social preview, without depending on microscopic supporting categories.
>
> **Preserve:** “Awesome IINA,” the coherent luminous media illustration and generous large-format hierarchy. Retain the illustration as secondary art even if the compact symbol is being developed separately.
>
> **Proposed exact copy:**
>
> `Awesome IINA`
>
> `Independent IINA community catalog`
>
> **Change:** replace the long descriptor with the short role line; remove the tiny category strip or transfer those subjects into surrounding metadata/live text. Reduce decorative competition only as needed to give the role line enough space. Do not keep unreadable text merely because it looks balanced at 1280 pixels.
>
> **Geometry/type:** preserve 2:1 for the selected GitHub output. Use editable text in the production layout, with an explicitly chosen and licensed typeface; no exact font has been identified in the current raster. Make title and role line the primary reading sequence. Maintain clear edges through actual tests rather than guessed platform safe zones.
>
> **Colors/background:** retain or intentionally revise the dark backing and light text. Confirm ordinary role-text contrast in the final layout. Gradients and raster illustration are allowed; a transparent social background is not required.
>
> **Targets:** 1280×640 GitHub PNG/JPG/GIF under 1 MB; inspect native delivery, 640×320 and proposed 320×160 stress view. Produce an optional 1200×630 derivative only for a confirmed destination and keep its declared metadata accurate.
>
> **Pass/fail:** exact spelling, no cramped title/descriptor, name and role readable without zoom in the agreed minimum view, no essential tiny category copy, no stretch, and actual repository upload/unfurl checked at release. Only the file/dimension checks were completed here.

### Brief 3: README header integration

> **Objective:** retain the existing hero's visual appeal without making its raster tagline the sole explanation of the project.
>
> **Preserve:** the supplied `exports/headers/readme-hero-1200x400.png` or `readme-hero-1800x600.png`, chosen for actual display width/density. No immediate repaint is required for a supplementary hero.
>
> **Proposed live heading:** `Awesome IINA`
>
> **Proposed live description:** `An independent community catalog and discovery toolkit for IINA plugins, playback workflows, shaders, media tools, automation, and developer resources. Not affiliated with the IINA project.`
>
> **Change:** put this meaning in selectable live README text. Choose alt text according to whether the image adds information or merely duplicates the neighboring heading; do not force duplicate narration. A responsive replacement header is optional if the current hero is purely supplementary.
>
> **Geometry/type/color:** preserve the 3:1 artwork ratio; no forced stretch or unverified cropping. Let the live heading/body use the repository's normal readable typography. Existing opaque dark art is permitted on both surrounding themes as an intentional panel.
>
> **Targets and acceptance:** verify actual wide and narrow README rendering, including a proposed 390-pixel content test. With images disabled, name, role, scope and independence remain clear. A viewer need not zoom into the raster tagline to understand the repository. If the owner requires all tagline text to be readable inside the image itself, rebuild a separate reduced-layout header instead of simply rescaling it.

### Brief 4: production, metadata and provenance handoff

> **Objective:** make future edits and integration traceable without overstating readiness or provenance.
>
> Keep original PNGs and their credential data unchanged. Record selected source, export transform, dimensions, bytes, hash, color interpretation and approval role for each release file. Record that current resized PNGs omit source credentials. Never transplant an old signature onto changed pixels.
>
> Keep symbol geometry and card typography editable. Record the chosen font source and license; do not infer the raster's exact font or package font binaries unnecessarily. The hero may remain raster. Define named color roles only after sampling/approval or explicitly proposing new colors.
>
> For a website release, provide `og:title`, `og:type`, `og:image` and canonical `og:url`; resolve placeholders and match image dimensions to the actual file. Verify icon paths relative to the deployed manifest and site base path. Retain `purpose: any` unless a separate tested maskable treatment is commissioned.
>
> Acceptance requires actual editable inputs, matching export properties, explicit reuse/approval terms, no unsupported “verified credentials” statement, and a separately recorded deployment/browser check. No site files or revised branding were created here.

## H. Release gates and unresolved questions

### Technical gates

**Completed:** archive entry screening and inventory; supplied checksums; image decoding; PNG CRCs; ICO frame content; derivation pixel equality; review-page local references; manifest-local icon resolution; native CSS rendering in Chromium DPR1/2; grayscale and labeled color-vision simulations; narrow credential content-binding checks.

**Not completed:** actual GitHub upload/share rendering, deployed URLs/MIME responses, browser-tab favicon choice/caching, Safari or iOS touch behavior, external platform crops, physical color-managed display validation, full C2PA signature/trust/time/revocation validation. No motion assets were supplied, so animation timing, reduced-motion behavior and static fallbacks are not applicable.

### Visual and content gates

A maintainer must decide which assets are actually primary identity versus illustration and whether the immediate release is repository-only. Approve the name and independent-community descriptor. Inspect the refined social card at its agreed reduced width. A primary-icon launch additionally needs native optical review, not just encoding approval. No applicable P1 may remain open for the chosen release scope.

### Human recognition review

A proposed formative check should include IINA users and plugin/developer contributors. First ask what the full card appears to represent without suggesting the desired answer. Separately, after showing the project identity once, ask participants to match its small icon among relevant media/catalog identities. This distinguishes initial semantic interpretation from learned recognition.

Record participant count, exact stimuli, display conditions and responses. Agree on an acceptance threshold before testing; do not retrofit one after the results. A small convenience sample can expose confusion but cannot establish population-level recognition or market success. No such user study has been performed.

### Governance and legal scope

Maintainer approval and asset reuse policy are missing evidence, not proof of unlawful use. The limited reference comparison does not clear trademarks or establish originality. Seek qualified legal review when a specific concern or requested assurance warrants it. C2PA validation, even if later completed, is not a substitute for this ownership/reuse decision.

### Decisions still needed, without blocking completed audit work

1. Is the next release only a repository, or does it include a website/primary favicon identity?
2. Should the current illustrations remain secondary art, or must the standalone mark become the project's main recognition device immediately?
3. Who approves public use and what reuse permissions should contributors receive?

**Release recommendation:** publish a carefully selected repository presentation after F02/F03 integration and social-copy fixes. Retain the originals and strong export records. Do not label the current resampled favicon family, or the package as a whole, a finished general-purpose identity system.

---

## Sources and evidence navigation

All external sources below were checked on **16 September 2026**. References support platform/standard claims; asset observations are tied to the supplied paths and generated evidence records. Official comparison logos are not redistributed as project assets in this audit package.

- **S01:** [GitHub: customizing a repository social preview](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview).
- **S02:** [Open Graph protocol](https://ogp.me/).
- **S03:** [MDN: web app manifest icons](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/icons).
- **S04:** [MDN: HTML link element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/link).
- **S05:** [W3C: WCAG 2.2 contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
- **S06:** [W3C: WCAG 2.2 images of text](https://www.w3.org/WAI/WCAG22/Understanding/images-of-text.html).
- **S07:** [W3C: WCAG 2.2 non-text content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html).
- **S08:** [IINA official website](https://iina.io/), with [official 60-pixel icon](https://iina.io/images/iina-icon-60.png).
- **S09:** [mpv official website](https://mpv.io/), with [official 128-pixel logo](https://mpv.io/images/mpv-logo-128-0baae5aa.png).
- **S10:** [Awesome official logo source](https://github.com/sindresorhus/awesome/blob/main/media/logo.svg).
- **S11:** [Awesome official media documentation](https://github.com/sindresorhus/awesome/blob/main/media/readme.md).
- **S12:** [Chromium DevTools Emulation protocol](https://chromedevtools.github.io/devtools-protocol/tot/Emulation/#method-setEmulatedVisionDeficiency).
- **S13:** [C2PA technical specification 2.4](https://spec.c2pa.org/specifications/specifications/2.4/specs/C2PA_Specification.html).

**Machine-readable outputs:** [Inventory](asset-inventory.csv), [requirements](requirements.json), [findings](findings.json), [tasks](tasks.json), [scorecard](scorecard.json), [dispositions](dispositions.json), [sources](sources.json).  
**Test evidence:** [Inspection results](evidence/inspection-results.json), [asset details](evidence/asset-details.json), [checksum verification](evidence/checksum-verification.json), [browser measurements](evidence/browser-tests.json), [text diagnostics](evidence/text-size-and-contrast-diagnostics.json), [embedded provenance](evidence/embedded-provenance.json).  
**Image index:** [Preview reading guide](previews/README.md).
