import {resolve,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {spawnSync} from 'node:child_process';
import {readPages,prepare} from '../template/scripts/docs.ts';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');

if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href) {
  const mode=process.argv[2]??'check';
  if(mode==='check')console.log(JSON.stringify({status:'passed',pages:(await readPages(resolve(root,'docs/content'))).length}));
  else if(['prepare','dev','build'].includes(mode)) {
    console.log(JSON.stringify(await prepare({root,profile:'starlight'})));
    if(mode!=='prepare') {
      const result=spawnSync(resolve(root,'node_modules/.bin/astro'),[mode,'--root','site'],{cwd:root,stdio:'inherit',shell:false});
      if(result.error)throw result.error;process.exitCode=result.status??1;
    }
  }else throw new Error('Use check, prepare, dev or build.');
}
