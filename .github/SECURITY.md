# Security policy

## Supported scope

Security reports are accepted for the maintenance tooling in this repository,
including command execution, path handling, generated workflows, and unsafe
processing of GitHub or media metadata.

Third-party IINA plugins and tools remain the responsibility of their own
maintainers. We can mark an entry with a warning or remove it, but we cannot
patch an external project.

## Reporting

Do not open a public issue for an unpatched vulnerability. Email
`wyattowalsh@gmail.com` with:

- affected component and revision;
- reproduction steps or a minimal proof of concept;
- impact and realistic attack preconditions;
- any suggested remediation.

The crawler treats all remote text and metadata as untrusted input. It never
executes code from discovered repositories.
