from __future__ import annotations

import hashlib
import json
import urllib.request
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from awesome_iina.discovery.settings import DiscoveryConfig, SourceConfig
from awesome_iina.github import GithubContentClient
from awesome_iina.io_utils import read_json, write_json
from awesome_iina.models import OfficialPluginEntry, SourceSnapshot


class SourceSyncError(RuntimeError):
    """Raised when an authoritative source cannot be fetched or parsed."""


def source_url(source: SourceConfig) -> str:
    if source.url:
        return source.url
    if source.repository and source.path:
        ref = source.ref or "HEAD"
        return f"https://github.com/{source.repository}/blob/{ref}/{source.path}"
    raise SourceSyncError(f"source {source.id!r} has no fetchable location")


def fetch_source(source: SourceConfig, client: GithubContentClient | None) -> bytes:
    if source.repository and source.path:
        if client is None:
            raise SourceSyncError(f"source {source.id!r} requires a GitHub client")
        content = client.get_content(source.repository, source.path, ref=source.ref)
        if content is None:
            raise SourceSyncError(
                f"source {source.id!r} was not found at {source.repository}:{source.path}"
            )
        return content
    if source.url:
        request = urllib.request.Request(  # noqa: S310
            source.url,
            headers={"User-Agent": "wyattowalsh/awesome-iina source-sync"},
        )
        try:
            with urllib.request.urlopen(request, timeout=30) as response:  # noqa: S310
                raw = response.read(1_000_001)
                if len(raw) > 1_000_000:
                    raise SourceSyncError("configured source exceeds the 1,000,000-byte limit")
                return raw
        except OSError as error:
            raise SourceSyncError(f"failed to fetch {source.url}: {error}") from error
    raise SourceSyncError(f"source {source.id!r} has no fetchable location")


def parse_source_content(source: SourceConfig, raw: bytes) -> Any:
    if source.kind in {"github-json", "json-url"}:
        try:
            return json.loads(raw.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError) as error:
            raise SourceSyncError(f"source {source.id!r} did not contain valid JSON") from error
    if source.kind in {"github-text", "text-url"}:
        try:
            return raw.decode("utf-8")
        except UnicodeDecodeError as error:
            raise SourceSyncError(f"source {source.id!r} was not UTF-8 text") from error
    raise SourceSyncError(f"unsupported source kind: {source.kind}")


def content_sha256(content: Any) -> str:
    """Return a stable digest of parsed source content.

    Raw-byte hashes preserve upstream evidence, while this canonical hash lets the
    committed snapshot verify itself after JSON parsing and pretty-printing.
    """

    if isinstance(content, str):
        payload = content.encode("utf-8")
    else:
        payload = json.dumps(
            content,
            ensure_ascii=False,
            sort_keys=True,
            separators=(",", ":"),
        ).encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


def destination_for(source: SourceConfig, config: DiscoveryConfig) -> Path:
    if source.destination:
        return source.destination
    if source.id == "official-iina-plugins":
        return config.paths.official_plugins_snapshot
    return Path("src/awesome_iina/discovery/snapshots") / f"{source.id}.json"


def sync_sources(config: DiscoveryConfig, client: GithubContentClient) -> list[Path]:
    written: list[Path] = []
    for source in config.sources:
        if not source.enabled:
            continue
        raw = fetch_source(source, client)
        content = parse_source_content(source, raw)
        snapshot = SourceSnapshot(
            source_id=source.id,
            fetched_at=datetime.now(UTC),
            source_url=source_url(source),
            sha256=hashlib.sha256(raw).hexdigest(),
            content_sha256=content_sha256(content),
            content=content,
        )
        destination = destination_for(source, config)
        if destination.exists():
            try:
                current = load_source_snapshot(destination)
            except (OSError, ValueError):
                current = None
            if current and (
                current.source_url == snapshot.source_url
                and current.sha256 == snapshot.sha256
                and current.content_sha256 == snapshot.content_sha256
            ):
                continue
        write_json(destination, snapshot)
        written.append(destination)
    return written


def load_source_snapshot(path: Path) -> SourceSnapshot:
    return SourceSnapshot.model_validate(read_json(path))


def load_official_plugins(path: Path) -> list[OfficialPluginEntry]:
    snapshot = load_source_snapshot(path)
    if not isinstance(snapshot.content, list):
        raise SourceSyncError(f"official plugin snapshot {path} does not contain a list")
    return [OfficialPluginEntry.model_validate(item) for item in snapshot.content]


def try_load_official_plugins(
    path: Path,
) -> tuple[list[OfficialPluginEntry], list[str]]:
    if not path.exists():
        return [], [f"official plugin snapshot is missing: {path}"]
    return load_official_plugins(path), []
