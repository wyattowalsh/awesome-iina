import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const uiDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../static/ui");
for (const name of readdirSync(uiDir)) {
  if (!name.startsWith("catalog-ui.")) continue;
  const file = path.join(uiDir, name);
  const text = readFileSync(file, "utf8");
  const cleaned = `${text
    .split(/\r?\n/)
    .map((line) => line.replace(/[ \t]+$/u, ""))
    .join("\n")
    .replace(/\s*$/u, "")}\n`;
  writeFileSync(file, cleaned);
}
