# Examples

- [`media-report.example.json`](media-report.example.json) shows the normalized media-report structure produced from ffprobe evidence.
- Discovery output is intentionally not committed as a fabricated example. Run `just discover quick` with authenticated GitHub access, then inspect `output/discovery/latest.json` and `output/discovery-latest.md`.
- The committed JSON Schemas under [`src/awesome_iina/catalog/schemas`](../../../src/awesome_iina/catalog/schemas) are the authoritative contract for generated artifacts.

Raw media-inspection payloads can contain filenames, titles, encoder tags, and other private metadata. Redact them before attaching reports to public issues.
