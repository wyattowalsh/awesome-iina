import json
from pathlib import Path

from awesome_iina.github import (
    decode_json_content,
    repository_snapshot_from_graphql,
    rest_repository_as_graphql,
)
from awesome_iina.github.queries import build_repository_batch_query


def test_repository_snapshot_from_graphql_fixture() -> None:
    node = json.loads(Path("tests/fixtures/repository-node.json").read_text())
    snapshot = repository_snapshot_from_graphql(node)
    assert snapshot.name_with_owner == "example/iina-plugin-example"
    assert snapshot.primary_language == "TypeScript"
    assert snapshot.topics == ["iina-plugin"]
    assert snapshot.latest_release_tag == "v1.0.0"
    assert snapshot.languages == {"TypeScript": 1000}


def test_batch_query_escapes_owner_and_name() -> None:
    query = build_repository_batch_query(["owner/repo"])
    assert 'repository(owner: "owner", name: "repo")' in query
    assert "rateLimit" in query


def test_decode_json_content() -> None:
    assert decode_json_content(b'{"value": 1}', source="fixture") == {"value": 1}


def test_rest_size_zero_maps_to_isempty() -> None:
    node = rest_repository_as_graphql(
        {
            "full_name": "example/empty",
            "html_url": "https://github.com/example/empty",
            "size": 0,
        }
    )
    assert node["diskUsage"] == 0
    assert node["isEmpty"] is True
    snapshot = repository_snapshot_from_graphql(node)
    assert snapshot.empty is True
    assert snapshot.disk_usage_kb == 0


def test_rest_nonzero_size_is_not_empty() -> None:
    node = rest_repository_as_graphql(
        {
            "full_name": "example/repo",
            "html_url": "https://github.com/example/repo",
            "size": 12,
        }
    )
    assert node["isEmpty"] is False
    assert repository_snapshot_from_graphql(node).empty is False


def test_rest_missing_size_is_not_false_empty() -> None:
    node = rest_repository_as_graphql(
        {
            "full_name": "example/partial",
            "html_url": "https://github.com/example/partial",
        }
    )
    assert "isEmpty" not in node
    assert "diskUsage" not in node
    snapshot = repository_snapshot_from_graphql(node)
    assert snapshot.empty is False
    assert snapshot.disk_usage_kb is None


def test_rest_mirror_url_maps_to_ismirror() -> None:
    mirrored = rest_repository_as_graphql(
        {
            "full_name": "example/mirror",
            "html_url": "https://github.com/example/mirror",
            "mirror_url": "git://example.com/upstream.git",
        }
    )
    assert mirrored["isMirror"] is True
    assert repository_snapshot_from_graphql(mirrored).mirror is True
    not_mirror = rest_repository_as_graphql(
        {
            "full_name": "example/plain",
            "html_url": "https://github.com/example/plain",
            "mirror_url": None,
        }
    )
    assert not_mirror["isMirror"] is False
    omitted = rest_repository_as_graphql(
        {
            "full_name": "example/omit",
            "html_url": "https://github.com/example/omit",
        }
    )
    assert "isMirror" not in omitted
