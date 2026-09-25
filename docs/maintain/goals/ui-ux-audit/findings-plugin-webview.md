# Copier plugin webview (`src/ui/`) — UI audit

Read-only `/design` audit (2026-09-17). No implementation.

**Thesis:** The generated IINA webview is a small operational HUD (sidebar / overlay / standalone), not catalog chrome. It must stay on system `Canvas` / `CanvasText` and `system-ui`. `brand.json` `consumer_plugins_receive_catalog_identity: false`. Kit review HTML is out of scope here ([`findings-copier-kit.md`](findings-copier-kit.md) already owns `START-HERE.html` / `review/index.html`). Kit also noted a compact webview bullet (title, `:focus-visible`, reduced-motion, prefs viewport); this file does not repeat those as the same tickets — it audits `starter/template/src/ui/` plus the loopback preview bridge.

**Counts:** **P1 = 0**, **P2 = 6**.

**Generated plugin UI contains catalog hues?** **No.** `style.css.jinja` / `index.html.jinja` / `index.ts.jinja` have zero `--brand-*` and zero catalog hex (`#43d9f5`, `#080f2b`, `#132555`, `#1749c4`). Overlay HUD uses `Canvas` / `CanvasText`. Live preview CSS had `hasBrand: false`.

Command preset has no webview (correct). Preferences HTML is IINA-hosted, not served at `/ui/`.

---

## Findings

- [P2] `starter/template/src/[% if preset != "command" %]ui[% endif %]/index.html.jinja:6-11` — Document `<title>` and `main aria-label` are the literal string `Plugin status`. Copier `plugin_name` (default `IINA Example`) is never interpolated. IINA chrome *does* use the name: `Info.json.jinja` `sidebarTab.name` and controller `standaloneWindow.setProperty({title: plugin_name})`. Impact: browser `pnpm run preview` tab, window title fallback, and the main landmark stay generic; two plugins look identical in DevTools. Recommended: `[[ plugin_name | e ]]` in `<title>` / `aria-label` (keep overlay/sidebar HUD copy as media state, not catalog wordmarks).

- [P2] `starter/template/scripts/preview.mjs:20-26` + overlay branch `style.css.jinja:6-7` — Loopback preview injects an `<aside aria-label="Browser simulation controls">` with no CSS (transparent, same 14px `system-ui` as the seed). The scenario `<select>` has no `name`/`id` (Chrome issue: “A form field element should have an id or name attribute”). `disconnected` updates `#status` only; the `<h1>` stays on the previous title (observed: unicode heading + “Preview: bridge disconnected”). Overlay CSS sets `body { pointer-events: none }` with no `pointer-events: auto` on a preview root — overlay authors cannot mouse the scenario control (native overlay is intentionally `setClickable(false)`). Overlay `main` keeps `max-width: 42rem`, so a HUD chip can cover a large slice of video. Recommended: isolate preview chrome (border, `Canvas` surface, `name` on the select, reset heading on disconnect); for overlay, `pointer-events: auto` on the aside only in preview, and a tighter overlay `max-inline-size`.

- [P2] `index.ts.jinja:10` / preview `titles.empty` — `title.textContent = snapshot.title` with no empty fallback. Preview `empty` yielded `h1=""`, computed height **0**, while `#status` stayed **Paused**. Native `media-title` can also be empty. Impact: a heading with no accessible name; playback state without an object. Recommended: fallback copy (“No media”) already used in `main/index.ts.jinja` when the host title is not a string; use it in the webview too.

- [P2] `index.html.jinja:12` + `protocol.ts` 500-char cap + `style.css.jinja:4` — The only `<h1>` is the live media title (`overflow-wrap: anywhere`, no `max-height` / line clamp). Preview `long` is **500** characters (~165px tall at 14px/1.5, `max-width: 42rem`). `#status` is `role="status"` (`aria-live` polite in the a11y tree); the heading is not a live region, so title changes may be silent. Impact: overlay/sidebar grow with the title; screen readers get a giant heading. Recommended: keep a stable plugin-level heading or `p` for media; put changing title in the existing status region or `aria-live="polite"` with a short clamp.

- [P2] `style.css.jinja:1-5` (sidebar / controller) vs IINA webviews — IINA documents that **all webviews are transparent** and follow the **window** background ([Web Views](https://docs.iina.io/pages/webviews.html)). Seed sidebar CSS sets `color-scheme: light dark` and leaves `body` background unset (correct per that doc) but does not set `color`. UA `CanvasText` follows **OS** `prefers-color-scheme`, not IINA’s appearance. Overlay avoids the trap by painting `background: Canvas; color: CanvasText` on `main`. Impact: a dark IINA window with a light OS theme can yield black text on a dark sidebar. Native WKWebView was not executed this pass. Recommended: explicit `color: CanvasText` (and overlay-style `Canvas` only where the HUD must sit on video, not on the catalog palette).

- [P2] `starter/template/src/[% if preferences %]preferences[% endif %]/index.html.jinja:4-7` — Host-styled IINA prefs page (not `/ui/`). The labeled checkbox is correct. Help copy uses IINA’s documented `.small.secondary` (`font-size: 11px`, `.secondary { color: rgba(0, 0, 0, 0.5) }` ≈ **3.9:1** on white — below WCAG AA for text). The page has no `color-scheme` of its own; IINA claims dark-mode host CSS, but that 50% black helper is specified as light-only in the public snippet. Recommended: keep native controls; drop `.secondary` on essential help or use a host class that meets AA in both appearances. Do not add catalog hues.

No P1 identity leak: catalog `--brand-*` / cyan-navy do not appear in plugin webview CSS or the live `/ui/` stylesheet.

---

## Strengths

- Identity split holds on the HUD: `system-ui`, `color-scheme: light dark`, overlay `Canvas` / `CanvasText`, no kit logos, no Inter, no `--brand-*`. Live computed CSS contained none of `#43d9f5` / `#080f2b` / `#132555` / `#1749c4`.
- IINA-shaped overlay: transparent pass-through, `pointer-events: none`, `setClickable(false)`, HUD chip on `main` — matches “overlay is not clickable by default.”
- Sidebar/controller omit a painted page fill, matching IINA’s “normally you don’t specify webview background.”
- `overflow-wrap: anywhere` actually wraps the 500-character and unicode (`日本語` / 🎬 / Café) scenarios; nothing uses `nowrap` / `truncate`.
- `#status` exposes `role="status"` (polite live region). Seed UI is display-only (no custom widgets); `:focus-visible` / `prefers-reduced-motion` gaps are seed-future, not a current motion or keyboard trap. CSS has **no** transitions/animations (`motion_needs_reduced_motion: false` on the scanner).
- Preview is honest: injected copy **“BROWSER SIMULATION: not native IINA”**, loopback host check, CSP `connect-src 'none'`, only `ui/index.html|js|css`.
- `plugin_name` already brands IINA chrome (`sidebarTab`, standalone window title). Controller snapshot copy is “Global controller ready,” not catalog marketing.
- Preferences follow IINA’s native-control example (`data-type="bool"` + wrapping `<label>`).

---

## Proof

| Check | Result |
| --- | --- |
| Surface | Template `src/ui/{index.html,style.css,index.ts}.jinja`, overlay/sidebar `main/index.ts.jinja`, controller `global/index.ts.jinja`, `preferences/index.html.jinja`, `scripts/preview.mjs`. Live stage `/tmp/awesome-iina-webview-stage` (sidebar-like CSS: **no** overlay `pointer-events` / `Canvas` chip). |
| Identity `rg` | No `--brand-*` / catalog hex under `starter/template/src/`. `brand.json` `consumer_plugins_receive_catalog_identity: false`. Starlight identity tests still **do not** read `src/ui/style.css.jinja` (regression hole, not a current leak). |
| `/design` scanner | `scan_frontend.py` on `src/ui`, preferences, `preview.mjs`: no hardcoded kit hex, no clipping utilities, no motion that needs a reduce gate. |
| Loopback | Existing `127.0.0.1:4173` reused (did not bind 8000/8001/4321). `GET /ui/` 200, CSP as designed, HTML injects `/__preview/bridge.js`. |
| Chrome (isolated context `plugin-webview-design-audit-readonly`) | Tab title **Plugin status**. Light: `body` color `rgb(0,0,0)`, background transparent, contrast **21:1** on white. `hasBrand: false`. Scenarios: `empty` → empty H1 height 0 + Paused; `unicode` OK; `disconnected` stale heading; `long` 500 chars wrap. Console: select missing `id`/`name`. Screenshots: `/tmp/awesome-iina-plugin-webview-light-long.jpeg`, `/tmp/awesome-iina-plugin-webview-light-normal.jpeg` (dark-emulation pass showed white-on-dark CanvasText, still no catalog cyan). |
| Overlay live CSS | **Not in this stage.** Overlay pointer-events / 42rem HUD claims are source-only. |
| Native IINA WKWebView | **Blocked.** Starter runtime note: native behavior not executed for this alpha. Transparent-vs-window contrast is inferred from IINA docs + CSS, not a player screenshot. |
| Preferences | **Not on 4173** (`previewPath` allows only `ui/*`). Source + IINA preferences doc for host `.secondary`. |
| MCP flake | Shared Chrome often jumped to catalog `:8001` / Starlight `:4321`. Isolated tab + curl recovered. |

Commands: read templates + IINA webview/prefs docs; `curl` `/ui/` + `style.css`; `uv run python ~/.cursor/skills/design/scripts/scan_frontend.py` on UI paths; Chrome DevTools against `http://127.0.0.1:4173/ui/`.
