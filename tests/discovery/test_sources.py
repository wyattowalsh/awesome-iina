from __future__ import annotations

from pathlib import Path
from typing import Any

import pytest

from awesome_iina.discovery.settings import DiscoveryConfig, SourceConfig
from awesome_iina.discovery.sources import (
    SourceSyncError,
    destination_for,
    fetch_source,
    load_official_plugins,
    load_source_snapshot,
    parse_source_content,
    source_url,
    sync_sources,
    try_load_official_plugins,
)
from awesome_iina.models import SourceSnapshot


class SourceClient:
    def get_content(self, repository: str, path: str, *, ref: str | None = None) -> bytes | None:
        assert repository == "iina/iina"
        assert path == "plugins.json"
        assert ref == "develop"
        return b'[{"name":"X","url":"https://github.com/x/y","desc":"Plugin.","id":"x.y"}]'


def test_official_source_snapshot() -> None:
    path = Path("src/awesome_iina/discovery/snapshots/iina-plugins.json")
    snapshot = load_source_snapshot(path)
    plugins = load_official_plugins(path)
    assert snapshot.source_id == "official-iina-plugins"
    assert len(snapshot.sha256) == 64
    assert len(snapshot.content_sha256) == 64
    assert len(plugins) == 26
    assert any(plugin.id == "com.wyattowalsh.iina-plugin-bookmarks" for plugin in plugins)


def test_source_url_variants() -> None:
    assert (
        source_url(
            SourceConfig(
                id="github",
                kind="github-json",
                repository="iina/iina",
                path="plugins.json",
                ref="develop",
            )
        )
        == "https://github.com/iina/iina/blob/develop/plugins.json"
    )
    assert source_url(SourceConfig(id="url", kind="json-url", url="https://example.test/x")) == (
        "https://example.test/x"
    )
    with pytest.raises(SourceSyncError):
        source_url(SourceConfig(id="bad", kind="github-json"))


def test_fetch_github_source() -> None:
    source = SourceConfig(
        id="official",
        kind="github-json",
        repository="iina/iina",
        path="plugins.json",
        ref="develop",
    )
    assert fetch_source(source, SourceClient()).startswith(b"[")
    with pytest.raises(SourceSyncError, match="requires a GitHub client"):
        fetch_source(source, None)


def test_fetch_url_source(monkeypatch: pytest.MonkeyPatch) -> None:
    class Response:
        def __enter__(self) -> Response:
            return self

        def __exit__(self, *args: Any) -> None:
            return None

        def read(self, size: int = -1) -> bytes:
            return b"hello"

    monkeypatch.setattr(
        "awesome_iina.discovery.sources.urllib.request.urlopen",
        lambda *a, **k: Response(),
    )
    source = SourceConfig(id="url", kind="text-url", url="https://example.test")
    assert fetch_source(source, SourceClient()) == b"hello"


def test_parse_source_content_errors() -> None:
    assert parse_source_content(SourceConfig(id="json", kind="json-url"), b'{"a":1}') == {"a": 1}
    assert parse_source_content(SourceConfig(id="text", kind="text-url"), b"hello") == "hello"
    with pytest.raises(SourceSyncError, match="valid JSON"):
        parse_source_content(SourceConfig(id="bad", kind="json-url"), b"{")
    with pytest.raises(SourceSyncError, match="unsupported"):
        parse_source_content(SourceConfig(id="bad", kind="binary"), b"x")


def test_destination_rules(tmp_path: Path) -> None:
    config = DiscoveryConfig.model_validate(
        {
            "repository_queries": [],
            "code_queries": [],
            "paths": {"official_plugins_snapshot": str(tmp_path / "official.json")},
        }
    )
    explicit = SourceConfig(
        id="custom",
        kind="json-url",
        url="https://example.test",
        destination=tmp_path / "custom.json",
    )
    assert destination_for(explicit, config) == tmp_path / "custom.json"
    source = SourceConfig(id="official-iina-plugins", kind="github-json")
    assert destination_for(source, config) == (tmp_path / "official.json")


def test_sync_sources_writes_snapshot(tmp_path: Path) -> None:
    config = DiscoveryConfig.model_validate(
        {
            "repository_queries": [],
            "code_queries": [],
            "sources": [
                {
                    "id": "official-iina-plugins",
                    "kind": "github-json",
                    "repository": "iina/iina",
                    "path": "plugins.json",
                    "ref": "develop",
                    "destination": str(tmp_path / "snapshot.json"),
                }
            ],
        }
    )
    paths = sync_sources(config, SourceClient())
    assert paths == [tmp_path / "snapshot.json"]
    snapshot = SourceSnapshot.model_validate_json(paths[0].read_text())
    assert snapshot.source_id == "official-iina-plugins"
    assert len(snapshot.sha256) == 64
    assert len(snapshot.content_sha256) == 64
    original = paths[0].read_bytes()
    assert sync_sources(config, SourceClient()) == []
    assert paths[0].read_bytes() == original


def test_try_load_missing_snapshot(tmp_path: Path) -> None:
    plugins, warnings = try_load_official_plugins(tmp_path / "missing.json")
    assert plugins == []
    assert warnings
    assert any("official plugin snapshot is missing" in warning for warning in warnings)
