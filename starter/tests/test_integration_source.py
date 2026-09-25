from __future__ import annotations

import json
from pathlib import Path

import pytest

from tools.copier_source import copy_source
from tools.fixture_render import ROOT, render
from tools.verify_source import assert_consumer_copier_pins, verify_source


def test_template_source_contracts():
    assert verify_source()["shapes"] == 32


def test_consumer_copier_pin_drift_is_rejected(tmp_path: Path):
    (tmp_path / "template/scripts").mkdir(parents=True)
    (tmp_path / "template/scripts/template-update.mjs").write_text(
        "uvx --from copier==9.18.2 copier update\n"
    )
    (tmp_path / "template/package.json.jinja").write_text(
        '"template:check": "uvx --from copier==9.0.0 copier check-update"\n'
    )
    with pytest.raises(ValueError, match="package.json.jinja"):
        assert_consumer_copier_pins(tmp_path, "9.18.2")
    (tmp_path / "template/package.json.jinja").write_text(
        '"template:check": "uvx --from copier==9.18.2 copier check-update"\n'
    )
    assert_consumer_copier_pins(tmp_path, "9.18.2")


def test_consumer_copier_pins_match_toolchain():
    tools = json.loads((ROOT / "toolchain.json").read_text())
    assert_consumer_copier_pins(ROOT, tools["copier"])


def test_source_snapshot_is_minimal_and_byte_preserving(tmp_path):
    out = tmp_path / "snapshot"
    digest = copy_source(ROOT, out)
    assert len(digest) == 64
    assert (out / "copier.yml").read_bytes() == (ROOT / "copier.yml").read_bytes()
    assert (out / "template/package.json.jinja").is_file()
    assert not (out / "history").exists()
    assert not (out / ".git").exists()
    with pytest.raises(FileExistsError):
        copy_source(ROOT, out)


def test_docs_only_source_rejected(tmp_path):
    source = tmp_path / "input"
    source.mkdir()
    (source / "README.md").write_text("not a template\n")
    with pytest.raises(ValueError, match="complete"):
        copy_source(source, tmp_path / "out")


def test_symlink_source_rejected_before_copy(tmp_path):
    source = tmp_path / "source"
    copy_source(ROOT, source)
    (source / "template/link").symlink_to(ROOT / "README.md")
    out = tmp_path / "out"
    with pytest.raises(ValueError, match="symlink"):
        copy_source(source, out)
    assert not out.exists()


def test_consumer_root_and_identity(tmp_path):
    dest = tmp_path / "consumer"
    render(dest, {"user_name": 'A "quoted" author', "plugin_name": 'A <tag> \\ plugin'})
    assert (dest / ".github/CONTRIBUTING.md").exists()
    assert (dest / ".github/SECURITY.md").exists()
    assert not (dest / "CONTRIBUTING.md").exists()
    manifest = json.loads((dest / "Info.json").read_text())
    assert manifest["author"]["name"] == 'A "quoted" author'
    assert manifest["name"] == 'A <tag> \\ plugin'


@pytest.mark.parametrize("author", ["", "   ", "a" * 121])
def test_bad_author_answer_is_rejected(tmp_path, author):
    with pytest.raises(ValueError, match="user_name"):
        render(tmp_path / "consumer", {"user_name": author})
