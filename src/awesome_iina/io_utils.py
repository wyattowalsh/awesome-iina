from __future__ import annotations

import json
import os
import tempfile
from pathlib import Path
from typing import Any

import yaml
from pydantic import BaseModel, TypeAdapter


def read_yaml(path: Path) -> Any:
    return yaml.safe_load(path.read_text(encoding="utf-8"))


def write_yaml(path: Path, value: Any) -> None:
    if isinstance(value, BaseModel):
        value = value.model_dump(mode="json", exclude_none=True)
    text = yaml.safe_dump(
        value,
        allow_unicode=True,
        sort_keys=False,
        width=100,
    )
    atomic_write_text(path, text)


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(
    path: Path,
    value: Any,
    *,
    exclude_none: bool = True,
    exclude_unset: bool = False,
) -> None:
    if isinstance(value, BaseModel):
        value = value.model_dump(
            mode="json",
            exclude_none=exclude_none,
            exclude_unset=exclude_unset,
        )
    text = json.dumps(value, indent=2, ensure_ascii=False, sort_keys=True) + "\n"
    atomic_write_text(path, text)


def load_model[T](path: Path, model: type[T]) -> T:
    data = read_yaml(path) if path.suffix in {".yaml", ".yml"} else read_json(path)
    return TypeAdapter(model).validate_python(data)


def atomic_write_text(path: Path, text: str) -> None:
    """Atomically replace a UTF-8 text file while preserving normal file permissions."""

    path.parent.mkdir(parents=True, exist_ok=True)
    mode = path.stat().st_mode & 0o777 if path.exists() else 0o644
    temporary: Path | None = None
    try:
        with tempfile.NamedTemporaryFile(
            mode="w",
            encoding="utf-8",
            dir=path.parent,
            prefix=f".{path.name}.",
            delete=False,
        ) as handle:
            temporary = Path(handle.name)
            handle.write(text)
            handle.flush()
            os.fsync(handle.fileno())
        temporary.chmod(mode)
        temporary.replace(path)
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)
