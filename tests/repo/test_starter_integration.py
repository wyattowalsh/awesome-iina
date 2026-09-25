from __future__ import annotations

import importlib.util
import json
import subprocess
import sys
import tomllib
import zipfile

import pytest
from tests.helpers.paths import REPO_ROOT

ROOT = REPO_ROOT
STARTER = ROOT / "starter"


def load_script(name):
    if name == "make_archive":
        from awesome_iina.repo import archive

        return archive
    spec = importlib.util.spec_from_file_location(name, ROOT / "starter/repo_wrapper.py")
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_root_wrapper_delegates_one_questionnaire():
    load_script("starter").verify_wrapper(ROOT)


def test_wrapper_cannot_silently_override_policy(tmp_path):
    wrapper = (ROOT / "copier.yml").read_text() + "_tasks: ['unwanted']\n"
    (tmp_path / "copier.yml").write_text(wrapper)
    with pytest.raises(ValueError, match="only _subdirectory"):
        load_script("starter").verify_wrapper(tmp_path)


def test_package_version_and_source_version_agree():
    from awesome_iina import __version__

    assert tomllib.loads((ROOT / "pyproject.toml").read_text())["project"]["version"] == __version__


def test_starter_source_verifier_runs_without_copier():
    result = subprocess.run(
        [sys.executable, str(ROOT / "starter/repo_wrapper.py"), "verify"],
        capture_output=True,
        text=True,
        timeout=90,
    )
    assert result.returncode == 0, result.stderr
    report = json.loads(result.stdout)
    assert report["shapes"] == 32
    assert report["real_copier"] == "not-run"


def test_dry_run_is_non_mutating_and_quotes_argv(tmp_path):
    destination = tmp_path / "plugin with spaces; $(not-a-command)"
    result = subprocess.run(
        [
            sys.executable,
            str(ROOT / "starter/repo_wrapper.py"),
            "new",
            str(destination),
            "--ref",
            "HEAD",
            "--preset",
            "sidebar",
            "--name",
            'A "quoted" name',
            "--dry-run",
        ],
        capture_output=True,
        text=True,
    )
    assert result.returncode == 0, result.stderr
    report = json.loads(result.stdout)
    assert not report["executed"]
    assert report["argv"][-1] == str(destination)
    assert 'plugin_name=A "quoted" name' in report["argv"]
    assert "--trust" not in report["argv"]
    assert not destination.exists()


@pytest.mark.parametrize("destination", [ROOT, ROOT / "consumer", ROOT.parent])
def test_generator_rejects_overlapping_destinations(destination):
    result = subprocess.run(
        [
            sys.executable,
            str(ROOT / "starter/repo_wrapper.py"),
            "new",
            str(destination),
            "--ref",
            "HEAD",
            "--dry-run",
        ],
        capture_output=True,
        text=True,
    )
    assert result.returncode == 1
    assert "separate directory" in result.stderr


def test_template_editor_settings_are_source_but_root_editor_state_is_not(tmp_path):
    archive = load_script("make_archive")
    output = tmp_path / "package.zip"
    assert archive.included(STARTER / "template/.vscode/settings.json", ROOT, output)
    root = tmp_path / "repo"
    (root / ".vscode").mkdir(parents=True)
    settings = root / ".vscode/settings.json"
    settings.write_text("{}")
    assert not archive.included(settings, root, output)


def test_archive_requires_both_complete_projects(tmp_path):
    archive = load_script("make_archive")
    files = archive.collect_files(ROOT, tmp_path / "out.zip")
    archive.verify_source_selection(ROOT, files)
    incomplete = [p for p in files if p != STARTER / "template/scripts/build.mjs"]
    with pytest.raises(RuntimeError, match=r"template/scripts/build\.mjs"):
        archive.verify_source_selection(ROOT, incomplete)


def test_verify_archive_catches_missing_embedded_source(tmp_path):
    module = load_script("make_archive")
    output = tmp_path / "incomplete.zip"
    required = set(module._REQUIRED_SOURCE_MEMBERS)
    required.remove("starter/template/scripts/build.mjs")
    with zipfile.ZipFile(output, "w") as archive:
        for name in required:
            archive.writestr(f"awesome-iina/{name}", "stub")
        for index in range(10):
            archive.writestr(f"awesome-iina/src/awesome_iina/extra{index}.py", "# stub")
            archive.writestr(f"awesome-iina/tests/test_extra{index}.py", "# stub")
    with pytest.raises(RuntimeError, match=r"template/scripts/build\.mjs"):
        module.verify_archive(output, "awesome-iina")


def test_generation_requires_own_clean_git_history(tmp_path, monkeypatch):
    module = load_script("starter")
    root = tmp_path / "source"
    root.mkdir()
    monkeypatch.setattr(module, "ROOT", root)

    def git(*args):
        return subprocess.run(
            [
                "git",
                "-c",
                "core.hooksPath=/dev/null",
                "-c",
                "commit.gpgsign=false",
                "-c",
                "user.name=Integration Test",
                "-c",
                "user.email=test@example.invalid",
                *args,
            ],
            cwd=root,
            check=True,
            capture_output=True,
            text=True,
        )

    git("init")
    (root / "copier.yml").write_text("# synthetic test source\n")
    template = root / "starter/template"
    template.mkdir(parents=True)
    (template / "package.json.jinja").write_text("{}")
    git("add", ".")
    git("commit", "-m", "test input")
    module.require_committed_source("HEAD")
    (root / "uncommitted.txt").write_text("not yet reviewed")
    with pytest.raises(ValueError, match="commit the reviewed"):
        module.require_committed_source("HEAD")
    (root / "uncommitted.txt").unlink()
    with pytest.raises(subprocess.CalledProcessError):
        module.require_committed_source("missing-ref")
    nested = root / "subdirectory"
    nested.mkdir()
    monkeypatch.setattr(module, "ROOT", nested)
    with pytest.raises(ValueError, match="ancestor"):
        module.require_committed_source("HEAD")


def test_integrated_ci_uses_root_source_and_no_skip_gate():
    text = (ROOT / ".github/workflows/starter.yml").read_text()
    assert '--source "$GITHUB_WORKSPACE"' in text
    assert "REQUIRE_COPIER: '1'" in text
    assert "--require-suite real-copier" in text
    assert "needs: [template, generated]" in text
    spec = importlib.util.spec_from_file_location(
        "starter_verify_workflows",
        STARTER / "tools/verify_workflows.py",
    )
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    registry = json.loads((STARTER / "references/action-pins.json").read_text())
    assert not module.verify(ROOT / ".github/workflows/starter.yml", registry)
