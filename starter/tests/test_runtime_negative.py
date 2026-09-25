"""Actual compiler rejection tests. Audit compiler substitutions are recorded in evidence."""
from __future__ import annotations
import json,os,subprocess
from pathlib import Path
import pytest
from tools.fixture_render import render
CASES=[
 ('command','main','document.title = "wrong";'),
 ('command','main','fetch("https://example.invalid");'),
 ('command','main','process.exit(0);'),
 ('command','main','Buffer.from("wrong");'),
 ('command','main','iina.sidebar.show();'),
 ('controller','global','iina.mpv.getString("media-title");'),
 ('controller','global','iina.event.on("iina.file-loaded", () => {});'),
 ('controller','global','iina.global.postMessage("name", {});'),
 ('controller','main','iina.global.postMessage(null, "name", {});'),
 ('sidebar','ui','iina.mpv.getFlag("pause");'),
 ('sidebar','ui','process.cwd();'),
]
@pytest.mark.parametrize('preset,role,code',CASES)
def test_incompatible_runtime_rejected(tmp_path:Path,preset:str,role:str,code:str):
    dest=tmp_path/'negative';render(dest,dict(preset=preset))
    file=dest/f'src/{role}/negative.ts';file.write_text(code+'\nexport {};\n')
    compiler=os.environ.get('IINA_AUDIT_TSC') or str(dest/'node_modules/.bin/tsc')
    if not Path(compiler).exists():pytest.skip('No typechecker installed for negative checks')
    result=subprocess.run([compiler,'--project',f'tsconfig.{role}.json','--pretty','false'],cwd=dest,capture_output=True,text=True)
    assert result.returncode!=0
    assert 'negative.ts' in result.stdout
    assert any(code in result.stdout for code in ['TS2584','TS2304','TS2580','TS2591','TS2339','TS2554']),result.stdout
