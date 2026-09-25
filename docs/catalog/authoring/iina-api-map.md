# IINA API and tooling map

This is a navigation map to primary documentation, reviewed on 2026-09-16, not a vendored
SDK or a claim that every API works in every released host. The
[official index](https://docs.iina.io/index.html) groups the API as follows.

| Responsibility | API modules |
| --- | --- |
| Playback and events | `core`, `event`, `mpv` |
| Extensions | `menu`, `subtitle`, `playlist`, `input` |
| Web interfaces | `overlay`, `standaloneWindow`, `sidebar` |
| System and network | `file`, `utils`, `http`, `ws` |
| Multiple players | `global` |
| Diagnostics and settings | `console`, `preferences` |

Start with the [development guide](https://docs.iina.io/pages/dev-guide.html), then the
[global-entry guide](https://docs.iina.io/pages/global-entry.html),
[webviews](https://docs.iina.io/pages/webviews.html),
[preferences](https://docs.iina.io/pages/plugin-preferences.html), or
[subtitle providers](https://docs.iina.io/pages/subtitle-providers.html) for the actual
feature being built. The template's narrow contracts model the APIs its presets use;
they must not be advertised as a complete copy of `iina-plugin-definition`.

## Keep the environments distinct

Main player instances, a plugin's global instance, browser/webview JavaScript, and Node
build scripts have different capabilities. Do not assume Node modules or browser globals
exist in a host entry script. Preserve the starter's import-boundary and message-contract
checks rather than weakening them to accommodate an unverified API call. Main/global
lifecycle behavior and webview communication need native host testing in addition to mocks.

The [official definition package](https://github.com/iina/iina-plugin-definition) supplies
ambient TypeScript declarations. Before expanding template contracts, inspect the relevant
declarations, compare the actual target release's host implementation, record that version,
and add a targeted fixture. Documentation built from a development branch can run ahead
of the installed application. Do not equate installing types with host compatibility.

## Source, generated project, and installed plugin

The root ZIP is the complete **catalog and generator source**. Copier creates a separate
consumer project. Its production build emits a staged plugin. IINA's own `iina-plugin`
CLI handles native development linking and `.iinaplgz` packaging. These are not interchangeable
archives. The CLI ships with IINA from 1.4.0; see
[creating plugins](https://docs.iina.io/pages/creating-plugins.html).

The manifest uses `globalEntry`, not a `global` alias. Keep the required author object,
entry script, permission declarations, and update metadata consistent with the target
loader. A source repository URL alone is not evidence that installation will succeed:
compiled entry assets and an appropriate release/installation path must exist.

## What is bundled, and what is a reference

This repository contains the complete Copier starter, its own checks, authored documentation,
the curated catalog and discovery implementation, and the supplied brand kit. Third-party
plugins, IINA binaries, mpv, FFmpeg, SDKs, media libraries and fonts are **not** bulk-installed
or copied into consumer plugins. Their catalog entries and official documentation links
are references. Install a selected dependency explicitly after reviewing its source,
license, platform requirements and permissions.

IINA Store is a native in-player discovery/installation plugin, as described in its
[project README](https://github.com/Kuameh/iina-store). It is cataloged as such, not bundled
as a second installer or an embedded hosted-service dependency. The browser catalog in
this repository is a static reference index, not an installation service.
