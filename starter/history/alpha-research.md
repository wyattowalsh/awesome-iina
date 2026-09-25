# IINA Plugin Starter: research revision and implementation audit

Research date: September 13, 2026. Status: source alpha, not release-certified.

## Executive decision

Proceed with the separate Copier-powered starter. Its differentiator should be reliable
runtime boundaries and maintainable generated projects, not a large menu of frameworks.
The prior bundle was a design handoff. This revision supplies actual conditional template
files, runtime examples, developer commands, checks and real-Copier integration test code.
However, the installation environment still prevents executing Copier or the new JavaScript
toolchain; native IINA requires macOS. Therefore the source is a candidate implementation,
not evidence that generation, upgrading, production packaging and native execution all work.

The most consequential changes are separating current release research from cached examples,
separating TypeScript CLI from compiler API use, making dependency installation explicit,
protecting consumer-owned source, tightening lifecycle handling, and recording exact evidence.

## 1. Updated stack and why it changes the design

| Component | Selected target | Actual audit environment | Decision |
|---|---|---|---|
| IINA | 1.4.4 reference host | Not present | Keep native support unclaimed until exercised |
| Copier | 9.18.2 | Installation blocked | Real integration tests exist, explicitly skipped |
| Node | 24.21.0 LTS | 22.16.0 | Pin LTS rather than automatically selecting Current |
| pnpm | 12.4.1 | Not installed | Explicit new-major candidate, no installation claim |
| Type checker | TypeScript 7.0.2 CLI | TypeScript 5.8.3 CLI | Latest selected compiler is not the audited compiler |
| Compiler API | @typescript/typescript6 6.0.2 | TypeScript 5.8.3 API | Keep API tooling separate from native TS7 CLI |
| Bundler | esbuild 0.28.2 | Not installed | Production bundle gate still open |
| Template testing | pytest + real Copier | pytest/Jinja available | Fixture checks are not Copier merge tests |
| Runtime unit checks | node:test + small VM harness | Executed | No claim of JavaScriptCore or WKWebView equivalence |

These selections come from primary release and documentation checks [R01,R05,R07,R08,R09,R10,R12].
The exact package graph has not been resolved, and no fabricated lockfile is included.

### pnpm 12: verify the actual release rather than assuming a snippet is latest

Context7 surfaced useful pnpm 11 contracts. The release cross-check found pnpm 12.4.1.
The 12.0 announcement says its commands, settings and lockfile format largely carry over;
it also documents stricter behavior for unknown workspace settings under a matching version
pin. The release tag and npm default dist-tag are different questions [R04,R05].

The starter uses an explicit packageManager pin rather than relying on an unqualified
installation to select the intended major. It writes policies to pnpm-workspace.yaml:

```yaml
minimumReleaseAge: 1440
blockExoticSubdeps: true
strictDepBuilds: true
verifyDepsBeforeRun: error
allowBuilds:
  esbuild@0.28.2: true
```

The easily missed setting is verifyDepsBeforeRun. Current documentation describes automatic
installation as its default. For this starter, `error` is preferable: a seemingly harmless
check command should not silently resolve or install a different graph. New build scripts
fail for explicit review; blanket approval is not a repair [R06]. A maturity window is a
risk-reduction measure, not proof that a dependency is safe. Registry inspection, advisories,
provenance where available, lock review and restricted CI credentials remain relevant.

### TypeScript 7: do not build new tooling on an API it does not ship

The retrieved release is 7.0.2. Microsoft's announcement describes the native CLI and the
absence of a compiler API in 7.0, with a TypeScript 6 compatibility package for API consumers
[R08,R09]. That matters because AST import checks and this small isolated unit-test loader
need programmatic parsing/transpilation, whereas project typechecking only needs the CLI.

The candidate uses `typescript: 7.0.2` for tsc and `@typescript/typescript6: 6.0.2` for the
programmatic adapter. It does not assume `import typescript` still supplies both contracts.
Two compiler packages are a temporary maintenance cost, not an ideological preference.
A lean alternative is the compatibility compiler alone until the native/API transition is
accepted locally. Do not substitute a new native API into the checks without regression tests.

Explicit target, lib, rootDir, moduleResolution and types are still valuable even where newer
defaults overlap the intended settings. Build semantics should not depend on a compiler upgrade
silently changing defaults. No speedup is claimed for this starter from upstream benchmarks.

### Why the default remains vanilla

Four fixed presets and an optional preference page provide useful breadth without a large
framework/package-manager matrix. React is a later profile after local-file loading and native
UI acceptance. Vue is not a free checkbox during a compiler/API transition. Tailwind or a
component library should solve an actual UI need rather than add a pipeline to a status label.

Use node:test initially because the authored pure state and contract cases do not require a
larger mocking platform [R23]. Adopt Vitest when real feature tests justify its runner, mocking
or browser facilities. Browser automation, accessibility testing and richer CSS lint/format
checks are additional layers; this alpha does not mislabel its boundary checker a complete linter.

## 2. The implemented template is deliberately explicit

The source tree generates command, sidebar, overlay and controller examples, with or without
native preferences. The controller demonstrates global-owned window creation and main-to-global
messaging; it is not a workspace-restoration product. No network or external execution capability
is added. Overlay alone requests its required overlay permission. No key binding is stolen.

The generated project separates `src/main`, `src/global`, `src/ui` and `src/shared`. Each runtime
has its own TypeScript configuration. Ambient `iina` types expose only the selected role's used
surface. Shared modules have neither DOM nor Node globals. Tooling stays in scripts/.

The narrow interfaces are original starter contracts checked against relevant upstream symbols,
not vendored copies of all official typings. This is an explicit alpha compromise: a complete
upstream type-package publication/parity check remains open. A broad global declaration would
allow invalid global/player/UI combinations to compile and weaken the point of separation.
The declarations and APIs we inspected are documented in the source registry [R13-R18].

Negative compiler tests intentionally reject DOM and Node globals in the player, mpv/event in
the global entry, host APIs in the UI, and the wrong directional global-message overload.
Syntax-aware source checks reject forbidden imports and dynamic loading rather than matching
words in comments. Their purpose is architectural enforcement, not containment of hostile code.
Baseline runtime imports are local-only; a dependency needs an intentional policy extension.

## 3. Small lifecycle contracts beat a speculative SDK

The sidebar/overlay example waits for a ready message before sending a snapshot. Its protocol
has a fixed channel/version, a view identifier, a monotonic sequence, bounded text and exact
message fields. The UI renders textContent, not interpolated HTML. It ignores stale sequences,
duplicates and snapshots addressed to an obsolete view. The baseline cannot ask the host to
execute arbitrary commands, read files or fetch an arbitrary URL.

A duplicate ready message from the current view does not reset its sequence. Stopping the
example clears its owned event subscriptions and marks the session inactive, so a late ready
message cannot revive publishing. Disposal is idempotent, reverse-order and continues through
cleanup errors. Both cases have regression tests in the supplied code.

There is deliberately no invented universal unload callback. IINA onMessage registration is
not treated as though it returned a documented removable subscription. The sample registers
once and gates its local behavior. It does not claim hot reload, full multi-view concurrency,
request cancellation or media-specific asynchronous task cancellation. A future asynchronous
feature needs its own media generation token and cancellation model. A timeout alone does not
prove the underlying operation stopped.

Native preference HTML uses IINA's binding mechanism for a boolean preference [R18]. The simple
example refreshes on its documented menu/event paths rather than inventing a preference-change
event. The controller keeps player operations out of global code, and no player-inventory API
is fabricated from familiar names in unrelated libraries.

## 4. Copier manages infrastructure, not ownership of application behavior

Consumer seeds are `src/**`, application unit tests, README, Info.json, LICENSE and project
identity/configuration. Maintained areas are scripts, narrow type boundaries, contract tests
and runtime/update references. package.json and some configuration are shared. Dependency
locks and staged bundles are derived outputs. This classification belongs in review, not just
in a directory diagram.

The update-conditioned destination exclusions use Copier's documented pattern. Unlike merely
skipping an existing file, they protect the deliberate absence of a deleted application seed
[R02]. This must still be proven by real Copier tests. The fixture renderer cannot validate
merge semantics. Our 13 real-Copier tests cover eight copies, four edited/deleted-consumer
upgrade scenarios with a no-op repeat, and dirty-worktree rejection; all were skipped here.

Seed protection has a cost: changes to an old sample adapter do not automatically patch every
consumer. A maintainer needs a migration advisory or an explicitly reviewed application patch.
Do not call that a limitation solved by force-overwrite. Similarly, selecting a different preset
or adding a surface after substantial user development is an application migration, not simply
editing stored answers. The supplied update wrapper permits a revision only, not answer changes
or trust flags. Raw Copier remains available and can bypass the wrapper's policy.

Require a clean separate template-update branch/worktree and an explicit immutable target.
Review the whole diff, including agent instructions, manifest capabilities, lockfile and CI
privileges. Reconcile dependencies explicitly. Do not auto-resolve merge conflicts or treat a
new template tag as an automatic plugin release. Answers and Git history are part of the
project's update lineage [R03]. A ZIP alone does not establish that lineage.

The configuration remains declarative: no automatic Copier tasks, migrations or third-party
Jinja extensions. StrictUndefined catches missing template inputs. Custom delimiters avoid
collisions with JavaScript/Actions syntax. Every conditional path component is independently
valid Jinja, an important detail when conditional directories and filenames are combined.
Display strings are serialized as data; identity and path fields receive separate validation.
Python bytecode/test caches are excluded rather than accidentally becoming generated files.

## 5. Build and packaging are distinct from source checks

The production build script specifies host-neutral and browser builds explicitly, bundles to
IIFEs, disables code splitting and inspects output metadata [R11]. Runtime dependency imports
and unresolved output imports fail. Syntax targets es2019/safari13 are candidate lowering
choices, not evidence of the oldest supported macOS version or a promise of API polyfills.

A build lock prevents overlapping writes in one checkout. A failed compile does not first
remove the last known-good stage. New output is assembled under a temporary stage, verified,
then switched into place with rollback handling. A stale lock needs explicit inspection rather
than unsafe automatic removal. This is not a claim that filesystem rename is an end-user
transaction across every possible watcher or OS event.

The package boundary is an exact allowlist for each preset. Required entries, relative assets,
identity and baseline permissions are checked. Source files, instructions, dependency trees,
unknown assets, symlinks and executable files are rejected. A content hash manifest identifies
staged bytes. License text is included alongside newly authored code. Future runtime dependencies
will need their own license/notice policy, not just an import exception.

The inspected 1.4.4 CLI derives development names from the source basename, and its pack command
constructs a shell command [R16]. The wrapper therefore uses a safe temporary packaging path,
passes process arguments without a shell itself, invokes the official packer and compares the
archive against the verified stage without extracting it. It refuses overwriting an existing
release archive. Link checks reject another checkout's link and never restart IINA. Unlink can
be attempted even after generated output has been removed, while still checking link ownership.

The archive verifier has tests for allowed contents, altered bytes, duplicates, path escapes
and symlinks. The staged artifact tests use synthetic files and are labeled as such. They do
not demonstrate that esbuild output or the native packer works. Real packaging from macOS,
including spaces/Unicode in project paths, remains an acceptance gate.

## 6. Agent support is repository-scoped and privilege-aware

AGENTS.md is the canonical local contract. CLAUDE.md imports it, instead of maintaining a second
large instruction document [R19,R21]. Development skill launchers exist under the documented
Codex and Claude locations and are parity-checked [R20,R22]. They point at focused runtime,
update and native references rather than embedding entire external documentation sites.

Packaging has a separate explicit-invocation adapter: Claude uses disable-model-invocation,
and Codex uses agents/openai.yaml with allow_implicit_invocation disabled [R20,R22]. This controls
discovery/invocation behavior, not a security sandbox or an authorization to publish. There are
no broad allowed-tools grants, global configuration edits, automatic remote MCP registration,
model/version mandates or end-user telemetry.

Context7 is useful for discovery and contract retrieval, but release/source checks are still
necessary. This review caught both stale-major assumptions and overload details that a retrieved
summary could blur. Record the underlying URL, release/ref and limitation. A declaration blob
SHA is not a commit SHA. A current repository version is not proof of an npm publication, and
successful compilation is not proof of host availability. The source ledger keeps those apart.

`docs/agent-evaluation.md` specifies reproducible future Claude/Codex acceptance tasks. These
have not been run against either client. The output metrics should be incorrect APIs, failed
checks, unnecessary privileges and human repair effort, not invented productivity percentages.

## 7. What was executed and what is still open

Executed: 48 Python checks, including eight fixture shapes, serialization/validation,
deterministic rendering, archive rules and 11 negative compiler cases. Eight generated fixture
projects passed their available typecheck, source-boundary and manifest-policy commands.
There were 284 successful Node test executions across the eight variants; many are the same
contract repeated under another preset, not 284 distinct requirements.

The environment used Node 22.16.0 and TypeScript 5.8.3. Their audit overrides are recorded in
raw logs and structured evidence. They are not relabeled as the selected Node 24/TypeScript 7
stack. The constrained runner could not fetch Copier dependencies. Thirteen real-Copier tests
were explicitly skipped. pnpm installation, the selected compiler/API versions, esbuild builds,
IINA native execution and native packaging, client discovery and GitHub install/update were
not executed. See VALIDATION.json and evidence/ for the machine-readable record.

This is meaningfully more than the previous design-only bundle, but not ready for an honest
"all green, production-ready" release badge. The next proof is concrete: install the pinned
toolchain, run the existing real-Copier cases, build all eight real-generated projects, inspect
archives and run native acceptance on a named host/macOS combination. Then expand the upgrade
suite to conflict handling, skipped versions, profile migration and privilege drift.

## 8. What to defer, and the release criterion

Do not initially add a published custom IINA SDK, a universal RPC bus, a required daemon,
a monorepo orchestrator, helper executable distribution, a mandatory agent service, arbitrary
framework combinations or an automatic media-library scanner. These broaden the support
surface without proving the core generator/update/install workflow.

Add a formatter/linter and dependency-update workflow after verifying compatibility with the
chosen compiler layout. Add property-based tests when a richer message/state schema appears.
Add browser/accessibility automation for real interactive UI, keeping its result distinct from
embedded IINA webviews. Add native logging/inspection helpers only when they provide genuinely
missing observability. Keep those capabilities developer-only and opt-in.

The release criterion is not number of files or integrations. It is a generated plugin that
works on the declared host, remains maintainable without the generator, preserves the author's
intent through a real update, and can be packaged and upgraded without undocumented steps.
