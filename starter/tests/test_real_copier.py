"""Real Copier tests. These MUST run before any release is called update-verified."""
from __future__ import annotations
import importlib.util,json,shutil,subprocess,os
from pathlib import Path
import pytest
from tools.fixture_render import ROOT,DEFAULTS,PRESETS
from tools.copier_source import copy_source
if os.environ.get('REQUIRE_COPIER')=='1' and importlib.util.find_spec('copier') is None:
    raise RuntimeError('Copier is required for integration/release verification; install it explicitly')
pytestmark=pytest.mark.skipif(importlib.util.find_spec('copier') is None,reason='Copier unavailable: real generation/merge/trust NOT tested')

def git(path:Path,*args:str):
    return subprocess.run(['git','-c','core.hooksPath='+os.devnull,'-c','commit.gpgsign=false','-c','tag.gpgsign=false','-c','user.name=Template Test','-c','user.email=template-test@example.invalid',*args],cwd=path,check=True,capture_output=True,text=True).stdout.strip()

def source(tmp_path:Path)->Path:
    repo=tmp_path/'source';copy_source(ROOT,repo)
    git(repo,'init');git(repo,'add','.');git(repo,'commit','-m','v0.1');git(repo,'tag','v0.1.0');return repo

@pytest.mark.parametrize('preset',PRESETS)
@pytest.mark.parametrize('preferences',[False,True])
@pytest.mark.parametrize('docs_profile',['markdown','starlight'])
@pytest.mark.parametrize('hooks',[False,True])
def test_real_copy(tmp_path,preset,preferences,docs_profile,hooks):
    import copier
    repo=source(tmp_path);dest=tmp_path/'consumer'
    copier.run_copy(str(repo),dest,data={**DEFAULTS,'preset':preset,'preferences':preferences,'docs_profile':docs_profile,'hooks':hooks},defaults=True,vcs_ref='v0.1.0')
    assert json.loads((dest/'.iina-project.json').read_text())['preset']==preset
    assert (dest/'.copier-answers.yml').exists()
    assert (dest/'src/ui/index.ts').exists()==(preset!='command')

@pytest.mark.parametrize('preset',PRESETS)
def test_real_update_preserves_edits_and_deletions(tmp_path,preset):
    import copier
    repo=source(tmp_path);dest=tmp_path/'consumer'
    copier.run_copy(str(repo),dest,data={**DEFAULTS,'preset':preset},defaults=True,vcs_ref='v0.1.0')
    git(dest,'init');git(dest,'add','.');git(dest,'commit','-m','generated')
    app=dest/'src/main/index.ts';app.write_text(app.read_text()+'\n// Consumer behavior\n')
    seed=dest/'src/shared/disposables.ts';seed.unlink()
    git(dest,'add','-A');git(dest,'commit','-m','consumer changes')
    retained=app.read_bytes()
    managed=repo/'template/docs/agent/runtime.md';managed.write_text(managed.read_text()+'\nUpdated infrastructure reference.\n')
    upstream=repo/'template/src/main/index.ts.jinja';upstream.write_text(upstream.read_text()+'\n// Changed seed\n')
    git(repo,'add','.');git(repo,'commit','-m','v0.2');git(repo,'tag','v0.2.0')
    copier.run_update(dest,defaults=True,overwrite=True,vcs_ref='v0.2.0')
    assert app.read_bytes()==retained
    assert not seed.exists()
    assert 'Updated infrastructure' in (dest/'docs/agent/runtime.md').read_text()
    git(dest,'add','-A');git(dest,'commit','-m','updated')
    copier.run_update(dest,defaults=True,overwrite=True,vcs_ref='v0.2.0')
    assert git(dest,'status','--porcelain')==''

def test_dirty_update_fails(tmp_path):
    import copier
    repo=source(tmp_path);dest=tmp_path/'consumer'
    copier.run_copy(str(repo),dest,data=DEFAULTS,defaults=True,vcs_ref='v0.1.0')
    git(dest,'init');git(dest,'add','.');git(dest,'commit','-m','generated')
    (dest/'README.md').write_text('uncommitted edits')
    with pytest.raises(Exception,match='[Dd]irty'):copier.run_update(dest,defaults=True,overwrite=True,vcs_ref='v0.1.0')


@pytest.mark.parametrize('preset',PRESETS)
def test_integrated_root_entrypoint_and_update(tmp_path,preset):
    import copier
    root=ROOT.parents[1]
    repo=tmp_path/'source'
    if (root/'config/starter-integration.json').is_file():
        copy_source(root,repo)
    else:
        # Standalone exports still test the documented include/subdirectory layout.
        copy_source(ROOT,repo/'starter')
        (repo/'copier.yml').write_text(
            '!include starter/copier.yml\n---\n'
            '_subdirectory: starter/template\n'
        )
    git(repo,'init');git(repo,'add','.');git(repo,'commit','-m','root v1');git(repo,'tag','v0.3.0')
    dest=tmp_path/'consumer'
    copier.run_copy(str(repo),dest,data={**DEFAULTS,'preset':preset,'preferences':True,'docs_profile':'starlight'},defaults=True,vcs_ref='v0.3.0')
    assert (dest/'src/main/index.ts').is_file()
    assert (dest/'site/astro.config.ts').is_file()
    assert not (dest/'site/astro.config.mjs').exists()
    styles='\n'.join(path.read_text() for path in (dest/'site/src/styles').rglob('*.css'))
    assert '--brand-' not in styles
    assert not (dest/'src/awesome_iina/catalog/catalog.yaml').exists()
    assert not (dest/'templates').exists()
    git(dest,'init');git(dest,'add','.');git(dest,'commit','-m','consumer initial')
    app=dest/'src/main/index.ts';app.write_text(app.read_text()+'\n// My plugin behavior\n')
    deleted=dest/'src/shared/disposables.ts';deleted.unlink()
    git(dest,'add','-A');git(dest,'commit','-m','owned edits and deletion')
    retained=app.read_bytes()
    source=repo/'starter/template'
    managed=source/'docs/agent/runtime.md';managed.write_text(managed.read_text()+'\nIntegrated update marker.\n')
    git(repo,'add','.');git(repo,'commit','-m','root v2');git(repo,'tag','v0.3.1')
    copier.run_update(dest,defaults=True,overwrite=True,vcs_ref='v0.3.1')
    assert app.read_bytes()==retained
    assert not deleted.exists()
    assert 'Integrated update marker' in (dest/'docs/agent/runtime.md').read_text()
    git(dest,'add','-A');git(dest,'commit','-m','update applied')
    copier.run_update(dest,defaults=True,overwrite=True,vcs_ref='v0.3.1')
    assert git(dest,'status','--porcelain')==''


def test_shared_file_conflict_is_not_silently_forced(tmp_path):
    import copier
    repo=source(tmp_path);dest=tmp_path/'consumer'
    copier.run_copy(str(repo),dest,data=DEFAULTS,defaults=True,vcs_ref='v0.1.0')
    git(dest,'init');git(dest,'add','.');git(dest,'commit','-m','consumer initial')
    target=dest/'package.json';target.write_text(target.read_text().replace('"0.1.0"','"1.0.0"',1))
    git(dest,'add','.');git(dest,'commit','-m','consumer version')
    upstream=repo/'template/package.json.jinja'
    upstream.write_text(upstream.read_text().replace('"0.1.0"','"2.0.0"',1))
    git(repo,'add','.');git(repo,'commit','-m','template version');git(repo,'tag','v0.2.0')
    # Unexpected exceptions fail the test instead of disguising a broken update as safety.
    copier.run_update(dest,defaults=True,overwrite=True,vcs_ref='v0.2.0')
    assert '<<<<<<<' in target.read_text() or list(dest.rglob('*.rej'))
