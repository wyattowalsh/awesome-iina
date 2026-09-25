from __future__ import annotations

import json
import shutil
import subprocess
from pathlib import Path

import pytest
import yaml

from tools.fixture_render import ROOT

GUARD = ROOT / "plugins/iina-plugin-dev/scripts/agent-guard.mjs"
HOOKS = ROOT / "plugins/iina-plugin-dev/hooks/hooks.json"
COPILOT_YAML = ROOT / "plugins/iina-plugin-dev/.github/hooks/copilot-setup-steps.yml"
CASES = [
    ("allow-run-pack", {"command": "pnpm run pack"}, 0, "allow"),
    ("allow-check", {"command": "pnpm run check"}, 0, "allow"),
    ("allow-unknown", {"command": "git status"}, 0, "allow"),
    ("deny-bare-pack", {"command": "pnpm pack"}, 2, "deny"),
    ("deny-trust", {"command": "copier copy --trust . ../out"}, 2, "deny"),
    ("deny-killall", {"command": "killall IINA"}, 2, "deny"),
    (
        "deny-osascript",
        {"command": "osascript -e 'tell application \"IINA\" to quit'"},
        2,
        "deny",
    ),
    ("deny-gh-release", {"command": "gh release create v1"}, 2, "deny"),
    (
        "deny-info",
        {"file_path": "Info.json", "edits": [{"new_string": '{"allowedDomains":["*"]}'}]},
        2,
        "deny",
    ),
    (
        "deny-info-shell",
        {"command": """printf '{"allowedDomains":["*"]}' > Info.json"""},
        2,
        "deny",
    ),
    (
        "deny-info-write-tool-input",
        {
            "hook_event_name": "preToolUse",
            "tool_name": "Write",
            "tool_input": {"path": "Info.json", "contents": '{"allowedDomains":["*"]}'},
        },
        2,
        "deny",
    ),
    (
        "deny-info-strreplace-file-path",
        {
            "hook_event_name": "preToolUse",
            "tool_name": "StrReplace",
            "tool_input": {
                "file_path": "plugin/Info.json",
                "old_string": "{}",
                "new_string": '{"permissions":["network-request"]}',
            },
        },
        2,
        "deny",
    ),
    (
        "deny-info-write-missing-contents",
        {
            "toolName": "Write",
            "filePath": "Info.json",
            "toolInput": {"path": "Info.json"},
        },
        2,
        "deny",
    ),
    (
        "deny-info-permission-expansion",
        {
            "file_path": "Info.json",
            "prompt": "Please perform an explicit permission migration",
            "user_message": "permission migration requested",
            "edits": [{"new_string": '{"permissions":["network-request"]}'}],
        },
        2,
        "deny",
    ),
    (
        "deny-info-migration-phrase-prompt",
        {
            "file_path": "Info.json",
            "prompt": "permission migration",
            "edits": [{"new_string": '{"permissions":["show-osd"]}'}],
        },
        2,
        "deny",
    ),
    (
        "deny-info-migration-phrase-command",
        {
            "command": """printf '{"permissions":["file-system"]}' > Info.json # permission migration""",
        },
        2,
        "deny",
    ),
    (
        "deny-info-migration-phrase-write-contents",
        {
            "toolName": "Write",
            "toolInput": {
                "path": "Info.json",
                "contents": '{"permissions":["show-alert"],"note":"permission migration"}',
            },
        },
        2,
        "deny",
    ),
    (
        "allow-info-overlay",
        {"file_path": "Info.json", "edits": [{"new_string": '{"permissions":["video-overlay"]}'}]},
        0,
        "allow",
    ),
]


@pytest.mark.skipif(shutil.which("node") is None, reason="node is required for the guard CLI")
@pytest.mark.parametrize("name,payload,code,permission", CASES)
def test_guard_cli_table(name: str, payload: dict, code: int, permission: str):
    result = subprocess.run(
        ["node", str(GUARD)],
        input=json.dumps(payload),
        capture_output=True,
        text=True,
        check=False,
    )
    assert result.returncode == code, (name, result.stderr, result.stdout)
    body = json.loads(result.stdout)
    assert body["permission"] == permission
    if permission == "deny":
        assert "rule deny-" in body["agent_message"]
    message = body.get("agent_message") or ""
    if name.startswith("deny-info") and name != "deny-info-write-missing-contents":
        assert "revert info.json permission expansion" in message.lower()
    if name == "deny-info-write-missing-contents":
        assert "show the info.json diff" in message.lower()


@pytest.mark.skipif(shutil.which("node") is None, reason="node is required for the guard CLI")
def test_guard_self_test():
    result = subprocess.run(
        ["node", str(GUARD), "--self-test"],
        capture_output=True,
        text=True,
        check=False,
    )
    assert result.returncode == 0, result.stderr
    assert json.loads(result.stdout)["status"] == "passed"


@pytest.mark.skipif(shutil.which("node") is None, reason="node is required for the guard CLI")
def test_guard_invalid_json_is_fail_open_exit():
    result = subprocess.run(
        ["node", str(GUARD)],
        input="not-json",
        capture_output=True,
        text=True,
        check=False,
    )
    assert result.returncode == 1
    assert "invalid-json" in result.stderr


def test_cursor_hooks_json_write_strreplace_pretooluse():
    hooks = json.loads(HOOKS.read_text())
    assert "beforeFileEdit" not in hooks["hooks"]
    pre = hooks["hooks"]["preToolUse"]
    matchers = [entry.get("matcher") for entry in pre]
    assert "Shell|Bash" in matchers
    assert "Write" in matchers
    assert "StrReplace" in matchers
    for entry in pre:
        assert entry["command"] == "node ./scripts/agent-guard.mjs"
        if entry.get("matcher") in {"Shell|Bash", "Write", "StrReplace"}:
            assert entry["failClosed"] is True
    defaults = [entry for entry in pre if "matcher" not in entry]
    assert defaults and defaults[0]["failClosed"] is False
    after = hooks["hooks"]["afterFileEdit"]
    assert after[0]["failClosed"] is True
    assert "Info" in after[0]["matcher"]
    assert after[0]["command"] == "node ./scripts/agent-guard.mjs"


def test_copilot_yaml_has_no_before_file_edit_event():
    text = COPILOT_YAML.read_text()
    assert "beforeFileEdit:" not in text
    payload = yaml.safe_load(text)
    assert "beforeFileEdit" not in payload.get("hooks", {})
    shell = payload["hooks"]["beforeShellExecution"]
    assert shell[0]["failClosed"] is True
    assert "Info" in shell[0]["matcher"]
    command = payload["hooks"]["preToolUseCommand"]
    assert command[0]["failClosed"] is True
    assert "Info" in command[0]["matcher"]


def test_projected_guard_matches_ssot():
    projected = ROOT / "template/scripts/agent-guard.mjs"
    assert projected.read_bytes() == GUARD.read_bytes()
    assert (
        Path(ROOT / "template/scripts/rules.mjs").read_bytes()
        == (ROOT / "plugins/iina-plugin-dev/scripts/rules.mjs").read_bytes()
    )
