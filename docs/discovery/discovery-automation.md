# Scheduled discovery automation

Awesome IINA runs two read-only GitHub Actions workflows. They gather evidence and
produce candidate queues; neither workflow edits `src/awesome_iina/catalog/catalog.yaml`, pushes commits,
opens pull requests, installs plugins, or executes code from discovered repositories.

## Schedules

| Workflow | Schedule | Purpose | Retention |
| --- | --- | --- | ---: |
| `discovery-nightly.yml` | 03:17 America/New_York every day | Fast REST-backed scan of the high-signal query subset | 30 days |
| `discovery-deep.yml` | 04:43 America/New_York every Sunday | Full REST and GraphQL scans, reconciliation, backend comparison, and one merged queue | 60 days |

The off-hour minute values reduce collision with GitHub Actions' heaviest scheduling
periods. Scheduled workflows run from the latest commit on the default branch. Public
repositories can have scheduled workflows disabled after 60 days without repository
activity, so maintainers should check the Actions page when expected runs stop appearing.

Both workflows also support `workflow_dispatch` for an explicit manual run.

## Nightly evidence flow

```text
official source refresh
        +
quick REST repository search
        +
quick REST code search
        ↓
manifest and metadata inspection
        ↓
review report + review queue
        ↓
diff repository metadata, manifests, and triage against the most recent successful snapshot
        ↓
workflow summary + immutable run artifact
```

The previous successful snapshot is restored from the GitHub Actions cache using a prefix match.
Caches are an operational convenience rather than archival storage: they can expire or be
evicted. A missing baseline therefore means “no comparison available,” not “no changes.”
Every run artifact still contains the current result, checkpoint, logs, report, and queue.
Only a run whose source refresh and discovery completed successfully is saved as the next baseline.

## Weekly deep evidence flow

```text
full REST run ─────┐
                   ├─ deterministic merge ─ review report and queue
full GraphQL run ──┘          │
                              ├─ backend diff
previous merged snapshot ─────┴─ change summary
```

Repository-search observations carry their backend provenance. Code search remains REST.
The merger deduplicates stable GitHub node/database identities, preserves repository rename
aliases, unions evidence, retains sparse metadata, and records manifest disagreements.
Candidates are scored once after merging. The review queue includes manually included overrides
and unresolved review candidates; neither state edits the curated catalog automatically.
Snapshot diffs report additions, removals, renames, objective repository metadata changes,
manifest changes, and triage/category changes. Query-count drift remains in each run's coverage
report rather than being misrepresented as a repository change.

A REST/GraphQL disagreement is review evidence, not proof that one backend is wrong. Search
indexes can change during a run, and GitHub caps individual searches. Incomplete outcomes
are preserved and make the strict workflow fail only after evidence upload.

## Failure behavior

Network-backed steps use `continue-on-error` so later report and upload steps can preserve
partial results. The final step then returns a nonzero status when source refresh,
discovery, or reconciliation was incomplete.

Hard runner termination, cancellation, or the job timeout can still prevent later steps.
The workflows use bounded request, retry, wait, and job budgets to limit that exposure.

## Permissions and trust boundary

Top-level permissions are:

```yaml
permissions:
  contents: read
```

The built-in token is used only for GitHub API reads and Actions infrastructure. Candidate
repositories are never cloned, installed, imported, built, or executed. A manifest is read
as bounded text and parsed as data.

Promotion remains a separate human process:

```text
discovery candidate
        ↓
source and permission review
        ↓
manual edit to src/awesome_iina/catalog/catalog.yaml
        ↓
normal pull-request validation
```

## Local equivalents

```bash
just discover-nightly
just discover-deep
```

`discover-nightly` uses strict mode and can return exit code 2 after saving an incomplete
result. `discover-deep` omits strict mode until both backends have produced files so the
merged report can still be inspected locally.

## References

- [GitHub Actions schedule event](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule)
- [GitHub Actions workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#onschedule)
- [GitHub REST search API](https://docs.github.com/en/rest/search/search)
