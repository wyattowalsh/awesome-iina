import {mkdtemp,cp,mkdir,readdir,lstat,readlink,rm} from 'node:fs/promises';
import {resolve} from 'node:path';
import {tmpdir,homedir} from 'node:os';
import {ROOT,json,run} from './common.mjs';
import {verifyStage} from './validate.mjs';
const action=process.argv[2];if(!['link','unlink','pack'].includes(action))throw new Error('Expected link, unlink or pack');
if(process.platform!=='darwin')throw new Error('Official IINA CLI operations require macOS');
const project=await json('.iina-project.json');
const stage=resolve(ROOT,'.build',project.slug);
if(action!=='unlink')await verifyStage(stage,project);
const cli=process.env.IINA_CLI||'/Applications/IINA.app/Contents/MacOS/iina-plugin';
const link=resolve(homedir(),'Library/Application Support/com.colliderli.iina/plugins',`${project.slug}.iinaplugin-dev`);
if(action==='link'||action==='unlink'){
  let existing;
  try{const stat=await lstat(link);if(!stat.isSymbolicLink())throw new Error('Existing non-symlink plugin; refusing mutation');existing=await readlink(link);}catch(error){if(error.code!=='ENOENT')throw error;}
  if(existing&&resolve(link,'..',existing)!==stage)throw new Error('Development link belongs to a different checkout');
  if(action==='link'&&existing&&resolve(link,'..',existing)===stage){console.log('Already linked to this stage');process.exit(0);}
  if(action==='unlink'&&!existing){console.log('No link to remove');process.exit(0);}
  run(cli,[action,stage],{stdio:'inherit'});
}else{
  // The old native packer assembles a shell command. Use a conservative temp path.
  const temp=await mkdtemp(resolve(tmpdir(),'iina-pack-'));
  if(!/^[A-Za-z0-9_./-]+$/.test(temp))throw new Error('Native CLI packaging needs a shell-safe temporary parent');
  try{
    const source=resolve(temp,project.slug);await cp(stage,source,{recursive:true});
    run(cli,['pack',source],{cwd:temp,stdio:'inherit'});
    const archives=(await readdir(temp)).filter(n=>n.endsWith('.iinaplgz'));
    if(archives.length!==1)throw new Error('Official packer did not emit exactly one archive');
    const archive=resolve(temp,archives[0]);
    console.log(run('python3',[resolve(ROOT,'scripts/inspect-archive.py'),archive,source]));
    const dest=resolve(ROOT,'artifacts');await mkdir(dest,{recursive:true});
    await cp(archive,resolve(dest,archives[0]),{errorOnExist:true,force:false});
    console.log(resolve(dest,archives[0]));
  }finally{await rm(temp,{recursive:true,force:true});}
}
