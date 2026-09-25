import {createRequire} from 'node:module';
import {readFile, readdir, lstat} from 'node:fs/promises';
import {resolve, relative, isAbsolute, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
export const ROOT = fileURLToPath(new URL('../', import.meta.url));
export async function json(path) { return JSON.parse(await readFile(resolve(ROOT, path), 'utf8')); }
export function inside(root, path) {
  if (typeof path !== 'string' || !path || path.includes('\\') || isAbsolute(path) || path.split('/').includes('..')) throw new Error(`Invalid package-relative path: ${String(path)}`);
  const full = resolve(root, path), rel = relative(root, full);
  if (!rel || rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel)) throw new Error(`Path escaped root: ${path}`);
  return full;
}
export async function walk(root) {
  const output = [];
  async function visit(dir) {
    for (const name of (await readdir(dir)).sort()) {
      const path = resolve(dir, name), stat = await lstat(path);
      if (stat.isSymbolicLink()) throw new Error(`Symlink not allowed: ${path}`);
      if (stat.isDirectory()) await visit(path);
      else if (stat.isFile()) output.push(path);
      else throw new Error(`Unsupported file type: ${path}`);
    }
  }
  await visit(root);
  return output;
}
export function run(command, args, options={}) {
  const result = spawnSync(command, args, {cwd: ROOT, encoding:'utf8', shell:false, ...options});
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} failed (${result.status})\n${result.stdout ?? ''}\n${result.stderr ?? ''}`);
  return result.stdout ?? '';
}
export function compilerApi() {
  // This override exists only for explicitly reported audits in constrained environments.
  const req = createRequire(import.meta.url);
  const override = process.env.IINA_AUDIT_TS_API;
  if (override) process.stderr.write(`AUDIT OVERRIDE: compiler API from ${override}\n`);
  return req(override || '@typescript/typescript6');
}
