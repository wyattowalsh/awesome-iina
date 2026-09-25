---
title: "Runtime boundaries"
description: "Player, global, webview, and Node contexts stay separate in this plugin."
sidebar:
  order: 3
---

IINA player JavaScriptCore, global JavaScriptCore, UI webviews and Node build scripts
are distinct contexts. The TypeScript projects and import checks enforce the intended
separation. These checks are engineering guardrails, not a hostile-code sandbox.

Keep direct IINA operations in the relevant entry. Keep shared protocol logic independent
of host, DOM and Node globals. Do not import `node:fs` into runtime code. A webview does
not receive the complete IINA API. The global entry does not have a current player.

The reference target is IINA 1.4.4. The candidate `es2019`/`safari13` lowering targets do
not establish the oldest supported macOS version. New host APIs require release-specific
source and native behavior checks. Preferences use their separate IINA binding contract.
