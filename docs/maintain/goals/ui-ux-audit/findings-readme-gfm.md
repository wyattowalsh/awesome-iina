# README / docs GFM audit

Read-only design audit of GitHub Flavored Markdown surfaces. **Do not treat this file as a request to edit `README.md.j2` or generated `README.md`.**

**Counts:** **4 P1**, **8 P2**

**Thesis:** The public GitHub landing is an awesome-list for IINA users and plugin authors (scan, decide, jump). `docs/` is a contributor handbook, not a site. Register is technical and honest. Density should stay list-like: short Start here, then the catalog, then maintainer material. Identity is kit wordmarks plus a real H1. Badges must be live and must not imply an [awesome.re](https://awesome.re) listing.

Contract: [`design.md`](../../design.md) (wordmark + H1, honest badges, Contents, Start here as a **short** featured list). Badge rules: `/design` `references/badge-systems.md`. Surface map: [`surfaces.md`](surfaces.md).

---

## Findings

- **[P1] `README.md:9` / `src/awesome_iina/catalog/templates/README.md.j2:9`** — The Awesome badge image is the official listing mark and its link target is `https://awesome.re`. Line 20 (and `docs/catalog/policy/awesome-list-policy.md`) correctly say this catalog is **not** an awesome.re / sindresorhus listing and that `lint-awesome` is repository-specific. The chip still does the same job it does on listed repos: it sends readers to the listing site. On GitHub the badge row sits above the disclaimer, so a skim can read “official Awesome list.” `lint-awesome` only requires the substring `https://awesome.re/badge.svg` (`src/awesome_iina/repo/awesome_lint.py`), which encodes the convention rather than the disclosure. **Fix:** Keep the image only if the visual convention is required; point the link at `docs/catalog/policy/awesome-list-policy.md` (the true source). Do not link a non-listing at awesome.re.

- **[P1] `README.md:10-13`** — Four native GitHub Actions badges (CI, Nightly discovery, Deep discovery, Link audit) name `wyattowalsh/awesome-iina` workflow SVG endpoints. GET (follow redirects, 2026-09-17) returned **HTTP 404** `text/plain` (9 bytes) for all four. `awesome.re/badge.svg` and the MIT shields badge returned **200** `image/svg+xml`. `gh api repos/wyattowalsh/awesome-iina/actions/workflows` is empty; origin `main` is the 14-byte stub README (`# awesome-iina`). On GitHub those four chips are broken images, not status. **Fix:** Keep native workflow badge URLs (right provider). Do not treat the row as live until each `…/badge.svg` returns `image/svg+xml`. After workflows exist on the default branch, re-GET. Until then the generated README asserts CI truth the named origin cannot show.

- **[P1] `src/awesome_iina/repo/awesome_lint.py` (no `picture` / `srcset` / `<img`) + `src/awesome_iina/repo/links.py`** — The README hero is HTML `<picture>` with relative `srcset` / `src` to kit SVGs. `lint-awesome` does not parse that markup. Local Markdown links skip images (`(?<!!)` on `_LINK`). Link audit collects catalog HTTP URLs, not README `srcset`. A renamed or missing wordmark stays green in `just lint-awesome` / link audit. Today the three paths resolve (`wordmark-light.svg` / `wordmark-dark.svg` exist). `docs/README.md` and `docs/maintain/brand.md` use the same pattern with **no** awesome-list linter at all. GitHub’s documented fallback is the `<img src>` (`[Specify theme context for images in Markdown](https://github.blog/changelog/2022-08-15-specify-theme-context-for-images-in-markdown-ga/)`); if **that** 404s, the hero is a broken image plus alt. **Fix:** Resolve `picture source[srcset]`, `img[src]`, and Markdown images against the repo root in `lint-awesome` (README required; handbook pictures optional). Do not rely on `lint-awesome` for picture integrity until that exists.

- **[P1] `README.md:60-80` vs `## Curated ecosystem` (`design.md` “Catalog list grammar”)** — Start here is 19 featured rows (25% of 75 projects): 6 official, 10 `active`, **9 `unknown`**. Then the same rows appear again under category H3s. `design.md` asks for Start here as a **short** featured list, not a second catalog. Nine “Maintenance status unverified.” lines in the onboarding block undermine “start here.” Foundational tools (FFmpeg, mpv, MKVToolNix, yt-dlp) sit in the same dense list as community plugins. **Fix (product, not a README hand-edit):** Shrink featured in `catalog.yaml` to a small onboarding set (official player + first-party plugins/template/types, plus a few verified starting points). Keep the rest in Curated ecosystem only.

- **[P2] `README.md:4` + `README.md:7`** — `<img alt="Awesome IINA">` immediately precedes `# Awesome IINA`. GitHub exposes both. Screen readers hear the name twice. The SVG also has `<title>Awesome IINA wordmark</title>` (ignored when referenced as `img src`). **Fix:** Empty `alt` on the decorative wordmark when the H1 is the accessible name; keep a non-empty alt only if the H1 is removed.

- **[P2] `README.md:1-5` fallback** — `<img src>` is always the **light** wordmark (`#132555` ink). GitHub.com supports `<picture>` + `prefers-color-scheme`. Clients that ignore `<picture>` (some mobile/app/notification/Markdown previews) show navy-on-dark. **Fix:** Keep `<picture>` for github.com; accept light fallback, or add GitHub’s `#gh-light-mode-only` / `#gh-dark-mode-only` Markdown images as a second, GitHub-specific pair. Full proof needs GitHub dark + a non-`picture` client.

- **[P2] `README.md:4` dimensions vs SVG** — Markup is `width="440" height="71"`. Files are `width="400" height="64"` / `viewBox="0 0 400 64"` (~6.25 vs ~6.20). GitHub uses width/height for layout; small stretch/CLS risk. **Fix:** Match intrinsic 400×64 (or a chosen display size with the same ratio).

- **[P2] `README.md:9-14` badge system** — Six badges (within the 3–8 range). Mix: awesome.re custom SVG, four GitHub Actions native SVGs, one shields license with **no** `style` and **no** `logoColor` (scanner: `logo_color_mentions: 0`, `style_mentions: 0`). No `BADGES:START`/`END` markers. License link to `LICENSE` is correct (local MIT header). **Fix:** Align shields with native GitHub size (`style=flat` or `flat-square`, explicit `logoColor`). Add markers only if badge edits should stay bounded. Do not add vanity/social badges.

- **[P2] `README.md:10-13` reader order** — After Awesome, the row is four maintainer workflow chips (including two discovery scans) before License. Badge-systems order is Status → Quality → Package for *reader* decisions. Catalog consumers need “is this list maintained?” (one CI chip), not nightly vs Sunday vs link-audit. **Fix:** One CI badge in the header; move discovery/link-audit to Automated discovery / Maintenance toolkit (or drop from the hero row).

- **[P2] `src/awesome_iina/catalog/generator.py:39-54` row grammar** — Flags (`Official · Featured`) and tags share backtick chips. Status is bold in the same line. `notes` (collisions, install caveats) append with no separator. On GitHub, tags wrap into a backtick cloud and collide with flags. `design.md` wants name · flags · description · tags. **Fix:** Distinguish flags from tags (bold/plain vs backticks, or a middle-dot prefix). Put notes on a following indented line or after an em dash.

- **[P2] `README.md:34-58` Contents** — 23 TOC bullets. Category **H3s** under Curated ecosystem are listed as siblings of that H2 (useful jumps, flat IA). GitHub also builds an Outline once there are two+ headings ([GFM headings](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#headings)). Keep Contents (awesome-list convention); it will duplicate Outline. **Fix:** Optionally nest category links under Curated ecosystem in the Contents list; do not drop Contents.

- **[P2] `docs/README.md:1-12` vs `docs/maintain/brand.md` “Documentation index”** — Handbook index uses the same theme-aware wordmark (relative `../src/...` paths **do** resolve). Brand table says that wordmark **links** readers to catalog and developer guides; the `<picture>` is not wrapped in `<a>`. Independence copy lives on the root README and `brand.md`, not next to the docs wordmark. Nested `docs/*/README.md` pages are correctly plain GFM indexes (no fake app chrome). **Fix:** Wrap the docs index wordmark in a link to the catalog or `#catalog` map, and add one independence sentence under the H1. Do not turn `docs/` into a site.

---

## Strengths

- Wordmark **picture** plus a real `# Awesome IINA` H1 matches `design.md` (identity is not a screenshot hero). Kit light/dark SVGs are outlined, readable artwork; light title fill is navy `#132555`, not kit cyan-as-text.
- `<picture>` / `prefers-color-scheme` / fallback `<img>` matches GitHub’s documented theme-aware HTML. `alt` and `width`/`height` are present (scanner: `img_without_alt: 0`, `img_without_dimensions: 0`).
- Relative wordmark paths from `README.md`, `docs/README.md`, and `docs/maintain/brand.md` all resolve to existing kit files.
- Line 20 is unusually honest for an unofficial awesome-inspired list: not an awesome.re listing; `lint-awesome` is local policy. Independence from IINA is stated up front and again in Brand.
- `## Contents`, generated-section HTML comment, contributing + NOTICE links, and alphabetized entries match the repo’s awesome-list invariants (`awesome-list-policy.md` / `lint-awesome`).
- “At a glance” frames **75 / 13 / 60 / 12 / 19** as reviewed-catalog cardinality, not a global census.
- Status language (`unknown` → “Maintenance status unverified.”, archived/historical retained with reasons, plugin-id collisions called out) is trust-preserving, even when it hurts Start here density.
- `docs/` is a handbook: domain folder table, GFM `> [!NOTE]` / `> [!IMPORTANT]` / `> [!WARNING]`, no Starlight `:::`, no SPA, no ingest-into-site. Nested catalog/discovery/history/maintain indexes are maps, not product UI.
- License badge label matches the MIT `LICENSE` file. Workflow filenames in the template match local `.github/workflows/*.yml` (ci, discovery-nightly, discovery-deep, link-audit).

---

## Proof

| Check | Result |
| --- | --- |
| Sources | Generated `README.md` (388 lines), template `README.md.j2`, `docs/README.md`, nested `docs/*/README.md`, `docs/maintain/design.md`, `brand.md`, `awesome_lint.py`, `generator.py` `render_project`, `catalog.yaml` featured set, kit SVGs |
| `/design` scanner | `uv run python ~/.cursor/skills/design/scripts/scan_frontend.py README.md` — 6 badge URLs, 4 native Actions + 1 shields + awesome.re `badge.svg`, no markers, no `logoColor`/`style`. `docs/` — wordmarks have alt+dimensions; `#43D9F5` hits are design-token prose, not README chrome |
| Badge GET | `awesome.re/badge.svg` 200 SVG; four Actions `badge.svg` **404**; shields MIT 200 SVG |
| Origin GitHub | `gh api` README size **14** (`# awesome-iina`). No Actions workflows. Chrome DevTools: [github.com/wyattowalsh/awesome-iina](https://github.com/wyattowalsh/awesome-iina) H1 **awesome-iina**, no wordmark, no badge row, no catalog. Screenshot: `/tmp/awesome-iina-github-origin-landing.jpeg` (desktop viewport). Logged-out appearance control not used for a dark-mode pass |
| Wordmarks | Light/dark SVGs opened as images; contrast is fine on white / near-black. Not GitHub-wrapped |
| Featured | 19 featured; status `active` 10 / `unknown` 9; official 6 |

**GitHub-only proof blockers (cannot fully render GFM):**

1. **Origin is not the generated README.** github.com still serves the initial-commit stub. Chrome/GitHub proof of wordmark, badges, Contents, Start here vs catalog, dark/light `<picture>`, and mobile wrap is **unavailable** until this working tree is on the default branch.
2. **GitHub sanitizer, CAMO, and CSS** (image `max-width`, Outline vs Contents, alert rendering, SVG-as-`img`) are not reproduced by local Markdown preview. Existing Chrome tabs `127.0.0.1:4321` and `:8001` are other surfaces, not GFM.
3. **Theme and clients:** No GitHub dark-mode screenshot of the generated README. No GitHub mobile app, notification HTML, or `picture`-less preview. Fallback contrast (P2) is inferred from SVG fills + GitHub’s documented fallback, not seen.
4. **Post-publish badge color** (passing/failing/no-runs) cannot be shown while workflow SVGs 404.
5. **awesome.re membership** was not found on the live listing page in this pass; absence plus repo policy is the evidence, not a full crawl of sindresorhus/awesome.

Local Markdown preview of `README.md` can only approximate GitHub. Strongest next proof: push or compare against a GitHub blob preview of the generated file, then desktop + mobile + light/dark screenshots of the **rendered** README, and re-GET workflow badge SVGs.
