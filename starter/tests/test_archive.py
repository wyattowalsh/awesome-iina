from __future__ import annotations
import importlib.util,stat,zipfile,sys
from pathlib import Path
import pytest
from tools.fixture_render import ROOT
spec=importlib.util.spec_from_file_location('inspect_archive',ROOT/'template/scripts/inspect-archive.py')
mod=importlib.util.module_from_spec(spec)
previous=sys.dont_write_bytecode;sys.dont_write_bytecode=True
try:spec.loader.exec_module(mod)
finally:sys.dont_write_bytecode=previous

def stage(tmp_path):
    path=tmp_path/'stage';path.mkdir();(path/'Info.json').write_text('{}');return path

def test_archive_content_match(tmp_path):
    src=stage(tmp_path);archive=tmp_path/'valid.iinaplgz'
    with zipfile.ZipFile(archive,'w') as handle:handle.write(src/'Info.json','Info.json')
    assert mod.inspect(archive,src)['files']==1

@pytest.mark.parametrize('name',['../Info.json','/Info.json','node_modules/secret','nested/Info.json','a\\b'])
def test_reject_unexpected_names(tmp_path,name):
    src=stage(tmp_path);archive=tmp_path/'invalid.iinaplgz'
    with zipfile.ZipFile(archive,'w') as handle:handle.writestr(name,'{}')
    with pytest.raises(ValueError):mod.inspect(archive,src)

def test_reject_symlink(tmp_path):
    src=stage(tmp_path);archive=tmp_path/'link.iinaplgz'
    item=zipfile.ZipInfo('Info.json');item.create_system=3;item.external_attr=(stat.S_IFLNK|0o777)<<16
    with zipfile.ZipFile(archive,'w') as handle:handle.writestr(item,'somewhere')
    with pytest.raises(ValueError,match='symlink'):mod.inspect(archive,src)

def test_reject_duplicate(tmp_path):
    src=stage(tmp_path);archive=tmp_path/'duplicate.iinaplgz'
    with zipfile.ZipFile(archive,'w') as handle:
        handle.writestr('Info.json','{}')
        with pytest.warns(UserWarning):handle.writestr('Info.json','{}')
    with pytest.raises(ValueError,match='Duplicate'):mod.inspect(archive,src)

def test_reject_altered_bytes(tmp_path):
    src=stage(tmp_path);archive=tmp_path/'altered.iinaplgz'
    with zipfile.ZipFile(archive,'w') as handle:handle.writestr('Info.json','[]')
    with pytest.raises(ValueError):mod.inspect(archive,src)
