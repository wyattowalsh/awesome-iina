# Runtime evidence and limitations

Reference host: IINA 1.4.4. Native behavior has not yet been executed for this alpha.
Main APIs used: menu.item/addItem, console.log/warn, mpv.getString/getFlag,
event.on/off, sidebar.loadFile/show/hide or overlay.loadFile/show/hide/setClickable.
Controller: main global.postMessage(name,data); global global.onMessage and standaloneWindow.
UI: iina.postMessage/onMessage. Preferences HTML: data-pref-key, boolean data-type="bool".

The `types/` contracts are ORIGINAL NARROW interfaces based on this used subset, not
redistributed official declarations and not proof that every release supports them.
They reject runtime mixing by design. Broaden only after checking upstream symbols.
For use of the complete official type package, first verify its published version,
inspect ambient type side effects and add an upstream-compatibility check separately.

Sources:
- https://docs.iina.io/pages/dev-guide.html
- https://docs.iina.io/pages/webviews.html
- https://docs.iina.io/pages/plugin-preferences.html
- https://github.com/iina/iina-plugin-definition/blob/master/iina/index.d.ts

Pinned source truth must come from the intended IINA release, not moving documentation.
Build syntax targets es2019/safari13 are conservative candidates, not a tested macOS floor.
No preference changed-event or unload callback is assumed. Stop example session cleans
registered event handlers and disables publishing; re-enable the plugin to restart it.
This starter's state display is not a general RPC framework. Async file/media features
must add cancellation/generation handling appropriate to their real operations.
