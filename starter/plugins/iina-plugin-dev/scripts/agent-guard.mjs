#!/usr/bin/env node
import {readFileSync} from "node:fs";
import {pathToFileURL} from "node:url";
import {classify, FIXTURES} from "./rules.mjs";

function firstString(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value;
  }
  return "";
}

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}

function mapToolName(raw) {
  const name = String(raw || "").trim();
  if (!name) return "";
  const key = name.replace(/[\s_-]/g, "").toLowerCase();
  if (key === "write" || key === "tabwrite") return "Write";
  if (key === "strreplace" || key === "edit" || key === "tabstrreplace") return "StrReplace";
  if (key === "bash") return "Bash";
  if (key === "shell") return "Shell";
  return name;
}

function pickToolInput(payload) {
  return (
    asObject(payload.toolInput)
    || asObject(payload.tool_input)
    || asObject(asObject(payload.input)?.toolInput)
    || asObject(asObject(payload.input)?.tool_input)
    || asObject(payload.arguments)
    || asObject(payload.args)
    || {}
  );
}

/** Normalize Cursor, Copilot, and Claude hook stdin JSON into classify(). */
export function parseHookPayload(payload) {
  if (!asObject(payload)) return {};
  const nested = asObject(payload.input) || {};
  const toolInput = pickToolInput(payload);
  const toolName = mapToolName(
    firstString(
      payload.toolName,
      payload.tool_name,
      payload.tool,
      nested.toolName,
      nested.tool_name,
      payload.copilot_tool_name,
    ),
  );
  const command = firstString(
    payload.command,
    nested.command,
    toolInput.command,
    payload.commandToExecute,
    payload.shellCommand,
    payload.shell_command,
    nested.commandToExecute,
  );
  const filePath = firstString(
    payload.filePath,
    payload.file_path,
    payload.path,
    payload.file,
    nested.filePath,
    nested.file_path,
    nested.path,
    toolInput.filePath,
    toolInput.file_path,
    toolInput.path,
    toolInput.file,
  );
  return {
    ...payload,
    ...nested,
    command,
    toolName,
    toolInput,
    filePath,
    prompt: firstString(payload.prompt, nested.prompt, payload.user_prompt, payload.userPrompt),
    edits: Array.isArray(payload.edits) ? payload.edits : Array.isArray(nested.edits) ? nested.edits : payload.edits,
  };
}

function logRule(decision) {
  if (decision?.rule_id) process.stderr.write(`${decision.rule_id}\n`);
}

function writeDecision(decision) {
  const payload = {
    permission: decision.permission,
    agent_message: decision.agent_message,
    user_message: decision.user_message,
  };
  if (decision.permission === "allow") {
    delete payload.agent_message;
    delete payload.user_message;
  }
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

function selfTest() {
  let failed = 0;
  for (const fixture of FIXTURES) {
    const decision = classify(parseHookPayload(fixture.input));
    const ok = decision.permission === fixture.permission
      && (fixture.rule_id === undefined || decision.rule_id === fixture.rule_id);
    if (!ok) {
      failed += 1;
      process.stderr.write(`${fixture.id}: ${decision.rule_id ?? decision.permission}\n`);
    }
  }
  if (failed) {
    process.stderr.write(`agent-guard self-test failures: ${failed}\n`);
    process.exit(1);
  }
  process.stdout.write(JSON.stringify({status: "passed", fixtures: FIXTURES.length, layer: "agent-guard"}) + "\n");
}

function main(argv) {
  if (argv.includes("--self-test")) {
    selfTest();
    return;
  }
  let raw = "";
  try {
    raw = readFileSync(0, "utf8");
  } catch {
    process.stderr.write("stdin-read-failed\n");
    process.exit(1);
  }
  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    process.stderr.write("invalid-json\n");
    process.exit(1);
  }
  const decision = classify(parseHookPayload(input));
  logRule(decision);
  writeDecision(decision);
  if (decision.permission === "deny") process.exit(2);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2));
}

export {classify, FIXTURES};
