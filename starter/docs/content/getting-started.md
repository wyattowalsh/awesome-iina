---
title: "Generate a plugin"
description: "Install the Agent Plugins kit, then generate from a git URL or ZIP with Copier."
sidebar:
  order: 2
---

## Install the Agent Plugins kit

Authors install the portable Agent Plugins kit (`plugins/iina-plugin-dev/` in this
starter tree) into their own harness first. `iina-generate` lives only on that
**user-installed plugin**. Catalog-root `skills/` in awesome-iina is
`awesome-iina-maintainer` only; do not look for a catalog-root generate router.

Generated IINA plugin repos receive workspace `.cursor/skills` (`iina-development`,
`iina-package`, `iina-upgrade`), `.cursor/rules`, and `.cursor/hooks.json`. They do
**not** include `iina-generate` and must not nest the Agent Plugins kit.

From an awesome-iina checkout, opt-in `just starter-agent-plugin-install` symlinks
the kit into `~/.cursor/plugins/local/iina-plugin-dev`. That recipe is never part of
`just check`. Do not add catalog-root `.cursor/` or catalog-root `plugin.json`.

Copier `hooks: true` is Lefthook, not those agent hooks. `pnpm run pack` is the IINA
packer; `pnpm pack` is not.

## Copier from git or ZIP

Name a Copier source: a git URL plus an immutable `--vcs-ref`, or a release ZIP
already unzipped and `git init` + tagged. Pin Copier **9.18.2**. Always pass
`--vcs-ref`. Pass `--prereleases` when the ref is a pre-release (`0.2.0a2`). Do
**not** pass `--overwrite` or `--trust`. Prefer `iina-generate` on the
user-installed plugin so argv stays closed; the commands below are the same Copier
invocation.

Git source:

```sh title="Generate from git"
uvx --from copier==9.18.2 copier copy --vcs-ref=v0.2.0a2 --prereleases \
  "gh:<owner>/<repo>" ../my-iina-plugin
```

## Establish a ZIP as a real template source

Unzip the source into a persistent directory. Review the files and initialize Git
there **before** Copier copy. Generate never runs `git init`.

```sh title="Initialize template"
cd iina-plugin-starter
git init -b main
git add .
git commit -m "Initialize reviewed IINA template"
git tag v0.2.0a2
```

> [!NOTE]
> Do not overwrite an existing repository or tag.

Then generate outside the template:

```sh title="Generate from ZIP"
uvx --from copier==9.18.2 copier copy --defaults --vcs-ref=v0.2.0a2 --prereleases \
  -d preset=sidebar -d preferences=true -d docs_profile=starlight . ../my-iina-plugin
cd ../my-iina-plugin
mise install
pnpm run bootstrap
pnpm run fmt
pnpm run check
pnpm run build
```

mise is optional; matching tools may be installed manually. First-time formatting is
explicit because rendering does not execute formatters. Review the source and new lockfile,
then initialize/commit the consumer repository. Keep the template source available for updates.
A local source path is not portable across machines; host the reviewed template before
adopting it across a team and preserve existing recorded template history.

Answer the questionnaire interactively, or pass `--data-file answers/<preset>.yml`
(not `-a`).
