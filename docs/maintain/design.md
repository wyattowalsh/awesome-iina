# Design system

Frozen contract for the catalog web app and Starlight docs theming. Kit artwork,
rights, and deployment stay in [`brand.md`](brand.md). This file does **not**
belong in the generated awesome-list.

`docs/` is the contributor handbook (GitHub Flavored Markdown). The public web
app is [`src/awesome_iina/site/`](../../src/awesome_iina/site/) → `dist/site/`.
Do not put a SPA in `docs/`, do not add a root `DESIGN.md`, and do not ingest
root `docs/` into Starlight.

## Identity split

[`src/awesome_iina/site/brand.json`](../../src/awesome_iina/site/brand.json)
sets `consumer_plugins_receive_catalog_identity: false`.

| Product | Kit `--brand-*` hues | Tailwind |
| --- | --- | --- |
| Catalog site (`catalog.css` + Vite island) | Required. Wrap kit variables with shadcn aliases below. Python `site-build` after `site-ui-build` | Yes — Tailwind v4 + shadcn/ui islands under `site/ui/` |
| Maintainer [`starter/site/`](../../starter/site/) | Optional. Same light/dark split as the catalog | Yes — `global.css` first in `customCss` |
| Generated Copier Starlight | **Forbidden.** No `--brand-*`, no catalog cyan/navy, no logos or social cards | Yes — same packages, Starlight-safe neutrals |

Shared Tailwind **pipeline** is allowed. Shared catalog **identity** in Copier
`site/` CSS is not. Copier overwrites consumer `site/**` on update; generated
plugins must ship their own name, identifier, and UI.

## Tailwind pins (D00)

Resolved 2026-09-17 with `npm view` against **Astro 7.2.10** / **Starlight 0.42.0**.
Toolchain lane applies these in package manifests. Do not add Tailwind to
`starter/toolchain.json` unless mise and tests move in the same patch. No
`tailwind.config.js`. Tailwind packages live only inside the Jinja
`docs_profile == "starlight"` block. Never commit a lockfile inside the Copier
template.

| Package | Pin | Notes |
| --- | --- | --- |
| `@astrojs/starlight-tailwind` | **5.0.0** | Peers: `@astrojs/starlight >=0.38.0`, `tailwindcss ^4.0.0` |
| `tailwindcss` | **4.3.3** | Current 4.x on npm |
| `@tailwindcss/vite` | **4.3.3** | Depends on `tailwindcss@4.3.3`; Vite 5.2 through 8 |

Official layer order ([Starlight CSS and Tailwind](https://starlight.astro.build/guides/css-and-tailwind/)):

```css
@layer base, starlight, theme, components, utilities;

@import '@astrojs/starlight-tailwind';
@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/utilities.css' layer(utilities);
```

Put `./src/styles/global.css` first in Starlight `customCss`. Add
`vite: { plugins: [tailwindcss()] }`. Keep system fonts (`--font-sans` /
`--font-mono` stay on the platform stack). Map Starlight `@theme` accent and
gray from the shadcn aliases — never from raw `#43D9F5` in light mode.

## Token grammar

Kit SSOT is [`src/awesome_iina/site/kit/`](../../src/awesome_iina/site/kit/).
`site-build` generates `assets/brand/tokens.css` from the kit token file. Do
not hand-edit a second palette and do not copy that file’s hex values here.

Kit custom properties (names only): `--brand-background`, `--brand-blue`,
`--brand-cyan`, `--brand-foreground`, `--brand-ink`, `--brand-light-cyan`,
`--brand-light-violet`, `--brand-secondary`, `--brand-surface`, `--brand-violet`.

Catalog light theme uses the kit **foreground** token as the page canvas and
**ink** for text. Dark theme uses **background** / **foreground** / **surface**.

### shadcn aliases wrapping kit `--brand-*`

Add these CSS variables on the catalog (and optionally maintainer Starlight).
Keep existing `--bg` / `--fg` bridges in sync until callers move.

| Alias | Light wraps | Dark wraps |
| --- | --- | --- |
| `--background` | `--brand-foreground` | `--brand-background` |
| `--foreground` | `--brand-ink` | `--brand-foreground` |
| `--card` | ink mixed into `--brand-foreground` (today’s panel) | `--brand-surface` |
| `--primary` | `--brand-light-cyan` | `--brand-cyan` |
| `--muted` | ink mixed into `--brand-foreground` | `--brand-secondary` mixed into `--brand-background` |
| `--border` | ink mixed into `--brand-foreground` (today’s line) | `--brand-secondary` mixed into `--brand-background` |
| `--ring` | `--brand-light-cyan` | `--brand-cyan` |
| `--radius` | `7px` (existing catalog controls) | `7px` |

Flag accents (not shadcn core, still kit-backed): official uses the same
light-cyan / cyan split as `--primary`; featured uses `--brand-light-violet` /
`--brand-violet`. `--brand-blue` exists on the kit; do not assign it as
light-theme text or focus until contrast is proven.

Generated Copier `global.css` may define the **same alias names** with
Starlight zinc/gray neutrals and a non-catalog accent. It must not reference
`--brand-*`.

## Light-theme contrast

Navy-on-cyan in dark mode is fine. **Never** use kit cyan `#43D9F5` as
light-theme text, links, or `:focus-visible`. That pair fails (~1.6:1) on
Starlight’s near-white canvas. The catalog already splits
`--brand-light-cyan` (light) vs `--brand-cyan` (dark). Maintainer Starlight
must keep that split if it adopts kit hues. Body text and UI chrome need
WCAG 2.1 AA (≥4.5:1 for text, ≥3:1 for non-text UI).

Motion: named-property transitions ≤150ms; honor `prefers-reduced-motion`.
Catalog CSP is `default-src 'self'` with `style-src 'self' 'unsafe-inline'` so
Radix Select/Dialog can set positioning styles. Scripts stay same-origin only.

## TypeScript vs JSDoc

Use TypeScript where it is typical for Astro/Starlight and for the catalog
Vite island. Do not convert the whole Copier script tree in this change. Node
24 type stripping only (`engines.node: ">=24 <25"`). ESM specifiers keep the
`.ts` extension.

| Surface | Language | Why |
| --- | --- | --- |
| `starter/site/src/content.config.ts` | Already TypeScript | Keep; strict Astro tsconfig |
| Maintainer + Copier `astro.config.ts` | TypeScript | Typical Astro 5+/7; replace `.mjs` twins, do not leave both |
| `starter/template/scripts/docs.ts` | TypeScript | Sole GFM `prepare` / alert rewrite owner |
| `starter/scripts/docs.ts` | TypeScript | Thin wrapper; import path only |
| `starter/template/tests/contracts/docs.test.ts` | TypeScript | `node --test`; type the contract |
| Copier `bootstrap.mjs`, `quality.mjs`, `check.mjs`, … | Stay JavaScript | Out of scope |
| Catalog [`site/ui/`](../../src/awesome_iina/site/ui/) | TypeScript + React 19 | Vite + Tailwind v4 + shadcn/ui chrome island; built to `static/ui/` |
| Catalog [`catalog.js`](../../src/awesome_iina/site/static/catalog.js) | Stub only | Chrome moved to the Vite island; list HTML stays Jinja SSR |
| Plugin `src/**/*.ts` / esbuild | Unchanged | Out of scope |

Run shape: `node scripts/docs.ts check`. Keep the CLI guard
(`import.meta.url === pathToFileURL(process.argv[1])`). `docs.ts` may import
`common.mjs`. Do not route docs through `load-ts.mjs`. Do not add `tsx` /
`ts-node`. Do not loosen Starlight `tsconfig` with `allowJs` to avoid migrating
configs.

## Alert map

Exclusive rewrite, owned by **template** `docs.ts`, applied only to the copy
written into `site/src/content/docs`. Keep `public/markdown` and `llms-full.txt`
as untransformed GFM. Root `docs/` stays GitHub-native (never `:::`). Skip
nested alerts and fenced `> [!NOTE]`.

| GitHub alert | Starlight aside |
| --- | --- |
| `NOTE` | `note` |
| `TIP` | `tip` |
| `IMPORTANT` | `note` |
| `WARNING` | `caution` |
| `CAUTION` | `danger` |

Do not map `CAUTION` to both `caution` and `danger`.

## Component inventory (catalog React island + Starlight)

Catalog chrome uses shadcn/ui primitives (Radix) under
[`src/awesome_iina/site/ui/`](../../src/awesome_iina/site/ui/). Kit tokens stay
SSOT via CSS variables. Generated Copier plugins still get no catalog identity.

### Catalog (Jinja list + Vite/shadcn chrome)

| Control | Implementation | Do not |
| --- | --- | --- |
| Icons (list rows) | One `assets/icons.svg` sprite + `<svg><use href="assets/icons.svg#…">`; 20px; `currentColor`; visible labels | Icon fonts in the SSR list |
| Theme | shadcn Vite **ModeToggle**: collapsed `Button` + `DropdownMenu` (Light / Dark / System) via `ThemeProvider` (`html.dark` / `html.light`) | Expanded ToggleGroup or a cryptic “Dark theme” chip |
| Dropdowns | shadcn **Select** (Category / Type / Status) | Custom listbox without Radix a11y |
| Modal | shadcn **Dialog** “Catalog labels”; focus the title on open | Overlay-click-only close without Esc |
| Search | shadcn **Input** + lucide search icon + `aria-controls` | Command-palette dependency |
| Project metadata | Jinja `<dl class="project-meta">` (category, type, repo/URL, plugin ID, license, min IINA, sources) + flags + all tags in `data-search` | Invent status/officialness |
| Reset | shadcn **Button** | Card-on-card fill that fails 3:1 |
| Disclosure | Keep `<details>` for long notes | Accordion JS |
| Code | Style `code` like inline shadcn code | Highlight.js |

No-JS HTML must still list every entry. Filters, theme, and the dialog need the
Vite island; the list itself remains Jinja SSR.

### Starter Starlight (Markdown-canonical)

| Feature | How |
| --- | --- |
| Icons | `hero.actions[].icon` in YAML on `index.md` (`template: splash`). No MDX `<Icon>` in source |
| Codeblocks | Expressive Code fence meta (`title=` on a `sh` fence; GitHub still sees `sh`) |
| Asides | Source `> [!NOTE]`; `prepare()` rewrites to `:::note` |
| Tabs / Card / FileTree / Steps | Not in canonical `.md` |
| Theme / search | Starlight ThemeSelect + Pagefind |
| Chrome | Astro overrides only if needed (`Header.astro`); still no React |

## Starlight sidebar order

Toolchain lane sets explicit `sidebar` arrays in both `astro.config.ts` files.
Content authors keep this reading order via `sidebar.order`. Autogenerate by
filename is not the contract.

### Maintainer site (`starter/docs/content/`)

| `sidebar.order` | File | Label |
| ---: | --- | --- |
| 1 | `index.md` | IINA Plugin Starter |
| 2 | `getting-started.md` | Generate a plugin |
| 3 | `profiles.md` | Profiles and ownership |
| 4 | `verification.md` | Verification and release gates |
| 5 | `documentation.md` | Documentation pipeline |
| 6 | `maintenance.md` | Maintenance |

### Generated plugin docs (`starter/template/docs/content/`)

| `sidebar.order` | File | Label |
| ---: | --- | --- |
| 1 | `index.md` | Overview |
| 2 | `development.md` | Development |
| 3 | `runtime.md` | Runtime boundaries |
| 4 | `packaging.md` | Packaging and release |
| 5 | `updating.md` | Template upgrades |
| 6 | `documentation.md` | Documentation |
| 7 | `native-testing.md` | Native acceptance |

## Catalog list grammar

The site is the awesome-* companion, grouped by exclusive provenance (not a
SaaS dashboard). Match README scanning habits: wordmark + H1, honest badges,
Contents jumps, Start here as a short featured **list** (not a wrapping chip
cloud), name · flags · description · metadata definition list · tags rows, footer with contribute /
policy / license. Hide empty Type `<option>`s. Do not sticky a long featured
rail. Visualization is HTML/CSS only (counts, compact chips, a stacked
provenance bar — not a pie).

GitHub Pages deploys `dist/site/` only. Root `just check` does not compile
Starlight; the starter `docs:build` / parent `starter.yml` generated matrix
does.

Derived catalog Open Graph and social cards are JSX design files under
[`site/ui/og/`](../../src/awesome_iina/site/ui/og/), rendered by `takumi-js`
(`npm --prefix src/awesome_iina/site/ui run og`, also part of `just site-ui-build`).
They reuse kit tokens and Indexed Media grammar (mark plate, title, two role
lines, cyan→violet waveform motif). Outputs land in `site/static/og/` and
gitignored `output/og/`. They do not replace kit rasters or ship catalog hues
into Copier consumers.

## Related

- [`brand.md`](brand.md) — kit integration, rights, generated plugins do not inherit logos
- [`architecture.md`](architecture.md) — discovery vs catalog vs publication
- [`../../src/awesome_iina/site/README.md`](../../src/awesome_iina/site/README.md) — browser catalog
- ADR 0002 — no root `DESIGN.md` / `brand/` / `data/`
