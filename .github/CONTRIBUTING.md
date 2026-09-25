# Contributing

Contributions may add projects, improve metadata, refine discovery logic, or
correct documentation. Small, reviewable pull requests are preferred. See
[`docs/README.md`](../docs/README.md) for the repository layout.

## Add or update a catalog entry

1. Edit `src/awesome_iina/catalog/catalog.yaml` rather than the generated section of `README.md`.
2. Keep the description factual, original, and under 180 characters.
3. Add the strongest available source evidence. Official IINA listings are
   stronger than repository self-description alone.
4. Mark archived, experimental, commercial, or historically useful projects
   accurately.
5. Run:

```bash
just bootstrap
just validate
just generate
just check
```

A project should normally satisfy at least one of these conditions:

- it is IINA itself or an official IINA resource;
- it is an installable IINA plugin;
- it integrates another service directly with IINA;
- it is a companion app, browser extension, script, or workflow built for IINA;
- it is foundational media tooling documented in a clearly labeled section.

Generic mpv projects are not included merely because IINA uses mpv. They must
solve a common IINA workflow or be essential context for IINA users or plugin
developers.

## Discovery findings

Run `just discover quick` for a bounded local pass or `just discover full` for
all configured strategies. Discovery output is a review queue, never an
automatic endorsement. Add manual decisions to `src/awesome_iina/discovery/overrides.yaml` so they
remain reproducible.

## Pull-request checklist

- [ ] Repository URL and project name are correct.
- [ ] Description is factual and not copied wholesale from marketing text.
- [ ] Category, kind, and maintenance status are accurate.
- [ ] Duplicate forks or superseded projects are explained.
- [ ] `just check` passes.
- [ ] Generated files are committed.
