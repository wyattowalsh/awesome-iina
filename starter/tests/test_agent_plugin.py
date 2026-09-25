from __future__ import annotations

import json
import re
from pathlib import Path

import pytest
import yaml

from tools.fixture_render import ROOT, render
from tools.sync_agent_kit import (
    REPO,
    SyncError,
    check,
    expected_files,
    is_bytecode,
    load_config,
    resolve_inside,
)

PLUGIN = ROOT / "plugins/iina-plugin-dev"
CLOSED_FIELDS = {
    "$schema",
    "name",
    "version",
    "description",
    "author",
    "homepage",
    "repository",
    "license",
    "keywords",
    "extensions",
}
CANONICAL_SCHEMA = "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json"
COPY_ARGV_RELATIVE = "skills/iina-generate/scripts/copy_argv.py"
ANSWERS_LINEAGE_RELATIVE = "skills/iina-upgrade/scripts/answers_lineage.py"
FENCED_COMMAND = re.compile(r"```(?:sh|bash|shell|zsh)\n(.*?)```", re.DOTALL)
AGENT_HOOK_KEYS = (
    "agent_hooks",
    "cursor_hooks",
    "preToolUse",
    "afterFileEdit",
    "beforeFileEdit",
)
NATIVE_AGENT_LEAKS = (
    "AGENTS.md",
    ".cursor",
    ".claude",
    ".agents",
    "plugin.json",
    "skills/",
    "scripts/agent-guard.mjs",
)
CHECK_RECIPE = re.compile(r"^check: (.+)$", re.MULTILINE)


def inventory_paths() -> list[str]:
    text = (PLUGIN / "INVENTORY.md").read_text()
    block = text.split("## Expected plugin paths", 1)[1].split("```", 2)[1]
    return [line.strip() for line in block.splitlines() if line.strip()]


def plugin_files() -> set[str]:
    return {
        path.relative_to(PLUGIN).as_posix()
        for path in PLUGIN.rglob("*")
        if path.is_file() and path.name != ".DS_Store" and not is_bytecode(path)
    }


def fenced_commands(text: str) -> str:
    return "\n".join(match.group(1) for match in FENCED_COMMAND.finditer(text))


def skill_dirs(root: Path) -> set[str]:
    if not root.is_dir():
        return set()
    return {path.name for path in root.iterdir() if path.is_dir()}


def expected_files_js_body() -> str:
    source = (ROOT / "template/scripts/validate.mjs").read_text()
    match = re.search(
        r"export function expectedFiles\(project\) \{(.+?)return files\.sort",
        source,
        re.DOTALL,
    )
    assert match is not None
    return match.group(1)


def test_closed_agent_plugins_manifest():
    manifest = json.loads((PLUGIN / "plugin.json").read_text())
    assert manifest["$schema"] == CANONICAL_SCHEMA
    assert manifest["name"] == "iina-plugin-dev"
    extra = set(manifest) - CLOSED_FIELDS
    assert extra == set()
    assert "mcpServers" not in manifest
    assert "skills" not in manifest
    assert "hooks" not in manifest
    assert "agents" not in manifest
    assert not (PLUGIN / "mcp.json").exists()


def test_inventory_matches_plugin_tree():
    expected = set(inventory_paths())
    found = plugin_files()
    assert expected == found
    assert COPY_ARGV_RELATIVE in expected
    assert ANSWERS_LINEAGE_RELATIVE in expected
    assert COPY_ARGV_RELATIVE in found
    assert ANSWERS_LINEAGE_RELATIVE in found


def test_walkers_skip_bytecode():
    assert is_bytecode(Path("__pycache__/copy_argv.cpython-313.pyc"))
    assert is_bytecode(Path("scripts/copy_argv.pyc"))
    assert is_bytecode(Path("scripts/copy_argv.pyo"))
    assert not is_bytecode(Path(COPY_ARGV_RELATIVE))
    found = plugin_files()
    assert not any("__pycache__" in path.split("/") for path in found)
    assert not any(path.endswith((".pyc", ".pyo")) for path in found)
    projected = {path.relative_to(REPO).as_posix() for path in expected_files(load_config())}
    assert not any("__pycache__" in path.split("/") for path in projected)
    assert not any(path.endswith((".pyc", ".pyo")) for path in projected)


def test_skill_frontmatter_name_matches_directory():
    for skill_dir in sorted((PLUGIN / "skills").iterdir()):
        if not skill_dir.is_dir():
            continue
        payload = yaml.safe_load(skill_dir.joinpath("SKILL.md").read_text().split("---", 2)[1])
        assert payload["name"] == skill_dir.name
        assert "disable-model-invocation" not in payload
        assert "allow_implicit_invocation" not in payload


def test_agent_kit_files_are_not_jinja_paths():
    for path in PLUGIN.rglob("*"):
        assert ".jinja" not in path.name
        for part in path.relative_to(PLUGIN).parts:
            assert "[%" not in part and "[[" not in part


def test_cursor_plugin_lists_relative_components():
    manifest = json.loads((PLUGIN / ".cursor-plugin/plugin.json").read_text())
    for key in ("skills", "rules", "agents", "hooks"):
        value = manifest[key]
        assert isinstance(value, str) and value.startswith("./")
        target = (PLUGIN / value).resolve()
        assert target.is_relative_to(PLUGIN.resolve())
        assert target.exists()


def test_copilot_files_stay_in_namespace():
    copilot = PLUGIN / "com.github.copilot"
    assert (copilot / "hooks.json").is_file()
    assert not (copilot / "plugin.json").exists()
    manifest = json.loads((PLUGIN / "plugin.json").read_text())
    assert "mcpServers" not in manifest
    assert "com.github.copilot" not in manifest


def test_nested_starter_has_generate_template_does_not():
    nested = ROOT / ".cursor/skills"
    assert nested.is_dir()
    assert "iina-generate" in skill_dirs(nested)
    assert (nested / "iina-generate/SKILL.md").is_file()
    template_skills = ROOT / "template/.cursor/skills"
    assert "iina-generate" not in skill_dirs(template_skills)
    assert not (template_skills / "iina-generate").exists()
    assert (template_skills / "iina-development/SKILL.md").is_file()


def test_sync_check_is_clean():
    result = check(load_config())
    assert result["status"] == "passed"


def test_sync_refuses_parent_escape():
    with pytest.raises(SyncError, match="escapes"):
        resolve_inside(REPO, "../outside", label="to")


def test_catalog_root_is_maintainer_only():
    """Catalog-root skills/ stays maintainer-only; portable kit is nested."""
    assert not (REPO / "skills/iina-plugin-starter").exists()
    assert skill_dirs(REPO / "skills") == {"awesome-iina-maintainer"}
    for name in ("iina-development", "iina-generate", "iina-package", "iina-upgrade"):
        assert not (REPO / "skills" / name).exists()
        assert (PLUGIN / "skills" / name / "SKILL.md").is_file()
    nested = REPO / "starter/.cursor/skills"
    assert "iina-generate" in skill_dirs(nested)
    assert "iina-development" in skill_dirs(nested)


def test_generate_skill_forbids_starter_generate_and_trust():
    skill = (PLUGIN / "skills/iina-generate/SKILL.md").read_text()
    refs = (PLUGIN / "skills/iina-generate/references/generate.md").read_text()
    commands = fenced_commands(skill) + "\n" + fenced_commands(refs)
    assert "copy_argv.py" in skill
    assert "uvx --from copier==9.18.2 copier copy" in skill
    assert "just starter-generate" not in commands
    assert "--trust" not in commands.split()
    assert "| `--trust` | **Refuse** |" in skill
    assert "Refuse `--trust`" in skill
    for source in (skill, refs):
        for match in re.finditer(r"just starter-generate", source):
            window = source[max(0, match.start() - 96) : match.end() + 96].lower()
            assert any(token in window for token in ("not", "never", "refuse", "do not"))


def test_generated_projection_has_no_iina_generate(tmp_path):
    dest = tmp_path / "consumer"
    render(dest)
    assert not (dest / ".cursor/skills/iina-generate").exists()
    assert not (dest / ".claude/skills/iina-generate").exists()
    assert not (dest / ".agents/skills/iina-generate").exists()
    assert not (dest / "plugins/iina-plugin-dev").exists()
    assert "iina-generate" not in skill_dirs(dest / ".cursor/skills")


def test_copier_yml_has_no_agent_hook_key():
    config = yaml.safe_load((ROOT / "copier.yml").read_text())
    for key in AGENT_HOOK_KEYS:
        assert key not in config
    hooks = config["hooks"]
    assert hooks["type"] == "bool"
    assert "Lefthook" in hooks["help"]
    assert "agent hook" not in hooks["help"].lower()


def test_plugin_kit_has_no_eval_validation_json():
    assert "VALIDATION.json" not in inventory_paths()
    assert "VALIDATION.json" not in plugin_files()
    assert not (PLUGIN / "VALIDATION.json").exists()


def test_native_allowlist_rejects_agent_files():
    source = (ROOT / "template/scripts/validate.mjs").read_text()
    body = expected_files_js_body()
    for leak in NATIVE_AGENT_LEAKS:
        assert leak not in body
    assert "Staged files differ from allowlist" in source
    stage = (ROOT / "template/tests/contracts/stage.test.mjs").read_text()
    assert "AGENTS.md" in stage
    assert ".cursor/hooks.json" in stage
    assert "scripts/agent-guard.mjs" in stage
    assert "allowlist" in stage


def test_just_check_omits_agent_plugin_install():
    text = (REPO / "justfile").read_text()
    match = CHECK_RECIPE.search(text)
    assert match is not None
    assert "starter-agent-plugin-install" not in match.group(1)
    assert "Never part of `just check`" in text
