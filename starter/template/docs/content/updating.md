---
title: "Template upgrades"
description: "Apply reviewed template upgrades while preserving seeds and resolving shared-file conflicts."
sidebar:
  order: 6
---

Keep `.copier-answers.yml` in Git. Do not manufacture answers for an existing plugin.
The template ZIP is not Git history: initialize and tag the template repository first,
then generate a project with real Copier. Keep that source available for future updates.

Use an isolated `template-update/<name>` or `renovate/<name>` branch. Commit all changes
before running `pnpm run template:update -- <explicit-tag-or-commit>`. The wrapper does not
allow trust or answer flags, install dependencies, repair conflicts or publish releases.

> [!IMPORTANT]
> Application code, application tests, identity (plugin name / identifier / Info.json),
> user docs and native evidence are seeds. Copier updates overwrite `site/**`; consumer
> theming there will be replaced on the next reviewed upgrade.

Maintained scripts and configuration receive reviewed template updates. Shared-file
conflicts are legitimate and must be resolved. A deleted seed must remain deleted.

Changing a preset, documentation profile or hooks selection after project development is
an explicit migration, not a routine answer-file edit. Seed fixes require a reviewed
application patch; infrastructure updates do not silently rewrite consumer behavior.
