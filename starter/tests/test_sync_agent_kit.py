from __future__ import annotations

from tools.fixture_render import ROOT
from tools.sync_agent_kit import REPO, expected_files, load_config

PLUGIN = ROOT / "plugins/iina-plugin-dev"
NESTED_GENERATE = "starter/.cursor/skills/iina-generate"
TEMPLATE_GENERATE = "starter/template/.cursor/skills/iina-generate"
GENERATE_SCRIPTS = (
    "scripts/copy_argv.py",
    "references/generate.md",
    "SKILL.md",
)


def projected_relatives() -> set[str]:
    return {path.relative_to(REPO).as_posix() for path in expected_files(load_config())}


def nested_generate_from() -> str:
    for projection in load_config()["projections"]:
        if projection["id"] == "nested-cursor-generate":
            return str(projection["from"])
    raise AssertionError("nested-cursor-generate projection missing")


def test_nested_generate_projection_copies_generate_scripts():
    assert nested_generate_from() == "skills/iina-generate"
    relatives = projected_relatives()
    for name in GENERATE_SCRIPTS:
        nested = f"{NESTED_GENERATE}/{name}"
        template = f"{TEMPLATE_GENERATE}/{name}"
        assert nested in relatives
        assert template not in relatives
        assert (PLUGIN / "skills/iina-generate" / name).is_file()


def test_projected_paths_exclude_evals():
    relatives = projected_relatives()
    assert not any("/evals/" in path for path in relatives)


def test_template_projections_exclude_iina_generate():
    relatives = projected_relatives()
    assert not any(path.startswith(f"{TEMPLATE_GENERATE}/") for path in relatives)
    assert not any(
        path.startswith("starter/template/.claude/skills/iina-generate/") for path in relatives
    )
    assert not any(
        path.startswith("starter/template/.agents/skills/iina-generate/") for path in relatives
    )


def test_nested_cursor_skills_list_includes_generate():
    nested = ROOT / ".cursor/skills"
    names = {path.name for path in nested.iterdir() if path.is_dir()}
    assert "iina-generate" in names
    assert (nested / "iina-generate/SKILL.md").is_file()
    assert not (ROOT / "template/.cursor/skills/iina-generate").exists()
