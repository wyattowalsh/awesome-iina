from __future__ import annotations

import importlib.util
import json
import sys
from pathlib import Path

import pytest

STARTER = Path(__file__).resolve().parents[1]
SCRIPT = STARTER / "plugins/iina-plugin-dev/skills/iina-upgrade/scripts/answers_lineage.py"
SPEC = importlib.util.spec_from_file_location("answers_lineage", SCRIPT)
assert SPEC is not None and SPEC.loader is not None
mod = importlib.util.module_from_spec(SPEC)
previous = sys.dont_write_bytecode
sys.dont_write_bytecode = True
try:
    SPEC.loader.exec_module(mod)
finally:
    sys.dont_write_bytecode = previous

KEYS = ("ok", "reason", "src_path", "vcs_ref", "unsafe")
FIXTURE_REASON = "fixture _src_path is not a Copier source (git URL or ZIP)"


def write_answers(root: Path, body: str) -> Path:
    root.mkdir()
    (root / ".copier-answers.yml").write_text(body, encoding="utf-8")
    return root


def assert_shape(payload: dict[str, object]) -> None:
    assert tuple(payload) == KEYS
    assert isinstance(payload["ok"], bool)
    assert isinstance(payload["unsafe"], bool)
    assert payload["reason"] is None or isinstance(payload["reason"], str)
    assert payload["src_path"] is None or isinstance(payload["src_path"], str)
    assert payload["vcs_ref"] is None or isinstance(payload["vcs_ref"], str)


def test_missing_answers(tmp_path: Path) -> None:
    repo = tmp_path / "consumer"
    repo.mkdir()
    payload = mod.read_lineage(repo)
    assert_shape(payload)
    assert payload == {
        "ok":       False,
        "reason":   "missing .copier-answers.yml",
        "src_path": None,
        "vcs_ref":  None,
        "unsafe":   False,
    }


def test_missing_answers_absent_repo(tmp_path: Path) -> None:
    payload = mod.read_lineage(tmp_path / "no-such-consumer")
    assert payload["ok"] is False
    assert payload["reason"] == "missing .copier-answers.yml"
    assert payload["src_path"] is None
    assert payload["vcs_ref"] is None


@pytest.mark.parametrize(
    "src_path",
    (
        "tests/fixtures/plugin",
        "/tmp/tests/fixtures/iina",
        "starter/tests/fixtures/source",
        "/tmp/fixture/source",
        "FIXTURE-NOT-COPIER",
    ),
)
def test_fixture_src_path(tmp_path: Path, src_path: str) -> None:
    repo = write_answers(
        tmp_path / "consumer",
        f"_src_path: {src_path}\n_commit: FIXTURE\n",
    )
    payload = mod.read_lineage(repo)
    assert_shape(payload)
    assert payload == {
        "ok":       False,
        "reason":   FIXTURE_REASON,
        "src_path": None,
        "vcs_ref":  None,
        "unsafe":   False,
    }


def test_happy_path(tmp_path: Path) -> None:
    repo = write_answers(
        tmp_path / "consumer",
        "_src_path: gh:owner/repo\n_commit: 0.2.0a2\nplugin_name: Example\n",
    )
    payload = mod.read_lineage(repo)
    assert_shape(payload)
    assert payload == {
        "ok":       True,
        "reason":   None,
        "src_path": "gh:owner/repo",
        "vcs_ref":  "0.2.0a2",
        "unsafe":   False,
    }


def test_empty_src_path(tmp_path: Path) -> None:
    repo = write_answers(tmp_path / "consumer", "_src_path: ''\n_commit: 0.2.0a2\n")
    payload = mod.read_lineage(repo)
    assert payload["ok"] is False
    assert payload["reason"] == "empty _src_path"
    assert payload["src_path"] is None
    assert payload["vcs_ref"] is None


def test_unreadable_invalid_yaml(tmp_path: Path) -> None:
    repo = write_answers(tmp_path / "consumer", ": not yaml: [\n")
    payload = mod.read_lineage(repo)
    assert payload["ok"] is False
    assert payload["reason"] == "unreadable .copier-answers.yml"
    assert payload["unsafe"] is False


def test_surprise_tasks_are_unsafe(tmp_path: Path) -> None:
    repo = write_answers(
        tmp_path / "consumer",
        "_src_path: gh:owner/repo\n_commit: 0.2.0a2\n_tasks:\n  - git init\n",
    )
    payload = mod.read_lineage(repo)
    assert payload["ok"] is True
    assert payload["src_path"] == "gh:owner/repo"
    assert payload["vcs_ref"] == "0.2.0a2"
    assert payload["unsafe"] is True


def test_cli_happy_path_json(tmp_path: Path, capsys: pytest.CaptureFixture[str]) -> None:
    repo = write_answers(
        tmp_path / "consumer",
        "_src_path: gh:owner/repo\n_commit: 0.2.0a2\n",
    )
    assert mod.main([str(repo)]) == 0
    payload = json.loads(capsys.readouterr().out)
    assert payload["ok"] is True
    assert payload["src_path"] == "gh:owner/repo"
    assert payload["vcs_ref"] == "0.2.0a2"
    assert payload["unsafe"] is False


def test_cli_help_returns_zero(capsys: pytest.CaptureFixture[str]) -> None:
    assert mod.main(["--help"]) == 0
    out = capsys.readouterr().out
    assert out
    assert "REPO" in out


def test_cli_missing_answers_json(tmp_path: Path, capsys: pytest.CaptureFixture[str]) -> None:
    repo = tmp_path / "consumer"
    repo.mkdir()
    assert mod.main([str(repo)]) == 0
    payload = json.loads(capsys.readouterr().out)
    assert payload["ok"] is False
    assert payload["reason"] == "missing .copier-answers.yml"


def test_script_is_read_only_and_does_not_run_copier() -> None:
    text = SCRIPT.read_text(encoding="utf-8")
    assert "import copier" not in text
    assert "from copier" not in text
    assert "subprocess" not in text
    assert "Popen" not in text
    assert "urllib" not in text
    assert "httpx" not in text
    assert "requests" not in text
    assert "copier update" not in text
    assert "write_text" not in text
    assert "Path.write" not in text
    assert "open(" not in text
