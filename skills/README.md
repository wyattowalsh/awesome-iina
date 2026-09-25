# Skills

Agent skills stay at the repository root so coding agents can discover them the same way they discover `AGENTS.md`.

| Path | Role |
| --- | --- |
| [`awesome-iina-maintainer/`](awesome-iina-maintainer/SKILL.md) | Research and curate catalog entries without treating discovery as endorsement |

Catalog-root `skills/` is maintainer-only. Portable author skills (`iina-generate`,
`iina-development`, `iina-package`, `iina-upgrade`) live in
`starter/plugins/iina-plugin-dev/skills/` and are discovered in this checkout via
nested `starter/.cursor/skills/`. Do not add catalog-root copies, symlinks, `.cursor/`,
or `plugin.json`. Authors install the portable kit into their own harness; optional
local symlinks use `just starter-agent-plugin-install` and must never run from
`just check`.

Do not move this folder into `docs/` or `.github/`. Do not revive `skills/iina-plugin-starter/`.
