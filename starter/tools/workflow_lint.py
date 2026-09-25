"""Run separately installed actionlint and zizmor on actual YAML, never on Jinja."""
from __future__ import annotations
import argparse,shutil,subprocess
from pathlib import Path

def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('directory',nargs='?',type=Path,default=Path('.github/workflows'))
    args=parser.parse_args();files=sorted(args.directory.glob('*.yml'))
    if not files:raise SystemExit('No rendered workflow YAML found')
    for tool in ('actionlint','zizmor'):
        if not shutil.which(tool):raise SystemExit(f'{tool} is not installed. No passing analyzer result is being reported.')
    subprocess.run(['actionlint',*[str(f) for f in files]],check=True)
    subprocess.run(['zizmor',str(args.directory)],check=True)
if __name__=='__main__':main()
