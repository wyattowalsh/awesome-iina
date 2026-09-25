# Public catalog site audit

Read-only `/design` audit of the awesome-* web app (`src/awesome_iina/site/` → `dist/site/`). **Do not treat this file as a request to edit catalog CSS/HTML/JS.**

**Counts:** **2 P1**, **7 P2**

**URL used:** **http://127.0.0.1:8001/** (existing `python3 -m http.server 8001 --bind 127.0.0.1 --directory dist/site`). Port **8000** is a different uvicorn process (`openopps`) that returns **404** for `/`. Did not spawn a second catalog server. Did not touch Starlight `:4321` or plugin preview `:4173`.

**Thesis:** The catalog is an operational awesome-list companion grouped by exclusive provenance, not a dashboard. Register is technical and honest. Density should stay list-like: short Start here, then find/filter, then provenance sections. Light theme must use `--brand-light-cyan` (`#1749C4`) for text, links, and `:focus-visible` — never kit cyan `#43D9F5` (~1.6:1 on `#F5FAFF`).

Contract: [`design.md`](../../design.md). Surface map: [`surfaces.md`](surfaces.md).

---

## Findings

- **[P1] `src/awesome_iina/site/templates/index.html.j2:98-144`** — Start here is **19** featured rows (**10** `active`, **9** `unknown`) rendered *above* search/filters. At 1280×800, `#filters` is at **y ≈ 2902** (`#start-here` ≈ **1748px** tall); it is not in the first viewport. Keyboard tab order has **38** stops before `#search` (skip, nav, Contents, then all 19 Start-here names). `design.md` asks for Start here as a **short** featured list, not a second catalog. Impact: the primary find control is below a long onboarding list; nine “unverified” first-stops undermine “start here.” **Fix:** Shrink `featured` in `catalog.yaml` to a small official/onboarding set. Place `#filters` immediately under the catalog heading / provenance bar; keep a short Start here list after filters or beside Contents.

- **[P1] `src/awesome_iina/site/static/catalog.css:5-10` + `:63-70` + `:269-277`** — Light `--border` is `color-mix(… ink 52%, foreground)` → computed **rgb(127,139,167)** on `--card` **rgb(234,239,247)** = **2.96:1** (WCAG 2.1 AA **1.4.11** needs **3:1**). Reset and Catalog labels use `--card` fill on the `--card` filter panel (**1:1** fill); the only edge is that border. Search/select fills are `--background` (`#F5FAFF`) so they read slightly, but their border vs the card is the same **2.96:1**. Dark theme **passes** (border vs card **3.41:1**). Impact: in light mode, Reset / Catalog labels barely exist as controls. **Fix:** Darken `--border` on light (higher ink mix) until ≥3:1 on `--card`, and/or give action buttons `--background` or `--muted` fill so they are not card-on-card.

- **[P2] `src/awesome_iina/site/templates/index.html.j2:48-63`** — Home link `aria-label="Awesome IINA home"` wraps `<img alt="Awesome IINA">`, then `<h1>Awesome IINA</h1>`. The a11y tree exposes the image name and the heading. Screen readers hear the product name twice (plus the home label). **Fix:** Empty `alt` on the decorative wordmarks; keep the `aria-label` on the link and the H1 as the page title.

- **[P2] `src/awesome_iina/site/templates/index.html.j2:91-97` + `catalog.css:227-243`** — The stacked provenance bar is an `<svg role="img">` with a visually-hidden label. Adjacent segment contrast is **~1.02–1.69:1** (core `#1749C4` vs official `#643BB5` is 1.02:1). Sighted users cannot decode the mix; Contents already has the counts. **Fix:** Add a visible legend, or drop the bar and keep Contents counts only.

- **[P2] `src/awesome_iina/site/templates/index.html.j2:115`** — Search placeholder `rgb(117,117,117)` on `#F5FAFF` is **4.39:1** (needs 4.5:1 if treated as text). The visible label “Search the catalog” is present, so this is supplementary. **Fix:** Color the placeholder with `--muted-foreground` (measured **5.87:1** on the canvas).

- **[P2] `src/awesome_iina/site/static/catalog.css:12`** — `--radius: 0.5rem` computes **8px**. `design.md` token table specifies **7px**. Low visual risk; contract drift. **Fix:** `--radius: 7px`.

- **[P2] `src/awesome_iina/site/static/catalog.js:152-154` + `index.html.j2:203-216`** — `showModal()` sends first focus to `#labels-close` (only focusable control, at the bottom of the glossary). Esc and focus restore to the opener **work** when the opener was focused. Impact: keyboard users skip the definitions and land on Close. **Fix:** `tabindex="-1"` on the dialog title and focus it on `showModal()`, or move a close control to the top without removing Esc.

- **[P2] `src/awesome_iina/site/static/catalog.css:369-377`** — Project heading `<a>` has no `min-height: 44px` (Start here / nav / filters do). Measured **~26px** tall at desktop. WCAG 2.2 **2.5.8** (24px) passes; the catalog’s own 44px chrome rule does not. **Fix:** Give `.project-heading h4 a` the same 44px inline-flex min-height as `.start-list a`.

- **[P2] `src/awesome_iina/site/templates/index.html.j2:68`** — The CI chip is a text link to `…/actions/workflows/ci.yml` on `wyattowalsh/awesome-iina`. Origin `main` is still a stub README with no Actions workflows (see README/GFM audit). Visitors get a GitHub 404, not status. The chip is not a live SVG, and it is **not** an awesome.re link (that part is honest). **Fix:** Point CI at a live workflow once it exists, or drop the chip until then.

---

## Strengths

- Light theme does **not** use `#43D9F5` as text, links, or `:focus-visible`. `--primary` / `--flag-official` / `--ring` resolve to `--brand-light-cyan` **`#1749C4`** (**7.18:1** on `#F5FAFF`). The forbidden pair `#43D9F5` on `#F5FAFF` is **1.60:1** and is not applied. Dark theme uses `#43D9F5` on `#080F2B` (**11.21:1**) — navy/cyan split matches `design.md`.
- Theme control accessible name stays **Dark theme**; `aria-pressed` flips (`false` → `true`). Sun/moon icons are `aria-hidden`. CSS `prefers-color-scheme` still themes the page when JS is off.
- Exclusive provenance sections: IINA core, official plugins, plugin index, other native plugins, developer resources, media tooling, historical. Empty Type `<option>`s omitted. Companions omitted when empty. Contents counts update and hide when filters leave a section at zero.
- Start here is a **list** (name + one-liner), not a wrapping chip cloud. Names jump to on-page `#slug`; `h4` still opens the project URL.
- Progressive enhancement: without JS, all **75** `.project` rows are in the HTML; `#filters`, theme toggle, and both Catalog labels openers stay `hidden`; `<noscript>` tells people to use Find. With JS: search `danmaku` → 2/75; empty query `zzzz-no-such-plugin` shows “No matches…” and hides sections; Reset restores 75 and focuses search; `?q=` / `?category=` / `?status=` are shareable.
- Native `<select>` (44px, chevron sprite) and native `<dialog>` (`showModal`, Esc closes, focus returns to opener). No command palette, no icon CDN, CSP `default-src 'self'`.
- Skip link, `:focus-visible` 3px `--ring`, `prefers-reduced-motion` (scroll + 120ms named-property transitions), `overflow-wrap: anywhere`, container query on the project list. Visible labels on icon+text controls. Awesome mark is a `<span>`, not a link to awesome.re, with an honesty note.
- Body / lede / official / featured text contrast in both themes is ≥4.5:1 (light muted-foreground **5.87:1**; dark muted **5.58:1**). Hover in light is `#1749C4`, not kit cyan.

---

## Proof

| Check | Result |
| --- | --- |
| Preview | Reused **http://127.0.0.1:8001/** (`dist/site/`). `curl -sI http://127.0.0.1:8000/` → uvicorn **404**. No new `:8000` server. |
| Desktop | Chrome DevTools page on 8001, **1280×800** then **1280×900**, `color-scheme: light` then in-page Dark theme toggle |
| Narrow | Isolated context `catalog-design-audit-390`. Requested **390×844**; Chromium floor rendered **500×844** (`max-width: 540px` and `800px` queries **true**). Column masthead, 1-col filters, no horizontal overflow at 500. True 390 not obtained (nav would wrap via `flex-wrap`, not measured live). |
| Clicked / exercised | Skip (focus: 3px ring, `top: 8px`); Contents → `#iina-core`; Start here → `#iina`; Search `zzzz-no-such-plugin` (empty state, URL `?q=`); Search `danmaku` (2/75); Category `playback` (16/75); Status `unknown` (46/75); **Reset**; **Catalog labels** open/close; **Escape** on dialog (closes, focus → opener); **Dark theme** (`aria-pressed="true"`, logos swap, official flag → `rgb(67,217,245)`) |
| Contrast | Computed styles + WCAG luminance. Light `#43D9F5` as text **not used**. Light control border vs card **2.96:1**. Dark same pair **3.41:1**. |
| No-JS | `GET http://127.0.0.1:8001/` without executing script: 75 projects, filters/theme/labels `hidden`, noscript present, `#43D9F5` absent from HTML/CSS |
| Console / network | No console errors. UI assets 200: `tokens.css`, `catalog.css`, `catalog.js`, wordmarks, `icons.svg#sun`, favicon |
| `/design` scanner | `scan_frontend.py` on `src/awesome_iina/site/static`: 0 missing alt; reduced-motion present; 1 container query; hardcoded hex only theme-color `#080F2B` / `#F5FAFF` in JS |

**Blockers:** 390 CSS pixels not reachable in this Chrome window (500px minimum). No axe/Lighthouse run. No VoiceOver pass. Screenshots written under `/tmp/catalog-audit-*.jpeg` (desktop light, narrow light), not committed.
