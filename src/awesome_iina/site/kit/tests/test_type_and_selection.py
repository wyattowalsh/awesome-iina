"""Regression assertions for source CSS and current/optional shipping selection."""
from __future__ import annotations

import json
import shutil
from pathlib import Path
from xml.etree import ElementTree as ET
from zipfile import ZipFile

import pytest

import build_assets
from brandkit.core import BrandError, read_json, selected_asset_records, sha
from brandkit.install import apply_plan, create_plan, source_fingerprint, undo_receipt
from package_kit import package

NS = "{http://www.w3.org/2000/svg}"
LEGACY = "assets/brand/readme-hero-retained.png"


def test_editable_builder_uses_css_not_ineffective_attribute():
    # The editable branch needs no binary font to emit its documented style.
    face = object.__new__(build_assets.Type)
    element = ET.fromstring(face.text("Awesome IINA", 86, 47, 43, "bold", "#fff", editable=True, tracking=-.7))
    assert element.get("style") == "font-kerning:none"
    assert "font-kerning" not in element.attrib
    assert element.get("font-size") == "43"
    assert element.get("letter-spacing") == "-0.7"


@pytest.mark.parametrize("name,count", [("wordmark-dark-editable.svg", 1), ("wordmark-light-editable.svg", 1), ("social-card-editable.svg", 4)])
def test_all_generated_live_text_has_explicit_css(kit, name, count):
    root = ET.parse(kit / "source" / name).getroot()
    elements = root.findall(".//" + NS + "text")
    assert len(elements) == count
    assert all(e.get("style") == "font-kerning:none" for e in elements)
    assert all(e.get("font-kerning") is None for e in elements)


def test_all_35_previous_artworks_preserved(kit):
    previous = read_json(kit / "provenance/v2.1.0-verification/ASSET-MANIFEST.json")
    images = [r for r in previous["assets"] if r["format"] in {"png", "ico", "svg"}]
    assert len(images) == 35
    assert all(sha((kit / row["path"]).read_bytes()) == row["sha256"] for row in images)


def test_default_shipping_omits_historical_hero(kit):
    ordinary = {r["path"] for r in selected_asset_records(kit)}
    optional = {r["path"] for r in selected_asset_records(kit, include_legacy_hero=True)}
    assert len(ordinary) == 35 and optional - ordinary == {LEGACY}


def test_installer_optional_hero_is_explicit(kit, project):
    default = create_plan(target=project, kit=kit)
    assert LEGACY not in {x["path"] for x in default["changes"]}
    plan = create_plan(target=project, kit=kit, include_legacy_hero=True)
    assert LEGACY in {x["path"] for x in plan["changes"]}
    result = apply_plan(plan, kit=kit)
    assert (project / LEGACY).read_bytes() == (kit / LEGACY).read_bytes()
    assert b"retained" not in (project / "README.md").read_bytes()
    undo_receipt(Path(result["receipt"]))
    assert not (project / LEGACY).exists()


def test_delivery_zip_and_policy_agree(kit, tmp_path):
    destination = tmp_path / "production.zip"
    package(kit, destination, delivery=True)
    with ZipFile(destination) as z:
        root = z.namelist()[0].split("/")[0]
        assert root + "/" + LEGACY not in z.namelist()
        policy = json.loads(z.read(root + "/DELIVERY-SELECTION.json"))
        assert policy["historical_hero_included"] is False
        actual = {n[len(root)+1:] for n in z.namelist() if n.startswith(root + "/assets/brand/")}
        assert actual == set(policy["included_assets"])
        assert root + "/docs/ASSET-USE.md" in z.namelist()


def test_demo_uses_current_mark_not_legacy(kit):
    demo = (kit / "integration/demo/index.html").read_text()
    assert "wordmark-dark.svg" in demo and "wordmark-light.svg" in demo
    assert "readme-hero-retained.png" not in demo
    assert "Not affiliated with the IINA project." in demo
    assert '<strong>Awesome IINA</strong>' in demo
    assert "open-graph-1200x630.png" in demo
    assert 'content="1200"' in demo and 'content="630"' in demo
    assert "github-social-preview-1280x640.png" not in demo


def test_shipping_policy_is_a_hashed_source(kit, tmp_path):
    copy = tmp_path / "kit"
    for d in ("source", "assets", "scripts"):
        shutil.copytree(kit / d, copy / d)
    shutil.copy2(kit / "ASSET-MANIFEST.json", copy / "ASSET-MANIFEST.json")
    before = source_fingerprint(copy)
    p = copy / "source/shipping-selection.json"
    obj = read_json(p); obj["policy"] += " Clarification."; p.write_text(json.dumps(obj))
    assert source_fingerprint(copy) != before
    obj["primary_assets"].append(LEGACY); p.write_text(json.dumps(obj))
    with pytest.raises(BrandError, match="exactly once"):
        selected_asset_records(copy)
