import {existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {ROOT,json,run} from './common.mjs';
const pkg=await json('package.json');
const expected=pkg.packageManager.replace('pnpm@','');
if (run('pnpm',['--version']).trim()!==expected) throw new Error(`Install the pinned pnpm ${expected} first.`);
run('pnpm',['install',existsSync(resolve(ROOT,'pnpm-lock.yaml'))?'--frozen-lockfile':'--no-frozen-lockfile'],{stdio:'inherit'});
console.log('Review and commit pnpm-lock.yaml. Installation never installs Git hooks or links IINA.');
