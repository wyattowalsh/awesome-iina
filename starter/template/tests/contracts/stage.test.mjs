import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,rm,symlink} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {tmpdir} from 'node:os';
import {json} from '../../scripts/common.mjs';
import {verifyStage,expectedFiles} from '../../scripts/validate.mjs';
const project=await json('.iina-project.json');
async function fixture(fn){
  const stage=await mkdtemp(resolve(tmpdir(),'iina-synthetic-stage-'));
  try{
    for(const path of expectedFiles(project)){
      const file=resolve(stage,path);await mkdir(dirname(file),{recursive:true});
      const text=path==='Info.json'?JSON.stringify(await json('Info.json')):path.endsWith('.html')?'<html><body>Fixture</body></html>':'/* synthetic fixture, not production output */';
      await writeFile(file,text,{mode:0o644});
    }
    await fn(stage);
  }finally{await rm(stage,{recursive:true,force:true});}
}
test('synthetic allowlisted stage produces content hashes',()=>fixture(async(stage)=>{
  const entries=await verifyStage(stage,project);assert.equal(entries.length,expectedFiles(project).length);
  assert.ok(entries.every(entry=>/^[a-f0-9]{64}$/.test(entry.sha256)));
}));
test('synthetic stage rejects source-code leak',()=>fixture(async(stage)=>{
  await writeFile(resolve(stage,'AGENTS.md'),'should not ship');await assert.rejects(verifyStage(stage,project),/allowlist/);
}));
test('synthetic stage rejects cursor hooks leak',()=>fixture(async(stage)=>{
  await mkdir(resolve(stage,'.cursor'),{recursive:true});
  await writeFile(resolve(stage,'.cursor/hooks.json'),'{}');
  await assert.rejects(verifyStage(stage,project),/allowlist/);
}));
test('synthetic stage rejects agent-guard leak',()=>fixture(async(stage)=>{
  await mkdir(resolve(stage,'scripts'),{recursive:true});
  await writeFile(resolve(stage,'scripts/agent-guard.mjs'),'');
  await assert.rejects(verifyStage(stage,project),/allowlist/);
}));
test('synthetic stage rejects missing main',()=>fixture(async(stage)=>{
  await rm(resolve(stage,'dist/main.js'));await assert.rejects(verifyStage(stage,project),/allowlist/);
}));
test('synthetic stage rejects symlink contents',()=>fixture(async(stage)=>{
  await rm(resolve(stage,'dist/main.js'));await symlink('../Info.json',resolve(stage,'dist/main.js'));
  await assert.rejects(verifyStage(stage,project),/Symlink/);
}));
if(project.preset!=='command')test('synthetic stage rejects missing local HTML asset',()=>fixture(async(stage)=>{
  await writeFile(resolve(stage,'ui/index.html'),'<script src="missing.js"></script>');
  await assert.rejects(verifyStage(stage,project));
}));
