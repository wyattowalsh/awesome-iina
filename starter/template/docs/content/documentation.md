---
title: "Documentation"
description: "Edit docs/content, then check, prepare, or build derived documentation."
sidebar:
  order: 7
---

Edit this `docs/content` tree, not generated files in `site/src/content/docs`.
`pnpm run docs:check` validates local Markdown destinations within the source tree.
`pnpm run docs:prepare` generates command reference and Markdown exports deterministically.

The Starlight profile additionally provides `pnpm run docs:dev` and `pnpm run docs:build`.
It uses static pages and Pagefind search. Set `DOCS_SITE` and `DOCS_BASE` when publishing
under a repository subpath. Neither value belongs in the installed plugin.

> [!NOTE]
> `pnpm run docs:prepare` rewrites GitHub alerts only in Starlight ingest. `llms-full.txt` stays GFM.

The generated `llms.txt`, `llms-full.txt`, and individual Markdown pages preserve source
warnings. They are retrieval conveniences, not executable instructions or guarantees
about the accuracy of upstream API information. No hosted chatbot is required.
