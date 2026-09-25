# UI/UX surfaces

Inventory of people-facing chrome in this repository. ADR 0002 keeps this note under `docs/maintain/`, not a root `goals/` folder. Design contract: [`design.md`](../../design.md). Identity split: [`brand.json`](../../../../src/awesome_iina/site/brand.json) (`consumer_plugins_receive_catalog_identity: false`).

**Kinds:** **live** = local HTTP of built HTML; **generated** = emitted from templates (committed or `dist/`); **GitHub-only** = GFM, issue forms, social preview, or Pages with no local app.

| Surface | Source | Preview | Kind |
| --- | --- | --- | --- |
| Public catalog site | `src/awesome_iina/site/` (`templates/index.html.j2`, `static/catalog.css`, `static/catalog.js`) → `dist/site/` | `just site-preview` → **http://127.0.0.1:8000/** (binds loopback; not 8001). `just site-build` only. CI uploads `dist/site/` as an artifact and does **not** deploy. Intended Pages origin in the kit is `https://wyattowalsh.github.io/awesome-iina/` (`status`: intended, not confirmed live). | Generated + live |
| Generated GitHub README | Template `src/awesome_iina/catalog/templates/README.md.j2` → root `README.md` (`just generate`) | GitHub repo landing (GFM, theme-aware `<picture>` wordmarks). Local Markdown preview is approximate. | Generated + GitHub-only |
| Contributor handbook | `docs/` (GFM; wordmark on `docs/README.md`). Not a site; do not ingest into Starlight. | GitHub tree / blob. `docs/` is the handbook; the web app is `src/awesome_iina/site/`. | GitHub-only |
| Maintainer Starlight | Content `starter/docs/content/`; Astro `starter/site/` (`global.css` may map kit `--brand-*`); config `starter/docs.config.json` | From `starter/`: `pnpm run docs:dev` (Astro default **http://127.0.0.1:4321/**) or `pnpm run docs:build` → `starter/site/dist`. Opt-in Pages: `starter/.github/workflows/docs.yml` when `ENABLE_DOCS_DEPLOY=true`. | Live (dev) / generated (build) / GitHub Pages (opt-in) |
| Copier plugin Starlight | Template `starter/template/[% if docs_profile == "starlight" %]site[% endif %]/` (`global.css` = zinc/blue aliases, **no** `--brand-*`, no catalog logos). Consumer content: generated `docs/content/`. | In a generated plugin: `pnpm run docs:dev` / `docs:build`. Pages from Copier `docs.yml` when `ENABLE_DOCS_DEPLOY=true`. `docs_profile=markdown` has no Starlight — GFM only. | Template + live in consumers |
| Brand kit review HTML | `src/awesome_iina/site/kit/` | Open `START-HERE.html` → `review/index.html`. Demo: `integration/demo/index.html`. Serve the kit dir: `python3 -m http.server 8000` (relative assets). QA proofs (`qa/*.html`) are Chromium evidence, not product UI. `archive/original-kit/review/` is historical. | Live (file:// or local HTTP) |
| Copier consumer README | `starter/template/README.md.jinja` | GitHub README of a generated plugin. Nested `starter/README.md` is the template-source landing. | Generated + GitHub-only |
| Plugin webview (not catalog) | `starter/template/src/[% if preset != "command" %]ui[% endif %]/` (`index.html.jinja`, `style.css.jinja`); optional preferences HTML | After `pnpm run build` in a non-command plugin: `pnpm run preview` → **http://127.0.0.1:4173/ui/** (`PREVIEW_PORT`). Browser simulation, not native IINA. | Live (loopback) |
| GitHub chrome | Issue forms `.github/ISSUE_TEMPLATE/`; PR template; social PNG `src/awesome_iina/site/kit/assets/brand/github-social-preview-1280x640.png` | GitHub UI only. Social preview must be chosen in repo settings; committing the file does not enable it. | GitHub-only |

GitHub Pages for the **catalog** would publish **only** `dist/site/` (relative assets, CSP `default-src 'self'`). Root `just check` does not compile Starlight.

## Not a UI surface

The Python CLI (`awesome-iina`, `just` recipes), discovery JSON/checkpoints/snapshots, generated JSON Schemas, `catalog.yaml` / `catalog.json`, media reports, Copier answers, skills, and `AGENTS.md` are maintainer/machine contracts. They have no layout, theme, or browser chrome to audit. Do not treat `htmlcov/`, `output/`, or schema docs as product UI.
