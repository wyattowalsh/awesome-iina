---
title: "Documentation pipeline"
description: "Canonical Markdown sources, derived Starlight output, and local documentation checks."
sidebar:
  order: 5
---

The template itself ships a static Astro/Starlight site. Generated plugins can opt into
the same engine. Canonical Markdown lives in docs/content. Site content and Markdown exports
are derived by scripts/docs.ts; edit the source, not generated files.

Use docs:check for local destinations, docs:prepare for exports, docs:build for static output.
GitHub Pages deployment is off until the repository variable ENABLE_DOCS_DEPLOY is true and
Pages is configured for GitHub Actions. Custom domains use the configure-pages outputs.

> [!TIP]
> `pnpm run docs:prepare` rewrites GitHub alerts only in Starlight ingest. `llms-full.txt` stays GFM.

The production build must include index.html, Pagefind, llms.txt and llms-full.txt.
The included local-link checker does not validate heading anchors or remote destinations.
