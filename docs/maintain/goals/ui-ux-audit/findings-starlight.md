# Maintainer Starlight — UI audit

Read-only `/design` audit (2026-09-17). No implementation. Did not edit `starter/site/` CSS or Astro configs.

**Thesis:** Maintainer docs are an operational handbook for template authors (generate → profiles → verify → docs pipeline → maintain). Register is technical. Identity **may** use kit `--brand-*` with the catalog light/dark split. Light text, links, and focus must not be kit cyan `#43D9F5` on white.

**Counts:** **P1 = 0**, **P2 = 8**.

**Live URL:** [http://127.0.0.1:4321/](http://127.0.0.1:4321/) — existing `python3 -m http.server 4321 --bind 127.0.0.1 --directory starter/site/dist` (not `docs:dev`). Dist `index.html` mtime is after `global.css` / `astro.config.ts`. Did not start a second docs server. Did not bind catalog `8000`/`8001` or plugin `4173`.

---

## Findings

- [P2] `starter/docs/content/{documentation,maintenance,verification}.md` — `sidebar.order` is 4 / 5 / 6 (Documentation → Maintenance → Verification). [`design.md`](../../design.md) and `starter/site/astro.config.ts` both want Verification (4) → Documentation (5) → Maintenance (6). **Rendered** sidebar on `/getting-started/` follows the explicit `sidebar:` array, not frontmatter order. Impact: authors who later autogenerate or sort by `sidebar.order` will invert the last three pages. Recommended: set frontmatter `order` to 4 / 5 / 6 to match the config.

- [P2] `starter/docs/content/index.md` splash hero — YAML icons (`rocket`, `document`) and tagline render. There is no `hero` image, but Starlight still uses `grid-template-columns: 7fr 4fr` from `50rem`, so about 380px of the hero row is empty. The Verification action omits `variant`; both pills compute as primary (`background: #1749c4`, white label) in light. Duplicate `<title>` is `IINA Plugin Starter | IINA Plugin Starter`. Splash has **no** `data-has-sidebar` / Menu control, so Documentation and Maintenance are not in home chrome (only Generate, Verification, and in-body links). Recommended: `variant: secondary` (or `minimal`) on Verification, drop the unused hero column when there is no image, set a distinct `title` vs site name, and/or add the missing two destinations to the hero.

- [P2] `starter/site/src/styles/global.css:43` / compiled `dist/_astro/common.CiXSkOUe.css` — `--color-accent-200: var(--brand-cyan)` (`#43d9f5`) for every theme. Starlight light maps `--sl-color-accent-low` to accent-200. **Body text, site title, markdown links, primary CTA, and `--ring` in light are `#1749c4` (`--brand-light-cyan`), not cyan** (computed on the live page). Cyan remains a highlight token: search-result `:focus-within` background and similar `--sl-color-accent-low` uses. Ink on that cyan wash is ~8.8:1; white-on-cyan is ~1.7:1. Recommended: drive light accent-200 from `--brand-light-cyan` (or a mixed tint), keep `#43d9f5` for dark accent-high only.

- [P2] Dark canvas vs kit — computed `--sl-color-bg` in dark is `#132555` (`--brand-ink` via `--color-gray-900`), not kit `--brand-background` `#080f2b`. Nav/header is the same ink family. Contrast is fine (cyan links ~11:1 on navy). It does not match `design.md` “dark theme uses background / foreground / surface.” Recommended: map `--color-gray-900` / `--sl-color-black` in dark to `--brand-background` if the catalog navy is the intended page canvas.

- [P2] Mobile nav — on `/getting-started/` at 390×844 the Menu button exists (`sr-only` name “Menu”, `popovertarget="starlight__sidebar"`), opens the six-item list in contract order, and includes ThemeSelect. Hit target is **32×32** (`--sl-menu-button-size: 2rem`), under the 44px catalog control size (still ≥24px WCAG 2.2 AA). Splash has no Menu. Recommended: 44px menu control; consider a splash link row or keep splash intentionally CTA-only.

- [P2] `http://127.0.0.1:4321/favicon.svg` — HTML `<link rel="shortcut icon" href="/favicon.svg">`; GET is **404**. `starter/site/public/` holds `markdown/`, `llms.txt`, `llms-full.txt` only. Recommended: ship a non-catalog or kit mark in `public/`, or drop the icon link.

- [P2] Focus — sampled markdown/sidebar link in light: `outline-style: none` (width 3px, color ink, no box-shadow). `--ring: var(--brand-light-cyan)` is defined and **not** applied to Starlight chrome. Search input uses `--sl-color-accent` (`#1749c4` in light) for the border, which is the safe split. Recommended: `:focus-visible` outline/ring using `--ring`, not color-only.

- [P2] Motion budget — maintainer CSS gates `a, button, summary` at 120ms and zeroes `transition`/`animation`/`scroll-behavior` under `prefers-reduced-motion: reduce`. Emulated reduce on the live page set those (and Starlight `.caret`) to `none`. Starlight’s default caret is `transform .2s` (200ms) when motion is allowed, over the design contract cap. Recommended: cap caret/summary marker to 120ms in `custom.css` without disabling the reduce branch.

No P1: light links/title/primary/focus-border are not `#43D9F5` on white. Sidebar **reading** order matches `design.md`. Pagefind returns results. Reduced-motion reduce is honored.

---

## Strengths

- Identity split is implemented: `global.css` wraps kit `--brand-*` with shadcn aliases; light `--primary` / `--ring` are `--brand-light-cyan` (`#1749c4`, ~7.5:1 on white); dark `--primary` / `--ring` are `--brand-cyan`. Tailwind v4 layer order matches `design.md`. System fonts only. Copier twins stay zinc/blue (out of scope here).
- Explicit `sidebar:` in `astro.config.ts` matches the maintainer table (Starter → Generate → Profiles → Verification → Documentation → Maintenance). Confirmed in the getting-started accessibility tree and in `ul.top-level` HTML.
- Splash uses `template: splash` + `hero.actions[].icon` (no MDX `<Icon>`). Code fences use Expressive Code `title=` (`Initialize template`, `Generate`). GitHub alerts in source (`> [!NOTE]`) render as `starlight-aside--note` after `docs.ts prepare`.
- ThemeSelect is labelled “Select theme” (Dark / Light / Auto). Light and dark both apply (`data-theme`, `localStorage['starlight-theme']`).
- Pagefind is in `dist/pagefind/` (`pagefind.js`, `pagefind-ui.js`). Search control starts `disabled` until hydrate, then opens a dialog; query `Copier` returned **4 results** (Verification, Generate, Starter, …).
- Reduced-motion reduce is real, not documentation-only (`transition: none` on links, summary, caret).
- No `Header.astro` override; chrome is stock Starlight plus `custom.css` pre radius. No catalog wordmark/social-card leak in this site’s config.

---

## Proof

| Check | Result |
| --- | --- |
| Live | [http://127.0.0.1:4321/](http://127.0.0.1:4321/) static dist (Python `http.server`, already running). Not `pnpm run docs:dev`. |
| Sidebar | `/getting-started/` `ul.top-level`: Starter, Generate, Profiles, Verification, Documentation, Maintenance |
| Splash | H1 “IINA Plugin Starter”, tagline, rocket + document actions. No Menu. Light computed: title/links/primary `#1749c4`; body `#fff`; H1 ink. Dark: title/links/primary cyan `#43d9f5` on navy; primary label ink |
| Codeblocks | `.expressive-code .title` = `Initialize template`, `Generate` |
| Pagefind | Dialog + textbox; `4 results for Copier` |
| Theme | Light: `--sl-color-text-accent: #1749c4`, `--sl-color-accent-low: #43d9f5`. Dark: text-accent `#43d9f5`, bg `#132555` |
| Reduced motion | `prefers-reduced-motion: reduce` → `transition: none` on `a` / `summary` / `.caret` |
| Mobile | 390×844 Menu 32×32, popover open, six links + theme select |
| Favicon | `GET /favicon.svg` → 404 |
| Scanner | `uv run python ~/.cursor/skills/design/scripts/scan_frontend.py starter/site` — 10 kit hex in `:root` (expected); `unguarded_motion: 0`; no `tailwind.config.js` |
| Screenshots | Light splash is trustworthy (navy type on white, blue CTAs). Dark splash captured. Inner-page/mobile screenshots from the Cursor browser often repeated the splash frame (stale compositor); structure for those states is from a11y snapshots + CDP, not those images |

**Chrome DevTools MCP:** `list_pages` / `select_page` / `evaluate_script` kept attaching to catalog `:8001` or plugin `:4173` while other audits ran. Proof used **cursor-ide-browser** (locked tab `cbb1d0`) plus `Runtime.evaluate` / `Emulation.setDeviceMetricsOverride` / `Emulation.setEmulatedMedia`, and curl against `:4321`.

Commands: read `design.md`, `surfaces.md`, `starter/site/{astro.config.ts,src/styles/global.css,custom.css}`, `starter/docs/content/*`, `docs.config.json`; curl pages + Pagefind assets; CDP computed styles; `/design` scanner.
