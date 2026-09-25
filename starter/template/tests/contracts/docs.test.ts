import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,readFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve} from 'node:path';
import {safeBase,markdownTitle,localLinks,readPages,prepare,rewriteGfmAlerts} from '../../scripts/docs.ts';

for(const base of ['/','/my-plugin/','/one/two/'])test(`safe docs base ${base}`,()=>assert.equal(safeBase(base),base));
for(const base of ['//evil/','../x','/missing-trailing-slash','https://bad/','/../','/a b/'])test(`reject docs base ${base}`,()=>assert.throws(()=>safeBase(base)));
test('frontmatter title preserves quoted data',()=>assert.equal(markdownTitle('---\ntitle: "A \\"quoted\\" title"\n---\n'), 'A "quoted" title'));
test('frontmatter title allows extra YAML keys',()=>assert.equal(
  markdownTitle('---\ntitle: Home\ndescription: Extra.\nsidebar:\n  order: 1\ntemplate: splash\nhero:\n  tagline: Hi\n---\n'),
  'Home',
));
test('missing title fails',()=>assert.throws(()=>markdownTitle('# No frontmatter')));
test('code-fenced example links are ignored',()=>assert.deepEqual(localLinks('```md\n[example](not-real.md)\n```\n[real](real.md)'),['real.md']));
test('shipped documentation links resolve',async()=>assert.ok((await readPages()).length>=5));
test('exclusive GFM alert map',()=>{
  const src=[
    '> [!NOTE]','> n','',
    '> [!TIP]','> t','',
    '> [!IMPORTANT]','> i','',
    '> [!WARNING]','> w','',
    '> [!CAUTION]','> c',
  ].join('\n');
  const out=rewriteGfmAlerts(src);
  assert.equal(out,[
    ':::note','n',':::','',
    ':::tip','t',':::','',
    ':::note','i',':::','',
    ':::caution','w',':::','',
    ':::danger','c',':::',
  ].join('\n'));
  assert.equal([...out.matchAll(/:::caution/g)].length,1);
  assert.equal([...out.matchAll(/:::danger/g)].length,1);
  assert.doesNotMatch(out,/:::important/);
  assert.doesNotMatch(out,/:::warning\b/);
});
test('fenced GFM alerts are not rewritten',()=>{
  const src='```md\n> [!NOTE]\n> stay\n```\n';
  assert.equal(rewriteGfmAlerts(src),src);
});
test('nested GFM alerts are not rewritten',()=>{
  const out=rewriteGfmAlerts('> [!NOTE]\n> outer\n> > [!TIP]\n> > inner\n');
  assert.equal(out,':::note\nouter\n> [!TIP]\n> inner\n:::\n');
  assert.doesNotMatch(out,/:::tip/);
});
test('docs exports are deterministic and preserve source warnings',async()=>{
 const root=await mkdtemp(resolve(tmpdir(),'docs-contract-'));
 try{
  await mkdir(resolve(root,'docs/content'),{recursive:true});
  await writeFile(resolve(root,'docs/content/index.md'),'---\ntitle: "Home"\n---\n\nNot native evidence.\n');
  await writeFile(resolve(root,'docs.config.json'),JSON.stringify({title:'Example',base:'/docs/'}));
  await writeFile(resolve(root,'package.json'),JSON.stringify({scripts:{check:'node check.mjs'}}));
  const first=await prepare({root,profile:'starlight'});
  const a=await readFile(resolve(root,'site/public/llms-full.txt'),'utf8');
  const second=await prepare({root,profile:'starlight'});
  assert.deepEqual(first,second);assert.equal(await readFile(resolve(root,'site/public/llms-full.txt'),'utf8'),a);
  assert.match(a,/Not native evidence/);assert.match(a,/node check.mjs/);
  assert.match(await readFile(resolve(root,'site/public/llms.txt'),'utf8'),/\/docs\/markdown\/index.md/);
 }finally{await rm(root,{recursive:true,force:true});}
});
test('GFM alerts rewrite only Starlight ingest',async()=>{
 const root=await mkdtemp(resolve(tmpdir(),'docs-alerts-'));
 try{
  await mkdir(resolve(root,'docs/content'),{recursive:true});
  await writeFile(resolve(root,'docs/content/index.md'),[
    '---','title: Home','description: Extra.','sidebar:','  order: 1','---','',
    '> [!NOTE]','> Keep this GFM in exports.','',
    '> [!CAUTION]','> Danger path.','',
    '```md','> [!WARNING]','> fenced','```','',
  ].join('\n'));
  await writeFile(resolve(root,'docs.config.json'),JSON.stringify({title:'Example',base:'/'}));
  await writeFile(resolve(root,'package.json'),JSON.stringify({scripts:{check:'node check.mjs'}}));
  await prepare({root,profile:'starlight'});
  const ingest=await readFile(resolve(root,'site/src/content/docs/index.md'),'utf8');
  const raw=await readFile(resolve(root,'site/public/markdown/index.md'),'utf8');
  const llms=await readFile(resolve(root,'site/public/llms-full.txt'),'utf8');
  const reports=await readFile(resolve(root,'reports/docs/llms-full.txt'),'utf8');
  assert.match(ingest,/:::note/);
  assert.match(ingest,/:::danger/);
  assert.doesNotMatch(ingest,/:::caution/);
  assert.match(ingest,/> \[!WARNING\]/);
  assert.match(raw,/> \[!NOTE\]/);
  assert.match(raw,/> \[!CAUTION\]/);
  assert.doesNotMatch(raw,/:::note/);
  assert.doesNotMatch(raw,/:::danger/);
  assert.match(llms,/> \[!NOTE\]/);
  assert.doesNotMatch(llms,/:::note/);
  assert.match(reports,/> \[!NOTE\]/);
  assert.doesNotMatch(reports,/:::note/);
 }finally{await rm(root,{recursive:true,force:true});}
});
