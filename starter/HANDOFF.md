# Integration revision handoff

Current source revision: **0.2.0a2**. Read `VALIDATION.json` for this revision's executed
and blocked gates. Original import logs and its validation record are under
`history/import-0.2.0a1-*`. The older handoff below is historical design context, not
proof that an older toolchain or run count was repeated.

New work: preserve author-owned update seeds and runtime boundaries; execute real Copier
and selected Node/pnpm/compiler builds in CI; then perform native IINA acceptance.
The four integrated-root tests synthesize a wrapper in standalone-export test runs rather
than skipping those tests. No source repository has been published by this delivery.

---

## Original import handoff (historical)

# Next acceptance pass

The full source is present. Do not replace it with a new scaffold. Preserve existing
runtime contracts, consumer ownership, action pins and documentation export behavior.

1. On a networked machine, run uv sync and the real-Copier suite with REQUIRE_COPIER=1.
2. Run tools/integration_matrix.py across every advertised preset/preferences/docs profile.
   It explicitly normalizes the fresh render before quality checks. Resolve any framework,
   compiler API, pnpm policy or formatting issues; do not grant blanket build-script trust.
3. Generate and review actual Python, pnpm and optional mise locks. Commit them normally.
4. Run actionlint and zizmor against root and rendered workflow YAML. Fix diagnostics,
   then exercise workflows on a disposable test repository without production secrets.
5. Build the real Starlight sites. Test Pagefind search, project subpaths, keyboard behavior
   and Markdown exports. Local-link checks do not cover remote links or heading anchors.
6. On a disposable macOS account, use actual IINA 1.4.4 for native load/UI/lifecycle,
   packaging and two-version installation/update tests. Keep the beta host lane separate.
7. Test native CLI path quoting, multiple dev links, release report binding and copy/update
   with consumer edits/deletions/conflicts. Add skipped-version/profile-migration fixtures.
8. Only then revise compatibility claims or activate public plugin-release automation.

Report commands and exact versions run, failures, skipped layers and artifact hashes.
Do not label browser simulation as native execution or record counters as distinct features.
