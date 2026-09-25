from __future__ import annotations

from pathlib import Path

from awesome_iina.repo.root_policy import RootPolicy, load_root_policy, validate_root


def policy() -> RootPolicy:
    return RootPolicy(
        version=1,
        allowed_files=frozenset({"README.md", "LICENSE"}),
        required_files=frozenset({"README.md", "LICENSE"}),
        ignored_files=frozenset({".coverage"}),
        allowed_directories=frozenset({".github", "src"}),
        ignored_directories=frozenset({".git", ".venv"}),
        relocations={"CONTRIBUTING.md": ".github/CONTRIBUTING.md"},
    )


def test_shipped_root_policy_ignores_cursor_directory() -> None:
    loaded = load_root_policy(Path("src/awesome_iina/repo/root-policy.toml"))

    assert ".cursor" in loaded.ignored_directories
    assert ".cursor" not in loaded.allowed_directories
    assert "data" not in loaded.allowed_directories
    assert "brand" not in loaded.allowed_directories


def test_validate_root_does_not_flag_cursor_directory(tmp_path: Path) -> None:
    ignored = policy()
    cursor_policy = RootPolicy(
        version=ignored.version,
        allowed_files=ignored.allowed_files,
        required_files=ignored.required_files,
        ignored_files=ignored.ignored_files,
        allowed_directories=ignored.allowed_directories,
        ignored_directories=ignored.ignored_directories | frozenset({".cursor"}),
        relocations=ignored.relocations,
    )
    (tmp_path / "README.md").write_text("# Project\n")
    (tmp_path / "LICENSE").write_text("MIT\n")
    (tmp_path / ".github").mkdir()
    (tmp_path / ".github/CONTRIBUTING.md").write_text("# Contributing\n")
    (tmp_path / "src").mkdir()
    (tmp_path / ".venv").mkdir()
    (tmp_path / ".coverage").write_text("generated\n")
    (tmp_path / ".cursor").mkdir()
    (tmp_path / ".cursor/hooks").mkdir()

    violations = validate_root(tmp_path, cursor_policy)

    assert violations == []
    assert not any(item.path == ".cursor" for item in violations)


def test_validate_root_accepts_expected_layout(tmp_path: Path) -> None:
    (tmp_path / "README.md").write_text("# Project\n")
    (tmp_path / "LICENSE").write_text("MIT\n")
    (tmp_path / ".github").mkdir()
    (tmp_path / ".github/CONTRIBUTING.md").write_text("# Contributing\n")
    (tmp_path / "src").mkdir()
    (tmp_path / ".venv").mkdir()
    (tmp_path / ".coverage").write_text("generated\n")

    assert validate_root(tmp_path, policy()) == []


def test_validate_root_reports_misplaced_and_unexpected_entries(tmp_path: Path) -> None:
    (tmp_path / "README.md").write_text("# Project\n")
    (tmp_path / "CONTRIBUTING.md").write_text("wrong place\n")
    (tmp_path / "notes.txt").write_text("unexpected\n")
    (tmp_path / "misc").mkdir()

    violations = validate_root(tmp_path, policy())
    codes = {item.code for item in violations}

    assert "required-file-missing" in codes
    assert "misplaced-root-file" in codes
    assert "relocation-target-missing" in codes
    assert "unexpected-root-file" in codes
    assert "unexpected-root-directory" in codes


def test_load_root_policy_rejects_required_file_not_allowed(tmp_path: Path) -> None:
    path = tmp_path / "policy.toml"
    path.write_text(
        """
version = 1
allowed_files = []
required_files = ["README.md"]
ignored_files = []
allowed_directories = []
ignored_directories = []
[relocations]
""".strip()
        + "\n"
    )

    try:
        load_root_policy(path)
    except ValueError as error:
        assert "required_files" in str(error)
    else:
        raise AssertionError("expected invalid policy to fail")


def test_load_root_policy_accepts_valid_document(tmp_path: Path) -> None:
    path = tmp_path / "policy.toml"
    path.write_text(
        """
version = 1
allowed_files = ["README.md"]
required_files = ["README.md"]
ignored_files = [".coverage"]
allowed_directories = ["src"]
ignored_directories = [".git"]
[relocations]
"CONTRIBUTING.md" = ".github/CONTRIBUTING.md"
""".strip()
        + "\n"
    )

    loaded = load_root_policy(path)

    assert loaded.version == 1
    assert loaded.ignored_files == frozenset({".coverage"})
    assert loaded.relocations["CONTRIBUTING.md"] == ".github/CONTRIBUTING.md"


def test_load_root_policy_rejects_bad_version_and_types(tmp_path: Path) -> None:
    bad_version = tmp_path / "bad-version.toml"
    bad_version.write_text("version = 2\n")
    try:
        load_root_policy(bad_version)
    except ValueError as error:
        assert "unsupported" in str(error)
    else:
        raise AssertionError("expected unsupported policy version")

    bad_type = tmp_path / "bad-type.toml"
    bad_type.write_text(
        """
version = 1
allowed_files = "README.md"
required_files = []
ignored_files = []
allowed_directories = []
ignored_directories = []
[relocations]
""".strip()
        + "\n"
    )
    try:
        load_root_policy(bad_type)
    except ValueError as error:
        assert "array of strings" in str(error)
    else:
        raise AssertionError("expected invalid policy field type")


def test_validate_root_handles_missing_root_and_symlink(tmp_path: Path) -> None:
    missing = tmp_path / "missing"
    assert validate_root(missing, policy())[0].code == "root-missing"

    root = tmp_path / "repo"
    root.mkdir()
    (root / "README.md").write_text("# Project\n")
    (root / "LICENSE").write_text("MIT\n")
    (root / ".github").mkdir()
    (root / ".github/CONTRIBUTING.md").write_text("# Contributing\n")
    (root / "src").mkdir()
    (root / "README-link").symlink_to(root / "README.md")

    assert any(item.code == "root-symlink-forbidden" for item in validate_root(root, policy()))
