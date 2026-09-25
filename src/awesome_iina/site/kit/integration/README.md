# Safe local integration

The integration tool reads a brand kit and writes only planned files in a separately
selected local project. It does not replace a full repository, execute its scripts,
read authentication, stage Git files, contact GitHub or deploy anything.

## Plan → inspect → apply → check

```bash
python3 scripts/install_brand.py plan --target /path/to/repository --output /tmp/brand-plan.json
# Inspect /tmp/brand-plan.json before applying it.
python3 scripts/install_brand.py apply --plan /tmp/brand-plan.json
# Use the receipt path printed by apply; do not substitute a guessed transaction ID.
python3 scripts/install_brand.py check --receipt /exact/printed/path/receipt.json
```

`plan` performs no target writes. It records the source fingerprint, target contents,
file modes, after hashes, actions and conflicts. A changed source or target invalidates
the plan. `apply` preflights the complete plan before writing, creates backups, writes
individual files atomically and records the outcome. Reapplying the identical successful
plan is a checked no-op. Making a new plan on an unchanged installation also produces
no changes. Symlink destinations/parents and traversal paths are refused.

The receipt and backups are stored inside `.awesome-iina-brand/transactions/` in the target.
Keep this directory private and out of commits: it may contain earlier local README text.
The installer does **not** edit `.gitignore` for you. Review it and add
`.awesome-iina-brand/` to your ignore policy when appropriate.

## Existing assets

Identical files remain untouched. Differing files previously installed and still matching
a successful receipt may be updated. Differing unowned files are conflicts. To deliberately
replace them, create a new plan with `--replace-existing` and review it before applying.
Every changed existing file is backed up. There is no force-undo that discards later edits.

## README preservation

The managed block is delimited by `<!-- awesome-iina:brand:start -->` and
`<!-- awesome-iina:brand:end -->`. Existing bytes outside that region remain unchanged,
including BOM and CRLF line endings. Duplicate, incomplete or reversed markers are errors.

A generated README must be edited at its source. Select it explicitly, for example:

```bash
python3 scripts/install_brand.py plan \
  --target /path/to/repository \
  --readme templates/README.header.md \
  --rendered-readme README.md \
  --output /tmp/brand-plan.json
```

Here links are intended to render in the root README even though the edited file is a
template. The existing generated `README.md` is left unchanged. Run the project's normal
generator separately after reviewing the installation. The kit never executes it for you.

## Framework public directory and custom website path

```bash
python3 scripts/install_brand.py plan \
  --target /path/to/repository \
  --public-dir public \
  --site-url https://example.org/catalog/ \
  --social opengraph \
  --output /tmp/brand-plan.json
```

Assets go to `public/assets/brand/`. GitHub README references use that actual repository
path; HTML metadata uses the served `/catalog/assets/brand/` path. Do not include `public/`
in the site URL unless it really is part of your deployed URL.

Website files are generated in `integration/awesome-iina-brand/`. The tool does not edit
an arbitrary framework head component. Merge `website-head.html` yourself or adapt its
values to your framework's API. `--social github` declares 1280×640; `--social opengraph`
declares the provided 1200×630 asset. The manifest's icon paths resolve relative to its
location. `start_url` and `scope` use `../../` from `assets/brand/`, but `id` is
an explicit origin-relative identity such as `/awesome-iina/`, not a manifest-directory-relative path.

No maskable icon, PWA installability or native-app claim is added. GitHub social-preview
upload remains a separate owner action in repository Settings.

## Undo and interrupted-run recovery

```bash
python3 scripts/install_brand.py undo --receipt /exact/printed/path/receipt.json
```

Undo first checks all installed hashes and backups. If any file changed after installation,
it refuses the operation rather than erasing an external edit. Otherwise it restores
original bytes/modes and removes only files created by this transaction. Empty directories
and the receipt are retained. An undone transaction cannot be silently re-applied with its
old plan; retain the audit trail and plan a fresh integration in a clean working copy.

A caught write error attempts to restore already-written files. If a process is killed or
the computer loses power, the receipt may remain `applying`. This is **not** a filesystem-wide
atomic transaction. Stop other edits, inspect the receipt/backup files and check the lock
PID. Only after confirming no installer is active may you remove a stale
`.awesome-iina-brand/LOCK`, then run:

```bash
python3 scripts/install_brand.py recover --receipt /exact/transaction/receipt.json
```

Recovery accepts only known before/after hashes and refuses unrelated changes. It rolls
back matching installed files and retains the journal. Corrupted backups or unexplained
states need manual review; there is no destructive auto-recovery. The lock coordinates
this tool only, not your editor or other software. Run integration on a clean worktree
and avoid concurrent writes. Backups are not authenticated against a hostile local user.

## Exit codes

- `0`: valid plan/no-op/successful operation.
- `1`: invalid input, stale plan, I/O failure, unsafe path, lock, or refusal.
- `2`: plan conflicts or failed post-install drift check; no silent success.

## Local review

Open `review/index.html` directly, or serve this kit with `python3 -m http.server 8000`
and use that local server where the environment permits it. The included Chromium
proof deliberately uses inlined bytes when its managed policy blocks localhost. It is
not evidence of browser-tab favicon choice or an actual GitHub upload.

## Stable application identity and optional historical artwork

`--app-id /awesome-iina/` defaults to the explicit value in `source/deployment.json`. It is deliberately independent of `--site-url`: relocating the same app or incrementing the kit version does not create a new identity. For another independent project on the same origin, supply its own ID, for example `--app-id /identities/another-catalog`. The supported policy is an ASCII root-relative path with no query, fragment, encoding or dot segments; no slash is silently added or removed.

```bash
python3 scripts/install_brand.py plan \
  --target /path/to/repository \
  --site-url https://example.org/relocated-catalog/ \
  --app-id /identities/my-iina-catalog \
  --output /tmp/brand-plan.json
```

Repeat the same chosen options when making subsequent plans. A freshly constructed plan does not infer another project's existing identity from its files. If the old root identifier was already installed by users, review that migration explicitly rather than asserting a seamless update. No installed population is evidenced by this bundle.

Default plans copy only `primary_assets` from `source/shipping-selection.json`. Use `--include-legacy-hero` only to copy the unchanged historical illustration deliberately; it is never inserted into the managed README. The production-only ZIP omits it. Updating an earlier installation does not delete now-unselected assets: the installer is not a garbage collector and does not silently erase a historical file. Current primary markup simply does not reference it.

The v2.1.1 upgrade smoke test changed the manifest and generated deployment record, plus normalized the head snippet's terminal newline in a synthetic v2.1.0 installation. Its undo restored the preceding installation byte-for-byte. This is not a claim that your checkout has been changed.
