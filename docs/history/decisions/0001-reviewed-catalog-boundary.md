# ADR 0001: Keep discovered candidates separate from reviewed catalog entries

- **Status:** Accepted
- **Date:** 2026-09-13

## Context

GitHub search produces false positives, stale forks, mirrors, proof-of-concept
repositories, and projects with an incidental mention of IINA. Automatically
publishing search output would make the list larger but less trustworthy.

## Decision

Discovery writes observations, repositories, evidence, coverage gaps, and an
unreviewed candidate queue. Only a maintainer edit to `src/awesome_iina/catalog/catalog.yaml` can
promote an item into the public catalog. Generated documentation consumes the
reviewed catalog only.

## Consequences

The list is not instantly synchronized with every search result. In exchange,
each public recommendation has a reviewable source record and a human-owned
classification decision.
