from __future__ import annotations

from pathlib import Path

from awesome_iina.repo import archive


def load_archive_module():
    return archive


def create_minimal_source_tree(root: Path) -> None:
    required = set(load_archive_module()._REQUIRED_SOURCE_MEMBERS)
    required.update(f"src/awesome_iina/module_{index}.py" for index in range(7))
    required.update(f"tests/repo/test_extra_{index}.py" for index in range(8))
    for relative in required:
        path = root / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(f"# {relative}\n")
