# Tests

Package tests live under `tests/` and follow `src/awesome_iina` by **domain**, not by copying the package name (a `tests/awesome_iina/` folder would shadow the installable package).

| Source | Tests |
| --- | --- |
| `catalog/` | [`catalog/`](catalog/) |
| `discovery/` | [`discovery/`](discovery/) |
| `github/` | [`github/`](github/) |
| `media/` | [`media/`](media/) |
| `site/` | [`site/`](site/) |
| `cli.py`, `repo/doctor.py`, `repo/plugin_manifest.py`, `catalog/generator.py`, `io_utils.py` | [`cli/`](cli/) |
| `repo/` (root policy, awesome lint, verify, archive, links) plus the `justfile` | [`repo/`](repo/) |

[`fixtures/`](fixtures/) holds shared JSON fixtures. [`helpers/`](helpers/) holds fakes shared across domains; those modules are not collected as tests.

`starter/tests/` and `src/awesome_iina/site/kit/tests/` belong to those nested projects. Do not import them from this tree.
