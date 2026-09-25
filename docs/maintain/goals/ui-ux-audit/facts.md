# Facts

- On the catalog site, search and the three filters sit above Start here so they are in the first screen at 1280×800.
- In light theme, Reset, Catalog labels, search, and selects have at least 3:1 contrast against the filter panel (border and/or fill).
- Start here on the catalog and the generated README is the same short featured list of about 5–8 name + one-liner rows, not 19.
- The catalog looks noticeably tighter (spacing, type, chrome, 7px radius, empty wordmark alt, 44px project links, dialog focus on the title) while staying on kit tokens.
- The catalog chrome uses a Vite + React 19 + Tailwind v4 + shadcn/ui island (`ToggleGroup`, `Select`, `Dialog`, `Button`, `Input`) under `src/awesome_iina/site/ui/`; the project list stays Jinja SSR. Generated Copier plugins still do not receive catalog identity.
- The catalog site stays grouped by exclusive provenance. The generated README stays the category list.
- The catalog theme control is an Appearance ToggleGroup with visible Light and Dark options (not a cryptic Dark theme chip).
- The Awesome badge image can stay; its link goes to the list policy, not awesome.re as if this were a listing.
- The generated README omits GitHub Actions badge chips until those workflow badge.svg URLs return an SVG on the origin; after publish they use native GitHub badge URLs.
- lint-awesome fails if README picture srcset, img src, or Markdown image paths do not resolve in the repo.
- Origin publish is still required from the operator and is not done; the public GitHub landing remains the 14-byte stub.
- Maintainer Starlight matches the design.md sidebar order in frontmatter, uses a secondary Verification CTA, ships a favicon, uses a 44px menu, applies --ring on focus, maps light accent-low away from #43D9F5, and uses kit navy for the dark page canvas.
- Generated plugin Starlight CSS still has no catalog --brand-* or cyan/navy hex. The generated README and updating.md warn that Copier updates overwrite site/**.
- The plugin webview title and main landmark use the plugin name; empty media titles show fallback copy; overlay/preview chrome is usable (named select, pointer-events on preview controls); text uses CanvasText.
- Kit review header stays named at narrow widths, and START-HERE.html is a short but complete landing (skip, main, color-scheme) into review — still operator-only, not consumer chrome.
- This goal does not submit the catalog to awesome.re.
- This goal does not redraw kit artwork; it reuses kit tokens and shipped SVGs.
