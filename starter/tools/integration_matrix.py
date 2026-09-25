"""Generate with actual Copier, bootstrap, normalize, check, build and inspect one profile.

Network access and the declared Node/pnpm toolchain are required. This never falls back
on the fixture renderer. The fresh-project formatting step is explicit and reported.
"""
from __future__ import annotations
import argparse,json,os,subprocess,tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
import sys
if str(ROOT) not in sys.path: sys.path.insert(0,str(ROOT))
from tools.copier_source import copy_source


def run(args,cwd):
    subprocess.run(args,cwd=cwd,check=True,timeout=900)

def main():
    import copier
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source',type=Path,default=ROOT,help='Standalone template root or integrated Awesome IINA root')
    parser.add_argument('--preset',choices=['command','sidebar','overlay','controller'],default='sidebar')
    parser.add_argument('--preferences',choices=['true','false'],default='true')
    parser.add_argument('--docs',choices=['markdown','starlight'],default='starlight')
    args=parser.parse_args()
    with tempfile.TemporaryDirectory(prefix='iina real integration ') as tmp:
        source=Path(tmp)/'template'
        fingerprint=copy_source(args.source,source)
        run(['git','init','-b','main'],source)
        run(['git','add','.'],source)
        run(['git','-c','core.hooksPath='+os.devnull,'-c','commit.gpgsign=false','-c','user.name=Template CI','-c','user.email=template-ci@example.invalid','commit','-m','Test source snapshot'],source)
        destination=Path(tmp)/'plugin'
        copier.run_copy(str(source),destination,defaults=True,vcs_ref='HEAD',data={'preset':args.preset,'preferences':args.preferences=='true','docs_profile':args.docs,'hooks':True})
        run(['python',str(ROOT/'tools/verify_workflows.py'),str(destination/'.github/workflows')],ROOT)
        for script in ['bootstrap','fmt','check','build','verify:stage','docs:prepare']:
            run(['pnpm','run',script],destination)
        if args.docs=='starlight':run(['pnpm','run','docs:build'],destination)
        # Check actual selected-compiler rejection, not only successful typing of a mock.
        bad=destination/'src/main/negative-probe.ts';bad.write_text('document.title = "wrong runtime";\nexport {};\n')
        try:
            check=subprocess.run([str(destination/'node_modules/.bin/tsc'),'--project','tsconfig.main.json','--pretty','false'],cwd=destination,text=True,capture_output=True,timeout=60)
            if check.returncode==0 or 'negative-probe.ts' not in check.stdout:raise RuntimeError('Negative runtime compiler check did not reject the probe')
        finally:bad.unlink()
        report={'source_sha256':fingerprint,'source_layout':'integrated' if (args.source/'starter').is_dir() else 'standalone','generation':'real-copier','preset':args.preset,'preferences':args.preferences,'docs':args.docs,'fresh_format':'explicitly-normalized','native':'not-run','status':'passed'}
        out=ROOT/'reports';out.mkdir(exist_ok=True)
        (out/f'integration-{args.preset}-{args.preferences}-{args.docs}.json').write_text(json.dumps(report,indent=2)+'\n')
        print(json.dumps(report))
if __name__=='__main__':main()
