# GitHub plugin discovery

The collector finds public repository candidates, not installed plugins. It reads GitHub
metadata and manifest text without cloning, installing, importing, or executing candidate
code. Configuration is in [`src/awesome_iina/discovery/discovery.yaml`](../../src/awesome_iina/discovery/discovery.yaml).

## Local workflow

```bash
gh auth login --hostname github.com
uv run awesome-iina discover --help
just discover-rest quick
just discover-resume quick
just discover-nightly
just discover-deep
```

The first two low-level recipes write a query-granular checkpoint under `output/` and use
`--strict`. A nonzero exit code can therefore accompany a useful saved discovery result.
The higher-level nightly and deep recipes mirror the scheduled workflows and keep their
reports, review queues, checkpoints, and backend comparisons in separate output folders.
Read the JSON, warnings, and report before retrying. Set `github.created_to` explicitly
before a multi-day run: an omitted upper date is pinned to the current UTC invocation date,
and a resume requires the same effective date range, configuration, mode, and source bytes.

Use `--backend graphql` for GraphQL repository search and enrichment. REST is the default
in the supplied configuration; code search always uses REST. The GitHub CLI manages
credentials locally. Scheduled jobs receive a token only in the steps that need network
access. No credentials are stored in catalog data or generated projects.

## Implemented search surfaces

| Surface | Implementation and boundary |
| --- | --- |
| Repository search | Name, description, README, topic, and `org:iina` queries; REST or GraphQL pagination |
| Repository partitions | Recursive creation-date ranges, then bounded star ranges and repository sizes |
| Code search | Narrow manifest, package, and API signatures; reported caps remain gaps, not hidden truncation |
| Official plugin index | Saved upstream JSON contributes direct GitHub repository candidates; external hosts remain catalog references |
| Metadata enrichment | REST repository metadata or batched GraphQL fields, merged by stable identity |
| Manifest text | Code-search manifest paths first, then known root/build/source paths; bounded, hash-checked content reads |

An organization-qualified **search** is not a separate organization-list enumeration API.
There is no generic README-link crawl, fork-network traversal, SQLite state store, or
code-search file-size sharding in this implementation. Those features were overstated in
older descriptions and are not prerequisites for using this bounded collector.

## Correctness and failure handling

Repository shards compare the reported count with unique public identities returned.
Repeated cursors, repeated pages, count drift, partial failures, empty progress and
`incomplete_results` produce explicit incomplete outcomes. Unsplittable capped shards keep
available evidence. Code hits are deduplicated by repository and path.

A partial metadata response does not clear previously observed values. Explicit nulls can
clear nullable fields; repository renames retain stable IDs and former names. Results
marked private are excluded from public snapshots, including on enrichment and resume.
A token can still lack permission to see some repositories: absence is not proof of deletion.

Requests have a subprocess timeout, retry limit, request budget, pacing, and cumulative
wait budget. Rate-limit handling is bounded; it is not a full HTTP-header cache or a promise
to honor every provider retry hint. Invalid content and individual manifest-fetch failures
remain visible. Local OS termination can interrupt a query before its next checkpoint.

## Checkpoints and strict mode

A checkpoint is schema-versioned JSON, written atomically after each configured query.
Completed queries are not repeated on a matching resume. Incomplete queries restart;
already collected candidates are retained and deduplicated. This is not page-level resume,
a frozen GitHub snapshot, or a cross-machine database.

`complete` applies only to configured repository/code **query coverage**. It does not
certify enrichment, every manifest, external hosts, runtime compatibility, or the entire
IINA ecosystem. Zero query outcomes are not a successful complete scan. Every run keeps
`exhaustive: false`. `--strict` writes the result and queue before exiting 2 for incomplete
query coverage; schema or configuration errors may fail earlier.

## Curation and outputs

Heuristic scores sort unresolved candidates. Only explicit human overrides can mark a
candidate manually included; both states remain outside the curated catalog until a human
edits `src/awesome_iina/catalog/catalog.yaml`. Neither scores nor a minimally parseable manifest establish safety or installation
compatibility. The deeper local `plugin inspect` command has separate checks, and neither
inspector executes IINA.

Defaults are `output/discovery/latest.json`, `output/discovery/review.yaml`, and
`output/discovery-latest.md`. `src/awesome_iina/catalog/catalog.yaml` remains manually curated. The nightly
workflow performs a quick REST scan; the weekly deep workflow runs REST and GraphQL, merges
the evidence, and compares both backends. Each restores the most recent successful snapshot available from the Actions cache, writes
explicit diffs when available, and uploads immutable run evidence.
Neither workflow edits the reviewed catalog or opens a pull request. See
[`discovery-automation.md`](discovery-automation.md).

## References

Reviewed 2026-09-16: [GitHub search API](https://docs.github.com/en/rest/search/search),
[API versions](https://docs.github.com/en/rest/about-the-rest-api/api-versions), and
[IINA plugin API](https://docs.iina.io/index.html). GitHub limits one search to 1,000
results and reports query timeouts using `incomplete_results`; code indexing has additional
branch and file-size limits. Narrow queries and inspect gaps rather than promising a census.
