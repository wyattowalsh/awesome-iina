"""Compare an IINA ZIP against an already validated stage; never extract it."""
from __future__ import annotations
import hashlib,json,stat,sys,zipfile
from pathlib import Path,PurePosixPath

def inspect(archive: Path, stage: Path) -> dict[str, object]:
    expected={p.relative_to(stage).as_posix():hashlib.sha256(p.read_bytes()).hexdigest()
              for p in stage.rglob('*') if p.is_file() and not p.is_symlink()}
    actual={}
    with zipfile.ZipFile(archive) as handle:
        for entry in handle.infolist():
            name=entry.filename
            if name.startswith('/') or '\\' in name or '..' in PurePosixPath(name).parts:
                raise ValueError('Archive path escaped package root')
            if stat.S_ISLNK(entry.external_attr >> 16):raise ValueError('Archive contains a symlink')
            if entry.is_dir():continue
            if name in actual:raise ValueError('Duplicate archive entry')
            if name not in expected:raise ValueError(f'Unexpected archive entry: {name}')
            if entry.file_size > (stage/name).stat().st_size:raise ValueError('Archive size differs from stage')
            actual[name]=hashlib.sha256(handle.read(entry)).hexdigest()
    if actual != expected:raise ValueError('Archive contents differ from staging')
    return {'status':'passed','files':len(actual),'archive_sha256':hashlib.sha256(archive.read_bytes()).hexdigest()}

if __name__=='__main__':
    if len(sys.argv)!=3:raise SystemExit('Usage: inspect-archive.py archive.iinaplgz stage')
    print(json.dumps(inspect(Path(sys.argv[1]),Path(sys.argv[2]))))
