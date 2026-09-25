from typer.testing import CliRunner

from awesome_iina.cli import app

runner = CliRunner()


def test_catalog_validate_command() -> None:
    result = runner.invoke(app, ["catalog", "validate", "src/awesome_iina/catalog/catalog.yaml"])
    assert result.exit_code == 0, result.output
    assert "valid" in result.output


def test_official_audit_command() -> None:
    result = runner.invoke(
        app, ["catalog", "audit-official", "src/awesome_iina/catalog/catalog.yaml"]
    )
    assert result.exit_code == 0, result.output
    assert "complete" in result.output


def test_generate_check_command() -> None:
    result = runner.invoke(
        app,
        ["catalog", "generate", "src/awesome_iina/catalog/catalog.yaml", "--check"],
    )
    assert result.exit_code == 0, result.output


def test_schemas_command(tmp_path) -> None:
    result = runner.invoke(
        app,
        ["schemas", "--output-directory", str(tmp_path)],
    )
    assert result.exit_code == 0, result.output
    assert (tmp_path / "catalog.schema.json").exists()
    assert (tmp_path / "discovery-config.schema.json").exists()
    assert (tmp_path / "discovery-run.schema.json").exists()
    assert (tmp_path / "media-report.schema.json").exists()
    assert (tmp_path / "overrides.schema.json").exists()
    assert (tmp_path / "source-snapshot.schema.json").exists()
