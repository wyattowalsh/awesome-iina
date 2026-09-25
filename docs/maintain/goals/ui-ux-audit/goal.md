# UI/UX enhance across catalog and docs surfaces

Make the public catalog, generated GitHub README, maintainer Starlight, Copier consumer docs, plugin webview, and kit landing noticeably tighter and more honest — kit tokens, Vite/React/shadcn catalog chrome, provenance grouping on the site, category list on the README — without an awesome.re submission, and without redrawing kit artwork. Generated Copier plugins still do not receive catalog identity.

Shared understanding: [`facts.md`](facts.md). Execution: [`plan.md`](plan.md) (Wave A parallel mutexes → generate → `just check` / starter tests → browser proof; origin publish stays operator-gated).

## Done when

- Search and the three filters sit above Start here in the first 1280×800 screen; light filter controls are ≥3:1; Start here is the same 5–8 (six official onboarding) rows on catalog and README.
- Catalog chrome is Vite + React 19 + Tailwind v4 + shadcn (`Appearance` Light/Dark ToggleGroup, Select, Dialog, Button, Input) on kit tokens (7px radius, empty wordmark alt, 44px project links, dialog focuses the title) with exclusive provenance sections; the list stays Jinja SSR.
- Awesome badge image remains; its link is the list policy. Actions `badge.svg` chips are omitted until origin returns SVG, then native GitHub URLs. `lint-awesome` fails on unresolved README picture/srcset/img paths.
- Maintainer Starlight: sidebar.order 4/5/6, secondary Verification CTA, favicon, 44px menu, `--ring` focus, light accent-low not `#43D9F5`, dark canvas kit navy. Copier CSS still has no catalog `--brand-*`; generated README/`updating.md` warn that updates overwrite `site/**`.
- Plugin webview uses the plugin name, empty-title fallback, usable preview chrome, `CanvasText`. Kit header stays named when narrow; START-HERE is a short complete landing into review.
- `just generate` and `just check` pass; starter tests and docs build pass. Origin publish remains operator-gated and is not done; this goal does not push.

Launch with `/goal docs/maintain/goals/ui-ux-audit/goal.md`.
