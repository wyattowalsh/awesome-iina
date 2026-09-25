"""Tests use isolated Git configuration; never execute a developer's hooks or signing."""
from __future__ import annotations
import os
import pytest

@pytest.fixture(autouse=True)
def isolated_git_configuration(monkeypatch):
    monkeypatch.setenv("GIT_CONFIG_GLOBAL", os.devnull)
    monkeypatch.setenv("GIT_CONFIG_NOSYSTEM", "1")
