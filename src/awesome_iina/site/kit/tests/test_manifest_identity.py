"""Independent URL-resolution expectations, not a native manifest installation test."""
from __future__ import annotations

import json
import shutil
import subprocess
import sys
from pathlib import Path
from urllib.parse import urljoin, urlsplit

import pytest

from brandkit.core import BrandError, app_identity, read_json, render_site
from brandkit.install import apply_plan, check_receipt, create_plan, undo_receipt


def resolved(manifest: dict, manifest_url: str) -> dict:
    start = urljoin(manifest_url, manifest["start_url"])
    p = urlsplit(start)
    origin = f"{p.scheme}://{p.netloc}/"
    return {"id": urljoin(origin, manifest["id"]), "start": start,
            "scope": urljoin(manifest_url, manifest["scope"]),
            "icons": [urljoin(manifest_url, i["src"]) for i in manifest["icons"]]}


@pytest.mark.parametrize("site,identity", [
    ("https://example.org/", "/"),
    ("https://example.org/awesome-iina/", "/awesome-iina/"),
    ("https://example.org/catalogs/media/iina/", "/identities/awesome-iina"),
    ("https://example.org/other-project/", "/other-project/"),
    ("https://example.org:8443/catalog/", "/awesome-iina/"),
])
@pytest.mark.parametrize("social", ["github", "opengraph"])
def test_root_project_nested_and_dedicated_id(kit, site, identity, social):
    output = render_site(kit, site, social, app_id=identity)
    manifest = json.loads(output["site.webmanifest"])
    record = json.loads(output["deployment.json"])
    values = resolved(manifest, site + "assets/brand/site.webmanifest")
    origin = site.split("://")[0] + "://" + urlsplit(site).netloc
    assert values["id"] == origin + identity
    assert values["start"] == values["scope"] == site
    assert values["icons"] == [site + "assets/brand/icon-192.png", site + "assets/brand/icon-512.png"]
    assert record["resolved_app_id"] == values["id"]
    assert record["resolved_start_url"] == values["start"]
    assert record["resolved_scope"] == values["scope"]
    assert manifest["display"] == "browser"
    assert all(x["purpose"] == "any" for x in manifest["icons"])


def test_default_identity_remains_stable_across_location_and_revision(kit, tmp_path):
    copy = tmp_path / "kit"
    for directory in ("source", "assets"):
        shutil.copytree(kit / directory, copy / directory)
    before = render_site(copy, "https://example.org/old/")
    revision = read_json(copy / "source/release.json")
    revision["revision"] = "99.9.9"
    (copy / "source/release.json").write_text(json.dumps(revision))
    after = render_site(copy, "https://example.org/relocated/nested/")
    a, b = (json.loads(item["deployment.json"]) for item in (before, after))
    assert a["resolved_app_id"] == b["resolved_app_id"] == "https://example.org/awesome-iina/"
    assert a["resolved_start_url"] != b["resolved_start_url"]


def test_separate_projects_get_separate_explicit_identities(kit):
    first = json.loads(render_site(kit, "https://example.org/a/", app_id="/identities/a")["deployment.json"])
    second = json.loads(render_site(kit, "https://example.org/b/", app_id="/identities/b")["deployment.json"])
    assert first["resolved_app_id"] != second["resolved_app_id"]


@pytest.mark.parametrize("value", [None, "", "relative", "../", "//evil.example/x", "/a/../b/", "/a/./b/",
                                   "/a//b", "/%2e%2e/", "/a?b", "/a#b", "/a\\b", "/a b", "/a\nb", 3,
                                   "https://example.org/a/", "/\x00bad"])
def test_reject_unsupported_identity_without_normalization(value):
    with pytest.raises(BrandError):
        app_identity(value)


def test_id_slash_is_not_silently_added_or_removed():
    assert app_identity("/identities/iina") != app_identity("/identities/iina/")


def test_template_and_config_defects_fail_closed(kit, tmp_path):
    copy = tmp_path / "kit"
    for directory in ("source", "assets"):
        shutil.copytree(kit / directory, copy / directory)
    template = read_json(copy / "source/manifest.template.json")
    template["id"] = "../../"
    (copy / "source/manifest.template.json").write_text(json.dumps(template))
    with pytest.raises(BrandError, match="APP_ID"):
        render_site(copy, "https://example.org/project/")
    template["id"] = "{{APP_ID}}"
    (copy / "source/manifest.template.json").write_text(json.dumps(template))
    config = read_json(copy / "source/deployment.json")
    config.pop("app_id")
    (copy / "source/deployment.json").write_text(json.dumps(config))
    with pytest.raises(BrandError, match="App ID"):
        render_site(copy, "https://example.org/project/")


def test_installer_carries_id_through_plan_apply_and_undo(kit, project):
    plan = create_plan(target=project, kit=kit, site_url="https://example.org/relocated/", app_id="/identities/iina")
    assert plan["options"]["app_id"] == "/identities/iina"
    installed = apply_plan(plan, kit=kit)
    manifest = read_json(project / "assets/brand/site.webmanifest")
    assert resolved(manifest, "https://example.org/relocated/assets/brand/site.webmanifest")["id"] == "https://example.org/identities/iina"
    assert check_receipt(Path(installed["receipt"]))["status"] == "passed"
    undo_receipt(Path(installed["receipt"]))
    assert not (project / "assets/brand/site.webmanifest").exists()


def test_configure_site_cli_uses_explicit_identity_and_output(kit, tmp_path):
    output = tmp_path / "configured"
    result = subprocess.run([sys.executable, str(kit / "scripts/configure_site.py"),
        "--site-url", "https://example.org/other/", "--app-id", "/ids/my-iina", "--social", "opengraph",
        "--output-dir", str(output)], capture_output=True, text=True, check=True)
    assert json.loads(result.stdout)["app_id"] == "/ids/my-iina"
    assert read_json(output / "site.webmanifest")["id"] == "/ids/my-iina"
    assert 'content="1200"' in (output / "website-head.html").read_text()


def test_shipped_defaults_match_generator_bytes(kit):
    deployment = read_json(kit / 'source/deployment.json')
    rendered = render_site(kit, deployment['project_url'], "opengraph")
    assert deployment['social_image'] == 'assets/brand/open-graph-1200x630.png'
    assert (kit / 'assets/brand/site.webmanifest').read_bytes() == rendered['site.webmanifest']
    assert (kit / 'integration/website-head.html').read_bytes() == rendered['website-head.html']
    assert rendered['website-head.html'].endswith(b'\n')
    assert b'open-graph-1200x630.png' in rendered['website-head.html']
    assert b'content="1200"' in rendered['website-head.html']
    assert b'content="630"' in rendered['website-head.html']
    github = render_site(kit, deployment['project_url'], "github")
    assert b'github-social-preview-1280x640.png' in github['website-head.html']
    assert b'content="1280"' in github['website-head.html']
    assert b'content="640"' in github['website-head.html']
    demo = (kit / 'integration/demo/index.html').read_text()
    assert 'open-graph-1200x630.png' in demo
    assert 'content="1200"' in demo and 'content="630"' in demo
    assert 'github-social-preview-1280x640.png' not in demo
