from __future__ import annotations

import copy
import json
import os
from pathlib import Path

import pytest

from brandkit.core import (
    BEGIN, END, BrandError, asset_records, canonical_url, json_bytes, merge_readme,
    readme_block, relative_path, render_site, safe_target,
)
from brandkit.install import (
    apply_plan, check_receipt, create_plan, undo_receipt,
)


def inventory(path):
    return {p.relative_to(path).as_posix(): p.read_bytes() for p in path.rglob("*") if p.is_file()}


@pytest.mark.parametrize("url", [
    "https://example.org/", "https://example.org/awesome-iina/",
    "https://wyattowalsh.github.io/awesome-iina/", "https://example.org/a/b/",
])
@pytest.mark.parametrize("social,dims", [("github", (1280, 640)), ("opengraph", (1200, 630))])
def test_deployment_shapes(kit, url, social, dims):
    out = render_site(kit, url, social)
    head = out["website-head.html"].decode()
    config = json.loads(out["deployment.json"])
    assert config["social_width"] == dims[0] and config["social_height"] == dims[1]
    assert f'content="{dims[0]}"' in head and f'content="{dims[1]}"' in head
    assert all(f'property="og:{key}"' in head for key in ("title", "type", "url", "image"))
    assert "{{" not in head and "}}" not in head
    assert url + config["social_image"] in head
    manifest = json.loads(out["site.webmanifest"])
    assert manifest["display"] == "browser"
    assert all(icon["purpose"] == "any" for icon in manifest["icons"])


@pytest.mark.parametrize("url", [
    "http://example.org/", "https://user:secret@example.org/", "https://example.org",
    "https://example.org/a/?query=1", "https://example.org/a/#x", "https://example.org/a/../b/",
    "https://example.org/%2e%2e/", "https://example.org//test/", "javascript:alert(1)",
    "https://example.org/a'bad/", "https://{{HOST}}/", "https://example.org:wrong/",
    "https://example.org/a\nb/", "https://example.org/a\\b/",
])
def test_bad_urls(url):
    with pytest.raises(BrandError):
        canonical_url(url)


@pytest.mark.parametrize("path", ["", ".", "..", "../README.md", "/README.md", "a//b", "a/./b", "a\\b", "a/%2e/b", "a/.git/config", "a?b", "a\0b"])
def test_unsafe_relative_paths(path):
    with pytest.raises(BrandError):
        relative_path(path)


@pytest.mark.parametrize("original", [b"# Catalog\n", b"# Catalog\r\n", b"\xef\xbb\xbf# Catalog\r\n", b""])
def test_readme_preserves_bytes_and_is_idempotent(original):
    block = readme_block("assets/brand", "README.md")
    result = merge_readme(original, block)
    assert merge_readme(result, block) == result
    assert result.endswith(original.lstrip(b"\xef\xbb\xbf"))
    assert b"Not affiliated with the IINA project" in result
    if original.startswith(b"\xef\xbb\xbf"):
        assert result.startswith(b"\xef\xbb\xbf")
    if b"\r\n" in original:
        assert b"\n" not in result.replace(b"\r\n", b"")


@pytest.mark.parametrize("original", [BEGIN, END, END + BEGIN, BEGIN + END + BEGIN + END])
def test_malformed_markers_rejected(original):
    with pytest.raises(BrandError):
        merge_readme(original.encode(), readme_block("assets/brand", "README.md"))


def test_plan_no_target_mutation(kit, project):
    before = inventory(project)
    plan = create_plan(target=project, kit=kit)
    assert inventory(project) == before
    assert not plan["conflicts"] and plan["target_writes_performed"] is False
    assert len(plan["changes"]) == 38  # 35 primary assets + head/config + README
    assert "site.webmanifest" in " ".join(x["path"] for x in plan["changes"])


def test_apply_repeat_check_undo_restore_every_byte(kit, project):
    original = inventory(project)
    plan = create_plan(target=project, kit=kit)
    result = apply_plan(plan, kit=kit)
    assert result["status"] == "applied" and result["files_written"] == 38
    receipt = Path(result["receipt"])
    assert check_receipt(receipt)["status"] == "passed"
    assert apply_plan(plan, kit=kit)["status"] == "already-applied"
    after = create_plan(target=project, kit=kit)
    assert all(x["action"] == "unchanged" for x in after["changes"])
    assert apply_plan(after, kit=kit)["status"] == "no-changes"
    assert (project / "catalog.yaml").read_bytes() == original["catalog.yaml"]
    undo = undo_receipt(receipt)
    assert undo["status"] == "undone"
    restored = {k: v for k, v in inventory(project).items() if not k.startswith(".awesome-iina-brand/")}
    assert restored == original
    assert check_receipt(receipt)["status"] == "passed"


def test_preexisting_different_asset_requires_explicit_permission(kit, project):
    dest = project / "assets/brand/symbol-dark.svg"
    dest.parent.mkdir(parents=True)
    dest.write_bytes(b"<svg>local custom artwork</svg>")
    before = inventory(project)
    plan = create_plan(target=project, kit=kit)
    assert plan["conflicts"] == ["assets/brand/symbol-dark.svg"]
    with pytest.raises(BrandError, match="Unowned"):
        apply_plan(plan, kit=kit)
    assert inventory(project) == before
    replace = create_plan(target=project, kit=kit, replace_existing=True)
    result = apply_plan(replace, kit=kit)
    undo_receipt(Path(result["receipt"]))
    assert dest.read_bytes() == b"<svg>local custom artwork</svg>"


def test_stale_readme_plan_does_not_apply(kit, project):
    plan = create_plan(target=project, kit=kit)
    (project / "README.md").write_text("New edits after planning")
    before = inventory(project)
    with pytest.raises(BrandError, match="stale"):
        apply_plan(plan, kit=kit)
    assert inventory(project) == before


def test_user_edits_protected_from_undo(kit, project):
    result = apply_plan(create_plan(target=project, kit=kit), kit=kit)
    receipt = Path(result["receipt"])
    (project / "README.md").write_text("Additional edits that must never be erased")
    before = inventory(project)
    assert check_receipt(receipt)["status"] == "drift"
    with pytest.raises(BrandError, match="edited"):
        undo_receipt(receipt)
    assert inventory(project) == before


@pytest.mark.parametrize("target_path", ["assets", "README.md", ".awesome-iina-brand"])
def test_target_symlinks_refused(kit, project, tmp_path, target_path):
    other = tmp_path / "outside"
    if target_path.endswith(".md"):
        other.write_text("private"); (project / target_path).unlink()
    else:
        other.mkdir()
    (project / target_path).symlink_to(other, target_is_directory=other.is_dir())
    with pytest.raises(BrandError):
        create_plan(target=project, kit=kit)


def test_arbitrary_plan_edit_rejected(kit, project):
    plan = create_plan(target=project, kit=kit)
    plan["changes"][0]["path"] = "catalog.yaml"
    with pytest.raises(BrandError, match="stale"):
        apply_plan(plan, kit=kit)
    assert (project / "catalog.yaml").read_bytes() == b"projects: []\n"


def test_generated_readme_and_public_assets(kit, project):
    (project / "templates").mkdir()
    original = b"# Original template\n{{ catalog }}\n"
    (project / "templates/header.md").write_bytes(original)
    plan = create_plan(target=project, kit=kit, readme="templates/header.md",
                       rendered_readme="README.md", public_dir="public",
                       site_url="https://example.org/subproject/", social="opengraph")
    old_readme = (project / "README.md").read_bytes()
    result = apply_plan(plan, kit=kit)
    assert (project / "README.md").read_bytes() == old_readme
    template = (project / "templates/header.md").read_bytes()
    assert b'public/assets/brand/wordmark-dark.svg' in template and template.endswith(original)
    head = (project / "integration/awesome-iina-brand/website-head.html").read_text()
    assert 'content="1200"' in head and 'content="630"' in head
    assert 'https://example.org/subproject/assets/brand/open-graph-1200x630.png' in head
    assert (project / "public/assets/brand/favicon.ico").is_file()
    assert check_receipt(Path(result["receipt"]))["status"] == "passed"


def test_backup_tampering_detected(kit, project):
    result = apply_plan(create_plan(target=project, kit=kit), kit=kit)
    receipt = Path(result["receipt"])
    data = json.loads(receipt.read_text())
    item = next(x for x in data["changes"] if x.get("backup"))
    (project / item["backup"]).write_text("altered backup")
    with pytest.raises(BrandError, match="Backup integrity"):
        undo_receipt(receipt)


def test_lock_contention(kit, project):
    plan = create_plan(target=project, kit=kit)
    lock = project / ".awesome-iina-brand/LOCK"
    lock.parent.mkdir(); lock.write_text("another operation")
    with pytest.raises(BrandError, match="lock"):
        apply_plan(plan, kit=kit)
    assert lock.read_text() == "another operation"


def test_failure_rolls_back_completed_writes(kit, project, monkeypatch):
    from brandkit import install
    before = inventory(project)
    plan = create_plan(target=project, kit=kit)
    original_write = install.atomic_write
    failed = False
    def injected(path, data, **kwargs):
        nonlocal failed
        if path.name == "favicon-16.png" and not failed:
            failed = True
            raise OSError("injected disk failure")
        return original_write(path, data, **kwargs)
    monkeypatch.setattr(install, "atomic_write", injected)
    with pytest.raises(OSError, match="disk failure"):
        apply_plan(plan, kit=kit)
    after = {k: v for k, v in inventory(project).items() if not k.startswith(".awesome-iina-brand/")}
    assert after == before
    receipts = list((project / ".awesome-iina-brand/transactions").glob("*/receipt.json"))
    assert json.loads(receipts[0].read_text())["status"] == "rolled-back"


def test_readme_file_mode_preserved(kit, project):
    os.chmod(project / "README.md", 0o640)
    result = apply_plan(create_plan(target=project, kit=kit), kit=kit)
    assert (project / "README.md").stat().st_mode & 0o777 == 0o640
    undo_receipt(Path(result["receipt"]))
    assert (project / "README.md").stat().st_mode & 0o777 == 0o640


def test_receipt_path_tampering_rejected(kit, project):
    result = apply_plan(create_plan(target=project, kit=kit), kit=kit)
    receipt = Path(result["receipt"])
    data = json.loads(receipt.read_text())
    data["changes"][0]["path"] = "catalog.yaml"
    receipt.write_bytes(json_bytes(data))
    with pytest.raises(BrandError, match="differ"):
        check_receipt(receipt)


def test_interrupted_transaction_recovery(kit, project):
    from brandkit.install import recover_receipt
    before = inventory(project)
    result = apply_plan(create_plan(target=project, kit=kit), kit=kit)
    receipt = Path(result["receipt"])
    data = json.loads(receipt.read_text())
    # Simulate process interruption after all payload writes, before final status commit.
    data["status"] = "applying"
    receipt.write_bytes(json_bytes(data))
    recovered = recover_receipt(receipt)
    assert recovered["status"] == "rolled-back"
    restored = {k: v for k, v in inventory(project).items() if not k.startswith(".awesome-iina-brand/")}
    assert restored == before


def test_recovery_refuses_external_edits(kit, project):
    from brandkit.install import recover_receipt
    result = apply_plan(create_plan(target=project, kit=kit), kit=kit)
    receipt = Path(result["receipt"])
    data = json.loads(receipt.read_text()); data["status"] = "applying"
    receipt.write_bytes(json_bytes(data))
    (project / "README.md").write_text("Important external update")
    with pytest.raises(BrandError, match="external edit"):
        recover_receipt(receipt)
    assert (project / "README.md").read_text() == "Important external update"


def test_missing_required_backup_refused_before_undo(kit, project):
    result = apply_plan(create_plan(target=project, kit=kit), kit=kit)
    receipt = Path(result["receipt"])
    data = json.loads(receipt.read_text())
    next(x for x in data["changes"] if "backup" in x).pop("backup")
    receipt.write_bytes(json_bytes(data))
    before = inventory(project)
    with pytest.raises(BrandError, match="required backup"):
        undo_receipt(receipt)
    assert inventory(project) == before


def test_interrupted_undo_can_be_recovered(kit, project):
    from brandkit.install import recover_receipt
    before = inventory(project)
    result = apply_plan(create_plan(target=project, kit=kit), kit=kit)
    receipt = Path(result["receipt"])
    data = json.loads(receipt.read_text()); data["status"] = "undoing"
    receipt.write_bytes(json_bytes(data))
    (project / "assets/brand/favicon-16.png").unlink()  # One newly created file already undone.
    recovered = recover_receipt(receipt)
    assert recovered["status"] == "rolled-back"
    restored = {k: v for k, v in inventory(project).items() if not k.startswith(".awesome-iina-brand/")}
    assert restored == before
