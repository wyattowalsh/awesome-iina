import json
from pathlib import Path

from awesome_iina.catalog.generator import markdown_escape, schema_outputs, write_or_check
from awesome_iina.io_utils import atomic_write_text, read_json, read_yaml, write_json, write_yaml
from awesome_iina.models import OverrideFile, SourceSnapshot


def test_atomic_and_yaml_json_round_trip(tmp_path: Path) -> None:
    text_path = tmp_path / "nested" / "value.txt"
    atomic_write_text(text_path, "hello\n")
    assert text_path.read_text() == "hello\n"

    yaml_path = tmp_path / "value.yaml"
    write_yaml(yaml_path, {"value": 1})
    assert read_yaml(yaml_path) == {"value": 1}

    json_path = tmp_path / "value.json"
    write_json(json_path, {"value": 1})
    assert read_json(json_path) == {"value": 1}


def test_write_or_check_detects_and_writes_changes(tmp_path: Path) -> None:
    path = tmp_path / "generated.txt"
    outputs = {path: "expected\n"}
    assert write_or_check(outputs, check=True) == [path]
    assert not path.exists()
    assert write_or_check(outputs, check=False) == [path]
    assert path.read_text() == "expected\n"
    assert write_or_check(outputs, check=True) == []


def test_markdown_escape() -> None:
    assert markdown_escape("a|b<c>") == "a\\|b&lt;c&gt;"


def test_atomic_write_preserves_existing_mode(tmp_path: Path) -> None:
    path = tmp_path / "script.sh"
    path.write_text("old\n")
    path.chmod(0o755)
    atomic_write_text(path, "new\n")
    assert path.stat().st_mode & 0o777 == 0o755


def test_schema_outputs_include_overrides_and_source_snapshots(tmp_path: Path) -> None:
    outputs = schema_outputs(tmp_path)
    names = {path.name for path in outputs}
    assert names == {
        "catalog.schema.json",
        "discovery-config.schema.json",
        "discovery-run.schema.json",
        "media-report.schema.json",
        "overrides.schema.json",
        "source-snapshot.schema.json",
    }
    assert outputs[tmp_path / "overrides.schema.json"] == (
        json.dumps(OverrideFile.model_json_schema(), indent=2, ensure_ascii=False, sort_keys=True)
        + "\n"
    )
    assert outputs[tmp_path / "source-snapshot.schema.json"] == (
        json.dumps(SourceSnapshot.model_json_schema(), indent=2, ensure_ascii=False, sort_keys=True)
        + "\n"
    )


def test_committed_override_and_snapshot_schemas_match_schema_outputs() -> None:
    outputs = schema_outputs(Path("src/awesome_iina/catalog/schemas"))
    for name in ("overrides.schema.json", "source-snapshot.schema.json"):
        path = Path("src/awesome_iina/catalog/schemas") / name
        assert path.read_text(encoding="utf-8") == outputs[path]
