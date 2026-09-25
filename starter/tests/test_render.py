from __future__ import annotations
import json
from pathlib import Path
import pytest,yaml
from tools.fixture_render import ROOT,PRESETS,render,environment

@pytest.mark.parametrize('preset',PRESETS)
@pytest.mark.parametrize('preferences',[False,True])
def test_matrix(tmp_path:Path,preset:str,preferences:bool):
    dest=tmp_path/'render';files=render(dest,dict(preset=preset,preferences=preferences))
    manifest=json.loads((dest/'Info.json').read_text())
    assert ('globalEntry' in manifest)==(preset=='controller')
    assert ('sidebarTab' in manifest)==(preset=='sidebar')
    assert ('preferencesPage' in manifest)==preferences
    assert (dest/'src/ui/index.ts').exists()==(preset!='command')
    assert (dest/'src/global/index.ts').exists()==(preset=='controller')
    assert (dest/'src/preferences/index.html').exists()==preferences
    assert manifest['permissions']==(['video-overlay'] if preset=='overlay' else [])
    assert (dest/'CLAUDE.md').read_text().strip()=='@AGENTS.md'
    assert (dest/'.agents/skills/iina-development/SKILL.md').read_bytes()==(dest/'.claude/skills/iina-development/SKILL.md').read_bytes()
    assert (dest/'.cursor/skills/iina-development/SKILL.md').is_file()
    assert (dest/'.cursor/skills/iina-package/SKILL.md').is_file()
    assert (dest/'.cursor/skills/iina-upgrade/SKILL.md').is_file()
    assert not (dest/'.cursor/skills/iina-generate').exists()
    assert not any('[%' in f or '[[' in f for f in files)
    assert not (dest/'pnpm-lock.yaml').exists()

@pytest.mark.parametrize('value',['Quote " here','日本語 🎥','Back\\slash','Multiline\nvalue','</script><script>literal</script>'])
def test_display_strings_are_data(tmp_path,value):
    dest=tmp_path/'render';render(dest,dict(plugin_name=value,description=value,user_name=value,preset='controller'))
    info=json.loads((dest/'Info.json').read_text());assert info['name']==value and info['description']==value
    assert json.loads((dest/'package.json').read_text())['private'] is True

@pytest.mark.parametrize('slug',['../bad','/absolute','bad space','bad;command','Bad','a--b','x'*65])
def test_invalid_slug_no_output(tmp_path,slug):
    dest=tmp_path/'bad'
    with pytest.raises(ValueError):render(dest,dict(plugin_slug=slug))
    assert not dest.exists()

@pytest.mark.parametrize('identifier',['bad','../bad','org..test','org.test/escape'])
def test_invalid_identifier(tmp_path,identifier):
    with pytest.raises(ValueError):render(tmp_path/'bad',dict(plugin_identifier=identifier))

def test_deterministic_source(tmp_path):
    a,b=tmp_path/'a',tmp_path/'b';render(a);render(b)
    left={p.relative_to(a).as_posix():p.read_bytes() for p in a.rglob('*') if p.is_file()}
    right={p.relative_to(b).as_posix():p.read_bytes() for p in b.rglob('*') if p.is_file()}
    assert left==right

def test_pure_configuration():
    config=yaml.safe_load((ROOT/'copier.yml').read_text())
    for key in ('_tasks','_migrations','_jinja_extensions'):assert key not in config
    assert config['_envops']['undefined']=='jinja2.StrictUndefined'
    assert config['_min_copier_version']=='9.18.2'

def test_update_exclusions_are_destination_based():
    config=yaml.safe_load((ROOT/'copier.yml').read_text());env=environment()
    patterns=[env.from_string(p).render(_copier_operation='update') for p in config['_exclude']]
    assert 'src/**' in patterns and 'Info.json' in patterns
    assert 'scripts/**' not in patterns and '.copier-answers.yml' not in patterns
    assert not any('.cursor' in pattern or '.claude' in pattern or '.agents' in pattern for pattern in patterns)


def _skill_tree(root: Path) -> dict[str, bytes]:
    return {path.relative_to(root).as_posix(): path.read_bytes()
            for path in root.rglob('*') if path.is_file()}


def test_skill_body_parity_and_claude_package_overlay(tmp_path: Path):
    dest = tmp_path / 'render'
    render(dest)
    for name in ('iina-development', 'iina-upgrade'):
        cursor = _skill_tree(dest / f'.cursor/skills/{name}')
        claude = _skill_tree(dest / f'.claude/skills/{name}')
        agents = _skill_tree(dest / f'.agents/skills/{name}')
        assert cursor == claude == agents
    cursor_package = (dest / '.cursor/skills/iina-package/SKILL.md').read_text()
    agents_package = (dest / '.agents/skills/iina-package/SKILL.md').read_text()
    claude_package = (dest / '.claude/skills/iina-package/SKILL.md').read_text()
    assert cursor_package == agents_package
    claude_meta = claude_package.split("---", 2)[1]
    cursor_meta = cursor_package.split("---", 2)[1]
    assert "disable-model-invocation: true" in claude_meta
    assert "disable-model-invocation:" not in cursor_meta
    assert (dest / '.agents/skills/iina-package/agents/openai.yaml').is_file()
    assert 'allow_implicit_invocation: false' in (
        dest / '.agents/skills/iina-package/agents/openai.yaml'
    ).read_text()
    assert not (dest / '.cursor/skills/iina-generate').exists()
    assert (dest / '.cursor/hooks.json').is_file()


def test_every_path_component_and_template_parses():
    env=environment()
    for file in (ROOT/'template').rglob('*'):
        for part in file.relative_to(ROOT/'template').parts:env.parse(part)
        if file.is_file() and file.name.endswith('.jinja'):env.parse(file.read_text())
