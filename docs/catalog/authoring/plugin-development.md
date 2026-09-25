# IINA plugin development

## Minimum structure

An IINA plugin contains an `Info.json` manifest and a JavaScript entry file. Most real projects add TypeScript, a bundler, tests, preferences or sidebar pages, assets, and release automation.

```text
my-plugin/
├── Info.json
├── package.json
├── src/
│   ├── index.ts
│   └── global.ts
├── preferences.html
└── dist/
    └── index.js
```

## Official starting points

- [`iina/iina-plugin-template`](https://github.com/iina/iina-plugin-template)
- [`iina/iina-plugin-definition`](https://github.com/iina/iina-plugin-definition)
- [Creating Plugins](https://docs.iina.io/pages/creating-plugins.html)
- [Plugin API modules](https://docs.iina.io/modules.html)
- Official plugins in the `iina` organization as implementation references

## CLI workflow

IINA 1.4 and later includes the `iina-plugin` command-line tool. A normal loop is:

```bash
iina-plugin new my-plugin
cd my-plugin
npm install
npm run build
iina-plugin link .
iina-plugin pack .
```

Use the exact scripts and package manager committed by the chosen template. Do not assume generated files or a package lock can be recreated interchangeably.

## Manifest essentials

```json
{
  "name": "Example Plugin",
  "version": "0.1.0",
  "identifier": "dev.example.iina-plugin",
  "author": {
    "name": "Example Author",
    "url": "https://github.com/example"
  },
  "entry": "dist/index.js",
  "ghRepo": "example/iina-plugin-example",
  "ghVersion": 1,
  "permissions": ["show-osd"]
}
```

Treat `identifier` as persistent identity. Do not reuse another plugin's identifier. Increment `ghVersion` for update detection when publishing a new compatible release.

## Permissions

Request only capabilities the plugin needs. Review network domains, filesystem access, overlays, OSD, subprocess or external-tool behavior, and any persistent secrets. Document why a broad domain wildcard or write access is necessary.

## Architecture guidance

- Prefer event subscriptions over polling.
- Keep global and player-instance lifecycle state separate.
- Make setup and teardown idempotent.
- Avoid blocking the player or webview thread with synchronous work.
- Validate persisted preferences and external API data.
- Gracefully handle missing binaries, offline services, malformed media, and unsupported IINA versions.
- Keep UI accessible with keyboard navigation, readable contrast, clear focus, and reduced-motion behavior where relevant.

## Agent-assisted development

Give coding agents the official type definitions and at least two maintained plugin examples before asking them to design an integration. Require API citations or source paths for unfamiliar calls. Use the build, link, launch, log, screenshot, and test loop described in [`agent-workflows.md`](../../maintain/runbooks/agent-workflows.md) rather than accepting code that only type-checks.

## Safe local manifest inspection

This repository includes a read-only inspector for plugin `Info.json` files:

```bash
just inspect-manifest /path/to/plugin/Info.json
# or machine-readable output
uv run awesome-iina plugin inspect /path/to/plugin/Info.json --json
```

It validates the fields currently required by IINA's plugin loader, reverse-domain identifiers, known permissions, GitHub update metadata, referenced entry/page files, duplicate JSON keys, package-relative path safety, and symlink escapes. It reports `network-request` and `file-system` separately because IINA treats them as security-sensitive permissions.

The inspector does not execute plugin JavaScript, install the package, contact declared domains, or certify that the plugin is safe. Runtime compatibility still requires testing in the intended IINA version on macOS.

## Bundled Copier starter

The [integrated starter guide](plugin-starter.md) explains the included command, sidebar,
overlay and controller sources. Use the repository root Copier entrypoint for new consumers;
preserve their real answers file and update history. This is community tooling, not an
upstream-endorsed SDK or an assertion of native compatibility.
