import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {ROOT,json,run} from './common.mjs';
import {validateManifest} from './validate.mjs';
export function validateNativeEvidence(evidence,commit,preset,preferences=false) {
  if(evidence.schemaVersion!==1||evidence.status!=='passed'||evidence.sourceCommit!==commit)throw new Error('Native evidence must pass for this exact source commit.');
  for(const key of ['iinaVersion','macosVersion','architecture'])if(typeof evidence[key]!=='string'||!evidence[key].trim())throw new Error(`Missing native evidence field: ${key}`);
  const required=['load','menu','disable-enable','package-install'];
  if(preset!=='command')required.push('webview');
  if(preferences)required.push('preferences');
  if(preset==='controller')required.push('global-coordination');
  const passed=new Set((evidence.scenarios??[]).filter(s=>s.status==='passed').map(s=>s.name));
  for(const name of required)if(!passed.has(name))throw new Error(`Missing passing native scenario: ${name}`);
}
export async function releaseCheck({native=true}={}) {
  const project=await json('.iina-project.json'),manifest=await json('Info.json'),pkg=await json('package.json');
  validateManifest(manifest,project);
  if(pkg.version!==manifest.version)throw new Error('package.json and Info.json versions differ.');
  if(run('git',['status','--porcelain']).trim())throw new Error('Release requires a clean source checkout.');
  const commit=run('git',['rev-parse','HEAD']).trim();
  const tags=run('git',['tag','--points-at',commit]).split('\n');
  if(!tags.includes(`v${manifest.version}`))throw new Error('Tag this source commit as v<plugin-version>.');
  run('git',['ls-files','--error-unmatch','pnpm-lock.yaml']);
  const lock=await readFile(resolve(ROOT,'pnpm-lock.yaml'));
  let evidence=null;
  if(native){
    evidence=JSON.parse(await readFile(resolve(ROOT,process.env.IINA_NATIVE_EVIDENCE??'reports/native-evidence.json'),'utf8'));
    validateNativeEvidence(evidence,commit,project.preset,project.preferences);
  }
  return {schemaVersion:1,sourceCommit:commit,version:manifest.version,identifier:manifest.identifier,
    lockSha256:createHash('sha256').update(lock).digest('hex'),node:process.version,
    nativeStatus:native?'reported-passed':'not-run',evidenceVerification:'schema-and-source-binding-only',nativeEvidence:evidence};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  const mode=process.argv[2]??'check';if(!['check','prepare','candidate'].includes(mode))throw new Error('Use check, prepare or candidate.');
  const report=await releaseCheck({native:mode!=='candidate'});
  if(mode==='prepare'){
    if(process.platform!=='darwin')throw new Error('Official IINA release packaging requires macOS.');
    run('pnpm',['run','check'],{stdio:'inherit'});run('pnpm',['run','build'],{stdio:'inherit'});run('pnpm',['run','pack'],{stdio:'inherit'});
    const project=await json('.iina-project.json');
    const name=`${project.slug}-${report.version}.iinaplgz`;
    const bytes=await readFile(resolve(ROOT,'artifacts',name));
    report.archive={name,sha256:createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length};
    await writeFile(resolve(ROOT,'artifacts',`${name}.sha256`),`${report.archive.sha256}  ${name}\n`);
  }
  await mkdir(resolve(ROOT,'reports'),{recursive:true});
  await writeFile(resolve(ROOT,'reports',mode==='candidate'?'candidate-report.json':'release-report.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report,null,2));
  if(mode==='prepare')console.log('Prepared locally. Nothing was published; verify the report and archive before publication.');
}
