import test from 'node:test';
import assert from 'node:assert/strict';
import {setTimeout as pause} from 'node:timers/promises';
import {supportView} from '../../scripts/doctor.mjs';
import {createBuildQueue} from '../../scripts/dev.mjs';
import {previewPath} from '../../scripts/preview.mjs';
import {validateNativeEvidence} from '../../scripts/release.mjs';

test('support report is an allowlist rather than raw-log redaction',()=>{
 const report=supportView({platform:'darwin',arch:'arm64',versions:{node:'24.21.0',unexpected:'SECRET'},checks:[{check:'iina-cli',status:'missing',detail:'/Users/private/media'}],logs:'SECRET',env:{TOKEN:'secret'}});
 assert.doesNotMatch(JSON.stringify(report),/private|SECRET|TOKEN|secret/);
 assert.equal(report.checks[0].status,'missing');
});
test('preview serves only the UI namespace',()=>{
 assert.equal(previewPath('/ui/index.js'),'ui/index.js');
 for(const path of ['/package.json','/.env','/ui/../../Info.json','/ui/unknown.js'])assert.equal(previewPath(path),null);
});
test('native evidence cannot pass for a different source commit',()=>{
 assert.throws(()=>validateNativeEvidence({schemaVersion:1,status:'passed',sourceCommit:'wrong'},'expected','command'));
});
test('native evidence requires executed scenarios',()=>{
 const evidence={schemaVersion:1,status:'passed',sourceCommit:'abc',iinaVersion:'1.4.4',macosVersion:'test',architecture:'arm64',scenarios:[]};
 assert.throws(()=>validateNativeEvidence(evidence,'abc','sidebar'));
 evidence.scenarios=['load','menu','disable-enable','package-install','webview'].map(name=>({name,status:'passed'}));
 assert.doesNotThrow(()=>validateNativeEvidence(evidence,'abc','sidebar'));
});
test('build queue serializes and coalesces changes during execution',async()=>{
 let count=0,active=0,peak=0,finishFirst,firstStarted,secondFinished;
 const waiting=new Promise(done=>{finishFirst=done;});
 const started=new Promise(done=>{firstStarted=done;});
 const finished=new Promise(done=>{secondFinished=done;});
 const queue=createBuildQueue(async()=>{count++;active++;peak=Math.max(peak,active);if(count===1){firstStarted();await waiting;}active--;if(count===2)secondFinished();},{delay:5,onError:error=>{throw error;}});
 try {
  queue.request();await started;assert.equal(count,1);
  queue.request();queue.request();finishFirst();await finished;
  assert.equal(count,2);assert.equal(peak,1);queue.stop();queue.request();await pause(20);assert.equal(count,2);
 }finally{queue.stop();finishFirst();}
});
test('stopping before debounce cancels a pending build',async()=>{
 let count=0;const queue=createBuildQueue(async()=>{count++;},{delay:10});queue.request();queue.stop();await pause(30);assert.equal(count,0);
});

test('native controller and preferences evidence require their own scenarios',()=>{
 const e={schemaVersion:1,status:'passed',sourceCommit:'abc',iinaVersion:'1.4.4',macosVersion:'test',architecture:'arm64',scenarios:['load','menu','disable-enable','package-install','webview'].map(name=>({name,status:'passed'}))};
 assert.throws(()=>validateNativeEvidence(e,'abc','controller'),/global-coordination/);
 assert.throws(()=>validateNativeEvidence(e,'abc','sidebar',true),/preferences/);
 e.scenarios.push({name:'global-coordination',status:'passed'},{name:'preferences',status:'passed'});
 assert.doesNotThrow(()=>validateNativeEvidence(e,'abc','controller',true));
});

test('preview HTTP transport restricts hosts, methods and served files',async()=>{
 const {mkdtemp,writeFile,mkdir,rm}=await import('node:fs/promises');
 const {tmpdir}=await import('node:os');
 const {join}=await import('node:path');
 const {request}=await import('node:http');
 const {createPreviewServer}=await import('../../scripts/preview.mjs');
 const root=await mkdtemp(join(tmpdir(),'iina-preview-contract-'));
 await mkdir(join(root,'ui'));
 await writeFile(join(root,'ui/index.html'),'<html><head></head><body><p id="status"></p></body></html>');
 const server=createPreviewServer(root);
 try {
  await new Promise((done,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',done);});
  const port=server.address().port;
  const get=(path,options={})=>new Promise((done,reject)=>{
   const req=request({hostname:'127.0.0.1',port,path,method:options.method??'GET',headers:{Host:options.host??`127.0.0.1:${port}`}},res=>{
    let body='';res.setEncoding('utf8');res.on('data',chunk=>{body+=chunk;});res.on('end',()=>done({status:res.statusCode,headers:res.headers,body}));
   });
   req.on('error',reject);req.setTimeout(3000,()=>req.destroy(new Error('Preview request timed out')));req.end();
  });
  const page=await get('/ui/');assert.equal(page.status,200);assert.match(page.body,/__preview\/bridge.js/);
  assert.match(page.headers['content-security-policy'],/connect-src 'none'/);
  assert.equal((await get('/Info.json')).status,404);
  assert.equal((await get('/ui/',{host:'invalid.example'})).status,403);
  assert.equal((await get('/ui/',{method:'POST'})).status,405);
  assert.equal((await get('/ui/',{method:'HEAD'})).body,'');
  assert.match((await get('/__preview/bridge.js')).body,/BROWSER SIMULATION/);
 } finally {
  await new Promise(done=>{server.close(done);server.closeAllConnections();});
  await rm(root,{recursive:true,force:true});
 }
});
