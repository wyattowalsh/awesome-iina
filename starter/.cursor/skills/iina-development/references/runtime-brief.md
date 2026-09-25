# Runtime brief

Pinned host notes for a typed IINA plugin in a **generated IINA plugin repo**.
Full detail: generated `docs/agent/runtime.md`. Reference host: IINA 1.4.4.
Native behavior is a separate evidence layer.

## Used subset (do not invent past this without checking pinned source)

- Menu: `menu.item` / `addItem`
- Log: `console.log` / `console.warn`
- Player: `mpv.getString` / `mpv.getFlag`
- Events: `event.on` / `event.off`
- Sidebar: `sidebar.loadFile` / `show` / `hide`
- Overlay: `overlay.loadFile` / `show` / `hide` / `setClickable`
- Controller main: `global.postMessage(name, data)`
- Controller global: `global.onMessage` and `standaloneWindow`
- UI: `iina.postMessage` / `onMessage`
- Preferences HTML: `data-pref-key`, boolean `data-type="bool"`

`types/` in a generated IINA plugin repo are original narrow interfaces for this
subset, not redistributed official declarations and not proof every IINA release
supports them.

## Info.json permissions (user-consent)

IINA shows declared `permissions` (and `allowedDomains`, if present) at install.
They are user-consent, not a check-pass switch.

| Permission | Required when using |
| --- | --- |
| `show-osd` | `iina.core.osd()` |
| `show-alert` | related `iina.utils` dialogs |
| `video-overlay` | `iina.overlay` (overlay baseline only) |
| `network-request` | `iina.http` |
| `file-system` | `iina.file` or `iina.utils.exec()` |

Do not add `allowedDomains` or wildcard hosts. The agent hook always denies
Info.json permission expansion. A permission migration is a human edit outside
the agent; `afterFileEdit` still cannot unwrite the file.

## Sources to confirm before a new symbol

- https://docs.iina.io/pages/dev-guide.html
- https://docs.iina.io/pages/webviews.html
- https://docs.iina.io/pages/plugin-preferences.html
- Pinned IINA plugin definition for the intended release, not moving docs alone

## Limitations

No preference changed-event or unload callback is assumed. Stop-session examples must
unregister handlers. This starter's messaging is not a general RPC framework. File/media
async work needs cancellation appropriate to the real operation.

Main JavaScriptCore is not Node and not a browser (no `fetch`, no DOM `window`).
Global JavaScriptCore has no current player. UI WKWebView has a narrow message port,
not the host API. Shared code has neither.

Build syntax targets `es2019` / Safari 13 are conservative candidates, not a tested
macOS floor.
