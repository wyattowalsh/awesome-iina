set dotenv-load := true
set shell := ["bash", "-euo", "pipefail", "-c"]

root := justfile_directory()
config := "src/awesome_iina/discovery/discovery.yaml"
catalog := "src/awesome_iina/catalog/catalog.yaml"
root_policy := "src/awesome_iina/repo/root-policy.toml"

# Show available commands.
default:
    @just --list --unsorted

# Install dependencies; use the real lockfile when one has been resolved.
bootstrap:
    @command -v uv >/dev/null || { echo "uv is required: https://docs.astral.sh/uv/" >&2; exit 1; }
    uv python install 3.13
    if [[ -f uv.lock ]]; then uv sync --all-groups --frozen; else uv sync --all-groups; fi

# Resolve and review dependency changes before committing uv.lock.
lock:
    uv lock

# Confirm the GitHub CLI exists and is authenticated.
gh-check:
    @command -v gh >/dev/null || { echo "gh is required: https://cli.github.com/" >&2; exit 1; }
    gh auth status

# Inspect core, discovery, media, or all local prerequisites.
doctor PROFILE="core":
    uv run awesome-iina doctor --profile {{quote(PROFILE)}}

# Enforce the intentionally narrow repository root.
lint-root:
    uv run awesome-iina repository lint-root --policy {{root_policy}}

# Enforce Awesome-list structure, ordering, catalog URLs, and local links.
lint-awesome:
    uv run awesome-iina repository lint-awesome --readme README.md --catalog {{catalog}}

# Refresh authoritative upstream snapshots such as IINA's official plugin index.
sync-sources:
    uv run awesome-iina sources sync --config {{config}}

# High-recall repository and code discovery. Use MODE=quick for local iteration.
discover MODE="full": gh-check
    uv run awesome-iina discover --config {{config}} --mode {{quote(MODE)}}

# Re-score an existing discovery snapshot without querying GitHub.
classify INPUT="output/discovery/latest.json":
    uv run awesome-iina classify {{quote(INPUT)}} --config {{config}}

# Produce a human-review queue and Markdown audit report.
report INPUT="output/discovery/latest.json":
    uv run awesome-iina report {{quote(INPUT)}} --config {{config}}

# Compare two discovery snapshots by stable GitHub repository identity.
diff-snapshots OLD NEW OUT="":
    if [[ -n {{quote(OUT)}} ]]; then \
      uv run awesome-iina diff-snapshots {{quote(OLD)}} {{quote(NEW)}} --output {{quote(OUT)}}; \
    else \
      uv run awesome-iina diff-snapshots {{quote(OLD)}} {{quote(NEW)}}; \
    fi

# Validate the hand-curated catalog and all invariants.
validate:
    uv run awesome-iina catalog validate {{catalog}}

# Require parity with IINA's official plugin index.
audit-official:
    uv run awesome-iina catalog audit-official {{catalog}}

# Regenerate README.md and machine-readable schemas.
generate:
    uv run awesome-iina catalog generate {{catalog}}

# Fail if generated files differ from committed files.
generate-check:
    uv run awesome-iina catalog generate {{catalog}} --check

# Inspect an IINA plugin manifest without executing plugin code.
inspect-manifest FILE:
    uv run awesome-iina plugin inspect {{quote(FILE)}}

# Inspect an MKV or another media file with ffprobe, MediaInfo, and MKVToolNix.
inspect-media FILE:
    mkdir -p output/media-reports
    filename="$(basename -- {{quote(FILE)}})"; \
      uv run awesome-iina media inspect {{quote(FILE)}} --output "output/media-reports/${filename}.json"

# Show which media inspection tools are available locally.
media-doctor:
    uv run awesome-iina media doctor

format:
    uv run ruff format .
    uv run ruff check --fix .

format-check:
    uv run ruff format --check .

lint:
    uv run ruff check .

typecheck:
    uv run ty check src tests

test:
    uv run pytest --cov=awesome_iina --cov-report=term-missing

schema:
    uv run awesome-iina schemas --output-directory src/awesome_iina/catalog/schemas

verify:
    uv run awesome-iina repository verify

# Deterministic local assurance without GitHub API calls.
check: format-check lint typecheck test validate audit-official generate-check lint-root lint-awesome verify brand-check

# Full maintenance pass, including network-backed discovery.
refresh MODE="full":
    just sync-sources
    just discover {{quote(MODE)}}
    just report
    just validate
    just generate
    just check

# Audit external catalog links. Transient and blocked responses remain warnings by default.
links:
    uv run awesome-iina repository links {{catalog}}

clean:
    rm -rf .pytest_cache .ruff_cache .ty_cache .coverage htmlcov dist build media-reports
    find . -type d -name __pycache__ -prune -exec rm -rf {} +

# Create a deterministic full-source archive, including src/, tests/, schemas, and workflows.
archive OUT="dist/awesome-iina.zip":
    mkdir -p "$(dirname -- {{quote(OUT)}})"
    uv run awesome-iina repository archive --output {{quote(OUT)}}
    unzip -t {{quote(OUT)}}

# Describe the embedded template and its selected toolchain without installing it.
starter-info:
    uv run python starter/repo_wrapper.py describe

# Offline source/fixture contracts only. This is not a real Copier integration gate.
starter-verify:
    uv run python starter/repo_wrapper.py verify

# Copy Agent Plugins SSOT into Cursor/Claude/Codex/Copilot projection trees.
starter-sync-agent-kit:
    uv run python starter/tools/sync_agent_kit.py --apply

# Fail if projected agent-kit copies drifted from SSOT. Used by starter verify/CI.
starter-sync-agent-kit-check:
    uv run python starter/tools/sync_agent_kit.py --check

# Opt-in symlink into ~/.cursor/plugins/local. Never part of `just check` or CI.
starter-agent-plugin-install:
    #!/usr/bin/env bash
    set -euo pipefail
    dest="${HOME}/.cursor/plugins/local/iina-plugin-dev"
    mkdir -p "$(dirname -- "$dest")"
    if [[ -e "$dest" && ! -L "$dest" ]]; then
      echo "refusing to replace non-symlink $dest" >&2
      exit 1
    fi
    ln -sfn "{{root}}/starter/plugins/iina-plugin-dev" "$dest"
    echo "symlinked {{root}}/starter/plugins/iina-plugin-dev -> $dest"

# File-existence doctor for the portable kit. Does not install or evaluate clients.
starter-agent-plugin-doctor:
    test -f starter/plugins/iina-plugin-dev/plugin.json
    test -f starter/plugins/iina-plugin-dev/.cursor-plugin/plugin.json
    test -f starter/plugins/iina-plugin-dev/hooks/hooks.json
    test -f starter/tools/sync_agent_kit.py
    test -f starter/tools/agent_kit_projections.json
    test -f starter/template/.cursor/hooks.json
    test -f starter/template/scripts/agent-guard.mjs
    test ! -e starter/plugins/iina-plugin-dev/mcp.json
    test ! -d starter/template/.cursor/skills/iina-generate

# Generate outside this repository from an explicit reviewed, committed Git reference.
starter-new DEST REF PRESET="command" PREFERENCES="false" DOCS="markdown":
    uv run python starter/repo_wrapper.py new {{quote(DEST)}} --ref {{quote(REF)}} --preset {{quote(PRESET)}} --preferences {{quote(PREFERENCES)}} --docs {{quote(DOCS)}}

# Print the exact shell-free Copier argv without creating a project or installing tools.
starter-plan DEST REF PRESET="command":
    uv run python starter/repo_wrapper.py new {{quote(DEST)}} --ref {{quote(REF)}} --preset {{quote(PRESET)}} --dry-run

# Resolve the starter's own Python environment, separate from the catalog package.
starter-test:
    uv run --directory starter python -m pytest tests

# Require real Copier, including wrapper copy/update and conflicting edits. No skipped gate.
starter-upgrade-test:
    REQUIRE_COPIER=1 uv run --directory starter python -m pytest tests/test_real_copier.py

# Fixture-only generated checks; selected Node/TypeScript tools or explicit audit overrides required.
starter-fixtures PRESET="sidebar":
    uv run --directory starter python tools/audit_matrix.py --preset {{quote(PRESET)}}

# Actual Copier + explicit pnpm installation, checks, bundles and optional docs production build.
starter-integration PRESET="sidebar" PREFERENCES="true" DOCS="starlight":
    uv run --directory starter python tools/integration_matrix.py --source {{quote(root)}} --preset {{quote(PRESET)}} --preferences {{quote(PREFERENCES)}} --docs {{quote(DOCS)}}

# Export the complete independent starter source, not an installed IINA plugin package.
starter-export OUT="dist/iina-plugin-starter.zip":
    uv run python starter/tools/bundle.py --output {{quote(OUT)}}

# Verify the immutable supplied kit hashes, SVG policy, and in-memory palette.
brand-check:
    uv run awesome-iina brand sync --check

# Same kit verification as brand-check; there is no shipping mirror to repair.
brand-sync:
    uv run awesome-iina brand sync

# Build the static catalog (Vite/React chrome island, Takumi OG cards, then Python site-build).
site-ui-build:
    npm --prefix src/awesome_iina/site/ui run build

# Render derived Open Graph / social PNGs from JSX (does not rewrite kit originals).
site-og:
    npm --prefix src/awesome_iina/site/ui run og

site-build: brand-check site-ui-build
    uv run awesome-iina site build

# Serve only the built public site on loopback, never the source tree.
site-preview: site-build
    uv run python -m http.server 8000 --bind 127.0.0.1 --directory dist/site

# REST discovery with query-granular JSON checkpointing.
discover-rest MODE="quick": gh-check
    uv run awesome-iina discover --backend rest --mode {{quote(MODE)}} --checkpoint output/discovery.checkpoint.json --strict

# Resume the same effective configuration; completed queries are not repeated.
discover-resume MODE="quick": gh-check
    uv run awesome-iina discover --backend rest --mode {{quote(MODE)}} --checkpoint output/discovery.checkpoint.json --resume --strict

# Run GraphQL repository search while retaining REST code search.
discover-graphql MODE="full": gh-check
    mkdir -p output/graphql
    uv run awesome-iina discover --backend graphql --mode {{quote(MODE)}} \
      --output output/graphql/discovery.json \
      --checkpoint output/graphql/discovery.checkpoint.json --strict

# Merge independently collected REST and GraphQL runs for one review pass.
merge-discovery REST GRAPHQL OUT="output/deep/merged.json":
    mkdir -p "$(dirname -- {{quote(OUT)}})"
    uv run awesome-iina merge-discovery {{quote(REST)}} {{quote(GRAPHQL)}} \
      --output {{quote(OUT)}}

# Reproduce the nightly quick-scan shape locally without changing the catalog.
discover-nightly: gh-check
    mkdir -p output/nightly
    uv run awesome-iina sources sync --config {{config}}
    uv run awesome-iina discover --backend rest --mode quick \
      --output output/nightly/discovery.json \
      --checkpoint output/nightly/discovery.checkpoint.json --strict
    uv run awesome-iina report output/nightly/discovery.json \
      --output output/nightly/report.md \
      --review-output output/nightly/review.yaml

# Run the weekly REST/GraphQL cross-check locally and produce one merged queue.
discover-deep: gh-check
    mkdir -p output/deep
    uv run awesome-iina sources sync --config {{config}}
    uv run awesome-iina discover --backend rest --mode full \
      --output output/deep/rest.json --checkpoint output/deep/rest.checkpoint.json --strict
    uv run awesome-iina discover --backend graphql --mode full \
      --output output/deep/graphql.json --checkpoint output/deep/graphql.checkpoint.json --strict
    uv run awesome-iina merge-discovery output/deep/rest.json output/deep/graphql.json \
      --output output/deep/merged.json
    uv run awesome-iina report output/deep/merged.json \
      --output output/deep/merged-report.md \
      --review-output output/deep/merged-review.yaml
    uv run awesome-iina diff-snapshots output/deep/rest.json output/deep/graphql.json \
      --output output/deep/backend-diff.md
