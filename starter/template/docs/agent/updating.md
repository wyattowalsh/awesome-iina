# Reviewed template updates

Commit the actual Copier answers and all application changes. Work on a clean branch
named `template-update/<description>` or `renovate/<description>`; never run recopy as a substitute for update.
Run `pnpm run template:check`, then `pnpm run template:update -- <immutable-tag-or-sha>`.
The wrapper accepts only a revision, not answer changes or trust flags. It does not
install dependencies, auto-resolve conflicts, or publish. Read the resulting diff.

`src/`, application tests, README, Info.json, LICENSE and .iina-project.json are
seed-only. Identity means plugin name, identifier, and Info.json — not Starlight colors.
Copier updates overwrite `site/**`; consumer theming there will be replaced. Update-conditioned
exclusions protect deliberate deletion too. They also mean old application seeds do not
automatically receive new fixes. Review migration advisories and maintained recipes.
Preset/preferences/identity transitions are explicit application migrations, not answer
edits. Raw Copier can bypass the wrapper contract.

Shared package/config changes may conflict. Reconcile the lockfile explicitly with
pnpm install and inspect all new build-script decisions. Only then run frozen installs
in CI. The template ships no fabricated lockfile. First installation is not guaranteed
byte-identical across future dates; the committed lockfile governs later installs.

Independent histories: template revision, plugin version, dependency graph, host target,
and end-user state schema. Changing one never silently changes the others.
