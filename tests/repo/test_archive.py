from __future__ import annotations

import zipfile
from pathlib import Path

from tests.helpers.archive import create_minimal_source_tree, load_archive_module


def test_archive_contains_full_source_surface(tmp_path: Path) -> None:
    module = load_archive_module()
    root = tmp_path / "repo"
    root.mkdir()
    create_minimal_source_tree(root)
    output = tmp_path / "awesome-iina.zip"
    manifest = tmp_path / "manifest.sha256"

    files = module.create_archive(root, output, "awesome-iina")
    module.write_file_manifest(root, files, manifest)

    with zipfile.ZipFile(output) as archive:
        names = set(archive.namelist())
    assert "awesome-iina/src/awesome_iina/cli.py" in names
    assert "awesome-iina/tests/catalog/test_catalog.py" in names
    assert "src/awesome_iina/cli.py" in manifest.read_text()


def test_archive_refuses_docs_only_tree(tmp_path: Path) -> None:
    module = load_archive_module()
    root = tmp_path / "repo"
    (root / "docs").mkdir(parents=True)
    (root / "docs/readme.md").write_text("docs only\n")

    try:
        module.create_archive(root, tmp_path / "bad.zip", "awesome-iina")
    except RuntimeError as error:
        assert "incomplete source archive" in str(error)
    else:
        raise AssertionError("docs-only archive should be rejected")
