import {readFile,lstat} from 'node:fs/promises';
import {resolve,relative} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {ROOT,json,inside,walk} from './common.mjs';
const presets=new Set(['command','sidebar','overlay','controller']);
const permissions=new Set(['show-osd','show-alert','video-overlay','network-request','file-system']);
export function validateManifest(manifest,project) {
  if(!presets.has(project.preset)) throw new Error('Unknown preset');
  if(typeof project.preferences!=='boolean')throw new Error('preferences must be boolean');
  if(project.docsProfile!==undefined&&!['markdown','starlight'].includes(project.docsProfile))throw new Error('Invalid docs profile');
  if(project.hooks!==undefined&&typeof project.hooks!=='boolean')throw new Error('hooks must be boolean');
  if(!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(project.slug) || project.slug.length>64) throw new Error('Invalid slug');
  if(manifest.identifier!==project.identifier) throw new Error('Plugin identity changed without migration');
  if(typeof manifest.name!=='string'||!manifest.name.trim()) throw new Error('Manifest name is required');
  if(typeof manifest.author!=='object'||manifest.author===null||Array.isArray(manifest.author)||
     typeof manifest.author.name!=='string'||!manifest.author.name.trim()||
     Object.values(manifest.author).some(value=>typeof value!=='string'))
    throw new Error('Manifest author must be a string-valued object with a non-empty name');
  if(!/^[A-Za-z][A-Za-z0-9-]*(?:\.[A-Za-z][A-Za-z0-9-]*)+$/.test(manifest.identifier)) throw new Error('Invalid identifier');
  if(typeof manifest.version!=='string'||!/^\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?$/.test(manifest.version)) throw new Error('Invalid plugin version');
  if(!Array.isArray(manifest.permissions)||manifest.permissions.some(p=>!permissions.has(p))||new Set(manifest.permissions).size!==manifest.permissions.length) throw new Error('Invalid permissions');
  const approved=project.preset==='overlay'?['video-overlay']:[];
  if(JSON.stringify([...manifest.permissions].sort())!==JSON.stringify(approved)) throw new Error('Permission expansion requires explicit policy review');
  if('global' in manifest || 'subProviders' in manifest) throw new Error('Unsupported alias manifest key');
  if('allowedDomains' in manifest) throw new Error('Baseline must not enable network domains');
  if(manifest.entry!=='dist/main.js') throw new Error('Unexpected main entry');
  if((manifest.globalEntry!==undefined)!==(project.preset==='controller') || (manifest.globalEntry && manifest.globalEntry!=='dist/global.js')) throw new Error('Global entry mismatch');
  if((manifest.sidebarTab!==undefined)!==(project.preset==='sidebar')) throw new Error('Sidebar declaration mismatch');
  if((manifest.preferencesPage!==undefined)!==project.preferences || (manifest.preferencesPage && manifest.preferencesPage!=='preferences/index.html')) throw new Error('Preferences page mismatch');
  for(const key of ['entry','globalEntry','preferencesPage']) if(manifest[key]!==undefined) inside(ROOT,manifest[key]);
}
export function expectedFiles(project) {
  const files=['Info.json','LICENSE','dist/main.js'];
  if(project.preset==='controller') files.push('dist/global.js');
  if(project.preset!=='command') files.push('ui/index.html','ui/index.js','ui/style.css');
  if(project.preferences) files.push('preferences/index.html');
  return files.sort();
}
export async function verifyStage(stage,project) {
  if ((await lstat(stage)).isSymbolicLink()) throw new Error('Staging root cannot be a symlink');
  const manifest=JSON.parse(await readFile(inside(stage,'Info.json'),'utf8'));
  validateManifest(manifest,project);
  const all=await walk(stage), names=all.map(p=>relative(stage,p).replaceAll('\\','/')).sort();
  if(JSON.stringify(names)!==JSON.stringify(expectedFiles(project))) throw new Error(`Staged files differ from allowlist: ${names.join(', ')}`);
  for(const path of all) {
    if((await lstat(path)).mode & 0o111) throw new Error(`Executable bit not allowed: ${path}`);
    if(path.endsWith('.html')) {
      const html=await readFile(path,'utf8');
      for(const match of html.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/g)) {
        if(/^[a-z][a-z0-9+.-]*:/i.test(match[1])||match[1].startsWith('//')) throw new Error('External UI asset not allowed');
        await lstat(inside(resolve(path,'..'),match[1]));
      }
    }
  }
  const entries=[];
  for(const path of all) entries.push({path:relative(stage,path).replaceAll('\\','/'),sha256:createHash('sha256').update(await readFile(path)).digest('hex')});
  return entries;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  const project=await json('.iina-project.json');
  validateManifest(await json('Info.json'),project);
  const entries=process.argv.includes('--stage')?await verifyStage(resolve(ROOT,'.build',project.slug),project):undefined;
  console.log(JSON.stringify({layer:entries?'staged-artifact':'manifest-policy',status:'passed',entries},null,2));
}
