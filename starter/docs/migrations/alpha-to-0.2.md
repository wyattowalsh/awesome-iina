# Adopting the 0.2 expansion from the earlier source alpha

This transition has not been exercised with real Copier here. Treat it as an explicit
alpha migration, not a certified in-place upgrade. Seed-only exclusions intentionally
prevent new application/docs seed files from appearing automatically during updates.

Generate a sibling from a real tagged 0.2 source using the same stable plugin identity
and preset. Review the differences. Keep application code, identifiers, versions and user
state untouched. Add missing docs/content, docs.config.json, native-evidence.json and new
project metadata through an explicit reviewed commit, then apply the infrastructure update
on a clean template-update branch. Review package/workflow conflicts and resolve locks.

Never manufacture an answers file or overwrite the entire old plugin. A failing migration
is a release blocker, not a reason to use Copier force/recopy over consumer changes.
