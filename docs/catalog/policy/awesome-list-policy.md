# Awesome-list policy

Awesome IINA is a curated guide backed by structured data, not an automatically
published search result. This policy defines the invariants enforced by the
repository.

## Scope

The public catalog may include:

- native IINA plugins and official IINA development resources;
- companion applications and integrations with a concrete IINA workflow;
- mpv, FFmpeg, MKV, subtitle, shader, and media-server resources whose IINA
  relevance is described explicitly;
- developer tooling that materially helps build, inspect, test, package, or
  maintain IINA plugins;
- AI and agent tooling with a demonstrated IINA-specific use case.

A generic media or AI project is not eligible merely because it could be used
near IINA.

## Curation boundary

Discovery output is evidence, not catalog content. A maintainer must review an
entry before adding it to `src/awesome_iina/catalog/catalog.yaml`. Review must confirm:

1. a direct, explainable relationship to IINA;
2. a canonical project URL and a useful English description;
3. maintenance and archival state;
4. license evidence when available;
5. the correct resource type and category;
6. compatibility claims supported by a primary source;
7. no unresolved impersonation, malware, or obvious supply-chain concern.

Stars, recency, and automated relevance scores help prioritize review. They do
not determine inclusion.

## README invariants

`just lint-awesome` checks repository-specific
Awesome-list conventions:

- one `# Awesome IINA` heading;
- Awesome attribution;
- a Contents section;
- a contribution-policy link;
- the generated-section marker substring `generated from src/awesome_iina/catalog/catalog.yaml`;
- valid internal heading fragments;
- no duplicate canonical URL inside the generated catalog;
- no accidental heading-level jumps.

The generated catalog block is introduced by this HTML comment. There is no
`catalog:start` / `catalog:end` pair:

```markdown
<!-- This section is generated from src/awesome_iina/catalog/catalog.yaml. Do not edit entries directly. -->
```

> [!NOTE]
> Do not edit that generated section by hand. Edit `src/awesome_iina/catalog/catalog.yaml`, run `just generate`, and review the diff. `just lint-awesome` requires the substring `generated from src/awesome_iina/catalog/catalog.yaml`.

## Relationship to awesome.re

> [!IMPORTANT]
> `just lint-awesome` is **repository-specific**. This catalog is an awesome-inspired guide plus discovery tooling. It is **not** submitted as an [awesome.re](https://awesome.re) / [sindresorhus/awesome](https://github.com/sindresorhus/awesome) listing.

Generated README sections, MIT licensing, CI badges, and `unknown` or
historical rows in the main list are product choices, not claims of awesome.re
compliance.

## Description style

Descriptions should be concise sentence fragments that explain what the
resource does for an IINA user or developer. Avoid hype, unverifiable
superlatives, copied marketing language, and redundant phrases such as “an
awesome tool.”

## Ordering

The generator owns category and entry ordering. New hand-maintained sections
must not introduce a second competing catalog.
