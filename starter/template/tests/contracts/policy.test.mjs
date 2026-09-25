import test from 'node:test';
import assert from 'node:assert/strict';
import {inside,ROOT,compilerApi,json} from '../../scripts/common.mjs';
import {boundaryErrors} from '../../scripts/boundaries.mjs';
import {validateManifest} from '../../scripts/validate.mjs';
const ts=compilerApi();
for(const path of ['../x','/tmp/x','foo/../../bar','C:\\file',''])test(`reject escaping path ${JSON.stringify(path)}`,()=>assert.throws(()=>inside(ROOT,path)));
test('relative package path stays local',()=>assert.ok(inside(ROOT,'ui/index.html').startsWith(ROOT)));
for(const [filename,source] of [
  ['src/main/index.ts','import fs from "node:fs";'],
  ['src/ui/index.ts','import "../main/index.js";'],
  ['src/shared/index.ts','import "../ui/index.js";'],
  ['src/main/index.ts','import("./other.js");'],
  ['src/main/index.ts','eval("anything");'],
])test(`reject runtime crossing ${source}`,()=>assert.ok(boundaryErrors(source,filename,ts).length));
test('pure relative import accepted',()=>assert.equal(boundaryErrors('import {x} from "../shared/x.js";','src/main/index.ts',ts).length,0));
test('comments containing forbidden text do not trip AST checks',()=>assert.equal(boundaryErrors('// import("node:fs")\nconst x = "require";','src/main/index.ts',ts).length,0));
test('manifest baseline passes',async()=>validateManifest(await json('Info.json'),await json('.iina-project.json')));
test('permission escalation is rejected',async()=>{
  const manifest=await json('Info.json');manifest.permissions.push('file-system');
  assert.throws(()=>validateManifest(manifest,awaitProject),/permission/i);
});
const awaitProject=await json('.iina-project.json');

test('nested same-role import accepted',()=>assert.equal(boundaryErrors('import {x} from "./x.js";','src/main/nested/index.ts',ts).length,0));
