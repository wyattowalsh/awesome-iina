"""Structural workflow/pin checks, NOT a substitute for actionlint or zizmor."""
from __future__ import annotations
import argparse,json,re,sys
from pathlib import Path
import yaml
ROOT=Path(__file__).resolve().parents[1]

def verify(path:Path,registry:dict)->list[str]:
    text=path.read_text();data=yaml.load(text,Loader=yaml.BaseLoader)
    errors=[]
    if not isinstance(data,dict) or 'jobs' not in data:return [f'{path}: invalid workflow']
    if any(key in data.get('on',{}) for key in ('pull_request_target','workflow_run')):errors.append('Privileged PR workflow triggers are not baseline features')
    if data.get('permissions',{}).get('contents')!='read':errors.append('Top-level contents permission must be read')
    for name,job in data['jobs'].items():
        if 'uses' in job:continue
        if 'timeout-minutes' not in job:errors.append(f'{name}: missing timeout')
        if 'self-hosted' in str(job.get('runs-on')):errors.append('Persistent self-hosted runners are not baseline')
        for step in job.get('steps',[]):
            use=step.get('uses')
            if use and not use.startswith('./'):
                repo,sep,sha=use.partition('@')
                if not sep or not re.fullmatch(r'[0-9a-f]{40}',sha):errors.append(f'Unpinned action: {use}')
                if registry.get(repo,{}).get('sha')!=sha:errors.append(f'Unrecorded action ref: {use}')
            if use and use.startswith('actions/checkout@') and step.get('with',{}).get('persist-credentials')!='false':errors.append('Checkout credentials must not persist')
            if re.search(r'\$\{\{\s*(github\.event\.(issue|pull_request)|inputs\.)',step.get('run','')):errors.append('Untrusted expressions must not be interpolated into shell source')
    return [f'{path}: {e}' for e in errors]
if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('directory',nargs='?',type=Path,default=ROOT/'.github/workflows')
    args=parser.parse_args();registry=json.loads((ROOT/'references/action-pins.json').read_text())
    files=list(args.directory.glob('*.yml'));errors=[e for f in files for e in verify(f,registry)]
    if not files:errors.append('No workflows checked')
    for error in errors:print(error,file=sys.stderr)
    print(json.dumps({'layer':'structural-workflow-check','files':len(files),'errors':len(errors),'actionlint':'not-run','zizmor':'not-run'}))
    raise SystemExit(bool(errors))
