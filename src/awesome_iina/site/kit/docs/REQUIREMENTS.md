# Requirements and review targets

External requirements were checked on 2026-09-16 against official sources. These are
separate from design proposals and local acceptance conditions.

| Class | Requirement / target | Implementation |
| --- | --- | --- |
| User/context | Independent community catalog, not official IINA or a player app | Live README copy, social descriptor and site metadata |
| User/context | Standalone symbol without lettering | Geometry-only marks; names only in separate wordmarks/cards |
| GitHub guidance | PNG/JPG/GIF under 1 MB; 1280×640 recommended for best display | Current PNG uses 1280×640; measured file size in validation |
| OG basic properties | title, type, image, canonical URL | All four supplied for intended deployment |
| Web manifest semantics | Relative icon URLs and truthful purpose/sizes | Exact-size local files; purpose any; no maskable claim |
| Designer target | Icon inspection at 16/24/32 CSS px plus density comparisons | Native proof views and independently constructed optical drawings |
| Designer target | Read name and short role in a 320×160 card | New 48-source-pixel descriptor; renderer proof, no user-study claim |
| Designer target | Name, scope and independence remain with images disabled | Live-text demo and README prefix |
| Designer target | A single primary identity per placement | New mark shared by social/card/favicon; legacy hero remains secondary |

The 320×160 and 390px test contexts are reviewer-selected stress conditions, not
universal GitHub requirements or a claimed user-approved numeric threshold. The owner
can adopt or change them. Measured text contrast uses known intended colors on the
known flat background; it is not a whole-site WCAG certification.

## Sources

- GitHub social preview: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview
- Open Graph protocol: https://ogp.me/
- MDN manifest icons: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/icons
- Inter and its license: https://rsms.me/inter/ and https://raw.githubusercontent.com/rsms/inter/master/LICENSE.txt
