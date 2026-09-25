# Platform references

Checked during packaging on 2026-09-12. Recheck current documentation before release.

## GitHub repository social previews

https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview

GitHub documents PNG/JPG/GIF under 1 MB, recommends 1280×640 for best display, and
provides a Settings → Social preview upload control. A solid background is recommended
when transparency behavior is uncertain. The packaged GitHub export is opaque PNG,
1280×640, and 794,030 bytes. Technical acceptance has been checked locally; a GitHub
upload and rendered share-card test were not performed.

## Favicons and HTML link metadata

https://developer.mozilla.org/en-US/docs/Glossary/Favicon
https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/link

MDN describes small browser icons and the `rel`, `sizes`, and `type` metadata used
to associate icon resources with a page. Actual rendering varies by browser/context;
multiple PNG/ICO sizes do not prove native-size visual recognition.

## Web manifest icon resources

https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/icons

The example manifest declares separate sizes and `purpose: any`. No `maskable`
asset is supplied or implied. Its presence alone does not establish installability.

## Scope

These references support technical export choices, not claims that the existing
visual concept is distinctive, accessible, legally cleared or artistically final.
The 1200×630 padded derivative is a supplied layout option, not represented here
as a universal Open Graph requirement.
