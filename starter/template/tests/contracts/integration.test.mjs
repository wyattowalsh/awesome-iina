import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {json} from '../../scripts/common.mjs';
import {validateManifest} from '../../scripts/validate.mjs';
import {assertUpdateReference,readCopierLineage} from '../../scripts/template-lineage.mjs';
const awaitManifest=await json('Info.json');
const awaitProject=await json('.iina-project.json');
for(const author of [null,[],{},'Person',{name:''},{name:'A',url:42}])
  test(`reject invalid manifest author ${JSON.stringify(author)}`,async()=>{
    assert.throws(()=>validateManifest({...awaitManifest,author},awaitProject),/author/);
  });
test('valid string-valued author metadata accepted',()=>{
  validateManifest({...awaitManifest,author:{name:'A',url:'https://example.invalid'}},awaitProject);
});
for(const ref of ['','--trust','bad ref','v1\nother'])
  test(`reject unsafe reference ${JSON.stringify(ref)}`,()=>assert.throws(()=>assertUpdateReference(ref)));
test('explicit tag accepted',()=>assertUpdateReference('v0.2.0a2'));
test('fixture lineage is rejected',async()=>{
  const root=await mkdtemp(resolve(tmpdir(),'iina-lineage-'));
  try {
    await writeFile(resolve(root,'.copier-answers.yml'),'_src_path: FIXTURE-NOT-COPIER\n_commit: FIXTURE\n');
    await assert.rejects(readCopierLineage(root),/no real Copier lineage/);
  } finally {await rm(root,{recursive:true,force:true});}
});
test('unversioned local copy is not update-ready',async()=>{
  const root=await mkdtemp(resolve(tmpdir(),'iina-lineage-'));
  try {
    await writeFile(resolve(root,'.copier-answers.yml'),'_src_path: /tmp/source\n');
    await assert.rejects(readCopierLineage(root),/_commit/);
  } finally {await rm(root,{recursive:true,force:true});}
});
