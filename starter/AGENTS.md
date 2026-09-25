# Template maintainer contract

Read README.md, VALIDATION.json, RESEARCH.md and HANDOFF.md. Inspect existing implementations
before changing a command or adding a dependency. The generated project uses four separate
execution environments. Template-maintainer tools must not enter the installed plugin.

Real Copier, offline Jinja fixtures, TypeScript/Node checks, esbuild output, browser simulation
and native IINA execution are separate evidence layers. Never report skipped tests as passed.
Use REQUIRE_COPIER=1 for integration/release gates. Selected toolchain versions are not
necessarily the versions available in an audit environment; record substitutions explicitly.

Generated consumer source, unit tests, identity and user docs are seed-owned. Managed scripts
and checks receive reviewed updates; shared-file conflicts must not be silently forced.
Update tests must include real consumer edits and deliberately deleted seeds.

Run just or inspect package scripts for commands. Bootstrap/fmt/link/hook activation and
publication are explicit side effects, never hidden inside check. Never create fake lockfiles,
Git lineage, action SHAs or native results. Native report validation is not native execution.
No remote repository write or publication was authorized by a request for a source ZIP.

Agent Plugins SSOT is `plugins/iina-plugin-dev/`. Nested `starter/.cursor/skills/` exposes
`iina-generate`, `iina-upgrade`, and `iina-development` in this checkout. Run
`just starter-sync-agent-kit-check` after kit edits. Do not add catalog-root `.cursor/`
or `mcp.json`. Lefthook ≠ agent hooks.
