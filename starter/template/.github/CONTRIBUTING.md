# Contributing

Read AGENTS.md and docs/content/development.md. Use the pinned development tools.
Run check and build. Describe actual native checks separately; never substitute a browser
preview for IINA evidence. Generated application code belongs to its author.

Before submitting, check runtime boundaries, permission changes, persistence compatibility,
package contents and whether template-managed files can instead be extended locally.
Lefthook (optional Copier `hooks:` answer) is not a Cursor or Copilot agent hook.
Agent hooks live in `.cursor/hooks.json`. Lefthook must not overwrite existing Git
hooks or restage partially staged files.
