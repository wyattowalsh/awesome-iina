#!/usr/bin/env python3
"""Create a deterministic full-kit or production-delivery ZIP with file hashes.

No font binaries, credentials, symlinks, repository state, existing ZIPs or caches
are included. File exclusions do not constitute a general-purpose secret scan.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import tempfile
import zipfile
from pathlib import Path

from brandkit.core import selected_asset_records

FONT_EXT = {".ttf", ".otf", ".woff", ".woff2", ".ttc"}
FONT_MAGIC = {b"OTTO", b"wOFF", b"wOF2", b"ttcf", b"\x00\x01\x00\x00"}
EXCLUDE_PARTS = {
    "__pycache__", ".DS_Store", ".git", ".venv", ".cache", ".pytest_cache",
    ".ruff_cache", ".awesome-iina-brand", "dist", "node_modules", ".mypy_cache",
}
SECRET_SUFFIXES = {".key", ".pem", ".p12", ".pfx", ".sqlite3", ".db"}
ROOT_METADATA = {"BUNDLE-MANIFEST.json", "SHA256SUMS-v2.txt", "SHA256SUMS-v2", "SHA256SUMS"}


def sha(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()


def collect(root: Path, out: Path, *, delivery: bool = False) -> dict[str, bytes]:
    payload = {}
    selected = {r["path"] for r in selected_asset_records(root)} if delivery else set()
    for file in sorted(root.rglob("*")):
        rel = file.relative_to(root)
        if any(part in EXCLUDE_PARTS for part in rel.parts):
            continue
        if file.is_symlink() or any(parent.is_symlink() for parent in file.parents if parent != root.parent):
            raise ValueError(f"Symlink must not be packaged: {rel}")
        if not file.is_file() or file == out:
            continue
        if file.suffix.lower() in {".zip", ".pyc", ".sha256"} | SECRET_SUFFIXES:
            continue
        if file.name.startswith(".env") and file.name != ".env.example":
            continue
        if file.name in {".coverage", "credentials.json"} or (len(rel.parts) == 1 and file.name in ROOT_METADATA):
            continue
        if delivery and not (rel.as_posix() in selected or
                             rel.as_posix() in {"integration/website-head.html", "integration/brand.css",
                                               "REPO-README-PREFIX.md", "source/release.json", "docs/ASSET-USE.md"}):
            continue
        raw = file.read_bytes()
        if file.suffix.lower() in FONT_EXT or raw[:4] in FONT_MAGIC:
            raise ValueError(f"Font binaries must not be distributed: {rel}")
        payload[rel.as_posix()] = raw
    if not payload:
        raise ValueError("No files selected for packaging")
    if delivery:
        payload["README.md"] = (
            "# Awesome IINA production assets\n\n"
            "Copy assets/brand/ into your repository or framework public/ directory.\n"
            "Only current primary assets are included; the historical hero remains in the full kit.\n"
            "The manifest ID is /awesome-iina/ by default; use the full kit configure_site tool for another stable identity.\n"
            "The README prefix is a snippet, not a replacement for your catalog.\n"
            "The website head targets the intended URL; adapt it before publishing.\n"
            "It is separate from GitHub's repository social-preview setting.\n\n"
            "No scripts or design sources are required to use the PNG, ICO or outlined SVG files.\n"
            "The full brand kit additionally includes editable sources, installer, tests, and provenance.\n"
            "Owner adoption, live publication and browser/device acceptance are not asserted.\n"
        ).encode()
    if delivery:
        payload["DELIVERY-SELECTION.json"] = (json.dumps({
            "schema_version": 1, "included_assets": sorted(selected),
            "historical_hero_included": False,
            "policy": "Current primary identity only; no new public artwork license granted",
            "asset_use_document": "docs/ASSET-USE.md"
        }, indent=2, sort_keys=True) + "\n").encode()
    return payload


def package(root: Path, out: Path, *, delivery: bool = False) -> dict:
    root, out = root.resolve(strict=True), out.absolute()
    if out.is_symlink():
        raise ValueError("Output must not be a symlink")
    config = json.loads((root / "source/release.json").read_text())
    payload = collect(root, out, delivery=delivery)
    archive_root = ("awesome-iina-production-assets-" + config["revision"] if delivery else config["archive_root"])
    if "/" in archive_root or "\\" in archive_root or archive_root in {".", ".."}:
        raise ValueError("Invalid archive root")
    manifest = {
        "schema_version": 2, "revision": config["revision"], "identity_revision": config["identity_revision"],
        "root": archive_root, "kind": "production-delivery" if delivery else "full-brand-kit",
        "date": config["date"], "source_files": len(payload),
        "hash_exclusions": ["BUNDLE-MANIFEST.json", "SHA256SUMS"], "font_binaries_included": False,
        "files": [{"path": name, "bytes": len(raw), "sha256": sha(raw)} for name, raw in sorted(payload.items())],
    }
    payload["BUNDLE-MANIFEST.json"] = (json.dumps(manifest, indent=2, sort_keys=True) + "\n").encode()
    payload["SHA256SUMS"] = "".join(f"{sha(raw)}  {name}\n" for name, raw in sorted(payload.items())).encode()
    out.parent.mkdir(parents=True, exist_ok=True)
    fd, temporary = tempfile.mkstemp(prefix=".brand-bundle-", suffix=".tmp", dir=out.parent)
    os.close(fd)
    try:
        with zipfile.ZipFile(temporary, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
            for name, raw in sorted(payload.items()):
                info = zipfile.ZipInfo(archive_root + "/" + name, date_time=(2026, 9, 16, 0, 0, 0))
                info.create_system = 3
                info.external_attr = 0o100644 << 16
                info.compress_type = zipfile.ZIP_DEFLATED
                archive.writestr(info, raw, compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)
        os.replace(temporary, out)
    finally:
        Path(temporary).unlink(missing_ok=True)
    digest = sha(out.read_bytes())
    out.with_suffix(out.suffix + ".sha256").write_text(f"{digest}  {out.name}\n")
    return {"path": str(out), "sha256": digest, "archive_entries": len(payload),
            "payload_files": manifest["source_files"], "bytes": out.stat().st_size, "kind": manifest["kind"]}


if __name__ == "__main__":
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    p.add_argument("--output", type=Path, required=True)
    p.add_argument("--delivery-only", action="store_true")
    args = p.parse_args()
    print(json.dumps(package(args.root, args.output, delivery=args.delivery_only), indent=2))
