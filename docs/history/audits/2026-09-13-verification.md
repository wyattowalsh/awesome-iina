# Awesome IINA v5 verification

- **Date:** 2026-09-13
- **Repository source gate:** PASS for all locally executable mandatory checks
- **Tests:** 107 passed
- **Combined statement and branch coverage:** 87.28%
- **Catalog:** 73 reviewed projects
- **Full-source archive:** 129 files, including 22 source modules, 23 test modules,
  and 5 workflows
- **Official index audit:** complete for the committed IINA plugin-index snapshot
- **Archive policy:** full-source members and clean-extraction checks required

## Checks completed locally

| Check | Result |
|---|---:|
| Python compilation | PASS |
| Pytest suite | PASS, 107 tests |
| Coverage threshold | PASS, 87.28% against 85% minimum |
| Root policy | PASS |
| Awesome-list policy | PASS |
| Catalog model and policy | PASS |
| Official plugin-index parity | PASS |
| Generated-output drift | PASS |
| Source-snapshot hashes | PASS |
| JSON Schema validation | PASS |
| Workflow action pins | PASS |
| Local Markdown links | PASS |
| Text hygiene | PASS |
| ZIP CRC and required source members | PASS during release packaging |
| Fresh-extraction test suite | PASS during release packaging |
| Real MKV read-only smoke test | PASS with ffprobe; input SHA-256 unchanged |

## Environment-bound checks

Ruff, ty, Hatchling distribution builds, authenticated live GitHub discovery, hosted
GitHub Actions, and native IINA runtime behavior were not executed in this network-isolated
Linux environment. They remain configured in CI and should run after the repository has a
reviewed lockfile and network access.

No `uv.lock` is included merely to make a gate appear green. The first networked
maintenance pass should run `uv lock`, review the resolution, commit the lockfile, and then
switch release installs to `uv sync --all-groups --frozen`.
