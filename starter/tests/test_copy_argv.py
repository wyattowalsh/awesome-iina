from __future__ import annotations

import importlib.util
import json
from pathlib import Path
from typing import Any

import pytest

SCRIPT = (
    Path(__file__).resolve().parents[1]
    / "plugins/iina-plugin-dev/skills/iina-generate/scripts/copy_argv.py"
)
FORBIDDEN_FLAGS = ("--trust", "--UNSAFE", "--overwrite")
GIT_ERROR = "initialize git and tag the source before Copier copy"


def load_copy_argv():
    spec = importlib.util.spec_from_file_location("copy_argv", SCRIPT)
    assert spec is not None and spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


copy_argv = load_copy_argv()


def git_payload(**overrides: Any) -> dict[str, Any]:
    body: dict[str, Any] = {
        "source":      "git",
        "url":         "gh:owner/repo",
        "vcs_ref":     "0.2.0a2",
        "destination": "../my-iina-plugin",
    }
    body.update(overrides)
    return body


def assert_no_forbidden(argv: list[str] | None) -> None:
    assert argv is not None
    joined = " ".join(argv)
    for flag in FORBIDDEN_FLAGS:
        assert flag not in argv
        assert flag not in joined
    for index, token in enumerate(argv[:-1]):
        assert not (token == "git" and argv[index + 1] == "init")


def write_plugin_root(root: Path) -> Path:
    root.mkdir()
    (root / ".git").mkdir()
    (root / "copier.yml").write_text("_subdirectory: template\n", encoding="utf-8")
    (root / "template").mkdir()
    (root / "template" / "Info.json.jinja").write_text("{}\n", encoding="utf-8")
    return root


def write_nested_template_config(root: Path) -> Path:
    root.mkdir()
    (root / ".git").mkdir()
    (root / "template").mkdir()
    (root / "template" / "copier.yml").write_text("plugin_name:\n  type: str\n", encoding="utf-8")
    return root


def write_nested_info_jinja(root: Path) -> Path:
    root.mkdir()
    (root / ".git").mkdir()
    (root / "Info.json.jinja").write_text("{}\n", encoding="utf-8")
    return root


def test_git_gh_tag_prerelease_matches_inventory_example():
    result = copy_argv.describe(git_payload())
    assert result == {
        "ok":     True,
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
            "../my-iina-plugin",
        ],
        "notes": [],
    }
    assert_no_forbidden(result["argv"])
    assert "--vcs-ref" in result["argv"]


@pytest.mark.parametrize(
    "vcs_ref,expect_prereleases",
    [
        ("0.2.0a2", True),
        ("1.0.0b1", True),
        ("2.0.0rc1", True),
        ("1.0.0alpha1", True),
        ("1.0.0beta2", True),
        ("v0.2.0a2", True),
        ("1.2.3", False),
        ("v1.2.3", False),
        ("HEAD", False),
        ("abc123def", False),
    ],
)
def test_prereleases_flag_follows_pep440_fragments(vcs_ref: str, expect_prereleases: bool):
    result = copy_argv.describe(git_payload(vcs_ref=vcs_ref))
    assert result["ok"] is True
    argv = result["argv"]
    assert argv[argv.index("--vcs-ref") + 1] == vcs_ref
    assert ("--prereleases" in argv) is expect_prereleases
    assert_no_forbidden(argv)


@pytest.mark.parametrize("source", ["zip", "path"])
def test_zip_or_path_without_git_fails_closed(tmp_path: Path, source: str):
    src = tmp_path / "unzipped"
    src.mkdir()
    (src / "copier.yml").write_text("_subdirectory: template\n", encoding="utf-8")
    result = copy_argv.describe(
        {
            "source":      source,
            "path":        str(src),
            "vcs_ref":     "0.2.0a2",
            "destination": str(tmp_path / "out"),
        }
    )
    assert result == {
        "ok":     False,
        "layout": None,
        "copier": "9.18.2",
        "argv":   None,
        "error":  GIT_ERROR,
        "notes":  [],
    }


@pytest.mark.parametrize(
    "payload",
    [
        git_payload(),
        git_payload(vcs_ref="1.2.3"),
        git_payload(url="https://github.com/owner/repo.git"),
        git_payload(data_file="starter/answers/sidebar.yml"),
        git_payload(pretend=True),
        git_payload(pretend=False),
    ],
)
def test_forbidden_flags_never_appear(payload: dict[str, Any]):
    described = copy_argv.describe(payload)
    planned = copy_argv.plan(payload)
    assert described["ok"] is True
    assert planned["ok"] is True
    assert_no_forbidden(described["argv"])
    assert_no_forbidden(planned["argv"])
    human = planned["human"]
    for flag in FORBIDDEN_FLAGS:
        assert flag not in human
    assert "git init" not in human


def test_data_file_is_optional():
    omitted = copy_argv.describe(git_payload())
    included = copy_argv.describe(git_payload(data_file="starter/answers/sidebar.yml"))
    assert omitted["ok"] is True
    assert included["ok"] is True
    assert "--data-file" not in omitted["argv"]
    argv = included["argv"]
    assert argv[argv.index("--data-file") + 1] == "starter/answers/sidebar.yml"
    assert_no_forbidden(omitted["argv"])
    assert_no_forbidden(included["argv"])


def test_pretend_is_optional():
    omitted  = copy_argv.describe(git_payload())
    dry_run  = copy_argv.describe(git_payload(pretend=True))
    explicit = copy_argv.describe(git_payload(pretend=False))
    assert omitted["ok"] is True and dry_run["ok"] is True and explicit["ok"] is True
    assert "--pretend" not in omitted["argv"]
    assert "--pretend" not in explicit["argv"]
    assert "--pretend" in dry_run["argv"]
    assert_no_forbidden(dry_run["argv"])


@pytest.mark.parametrize("source", ["zip", "path"])
def test_plugin_root_layout(tmp_path: Path, source: str):
    src = write_plugin_root(tmp_path / "plugin-root")
    result = copy_argv.describe(
        {
            "source":      source,
            "path":        str(src),
            "vcs_ref":     "1.2.3",
            "destination": str(tmp_path / "out"),
        }
    )
    assert result["ok"] is True
    assert result["layout"] == "plugin-root"
    assert result["copier"] == "9.18.2"
    argv = result["argv"]
    assert argv[-2] == str(src)
    assert "--vcs-ref" in argv
    assert "--prereleases" not in argv
    assert_no_forbidden(argv)


@pytest.mark.parametrize(
    "builder,source",
    [
        (write_nested_template_config, "zip"),
        (write_nested_info_jinja, "path"),
    ],
)
def test_nested_template_layout(tmp_path: Path, builder, source: str):
    src = builder(tmp_path / "nested")
    result = copy_argv.describe(
        {
            "source":      source,
            "path":        str(src),
            "vcs_ref":     "1.2.3",
            "destination": str(tmp_path / "out"),
        }
    )
    assert result["ok"] is True
    assert result["layout"] == "nested-template"
    assert_no_forbidden(result["argv"])


def test_https_github_url_normalizes_to_gh():
    result = copy_argv.describe(
        git_payload(url="https://github.com/owner/repo.git", vcs_ref="1.2.3")
    )
    assert result["ok"] is True
    assert result["argv"][-2] == "gh:owner/repo"


def test_git_source_requires_url():
    payload = git_payload()
    del payload["url"]
    result = copy_argv.describe(payload)
    assert result["ok"] is False
    assert result["argv"] is None
    assert result["layout"] is None
    assert "url" in result["error"]


def test_plan_adds_human_shell_line_without_exec(capsys):
    payload = git_payload()
    result = copy_argv.plan(payload)
    assert result["ok"] is True
    assert result["human"] == (
        "uvx --from copier==9.18.2 copier copy --vcs-ref 0.2.0a2 "
        "--prereleases gh:owner/repo ../my-iina-plugin"
    )
    assert "error" not in result
    code = copy_argv.main(["plan", json.dumps(payload)])
    assert code == 0
    printed = json.loads(capsys.readouterr().out)
    assert printed["human"] == result["human"]
    assert printed["argv"] == result["argv"]


def test_copy_run_execute_are_rejected(capsys):
    code = copy_argv.main(["copy", json.dumps(git_payload())])
    assert code == 2
    body = json.loads(capsys.readouterr().out)
    assert body["ok"] is False
    assert "describe" in body["error"]


def test_main_help_returns_zero(capsys):
    code = copy_argv.main(["--help"])
    assert code == 0
    out = capsys.readouterr().out
    assert "usage:" in out.lower() or "describe" in out
    assert "unsupported subcommand" not in out


def test_script_source_does_not_execute_copier():
    text = SCRIPT.read_text(encoding="utf-8")
    assert "subprocess" not in text
    assert "run_copy" not in text
    assert "Popen" not in text
