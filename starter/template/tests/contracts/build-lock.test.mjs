import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {acquireBuildLock} from '../../scripts/build-lock.mjs';
test('parallel builds fail closed; releasing is idempotent',async()=>{
  const temp=await mkdtemp(resolve(tmpdir(),'iina-build-lock-')),path=resolve(temp,'lock');
  try{const release=await acquireBuildLock(path);await assert.rejects(acquireBuildLock(path),{code:'EEXIST'});
    await release();await release();const next=await acquireBuildLock(path);await next();
  }finally{await rm(temp,{recursive:true,force:true});}
});
