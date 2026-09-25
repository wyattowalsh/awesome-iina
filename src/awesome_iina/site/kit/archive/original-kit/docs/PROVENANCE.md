# Provenance and transformation boundaries

## Sources

The four source artworks were generated earlier in this conversation. They are
not official IINA artwork and were not obtained from an independent designer or
vector source. Original pixels and file bytes have been preserved.

| Bundled original | Mounted conversation source |
| --- | --- |
| `originals/awesome-iina-master-icon.png` | `neon_media_player_plugin_icon.png` |
| `originals/awesome-iina-simplified-icon.png` | `neon_media_player_icon.png` |
| `originals/awesome-iina-social-artwork.png` | `awesome_iina_neon_ecosystem_banner.png` |
| `originals/awesome-iina-readme-hero.png` | `awesome_iina_neon_plugin_hero.png` |

The additional mounted `imagegen.png` was byte-identical to the master icon, so it
was not packaged as a fifth design. Exact hashes are in `ASSET-MANIFEST.json`.

## Export operations

Icons, headers and the GitHub card were downscaled directly from their associated
original with Pillow's Lanczos resampler and saved as optimized PNG. No detail was
added, no font was substituted, no background was removed, and no image was
AI-upscaled, traced, sharpened or redrawn during packaging.

The optional 1200×630 website card is a documented padded derivative: resize to
1200×600, center vertically, add 15-pixel top/bottom bars sampled from original
pixel (0,0). It does not crop the original artwork or stretch its proportions.

The ICO contains 16, 24, 32, 48 and 64-pixel frames based on the simplified original.
The simplified source is still an illustration with multiple visual elements, so
native-size icon design should be reviewed before treating those exports as final.

## Not supplied or not established

- Real vector construction or editable typography.
- A transparent silhouette, flat monochrome mark, or light-theme logo alternative.
- Exact identification of the generated typography's font family.
- Color-managed verification: the originals contain untagged RGB values, not an
  embedded ICC profile establishing a calibrated source color space.
- Optical-size favicon redesign, platform upload confirmation, browser/device tests,
  accessibility certification, trademark clearance, or human recognition studies.
- An approved identity standard or documented third-party licensing determination.

No font files are bundled. Platform example snippets are not executed or deployed.
The kit's role is to preserve and export the artwork so it can be reviewed honestly.
