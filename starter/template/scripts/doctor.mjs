import {access,readFile,readlink,lstat} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {homedir} from 'node:os';
import {spawnSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {ROOT,json} from './common.mjs';
export function supportView(report) {
  // Allowlist fields. Do not redact arbitrary raw logs and assume they became safe.
  const version=value=>typeof value==='string'&&/^\d+\.\d+\.\d+(?:[-+][A-Za-z0-9.-]+)?$/.test(value)?value:null;
  const known=new Set(['node','pnpm','lockfile','iina-cli','dev-link','IINA-native-execution']);
  const statuses=new Set(['passed','mismatch','missing-or-mismatch','present','missing','owned','conflict','absent','not-run']);
  return {schemaVersion:1,platform:['darwin','linux','win32'].includes(report.platform)?report.platform:'other',arch:['x64','arm64','ia32','arm'].includes(report.arch)?report.arch:'other',
    versions:{node:version(report.versions?.node),pnpm:version(report.versions?.pnpm)},checks:report.checks.filter(x=>known.has(x.check)).map(({check,status})=>({check,status:statuses.has(status)?status:'unknown'})),
    privacy:'No media paths, file contents, environment values, URLs, or raw logs included.'};
}
export async function diagnose() {
  const project=await json('.iina-project.json'),pkg=await json('package.json');
  const expected=(await readFile(resolve(ROOT,'.node-version'),'utf8')).trim();
  const checks=[]; const add=(check,status)=>checks.push({check,status});
  const probe=(cmd,args)=>{const r=spawnSync(cmd,args,{encoding:'utf8',shell:false,timeout:5000});return r.status===0?r.stdout.trim():null;};
  const pnpm=probe('pnpm',['--version']);
  add('node',process.versions.node===expected?'passed':'mismatch');
  add('pnpm',pnpm===pkg.packageManager.replace('pnpm@','')?'passed':'missing-or-mismatch');
  for(const [check,path] of [['lockfile',resolve(ROOT,'pnpm-lock.yaml')],['iina-cli',process.env.IINA_CLI||'/Applications/IINA.app/Contents/MacOS/iina-plugin']]) {
    try{await access(path);add(check,'present');}catch{add(check,'missing');}
  }
  const link=resolve(homedir(),'Library/Application Support/com.colliderli.iina/plugins',`${project.slug}.iinaplugin-dev`);
  try{const s=await lstat(link);add('dev-link',s.isSymbolicLink()&&resolve(dirname(link),await readlink(link))===resolve(ROOT,'.build',project.slug)?'owned':'conflict');}
  catch(error){if(error.code!=='ENOENT')throw error;add('dev-link','absent');}
  add('IINA-native-execution','not-run');
  return {schemaVersion:1,platform:process.platform,arch:process.arch,versions:{node:process.versions.node,pnpm},checks};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href) {
  const report=await diagnose(),support=process.argv.includes('--support');
  if(support||process.argv.includes('--json')) console.log(JSON.stringify(support?supportView(report):report,null,2));
  else {console.log(`IINA plugin development doctor (${report.platform}/${report.arch})`);for(const r of report.checks)console.log(`${r.check}: ${r.status}`);}
  if(process.argv.includes('--strict')&&report.checks.some(x=>['mismatch','missing-or-mismatch','missing','conflict'].includes(x.status)))process.exitCode=1;
}
