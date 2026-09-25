from __future__ import annotations

import base64
import binascii
import hashlib
import json
import logging
import os
import re
import subprocess
import time
from collections.abc import Callable, Iterable
from datetime import UTC, datetime
from pathlib import Path, PurePosixPath
from typing import Any, Protocol
from urllib.parse import quote

from awesome_iina.discovery.settings import GithubConfig
from awesome_iina.models import RepositorySnapshot

from .queries import REPOSITORY_SEARCH_QUERY, build_repository_batch_query

logger = logging.getLogger(__name__)


class GhError(RuntimeError):
    """Raised when GitHub CLI communication fails after retries."""


class GithubContentClient(Protocol):
    """Minimal client surface for fetching repository file bytes."""

    def get_content(
        self, repository: str, path: str, *, ref: str | None = None
    ) -> bytes | None: ...


class GithubDiscoveryClient(GithubContentClient, Protocol):
    """Structural GitHub client used by discovery (tests supply fakes)."""

    config: GithubConfig

    def search_repositories_page(
        self,
        query: str,
        *,
        cursor: str | None = None,
        page_size: int | None = None,
    ) -> dict[str, Any]: ...

    def search_code_page(
        self,
        query: str,
        *,
        page: int,
        per_page: int | None = None,
    ) -> dict[str, Any]: ...

    def enrich_repositories(
        self, repositories: Iterable[str]
    ) -> tuple[dict[str, RepositorySnapshot], list[str]]: ...


class GhClient:
    """Small, testable wrapper around authenticated ``gh api`` calls.

    Local users reuse ``gh auth``. GitHub Actions can provide ``GH_TOKEN``
    without writing credentials to disk.
    """

    def __init__(self, config: GithubConfig, *, executable: str = "gh") -> None:
        self.config = config
        self.executable = executable
        self._last_repository_request = 0.0
        self._last_code_request = 0.0
        self._last_search_request = 0.0
        self._previous_rate_limit: dict[str, Any] = {}
        self.request_count = 0
        self.total_wait_seconds = 0.0

    def ensure_ready(self) -> None:
        self._run(["--version"], parse_json=False, retries=0)
        self._run(["auth", "status", "--hostname", self.config.host], parse_json=False, retries=0)

    def graphql(self, query: str, variables: dict[str, Any] | None = None) -> dict[str, Any]:
        self._respect_graphql_rate_limit(self._previous_rate_limit, wait=self._wait)
        self._pace("repository")
        payload = {"query": query, "variables": variables or {}}
        response = self._run(
            ["api", "graphql", "--hostname", self.config.host, "--input", "-"],
            stdin=json.dumps(payload),
        )
        if not isinstance(response, dict):
            raise GhError("GitHub GraphQL returned a non-object response")
        if errors := response.get("errors"):
            raise GhError(f"GitHub GraphQL returned errors: {errors}")
        # Defer waiting until the next request so an exhausted wait budget cannot
        # discard a successfully returned search page.
        self._previous_rate_limit = {
            "data": {"rateLimit": (response.get("data") or {}).get("rateLimit")}
        }
        return response

    def rest(
        self,
        endpoint: str,
        *,
        params: dict[str, str | int | bool] | None = None,
        pace: str = "repository",
    ) -> dict[str, Any] | list[Any]:
        if endpoint.startswith(("/", "-")) or "://" in endpoint or "?" in endpoint:
            raise GhError("REST endpoint must be a relative API path without a query string")
        self._pace(pace)
        args = [
            "api",
            endpoint,
            "--hostname",
            self.config.host,
            "--method",
            "GET",
            "-H",
            "Accept: application/vnd.github+json",
            "-H",
            f"X-GitHub-Api-Version: {self.config.api_version}",
        ]
        for key, value in (params or {}).items():
            rendered = str(value).lower() if isinstance(value, bool) else str(value)
            args.extend(["-f", f"{key}={rendered}"])
        response = self._run(args)
        if not isinstance(response, dict | list):
            raise GhError("GitHub REST API returned an unexpected response")
        return response

    def search_repositories_page(
        self,
        query: str,
        *,
        cursor: str | None = None,
        page_size: int | None = None,
    ) -> dict[str, Any]:
        if self.config.repository_backend == "rest":
            try:
                page = int(cursor) if cursor is not None else 1
            except ValueError as error:
                raise GhError("REST repository cursor must be a page number") from error
            if page < 1:
                raise GhError("REST repository page must be positive")
            count = page_size or self.config.page_size
            response = self.rest(
                "search/repositories",
                params={
                    "q": query,
                    "page": page,
                    "per_page": count,
                    "sort": "updated",
                    "order": "asc",
                },
                pace="search",
            )
            if not isinstance(response, dict) or not isinstance(response.get("items"), list):
                raise GhError("GitHub repository search returned an invalid page")
            total = response.get("total_count", 0)
            nodes = [rest_repository_as_graphql(item) for item in response["items"]]
            has_next = page * count < int(total) and bool(nodes)
            return {
                "repositoryCount": total,
                "nodes": nodes,
                "incomplete_results": bool(response.get("incomplete_results")),
                "pageInfo": {
                    "hasNextPage": has_next,
                    "endCursor": str(page + 1) if has_next else None,
                },
            }
        response = self.graphql(
            REPOSITORY_SEARCH_QUERY,
            {"query": query, "cursor": cursor, "pageSize": page_size or self.config.page_size},
        )
        page = (response.get("data") or {}).get("search")
        if not isinstance(page, dict):
            raise GhError("GitHub GraphQL search returned an invalid page")
        return page

    def search_code_page(
        self,
        query: str,
        *,
        page: int,
        per_page: int | None = None,
    ) -> dict[str, Any]:
        response = self.rest(
            "search/code",
            params={
                "q": query,
                "page": page,
                "per_page": per_page or self.config.page_size,
            },
            pace="code",
        )
        if not isinstance(response, dict):
            raise GhError("GitHub code search returned a non-object response")
        return response

    def get_content(self, repository: str, path: str, *, ref: str | None = None) -> bytes | None:
        if not re.fullmatch(r"[A-Za-z0-9-]+/[A-Za-z0-9_.-]+", repository):
            raise GhError("Invalid GitHub repository name")
        if (
            not path
            or path.startswith("/")
            or ".." in PurePosixPath(path).parts
            or "\\" in path
            or any(ord(c) < 32 for c in path)
        ):
            raise GhError("Unsafe repository content path")
        endpoint = f"repos/{repository}/contents/{quote(path, safe='/')}"
        try:
            response = self.rest(endpoint, params={"ref": ref} if ref else {})
        except GhError as error:
            if re.search(r"\(HTTP 404\)", str(error)) or re.match(r"^404(?:\s|:|$)", str(error)):
                return None
            raise
        if not isinstance(response, dict) or response.get("type") != "file":
            return None
        encoded = response.get("content")
        if not isinstance(encoded, str):
            raise GhError(f"Missing content for {repository}:{path}; not treated as absent")
        if len(encoded) > self.config.max_content_bytes * 1.5 + 100:
            raise GhError("Repository content exceeds configured byte limit")
        try:
            data = base64.b64decode("".join(encoded.split()), validate=True)
        except (ValueError, binascii.Error) as error:
            raise GhError("Invalid base64 in repository content") from error
        if len(data) > self.config.max_content_bytes:
            raise GhError("Repository content exceeds configured byte limit")
        if sha := response.get("sha"):
            # Git blob identity is SHA-1 over header+body, not SHA-1(body).
            actual = hashlib.sha1(
                b"blob " + str(len(data)).encode() + b"\0" + data, usedforsecurity=False
            ).hexdigest()
            if actual != sha:
                raise GhError("Repository content blob hash mismatch")
        return data

    def enrich_repositories(
        self, repositories: Iterable[str]
    ) -> tuple[dict[str, RepositorySnapshot], list[str]]:
        names = list(dict.fromkeys(repositories))
        enriched: dict[str, RepositorySnapshot] = {}
        warnings: list[str] = []
        if self.config.repository_backend == "rest":
            for requested_name in names:
                try:
                    data = self.rest(f"repos/{requested_name}")
                    if not isinstance(data, dict) or not data.get("full_name"):
                        raise GhError("invalid repository response")
                    snapshot = repository_snapshot_from_graphql(rest_repository_as_graphql(data))
                    if requested_name.casefold() != snapshot.name_with_owner.casefold():
                        snapshot.aliases.append(requested_name)
                    enriched[snapshot.name_with_owner.casefold()] = snapshot
                except GhError as error:
                    warnings.append(f"repository enrichment failed for {requested_name}: {error}")
            return enriched, warnings
        batch_size = self.config.enrichment_batch_size
        for offset in range(0, len(names), batch_size):
            batch = names[offset : offset + batch_size]
            query = build_repository_batch_query(batch)
            try:
                response = self.graphql(query)
            except GhError as error:
                message = (
                    f"repository enrichment failed for batch {offset // batch_size + 1}: {error}"
                )
                logger.warning(message)
                warnings.append(message)
                continue
            data = response.get("data", {})
            for index, requested_name in enumerate(batch):
                node = data.get(f"repo{index}")
                if not node:
                    message = f"repository disappeared or became inaccessible: {requested_name}"
                    logger.warning(message)
                    warnings.append(message)
                    continue
                snapshot = repository_snapshot_from_graphql(node)
                if requested_name.casefold() != snapshot.name_with_owner.casefold():
                    snapshot.aliases.append(requested_name)
                enriched[snapshot.name_with_owner.casefold()] = snapshot
        return enriched, warnings

    def _wait(self, seconds: float) -> None:
        seconds = max(0.0, seconds)
        if self.total_wait_seconds + seconds > self.config.max_total_wait_seconds:
            raise GhError("Cumulative GitHub wait budget exhausted; resume from a checkpoint")
        self.total_wait_seconds += seconds
        time.sleep(seconds)

    def _pace(self, kind: str) -> None:
        now = time.monotonic()
        if kind == "search":
            delay = self.config.repository_search_delay_seconds
            self._wait(max(0.0, delay - (now - self._last_search_request)))
            self._last_search_request = time.monotonic()
            return
        if kind == "code":
            delay = self.config.code_search_delay_seconds
            elapsed = now - self._last_code_request
            if elapsed < delay:
                self._wait(delay - elapsed)
            self._last_code_request = time.monotonic()
            return
        delay = self.config.repository_request_delay_seconds
        elapsed = now - self._last_repository_request
        if elapsed < delay:
            self._wait(delay - elapsed)
        self._last_repository_request = time.monotonic()

    def _run(
        self,
        args: list[str],
        *,
        stdin: str | None = None,
        parse_json: bool = True,
        retries: int | None = None,
    ) -> dict[str, Any] | list[Any] | str:
        maximum_retries = self.config.max_retries if retries is None else retries
        backoff = self.config.initial_backoff_seconds
        env = os.environ.copy()
        for attempt in range(maximum_retries + 1):
            if args and args[0] == "api":
                if self.request_count >= self.config.max_requests:
                    raise GhError("GitHub request budget exhausted; resume from a checkpoint")
                self.request_count += 1
            try:
                process = subprocess.run(  # noqa: S603
                    [self.executable, *args],
                    input=stdin,
                    text=True,
                    capture_output=True,
                    check=False,
                    env=env,
                    timeout=self.config.request_timeout_seconds,
                )
            except subprocess.TimeoutExpired as error:
                if attempt == maximum_retries:
                    raise GhError("GitHub process timeout after bounded retries") from error
                self._wait(min(backoff, self.config.max_backoff_seconds))
                backoff = max(backoff * 2, 1.0)
                continue
            except OSError as error:
                raise GhError(f"Unable to execute GitHub CLI: {error}") from error
            if process.returncode == 0:
                if not parse_json:
                    return process.stdout
                try:
                    return json.loads(process.stdout)
                except json.JSONDecodeError as error:
                    raise GhError(f"gh returned invalid JSON: {process.stdout[:500]}") from error

            error_text = "\n".join(
                part for part in [process.stderr, process.stdout] if part
            ).strip()
            retryable = self._is_retryable(error_text)
            if attempt >= maximum_retries or not retryable:
                command = " ".join([self.executable, *args])
                raise GhError(
                    f"GitHub CLI command failed with exit code {process.returncode}: {command}\n"
                    f"{error_text}"
                )
            sleep_for = min(backoff, self.config.max_backoff_seconds)
            if any(
                term in error_text.casefold()
                for term in ("secondary rate limit", "rate limit exceeded", "abuse detection")
            ):
                sleep_for = max(60.0, sleep_for)
            logger.warning(
                "GitHub request failed (%s/%s); retrying in %.1fs: %s",
                attempt + 1,
                maximum_retries + 1,
                sleep_for,
                error_text[:300],
            )
            self._wait(sleep_for)
            backoff = max(backoff * 2, 1.0)
        raise AssertionError("unreachable")

    @staticmethod
    def _is_retryable(error_text: str) -> bool:
        lowered = error_text.casefold()
        retry_fragments = (
            "secondary rate limit",
            "rate limit exceeded",
            "abuse detection",
            "502",
            "503",
            "504",
            "timeout",
            "timed out",
            "connection reset",
            "temporary failure",
        )
        return any(fragment in lowered for fragment in retry_fragments)

    @staticmethod
    def _respect_graphql_rate_limit(
        response: dict[str, Any],
        *,
        wait: Callable[[float], None] | None = None,
    ) -> None:
        rate_limit = (response.get("data") or {}).get("rateLimit")
        if not isinstance(rate_limit, dict):
            return
        remaining = rate_limit.get("remaining")
        reset_at = rate_limit.get("resetAt")
        if not isinstance(remaining, int) or remaining > 50 or not isinstance(reset_at, str):
            return
        try:
            reset = datetime.fromisoformat(reset_at.replace("Z", "+00:00"))
            if reset.tzinfo is None:
                raise ValueError("naive reset time")
        except ValueError as error:
            raise GhError("Invalid GitHub rate-limit reset timestamp") from error
        seconds = max((reset - datetime.now(UTC)).total_seconds(), 0) + 1
        logger.warning("GraphQL budget low (%s remaining); sleeping %.1fs", remaining, seconds)
        (wait or time.sleep)(seconds)


def repository_snapshot_from_graphql(node: dict[str, Any]) -> RepositorySnapshot:
    topics = [
        item["topic"]["name"]
        for item in node.get("repositoryTopics", {}).get("nodes", [])
        if item and item.get("topic")
    ]
    languages = {
        edge["node"]["name"]: edge["size"]
        for edge in node.get("languages", {}).get("edges", [])
        if edge and edge.get("node")
    }
    latest_release = node.get("latestRelease") or {}
    parent = node.get("parent") or {}
    snapshot = RepositorySnapshot(
        private=bool(node.get("isPrivate", False)),
        node_id=node.get("id"),
        database_id=node.get("databaseId"),
        name_with_owner=node["nameWithOwner"],
        url=node["url"],
        description=node.get("description"),
        homepage_url=node.get("homepageUrl"),
        created_at=node.get("createdAt"),
        updated_at=node.get("updatedAt"),
        pushed_at=node.get("pushedAt"),
        archived=node.get("isArchived", False),
        disabled=node.get("isDisabled", False),
        empty=node.get("isEmpty", False),
        fork=node.get("isFork", False),
        mirror=node.get("isMirror", False),
        template=node.get("isTemplate", False),
        stars=node.get("stargazerCount", 0),
        forks=node.get("forkCount", 0),
        watchers=(node.get("watchers") or {}).get("totalCount", 0),
        open_issues=(node.get("issues") or {}).get("totalCount", 0),
        open_pull_requests=(node.get("pullRequests") or {}).get("totalCount", 0),
        disk_usage_kb=node.get("diskUsage"),
        license_spdx=(node.get("licenseInfo") or {}).get("spdxId"),
        primary_language=(node.get("primaryLanguage") or {}).get("name"),
        languages=languages,
        topics=topics,
        default_branch=(node.get("defaultBranchRef") or {}).get("name"),
        latest_release_tag=latest_release.get("tagName"),
        latest_release_at=latest_release.get("publishedAt"),
        release_count=(node.get("releases") or {}).get("totalCount", 0),
        parent=parent.get("nameWithOwner"),
    )
    # Preserve omitted fields during later partial observations; explicit nulls can clear them.
    source_fields = {
        "node_id": "id",
        "database_id": "databaseId",
        "name_with_owner": "nameWithOwner",
        "url": "url",
        "description": "description",
        "homepage_url": "homepageUrl",
        "created_at": "createdAt",
        "updated_at": "updatedAt",
        "pushed_at": "pushedAt",
        "archived": "isArchived",
        "disabled": "isDisabled",
        "empty": "isEmpty",
        "fork": "isFork",
        "mirror": "isMirror",
        "template": "isTemplate",
        "private": "isPrivate",
        "stars": "stargazerCount",
        "forks": "forkCount",
        "watchers": "watchers",
        "open_issues": "issues",
        "open_pull_requests": "pullRequests",
        "disk_usage_kb": "diskUsage",
        "license_spdx": "licenseInfo",
        "primary_language": "primaryLanguage",
        "languages": "languages",
        "topics": "repositoryTopics",
        "default_branch": "defaultBranchRef",
        "latest_release_tag": "latestRelease",
        "latest_release_at": "latestRelease",
        "release_count": "releases",
        "parent": "parent",
    }
    return RepositorySnapshot.model_validate(
        {
            field: value
            for field, value in snapshot.model_dump().items()
            if field in source_fields and source_fields[field] in node
        }
    )


def decode_json_content(content: bytes, *, source: str) -> Any:
    try:
        return json.loads(content.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError) as error:
        raise GhError(f"Invalid UTF-8 JSON in {source}") from error


def write_debug_payload(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def rest_repository_as_graphql(item: dict[str, Any]) -> dict[str, Any]:
    """Normalize only fields actually supplied by REST; missing is not the same as null."""
    aliases = {
        "node_id": "id",
        "id": "databaseId",
        "full_name": "nameWithOwner",
        "html_url": "url",
        "description": "description",
        "homepage": "homepageUrl",
        "created_at": "createdAt",
        "updated_at": "updatedAt",
        "pushed_at": "pushedAt",
        "archived": "isArchived",
        "disabled": "isDisabled",
        "private": "isPrivate",
        "fork": "isFork",
        "is_template": "isTemplate",
        "stargazers_count": "stargazerCount",
        "forks_count": "forkCount",
        "size": "diskUsage",
    }
    node = {new: item[old] for old, new in aliases.items() if old in item}
    # REST `size` is KiB (same unit as GraphQL `diskUsage`), not bytes.
    if "size" in item:
        node["isEmpty"] = item["size"] == 0
    if "mirror_url" in item:
        node["isMirror"] = bool(item["mirror_url"])
    for old, new, nested in (
        ("default_branch", "defaultBranchRef", "name"),
        ("language", "primaryLanguage", "name"),
    ):
        if old in item:
            node[new] = {nested: item[old]} if item[old] is not None else None
    if "topics" in item:
        node["repositoryTopics"] = {"nodes": [{"topic": {"name": t}} for t in item["topics"]]}
    if "license" in item:
        node["licenseInfo"] = {"spdxId": (item["license"] or {}).get("spdx_id")}
    if "parent" in item:
        node["parent"] = {"nameWithOwner": (item["parent"] or {}).get("full_name")}
    if "subscribers_count" in item:
        node["watchers"] = {"totalCount": item["subscribers_count"]}
    # REST open_issues_count includes PRs; it must not be labelled as the GraphQL issues count.
    return node
