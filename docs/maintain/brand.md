# Identity integration

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../../src/awesome_iina/site/kit/assets/brand/wordmark-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="../../src/awesome_iina/site/kit/assets/brand/wordmark-light.svg">
  <img alt="Awesome IINA" src="../../src/awesome_iina/site/kit/assets/brand/wordmark-light.svg" width="440" height="71">
</picture>

The user-supplied **2.1.1 Indexed Media kit** is the identity source, not an invitation
to redesign the project. Its original 245 files live under `src/awesome_iina/site/kit/`, with
unchanged internal manifests, editing sources, historical assets, tests, and evidence.
Historical kit evidence is not a fresh validation result for this integration.

## Where the identity appears

| Surface | Implementation |
| --- | --- |
| Repository README | Theme-aware outlined wordmark, live semantic heading, independence statement |
| Documentation index | Theme-aware wordmark linking readers to catalog and developer guides |
| Browser catalog | Light/dark wordmarks and symbols, token-derived palette, real HTML controls |
| Browser chrome | SVG/ICO favicon, Apple touch icon, application icons and manifest |
| Social sharing | Takumi-derived 1200 × 630 Open Graph image at `assets/og/open-graph-1200x630.png` (kit original remains in the kit) |
| GitHub repository preview | Kit 1280 × 640 PNG remains the settings candidate; a Takumi-derived twin is generated beside it |

`awesome-iina brand sync --check` verifies the supplied kit's manifest, primary asset
hashes, SVG reference safety, and the in-memory token stylesheet. It does not write a
second working-tree copy. `site build` emits `dist/site/assets/brand/` including generated
CSS. The command does not execute kit scripts, remove unknown files, install fonts, or
fetch external assets. The social SVG's embedded PNG is permitted after strict
Base64/signature validation; external SVG references are not.

The historical README hero remains in the kit but is excluded from primary deployment.
The kit's own status and rights notes remain intact. The intended site configuration is
not evidence of a public deployment, owner signoff beyond this integration request, or
platform-level testing.

## Scope and rights

Awesome IINA is an independent community catalog, **not affiliated with the IINA project**.
The repository's MIT code license does not provide a blanket reuse license for artwork
or trademarks. Consult the supplied [asset-use notes](../../src/awesome_iina/site/kit/docs/ASSET-USE.md)
before reusing the identity elsewhere. No font files are distributed. Outlined wordmarks
retain the exact supplied appearance; browser body text uses local system fonts.

> [!NOTE]
> Generated consumer plugins do not inherit catalog logos, colors, social cards, or app identity. They use their own name, identifier, and UI so unrelated plugins cannot appear official or endorsed by the catalog.

## Publication

Build the site with `just site-build`; serve `dist/site/` with `just site-preview`.
Upload only that public tree to the intended GitHub Pages project path after review.
For GitHub's repository preview, choose `src/awesome_iina/site/kit/assets/brand/github-social-preview-1280x640.png`
in the repository settings. No settings have been changed automatically.

Reference: [GitHub social-preview documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview).
