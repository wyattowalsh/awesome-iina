"""Project the Agent Plugins SSOT into Cursor/Claude/Codex/Copilot trees.

This is a byte-deterministic copy with named overlays. It is not Copier.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
CONFIG_PATH = Path(__file__).with_name("agent_kit_projections.json")
FRONTMATTER_END = "\n---\n"


class SyncError(ValueError):
    """Invalid projection path, overlay, or drift."""


def load_config() -> dict[str, object]:
    config = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
    if not isinstance(config.get("projections"), list):
        raise SyncError("agent_kit_projections.json must contain a projections list")
    return config


def resolve_inside(base: Path, relative: str, *, label: str) -> Path:
    raw = Path(relative)
    if raw.is_absolute() or ".." in raw.parts or raw.as_posix().startswith("/"):
        raise SyncError(f"{label} escapes its root: {relative}")
    resolved = (base / raw).resolve()
    if not resolved.is_relative_to(base.resolve()):
        raise SyncError(f"{label} escapes its root: {relative}")
    return resolved


def is_bytecode(path: Path) -> bool:
    """True for CPython cache dirs and compiled files that in-place imports can create."""
    return "__pycache__" in path.parts or path.suffix in {".pyc", ".pyo"}


def is_evals(path: Path) -> bool:
    """True for auditor eval harness trees that must stay on the plugin SSOT only."""
    return "evals" in path.parts


def merge_frontmatter(text: str, extra: str) -> str:
    if not text.startswith("---\n"):
        raise SyncError("SKILL.md is missing YAML frontmatter")
    rest = text[4:]
    end = rest.find(FRONTMATTER_END)
    if end < 0:
        raise SyncError("SKILL.md is missing a closing frontmatter fence")
    body = rest[end + len(FRONTMATTER_END) :]
    existing_lines = [line for line in rest[:end].splitlines() if line.strip()]
    extra_lines = [line for line in extra.splitlines() if line.strip()]
    extra_keys = {line.split(":", 1)[0].strip() for line in extra_lines if ":" in line}
    kept = [line for line in existing_lines if line.split(":", 1)[0].strip() not in extra_keys]
    merged = "\n".join([*kept, *extra_lines])
    return f"---\n{merged}\n---\n{body}"


def expected_files(config: dict[str, object]) -> dict[Path, bytes]:
    plugin_root = resolve_inside(REPO, str(config["plugin_root"]), label="plugin_root")
    overlays_dir = resolve_inside(REPO, str(config["overlays_dir"]), label="overlays_dir")
    files: dict[Path, bytes] = {}
    for projection in config["projections"]:
        if not isinstance(projection, dict):
            raise SyncError("each projection must be an object")
        src = resolve_inside(plugin_root, str(projection["from"]), label="from")
        dest = resolve_inside(REPO, str(projection["to"]), label="to")
        overlay = projection.get("overlay")
        produced: dict[Path, bytes] = {}
        if src.is_file():
            produced[dest] = src.read_bytes()
        elif src.is_dir():
            for path in sorted(src.rglob("*")):
                if not path.is_file() or is_bytecode(path) or is_evals(path):
                    continue
                produced[dest / path.relative_to(src)] = path.read_bytes()
        else:
            raise SyncError(f"missing projection source: {src.relative_to(REPO)}")
        if overlay == "claude-package":
            skill = dest / "SKILL.md" if src.is_dir() else dest
            extra = (overlays_dir / "claude-package.frontmatter.yaml").read_text(encoding="utf-8")
            produced[skill] = merge_frontmatter(produced[skill].decode("utf-8"), extra).encode()
        elif overlay == "codex-package":
            produced[dest / "agents" / "openai.yaml"] = (
                overlays_dir / "codex-package.openai.yaml"
            ).read_bytes()
        elif overlay not in {None, ""}:
            raise SyncError(f"unknown overlay: {overlay}")
        for path, payload in produced.items():
            if not path.resolve().is_relative_to(REPO.resolve()):
                raise SyncError(f"projected path escaped the repository: {path}")
            files[path] = payload
    return files


def owned_directories(config: dict[str, object]) -> list[Path]:
    """Directory projections own their destination tree; file projections do not prune siblings."""
    plugin_root = resolve_inside(REPO, str(config["plugin_root"]), label="plugin_root")
    roots = []
    for projection in config["projections"]:
        src = resolve_inside(plugin_root, str(projection["from"]), label="from")
        dest = resolve_inside(REPO, str(projection["to"]), label="to")
        if src.is_dir():
            roots.append(dest)
    return roots


def extra_files(config: dict[str, object], expected: dict[Path, bytes]) -> list[Path]:
    extras: list[Path] = []
    expected_set = set(expected)
    seen: set[Path] = set()
    for root in owned_directories(config):
        if not root.is_dir():
            continue
        for path in root.rglob("*"):
            if (
                path.is_file()
                and not is_bytecode(path)
                and path not in expected_set
                and path not in seen
            ):
                seen.add(path)
                extras.append(path)
    return sorted(extras)


def apply(config: dict[str, object]) -> dict[str, object]:
    expected = expected_files(config)
    for path, payload in expected.items():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(payload)
    removed = 0
    for extra in extra_files(config, expected):
        extra.unlink()
        removed += 1
    return {"mode": "apply", "files": len(expected), "removed_extras": removed}


def check(config: dict[str, object]) -> dict[str, object]:
    expected = expected_files(config)
    missing: list[str] = []
    mismatched: list[str] = []
    for path, payload in expected.items():
        relative = path.relative_to(REPO).as_posix()
        if not path.is_file():
            missing.append(relative)
        elif path.read_bytes() != payload:
            mismatched.append(relative)
    extras = [path.relative_to(REPO).as_posix() for path in extra_files(config, expected)]
    if missing or mismatched or extras:
        raise SyncError(
            json.dumps(
                {"missing": missing, "mismatched": mismatched, "extra": extras},
                indent=2,
            )
        )
    return {"mode": "check", "files": len(expected), "status": "passed"}


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--apply", action="store_true", help="write projected files")
    group.add_argument("--check", action="store_true", help="require projections to match SSOT")
    args = parser.parse_args(argv)
    try:
        config = load_config()
        result = apply(config) if args.apply else check(config)
    except (OSError, SyncError, KeyError, json.JSONDecodeError) as error:
        print(str(error), file=sys.stderr)
        return 1
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
