/** Pure command/file matchers for IINA agent hooks. No I/O, no env, no command logging. */

const TRUST_FLAG = /(?:^|[\s])--trust(?:\s|=|$)/;
const KILLALL_IINA = /\bkillall\b[\s\S]*\bIINA\b/i;
const OSA_IINA = /\bosascript\b/i;
const OSA_IINA_APP = /\bIINA\b/i;
const OSA_QUIT = /\b(quit|restart|kill)\b/i;
const GH_RELEASE = /\bgh\s+release\b/;
const PNPM_RUN_PACK = /\bpnpm(?:\s+\S+)*\s+run(?:\s+\S+)*\s+pack\b/;
const PNPM_PACK = /\bpnpm(?:\s+\S+)*\s+pack\b/;
const NPM_PACK = /\bnpm\s+pack\b/;
const COPIER_COPY = /\bcopier\b[\s\S]*\bcopy\b/;
const WRAPPER_NEW = /\brepo_wrapper\.py\b[\s\S]*\bnew\b/;
const EXTRA_PERMISSIONS = /\b(show-osd|show-alert|network-request|file-system)\b/;
const INFO_JSON_PATH = /(^|\/)Info\.json(\.jinja)?$/;
const INFO_JSON_MENTION = /Info\.json(?:\.jinja)?/;
const ALLOWED_DOMAINS = /allowedDomains/;

const INFO_EXPAND_MESSAGE =
  "Blocked Info.json permission expansion (rule deny-info-permission-expansion). Revert Info.json permission expansion.";
const INFO_DIFF_MESSAGE =
  "Blocked Info.json edit without new contents (rule deny-info-permission-expansion). Show the Info.json diff.";

export const FIXTURES = [
  {id: "allow-run-pack", input: {command: "pnpm run pack"}, permission: "allow"},
  {id: "allow-run-silent-pack", input: {command: "pnpm --silent run pack"}, permission: "allow"},
  {id: "allow-check", input: {command: "pnpm run check"}, permission: "allow"},
  {id: "allow-unknown", input: {command: "pnpm run bootstrap"}, permission: "allow"},
  {id: "deny-bare-pack", input: {command: "pnpm pack"}, permission: "deny", rule_id: "deny-bare-pnpm-pack"},
  {id: "deny-npm-pack", input: {command: "npm pack"}, permission: "deny", rule_id: "deny-bare-pnpm-pack"},
  {id: "deny-trust", input: {command: "uvx copier copy --trust . ../out"}, permission: "deny", rule_id: "deny-copier-trust"},
  {id: "allow-trusted-host", input: {command: "pip install --trusted-host pypi.org pkg"}, permission: "allow"},
  {id: "deny-killall", input: {command: "killall IINA"}, permission: "deny", rule_id: "deny-iina-killall"},
  {
    id: "deny-osascript",
    input: {command: "osascript -e 'tell application \"IINA\" to quit'"},
    permission: "deny",
    rule_id: "deny-iina-osascript-restart",
  },
  {id: "deny-gh-release", input: {command: "gh release create v1.0.0"}, permission: "deny", rule_id: "deny-gh-release"},
  {id: "deny-overlap-dot", input: {command: "copier copy . ."}, permission: "deny", rule_id: "deny-copier-overlap"},
  {
    id: "deny-info-domains",
    input: {file_path: "Info.json", edits: [{new_string: '{"allowedDomains":["*"]}'}]},
    permission: "deny",
    rule_id: "deny-info-permission-expansion",
  },
  {
    id: "deny-info-shell",
    input: {command: "printf '{\"allowedDomains\":[\"*\"]}' > Info.json"},
    permission: "deny",
    rule_id: "deny-info-permission-expansion",
  },
  {
    id: "deny-info-write-tool",
    input: {
      toolName: "Write",
      toolInput: {path: "Info.json", contents: '{"allowedDomains":["*"]}'},
    },
    permission: "deny",
    rule_id: "deny-info-permission-expansion",
  },
  {
    id: "deny-info-strreplace",
    input: {
      toolName: "StrReplace",
      filePath: "plugin/Info.json",
      toolInput: {file_path: "plugin/Info.json", new_string: '{"permissions":["network-request"]}'},
    },
    permission: "deny",
    rule_id: "deny-info-permission-expansion",
  },
  {
    id: "deny-info-write-missing",
    input: {toolName: "Write", filePath: "Info.json", toolInput: {path: "Info.json"}},
    permission: "deny",
    rule_id: "deny-info-permission-expansion",
  },
  {
    id: "deny-info-jinja",
    input: {
      toolName: "Write",
      toolInput: {path: "Info.json.jinja", contents: '{"allowedDomains":["*"]}'},
    },
    permission: "deny",
    rule_id: "deny-info-permission-expansion",
  },
  {
    id: "deny-info-permission-expansion",
    input: {
      file_path: "Info.json",
      prompt: "Please perform an explicit permission migration",
      user_message: "permission migration requested",
      edits: [{new_string: '{"permissions":["network-request"]}'}],
    },
    permission: "deny",
    rule_id: "deny-info-permission-expansion",
  },
  {
    id: "deny-info-migration-phrase-prompt",
    input: {
      file_path: "Info.json",
      prompt: "permission migration",
      edits: [{new_string: '{"permissions":["show-osd"]}'}],
    },
    permission: "deny",
    rule_id: "deny-info-permission-expansion",
  },
  {
    id: "deny-info-migration-phrase-command",
    input: {
      command: "printf '{\"permissions\":[\"file-system\"]}' > Info.json # permission migration",
    },
    permission: "deny",
    rule_id: "deny-info-permission-expansion",
  },
  {
    id: "deny-info-migration-phrase-write-contents",
    input: {
      toolName: "Write",
      toolInput: {
        path: "Info.json",
        contents: '{"permissions":["show-alert"],"note":"permission migration"}',
      },
    },
    permission: "deny",
    rule_id: "deny-info-permission-expansion",
  },
  {
    id: "allow-info-overlay",
    input: {file_path: "Info.json", edits: [{new_string: '{"permissions":["video-overlay"]}'}]},
    permission: "allow",
  },
];

function commandOf(input) {
  if (typeof input?.command === "string" && input.command) return input.command;
  const nested = toolInputOf(input);
  return typeof nested.command === "string" ? nested.command : "";
}

function toolInputOf(input) {
  if (input?.toolInput && typeof input.toolInput === "object") return input.toolInput;
  if (input?.tool_input && typeof input.tool_input === "object") return input.tool_input;
  return {};
}

function toolNameOf(input) {
  const raw = input?.toolName ?? input?.tool_name ?? "";
  return typeof raw === "string" ? raw : "";
}

function isWriteOrStrReplace(toolName) {
  return /^(Write|StrReplace)$/i.test(toolName);
}

function isFileEditEvent(input) {
  for (const key of ["hook_event_name", "hookEventName", "event"]) {
    if (typeof input?.[key] === "string" && /fileEdit/i.test(input[key])) return true;
  }
  return false;
}

function filePathOf(input) {
  const nested = toolInputOf(input);
  for (const obj of [input, nested]) {
    for (const key of ["filePath", "file_path", "path", "file"]) {
      if (typeof obj?.[key] === "string" && obj[key]) return obj[key];
    }
  }
  return "";
}

function isInfoJsonPath(filePath) {
  return INFO_JSON_PATH.test(String(filePath || "").replaceAll("\\", "/"));
}

function collectNewContents(input) {
  const nested = toolInputOf(input);
  const chunks = [];
  const takeObject = (obj) => {
    if (!obj || typeof obj !== "object") return;
    for (const key of ["content", "contents", "new_string", "newString"]) {
      if (typeof obj[key] === "string") chunks.push(obj[key]);
    }
    if (Array.isArray(obj.edits)) {
      for (const edit of obj.edits) {
        if (typeof edit?.new_string === "string") chunks.push(edit.new_string);
        if (typeof edit?.newString === "string") chunks.push(edit.newString);
      }
    }
  };
  takeObject(input);
  takeObject(nested);
  return chunks;
}

function contentsAvailable(input) {
  return collectNewContents(input).length > 0;
}

function editText(input) {
  return collectNewContents(input).join("\n");
}

function expandsPermissions(text) {
  return ALLOWED_DOMAINS.test(text) || EXTRA_PERMISSIONS.test(text);
}

function tokens(command) {
  return command.trim().split(/\s+/).filter(Boolean);
}

function copierDestination(command) {
  if (WRAPPER_NEW.test(command)) {
    const parts = tokens(command);
    const newAt = parts.lastIndexOf("new");
    if (newAt >= 0 && parts[newAt + 1] && !parts[newAt + 1].startsWith("-")) return parts[newAt + 1];
  }
  if (COPIER_COPY.test(command)) {
    const parts = tokens(command);
    const copyAt = parts.lastIndexOf("copy");
    if (copyAt >= 0) {
      const positional = parts.slice(copyAt + 1).filter((part) => !part.startsWith("-") && !part.includes("="));
      return positional[1] ?? "";
    }
  }
  return "";
}

function deny(rule_id, agent_message) {
  return {
    permission: "deny",
    rule_id,
    agent_message,
    user_message: agent_message,
  };
}

function allow(rule_id = "allow-unknown") {
  return {permission: "allow", rule_id};
}

function denyInfoExpansion() {
  return deny("deny-info-permission-expansion", INFO_EXPAND_MESSAGE);
}

function denyInfoMissingDiff() {
  return deny("deny-info-permission-expansion", INFO_DIFF_MESSAGE);
}

function classifyInfoJson(input, {requireContents}) {
  if (!contentsAvailable(input)) {
    return requireContents ? denyInfoMissingDiff() : null;
  }
  if (expandsPermissions(editText(input))) return denyInfoExpansion();
  return null;
}

/**
 * @param {{command?: string, toolName?: string, toolInput?: object, filePath?: string}} input
 * @returns {{permission: "allow"|"deny", rule_id: string, agent_message?: string, user_message?: string}}
 */
export function classify(input) {
  const command = commandOf(input);
  if (command) {
    if (TRUST_FLAG.test(command)) {
      return deny("deny-copier-trust", "Blocked Copier --trust (rule deny-copier-trust).");
    }
    if (KILLALL_IINA.test(command)) {
      return deny("deny-iina-killall", "Blocked IINA process kill (rule deny-iina-killall).");
    }
    if (OSA_IINA.test(command) && OSA_IINA_APP.test(command) && OSA_QUIT.test(command)) {
      return deny("deny-iina-osascript-restart", "Blocked IINA restart (rule deny-iina-osascript-restart).");
    }
    if (GH_RELEASE.test(command)) {
      return deny("deny-gh-release", "Blocked GitHub release (rule deny-gh-release).");
    }
    if (!PNPM_RUN_PACK.test(command) && (PNPM_PACK.test(command) || NPM_PACK.test(command))) {
      return deny("deny-bare-pnpm-pack", "Use pnpm run pack, not pnpm pack (rule deny-bare-pnpm-pack).");
    }
    const dest = copierDestination(command);
    if (dest === "." || dest === "./" || dest === "..") {
      return deny("deny-copier-overlap", "Blocked overlapping Copier destination (rule deny-copier-overlap).");
    }
    if (INFO_JSON_MENTION.test(command) && expandsPermissions(command)) {
      return denyInfoExpansion();
    }
  }

  const filePath = filePathOf(input);
  const infoPath = isInfoJsonPath(filePath);
  const writeLike = isWriteOrStrReplace(toolNameOf(input));

  if (writeLike && infoPath) {
    return classifyInfoJson(input, {requireContents: true}) ?? allow("allow-unknown");
  }

  if (infoPath) {
    const decision = classifyInfoJson(input, {
      requireContents: isFileEditEvent(input) || Array.isArray(input?.edits),
    });
    if (decision) return decision;
  }

  return allow(command && PNPM_RUN_PACK.test(command) ? "allow-pnpm-run-pack" : "allow-unknown");
}
