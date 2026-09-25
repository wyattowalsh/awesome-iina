import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {ROOT} from './common.mjs';
export {run} from './common.mjs';
export function assertUpdateReference(value) {
  if(typeof value!=='string'||!/^[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(value))
    throw new Error('Provide a single non-option Git tag or commit reference');
}
export async function readCopierLineage(root=ROOT) {
  const text=await readFile(resolve(root,'.copier-answers.yml'),'utf8');
  // This is a fixture rejection guard, not a YAML parser or proof of trusted source ownership.
  if(text.includes('FIXTURE-NOT-COPIER')||/^_commit:\s*['"]?FIXTURE/m.test(text))
    throw new Error('Offline fixtures have no real Copier lineage. Generate a consumer with Copier.');
  if(!/^_src_path:/m.test(text)||!/^_commit:/m.test(text))
    throw new Error('A Git-backed Copier answers file with _src_path and _commit is required');
  return text;
}
