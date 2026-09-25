---
title: "Profiles and ownership"
description: "Preset, preference, documentation, and hooks choices, plus seed versus managed ownership."
sidebar:
  order: 3
---

Four presets are available: command, sidebar, overlay and controller. Preferences are
independent. Documentation is Markdown by default; Starlight adds static-site tooling.
Hooks are optional configuration and are never installed during generation.

Application code, application tests, manifest identity and user documentation are seeds.
Managed scripts and checks evolve with template versions. Shared package metadata needs
reviewed merges. Changing a preset or documentation profile is an explicit migration.

The installed plugin never contains the site, tests, build dependencies or agent instructions.
Fumadocs, React/Vue, external helpers, AI services and runtime networking are not included.
