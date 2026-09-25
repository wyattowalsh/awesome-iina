# Font dependencies

New typography: **Inter Display Bold** and **Inter Display Medium**, from Inter
4.001 (`git-9221beed3`) in the build environment. Exact local file hashes are recorded
in `provenance/font-inventory.json`; those names identify dependencies, not included files.

Official source: https://rsms.me/inter/  
License: https://raw.githubusercontent.com/rsms/inter/master/LICENSE.txt

The official project identifies Inter as free/open-source under SIL Open Font License
1.1; consult those current terms for usage conditions. This document does not relicense
or redistribute the font. No TTF, OTF, WOFF, WOFF2, or font binaries are packaged.

Editable layout SVGs require a corresponding local installation to render typography
exactly. Production wordmark/card SVGs outline the letters, avoiding runtime fallback.
Outline conversion does not make text editable as text; the live-text counterparts
and layout JSON are included for that reason. The earlier image's font remains unknown.
