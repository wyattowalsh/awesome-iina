---
title: "Native acceptance"
description: "Record native IINA results on an isolated Mac; browser checks are not evidence."
sidebar:
  order: 5
---

> [!CAUTION]
> Use a disposable macOS account or an isolated test machine without personal media.

Test menu behavior, loading and closing media, multiple players, plugin disable/enable,
preferences persistence, UI reopening, and installation from the packaged archive.
For UI presets also test focus, keyboard navigation, narrow widths and theme changes.

`native-evidence.json` starts as `not-run`. Record the exact commit, IINA and macOS
versions and executed scenarios after a real session. Browser checks, presence checks,
Node VM tests and synthetic archives are not native evidence.

A package assembled on macOS is not automatically native-tested. Missing evidence blocks
local release preparation rather than becoming a passing native check.

The controller preset also requires a recorded `global-coordination` scenario.
Preferences-enabled projects require a `preferences` scenario. These are human-observed
results tied to the exact source commit, not simulated browser outcomes.
