import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import {resolve,relative,dirname,extname} from 'node:path';
import {pathToFileURL} from 'node:url';
import {ROOT,walk,json,inside,run} from './common.mjs';

type DocsPage = {path: string; title: string; text: string};
type PrepareOptions = {root?: string; profile?: string; base?: string};
type GfmAlert = 'NOTE' | 'TIP' | 'IMPORTANT' | 'WARNING' | 'CAUTION';
type StarlightAside = 'note' | 'tip' | 'caution' | 'danger';

const GFM_ALERT_TO_ASIDE: {readonly [K in GfmAlert]: StarlightAside} = {
  NOTE: 'note',
  TIP: 'tip',
  IMPORTANT: 'note',
  WARNING: 'caution',
  CAUTION: 'danger',
};
const GFM_ALERT_OPEN = /^> \[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*$/;

export function safeBase(value: unknown): string {
  if(typeof value!=='string'||!/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(value)) throw new Error('DOCS_BASE must be / or a slash-terminated safe subpath.');
  return value;
}
export function markdownTitle(text: string): string {
  const front=text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if(!front) throw new Error('Documentation needs frontmatter.');
  const value=front[1].match(/^title:\s*(.+)$/m)?.[1];
  if(!value) throw new Error('Documentation needs a title.');
  const title=value.startsWith('"')?JSON.parse(value):value.replace(/^'|'$/g,'');
  if(typeof title!=='string'||!title.trim()) throw new Error('Invalid documentation title.');
  return title;
}
function withoutCode(text: string): string {
  let fence: string | null = null;
  return text.split('\n').map(line=>{
    const m=line.match(/^\s*(`{3,}|~{3,})/);
    if(m){if(!fence)fence=m[1];else if(m[1][0]===fence[0]&&m[1].length>=fence.length)fence=null;return '';}
    return fence?'':line.replace(/`[^`]*`/g,'');
  }).join('\n');
}
export function localLinks(text: string): string[] {
  return [...withoutCode(text).matchAll(/\[[^\]]*\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g)]
    .map(m=>m[1]).filter(href=>!href.startsWith('#')&&!/^[a-z][a-z0-9+.-]*:/i.test(href)&&!href.startsWith('//'));
}
function stripQuotePrefix(line: string): string {
  if(line.startsWith('> ')) return line.slice(2);
  if(line.startsWith('>')) return line.slice(1);
  return line;
}
/** Rewrite GitHub GFM alerts to Starlight asides. Nested and fenced markers stay GFM. */
export function rewriteGfmAlerts(text: string): string {
  const lines=text.split('\n');
  const out: string[] = [];
  let fence: string | null = null;
  let i=0;
  while(i<lines.length) {
    const line=lines[i].replace(/\r$/,'');
    const fenceMark=line.match(/^\s*(`{3,}|~{3,})/);
    if(fenceMark) {
      if(!fence) fence=fenceMark[1];
      else if(fenceMark[1][0]===fence[0]&&fenceMark[1].length>=fence.length) fence=null;
      out.push(lines[i]);
      i+=1;
      continue;
    }
    if(fence) {
      out.push(lines[i]);
      i+=1;
      continue;
    }
    const open=line.match(GFM_ALERT_OPEN);
    if(!open) {
      out.push(lines[i]);
      i+=1;
      continue;
    }
    const aside=GFM_ALERT_TO_ASIDE[open[1] as GfmAlert];
    const body: string[] = [];
    i+=1;
    while(i<lines.length) {
      const next=lines[i].replace(/\r$/,'');
      if(!next.startsWith('>')) break;
      body.push(stripQuotePrefix(next));
      i+=1;
    }
    out.push(`:::${aside}`);
    if(body.length) out.push(...body);
    out.push(':::');
  }
  return out.join('\n');
}
export async function readPages(root=resolve(ROOT,'docs/content')): Promise<DocsPage[]> {
  const files=(await walk(root)).filter(f=>extname(f)==='.md');
  if(!files.length) throw new Error('Documentation source is empty.');
  const pages: DocsPage[] = [];
  for(const file of files){const text=await readFile(file,'utf8');pages.push({path:relative(root,file).replaceAll('\\','/'),title:markdownTitle(text),text});}
  const names=new Set(pages.map(p=>p.path));
  for(const page of pages) for(const href of localLinks(page.text)) {
    const raw=decodeURIComponent(href.split('#')[0].split('?')[0]);
    if(!raw)continue;
    if(raw.startsWith('/')) throw new Error(`${page.path}: use source-relative Markdown links.`);
    const local=relative(root,resolve(root,dirname(page.path),raw)).replaceAll('\\','/');
    inside(root,local);
    if(!names.has(local))throw new Error(`${page.path}: missing local Markdown destination ${href}`);
  }
  return pages;
}
export async function prepare({root=ROOT,profile,base}: PrepareOptions={}): Promise<{profile: string | undefined; pages: number; base: string}> {
  const config=JSON.parse(await readFile(resolve(root,'docs.config.json'),'utf8'));
  const actualBase=safeBase(base??process.env.DOCS_BASE??config.base??'/');
  const project=profile?{docsProfile:profile}:JSON.parse(await readFile(resolve(root,'.iina-project.json'),'utf8'));
  profile??=project.docsProfile;
  const pages=await readPages(resolve(root,'docs/content'));
  const pkg=JSON.parse(await readFile(resolve(root,'package.json'),'utf8'));
  if(pages.some(p=>p.path==='reference/commands.md'))throw new Error('reference/commands.md is generated; choose another source filename.');
  const commands='---\ntitle: "Command reference"\n---\n\nGenerated from package.json. Do not hand-edit.\n\n'+Object.entries(pkg.scripts).sort(([a],[b])=>a.localeCompare(b)).map(([name,command])=>`## pnpm run ${name}\n\n\`\`\`sh\n${command}\n\`\`\`\n`).join('\n');
  pages.push({path:'reference/commands.md',title:'Command reference',text:commands});
  const destination=resolve(root,'reports/docs');
  await rm(destination,{recursive:true,force:true});await mkdir(resolve(destination,'markdown'),{recursive:true});
  for(const p of pages){const path=inside(resolve(destination,'markdown'),p.path);await mkdir(dirname(path),{recursive:true});await writeFile(path,p.text);}
  const index=`# ${String(config.title).replaceAll('\n',' ')}\n\n> Project documentation. Native compatibility is established separately.\n\n`+pages.map(p=>`- [${p.title.replace(/[\[\]\n]/g,' ')}](${actualBase}markdown/${p.path})`).join('\n')+'\n';
  await writeFile(resolve(destination,'llms.txt'),index);
  await writeFile(resolve(destination,'llms-full.txt'),pages.map(p=>`\n<!-- ${p.path} -->\n${p.text}`).join('\n'));
  if(profile==='starlight') {
    const content=resolve(root,'site/src/content/docs'),publicDir=resolve(root,'site/public');
    await rm(content,{recursive:true,force:true});await mkdir(content,{recursive:true});
    // Only our exported paths are replaced, never an arbitrary public directory.
    await rm(resolve(publicDir,'markdown'),{recursive:true,force:true});await mkdir(publicDir,{recursive:true});
    for(const p of pages) {
      const out=inside(content,p.path);await mkdir(dirname(out),{recursive:true});
      const rendered=p.text.replace(/\]\(([^\s)]+\.md)(#[^\s)]*)?\)/g,(match,href,fragment='')=>{
        if(/^[a-z][a-z0-9+.-]*:/i.test(href)||href.startsWith('//'))return match;
        const local=relative(resolve(root,'docs/content'),resolve(root,'docs/content',dirname(p.path),href)).replaceAll('\\','/');
        const route=local.replace(/(?:^|\/)index\.md$/,'/').replace(/\.md$/,'/').replace(/^\//,'');
        return `](${actualBase}${route}${fragment})`;
      });
      await writeFile(out,rewriteGfmAlerts(rendered));
      const raw=inside(resolve(publicDir,'markdown'),p.path);await mkdir(dirname(raw),{recursive:true});await writeFile(raw,p.text);
    }
    for(const name of ['llms.txt','llms-full.txt'])await writeFile(resolve(publicDir,name),await readFile(resolve(destination,name)));
  }
  return {profile,pages:pages.length,base:actualBase};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href) {
  const mode=process.argv[2]??'check';
  if(mode==='check')console.log(JSON.stringify({layer:'markdown-local-links',pages:(await readPages()).length,status:'passed',anchors:'not-validated'}));
  else if(['prepare','build','dev'].includes(mode)) {
    const project=await json('.iina-project.json');
    if(mode!=='prepare'&&project.docsProfile!=='starlight')throw new Error('This project uses Markdown docs. Enable a site through a reviewed profile migration.');
    console.log(JSON.stringify(await prepare()));
    if(mode!=='prepare')run(resolve(ROOT,'node_modules/.bin/astro'),[mode==='dev'?'dev':'build','--root','site'],{stdio:'inherit'});
  } else throw new Error('Use docs check, prepare, build or dev.');
}
