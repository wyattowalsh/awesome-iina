from __future__ import annotations

import json
import socket
from pathlib import Path

from awesome_iina.repo import links


def load_module():
    return links


def test_validate_public_url_accepts_public_https(monkeypatch) -> None:
    module = load_module()
    monkeypatch.setattr(
        module.socket,
        "getaddrinfo",
        lambda *args, **kwargs: [
            (socket.AF_INET, socket.SOCK_STREAM, 6, "", ("140.82.112.3", 443))
        ],
    )

    module.validate_public_url("https://github.com/example/project")


def test_validate_public_url_rejects_credentials_and_private_addresses(monkeypatch) -> None:
    module = load_module()
    monkeypatch.setattr(
        module.socket,
        "getaddrinfo",
        lambda *args, **kwargs: [(socket.AF_INET, socket.SOCK_STREAM, 6, "", ("127.0.0.1", 443))],
    )

    for url in (
        "https://user:secret@example.com/",
        "https://example.com/",
        "file:///etc/passwd",
        "http://localhost/admin",
    ):
        try:
            module.validate_public_url(url)
        except module.UnsafeURL:
            pass
        else:
            raise AssertionError(f"expected URL to be rejected: {url}")


def test_check_classifies_unsafe_url_as_broken() -> None:
    module = load_module()

    result = module.check("file:///etc/passwd", timeout=1, retries=0)

    assert result.classification == "broken"
    assert result.attempts == 0


def test_project_urls_collects_repo_url_and_sources(tmp_path: Path) -> None:
    catalog = tmp_path / "catalog.yaml"
    catalog.write_text(
        """
projects:
  - slug: alpha
    repo: example/alpha
  - slug: beta
    url: https://example.com/beta
    sources:
      - kind: homepage
        url: https://example.com/beta/docs
""".strip()
        + "\n",
        encoding="utf-8",
    )
    urls = links.project_urls(catalog)
    assert urls == [
        "https://example.com/beta",
        "https://example.com/beta/docs",
        "https://github.com/example/alpha",
    ]


def test_classification_and_sockaddr_host() -> None:
    assert links._classification(200) == "ok"
    assert links._classification(404) == "broken"
    assert links._classification(418) == "warning"
    assert links._classification(None) == "warning"
    assert links._sockaddr_host(("140.82.112.3", 443)) == "140.82.112.3"
    assert links._sockaddr_host((3232235777, 443)) == "3232235777"


def test_check_ok_and_run_link_check(tmp_path: Path, monkeypatch) -> None:
    module = load_module()
    monkeypatch.setattr(
        module.socket,
        "getaddrinfo",
        lambda *args, **kwargs: [
            (socket.AF_INET, socket.SOCK_STREAM, 6, "", ("140.82.112.3", 443))
        ],
    )

    class Response:
        status = 200

        def geturl(self) -> str:
            return "https://example.com/"

        def __enter__(self):
            return self

        def __exit__(self, *args) -> None:
            return None

    class Opener:
        def open(self, request, timeout=0):
            return Response()

    monkeypatch.setattr(module.urllib.request, "build_opener", lambda *args, **kwargs: Opener())
    result = module.check("https://example.com/", timeout=1, retries=0)
    assert result.classification == "ok"

    catalog = tmp_path / "catalog.yaml"
    catalog.write_text("projects:\n- slug: a\n  repo: example/a\n", encoding="utf-8")
    monkeypatch.setattr(
        module,
        "check",
        lambda url, timeout, retries: module.Result(url, url, 200, "ok", None, 1),
    )
    output = tmp_path / "links.json"
    assert module.run_link_check(catalog, workers=1, timeout=1, retries=0, json_output=output) == 0
    payload = json.loads(output.read_text(encoding="utf-8"))
    assert payload[0]["url"] == "https://github.com/example/a"


def test_run_link_check_strict_warnings(tmp_path: Path, monkeypatch) -> None:
    module = load_module()
    catalog = tmp_path / "catalog.yaml"
    catalog.write_text("projects:\n- slug: a\n  url: https://example.com/a\n", encoding="utf-8")
    monkeypatch.setattr(
        module,
        "check",
        lambda url, timeout, retries: module.Result(url, None, None, "warning", "timeout", 2),
    )
    assert module.run_link_check(catalog, workers=1, timeout=1, retries=0, strict=True) == 1
    monkeypatch.setattr(
        module,
        "check",
        lambda url, timeout, retries: module.Result(url, None, 404, "broken", "missing", 1),
    )
    assert module.run_link_check(catalog, workers=1, timeout=1, retries=0) == 1


def test_run_link_check_rejects_invalid_worker_counts(tmp_path: Path) -> None:
    catalog = tmp_path / "catalog.yaml"
    catalog.write_text("projects: []\n", encoding="utf-8")
    try:
        links.run_link_check(catalog, workers=0)
    except ValueError as error:
        assert "positive" in str(error)
    else:
        raise AssertionError("expected invalid worker count to fail")
