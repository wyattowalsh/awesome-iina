"""Validate complete template source and render 32 offline fixture shapes.

This is not Copier copy/update, installed-toolchain integration, or native IINA testing.
"""

from __future__ import annotations

import itertools
import json
import sys
import tempfile
import tomllib
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))
from tools.fixture_render import PRESETS, render  # noqa: E402
from tools.sync_agent_kit import SyncError, load_config  # noqa: E402
from tools.sync_agent_kit import check as check_agent_kit  # noqa: E402
from tools.verify_workflows import verify  # noqa: E402

REQUIRED = (
    "copier.yml",
    "toolchain.json",
    "template/package.json.jinja",
    "template/Info.json.jinja",
    "template/src/main/index.ts.jinja",
    "template/src/shared/protocol.ts",
    "template/scripts/build.mjs",
    "template/scripts/validate.mjs",
    "template/scripts/template-update.mjs",
    "template/tests/contracts/stage.test.mjs",
    "tests/test_real_copier.py",
    "tools/integration_matrix.py",
    "tools/bundle.py",
    "plugins/iina-plugin-dev/plugin.json",
    "tools/sync_agent_kit.py",
    "tools/agent_kit_projections.json",
    "template/.cursor/hooks.json",
    "template/scripts/agent-guard.mjs",
)
CONSUMER_COPIER_PIN_PATHS = (
    "template/scripts/template-update.mjs",
    "template/package.json.jinja",
)


def assert_consumer_copier_pins(root: Path, copier: str) -> None:
    expected = f"copier=={copier}"
    for relative in CONSUMER_COPIER_PIN_PATHS:
        if expected not in (root / relative).read_text():
            raise ValueError(f"{relative} Copier pin disagrees with toolchain.json")


def verify_source() -> dict[str, object]:
    missing = [name for name in REQUIRED if not (ROOT / name).is_file()]
    if missing:
        raise ValueError(f"incomplete Copier source: {missing}")
    try:
        check_agent_kit(load_config())
    except SyncError as error:
        raise ValueError(f"agent kit projection drift: {error}") from error
    config = yaml.safe_load((ROOT / "copier.yml").read_text())
    if config.get("_subdirectory") != "template":
        raise ValueError("standalone template directory changed")
    for key in ("_tasks", "_migrations", "_jinja_extensions"):
        if config.get(key):
            raise ValueError(f"baseline has no automatic executable surface: {key}")
    tools = json.loads((ROOT / "toolchain.json").read_text())
    project = tomllib.loads((ROOT / "pyproject.toml").read_text())
    if f"copier=={tools['copier']}" not in project["project"]["dependencies"]:
        raise ValueError("Copier dependency pin disagrees with toolchain.json")
    if config.get("_min_copier_version") != tools["copier"]:
        raise ValueError("minimum Copier version differs from tested target")
    assert_consumer_copier_pins(ROOT, tools["copier"])
    registry = json.loads((ROOT / "references/action-pins.json").read_text())
    for file in (ROOT / ".github/workflows").glob("*.yml"):
        errors = verify(file, registry)
        if errors:
            raise ValueError("\n".join(errors))
    count = 0
    with tempfile.TemporaryDirectory(prefix="iina source fixture ") as temporary:
        for preset, preferences, docs, hooks in itertools.product(
            PRESETS, (False, True), ("markdown", "starlight"), (False, True)
        ):
            dest = Path(temporary) / str(count)
            render(
                dest,
                {
                    "preset": preset,
                    "preferences": preferences,
                    "docs_profile": docs,
                    "hooks": hooks,
                },
            )
            for path in dest.rglob("*.json"):
                json.loads(path.read_text())
            manifest = json.loads((dest / "Info.json").read_text())
            package = json.loads((dest / "package.json").read_text())
            expected = ["video-overlay"] if preset == "overlay" else []
            if manifest["permissions"] != expected:
                raise ValueError(f"baseline permission expansion in {preset}")
            if ("globalEntry" in manifest) != (preset == "controller"):
                raise ValueError(f"global runtime declaration mismatch in {preset}")
            if package["packageManager"] != f"pnpm@{tools['pnpm']}":
                raise ValueError("package-manager pin drift")
            if not (dest / ".github/CONTRIBUTING.md").is_file():
                raise ValueError("generated community documents missing")
            if not (dest / ".cursor/hooks.json").is_file():
                raise ValueError("generated Cursor hooks missing")
            if not (dest / ".cursor/skills/iina-development/SKILL.md").is_file():
                raise ValueError("generated Cursor development skill missing")
            if (dest / ".cursor/skills/iina-generate").exists():
                raise ValueError("generated tree must not include iina-generate")
            for file in (dest / ".github/workflows").glob("*.yml"):
                errors = verify(file, registry)
                if errors:
                    raise ValueError("\n".join(errors))
            count += 1
    return {
        "layer": "source-and-offline-fixture-contracts",
        "status": "passed",
        "shapes": count,
        "real_copier": "not-run",
        "native": "not-run",
    }


if __name__ == "__main__":
    try:
        print(json.dumps(verify_source(), indent=2))
    except (OSError, ValueError, KeyError) as error:
        print(str(error), file=sys.stderr)
        raise SystemExit(1) from error
