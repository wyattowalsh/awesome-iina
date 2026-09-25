# Review checklist

## Identity

- [ ] Canonical owner/repository or project URL resolved.
- [ ] Fork, mirror, rename, ownership transfer, and archived status checked.
- [ ] Plugin identifier recorded exactly as declared.
- [ ] Identifier collisions searched in the catalog and discovery output.

## Direct IINA relevance

At least one strong signal is required:

- [ ] present in IINA's official plugin index;
- [ ] maintained by the `iina` organization;
- [ ] valid IINA `Info.json` manifest;
- [ ] depends on `iina-plugin-definition` or documented IINA plugin APIs;
- [ ] explicitly implements an IINA companion or handoff workflow.

## Compatibility and maintenance

- [ ] Default branch and latest release inspected.
- [ ] Current IINA compatibility has direct evidence or remains `unknown`.
- [ ] Open compatibility issues and replacement projects considered.
- [ ] License is verified rather than inferred.

## Security-relevant metadata

- [ ] Manifest permissions reviewed.
- [ ] Allowed network domains reviewed.
- [ ] Filesystem, executable, download, and shell behavior noted.
- [ ] No claim of safety or endorsement is implied.

## Catalog quality

- [ ] Neutral original description ends in punctuation.
- [ ] Category and kind match the category map.
- [ ] Status uses the curation playbook criteria.
- [ ] Install method is accurate.
- [ ] Evidence sources are direct and authoritative.
- [ ] Featured status is justified independently of stars.
- [ ] `just check` and generated-output review pass.
