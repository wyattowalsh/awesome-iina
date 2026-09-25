# Generate from a Copier source (git URL or ZIP)

Read from `iina-generate` before `copy_argv.py describe` / `plan` and before
`uvx --from copier==9.18.2 copier copy`. Audience: IINA plugin authors using the
**user-installed plugin**. Not catalog maintainers.

The author names the Copier source (git URL or ZIP), an immutable `--vcs-ref`,
and an empty destination. This skill never invents those values, never runs
`git init`, and never executes Copier itself. `copy_argv.py` only prints argv
JSON. Copier stays the user-visible `uvx` command.

## `copy_argv.py`

Path (plugin-root relative): `skills/iina-generate/scripts/copy_argv.py`.
On the user-installed plugin the same file sits next to this skill
(`skills/iina-generate/scripts/copy_argv.py`).

Subcommands: `describe`, `plan`. No `copy`, `run`, `execute`. Stdin/argv: JSON
object (inline string, file path, or stdin). Stdout: JSON. Side effects: none
(no Copier exec, no mkdir, no git, no network).

From this skill directory:

```sh
uv run python scripts/copy_argv.py describe '{"source":"git","url":"gh:<owner>/<repo>","vcs_ref":"<tag-or-sha>","destination":"<destination>"}'
uv run python scripts/copy_argv.py plan '{"source":"git","url":"gh:<owner>/<repo>","vcs_ref":"<tag-or-sha>","destination":"<destination>"}'
```

`ok=false` → stop. Quote `error`. Do not invent argv. Do not run Copier.
`ok=true` → run the returned `argv` as-is (or the `plan` `human` line). Do not
add flags.

Pin Copier **9.18.2**. Custom delimiters `[[ ]]` / `[% %]` stay. This Copier
source has `_subdirectory: template` only (no template tasks/migrations).

Destination must be a **new empty directory** (absent or empty), not an
existing plugin tree, and not inside the Copier source.

## `describe` input schema

```json
{
  "$id": "iina-plugin-dev/copy_argv.describe.input",
  "type": "object",
  "additionalProperties": false,
  "required": ["source", "vcs_ref", "destination"],
  "properties": {
    "source": {"enum": ["git", "zip", "path"]},
    "url": {"type": "string"},
    "path": {"type": "string"},
    "vcs_ref": {"type": "string", "minLength": 1},
    "destination": {"type": "string", "minLength": 1},
    "data_file": {"type": "string"},
    "pretend": {"type": "boolean"}
  }
}
```

## `describe` output schema

```json
{
  "$id": "iina-plugin-dev/copy_argv.describe.output",
  "type": "object",
  "additionalProperties": false,
  "required": ["ok", "layout", "copier", "argv", "notes"],
  "properties": {
    "ok": {"type": "boolean"},
    "layout": {
      "anyOf": [
        {"enum": ["plugin-root", "nested-template"]},
        {"type": "null"}
      ]
    },
    "copier": {"const": "9.18.2"},
    "argv": {
      "anyOf": [
        {"type": "array", "items": {"type": "string"}},
        {"type": "null"}
      ]
    },
    "error": {"type": "string"},
    "notes": {"type": "array", "items": {"type": "string"}}
  }
}
```

`plan` is `describe` plus a `human` string: the exact shell line to show. Still
no exec.

```json
{
  "$id": "iina-plugin-dev/copy_argv.plan.output",
  "allOf": [
    {"$ref": "iina-plugin-dev/copy_argv.describe.output"},
    {
      "type": "object",
      "required": ["human"],
      "properties": {
        "human": {"type": "string"}
      }
    }
  ]
}
```

## Argv rules

Do not invent flags. Use only what `copy_argv.py` returned.

- Layout detection (read-only): if `<src>/copier.yml` exists and `_subdirectory`
  is `template`, `layout=plugin-root`. If `<src>/template/copier.yml` or the
  tree **is** the template dir (has `Info.json.jinja`), `layout=nested-template`.
  Else `ok=false`. Git URL with no local `path` assumes `plugin-root`.
- Always include `--vcs-ref <ref>`.
- Include `--prereleases` iff `vcs_ref` looks pre-release (`a`, `b`, `rc`,
  `alpha`, `beta` as PEP 440 fragments). `0.2.0a2` → include. If argv omits it,
  do not add it. If argv includes it, do not drop it.
- Include `--data-file <path>` iff the author provided `data_file`. Authors
  usually omit it and answer the questionnaire (preset: `command`, `sidebar`,
  `overlay`, `controller`; Copier `hooks:` is Lefthook, not an agent hook).
- Include `--pretend` iff `pretend=true`.
- **Never** emit `--trust`, `--UNSAFE`, `--overwrite`, or `git init`. Do not
  pass those flags on the Copier line. Copier’s overwrite flag **enables**
  overwrite; do not pass it.
- ZIP/path source: if `path` has no `.git`, `ok=false` with error
  `initialize git and tag the source before Copier copy`.
- Git source: if `url` missing, `ok=false`. Accept `gh:owner/repo` or
  `https://github.com/owner/repo.git`; normalize to Copier’s documented form
  (`gh:owner/repo`).

## Worked examples

### Git prerelease (include `--prereleases`)

`describe` output:

```json
{
  "ok": true,
  "layout": "plugin-root",
  "copier": "9.18.2",
  "argv": [
    "uvx",
    "--from",
    "copier==9.18.2",
    "copier",
    "copy",
    "--vcs-ref",
    "0.2.0a2",
    "--prereleases",
    "gh:owner/repo",
    "../my-iina-plugin"
  ],
  "notes": []
}
```

Run that argv. Equivalent happy-path git line (do not add extra flags):

```sh
uvx --from copier==9.18.2 copier copy --vcs-ref "<tag-or-sha>" --prereleases "gh:<owner>/<repo>" "<destination>"
```

Stable tags omit `--prereleases` when argv omits it.

### ZIP / path without `.git` (fail closed)

The author unzipped a release ZIP. `git init` + tag must **already** be done on
that Copier source (starter README). Generate does not also `git init`.

```json
{
  "ok": false,
  "layout": null,
  "copier": "9.18.2",
  "argv": null,
  "error": "initialize git and tag the source before Copier copy",
  "notes": []
}
```

**Refuse**. Quote `error`. Do not run `git init`. Do not run Copier.

### ZIP / path with `.git` (still `--vcs-ref`)

After the author unzipped, `git init` + tagged the Copier source, `describe`
with `source` `zip` or `path` and that local `path`. Successful argv still has
`--vcs-ref`. Copier `copy` uses the local path as the source, not a git URL.

```sh
uv run python scripts/copy_argv.py describe '{"source":"zip","path":"<unzipped-copier-source>","vcs_ref":"<tag-or-sha>","destination":"<destination>"}'
```

Then run the returned argv as-is. Include `--prereleases` only when argv says
so.

## After copy

Development, package, and upgrade live in the **generated IINA plugin repo**.
Do **not** embed the Agent Plugins kit in that repo. Do not copy
`plugins/iina-plugin-dev/` or `iina-generate` into the destination. Workspace
skills there are `iina-development`, `iina-package`, and `iina-upgrade` only.

Do not pack as a side effect of generate (`iina-package` later; never
`pnpm pack`). Do not restart IINA. JavaScriptCore APIs are not invented here.
