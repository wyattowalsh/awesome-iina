# Maintainer runbook

## Pull requests

```bash
just bootstrap
just check
```

For catalog changes, verify source links manually and regenerate committed outputs.

## Scheduled discovery

The nightly workflow runs the quick REST query set at 03:17 America/New_York. The weekly
deep workflow runs the full REST and GraphQL query sets at 04:43 every Sunday, reconciles
them into one queue, and records a backend diff. Both have read-only repository permissions.
They do not push, open pull requests, install plugins, or promote candidates.

Each workflow restores its most recent cached snapshot when available and emits a change
summary. Cache loss only removes the comparison; the current artifact remains complete.
Failed normal steps still reach the evidence-upload step, while hard timeout or cancellation
can prevent later steps. See [`discovery-automation.md`](../../discovery/discovery-automation.md).

Local equivalents:

```bash
just discover-nightly
just discover-deep
```

Review every incomplete query before describing coverage as complete. Add a narrower query
when a code-search family repeatedly reaches the cap.

## Review queue

For each candidate in `output/discovery/review.yaml`:

1. confirm the repository is genuinely IINA-specific;
2. inspect `Info.json`, installation instructions, license, releases, and recent activity;
3. compare forks and similarly named implementations;
4. check network and filesystem permissions;
5. decide whether it belongs in the catalog;
6. record stable forced decisions in `src/awesome_iina/discovery/overrides.yaml`.

Do not commit reviewer decisions only inside the generated queue because the next discovery run replaces that file.

## Release archive

```bash
just archive
```

The archive script excludes caches, local environments, discovery scratch data, media reports, and previous archives. It writes deterministic timestamps and file ordering so identical repository content produces identical ZIP bytes.

## Structural policy checks

The repository root and generated README are executable contracts:

```bash
just lint-root
just lint-awesome
just doctor core
```

`src/awesome_iina/repo/root-policy.toml` owns the permitted root surface and relocation targets. Update the policy in the same pull request when a genuinely new root-level integration file is required. Do not bypass the linter by adding broad wildcard allowances.

The Awesome-list linter checks heading structure, required badges and links, generated markers, category ordering, duplicate catalog URLs, and local fragment targets.

## Comparing discovery runs

Use stable GitHub repository IDs to distinguish renames from removals and additions:

```bash
just diff-snapshots \
  output/discovery/previous.json \
  output/discovery/latest.json \
  output/discovery-diff.md
```

Metadata changes are evidence for review, not automatic maintenance-state changes.
