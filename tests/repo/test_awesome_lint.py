from __future__ import annotations

from pathlib import Path

import yaml

from awesome_iina.repo.awesome_lint import lint_awesome_repository, markdown_headings


def make_repository(tmp_path: Path, *, duplicate_url: bool = False) -> tuple[Path, Path]:
    (tmp_path / ".github").mkdir()
    (tmp_path / ".github/CONTRIBUTING.md").write_text("# Contributing\n")
    (tmp_path / "docs/history").mkdir(parents=True)
    (tmp_path / "docs/history/NOTICE.md").write_text("# Notice\n")
    projects = [
        {"slug": "alpha", "repo": "example/alpha"},
        {"slug": "beta", "repo": "example/alpha" if duplicate_url else "example/beta"},
    ]
    catalog = tmp_path / "src/awesome_iina/catalog/catalog.yaml"
    catalog.parent.mkdir(parents=True)
    catalog.write_text(yaml.safe_dump({"projects": projects}, sort_keys=False))
    readme = tmp_path / "README.md"
    readme.write_text(
        """# Awesome IINA

[![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

Catalog sections are generated from src/awesome_iina/catalog/catalog.yaml.

## Contents

- [Projects](#projects)

## Projects

- **[Alpha](https://github.com/example/alpha)** First.
- **[Beta](https://github.com/example/beta)** Second.

## Contributing

Read [`.github/CONTRIBUTING.md`](.github/CONTRIBUTING.md).

## License

See [`docs/history/NOTICE.md`](docs/history/NOTICE.md).
"""
    )
    return readme, catalog


def test_awesome_lint_accepts_minimal_valid_repository(tmp_path: Path) -> None:
    readme, catalog = make_repository(tmp_path)

    assert lint_awesome_repository(tmp_path, readme, catalog) == []


def test_awesome_lint_reports_duplicate_catalog_url(tmp_path: Path) -> None:
    readme, catalog = make_repository(tmp_path, duplicate_url=True)

    issues = lint_awesome_repository(tmp_path, readme, catalog)

    assert any(issue.code == "duplicate-catalog-url" for issue in issues)


def test_awesome_lint_reports_order_and_missing_fragment(tmp_path: Path) -> None:
    readme, catalog = make_repository(tmp_path)
    text = readme.read_text()
    text = text.replace(
        "- **[Alpha](https://github.com/example/alpha)** First.\n"
        "- **[Beta](https://github.com/example/beta)** Second.",
        "- **[Beta](https://github.com/example/beta)** Second.\n"
        "- **[Alpha](https://github.com/example/alpha)** First.",
    )
    text += "\n[Missing](#does-not-exist)\n"
    readme.write_text(text)

    codes = {issue.code for issue in lint_awesome_repository(tmp_path, readme, catalog)}

    assert "project-order" in codes
    assert "local-fragment-missing" in codes


def test_markdown_headings_assign_duplicate_suffixes(tmp_path: Path) -> None:
    path = tmp_path / "README.md"
    path.write_text("# Title\n\n## Same\n\n## Same\n")

    headings = markdown_headings(path)

    assert [heading.anchor for heading in headings] == ["title", "same", "same-1"]


def test_awesome_lint_reports_structural_and_link_errors(tmp_path: Path) -> None:
    readme, catalog = make_repository(tmp_path)
    readme.write_text(
        """# Wrong title

## Duplicate

#### Jumped

## Duplicate

Catalog sections are generated from src/awesome_iina/catalog/catalog.yaml.

[Missing](missing.md)
[Escape](../outside.md)
[Unsafe](http://example.com)
"""
    )

    codes = {issue.code for issue in lint_awesome_repository(tmp_path, readme, catalog)}

    assert "top-level-heading-name" in codes
    assert "awesome-badge-missing" in codes
    assert "contents-section-missing" in codes
    assert "contributing-link-missing" in codes
    assert "notice-link-missing" in codes
    assert "heading-level-jump" in codes
    assert "duplicate-heading" in codes
    assert "local-link-missing" in codes
    assert "local-link-escapes-root" in codes
    assert "insecure-http-link" in codes


def test_awesome_lint_reports_broken_picture_srcset(tmp_path: Path) -> None:
    readme, catalog = make_repository(tmp_path)
    brand = tmp_path / "src/awesome_iina/site/kit/assets/brand"
    brand.mkdir(parents=True)
    (brand / "wordmark-light.svg").write_text("<svg/>\n")
    text = readme.read_text()
    text = text.replace(
        "# Awesome IINA\n",
        """<picture>
  <source media="(prefers-color-scheme: dark)" srcset="src/awesome_iina/site/kit/assets/brand/missing-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="src/awesome_iina/site/kit/assets/brand/wordmark-light.svg">
  <img alt="" src="src/awesome_iina/site/kit/assets/brand/wordmark-light.svg" width="440" height="71">
</picture>

# Awesome IINA
""",
    )
    readme.write_text(text)

    codes = {issue.code for issue in lint_awesome_repository(tmp_path, readme, catalog)}

    assert "image-path-missing" in codes


def test_awesome_lint_accepts_resolved_kit_wordmark_paths(tmp_path: Path) -> None:
    readme, catalog = make_repository(tmp_path)
    brand = tmp_path / "src/awesome_iina/site/kit/assets/brand"
    brand.mkdir(parents=True)
    (brand / "wordmark-light.svg").write_text("<svg/>\n")
    (brand / "wordmark-dark.svg").write_text("<svg/>\n")
    text = readme.read_text()
    text = text.replace(
        "# Awesome IINA\n",
        """<picture>
  <source media="(prefers-color-scheme: dark)" srcset="src/awesome_iina/site/kit/assets/brand/wordmark-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="src/awesome_iina/site/kit/assets/brand/wordmark-light.svg">
  <img alt="" src="src/awesome_iina/site/kit/assets/brand/wordmark-light.svg" width="440" height="71">
</picture>

# Awesome IINA
""",
    )
    readme.write_text(text)

    assert lint_awesome_repository(tmp_path, readme, catalog) == []


def test_awesome_lint_reports_missing_catalog(tmp_path: Path) -> None:
    readme, _ = make_repository(tmp_path)

    issues = lint_awesome_repository(tmp_path, readme, tmp_path / "catalog/missing.yaml")

    assert any(issue.code == "catalog-missing" for issue in issues)


def test_markdown_headings_ignores_fenced_code(tmp_path: Path) -> None:
    path = tmp_path / "README.md"
    path.write_text("# Title\n\n```md\n## Not a heading\n```\n\n## Real\n")

    assert [heading.title for heading in markdown_headings(path)] == ["Title", "Real"]
