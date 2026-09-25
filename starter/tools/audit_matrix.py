"""Run available generated-project checks, recording substitutions explicitly."""
from __future__ import annotations
import argparse,json,os,shutil,subprocess,sys,tempfile
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from tools.fixture_render import ROOT,PRESETS,render

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--preset",choices=PRESETS,help="Check only this preset; omit for all four")
    args=parser.parse_args()
    api=os.environ.get('IINA_AUDIT_TS_API')
    compiler=os.environ.get('IINA_AUDIT_TSC')
    results=[]
    out=ROOT/'evidence/current/generated';out.mkdir(parents=True,exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='iina-audit-') as tmp:
        for preset in ([args.preset] if args.preset else PRESETS):
            for preferences in [False,True]:
                name=preset+('-preferences' if preferences else '')
                dest=Path(tmp)/name;render(dest,dict(preset=preset,preferences=preferences))
                commands=[['node','scripts/typecheck.mjs'],['node','scripts/boundaries.mjs'],['node','scripts/validate.mjs'],
                          ['node','--test',*[str(p.relative_to(dest)) for p in sorted((dest/'tests').rglob('*.test.mjs'))]]]
                for command in commands:
                    proc=subprocess.run(command,cwd=dest,capture_output=True,text=True,timeout=40)
                    slug=Path(command[1]).stem if command[1]!='--test' else 'node-tests'
                    (out/f'{name}-{slug}.txt').write_text(proc.stdout+proc.stderr)
                    results.append(dict(preset=preset,preferences=preferences,command=command,returncode=proc.returncode))
                    print(name,slug,proc.returncode)
                    if proc.returncode:print((proc.stdout+proc.stderr)[-6000:])
        sample=ROOT/'examples/sidebar-preview'
        if sample.exists():shutil.rmtree(sample)
        render(sample,dict(preset='sidebar',preferences=True,plugin_name='IINA Sidebar Example',plugin_slug='iina-sidebar-example'))
        # Do not ship a fabricated update lineage with the pre-rendered demonstration.
        (sample/'.copier-answers.yml').unlink()
        (sample/'FIXTURE-NOT-COPIER.md').write_text('This review fixture was rendered with the offline Jinja harness, not Copier. It has no Copier lineage. Generate a new project with real Copier before relying on updates.\n')
    result={'node':subprocess.check_output(['node','--version'],text=True).strip(),
            'ts_api_override':api,'ts_cli_override':compiler,'results':results,
            'copier':'not-run','pnpm_install':'not-run','esbuild_production_build':'not-run','IINA_native':'not-run'}
    (ROOT/'evidence/current'/('generated-audit-'+args.preset+'.json' if args.preset else 'generated-audit.json')).write_text(json.dumps(result,indent=2)+'\n')
    return int(any(r['returncode'] for r in results))
if __name__=='__main__':raise SystemExit(main())
