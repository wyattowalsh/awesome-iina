# Copier integration review and applied changes

Date: 2026-09-16. Scope: corrected v5 full codebase and the supplied full Copier starter.
No remote repository, installed IINA configuration, or user media files were modified.

## Provenance and scope

The exact input archive hashes and paths are recorded in
[`src/awesome_iina/repo/starter-integration.json`](../../../src/awesome_iina/repo/starter-integration.json).
The incoming starter is a complete source implementation, not a requirements document.
Its MIT license, original references, documentation, and test logic were retained.
Historical `VALIDATION.json` and current-at-import logs moved under `history/` before
running new checks. Source ZIPs have no Git ancestry; no upstream commit was invented.

The work is an explicit integration/implementation pass, not a claim that all changes
are behavior-preserving simplifications. The following prior review suggestions were
applied narrowly: RV-S-001 (canonical destination helper), RV-S-002 (shared archive
completeness predicate), RV-S-004 (named candidate sort and failure-outcome helpers).
RV-S-003's larger manifest-inspector decomposition and RV-S-005's possible public-symbol
removal remain deferred. The catalog package's version-source drift was separately fixed.

## Findings and resolutions

| ID | Evidence / impact | Applied resolution |
| --- | --- | --- |
| IN-001 | A global `.vscode` archive exclusion would remove editor settings from the template source | Ignore only the catalog root's personal `.vscode`; require the template settings in pre/post ZIP checks |
| IN-002 | Generated `validate.mjs` checked name/identifier but not the required author object | Require a nonempty author name and string-valued metadata, matching the host's object shape; add negative and positive Node tests |
| IN-003 | Fixture answers deliberately have no real Git lineage, yet the updater did not check this before invoking Copier | Reject explicit fixture markers and absent source/commit metadata before update; no claim that the guard verifies upstream trust |
| IN-004 | Standalone Copier tests alone cannot exercise the integrated `!include` entrypoint | Add root-wrapper copy/update tests, consumer edit/deletion preservation, managed-file updates, idempotence, and a merge-conflict test |
| IN-005 | Re-exporting imported success logs as new results would misstate current validation | Preserve old evidence under `history/` and write fresh, separately qualified ledgers |
| IN-006 | Direct invocation of `tools/audit_matrix.py` could not import its local `tools` module | Resolve its own project root explicitly; add an optional preset selector for bounded audit runs |
| IN-007 | Root packaging previously depended on repeated pre/post completeness policy | Use one predicate while preserving context-specific failure messages and CRC checks |

Generated author validation is intentionally a stricter check than the previous starter:
this is a correctness fix, not disguised simplification. No new plugin permissions,
network domains, runtime libraries, or external executables were granted.

The initial new Node author tests registered callbacks before awaited fixtures initialized;
actual fixture execution exposed this timing error. Fixtures now load before registration,
and all four preset variants are rerun. The failed development run is not a passing gate.

## Strengths preserved

The attachment already separates main/global/UI/build runtimes, bans runtime import
crossings, provides explicit handshake/sequence contracts, and limits installed assets.
It makes dependency installation, optional hooks, native linking, and publishing explicit.
It keeps consumer source seeds out of update writes, tracks native evidence separately,
and does not equate browser previews with IINA execution. These are meaningful boundaries,
not ceremony to be removed during cleanup.

The narrow contract declarations are authored template contracts. They are not a complete
copy of `iina-plugin-definition`, and do not certify the entire API or every host version.

## Research decisions

1. Copier's current configuration documentation explicitly supports YAML includes,
   multiple documents, `_subdirectory`, custom delimiters and `jinja2.StrictUndefined` as
   an import string. The suspected StrictUndefined incompatibility was disproved, so its
   configuration was preserved. The root wrapper only overrides `_subdirectory`.
2. Update-only `_exclude` is retained for author-owned seeds. Replacing it with
   `_skip_if_exists` would reintroduce files deliberately deleted by the consumer.
3. Copier 9.18.2 is the selected pinned version verified on PyPI. No package bytes could
   be installed here due DNS failure; official documentation is not execution evidence.
4. IINA's loader requires `author.name` and uses `globalEntry`. Examples that spell the
   latter `global` do not override the actual loader contract. The template rejects aliases.
5. TypeScript's compiler-API dependency remains separate from the selected CLI. Existing
   selected versions are preserved, not silently upgraded to chase newer package tags.
6. New just recipes use `quote()` for interpolated path arguments; the helper itself uses
   argument arrays rather than shell strings.

## Source references

Retrieved or checked on 2026-09-16:

- [Copier configuration](https://copier.readthedocs.io/en/stable/configuring/)
- [Copier updates and merge requirements](https://copier.readthedocs.io/en/stable/updating/)
- [Copier 9.18.2 release](https://pypi.org/project/copier/9.18.2/)
- [IINA plugin creation](https://docs.iina.io/pages/creating-plugins.html)
- [IINA loader](https://github.com/iina/iina/blob/develop/iina/JavascriptPlugin.swift)
- [TypeScript registry metadata](https://registry.npmjs.org/typescript/latest)
- [pnpm configuration](https://pnpm.io/settings)
- [just quote function](https://just.systems/man/en/functions.html)

Repository counts, passing tests, local fixture results, and archive checks belong to
[the verification ledger](2026-09-16-integration-verification.md), not this design review.

## Open validation gates

Real Copier create/update/merge/trust behavior, selected-toolchain dependency resolution,
production esbuild, Astro/Starlight builds, hosted CI, native IINA, formatter/type checker,
and a tagged release remain unverified until their named gates actually run. This archive
is an integrated source candidate, not a runtime-certified plugin or release certificate.
