---
title: "Maintenance"
description: "Maintainer commands, lockfiles, Renovate groups, and template update review."
sidebar:
  order: 6
---

Use the justfile for maintainer commands. Bootstrap dependencies explicitly and commit
resolver-produced lockfiles. Renovate configuration includes a native Copier update group,
paired compiler dependencies, paired Astro/Starlight dependencies and pinned action updates.
No automatic merge or broad dependency-script trust is enabled.

The custom regex manager only locates declared package versions embedded in Jinja; tests
must catch inconsistent versions elsewhere. Review action source refs and instruction-file
changes as part of template updates. No actual GitHub bot or repository has been configured
by this archive.
