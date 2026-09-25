from __future__ import annotations

import json
import logging
from dataclasses import asdict
from pathlib import Path
from typing import Annotated

import typer
from rich.console import Console
from rich.table import Table

from awesome_iina.catalog import (
    audit_official_plugins,
    catalog_schema,
    load_catalog,
    validate_catalog_policy,
)
from awesome_iina.catalog.generator import generated_outputs, schema_outputs, write_or_check
from awesome_iina.discovery import (
    load_discovery_run,
    load_overrides,
    reclassify_run,
    run_discovery,
    save_discovery_run,
)
from awesome_iina.discovery.merge import merge_discovery_runs
from awesome_iina.discovery.reporting import render_discovery_report, write_review_queue
from awesome_iina.discovery.settings import load_config
from awesome_iina.discovery.snapshot_diff import compare_discovery_runs, render_snapshot_diff
from awesome_iina.discovery.sources import load_official_plugins, sync_sources
from awesome_iina.github import GhClient
from awesome_iina.io_utils import atomic_write_text, write_json
from awesome_iina.media import inspect_media, tool_availability
from awesome_iina.repo.archive import create_archive, write_file_manifest
from awesome_iina.repo.awesome_lint import lint_awesome_repository
from awesome_iina.repo.doctor import inspect_environment
from awesome_iina.repo.links import run_link_check
from awesome_iina.repo.plugin_manifest import inspect_manifest
from awesome_iina.repo.root_policy import load_root_policy, validate_root
from awesome_iina.repo.verify import VerificationError
from awesome_iina.repo.verify import main as verify_main
from awesome_iina.site import build_site
from awesome_iina.site.brand import BrandError, sync_brand

app = typer.Typer(
    name="awesome-iina",
    help="Discover, curate, validate, and document the IINA ecosystem.",
    no_args_is_help=True,
    pretty_exceptions_show_locals=False,
)
sources_app = typer.Typer(help="Refresh authoritative upstream source snapshots.")
catalog_app = typer.Typer(help="Validate and generate the curated catalog.")
media_app = typer.Typer(help="Inspect MKV and other media files with local media tooling.")
repository_app = typer.Typer(help="Validate repository structure and Awesome-list policy.")
plugin_app = typer.Typer(help="Inspect IINA plugin packages and manifests safely.")
app.add_typer(sources_app, name="sources")
app.add_typer(catalog_app, name="catalog")
app.add_typer(media_app, name="media")
app.add_typer(repository_app, name="repository")
app.add_typer(plugin_app, name="plugin")

console = Console()


def _configure_logging(verbose: bool) -> None:
    logging.basicConfig(
        level=logging.DEBUG if verbose else logging.INFO,
        format="%(levelname)s %(name)s: %(message)s",
    )


@app.command("doctor")
def doctor_command(
    profile: Annotated[
        str,
        typer.Option(help="Prerequisite profile: core, discovery, media, or all."),
    ] = "core",
    root: Annotated[Path, typer.Option(file_okay=False)] = Path(),
    json_output: Annotated[bool, typer.Option("--json")] = False,
) -> None:
    """Inspect development, discovery, and media-tool prerequisites."""

    if profile not in {"core", "discovery", "media", "all"}:
        raise typer.BadParameter("profile must be core, discovery, media, or all")
    report = inspect_environment(root, profile)  # type: ignore[arg-type]
    if json_output:
        console.print_json(
            json.dumps(
                {
                    "ok": report.ok,
                    "profile": report.profile,
                    "root": report.root,
                    "checks": [asdict(check) for check in report.checks],
                }
            )
        )
    else:
        table = Table("Check", "Status", "Required", "Detail")
        for check in report.checks:
            table.add_row(
                check.name,
                check.status,
                "yes" if check.required else "no",
                check.detail,
            )
        console.print(table)
    if not report.ok:
        raise typer.Exit(code=1)


@repository_app.command("lint-root")
def repository_lint_root(
    root: Annotated[Path, typer.Option(file_okay=False)] = Path(),
    policy: Annotated[Path, typer.Option(dir_okay=False)] = Path(
        "src/awesome_iina/repo/root-policy.toml"
    ),
) -> None:
    """Enforce the versioned minimal-root policy."""

    root = root.resolve()
    policy_path = policy if policy.is_absolute() else root / policy
    violations = validate_root(root, load_root_policy(policy_path))
    for violation in violations:
        console.print(f"[red]{violation.code}[/red] {violation.path}: {violation.message}")
    if violations:
        raise typer.Exit(code=1)
    console.print("[green]valid[/green] repository root")


@repository_app.command("lint-awesome")
def repository_lint_awesome(
    root: Annotated[Path, typer.Option(file_okay=False)] = Path(),
    readme: Annotated[Path, typer.Option(dir_okay=False)] = Path("README.md"),
    catalog: Annotated[Path, typer.Option(dir_okay=False)] = Path(
        "src/awesome_iina/catalog/catalog.yaml"
    ),
) -> None:
    """Validate Awesome-list structure, ordering, and local links."""

    root = root.resolve()
    readme_path = readme if readme.is_absolute() else root / readme
    catalog_path = catalog if catalog.is_absolute() else root / catalog
    issues = lint_awesome_repository(root, readme_path, catalog_path)
    for issue in issues:
        location = issue.path + (f":{issue.line}" if issue.line else "")
        console.print(f"[red]{issue.code}[/red] {location}: {issue.message}")
    if issues:
        raise typer.Exit(code=1)
    console.print("[green]valid[/green] Awesome IINA README and catalog policy")


@repository_app.command("verify")
def repository_verify() -> None:
    """Run the offline repository integrity suite."""

    try:
        verify_main()
    except VerificationError as exc:
        console.print(str(exc), markup=False)
        raise typer.Exit(code=1) from exc


@repository_app.command("archive")
def repository_archive(
    root: Annotated[Path, typer.Option(file_okay=False)] = Path(),
    output: Annotated[Path, typer.Option(dir_okay=False)] = Path("dist/awesome-iina.zip"),
    prefix: Annotated[str, typer.Option()] = "awesome-iina",
    manifest: Annotated[Path | None, typer.Option(dir_okay=False)] = None,
) -> None:
    """Write a deterministic full-source ZIP."""

    root = root.resolve()
    destination = output if output.is_absolute() else root / output
    files = create_archive(root, destination, prefix)
    if manifest is not None:
        manifest_path = manifest if manifest.is_absolute() else root / manifest
        write_file_manifest(root, files, manifest_path)
    console.print(f"{destination} ({len(files)} source files)", markup=False)


@repository_app.command("links")
def repository_links(
    catalog: Annotated[Path, typer.Argument(dir_okay=False)] = Path(
        "src/awesome_iina/catalog/catalog.yaml"
    ),
    workers: Annotated[int, typer.Option()] = 8,
    timeout: Annotated[float, typer.Option()] = 20.0,
    retries: Annotated[int, typer.Option()] = 2,
    strict: Annotated[bool, typer.Option("--strict")] = False,
    json_output: Annotated[Path | None, typer.Option("--json-output", dir_okay=False)] = None,
) -> None:
    """Check catalog and evidence URLs without following private or local targets."""

    code = run_link_check(
        catalog,
        workers=workers,
        timeout=timeout,
        retries=retries,
        strict=strict,
        json_output=json_output,
    )
    if code:
        raise typer.Exit(code=code)


@plugin_app.command("inspect")
def plugin_inspect(
    path: Annotated[Path, typer.Argument(exists=True, dir_okay=False, readable=True)],
    json_output: Annotated[bool, typer.Option("--json")] = False,
) -> None:
    """Inspect an IINA Info.json without executing plugin code."""

    report = inspect_manifest(path)
    if json_output:
        console.print_json(json.dumps(asdict(report)))
    else:
        console.print(f"[bold]{report.name or '<unknown>'}[/bold] {report.version or ''}")
        console.print(f"identifier: {report.identifier or '<unknown>'}")
        console.print(f"package size: {report.package_size_bytes} bytes")
        console.print(f"permissions: {', '.join(report.permissions) or '<none>'}")
        if report.dangerous_permissions:
            console.print(
                "[yellow]dangerous permissions:[/yellow] " + ", ".join(report.dangerous_permissions)
            )
        for finding in report.findings:
            color = "red" if finding.severity == "error" else "yellow"
            field = f" ({finding.field})" if finding.field else ""
            console.print(
                f"[{color}]{finding.severity.upper()}[/{color}] "
                f"{finding.code}{field}: {finding.message}"
            )
    if not report.valid:
        raise typer.Exit(code=1)


@app.command("diff-snapshots")
def diff_snapshots_command(
    old: Annotated[Path, typer.Argument(exists=True, dir_okay=False, readable=True)],
    new: Annotated[Path, typer.Argument(exists=True, dir_okay=False, readable=True)],
    output: Annotated[Path | None, typer.Option("--output", "-o", dir_okay=False)] = None,
    json_output: Annotated[bool, typer.Option("--json")] = False,
) -> None:
    """Compare discovery snapshots by stable repository identity."""

    diff = compare_discovery_runs(load_discovery_run(old), load_discovery_run(new))
    rendered = (
        json.dumps(asdict(diff), indent=2) + "\n" if json_output else render_snapshot_diff(diff)
    )
    if output:
        atomic_write_text(output, rendered)
        console.print(f"[green]wrote[/green] {output}")
    else:
        console.print(rendered, end="")


@sources_app.command("sync")
def sources_sync(
    config_path: Annotated[
        Path,
        typer.Option("--config", exists=True, dir_okay=False, readable=True),
    ] = Path("src/awesome_iina/discovery/discovery.yaml"),
    verbose: Annotated[bool, typer.Option("--verbose", "-v")] = False,
) -> None:
    """Fetch configured official and legacy sources through GitHub or HTTPS."""

    _configure_logging(verbose)
    config = load_config(config_path)
    client = GhClient(config.github)
    client.ensure_ready()
    paths = sync_sources(config, client)
    for path in paths:
        console.print(f"[green]updated[/green] {path}")


@app.command("discover")
def discover_command(
    config_path: Annotated[
        Path,
        typer.Option("--config", exists=True, dir_okay=False, readable=True),
    ] = Path("src/awesome_iina/discovery/discovery.yaml"),
    mode: Annotated[str, typer.Option(help="quick or full")] = "full",
    output: Annotated[Path | None, typer.Option(dir_okay=False)] = None,
    verbose: Annotated[bool, typer.Option("--verbose", "-v")] = False,
    backend: Annotated[str | None, typer.Option(help="graphql or rest; defaults to config")] = None,
    checkpoint: Annotated[Path | None, typer.Option(dir_okay=False)] = None,
    resume: Annotated[bool, typer.Option()] = False,
    strict: Annotated[
        bool, typer.Option(help="Exit 2 after saving incomplete query results")
    ] = False,
) -> None:
    """Run high-recall repository and code discovery against GitHub."""

    _configure_logging(verbose)
    config = load_config(config_path)
    if mode not in {"quick", "full"}:
        raise typer.BadParameter("mode must be quick or full")
    if backend is not None:
        if backend not in {"rest", "graphql"}:
            raise typer.BadParameter("backend must be rest or graphql")
        config.github.repository_backend = backend
    protected = {
        config_path.resolve(),
        config.paths.catalog.resolve(),
        config.paths.overrides.resolve(),
        config.paths.official_plugins_snapshot.resolve(),
    }
    destination = output or config.paths.discovery_output
    if destination.resolve() in protected or (checkpoint and checkpoint.resolve() in protected):
        raise typer.BadParameter(
            "Discovery output/checkpoint cannot replace source configuration or catalog"
        )
    if checkpoint and checkpoint.resolve() == destination.resolve():
        raise typer.BadParameter("Checkpoint and result paths must differ")
    client = GhClient(config.github)
    client.ensure_ready()
    run = run_discovery(
        config_path=config_path,
        config=config,
        client=client,
        mode=mode,
        checkpoint=checkpoint,
        resume=resume,
    )
    destination = output or config.paths.discovery_output
    save_discovery_run(run, destination)
    console.print(
        f"[green]saved[/green] {destination}: {len(run.candidates)} candidates, "
        f"{run.accepted} manually included, {run.review} needing review, "
        f"{run.rejected} excluded"
    )
    if not run.complete:
        console.print(
            "[yellow]warning:[/yellow] at least one configured search was capped or incomplete; "
            "inspect the audit report before describing the run as exhaustive"
        )

    if strict and not run.complete:
        raise typer.Exit(code=2)


@app.command("merge-discovery")
def merge_discovery_command(
    inputs: Annotated[
        list[Path],
        typer.Argument(exists=True, dir_okay=False, readable=True),
    ],
    config_path: Annotated[
        Path,
        typer.Option("--config", exists=True, dir_okay=False, readable=True),
    ] = Path("src/awesome_iina/discovery/discovery.yaml"),
    output: Annotated[
        Path,
        typer.Option("--output", "-o", dir_okay=False),
    ] = Path("output/discovery-merged.json"),
) -> None:
    """Merge REST and GraphQL discovery artifacts, then re-score once."""

    if len(inputs) < 2:
        raise typer.BadParameter("provide at least two discovery artifacts")
    config = load_config(config_path)
    run = merge_discovery_runs(load_discovery_run(path) for path in inputs)
    reclassify_run(run, config, load_overrides(config.paths.overrides))
    save_discovery_run(run, output)
    console.print(
        f"[green]merged[/green] {len(inputs)} runs into {output}: "
        f"{len(run.candidates)} unique public candidates"
    )


@app.command("classify")
def classify_command(
    input_path: Annotated[
        Path,
        typer.Argument(exists=True, dir_okay=False, readable=True),
    ],
    config_path: Annotated[
        Path,
        typer.Option("--config", exists=True, dir_okay=False, readable=True),
    ] = Path("src/awesome_iina/discovery/discovery.yaml"),
    output: Annotated[Path | None, typer.Option(dir_okay=False)] = None,
) -> None:
    """Re-score a saved discovery run without making network requests."""

    config = load_config(config_path)
    run = load_discovery_run(input_path)
    reclassify_run(run, config, load_overrides(config.paths.overrides))
    destination = output or input_path
    save_discovery_run(run, destination)
    console.print(f"[green]reclassified[/green] {destination}")


@app.command("report")
def report_command(
    input_path: Annotated[
        Path,
        typer.Argument(exists=True, dir_okay=False, readable=True),
    ],
    config_path: Annotated[
        Path,
        typer.Option("--config", exists=True, dir_okay=False, readable=True),
    ] = Path("src/awesome_iina/discovery/discovery.yaml"),
    output: Annotated[Path | None, typer.Option(dir_okay=False)] = None,
    review_output: Annotated[
        Path | None,
        typer.Option("--review-output", dir_okay=False),
    ] = None,
) -> None:
    """Create the discovery audit report and human review queue."""

    config = load_config(config_path)
    run = load_discovery_run(input_path)
    report_path = output or config.paths.report_output
    queue_path = review_output or config.paths.review_output
    atomic_write_text(report_path, render_discovery_report(run))
    write_review_queue(run, queue_path)
    console.print(f"[green]wrote[/green] {report_path}")
    console.print(f"[green]wrote[/green] {queue_path}")


@catalog_app.command("validate")
def catalog_validate(
    catalog_path: Annotated[
        Path,
        typer.Argument(exists=True, dir_okay=False, readable=True),
    ] = Path("src/awesome_iina/catalog/catalog.yaml"),
) -> None:
    """Validate the catalog schema and repository policy invariants."""

    catalog = load_catalog(catalog_path)
    errors = validate_catalog_policy(catalog)
    if errors:
        for error in errors:
            console.print(f"[red]error:[/red] {error}")
        raise typer.Exit(code=1)
    console.print(f"[green]valid[/green] {catalog_path} ({len(catalog.projects)} projects)")


@catalog_app.command("audit-official")
def catalog_audit_official(
    catalog_path: Annotated[
        Path,
        typer.Argument(exists=True, dir_okay=False, readable=True),
    ] = Path("src/awesome_iina/catalog/catalog.yaml"),
    snapshot: Annotated[
        Path,
        typer.Option("--snapshot", exists=True, dir_okay=False, readable=True),
    ] = Path("src/awesome_iina/discovery/snapshots/iina-plugins.json"),
) -> None:
    """Require every plugin in IINA's official index to exist with the same identifier."""

    errors = audit_official_plugins(load_catalog(catalog_path), load_official_plugins(snapshot))
    if errors:
        for error in errors:
            console.print(f"[red]error:[/red] {error}")
        raise typer.Exit(code=1)
    console.print(f"[green]complete[/green] official plugin index coverage ({snapshot})")


@catalog_app.command("generate")
def catalog_generate(
    catalog_path: Annotated[
        Path,
        typer.Argument(exists=True, dir_okay=False, readable=True),
    ] = Path("src/awesome_iina/catalog/catalog.yaml"),
    check: Annotated[
        bool,
        typer.Option("--check", help="Fail rather than write when generated files are stale."),
    ] = False,
    config_path: Annotated[
        Path,
        typer.Option("--config", exists=True, dir_okay=False, readable=True),
    ] = Path("src/awesome_iina/discovery/discovery.yaml"),
) -> None:
    """Generate README.md, src/awesome_iina/catalog/exports/catalog.json, and the JSON Schema."""

    config = load_config(config_path)
    catalog = load_catalog(catalog_path)
    errors = validate_catalog_policy(catalog)
    if errors:
        for error in errors:
            console.print(f"[red]error:[/red] {error}")
        raise typer.Exit(code=1)
    outputs = generated_outputs(
        catalog,
        template_path=config.paths.readme_template,
        readme_path=config.paths.readme,
    )
    changed = write_or_check(outputs, check=check)
    if check and changed:
        for path in changed:
            console.print(f"[red]stale:[/red] {path}")
        raise typer.Exit(code=1)
    for path in outputs:
        console.print(f"[green]{'checked' if check else 'generated'}[/green] {path}")


@catalog_app.command("schema")
def catalog_schema_command(
    output: Annotated[Path, typer.Option("--output", dir_okay=False)] = Path(
        "src/awesome_iina/catalog/schemas/catalog.schema.json"
    ),
) -> None:
    """Write the catalog JSON Schema."""

    write_json(output, catalog_schema())
    console.print(f"[green]generated[/green] {output}")


@app.command("schemas")
def schemas_command(
    output_directory: Annotated[
        Path,
        typer.Option("--output-directory", dir_okay=True, file_okay=False),
    ] = Path("src/awesome_iina/catalog/schemas"),
) -> None:
    """Write JSON Schemas for catalog, discovery, configuration, and media reports."""

    for path, content in schema_outputs(output_directory).items():
        atomic_write_text(path, content)
        console.print(f"[green]generated[/green] {path}")


@media_app.command("doctor")
def media_doctor() -> None:
    """Report availability and versions of supported media inspectors."""

    table = Table("Tool", "Available", "Executable", "Version")
    missing = False
    for tool in tool_availability():
        missing = missing or not tool.available
        table.add_row(
            tool.name,
            "yes" if tool.available else "no",
            tool.executable or "",
            tool.version or "",
        )
    console.print(table)
    if missing:
        console.print(
            "[yellow]Tip:[/yellow] on macOS, install the full toolset with "
            "`brew install ffmpeg mediainfo mkvtoolnix exiftool`."
        )


@media_app.command("inspect")
def media_inspect(
    path: Annotated[Path, typer.Argument(exists=True, dir_okay=False, readable=True)],
    output: Annotated[Path | None, typer.Option("--output", "-o", dir_okay=False)] = None,
    pretty: Annotated[
        bool,
        typer.Option(help="Print normalized metadata to the terminal."),
    ] = False,
) -> None:
    """Collect normalized and raw metadata using every available local inspector."""

    report = inspect_media(path)
    if output:
        write_json(output, report)
        console.print(f"[green]wrote[/green] {output}")
    if pretty or not output:
        console.print_json(
            json.dumps(report.model_dump(mode="json", exclude_none=True), ensure_ascii=False)
        )


brand_app = typer.Typer(help="Verify the supplied brand kit.")
site_app = typer.Typer(help="Build the branded static catalog without network access.")
app.add_typer(brand_app, name="brand")
app.add_typer(site_app, name="site")


@brand_app.command("sync")
def brand_sync_command(
    root: Annotated[Path, typer.Option(file_okay=False)] = Path(),
    check: Annotated[bool, typer.Option("--check")] = False,
) -> None:
    try:
        changed = sync_brand(root.resolve(), check=check)
    except (BrandError, OSError, ValueError) as exc:
        console.print(str(exc), markup=False)
        raise typer.Exit(1) from exc
    for name in changed:
        console.print(f"{'stale' if check else 'updated'}: {name}", markup=False)
    if check and changed:
        raise typer.Exit(1)
    console.print("Brand hashes and primary asset selection verified.")


@site_app.command("build")
def site_build_command(
    root: Annotated[Path, typer.Option(file_okay=False)] = Path(),
    output: Annotated[Path, typer.Option(file_okay=False)] = Path("dist/site"),
) -> None:
    root = root.resolve()
    destination = output if output.is_absolute() else root / output
    try:
        count = build_site(root, destination)
    except (OSError, ValueError) as exc:
        console.print(str(exc), markup=False)
        raise typer.Exit(1) from exc
    console.print(f"Built {count} static files at {destination}", markup=False)


if __name__ == "__main__":
    app()
