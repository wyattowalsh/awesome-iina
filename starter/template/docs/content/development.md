---
title: "Development"
description: "Bootstrap, format, check, and watch this plugin without restarting IINA."
sidebar:
  order: 2
---

## First installation

Provision the pinned tools manually or with `mise install`. Then run these explicitly:

```sh title="Bootstrap"
pnpm run bootstrap
pnpm run fmt
pnpm run check
pnpm run build
```

The first bootstrap creates a resolver-produced lockfile. Formatting is an explicit
first-time normalization step for rendered files. Review and commit both before relying
on frozen CI installations. Subsequent bootstrap runs use the existing lockfile frozen.

`just` is a readable alias layer over package scripts. `pnpm run dev` watches source and
rebuilds it. It never restarts IINA or promises host hot reload. `pnpm run preview` serves
the current UI stage on loopback with a conspicuous simulated bridge.

Use `pnpm run doctor` for local diagnostics. Use `pnpm run support:report` to print an
allowlisted report without automatically collecting logs, environment values or media.
