# Scope and inclusion policy

## In scope

- IINA itself and official project infrastructure.
- Installable IINA plugins.
- Browser extensions, companion apps, scripts, and automations made specifically for IINA.
- Integrations with media servers, tracking services, subtitle sources, casting targets, and macOS workflows.
- Plugin templates, type definitions, API documentation, debugging tools, and representative examples.
- A deliberately small set of foundational media tools that materially explain or support IINA workflows.
- Historical projects with clear migration or implementation value.

## Out of scope

- Generic macOS media players with no direct IINA relationship.
- Every mpv script or shader merely because IINA embeds mpv.
- Unverifiable binary mirrors, piracy-focused integrations, credential-stealing tooling, or malware.
- SEO pages, scraped repository mirrors, empty forks, classroom copies, and keyword-only false positives.
- Projects whose only relationship is a passing README comparison with IINA.

## Review criteria

A maintainer checks direct relevance, repository identity, source provenance, installability, license visibility, archived status, security-sensitive permissions, duplicate or superseded implementations, and factual description accuracy.

Stars are discovery metadata, not an inclusion threshold. New and niche projects can be valuable. Likewise, popularity does not override safety or relevance concerns.

## Security and privacy

> [!WARNING]
> Inclusion is not a security review. Plugins can request network, filesystem, overlay, and other permissions. Inspect the repository, manifest, releases, and requested domains before installation.

Security reports about this repository belong in [`.github/SECURITY.md`](../../../.github/SECURITY.md); reports about linked software belong with that project's maintainers.
