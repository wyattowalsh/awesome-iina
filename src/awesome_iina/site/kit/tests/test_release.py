from __future__ import annotations

import importlib.util
import json
from pathlib import Path
from zipfile import ZipFile

import pytest

from brandkit.core import asset_records, current_hash, sha
from package_kit import package


def test_all_production_assets_match_manifest(kit):
    assert len(asset_records(kit)) == 36


def test_packaging_repeatable(tmp_path, kit):
    a, b = tmp_path / "one.zip", tmp_path / "two.zip"
    first = package(kit, a, delivery=True)
    second = package(kit, b, delivery=True)
    assert first["sha256"] == second["sha256"]
    with ZipFile(a) as z:
        assert z.testzip() is None
        root = z.namelist()[0].split("/")[0]
        manifest = json.loads(z.read(root + "/BUNDLE-MANIFEST.json"))
        for item in manifest["files"]:
            assert sha(z.read(root + "/" + item["path"])) == item["sha256"]
        assert not any("/archive/" in n or "/scripts/" in n for n in z.namelist())


def mock_root(tmp_path):
    root = tmp_path / "kit"
    (root / "source").mkdir(parents=True)
    (root / "source/release.json").write_text(json.dumps({
        "revision": "2.1.0", "identity_revision": "2.0.0-review.1", "archive_root": "kit", "date": "2026-09-16",
    }))
    (root / "README.md").write_text("Hello")
    return root


@pytest.mark.parametrize("filename,raw", [
    ("font.otf", b"ordinary"), ("font.woff2", b"ordinary"),
    ("disguised.bin", b"\x00\x01\x00\x00more"), ("other.bin", b"OTTOmore"),
])
def test_font_binaries_refused(tmp_path, filename, raw):
    root = mock_root(tmp_path)
    (root / filename).write_bytes(raw)
    with pytest.raises(ValueError, match="Font binaries"):
        package(root, tmp_path / "out.zip")


def test_secret_cache_and_symlink_policy(tmp_path):
    root = mock_root(tmp_path)
    (root / ".env").write_text("SECRET=true")
    (root / "private.key").write_text("private key")
    (root / ".pytest_cache").mkdir()
    (root / ".pytest_cache/test.txt").write_text("cache")
    (root / "innocent-link.md").symlink_to(root / ".env")
    with pytest.raises(ValueError, match="Symlink"):
        package(root, tmp_path / "out.zip")
    (root / "innocent-link.md").unlink()
    package(root, tmp_path / "out.zip")
    with ZipFile(tmp_path / "out.zip") as z:
        assert not any(n.endswith(("/.env", ".key", "test.txt")) for n in z.namelist())


def test_importing_builder_has_no_source_side_effects(kit):
    # Import itself neither creates an ICC profile nor writes to the kit.
    before = {p.relative_to(kit): current_hash(p) for p in (kit / "source").rglob("*") if p.is_file()}
    spec = importlib.util.spec_from_file_location("builder", kit / "scripts/build_assets.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    after = {p.relative_to(kit): current_hash(p) for p in (kit / "source").rglob("*") if p.is_file()}
    assert before == after
    assert mod.PROFILE == b""


def test_builder_root_and_missing_profile(kit, tmp_path):
    import build_assets
    build_assets.configure_root(kit)
    assert build_assets.ROOT == kit
    (tmp_path / "source").mkdir()
    for name in ["tokens.json", "geometry.json"]:
        (tmp_path / "source" / name).write_bytes((kit / "source" / name).read_bytes())
    with pytest.raises(ValueError, match="Missing source/output-srgb.icc"):
        build_assets.configure_root(tmp_path)
    assert not (tmp_path / "source/output-srgb.icc").exists()
    build_assets.configure_root(kit)
