# ADR 0004: Embed one complete Copier starter without coupling the catalog runtime

Date: 2026-09-16. Status: implemented; real-Copier and installed-toolchain verification pending.

## Decision

Keep the supplied starter as a self-contained project in `starter/`.
Expose it with a tiny root `copier.yml` using Copier's documented multi-document `!include`
and `_subdirectory` override. Do not duplicate its questionnaire or make the registry's
Python package import its Node build system. A local integration helper provides explicit,
shell-free commands and refuses dirty/unversioned source or overlapping destinations.

This is one template with presets. All integrated consumers follow this repository's Git
history and explicit selected refs. An exported standalone source may be independently
published later, but switching histories is a migration, not a transparent update.

## Alternatives rejected

- Rebuilding a smaller template would throw away the attachment's tested runtime boundaries.
- A submodule would make the promised complete ZIP depend on a second checkout.
- Duplicating the questionnaire at root would create two update policies.
- Making Copier/Node dependencies mandatory for catalog usage would couple unrelated tasks.
- Adding the not-yet-published starter as an already-reviewed remote catalog item would
  misrepresent publication and compatibility evidence.

## Consequences

Archive guards must verify both source surfaces, including template editor files. Root
Python lint owns the catalog; nested checks own the template. CI must generate from the
actual root entrypoint, not just the nested standalone template. Root structural validation
cannot claim to implement Copier's rendering and merge logic.

References: [Copier configuration](https://copier.readthedocs.io/en/stable/configuring/),
[Copier updates](https://copier.readthedocs.io/en/stable/updating/).
