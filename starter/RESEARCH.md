# Source expansion review

Date: 2026-09-13. This document supersedes the alpha's implementation-status statements.
The previous research is retained in history/alpha-research.md for traceability.

## Decisions implemented

Four vanilla IINA presets remain. A docs_profile selector adds Markdown or Starlight and
hooks adds configuration only. just exposes package commands; mise only provisions tools.
No Copier executable tasks, migrations or third-party Jinja extensions are enabled.

The current Starlight 0.42.0 release requires Astro >=7.2.10. The paired exact candidates
in this source use 0.42.0 and 7.2.10; neither package was installed in the preparation
container. Context7's manual setup was cross-checked against the upstream release.

Action references were resolved with the GitHub connector and recorded in
references/action-pins.json. Generated and maintainer workflow YAML passed structural
checks after rendering. actionlint/zizmor and remote Actions execution remain separate gates.

Formatter ownership is Prettier; Biome only lints a deliberate initial JS/TS rule set.
This is not full type-aware linting. Prettier 3.6.2 is a conservative candidate, not a claim
of the newest available formatter. First-render formatting is explicit and required by the
networked integration workflow before check. It was not executed in the offline audit.

The selected Node/pnpm/TypeScript/compiler-API/esbuild pins are retained from the prior
research. Their dependency graph, optional lifecycle scripts and framework integration
must be resolved and tested before advertising production compatibility. No npm or Python
lockfile was invented. Python 3.13.15, uv 0.12.13 and just 1.58.0 provisioning pins were
verified against their release pages. The audit still ran on Python 3.13.5.

The release workflow builds and uploads an inspected candidate stage; it does not publish
a plugin or mark native testing successful. Native report validation checks schema and
source binding only. Publishing and automated native UI testing are still out of scope.

## Primary references checked for this expansion

- https://github.com/withastro/starlight/releases/tag/%40astrojs/starlight%400.42.0
- https://starlight.astro.build/manual-setup/
- https://docs.astro.build/en/reference/content-loader-reference/
- https://pypi.org/project/copier/9.18.2/
- https://www.python.org/downloads/release/python-31315/
- https://github.com/astral-sh/uv/releases/tag/0.12.13
- https://github.com/casey/just/releases/tag/1.58.0
- https://docs.renovatebot.com/modules/manager/copier/
- https://docs.github.com/en/actions/reference/security/secure-use
- Action tag/commit sources in references/action-pins.json.

A retrieved release, an installable package graph, a passing fixture, a passing build and
actual native behavior are different claims. VALIDATION.json records the executed layer.
