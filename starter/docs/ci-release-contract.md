# CI and release contract (workflow deployment pending)

The alpha does not ship a pretend-green release workflow. Implement these jobs after exact
selected dependencies can be installed and real Copier tests pass:

1. Template test job: pinned Python/Copier, real tagged Git copy/update tests, eight variants.
2. Generated project jobs: Node pin, pnpm pin, reviewed lockfile creation/frozen reinstallation,
   type checks, source boundaries, Node tests, esbuild output, staging validation.
3. Upgrade job: evolved consumers, deleted seeds, no-op update, skipped-version update,
   shared-file conflict, permission expansion and dirty-worktree rejection.
4. Native macOS job/manual gate: dedicated fixture media and a named IINA build. Package
   using its CLI; inspect exact archive bytes. Record not-run when GUI validation is absent.
5. Explicit publishing job: only after approved tag and artifact verification. No release
   credentials in untrusted PR jobs. Pin actions to inspected full commit SHAs, not invented
   SHAs or moving majors. Preserve lockfiles and hash manifests as evidence.

A template update and a dependency update should remain distinguishable changes, even when
performed on one reviewed branch. Protect manifest permissions, release workflows, generated
agent privilege files and lockfile/build-script decisions with semantic review gates.

GitHub asset install and two-version plugin update must be tested separately. Keep user data
schemas out of template migrations. No automatic plugin release version increment merely
because infrastructure was updated. Release archives include the source license notice and
any future third-party runtime notices. A SHA-256 digest identifies bytes; it is not provenance
or a signature. Add attestations only through a verified, credential-scoped publishing path.
