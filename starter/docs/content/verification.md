---
title: "Verification and release gates"
description: "Evidence layers, Copier gates, and native versus simulated checks before release."
sidebar:
  order: 4
---

## Evidence layers

Offline Jinja fixtures test rendering syntax and file shape, not Copier history/merges.
Real Copier tests exercise copying and updates. Node contracts and negative compilation
check runtime boundaries. esbuild must produce inspected outputs. macOS/IINA tests separately
prove native behavior. Browser simulation is not native execution.

> [!WARNING]
> Browser simulation, Node VM tests, and synthetic archives are not native evidence.

The template workflow requires actual Copier and rejects an empty or skipped required
Copier suite. A second matrix creates real projects, explicitly installs dependencies,
formats the initial render, runs checks and builds production bundles and selected docs.

The generated release workflow produces a candidate stage. Native evidence, an exact
source tag and a committed lockfile are required by local release preparation. Publication
is intentionally manual. Tool versions selected in source are not automatically versions
executed by this archive's preparation environment.
