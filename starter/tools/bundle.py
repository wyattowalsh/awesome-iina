"""Build a verified source ZIP without replacing a good artifact on failure."""
from __future__ import annotations

import argparse
import hashlib
import json
import stat
import tempfile
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXCLUDED = {'.git', '.ruff_cache', '.ty_cache', '.venv', 'node_modules', '__pycache__',
            '.pytest_cache', '.build', '.astro', 'reports', 'dist'}


def source_files(root: Path):
    for path in sorted(root.rglob('*')):
        relative = path.relative_to(root)
        if any(part in EXCLUDED for part in relative.parts):
            continue
        if (relative.parts[:2] == ('site', 'public')
                or relative.parts[:4] == ('site', 'src', 'content', 'docs')
                or relative.parts[:2] == ('examples', 'sidebar-preview')):
            continue
        if (path.name in {'id_rsa', 'id_ed25519'} or path.suffix == '.pem'
                or ((path.name == '.env' or path.name.startswith('.env.'))
                    and path.name not in {'.env.example', '.env.sample', '.env.template'})):
            raise ValueError(f'Source archive refuses possible local secret: {relative}')
        if path.is_symlink():
            raise ValueError(f'Source archive refuses symlinks: {relative}')
        if (path.is_file() and path.suffix not in {'.pyc', '.ttf', '.otf', '.woff', '.woff2'}
                and path.name not in {'SOURCE-MANIFEST.json', 'FILE-HASHES.json'}):
            yield relative.as_posix(), path


def verify_bundle(path: Path, records: list[dict]) -> None:
    with zipfile.ZipFile(path) as archive:
        if archive.testzip() is not None:
            raise ValueError('ZIP integrity check failed')
        names = archive.namelist()
        expected = {'iina-plugin-starter/' + record['path'] for record in records}
        expected.add('iina-plugin-starter/SOURCE-MANIFEST.json')
        if len(names) != len(set(names)) or set(names) != expected:
            raise ValueError('ZIP inventory names mismatch')
        for record in records:
            data = archive.read('iina-plugin-starter/' + record['path'])
            if len(data) != record['bytes'] or hashlib.sha256(data).hexdigest() != record['sha256']:
                raise ValueError('ZIP inventory mismatch')


def bundle(output: Path, root: Path = ROOT) -> dict:
    output = output.absolute()
    if output.is_symlink():
        raise ValueError('Archive destination must not be a symlink')
    output.parent.mkdir(parents=True, exist_ok=True)
    entries = [(name, path.read_bytes()) for name, path in source_files(root)
               if path.resolve() not in {output.resolve(), Path(str(output) + '.sha256').resolve()}]
    names = {name for name, _ in entries}
    for required in ('copier.yml', 'README.md', 'template/package.json.jinja',
                     'tests/test_real_copier.py', '.github/workflows/ci.yml'):
        if required not in names:
            raise ValueError(f'Missing full-template file: {required}')
    records = [{'path': name, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}
               for name, data in entries]
    manifest = (json.dumps({'schemaVersion': 1, 'archiveType': 'complete-template-source',
                           'files': records}, indent=2) + '\n').encode()
    with tempfile.NamedTemporaryFile(dir=output.parent, prefix='.starter-', suffix='.zip',
                                     delete=False) as handle:
        temporary = Path(handle.name)
    try:
        with zipfile.ZipFile(temporary, 'w', compression=zipfile.ZIP_DEFLATED,
                             compresslevel=9) as archive:
            for name, data in [*entries, ('SOURCE-MANIFEST.json', manifest)]:
                item = zipfile.ZipInfo('iina-plugin-starter/' + name,
                                       date_time=(1980, 1, 1, 0, 0, 0))
                item.create_system = 3
                item.external_attr = (stat.S_IFREG | 0o644) << 16
                item.compress_type = zipfile.ZIP_DEFLATED
                archive.writestr(item, data, compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)
        verify_bundle(temporary, records)
        temporary.replace(output)
    finally:
        temporary.unlink(missing_ok=True)
    digest = hashlib.sha256(output.read_bytes()).hexdigest()
    Path(str(output) + '.sha256').write_text(f'{digest}  {output.name}\n', encoding='utf-8')
    return {'files': len(entries) + 1, 'sourceFiles': len(entries),
            'bytes': output.stat().st_size, 'sha256': digest, 'output': str(output)}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, required=True)
    print(json.dumps(bundle(parser.parse_args().output), indent=2))
