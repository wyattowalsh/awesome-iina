# Coverage, not exhaustiveness

A discovery result is evidence about a declared public GitHub search space at a particular
time. It is not a count of all existing IINA plugins. See [the implemented pipeline](discovery.md).

## Read the evidence in this order

1. Confirm the effective backend, date range, configuration digest, and source snapshots.
2. Inspect every query outcome's total, unique returned count, completion flag, and reason.
3. Inspect run warnings and candidate-level manifest warnings separately from query coverage.
4. Review private-result exclusions, aliases, manual overrides, and heuristic reasons.
5. Treat missing or capped results as unknown rather than rejected or nonexistent.

> [!IMPORTANT]
> The result model enforces `exhaustive: false`. `complete: true` means all configured query outcomes report complete coverage, not that GitHub contains every IINA-related repository or that enrichment and installation checks passed.

The empty-outcome case is incomplete. GitHub search can change between pages even when a
client traverses all reported pages; no frozen-snapshot isolation is promised.

Repository searches partition date/star/size ranges. Code searches are bounded and do
not currently partition file size, so GitHub's code-index holes remain holes rather than
shardable gaps.

## GitHub search holes this collector cannot close

Configured query coverage is not a complete index of GitHub. Legacy code search in
particular is narrower than the REST 1,000-result ceiling:

- Indexed files are smaller than **384 KB**. This is not the historical Enterprise
  **10 MB** source-view figure; do not treat 10 MB as the code-search limit.
- Only the **default branch** is searchable.
- **Archived** repositories are not in the code index.
- Repositories without activity in about the **last year** may drop out of code search.
- REST code search first filters to at most **4,000 matching repositories**, then
  searches those.
- Authenticated REST code search is rate-limited at **10 requests per minute**.

Repository search still paginates toward 1,000 results per query. `incomplete_results`
can also fire on small result sets (timeout). Paginating every returned page does not
prove the index was complete.

Reference: [GitHub REST search](https://docs.github.com/en/rest/search/search),
[searching code](https://docs.github.com/en/search-github/searching-on-github/searching-code).

## Independent source evidence

The current active official-index snapshot is `src/awesome_iina/discovery/snapshots/iina-plugins.json`.
`src/awesome_iina/discovery/snapshots/iina-plugins.raw.json` and `src/awesome_iina/repo/upstream-review.json` are the **frozen raw
reference and hash record from this audit**. A later `sources sync` updates the active
snapshot without rewriting historical audit evidence. Refreshing that frozen reference
requires an explicit new provenance review. The repository checks validate each artifact
according to its own role, not by demanding that all later observations remain identical.

The official index includes an external-host project. GitHub discovery does not crawl that
host, although the manually curated catalog can link it. Official indexing is not the same
as official authorship, security approval, active maintenance, or runtime certification.

An explicit query-granular JSON checkpoint can be used for resume; it is not SQLite and
does not preserve a live per-page cursor transaction.
