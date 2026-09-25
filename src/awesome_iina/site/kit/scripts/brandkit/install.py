"""Reviewed local installation plans, backups, optimistic conflict checks and undo.

No remote APIs, subprocesses, shell commands, builds or repository publication.
The lock coordinates this tool only; unrelated editors must not write target files
while applying. A per-file precondition check detects intervening changes.
"""
from __future__ import annotations

import contextlib
import json
import os
from datetime import UTC, datetime
from pathlib import Path

from .core import (
    KIT_ROOT, STATE_DIR, BrandError, asset_records, atomic_write, current_hash,
    json_bytes, merge_readme, read_json, readme_block, relative_path, render_site,
    safe_target, sha, selected_asset_records,
)


def normalize_options(target: Path, *, kit: Path = KIT_ROOT,
                      site_url: str | None = None, social: str = "github",
                      app_id: str | None = None, include_legacy_hero: bool = False,
                      readme: str = "README.md", rendered_readme: str = "README.md",
                      public_dir: str = "", replace_existing: bool = False) -> dict:
    if target.is_symlink() or not target.is_dir():
        raise BrandError("Target must be an existing directory, not a symlink")
    target = target.resolve()
    if target == kit.resolve() or kit.resolve().is_relative_to(target) or target.is_relative_to(kit.resolve()):
        raise BrandError("Install into a separate project, not this kit or its parent")
    readme = relative_path(readme)
    rendered_readme = relative_path(rendered_readme)
    public_dir = relative_path(public_dir, allow_empty=True)
    if not readme.lower().endswith(".md") or not rendered_readme.lower().endswith(".md"):
        raise BrandError("README paths must identify Markdown files")
    if readme.startswith((STATE_DIR + "/", "assets/brand/", "integration/awesome-iina-brand/")):
        raise BrandError("README path conflicts with managed delivery paths")
    if public_dir.startswith(STATE_DIR) or public_dir.startswith("integration/"):
        raise BrandError("Public directory conflicts with integration bookkeeping")
    if not safe_target(target, readme).is_file():
        raise BrandError("README or chosen README source must already exist")
    deployment = read_json(kit / "source/deployment.json")
    site_url = site_url or deployment["project_url"]
    rendered = render_site(kit, site_url, social, app_id=app_id)
    resolved_id = json.loads(rendered["deployment.json"])["app_id"]
    return dict(target=str(target), site_url=site_url, social=social, app_id=resolved_id,
                include_legacy_hero=bool(include_legacy_hero), readme=readme,
                rendered_readme=rendered_readme, public_dir=public_dir,
                replace_existing=bool(replace_existing))


def payloads(kit: Path, options: dict) -> dict[str, bytes]:
    target = Path(options["target"])
    records = selected_asset_records(kit, include_legacy_hero=options["include_legacy_hero"])
    prefix = options["public_dir"] + "/" if options["public_dir"] else ""
    result = {prefix + r["path"]: (kit / r["path"]).read_bytes() for r in records}
    rendered = render_site(kit, options["site_url"], options["social"], app_id=options["app_id"])
    # Generate actual manifest from the same source, even with a custom URL prefix.
    result[prefix + "assets/brand/site.webmanifest"] = rendered["site.webmanifest"]
    for name in ("website-head.html", "deployment.json"):
        result["integration/awesome-iina-brand/" + name] = rendered[name]
    original = safe_target(target, options["readme"]).read_bytes()
    result[options["readme"]] = merge_readme(
        original, readme_block(prefix + "assets/brand", options["rendered_readme"]))
    return result


def source_fingerprint(kit: Path) -> str:
    names = [r["path"] for r in asset_records(kit)]
    names += ["source/shipping-selection.json", "source/release.json", "source/deployment.json", "source/manifest.template.json",
              "source/website-head.template.html", "scripts/brandkit/core.py",
              "scripts/brandkit/install.py"]
    return sha(json_bytes({name: current_hash(safe_target(kit, name)) for name in sorted(names)}))


def managed_hashes(target: Path) -> dict[str, set[str]]:
    """Only files recorded in successful local receipts may be auto-updated."""
    state = target / STATE_DIR
    if state.is_symlink():
        raise BrandError("State directory may not be a symlink")
    records: dict[str, set[str]] = {}
    directory = state / "transactions"
    if directory.is_symlink():
        raise BrandError("Transaction directory may not be a symlink")
    for receipt in sorted(directory.glob("*/receipt.json")):
        if receipt.is_symlink() or receipt.parent.is_symlink():
            raise BrandError("Receipt path may not be a symlink")
        data = read_json(receipt)
        if data.get("status") == "applied":
            for item in data["changes"]:
                records.setdefault(item["path"], set()).add(item["after_sha256"])
    return records


def create_plan(*, kit: Path = KIT_ROOT, **kwargs) -> dict:
    options = normalize_options(kit=kit, **kwargs)
    target = Path(options["target"])
    content = payloads(kit, options)
    managed = managed_hashes(target)
    changes = []
    for relative, data in sorted(content.items()):
        file = safe_target(target, relative)
        before, after = current_hash(file), sha(data)
        if before == after:
            action = "unchanged"
        elif before is None:
            action = "create"
        elif relative == options["readme"]:
            action = "merge-managed-block"
        elif before in managed.get(relative, set()) or options["replace_existing"]:
            action = "replace-with-backup"
        else:
            action = "conflict"
        changes.append({"path": relative, "action": action, "before_sha256": before,
                        "after_sha256": after, "bytes_after": len(data),
                        "before_mode": file.stat().st_mode & 0o777 if file.exists() else None})
    result = {
        "schema_version": 1, "kit_revision": read_json(kit / "source/release.json")["revision"],
        "source_fingerprint": source_fingerprint(kit), "options": options,
        "changes": changes, "conflicts": [x["path"] for x in changes if x["action"] == "conflict"],
        "target_writes_performed": False,
        "note": "Plan only. No build, network operation, Git action or website publication.",
    }
    result["plan_id"] = sha(json_bytes(result))
    return result


def options_from_plan(value: dict) -> dict:
    if value.get("schema_version") != 1 or not isinstance(value.get("options"), dict):
        raise BrandError("Unsupported integration plan")
    kwargs = dict(value["options"])
    kwargs["target"] = Path(kwargs["target"])
    return kwargs


def receipt_path(target: Path, plan_id: str) -> Path:
    if len(plan_id) != 64 or any(x not in "0123456789abcdef" for x in plan_id):
        raise BrandError("Invalid plan ID")
    return safe_target(target, f"{STATE_DIR}/transactions/{plan_id}/receipt.json")


@contextlib.contextmanager
def target_lock(target: Path):
    lock = safe_target(target, f"{STATE_DIR}/LOCK")
    lock.parent.mkdir(parents=True, exist_ok=True)
    try:
        fd = os.open(lock, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
    except FileExistsError as exc:
        raise BrandError("Another installer or stale lock exists; review it before retrying") from exc
    try:
        os.write(fd, f"pid={os.getpid()}\n".encode())
        os.close(fd)
        yield
    finally:
        lock.unlink(missing_ok=True)


def validate_receipt(path: Path) -> tuple[Path, dict]:
    if path.is_symlink():
        raise BrandError("Receipt must not be a symlink")
    data = read_json(path)
    target = Path(data["options"]["target"])
    if not target.is_dir() or target.is_symlink() or target.resolve() != target:
        raise BrandError("Receipt target is no longer the same local directory")
    if path.absolute() != receipt_path(target, data["plan_id"]):
        raise BrandError("Receipt is outside its recorded target transaction directory")
    if data.get("status") not in {"applied", "applying", "undoing", "recovery-needed", "rolled-back", "undone"}:
        raise BrandError("Unknown receipt status")
    plan = data.get("plan", {})
    unhashed = {k: v for k, v in plan.items() if k != "plan_id"}
    if plan.get("plan_id") != data["plan_id"] or sha(json_bytes(unhashed)) != data["plan_id"]:
        raise BrandError("Receipt plan fingerprint is inconsistent")
    if plan.get("options") != data["options"]:
        raise BrandError("Receipt target options differ from its original plan")
    planned = {x["path"]: x for x in plan["changes"]}
    if len(data["changes"]) != len(planned):
        raise BrandError("Receipt change inventory differs from its plan")
    seen = set()
    for item in data["changes"]:
        if {k: v for k, v in item.items() if k != "backup"} != planned.get(item["path"]):
            raise BrandError("Receipt changes differ from the reviewed plan")
        relative = relative_path(item["path"])
        if relative in seen or relative.startswith(STATE_DIR + "/"):
            raise BrandError("Receipt contains duplicate or internal-state destinations")
        seen.add(relative)
        safe_target(target, relative)
        backup = item.get("backup")
        if item["action"] != "unchanged" and item["before_sha256"] is not None and not backup:
            raise BrandError("Changed existing file lacks its required backup")
        if backup:
            expected = f"{STATE_DIR}/transactions/{data['plan_id']}/backup/{relative}"
            if backup != expected:
                raise BrandError("Receipt backup path is inconsistent")
            p = safe_target(target, backup)
            if current_hash(p) != item["before_sha256"]:
                raise BrandError(f"Backup integrity check failed: {relative}")
    return target, data


def check_receipt(path: Path) -> dict:
    target, data = validate_receipt(path)
    differences = []
    for item in data["changes"]:
        actual = current_hash(safe_target(target, item["path"]))
        expected = item["before_sha256"] if data["status"] in {"undone", "rolled-back"} else item["after_sha256"]
        if actual != expected:
            differences.append({"path": item["path"], "expected": expected, "actual": actual})
    return {"status": "passed" if not differences else "drift", "receipt_status": data["status"],
            "checked_files": len(data["changes"]), "differences": differences}


def restore_items(target: Path, data: dict, items: list[dict]) -> None:
    for item in reversed(items):
        file = safe_target(target, item["path"])
        if item["before_sha256"] is None:
            file.unlink(missing_ok=True)
        else:
            backup = safe_target(target, item["backup"])
            atomic_write(file, backup.read_bytes(), mode=item["before_mode"])


def apply_plan(plan: dict, *, kit: Path = KIT_ROOT) -> dict:
    options = normalize_options(kit=kit, **options_from_plan(plan))
    target = Path(options["target"])
    rec_path = receipt_path(target, plan["plan_id"])
    if rec_path.is_file():
        recorded_target, receipt = validate_receipt(rec_path)
        if receipt.get("plan") != plan:
            raise BrandError("Existing transaction does not match this plan")
        if receipt["status"] == "applied" and check_receipt(rec_path)["status"] == "passed":
            return {"status": "already-applied", "receipt": str(rec_path), "files_written": 0}
        raise BrandError("Existing transaction is changed or unfinished; inspect its receipt")
    expected = create_plan(kit=kit, **options_from_plan(plan))
    if expected != plan:
        raise BrandError("Plan is stale, edited, or built from different sources; create a new plan")
    if plan["conflicts"]:
        raise BrandError("Unowned files differ: " + ", ".join(plan["conflicts"]))
    changing = [x for x in plan["changes"] if x["action"] != "unchanged"]
    if not changing:
        return {"status": "no-changes", "files_written": 0, "receipt": None}
    with target_lock(target):
        if create_plan(kit=kit, **options_from_plan(plan)) != plan:
            raise BrandError("Target changed while obtaining the lock; create a new plan")
        content = payloads(kit, options)
        receipt = {"schema_version": 1, "plan_id": plan["plan_id"], "plan": plan,
                   "options": options, "status": "applying",
                   "started_at": datetime.now(UTC).isoformat(), "changes": []}
        # Include unchanged files in receipts for post-install drift checks; do not back them up.
        for entry in plan["changes"]:
            item = dict(entry)
            if item["action"] != "unchanged" and item["before_sha256"] is not None:
                backup = f"{STATE_DIR}/transactions/{plan['plan_id']}/backup/{item['path']}"
                before = safe_target(target, item["path"]).read_bytes()
                if sha(before) != item["before_sha256"]:
                    raise BrandError("Target changed before backup; nothing installed")
                atomic_write(safe_target(target, backup), before, mode=0o600)
                item["backup"] = backup
            receipt["changes"].append(item)
        atomic_write(rec_path, json_bytes(receipt), mode=0o600)
        written = []
        try:
            for item in receipt["changes"]:
                if item["action"] == "unchanged":
                    continue
                file = safe_target(target, item["path"])
                if current_hash(file) != item["before_sha256"]:
                    raise BrandError("Concurrent target edit detected; rolling back installed files")
                atomic_write(file, content[item["path"]], mode=item["before_mode"])
                written.append(item)
        except Exception:
            # Never erase an external edit during recovery.
            conflicts = [x["path"] for x in written
                         if current_hash(safe_target(target, x["path"])) != x["after_sha256"]]
            if conflicts:
                receipt["status"] = "recovery-needed"
                receipt["recovery_conflicts"] = conflicts
            else:
                restore_items(target, receipt, written)
                receipt["status"] = "rolled-back"
            atomic_write(rec_path, json_bytes(receipt), mode=0o600)
            raise
        receipt["status"] = "applied"
        receipt["finished_at"] = datetime.now(UTC).isoformat()
        atomic_write(rec_path, json_bytes(receipt), mode=0o600)
    return {"status": "applied", "files_written": len(written), "receipt": str(rec_path)}


def undo_receipt(path: Path) -> dict:
    target, data = validate_receipt(path)
    if data["status"] != "applied":
        raise BrandError("Undo accepts an applied receipt only; inspect interrupted transactions manually")
    with target_lock(target):
        target, data = validate_receipt(path)
        check = check_receipt(path)
        if check["status"] != "passed":
            raise BrandError("Installed files have been edited; refusing destructive undo: " +
                             ", ".join(x["path"] for x in check["differences"]))
        changed = [x for x in data["changes"] if x["action"] != "unchanged"]
        data["status"] = "undoing"
        atomic_write(path, json_bytes(data), mode=0o600)
        restore_items(target, data, changed)
        data["status"] = "undone"
        data["undone_at"] = datetime.now(UTC).isoformat()
        atomic_write(path, json_bytes(data), mode=0o600)
    return {"status": "undone", "restored_or_removed": len(changed),
            "note": "Empty directories and the audit receipt remain; no untracked content was deleted."}


def recover_receipt(path: Path) -> dict:
    """Roll back an interrupted transaction only when every current state is explainable.

    A stale lock is not automatically broken. Check its PID and remove it manually
    only after confirming that the installing process is no longer active.
    """
    target, data = validate_receipt(path)
    if data["status"] not in {"applying", "undoing", "recovery-needed"}:
        raise BrandError("Recovery is only for interrupted applying/undoing/recovery-needed receipts")
    with target_lock(target):
        target, data = validate_receipt(path)
        restore = []
        for item in data["changes"]:
            current = current_hash(safe_target(target, item["path"]))
            if current not in {item["before_sha256"], item["after_sha256"]}:
                raise BrandError("Unexplained external edit blocks recovery: " + item["path"])
            if item["action"] != "unchanged" and current == item["after_sha256"]:
                restore.append(item)
        restore_items(target, data, restore)
        data["status"] = "rolled-back"
        data["recovered_at"] = datetime.now(UTC).isoformat()
        atomic_write(path, json_bytes(data), mode=0o600)
    return {"status": "rolled-back", "restored_or_removed": len(restore),
            "note": "Original bytes restored; receipt and backups retained. No public service touched."}
