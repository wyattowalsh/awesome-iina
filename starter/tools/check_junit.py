"""Reject empty or skipped required integration suites. This does not manufacture a test pass."""
from __future__ import annotations
import argparse
import xml.etree.ElementTree as ET
from pathlib import Path

def validate(path: Path, suite: str) -> int:
    root=ET.parse(path).getroot()
    key=suite.replace('-', '_')
    cases=[c for c in root.iter('testcase') if key in c.get('classname','')]
    if not cases: raise ValueError(f'Required suite has no cases: {suite}')
    failed=[c for c in cases if any(c.find(k) is not None for k in ('failure','error','skipped'))]
    if failed: raise ValueError(f'Required suite did not fully pass: {len(failed)}/{len(cases)}')
    return len(cases)
if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('report',type=Path);parser.add_argument('--require-suite',required=True)
    args=parser.parse_args();print(f'Required integration cases passed: {validate(args.report,args.require_suite)}')
