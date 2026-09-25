"""Verify the supplied identity kit.

The kit is the only working-tree copy. Site build still emits `dist/site/assets/brand/`.
No kit scripts are run, no fonts are installed, and downstream Copier consumers keep
their own project identities.
"""

from __future__ import annotations

import base64
import hashlib
import json
import os
import re
import tempfile
import xml.etree.ElementTree as ET
from pathlib import Path, PurePosixPath
from typing import Any


class BrandError(ValueError):
    """An identity asset or its provenance failed verification."""


def confined_path(root: Path, relative: str) -> Path:
    """Resolve a non-symlink, relative path strictly within an owned directory."""
    parts = PurePosixPath(relative)
    if (
        not relative
        or parts.is_absolute()
        or ".." in parts.parts
        or "\\" in relative
        or any(ord(c) < 32 for c in relative)
    ):
        raise BrandError(f"unsafe relative path: {relative!r}")
    root = root.resolve()
    target = root.joinpath(*parts.parts)
    current = root
    for part in parts.parts:
        current /= part
        if current.is_symlink():
            raise BrandError(f"symlink is not an identity asset: {relative}")
    if not target.resolve().is_relative_to(root):
        raise BrandError(f"path escapes root: {relative}")
    return target


def _json(path: Path) -> dict[str, Any]:
    result = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(result, dict):
        raise BrandError(f"expected JSON object: {path}")
    return result


def _verify_record(root: Path, item: dict[str, Any]) -> bytes:
    path = confined_path(root, item["path"])
    content = path.read_bytes()
    if len(content) != item["bytes"] or hashlib.sha256(content).hexdigest() != item["sha256"]:
        raise BrandError(f"size/hash mismatch: {item['path']}")
    return content


def validate_svg(content: bytes, name: str) -> None:
    """Reject active content and non-fragment references in deployed SVGs."""
    if b"<!DOCTYPE" in content.upper() or b"<!ENTITY" in content.upper():
        raise BrandError(f"external XML declarations are prohibited: {name}")
    document = ET.fromstring(content)  # noqa: S314
    if document.tag.rsplit("}", 1)[-1] != "svg":
        raise BrandError(f"not an SVG: {name}")
    for node in document.iter():
        if node.tag.rsplit("}", 1)[-1].lower() in {"script", "foreignobject", "iframe"}:
            raise BrandError(f"active SVG element: {name}")
        for key, value in node.attrib.items():
            attr = key.rsplit("}", 1)[-1].lower()
            if attr.startswith("on"):
                raise BrandError(f"active SVG attribute: {name}")
            if attr == "href" and not value.startswith("#"):
                # The supplied social SVG contains one self-contained PNG image.
                if node.tag.rsplit("}", 1)[-1] != "image" or not value.startswith(
                    "data:image/png;base64,"
                ):
                    raise BrandError(f"external SVG reference: {name}")
                raster = base64.b64decode(value.split(",", 1)[1], validate=True)
                if not raster.startswith(b"\x89PNG\r\n\x1a\n") or len(raster) > 5_000_000:
                    raise BrandError(f"invalid embedded PNG: {name}")
            if "url(" in value.lower() and re.search(r"url\(\s*['\"]?(?!#)", value):
                # Allow only literal, local fragment paint-server references.
                for reference in re.findall(r"url\((.*?)\)", value, flags=re.I):
                    if not reference.strip(" \t'\"").startswith("#"):
                        raise BrandError(f"external SVG paint reference: {name}")


def brand_payloads(root: Path) -> dict[str, bytes]:
    """Return verified primary assets and a derived CSS palette; never change the kit."""
    config = _json(root / "src/awesome_iina/site/brand.json")
    kit = confined_path(root, config["kit_path"])
    bundle = _json(kit / "BUNDLE-MANIFEST.json")
    for item in bundle["files"]:
        _verify_record(kit, item)
    selection = _json(confined_path(kit, config["selection_path"]))["primary_assets"]
    if len(selection) != len(set(selection)):
        raise BrandError("duplicate primary asset selection")
    records = {item["path"]: item for item in _json(kit / "ASSET-MANIFEST.json")["assets"]}
    payloads: dict[str, bytes] = {}
    for name in selection:
        if not name.startswith("assets/brand/") or name not in records:
            raise BrandError(f"unmanifested primary asset: {name}")
        content = _verify_record(kit, records[name])
        if Path(name).suffix == ".svg":
            validate_svg(content, name)
        payloads[name] = content
    colors = _json(confined_path(kit, config["tokens_path"]))["colors"]
    declarations = []
    for key, value in colors.items():
        if not re.fullmatch(r"[a-z_]+", key) or not re.fullmatch(r"#[0-9A-Fa-f]{6}", value):
            raise BrandError("invalid color token")
        declarations.append(f"  --brand-{key.replace('_', '-')}: {value};")
    payloads["assets/brand/tokens.css"] = (
        "/* Generated from src/awesome_iina/site/kit/source/tokens.json; do not edit. */\n:root {\n"
        + "\n".join(declarations)
        + "\n}\n"
    ).encode()
    return payloads


def _write_bytes(path: Path, content: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary: Path | None = None
    try:
        with tempfile.NamedTemporaryFile(dir=path.parent, prefix=".brand-", delete=False) as f:
            temporary = Path(f.name)
            f.write(content)
            f.flush()
            os.fsync(f.fileno())
        temporary.chmod(0o644)
        temporary.replace(path)
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)


def sync_brand(root: Path, *, check: bool = False) -> list[str]:
    """Verify kit hashes, SVG policy, and in-memory tokens.css. Never write a second tree."""
    _ = check
    brand_payloads(root)
    return []
