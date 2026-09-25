# Catalog share cards (Takumi)

JSX is the design file. `takumi-js` renders PNG without a browser.

```bash
npm --prefix src/awesome_iina/site/ui run og
```

`just site-ui-build` runs the same step after the Vite island build.

| Output | Size | Theme | Used as |
| --- | ---: | --- | --- |
| `static/og/open-graph-1200x630.png` | 1200×630 | dark | Catalog `og:image` / Twitter card |
| `static/og/github-social-preview-1280x640.png` | 1280×640 | dark | Derived GitHub social; kit original stays the settings candidate |
| `static/og/share-card-1200x630-light.png` | 1200×630 | light | Light share card |

Bytes are also copied to gitignored `output/og/`. Kit rasters under `kit/assets/brand/` and `kit/archive/` are not overwritten.

Tokens come from `kit/source/tokens.json` at render time (`takumi-js@2.14.0`).
Composition: Indexed Media atmosphere (dual radial glows, framed canvas, mark
plate, cyan→violet waveform motif, title with cyan clip on dark, size footer).
Kit social grammar stays (mark, title, two role lines). Does not copy Takumi
demo trade dress (no red square, no `#16130f`). Kit rasters under
`kit/assets/brand/` are never overwritten.
