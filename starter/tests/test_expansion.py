from __future__ import annotations
import json,subprocess,sys
from pathlib import Path
import pytest,yaml
from tools.fixture_render import ROOT,PRESETS,render
from tools.verify_workflows import verify
from tools.check_junit import validate

@pytest.mark.parametrize('preset',PRESETS)
@pytest.mark.parametrize('preferences',[False,True])
@pytest.mark.parametrize('docs_profile',['markdown','starlight'])
@pytest.mark.parametrize('hooks',[False,True])
def test_expanded_matrix(tmp_path,preset,preferences,docs_profile,hooks):
    dest=tmp_path/'plugin'
    render(dest,dict(preset=preset,preferences=preferences,docs_profile=docs_profile,hooks=hooks))
    pkg=json.loads((dest/'package.json').read_text())
    assert (dest/'site/astro.config.ts').exists()==(docs_profile=='starlight')
    assert not (dest/'site/astro.config.mjs').exists()
    assert ('astro' in pkg['devDependencies'])==(docs_profile=='starlight')
    assert ('tailwindcss' in pkg['devDependencies'])==(docs_profile=='starlight')
    assert ('@tailwindcss/vite' in pkg['devDependencies'])==(docs_profile=='starlight')
    assert ('@astrojs/starlight-tailwind' in pkg['devDependencies'])==(docs_profile=='starlight')
    if docs_profile=='starlight':
        assert pkg['devDependencies']['tailwindcss']=='4.3.3'
        assert pkg['devDependencies']['@tailwindcss/vite']=='4.3.3'
        assert pkg['devDependencies']['@astrojs/starlight-tailwind']=='5.0.0'
        styles='\n'.join(path.read_text() for path in (dest/'site/src/styles').rglob('*.css'))
        assert '--brand-' not in styles
    assert (dest/'lefthook.yml').exists()==hooks
    assert (dest/'.github/workflows/docs.yml').exists()==(docs_profile=='starlight')
    registry=json.loads((ROOT/'references/action-pins.json').read_text())
    for workflow in (dest/'.github/workflows').glob('*.yml'): assert not verify(workflow,registry)
    for schema in (dest/'schemas').glob('*.json'):assert json.loads(schema.read_text())['$schema']
    for required in ['doctor','check','bootstrap','dev','preview','docs:check','release:prepare']:
        assert required in pkg['scripts']
    assert 'pnpm run pack' in (dest/'justfile').read_text()
    assert not (dest/'mise.lock').exists() # no fabricated resolver output

@pytest.mark.parametrize('profile',['wrong','../../outside','Starlight'])
def test_invalid_docs_profile(tmp_path,profile):
    with pytest.raises(ValueError):render(tmp_path/'plugin',dict(docs_profile=profile))

@pytest.mark.parametrize('kind',['empty','skipped','failure'])
def test_junit_gate_fails_closed(tmp_path,kind):
    p=tmp_path/'junit.xml'
    if kind=='empty':text='<testsuites><testsuite/></testsuites>'
    else:text=f'<testsuite><testcase classname="tests.test_real_copier"><{kind}/></testcase></testsuite>'
    p.write_text(text)
    with pytest.raises(ValueError):validate(p,'real-copier')

def test_junit_gate_accepts_executed_cases(tmp_path):
    p=tmp_path/'junit.xml';p.write_text('<testsuite><testcase classname="tests.test_real_copier"/></testsuite>')
    assert validate(p,'real-copier')==1

def test_required_copier_does_not_silently_skip(tmp_path):
    # Test the gate directly; full REQUIRE_COPIER behavior runs in integration CI.
    report=tmp_path/'report.xml';report.write_text('<testsuite><testcase classname="tests.test_real_copier"><skipped/></testcase></testsuite>')
    result=subprocess.run([sys.executable,str(ROOT/'tools/check_junit.py'),str(report),'--require-suite','real-copier'],capture_output=True,text=True)
    assert result.returncode!=0

def test_root_workflows_are_pinned():
    registry=json.loads((ROOT/'references/action-pins.json').read_text())
    for workflow in (ROOT/'.github/workflows').glob('*.yml'):assert not verify(workflow,registry)


def test_provisioning_versions_are_consistent(tmp_path):
    import tomllib
    tools=json.loads((ROOT/'toolchain.json').read_text())
    dest=tmp_path/'plugin'; render(dest,dict(docs_profile='starlight'))
    for path in [ROOT/'mise.toml',dest/'mise.toml']:
        provision=tomllib.loads(path.read_text())['tools']
        for name,value in provision.items():assert tools[name]==value
    package=json.loads((dest/'package.json').read_text())
    assert package['packageManager']==f"pnpm@{tools['pnpm']}"
    assert (dest/'.node-version').read_text().strip()==tools['node']
    assert package['devDependencies']['typescript']==tools['typescript']
    assert package['devDependencies']['@typescript/typescript6']==tools['compilerApi']
    assert package['devDependencies']['astro']==tools['astro']
    assert package['devDependencies']['@astrojs/starlight']==tools['starlight']


def test_renovate_jinja_extraction_ignores_plugin_version():
    import re
    config=json.loads((ROOT/'renovate.json').read_text())
    # Python named-group syntax differs from RE2. All other expressions are identical.
    pattern=config['customManagers'][0]['matchStrings'][0].replace('(?<depName>', '(?P<depName>').replace('(?<currentValue>', '(?P<currentValue>')
    matches=[m.groupdict() for m in re.finditer(pattern,(ROOT/'template/package.json.jinja').read_text())]
    assert len(matches)==10
    names={item['depName'] for item in matches}
    assert 'version' not in names
    assert names=={
        'typescript','@typescript/typescript6','esbuild','prettier','@biomejs/biome',
        'astro','@astrojs/starlight','@astrojs/starlight-tailwind','tailwindcss','@tailwindcss/vite',
    }


def test_starlight_css_identity_split():
    generated_site=ROOT/'template'/'[% if docs_profile == "starlight" %]site[% endif %]'
    maintainer=(ROOT/'site/src/styles/global.css').read_text()
    generated=(generated_site/'src/styles/global.css').read_text()
    styles='\n'.join(path.read_text() for path in generated_site.joinpath('src/styles').glob('*.css'))
    assert '--brand-' in maintainer
    assert '--brand-' not in styles
    assert '43d9f5' not in styles.lower()
    assert '080f2b' not in styles.lower()
    assert '132555' not in styles.lower()
    assert '1749c4' not in styles.lower()
    assert "@import '@astrojs/starlight-tailwind'" in maintainer
    assert "@import '@astrojs/starlight-tailwind'" in generated


def test_copier_docs_warn_site_overwrite(tmp_path):
    dest=tmp_path/'plugin'
    render(dest,dict(docs_profile='starlight'))
    readme=(dest/'README.md').read_text()
    updating=(dest/'docs/content/updating.md').read_text()
    assert 'overwrite `site/**`' in readme or 'overwrite site/**' in readme
    assert 'site/**' in updating
    assert 'will be replaced' in updating


def test_media_fixture_is_deterministic_and_non_overwriting(tmp_path):
    import wave
    tool=ROOT/'template/scripts/create-fixture.py'
    first=tmp_path/'one.wav';second=tmp_path/'two.wav'
    for path in [first,second]:subprocess.run([sys.executable,str(tool),str(path)],check=True,capture_output=True)
    expected=first.read_bytes(); assert expected==second.read_bytes()
    with wave.open(str(first),'rb') as fixture:
        assert fixture.getnchannels()==1
        assert fixture.getnframes()==16000
        assert fixture.getframerate()==16000
        assert fixture.getsampwidth()==2
    repeat=subprocess.run([sys.executable,str(tool),str(first)],capture_output=True)
    assert repeat.returncode!=0
    assert first.read_bytes()==expected
