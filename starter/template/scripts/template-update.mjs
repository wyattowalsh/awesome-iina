import {run, readCopierLineage, assertUpdateReference} from './template-lineage.mjs';
const args=process.argv.slice(2).filter(x=>x!=='--');
if(args.length!==1)throw new Error('Provide one explicit tag or commit, without trust or answer flags');
assertUpdateReference(args[0]);
await readCopierLineage();
if(run('git',['status','--porcelain']).trim())throw new Error('Commit or stash all changes first');
if(!/^(template-update|renovate)\//.test(run('git',['branch','--show-current']).trim()))throw new Error('Use a separate template-update/<name> or renovate/<name> branch or worktree');
run('uvx',['--from','copier==9.18.2','copier','update','--defaults',`--vcs-ref=${args[0]}`],{stdio:'inherit'});
console.log('Review the complete diff and conflicts. Dependency installation, permission changes and publishing are not automatic.');
