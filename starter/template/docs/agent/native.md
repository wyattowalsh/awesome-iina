# Native validation gate

Set IINA_CLI to the installed iina-plugin executable, or use the default
/Applications/IINA.app/Contents/MacOS/iina-plugin on macOS. Doctor only reads metadata.
Build before link; it links `.build/<slug>`. The script refuses an existing conflicting
link. It never restarts or stops IINA. Use a small media fixture, not a private library.

Manual acceptance: enable plugins; enable this plugin; open media; invoke its menu;
for UI presets verify readiness, pause/unpause and media replacement; verify stop session;
open two players; disable/re-enable; change preferences and refresh; inspect console;
close/reopen views. Controller global menu must work without a selected player.

Pack stages a fresh safe temporary directory and calls the official CLI. It then compares
archive contents against the staged allowlist. The packer requires Python 3 only for
stdlib ZIP inspection in this alpha (development dependency, not plugin dependency).
Manual installation, GitHub asset installation and update detection are different tests.
This alpha intentionally does not publish or claim two-version GitHub update support.

Support requires recording IINA version, macOS version, CPU architecture, exact commands
and outcomes. Doctor being successful is not a native test result.
