Follow `AGENTS.md`. Preserve the discovery/curation boundary, edit `src/awesome_iina/catalog/catalog.yaml` instead of generated catalog output, retain evidence for uncertainty, and run `just check` before completing repository changes.

The complete Copier project lives in `starter/`; it has separate
runtime contracts, source ownership, dependency installation, tests and CI. Read its
`AGENTS.md` before changing its internals. Keep root `copier.yml` as an include-only
entrypoint plus `_subdirectory` override. Run `python starter/repo_wrapper.py verify` for
source contracts and real-Copier CI for copy/update proof. Never label fixture rendering
as actual Copier execution or remove nested editor settings from source archives.
