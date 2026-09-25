---
title: "Packaging and release"
description: "Stage, pack, and prepare a release without shipping development files."
sidebar:
  order: 4
---

## Build and inspect

```sh title="Build and pack"
pnpm run check
pnpm run build
pnpm run verify:stage
pnpm run pack
```

Use `pnpm run pack`, not npm/pnpm's unrelated package archive command. IINA's native CLI
is required for packaging. Set `IINA_CLI` to its actual path when IINA is installed in a
nonstandard location. The wrapper never restarts the application.

Only validated stage files enter the plugin. Documentation frameworks, examples, agent
instructions, tests and developer dependencies are excluded. The installed package has
no Python, Node, Copier or documentation-server dependency.

The release workflow produces a candidate artifact from a tag. It does not publish a
GitHub release automatically. Publication is a separate reviewed operation after native
acceptance. `pnpm run release:prepare` requires a clean tagged commit, committed dependency
lock and matching native evidence. Installation and update discovery need separate tests.
