#!/usr/bin/env python3
from __future__ import annotations

import concurrent.futures
import dataclasses
import ipaddress
import json
import socket
import time
import urllib.error
import urllib.parse
import urllib.request
from functools import partial
from http.client import HTTPMessage
from pathlib import Path
from typing import IO, Literal

import yaml

Classification = Literal["ok", "broken", "warning"]
_RETRYABLE_STATUS = {429, 500, 502, 503, 504}
_BROKEN_STATUS = {400, 404, 410, 422}
_ALLOWED_SCHEMES = {"http", "https"}
_MAX_REDIRECTS = 10


class UnsafeURL(ValueError):  # noqa: N818
    """Raised when a link-audit target violates the public-network policy."""


class UnresolvedURL(UnsafeURL):
    """DNS failure leaves reachability unknown, rather than proving a broken URL."""


@dataclasses.dataclass(frozen=True, slots=True)
class Result:
    url: str
    final_url: str | None
    status: int | None
    classification: Classification
    error: str | None
    attempts: int


def project_urls(catalog: Path) -> list[str]:
    data = yaml.safe_load(catalog.read_text(encoding="utf-8")) or {}
    urls: set[str] = set()
    for project in data.get("projects", []):
        if repository := project.get("repo"):
            urls.add(f"https://github.com/{repository}")
        elif url := project.get("url"):
            urls.add(url)
        for source in project.get("sources", []):
            if url := source.get("url"):
                urls.add(url)
    return sorted(urls)


def _classification(status: int | None) -> Classification:
    if status is None:
        return "warning"
    if 200 <= status < 400:
        return "ok"
    if status in _BROKEN_STATUS:
        return "broken"
    return "warning"


def _is_public_address(value: str) -> bool:
    address = ipaddress.ip_address(value.split("%", 1)[0])
    return address.is_global


def validate_public_url(url: str) -> None:
    """Reject credentials, non-HTTP schemes, and non-public destinations."""

    parsed = urllib.parse.urlsplit(url)
    if parsed.scheme.casefold() not in _ALLOWED_SCHEMES:
        raise UnsafeURL(f"unsupported URL scheme: {parsed.scheme or '<missing>'}")
    if parsed.username is not None or parsed.password is not None:
        raise UnsafeURL("credential-bearing URLs are not allowed")
    if parsed.hostname is None:
        raise UnsafeURL("URL has no hostname")
    host = parsed.hostname.casefold().rstrip(".")
    if host in {"localhost", "localhost.localdomain"} or host.endswith(".localhost"):
        raise UnsafeURL("localhost destinations are not allowed")
    try:
        _ = parsed.port
    except ValueError as error:
        raise UnsafeURL(f"invalid port: {error}") from error
    try:
        resolved = socket.getaddrinfo(
            host,
            parsed.port or (443 if parsed.scheme.casefold() == "https" else 80),
            type=socket.SOCK_STREAM,
        )
    except socket.gaierror as error:
        raise UnresolvedURL(f"DNS resolution failed: {error}") from error
    addresses = {_sockaddr_host(result[4]) for result in resolved}
    if not addresses:
        raise UnsafeURL("hostname resolved to no addresses")
    blocked = sorted(address for address in addresses if not _is_public_address(address))
    if blocked:
        raise UnsafeURL("hostname resolves to non-public address(es): " + ", ".join(blocked))


def _sockaddr_host(sockaddr: tuple[object, ...]) -> str:
    host = sockaddr[0]
    return host if isinstance(host, str) else str(host)


class SafeRedirectHandler(urllib.request.HTTPRedirectHandler):
    """Revalidate every redirect target before urllib follows it."""

    max_redirections = _MAX_REDIRECTS

    def redirect_request(
        self,
        req: urllib.request.Request,
        fp: IO[bytes],
        code: int,
        msg: str,
        headers: HTTPMessage,
        newurl: str,
    ) -> urllib.request.Request | None:
        target = urllib.parse.urljoin(req.full_url, newurl)
        validate_public_url(target)
        return super().redirect_request(req, fp, code, msg, headers, target)


def _retry_after(error: urllib.error.HTTPError, fallback: float) -> float:
    value = error.headers.get("Retry-After") if error.headers else None
    if value and value.isdigit():
        return min(float(value), 60.0)
    return fallback


def check(url: str, timeout: float, retries: int) -> Result:
    headers = {
        "Accept": "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
        "User-Agent": "wyattowalsh/awesome-iina link-audit",
    }
    try:
        validate_public_url(url)
    except UnresolvedURL as error:
        return Result(url, None, None, "warning", str(error), 0)
    except UnsafeURL as error:
        return Result(url, None, None, "broken", str(error), 0)

    opener = urllib.request.build_opener(SafeRedirectHandler())
    attempts = 0
    last_status: int | None = None
    last_error: str | None = None
    last_url: str | None = None
    for method in ("HEAD", "GET"):
        for retry in range(retries + 1):
            attempts += 1
            request_headers = dict(headers)
            if method == "GET":
                request_headers["Range"] = "bytes=0-0"
            request = urllib.request.Request(  # noqa: S310
                url, method=method, headers=request_headers
            )
            try:
                with opener.open(request, timeout=timeout) as response:
                    status = response.status
                    final_url = response.geturl()
                    validate_public_url(final_url)
                    return Result(
                        url,
                        final_url,
                        status,
                        _classification(status),
                        None,
                        attempts,
                    )
            except UnresolvedURL as error:
                return Result(url, last_url, None, "warning", str(error), attempts)
            except UnsafeURL as error:
                return Result(url, last_url, None, "broken", str(error), attempts)
            except urllib.error.HTTPError as error:
                last_status = error.code
                last_error = str(error)
                last_url = error.url
                if method == "HEAD" and error.code in {401, 403, 405, 429}:
                    break
                if error.code in _RETRYABLE_STATUS and retry < retries:
                    time.sleep(_retry_after(error, min(2**retry, 8)))
                    continue
                return Result(
                    url,
                    last_url,
                    error.code,
                    _classification(error.code),
                    str(error),
                    attempts,
                )
            except (OSError, urllib.error.URLError) as error:
                last_status = None
                last_error = str(error)
                if retry < retries:
                    time.sleep(min(2**retry, 8))
                    continue
                if method == "HEAD":
                    break
    return Result(url, last_url, last_status, _classification(last_status), last_error, attempts)


def run_link_check(
    catalog: Path,
    *,
    workers: int = 8,
    timeout: float = 20.0,
    retries: int = 2,
    strict: bool = False,
    json_output: Path | None = None,
) -> int:
    if workers < 1 or timeout <= 0 or retries < 0:
        raise ValueError("workers and timeout must be positive; retries cannot be negative")

    urls = project_urls(catalog)
    started = time.monotonic()
    worker = partial(check, timeout=timeout, retries=retries)
    with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as executor:
        results = list(executor.map(worker, urls))

    for result in results:
        if result.classification == "ok":
            continue
        label = result.classification.upper()
        print(
            f"{label:7} {result.status or '-':>3} {result.url} "
            f"attempts={result.attempts} {result.error or ''}"
        )

    if json_output:
        json_output.parent.mkdir(parents=True, exist_ok=True)
        json_output.write_text(
            json.dumps([dataclasses.asdict(result) for result in results], indent=2) + "\n",
            encoding="utf-8",
        )

    broken = sum(result.classification == "broken" for result in results)
    warnings = sum(result.classification == "warning" for result in results)
    elapsed = time.monotonic() - started
    print(f"checked={len(results)} broken={broken} warnings={warnings} seconds={elapsed:.1f}")
    failed = broken > 0 or (strict and warnings > 0)
    return 1 if failed else 0
