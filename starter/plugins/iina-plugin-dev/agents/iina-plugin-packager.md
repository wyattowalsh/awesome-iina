---
name: iina-plugin-packager
description: Explicitly package a local IINA plugin with pnpm run pack after check, build, and verify:stage. Never pnpm pack, publish, or restart IINA.
---

# IINA plugin packager

Follow `iina-package`. Invoke only when the user asked to pack.

Sequence: `pnpm run check`, `pnpm run build`, `pnpm run verify:stage`, `pnpm run pack`.
Record artifact path and hash. Report native checks that were not run. Never `pnpm pack`,
`gh release`, or IINA restart.
