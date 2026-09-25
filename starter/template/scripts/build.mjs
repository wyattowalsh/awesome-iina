import {build} from 'esbuild';
import {mkdtemp,mkdir,readFile,writeFile,rename,rm,stat} from 'node:fs/promises';
import {resolve} from 'node:path';
import {acquireBuildLock} from './build-lock.mjs';
import {ROOT,json} from './common.mjs';
import {validateManifest,verifyStage} from './validate.mjs';
import {checkBoundaries} from './boundaries.mjs';
const project=await json('.iina-project.json'),manifest=await json('Info.json');
validateManifest(manifest,project);
const errors=await checkBoundaries();if(errors.length)throw new Error(errors.join('\n'));
const parent=resolve(ROOT,'.build');await mkdir(parent,{recursive:true});
const release=await acquireBuildLock(resolve(parent,'build.lock'));
let stage;
try{stage=await mkdtemp(resolve(parent,'.staging-'));}catch(error){await release();throw error;}
const target=resolve(parent,project.slug),previous=resolve(parent,`.${project.slug}.previous`);
async function compile(entry,outfile,platform,target) {
  const result=await build({absWorkingDir:ROOT,entryPoints:[entry],outfile:resolve(stage,outfile),
    bundle:true,format:'iife',platform,target,mainFields:platform==='neutral'?['module','main']:['browser','module','main'],
    conditions:[],splitting:false,metafile:true,minify:false,sourcemap:false,legalComments:'inline',charset:'utf8',logLevel:'warning'});
  for(const output of Object.values(result.metafile.outputs)) if(output.imports.length) throw new Error('Unresolved output import');
  // All runtime imports are local in v0.1. Adding dependencies requires a reviewed policy extension.
  if(Object.keys(result.metafile.inputs).some(p=>p.includes('node_modules')))throw new Error('Unexpected bundled runtime dependency');
}
async function copy(source,destination) {const to=resolve(stage,destination);await mkdir(resolve(to,'..'),{recursive:true});await writeFile(to,await readFile(resolve(ROOT,source)),{mode:0o644});}
try {
  await compile('src/main/index.ts','dist/main.js','neutral',project.hostTarget);
  if(project.preset==='controller')await compile('src/global/index.ts','dist/global.js','neutral',project.hostTarget);
  if(project.preset!=='command'){
    await compile('src/ui/index.ts','ui/index.js','browser',project.uiTarget);
    await copy('src/ui/index.html','ui/index.html');await copy('src/ui/style.css','ui/style.css');
  }
  if(project.preferences)await copy('src/preferences/index.html','preferences/index.html');
  await copy('Info.json','Info.json');
  await copy('LICENSE','LICENSE');
  const entries=await verifyStage(stage,project);
  // Retain a known-good stage until every build and verification step has completed.
  await rm(previous,{recursive:true,force:true});
  let hadPrevious=false;
  try{await stat(target);hadPrevious=true;}catch(error){if(error.code!=='ENOENT')throw error;}
  if(hadPrevious)await rename(target,previous);
  try{await rename(stage,target);}catch(error){if(hadPrevious)await rename(previous,target);throw error;}
  await rm(previous,{recursive:true,force:true});
  await writeFile(resolve(parent,'artifact-manifest.json'),JSON.stringify(entries,null,2)+'\n');
  console.log(JSON.stringify({layer:'esbuild-and-stage',status:'passed',stage:target}));
} catch(error) {await rm(stage,{recursive:true,force:true});throw error;}
finally {await release();}
