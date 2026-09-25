# ADR 0003: Report discovery coverage instead of claiming exhaustiveness

- **Status:** Accepted
- **Date:** 2026-09-13

## Context

GitHub search is indexed, capped, rate-limited, and query-dependent. Private,
unindexed, deleted, inaccessible, or semantically unrelated repositories cannot
be ruled out by a successful crawl.

## Decision

Use multiple evidence surfaces and adaptive query partitioning, but report
coverage gaps explicitly. The collector must not emit `exhaustive: true`.
“Complete” refers only to the scheduled task graph for a recorded configuration.

## Consequences

Results are scientifically more defensible, though the repository cannot market
its inventory as a mathematically exhaustive census.
