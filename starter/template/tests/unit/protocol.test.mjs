import test from 'node:test';
import assert from 'node:assert/strict';
import {loadTS} from '../helpers/load-ts.mjs';
const {isReady,isSnapshot,makeSnapshot,createReceiver}=loadTS('src/shared/protocol.ts');
test('valid JSON handshake and snapshot',()=>{
  assert.equal(isReady({v:1,kind:'ready',viewId:'view-123'}),true);
  assert.equal(isSnapshot(JSON.parse(JSON.stringify(makeSnapshot('view-123',1,'A title',false)))),true);
});
for(const bad of [null,[],{},'ready',{v:2,kind:'ready',viewId:'x'},{v:1,kind:'ready',viewId:'x',command:'exec'},{v:1,kind:'ready',viewId:'../x'}]){
  test(`reject malformed handshake ${JSON.stringify(bad)}`,()=>assert.equal(isReady(bad),false));
}
test('clamps untrusted title length',()=>assert.equal(makeSnapshot('v',1,'x'.repeat(900),false).title.length,500));
test('rejects old windows, duplicate and out-of-order snapshots',()=>{
  const seen=[];const receive=createReceiver('view-a',state=>seen.push(state.sequence));
  assert.equal(receive(makeSnapshot('view-a',2,'New',false)),true);
  assert.equal(receive(makeSnapshot('view-a',1,'Old',false)),false);
  assert.equal(receive(makeSnapshot('view-a',2,'Duplicate',false)),false);
  assert.equal(receive(makeSnapshot('view-b',3,'Wrong view',false)),false);
  assert.deepEqual(seen,[2]);
});
test('invalid sequence never passes',()=>{
  for(const n of [0,-1,NaN,Infinity,1.5,Number.MAX_SAFE_INTEGER+1])assert.throws(()=>makeSnapshot('v',n,'Title',false));
});
test('disposal is once-only, reverse-order and continues after failure',()=>{
  const {Disposables}=loadTS('src/shared/disposables.ts');const d=new Disposables(),events=[];
  d.add(()=>events.push(1));d.add(()=>{events.push(2);throw new Error('expected');});
  assert.equal(d.dispose().length,1);assert.deepEqual(events,[2,1]);assert.equal(d.dispose().length,0);
  d.add(()=>events.push(3));assert.deepEqual(events,[2,1,3]);
});
