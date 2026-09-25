from pathlib import Path
import sys

import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))


@pytest.fixture
def kit():
    return ROOT


@pytest.fixture
def project(tmp_path):
    target = tmp_path / "repository"
    target.mkdir()
    (target / "README.md").write_bytes(b"# Existing documentation\r\n\r\nDo not change the catalog.\r\n")
    (target / "catalog.yaml").write_bytes(b"projects: []\n")
    return target
