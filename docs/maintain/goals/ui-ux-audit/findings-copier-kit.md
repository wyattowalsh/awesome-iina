# Copier Starlight / consumer chrome / kit review — UI audit

Read-only `/design` audit (2026-09-17). No implementation.

**Thesis:** Generated plugin docs must read as the author’s product (Starlight zinc/blue, system fonts), never as Awesome IINA catalog chrome. Maintainer `starter/site/` may map kit `--brand-*`. Copier `site/` must not. Kit `START-HERE.html` / `review/index.html` are operator review surfaces, not consumer output.

**Counts:** **P1 = 0**, **P2 = 5**.

**Generated CSS contains `--brand-*`?** **No.** Copier twin `starter/template/[% if docs_profile == "starlight" %]site[% endif %]/src/styles/{global,custom}.css` has zero `--brand-*` and zero catalog cyan/navy hex (`#43d9f5`, `#080f2b`, `#132555`, `#1749c4`). Maintainer `starter/site/src/styles/global.css` **does** define the full kit `--brand-*` set; that is allowed.

`src/awesome_iina/site/brand.json` → `consumer_plugins_receive_catalog_identity: false`.

---

## Findings

- [P2] `starter/copier.yml:13-26` / `starter/template/README.md.jinja:41-48` / `starter/template/docs/content/updating.md:16-17` — Copier **updates overwrite generated `site/**`**. `_exclude` keeps `docs/content/**` and `docs.config.json` on update; it does **not** exclude `site/**`. Template-maintainer copy in `starter/README.md` already says this; the **generated** README and `updating.md` do not. `updating.md` calls “identity” a seed (plugin name/identifier/`Info.json`), which is easy to misread as Starlight theming. Impact: authors who brand docs in `site/src/styles/global.css` or `astro.config.ts` lose that chrome on the next template update; only `docs.config.json` title/description/base persist. Recommended: warn in generated README + `updating.md` that Starlight CSS/config is managed and will be replaced; if consumer theming is desired, add an excluded overlay (do not copy catalog `--brand-*`).

- [P2] `starter/template/[% if docs_profile == "starlight" %]site[% endif %]/src/styles/global.css:7-53` — Light `--primary` / `--ring` are `var(--color-blue-700)` (good: not kit cyan). `@theme` still maps `--color-accent-500` to `var(--color-blue-500)` instead of the shadcn aliases. [`design.md`](../../design.md) asks Starlight accent/gray to come from those aliases, never raw `#43D9F5`. Impact: Starlight link/accent chrome may use blue-500 on zinc-50, which is a plausible WCAG AA miss for body-sized links. Cannot confirm without a built consumer site. Recommended: drive the accent scale from `--primary` / zinc aliases (still no `--brand-*`).

- [P2] `starter/template/src/[% if preset != "command" %]ui[% endif %]/style.css.jinja:1-8` / `index.html.jinja:6-13` — Webview chrome is identity-clean (`Canvas` / `CanvasText` on overlay; no catalog hues). It has no `:focus-visible` rules, no `prefers-reduced-motion`, and a hardcoded `<title>Plugin status</title>` instead of `[[ plugin_name ]]`. Impact: keyboard focus relies on UA defaults; reduced-motion users get no named-property cap; the browser-preview tab does not name the plugin. Preferences HTML (`preferences/index.html.jinja`) has a labeled checkbox but no viewport meta and no CSS (host-styled in IINA).

- [P2] `src/awesome_iina/site/kit/review/index.html:4-5` — Operator review UI. At `max-width: 700px`, `header a span { display: none }` hides “Awesome IINA” while the 32px mark uses `alt=""`. The header home control becomes an **unnamed link** for assistive tech and a textless icon for sighted mobile users. Skip link and `:focus-visible` exist on desktop. `prefers-reduced-motion` only sets `scroll-behavior`. Font stack names **Inter** though the kit ships no Inter files (falls back to `system-ui`). Light accent `#1749c4` (not `#43d9f5`) matches the catalog light/dark split.

- [P2] `src/awesome_iina/site/kit/START-HERE.html:1` — Operator landing is a five-line stub (`h1` + two links, inline `font:20px/1.6`, `max-width:700px`). No skip link, no `<main>`, no `color-scheme`, no theme toggle. Functional as a file:// index into `review/index.html` and `README.md`; visually unrelated to the designed review page. `REVIEW-PROMPT.md` is an audit brief, not a UI surface. Historical `kit/archive/original-kit/review/` is not current product chrome.

No P1 identity leak: catalog `--brand-*` / cyan-navy do not appear in Copier-generated plugin CSS.

---

## Strengths

- Identity split is implemented as a twin, not a comment: Copier `global.css` uses zinc/blue shadcn aliases + Tailwind v4 layer order (`base, starlight, theme, components, utilities`); maintainer `starter/site` maps kit `--brand-*` with light `--brand-light-cyan` / dark `--brand-cyan` (no `#43D9F5` as light text or focus).
- Contract tests: `starter/tests/test_expansion.py` (`test_starlight_css_identity_split`, matrix `--brand-` assertion) and `starter/tests/test_real_copier.py` (real copy with `docs_profile: starlight`). Cyan hex `43d9f5` is also forbidden in generated styles.
- Copier Starlight `astro.config.ts` has **no** logo, favicon, or social-card fields; `docs.config.json.jinja` titles the site from `[[ plugin_name ]]`. No PNG/SVG/ICO in `starter/template/`.
- Generated `README.md.jinja` is operational (bootstrap/check/docs), not a catalog wordmark/badge surface.
- Motion on Copier CSS: named-property transitions 120ms, gated by `prefers-reduced-motion: no-preference`; reduce branch zeroes transition/animation/scroll.
- Overwrite of `site/**` re-asserts the zinc/blue split on upgrade (cannot silently keep a leaked catalog palette in managed CSS).
- Kit review page is a real operator UI: skip link, theme toggle (`aria-pressed`), light/dark token split, native-size icon strip, independence copy. Catalog identity here is correct and must stay out of Copier.

---

## Proof

| Check | Result |
| --- | --- |
| Copier `site/src/styles` `rg --brand-\|43d9f5\|080f2b` | No matches |
| Maintainer `starter/site/src/styles/global.css` | `--brand-background` … `--brand-light-violet` present (allowed) |
| `brand.json` | `consumer_plugins_receive_catalog_identity: false` |
| Copier `_exclude` on update | `docs/content/**`, `docs.config.json`, `README.md`, `src/**`, … — **not** `site/**` |
| `/design` scanner | Copier Starlight CSS: no hardcoded kit hex. Kit `review/index.html`: 16 hardcoded kit hex (expected). `START-HERE.html`: `max-width:700px` flagged as fixed-size. |
| Rendered consumer Starlight | **Blocked.** No generated plugin `pnpm run docs:dev` in this pass. Claims are from templates + tests, not a running `http://127.0.0.1:4321/`. |
| Kit HTML in browser | **Not interacted.** Static source only; `file://` or `python3 -m http.server` from `src/awesome_iina/site/kit/` would be the live proof path (`surfaces.md`). |

Commands used: read twins + `brand.json` + `design.md`; `rg`/`find` on Copier `site/` and `starter/template`; `uv run python …/scan_frontend.py` on Copier Starlight CSS, `starter/template/src`, `START-HERE.html`, `review/index.html`.
