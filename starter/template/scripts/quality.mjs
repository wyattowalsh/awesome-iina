import {existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {ROOT,run} from './common.mjs';
const mode=process.argv[2];
if (!['format','format-check','lint'].includes(mode)) throw new Error('Use format, format-check, or lint');
const binary=resolve(ROOT,'node_modules/.bin',mode==='lint'?'biome':'prettier');
if (!existsSync(binary)) throw new Error('Quality tools missing. Run pnpm run bootstrap explicitly.');
if(mode==='lint') run(binary,['lint','.'],{stdio:'inherit'});
else {
  const paths=['src','scripts','tests','types','docs','schemas','.vscode','*.json','*.mjs','*.md','*.yaml','.github'];
  if(existsSync(resolve(ROOT,'site')))paths.push('site');
  run(binary,[mode==='format'?'--write':'--check',...paths,'--ignore-unknown'],{stdio:'inherit'});
}
