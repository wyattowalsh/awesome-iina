from __future__ import annotations

import base64
import json
import subprocess
from datetime import UTC, datetime, timedelta
from pathlib import Path
from types import SimpleNamespace
from typing import Any

import pytest
from tests.helpers.github_fakes import StubClient, github_config

from awesome_iina.discovery.settings import GithubConfig
from awesome_iina.github import GhClient, GhError


def config() -> GithubConfig:
    return github_config()


def test_ensure_ready_and_graphql() -> None:
    client = StubClient(
        [
            "gh version",
            "logged in",
            {"data": {"rateLimit": {"remaining": 100, "resetAt": "2026-01-01T00:00:00Z"}}},
        ]
    )
    client.ensure_ready()
    result = client.graphql("query Test { viewer { login } }")
    assert "data" in result
    assert client.calls[2][0][:2] == ["api", "graphql"]
    assert json.loads(client.calls[2][1] or "{}")["query"].startswith("query")


def test_graphql_errors_raise() -> None:
    client = StubClient([{"errors": [{"message": "bad"}]}])
    with pytest.raises(GhError, match="returned errors"):
        client.graphql("query Bad { viewer { login } }")


def test_rest_builds_headers_and_params() -> None:
    client = StubClient([{"ok": True}])
    result = client.rest("test", params={"page": 2, "enabled": True})
    assert result == {"ok": True}
    args = client.calls[0][0]
    assert "X-GitHub-Api-Version: 2026-03-10" in args
    assert "page=2" in args
    assert "enabled=true" in args


def test_search_methods_validate_shapes() -> None:
    client = StubClient(
        [
            {"data": {"search": {"repositoryCount": 0, "nodes": [], "pageInfo": {}}}},
            {"total_count": 0, "items": []},
        ]
    )
    assert client.search_repositories_page("topic:iina") == {
        "repositoryCount": 0,
        "nodes": [],
        "pageInfo": {},
    }
    assert client.search_code_page("ghRepo", page=1)["total_count"] == 0


def test_get_content_decodes_base64() -> None:
    encoded = base64.b64encode(b'{"name":"Example"}').decode()
    client = StubClient([{"type": "file", "content": encoded}])
    assert client.get_content("owner/repo", "Info.json") == b'{"name":"Example"}'


def test_get_content_returns_none_for_not_found() -> None:
    client = StubClient([GhError("404 not found")])
    assert client.get_content("owner/repo", "missing") is None


def test_get_content_propagates_other_errors() -> None:
    client = StubClient([GhError("500 error")])
    with pytest.raises(GhError):
        client.get_content("owner/repo", "missing")


def test_enrich_repositories_batches() -> None:
    node = json.loads(Path("tests/fixtures/repository-node.json").read_text())
    client = StubClient([{"data": {"repo0": node, "rateLimit": {"remaining": 100}}}])
    result, warnings = client.enrich_repositories(["example/iina-plugin-example"])
    assert result["example/iina-plugin-example"].license_spdx == "MIT"
    assert warnings == []


def test_run_retries_retryable_failure(monkeypatch: pytest.MonkeyPatch) -> None:
    calls = 0

    def fake_run(*args: Any, **kwargs: Any) -> SimpleNamespace:
        nonlocal calls
        del args, kwargs
        calls += 1
        if calls == 1:
            return SimpleNamespace(returncode=1, stdout="", stderr="503 temporary failure")
        return SimpleNamespace(returncode=0, stdout='{"ok": true}', stderr="")

    monkeypatch.setattr(subprocess, "run", fake_run)
    monkeypatch.setattr("awesome_iina.github.time.sleep", lambda _: None)
    client = GhClient(config())
    assert client._run(["api", "test"]) == {"ok": True}
    assert calls == 2


def test_run_rejects_invalid_json(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(
        subprocess,
        "run",
        lambda *args, **kwargs: SimpleNamespace(returncode=0, stdout="not json", stderr=""),
    )
    with pytest.raises(GhError, match="invalid JSON"):
        GhClient(config())._run(["api", "test"])


def test_run_nonretryable_failure(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(
        subprocess,
        "run",
        lambda *args, **kwargs: SimpleNamespace(returncode=1, stdout="", stderr="bad request"),
    )
    with pytest.raises(GhError, match="exit code 1"):
        GhClient(config())._run(["api", "test"])


def test_low_graphql_budget_sleeps(monkeypatch: pytest.MonkeyPatch) -> None:
    sleeps: list[float] = []
    monkeypatch.setattr("awesome_iina.github.time.sleep", sleeps.append)
    reset = (datetime.now(UTC) + timedelta(seconds=1)).isoformat().replace("+00:00", "Z")
    GhClient._respect_graphql_rate_limit(
        {"data": {"rateLimit": {"remaining": 10, "resetAt": reset}}}
    )
    assert sleeps and sleeps[0] >= 1


def test_retryable_classifier() -> None:
    assert GhClient._is_retryable("secondary rate limit") is True
    assert GhClient._is_retryable("validation failed") is False


def test_enrich_repositories_records_batch_failure() -> None:
    client = StubClient([GhError("503 temporary failure")])
    result, warnings = client.enrich_repositories(["example/plugin"])
    assert result == {}
    assert warnings and "batch 1" in warnings[0]
