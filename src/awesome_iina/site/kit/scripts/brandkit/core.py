"""Shared path, deployment, file-integrity and serialization contracts."""
from __future__ import annotations

import hashlib
import html
import json
import os
import re
import tempfile
from pathlib import Path, PurePosixPath
from urllib.parse import quote, unquote, urljoin, urlsplit

KIT_ROOT = Path(__file__).resolve().parents[2]
BEGIN = "<!-- awesome-iina:brand:start -->"
END = "<!-- awesome-iina:brand:end -->"
STATE_DIR = ".awesome-iina-brand"


class BrandError(ValueError):
    """A safe, actionable validation or transaction failure."""


def json_bytes(value: object) -> bytes:
    return (json.dumps(value, indent=2, sort_keys=True, ensure_ascii=False) + "\n").encode()


def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def read_json(path: Path) -> dict:
    value = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise BrandError(f"Expected a JSON object: {path.name}")
    return value


def relative_path(value: str, *, allow_empty: bool = False) -> str:
    """Accept ordinary relative paths, not traversal, encoded paths or Windows drives."""
    if allow_empty and value in ("", "."):
        return ""
    if not isinstance(value, str) or not value or any(ord(c) < 32 for c in value):
        raise BrandError("Expected a nonempty relative path")
    if value.startswith(("/", "\\")) or any(c in value for c in "\\:%?#"):
        raise BrandError(f"Unsafe relative path: {value!r}")
    if any(part in ("", ".", "..") for part in value.split("/")):
        raise BrandError(f"Unsafe path component: {value!r}")
    if any(part.casefold() == ".git" for part in value.split("/")):
        raise BrandError("Git internals are not integration targets")
    return PurePosixPath(value).as_posix()


def safe_target(root: Path, relative: str) -> Path:
    """Refuse file and parent symlinks rather than resolving outside a local target."""
    rel = relative_path(relative)
    current = root
    for part in rel.split("/"):
        current = current / part
        if current.is_symlink():
            raise BrandError(f"Symlink is not an integration target: {rel}")
        if current.exists() and current != root / rel and not current.is_dir():
            raise BrandError(f"Parent component is not a directory: {rel}")
    if current.exists() and not current.is_file():
        raise BrandError(f"Expected a regular file destination: {rel}")
    return current


def atomic_write(path: Path, data: bytes, *, mode: int | None = None) -> None:
    """Replace one regular file; callers perform batch preflight and journaling."""
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, temp = tempfile.mkstemp(prefix=".brand-tmp-", dir=path.parent)
    try:
        with os.fdopen(fd, "wb") as handle:
            handle.write(data)
            handle.flush()
            os.fsync(handle.fileno())
        os.chmod(temp, mode if mode is not None else 0o644)
        os.replace(temp, path)
    finally:
        Path(temp).unlink(missing_ok=True)


def current_hash(path: Path) -> str | None:
    return sha(path.read_bytes()) if path.is_file() else None


def canonical_url(value: str) -> str:
    """Require a public-style HTTPS directory URL; no placeholders or hidden traversal."""
    if not isinstance(value, str) or any(c.isspace() or c in '<>"\\\'{}' for c in value):
        raise BrandError("Site URL contains unsafe or placeholder characters")
    p = urlsplit(value)
    if p.scheme != "https" or not p.hostname or p.username or p.password or p.query or p.fragment:
        raise BrandError("Site URL must be an HTTPS directory URL without credentials, query or fragment")
    try:
        _ = p.port
    except ValueError as exc:
        raise BrandError("Invalid site URL port") from exc
    if not p.path.endswith("/"):
        raise BrandError("Site URL must end with /, including at the origin root")
    decoded = unquote(p.path)
    if decoded != p.path or "//" in p.path or any(x in (".", "..") for x in p.path.split("/")):
        raise BrandError("Use an unencoded, traversal-free site base path")
    if not re.fullmatch(r"/[A-Za-z0-9._~/-]*", p.path):
        raise BrandError("Unsupported site path; use ASCII path segments")
    return value


def asset_records(kit: Path) -> list[dict]:
    """Load and verify all manifest-listed delivery bytes, rejecting unexpected paths."""
    manifest = read_json(kit / "ASSET-MANIFEST.json")
    records = manifest.get("assets")
    if not isinstance(records, list) or not records:
        raise BrandError("Asset manifest is empty")
    seen: set[str] = set()
    for record in records:
        rel = relative_path(record["path"])
        if not rel.startswith("assets/brand/") or rel in seen:
            raise BrandError(f"Invalid or duplicate production asset: {rel}")
        seen.add(rel)
        p = safe_target(kit, rel)
        if not p.is_file() or current_hash(p) != record["sha256"] or p.stat().st_size != record["bytes"]:
            raise BrandError(f"Asset bytes do not match the kit manifest: {rel}")
    return records


def app_identity(value: str) -> str:
    """Validate the kit's explicit root-relative ID policy without changing its identity.

    This is intentionally a supported subset of manifest URL syntax, not a full
    browser manifest parser. Identity can lie outside the launch scope. Trailing
    slashes are preserved rather than silently normalized.
    """
    if not isinstance(value, str) or not value.startswith("/") or value.startswith("//"):
        raise BrandError("App ID must be an explicit origin-relative path beginning with /")
    if not re.fullmatch(r"/[A-Za-z0-9._~/-]*", value) or "//" in value:
        raise BrandError("App ID must be an unencoded ASCII path without query, fragment or credentials")
    if any(part in (".", "..") for part in value.split("/")):
        raise BrandError("App ID may not contain dot segments")
    return value


def selected_asset_records(kit: Path, *, include_legacy_hero: bool = False) -> list[dict]:
    """Apply an exact, audited shipping allowlist to verified production records."""
    records = asset_records(kit)
    selection = read_json(kit / "source/shipping-selection.json")
    if selection.get("schema_version") != 1:
        raise BrandError("Unsupported shipping-selection schema")
    primary, optional = selection.get("primary_assets"), selection.get("optional_assets")
    if not isinstance(primary, list) or not primary or not isinstance(optional, list):
        raise BrandError("Shipping selection requires primary and optional asset arrays")
    paths = [relative_path(name) for name in primary + optional]
    if len(paths) != len(set(paths)) or set(paths) != {r["path"] for r in records}:
        raise BrandError("Shipping selection must classify every asset exactly once")
    selected = set(primary + (optional if include_legacy_hero else []))
    return [r for r in records if r["path"] in selected]


def render_site(kit: Path, site_url: str, social: str = "github", *,
                app_id: str | None = None) -> dict[str, bytes]:
    """Return configured snippets without changing sources or claiming deployment."""
    site_url = canonical_url(site_url)
    deployment = read_json(kit / "source/deployment.json")
    identity = app_identity(deployment.get("app_id") if app_id is None else app_id)
    choice = {
        "github": ("github-social-preview-1280x640.png", 1280, 640),
        "opengraph": ("open-graph-1200x630.png", 1200, 630),
    }
    if social not in choice:
        raise BrandError("Social image must be github or opengraph")
    image, width, height = choice[social]
    source = kit / "assets/brand" / image
    if not source.is_file():
        raise BrandError(f"Missing selected social image: {image}")
    # Use one documented template; substitutions are escaped attribute values.
    template = (kit / "source/website-head.template.html").read_text(encoding="utf-8")
    substitutions = {
        "BASE_URL": site_url,
        "BASE_PATH": urlsplit(site_url).path,
        "SOCIAL_URL": urljoin(site_url, "assets/brand/" + image),
        "SOCIAL_WIDTH": str(width),
        "SOCIAL_HEIGHT": str(height),
    }
    for key, value in substitutions.items():
        template = template.replace("{{" + key + "}}", html.escape(value, quote=True))
    if "{{" in template or "}}" in template:
        raise BrandError("Unresolved website template variable")
    manifest = read_json(kit / "source/manifest.template.json")
    if manifest.get("id") != "{{APP_ID}}":
        raise BrandError("Manifest template must use {{APP_ID}}; edit source/deployment.json for identity")
    manifest["id"] = identity
    # start_url/scope and icon sources resolve against the MANIFEST URL. The ID
    # instead resolves against the ORIGIN of start_url, per manifest semantics.
    manifest_url = urljoin(site_url, "assets/brand/site.webmanifest")
    start_url = urljoin(manifest_url, manifest["start_url"])
    scope_url = urljoin(manifest_url, manifest["scope"])
    parsed_start = urlsplit(start_url)
    origin = f"{parsed_start.scheme}://{parsed_start.netloc}/"
    config = {
        "schema_version": 1,
        "site_url": site_url,
        "app_id": identity,
        "resolved_app_id": urljoin(origin, identity),
        "manifest_url": manifest_url,
        "resolved_start_url": start_url,
        "resolved_scope": scope_url,
        "identity_policy": "Configured stable identity; not recomputed from launch location or kit version",
        "manifest_resolution_method": "URL computation, not native browser manifest processing",
        "base_path": urlsplit(site_url).path,
        "social_image": "assets/brand/" + image,
        "social_width": width,
        "social_height": height,
        "social_sha256": current_hash(source),
        "status": "intended configuration, not verified public deployment",
        "icon_purpose": "any; no maskable or installability claim",
    }
    return {"website-head.html": (template.rstrip() + "\n").encode(),
            "site.webmanifest": json_bytes(manifest), "deployment.json": json_bytes(config)}


def readme_block(asset_path: str, readme_at: str) -> bytes:
    """Provide live meaning plus the canonical wordmark; no old competing primary mark."""
    folder = PurePosixPath(readme_at).parent
    prefix = os.path.relpath(asset_path, folder.as_posix()).replace(os.sep, "/")
    prefix = quote(prefix, safe="/.-_~")
    return f'''{BEGIN}
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="{prefix}/wordmark-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="{prefix}/wordmark-light.svg">
  <img src="{prefix}/wordmark-light.svg" alt="" width="400" height="64">
</picture>

**Awesome IINA — an independent catalog for the IINA ecosystem.**

Plugins, playback workflows, shaders, media tools, automation, and developer resources.
Not affiliated with the IINA project.
{END}'''.encode()


def merge_readme(original: bytes, block: bytes) -> bytes:
    """Preserve every byte outside a managed marker region, including BOM and CRLF."""
    bom = b"\xef\xbb\xbf" if original.startswith(b"\xef\xbb\xbf") else b""
    body = original[len(bom):]
    body.decode("utf-8")  # Never silently corrupt a differently encoded README.
    newline = b"\r\n" if b"\r\n" in body else b"\n"
    block = block.replace(b"\r\n", b"\n").replace(b"\n", newline)
    start, end = BEGIN.encode(), END.encode()
    count = (body.count(start), body.count(end))
    if count == (0, 0):
        return bom + block + newline * 2 + body
    if count != (1, 1) or body.index(start) > body.index(end):
        raise BrandError("README has duplicate, reversed or incomplete brand markers")
    a, b = body.index(start), body.index(end) + len(end)
    return bom + body[:a] + block + body[b:]
