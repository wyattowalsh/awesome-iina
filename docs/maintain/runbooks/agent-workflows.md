# AI-agent workflows

## Catalog maintenance

Catalog-root `skills/` ships **only**
[`awesome-iina-maintainer`](../../../skills/awesome-iina-maintainer/SKILL.md).
Do not add a catalog-root generate router, catalog-root `.cursor/`, or
catalog-root `plugin.json`. `iina-generate` belongs on the user-installed
Agent Plugins kit.

Ask the agent to return a candidate table with repository, direct IINA relationship, evidence paths, manifest identifier, update status, archive/fork status, license, and recommendation. Require it to distinguish an official source from project self-description.

The maintainer skill instructs agents to use the discovery artifact as leads, not as authority, and to edit `src/awesome_iina/catalog/catalog.yaml` rather than generated files.

## Generate a plugin (authors)

Authors install the portable Agent Plugins kit
(`starter/plugins/iina-plugin-dev/`) into their own harness, then create a
project with `iina-generate` (user-installed only) from a Copier source they
name: a git URL plus `--vcs-ref`, or a release ZIP they already unzipped and
`git init` + tagged. Happy path is
`uvx --from copier==9.18.2 copier copy`, not a catalog-checkout skill.

See [`plugin-starter.md`](../../catalog/authoring/plugin-starter.md) and
[`starter/docs/content/getting-started.md`](../../../starter/docs/content/getting-started.md).

## Plugin implementation task

Provide:

- the official plugin documentation;
- `iina-plugin-definition` at the version used by the project;
- the closest official plugin implementation;
- the repository's `Info.json`, package manifest, lockfile, and build scripts;
- a reproducible media fixture and expected behavior.

Then require this loop:

```text
inspect conventions → design smallest change → type-check/build → link plugin
→ launch IINA with fixture → inspect logs/UI → test teardown/reload → package
```

## Guardrails

- Never invent an IINA API when the definition package or official plugin source can be checked.
- Never rewrite a lockfile or toolchain without explaining why.
- Never infer successful runtime behavior from a passing TypeScript build.
- Never expose GitHub, service, or media-server credentials in committed fixtures.
- Treat screenshots and media metadata as potentially private.
- Prefer a narrow compatibility layer over copying internal IINA implementation details.
