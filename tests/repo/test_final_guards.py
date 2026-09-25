"""Regression tests for the final discovery, identity and release-safety audit."""

from __future__ import annotations

import base64
import hashlib
import json
import subprocess
import zipfile
from pathlib import Path
from types import SimpleNamespace

import pytest
from tests.helpers.archive import create_minimal_source_tree, load_archive_module
from tests.helpers.discovery_fakes import FakeClient, config, node
from tests.helpers.github_fakes import StubClient
from tests.helpers.paths import REPO_ROOT
from typer.testing import CliRunner

from awesome_iina.cli import app
from awesome_iina.discovery import (
    _candidate_for,
    discover_code_query,
    discover_repository_query,
    enrich_candidates,
    run_discovery,
)
from awesome_iina.discovery.settings import GithubConfig
from awesome_iina.github import GhClient, GhError, repository_snapshot_from_graphql
from awesome_iina.models import Candidate, CandidateDecision, RepositorySnapshot
from awesome_iina.site import build_site, site_payloads
from awesome_iina.site.brand import (
    BrandError,
    brand_payloads,
    confined_path,
    sync_brand,
    validate_svg,
)


def test_rest_backend_normalizes_only_observed_fields() -> None:
    client = StubClient(
        [
            {
                "total_count": 2,
                "items": [
                    {
                        "node_id": "R_a",
                        "full_name": "a/iina",
                        "html_url": "https://github.com/a/iina",
                        "stargazers_count": 9,
                        "private": False,
                        "license": None,
                    }
                ],
                "incomplete_results": False,
            }
        ]
    )
    client.config.repository_backend = "rest"
    page = client.search_repositories_page("topic:iina", page_size=1)
    snapshot = repository_snapshot_from_graphql(page["nodes"][0])
    assert snapshot.stars == 9
    assert "license_spdx" in snapshot.model_fields_set
    assert "description" not in snapshot.model_fields_set
    assert page["pageInfo"]["endCursor"] == "2"
    assert client.calls[0][0][1] == "search/repositories"


def test_partial_observation_does_not_erase_metadata() -> None:
    candidates = {}
    original = RepositorySnapshot(
        name_with_owner="a/iina",
        url="https://github.com/a/iina",
        node_id="R_a",
        stars=42,
        license_spdx="MIT",
        topics=["iina"],
    )
    _candidate_for(candidates, "a/iina", snapshot=original)
    partial = RepositorySnapshot(name_with_owner="a/iina", url="https://github.com/a/iina")
    result = _candidate_for(candidates, "a/iina", snapshot=partial)
    assert (result.repository.stars, result.repository.license_spdx) == (42, "MIT")
    assert result.repository.topics == ["iina"]
    cleared = RepositorySnapshot(
        name_with_owner="a/iina", url="https://github.com/a/iina", license_spdx=None
    )
    assert _candidate_for(candidates, "a/iina", snapshot=cleared).repository.license_spdx is None


def test_rename_uses_node_identity_and_preserves_evidence() -> None:
    candidates = {}
    first = _candidate_for(
        candidates,
        "a/old",
        snapshot=RepositorySnapshot(
            name_with_owner="a/old", url="https://github.com/a/old", node_id="R_a", stars=40
        ),
    )
    result = _candidate_for(
        candidates,
        "b/new",
        snapshot=RepositorySnapshot(
            name_with_owner="b/new", url="https://github.com/b/new", node_id="R_a"
        ),
    )
    assert first is result
    assert set(candidates) == {"b/new"}
    assert result.repository.aliases == ["a/old"]
    assert result.repository.stars == 40


def test_repository_repeated_page_is_incomplete(tmp_path: Path) -> None:
    class Repeating(FakeClient):
        def search_repositories_page(self, query, *, cursor=None, page_size=None):
            return {
                "repositoryCount": 2,
                "nodes": [node("a/iina")],
                "pageInfo": {"hasNextPage": True, "endCursor": "same"},
            }

    candidates = {}
    cfg = config(tmp_path)
    outcomes = discover_repository_query(Repeating(), cfg.repository_queries[0], cfg, candidates)
    assert not outcomes[0].complete
    assert outcomes[0].returned_count == 1
    assert len(candidates) == 1


def test_repository_failure_preserves_first_page(tmp_path: Path) -> None:
    class Interrupted(FakeClient):
        def search_repositories_page(self, query, *, cursor=None, page_size=None):
            if cursor:
                raise GhError("network interrupted")
            return super().search_repositories_page(query, cursor=cursor, page_size=page_size)

    candidates = {}
    cfg = config(tmp_path)
    outcomes = discover_repository_query(Interrupted(), cfg.repository_queries[0], cfg, candidates)
    assert outcomes[0].returned_count == 1
    assert not outcomes[0].complete
    assert "example/first" in candidates


def test_code_repeated_file_is_not_counted_twice(tmp_path: Path) -> None:
    class Repeating(FakeClient):
        def search_code_page(self, query, *, page, per_page=None):
            result = super().search_code_page(query, page=1)
            result["total_count"] = 2
            return result

    candidates = {}
    result = discover_code_query(Repeating(), config(tmp_path).code_queries[0], candidates)
    assert result.returned_count == 1
    assert not result.complete


def test_private_repository_search_does_not_export_metadata(tmp_path: Path) -> None:
    class Private(FakeClient):
        def search_repositories_page(self, query, *, cursor=None, page_size=None):
            return {
                "repositoryCount": 1,
                "nodes": [{**node("secret/iina"), "isPrivate": True}],
                "pageInfo": {"hasNextPage": False},
            }

    candidates = {}
    cfg = config(tmp_path)
    result = discover_repository_query(Private(), cfg.repository_queries[0], cfg, candidates)
    assert candidates == {}
    assert not result[0].complete


def test_private_enrichment_removes_prior_candidate() -> None:
    class Private(FakeClient):
        def enrich_repositories(self, repositories):
            return {
                "secret/iina": RepositorySnapshot(
                    name_with_owner="secret/iina",
                    url="https://github.com/secret/iina",
                    private=True,
                )
            }, []

    candidates = {
        "secret/iina": Candidate(
            repository=RepositorySnapshot(
                name_with_owner="secret/iina", url="https://github.com/secret/iina"
            )
        )
    }
    warnings = enrich_candidates(Private(), candidates)
    assert candidates == {}
    assert warnings


def test_checkpoint_skips_complete_queries_and_rejects_changed_config(tmp_path: Path) -> None:
    cfg = config(tmp_path)
    config_path = tmp_path / "config.yaml"
    config_path.write_text("config fixture\n")
    checkpoint = tmp_path / "checkpoint.json"
    first = FakeClient()
    run = run_discovery(
        config_path=config_path, config=cfg, client=first, mode="quick", checkpoint=checkpoint
    )
    assert run.complete
    assert all(c.decision != CandidateDecision.ACCEPT for c in run.candidates)
    second = FakeClient()
    again = run_discovery(
        config_path=config_path,
        config=cfg,
        client=second,
        mode="quick",
        checkpoint=checkpoint,
        resume=True,
    )
    assert again.complete
    assert second.repository_calls == [] and second.code_calls == []
    cfg.github.deep_candidate_limit += 1
    with pytest.raises(ValueError, match="does not match"):
        run_discovery(
            config_path=config_path,
            config=cfg,
            client=FakeClient(),
            mode="quick",
            checkpoint=checkpoint,
            resume=True,
        )


def test_run_timeout_is_bounded(monkeypatch: pytest.MonkeyPatch) -> None:
    seen = []

    def timeout(*args, **kwargs):
        seen.append(kwargs["timeout"])
        raise subprocess.TimeoutExpired("gh", kwargs["timeout"])

    monkeypatch.setattr(subprocess, "run", timeout)
    monkeypatch.setattr("awesome_iina.github.time.sleep", lambda _: None)
    client = GhClient(GithubConfig(max_retries=1, initial_backoff_seconds=0))
    with pytest.raises(GhError, match="timeout"):
        client._run(["api", "test"])
    assert seen == [45, 45]
    assert client.request_count == 2


def test_request_budget_is_checked_before_api_execution(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(
        subprocess, "run", lambda *a, **k: SimpleNamespace(returncode=0, stdout="{}", stderr="")
    )
    client = GhClient(GithubConfig(max_requests=1))
    client._run(["api", "test"])
    with pytest.raises(GhError, match="request budget"):
        client._run(["api", "test"])


def test_wait_budget_prevents_sleep(monkeypatch: pytest.MonkeyPatch) -> None:
    calls = []
    monkeypatch.setattr("awesome_iina.github.time.sleep", calls.append)
    client = GhClient(GithubConfig(max_total_wait_seconds=1))
    with pytest.raises(GhError, match="wait budget"):
        client._wait(2)
    assert not calls


@pytest.mark.parametrize(
    "path", ["/etc/passwd", "../Info.json", "nested/../../Info.json", "a\\b", "a\n"]
)
def test_content_path_confinement(path: str) -> None:
    with pytest.raises(GhError, match="path"):
        StubClient([]).get_content("a/iina", path)


@pytest.mark.parametrize("endpoint", ["https://evil.example", "/repos/a/b", "-i", "repos/a/b?x=y"])
def test_no_absolute_or_flag_rest_endpoint(endpoint: str) -> None:
    with pytest.raises(GhError):
        StubClient([]).rest(endpoint)


def test_git_blob_hash_and_missing_payload() -> None:
    content = b"{}\n"
    sha = hashlib.sha1(b"blob 3\0" + content, usedforsecurity=False).hexdigest()
    response = {"type": "file", "content": base64.b64encode(content).decode(), "sha": sha}
    assert StubClient([response]).get_content("a/b", "Info.json") == content
    with pytest.raises(GhError, match="hash mismatch"):
        StubClient([{**response, "sha": "0" * 40}]).get_content("a/b", "Info.json")
    with pytest.raises(GhError, match="Missing content"):
        StubClient([{"type": "file"}]).get_content("a/b", "Info.json")


def test_content_size_and_base64_limits() -> None:
    client = StubClient([{"type": "file", "content": base64.b64encode(b"abc").decode()}])
    client.config.max_content_bytes = 2
    with pytest.raises(GhError, match="byte limit"):
        client.get_content("a/b", "Info.json")
    with pytest.raises(GhError, match="base64"):
        StubClient([{"type": "file", "content": "***"}]).get_content("a/b", "Info.json")


def test_archive_failure_preserves_previous_destination(tmp_path: Path, monkeypatch) -> None:
    module = load_archive_module()
    root = tmp_path / "repo"
    root.mkdir()
    create_minimal_source_tree(root)
    output = tmp_path / "good.zip"
    output.write_bytes(b"previous valid artifact")

    def reject(*_):
        raise RuntimeError("injected verification failure")

    monkeypatch.setattr(module, "verify_archive", reject)
    with pytest.raises(RuntimeError, match="injected"):
        module.create_archive(root, output, "awesome-iina")
    assert output.read_bytes() == b"previous valid artifact"
    assert not list(tmp_path.glob(".archive-*.zip"))


def test_archive_is_deterministic_and_manifest_is_exact(tmp_path: Path) -> None:
    module = load_archive_module()
    root = tmp_path / "repo"
    root.mkdir()
    create_minimal_source_tree(root)
    first, second = tmp_path / "a.zip", tmp_path / "b.zip"
    module.create_archive(root, first, "awesome-iina")
    module.create_archive(root, second, "awesome-iina")
    assert first.read_bytes() == second.read_bytes()
    with zipfile.ZipFile(first) as archive:
        inventory = json.loads(archive.read("awesome-iina/SOURCE-MANIFEST.json"))["files"]
        assert len(archive.namelist()) == len(inventory) + 1
        for name, record in inventory.items():
            assert (
                hashlib.sha256(archive.read("awesome-iina/" + name)).hexdigest() == record["sha256"]
            )


def test_archive_tamper_is_detected(tmp_path: Path) -> None:
    module = load_archive_module()
    root = tmp_path / "repo"
    root.mkdir()
    create_minimal_source_tree(root)
    source, changed = tmp_path / "good.zip", tmp_path / "bad.zip"
    module.create_archive(root, source, "awesome-iina")
    with zipfile.ZipFile(source) as original, zipfile.ZipFile(changed, "w") as archive:
        for item in original.infolist():
            data = original.read(item.filename)
            if item.filename.endswith("/src/awesome_iina/cli.py"):
                data += b"tampered"
            archive.writestr(item, data)
    with pytest.raises(RuntimeError):
        module.verify_archive(changed, "awesome-iina")


@pytest.mark.parametrize("relative", ["../x", "/x", "a\\b", "x\n"])
def test_brand_paths_are_confined(tmp_path: Path, relative: str) -> None:
    with pytest.raises(BrandError):
        confined_path(tmp_path, relative)


def test_brand_refuses_symlink(tmp_path: Path) -> None:
    (tmp_path / "link").symlink_to(tmp_path / "outside")
    with pytest.raises(BrandError, match="symlink"):
        confined_path(tmp_path, "link/image.svg")


@pytest.mark.parametrize(
    "svg",
    [
        b"<svg><script>alert(1)</script></svg>",
        b'<svg onload="bad()"/>',
        b'<svg><image href="https://evil.example/x.png"/></svg>',
        b'<!DOCTYPE svg [<!ENTITY x SYSTEM "file:///etc/passwd">]><svg/>',
        b'<svg><image href="data:image/svg+xml;base64,PHN2Zy8+"/></svg>',
    ],
)
def test_active_svg_is_rejected(svg: bytes) -> None:
    with pytest.raises(BrandError):
        validate_svg(svg, "bad.svg")


def test_supplied_kit_and_primary_deployment_match() -> None:
    assert sync_brand(Path(), check=True) == []
    files = brand_payloads(Path())
    assert len(files) == 36  # 35 primary plus generated CSS.
    assert not any("readme-hero" in name for name in files)
    assert not any(Path(name).suffix in {".woff", ".ttf", ".otf"} for name in files)
    assert not any(name.startswith("starter/") for name in files)
    assert "assets/brand/tokens.css" in files


def test_site_is_deterministic_and_json_is_not_double_encoded() -> None:
    first = site_payloads(Path())
    assert first == site_payloads(Path())
    assert isinstance(json.loads(first["catalog.json"]), dict)
    html = first["index.html"].decode()
    assert "Not affiliated with the IINA project." in html
    assert "Content-Security-Policy" in html
    assert "<noscript>" in html and 'role="status"' in html
    assert "assets/brand/site.webmanifest" in html
    assert "open-graph-1200x630.png" in html
    assert not any(name.startswith("starter/") for name in first)


def test_site_refuses_source_overwrite(tmp_path: Path) -> None:
    with pytest.raises(ValueError, match="dist"):
        build_site(Path(), tmp_path / "unowned")
    with pytest.raises(ValueError, match="dedicated child"):
        build_site(Path(), Path("dist"))


def test_brand_and_site_cli(tmp_path: Path) -> None:
    runner = CliRunner()
    assert runner.invoke(app, ["brand", "sync", "--check"]).exit_code == 0
    bad = runner.invoke(app, ["site", "build", "--output", str(tmp_path / "unsafe")])
    assert bad.exit_code == 1


def test_low_graphql_budget_does_not_discard_successful_page(monkeypatch) -> None:
    from datetime import UTC, datetime, timedelta

    response = {
        "data": {
            "search": {"repositoryCount": 0, "nodes": [], "pageInfo": {"hasNextPage": False}},
            "rateLimit": {
                "remaining": 0,
                "resetAt": (datetime.now(UTC) + timedelta(hours=1)).isoformat(),
            },
        }
    }
    client = StubClient([response])
    client.config.max_total_wait_seconds = 0
    assert client.search_repositories_page("topic:iina")["repositoryCount"] == 0
    with pytest.raises(GhError, match="wait budget"):
        client.search_repositories_page("topic:iina")


def test_404_in_repository_path_does_not_mask_permission_error() -> None:
    with pytest.raises(GhError, match="403"):
        StubClient([GhError("403 denied for repos/a/404/contents/Info.json")]).get_content(
            "a/404", "Info.json"
        )


def test_rest_enrichment_preserves_rename_and_unknown_issue_count() -> None:
    client = StubClient(
        [
            {
                "node_id": "R_a",
                "full_name": "a/new",
                "html_url": "https://github.com/a/new",
                "open_issues_count": 12,
                "language": "TypeScript",
                "topics": ["iina"],
                "subscribers_count": 2,
                "parent": {"full_name": "b/base"},
            }
        ]
    )
    client.config.repository_backend = "rest"
    enriched, warnings = client.enrich_repositories(["a/old"])
    assert not warnings
    result = enriched["a/new"]
    assert result.aliases == ["a/old"]
    assert "open_issues" not in result.model_fields_set
    assert result.watchers == 2
    assert result.parent == "b/base"


def test_rest_enrichment_failure_is_recorded() -> None:
    client = StubClient([GhError("403 forbidden")])
    client.config.repository_backend = "rest"
    enriched, warnings = client.enrich_repositories(["a/old"])
    assert not enriched and warnings


@pytest.mark.parametrize("cursor", ["-1", "0", "not-a-page"])
def test_invalid_rest_cursor(cursor: str) -> None:
    client = StubClient([])
    client.config.repository_backend = "rest"
    with pytest.raises(GhError):
        client.search_repositories_page("iina", cursor=cursor)


def test_code_incomplete_flag_is_honored_even_when_counts_match(tmp_path: Path) -> None:
    class Incomplete(FakeClient):
        def search_code_page(self, query, *, page, per_page=None):
            result = super().search_code_page(query, page=page)
            result["incomplete_results"] = True
            return result

    result = discover_code_query(Incomplete(), config(tmp_path).code_queries[0], {})
    assert result.returned_count == result.total_count == 1
    assert not result.complete


def test_manifest_request_failure_is_recorded_without_aborting() -> None:
    from awesome_iina.discovery import inspect_manifest

    class Broken(FakeClient):
        def get_content(self, *args, **kwargs):
            raise GhError("temporary manifest failure")

    candidate = Candidate(
        repository=RepositorySnapshot(name_with_owner="a/iina", url="https://github.com/a/iina")
    )
    inspect_manifest(Broken(), candidate)
    assert candidate.manifest is None
    assert candidate.manifest_errors


def test_discovery_cannot_assert_exhaustiveness() -> None:
    from datetime import UTC, datetime

    from pydantic import ValidationError

    from awesome_iina.models import DiscoveryRun

    with pytest.raises(ValidationError):
        DiscoveryRun.model_validate(
            {
                "started_at": datetime.now(UTC),
                "finished_at": datetime.now(UTC),
                "config_sha256": "0" * 64,
                "mode": "quick",
                "exhaustive": True,
            }
        )


@pytest.mark.parametrize("name", [".env", "id_rsa", "signing.pem"])
def test_possible_secrets_block_packaging(tmp_path: Path, name: str) -> None:
    module = load_archive_module()
    root = tmp_path / "repo"
    root.mkdir()
    create_minimal_source_tree(root)
    (root / name).write_text("sensitive test fixture")
    with pytest.raises(RuntimeError, match="secret"):
        module.create_archive(root, tmp_path / "safe.zip", "awesome-iina")


def test_source_symlink_blocks_packaging(tmp_path: Path) -> None:
    module = load_archive_module()
    root = tmp_path / "repo"
    root.mkdir()
    create_minimal_source_tree(root)
    (root / "source-link").symlink_to(root / "README.md")
    with pytest.raises(RuntimeError, match="symlink"):
        module.create_archive(root, tmp_path / "safe.zip", "awesome-iina")


def test_brand_check_is_read_only_and_does_not_write_a_shipping_tree(
    tmp_path: Path, monkeypatch
) -> None:
    import awesome_iina.site.brand as brand

    expected = {"assets/brand/example.svg": b"<svg/>"}
    monkeypatch.setattr(brand, "brand_payloads", lambda _: expected)
    assert brand.sync_brand(tmp_path, check=True) == []
    assert not (tmp_path / "brand").exists()
    assert brand.sync_brand(tmp_path) == []
    assert not (tmp_path / "brand").exists()


def test_site_writer_confines_outputs_and_preserves_unknown_files(
    tmp_path: Path, monkeypatch
) -> None:
    import awesome_iina.site as site

    monkeypatch.setattr(site, "site_payloads", lambda _: {"index.html": b"<html/>"})
    output = tmp_path / "dist/site"
    output.mkdir(parents=True)
    (output / "CNAME").write_text("catalog.example")
    assert site.build_site(tmp_path, output) == 1
    assert (output / "CNAME").read_text() == "catalog.example"
    assert (output / "index.html").read_bytes() == b"<html/>"


def test_site_autoescapes_untrusted_descriptions(monkeypatch) -> None:
    import awesome_iina.site as site
    from awesome_iina.catalog import load_catalog

    catalog = load_catalog(Path("src/awesome_iina/catalog/catalog.yaml"))
    catalog.projects[0].description = '<script>alert("x")</script> is inert text.'
    monkeypatch.setattr(site, "load_catalog", lambda _: catalog)
    result = site.site_payloads(Path())["index.html"].decode()
    assert "<script>alert" not in result
    assert "&lt;script&gt;alert" in result


def test_frozen_raw_index_matches_its_own_recorded_provenance() -> None:
    raw = Path("src/awesome_iina/discovery/snapshots/iina-plugins.raw.json").read_bytes()
    record = json.loads(Path("src/awesome_iina/repo/upstream-review.json").read_text())[
        "plugin_index"
    ]
    assert (
        hashlib.sha1(
            b"blob " + str(len(raw)).encode() + b"\0" + raw, usedforsecurity=False
        ).hexdigest()
        == record["git_blob_sha"]
    )
    assert hashlib.sha256(raw).hexdigest() == record["sha256"]
    assert len(json.loads(raw)) == record["entry_count"]
    # The active snapshot may legitimately advance after a later source refresh.


def test_configured_url_source_response_is_bounded(monkeypatch) -> None:
    from awesome_iina.discovery.settings import SourceConfig
    from awesome_iina.discovery.sources import SourceSyncError, fetch_source

    class Response:
        def __enter__(self):
            return self

        def __exit__(self, *_):
            return None

        def read(self, size):
            assert size == 1_000_001
            return b"x" * size

    monkeypatch.setattr(
        "awesome_iina.discovery.sources.urllib.request.urlopen",
        lambda *a, **k: Response(),
    )
    with pytest.raises(SourceSyncError, match="byte limit"):
        fetch_source(SourceConfig(id="large", kind="text-url", url="https://example.test"), None)


def test_standalone_starter_archive_preserves_previous_file_on_failure(
    tmp_path, monkeypatch
) -> None:
    import importlib.util

    root = REPO_ROOT
    spec = importlib.util.spec_from_file_location(
        "standalone_bundle_guard", root / "starter/tools/bundle.py"
    )
    assert spec is not None and spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    fixture = tmp_path / "starter"
    for name in (
        "copier.yml",
        "README.md",
        "template/package.json.jinja",
        "tests/test_real_copier.py",
        ".github/workflows/ci.yml",
    ):
        path = fixture / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text("test fixture")
    destination = tmp_path / "previous.zip"
    destination.write_bytes(b"previous verified release")

    def fail(*_):
        raise ValueError("injected bundle verification failure")

    monkeypatch.setattr(module, "verify_bundle", fail)
    with pytest.raises(ValueError, match="injected"):
        module.bundle(destination, fixture)
    assert destination.read_bytes() == b"previous verified release"
    assert not list(tmp_path.glob(".starter-*.zip"))


@pytest.mark.parametrize(
    ("workflow_name", "timezone", "mode_fragment"),
    [
        ("discovery-nightly.yml", "America/New_York", "--mode quick --backend rest"),
        ("discovery-deep.yml", "America/New_York", "--mode full --backend rest"),
    ],
)
def test_scheduled_discovery_is_read_only_and_preserves_failure_evidence(
    workflow_name: str,
    timezone: str,
    mode_fragment: str,
) -> None:
    import yaml

    root = REPO_ROOT
    workflow = yaml.load(
        (root / ".github/workflows" / workflow_name).read_text(),
        Loader=yaml.BaseLoader,  # noqa: S506
    )
    assert workflow["permissions"] == {"contents": "read"}
    assert workflow["on"]["schedule"][0]["timezone"] == timezone
    steps = workflow["jobs"]["discover"]["steps"]
    uploader = next(
        step for step in steps if str(step.get("uses", "")).startswith("actions/upload-artifact@")
    )
    assert uploader["if"] == "always()"
    shell = "\n".join(step.get("run", "") for step in steps)
    assert "--strict" in shell and "--checkpoint" in shell
    assert mode_fragment in shell
    assert "git push" not in shell and "gh pr create" not in shell
    assert any(str(step.get("uses", "")).startswith("actions/cache/restore@") for step in steps)
    assert any(str(step.get("uses", "")).startswith("actions/cache/save@") for step in steps)
    cache_save = next(
        step for step in steps if str(step.get("uses", "")).startswith("actions/cache/save@")
    )
    assert "steps.sources.outcome == 'success'" in cache_save["if"]
    assert "source-changes.patch" in shell
    assert "discovery-config.yaml" in shell


def test_deep_discovery_reconciles_rest_and_graphql_without_promotion() -> None:
    import yaml

    root = REPO_ROOT
    workflow = yaml.load(
        (root / ".github/workflows/discovery-deep.yml").read_text(),
        Loader=yaml.BaseLoader,  # noqa: S506
    )
    shell = "\n".join(step.get("run", "") for step in workflow["jobs"]["discover"]["steps"])
    assert "--backend rest" in shell
    assert "--backend graphql" in shell
    assert "merge-discovery" in shell
    assert "catalog.yaml" not in shell


@pytest.mark.parametrize("name", [".env.local", ".env.production", ".env.test"])
def test_archive_rejects_environment_secret_variants(tmp_path, name) -> None:
    module = load_archive_module()
    (tmp_path / name).write_text("TOKEN=not-for-publication")
    with pytest.raises(RuntimeError, match="secret"):
        module.collect_files(tmp_path, tmp_path / "out.zip")


def test_absent_maintenance_evidence_does_not_imply_active_status() -> None:
    from awesome_iina.models import CatalogProject, ProjectStatus

    project = CatalogProject(
        slug="unknown",
        name="Unknown plugin",
        repo="example/unknown",
        description="A fixture with no maintenance evidence.",
        category="playback",
        kind="plugin",
    )
    assert project.status is ProjectStatus.UNKNOWN


def test_citation_version_matches_package_version() -> None:
    import tomllib

    import yaml

    root = REPO_ROOT
    version = tomllib.loads((root / "pyproject.toml").read_text())["project"]["version"]
    assert yaml.safe_load((root / "CITATION.cff").read_text())["version"] == version
