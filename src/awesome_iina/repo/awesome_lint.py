from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import unquote, urlsplit

import yaml

_HEADING = re.compile(r"^(#{1,6})\s+(.+?)\s*$")
_LINK = re.compile(r"(?<!!)\[[^\]]*\]\(([^)]+)\)")
_HTTP_URL = re.compile(r"http://[^\s)>\]]+")
_PROJECT_ENTRY = re.compile(r"^- \*\*\[([^\]]+)\]\(([^)]+)\)\*\*")
_HTML_TAG = re.compile(r"<[^>]+>")
_MARKDOWN_LINK_TEXT = re.compile(r"\[([^\]]+)\]\([^)]+\)")
_MARKDOWN_IMAGE = re.compile(r"!\[[^\]]*\]\(([^)]+)\)")
_HTML_IMG_SRC = re.compile(
    r"""<img\b[^>]*\bsrc\s*=\s*(?P<q>["'])(?P<src>.*?)(?P=q)""", re.IGNORECASE
)
_HTML_SRCSET = re.compile(r"""\bsrcset\s*=\s*(?P<q>["'])(?P<srcset>.*?)(?P=q)""", re.IGNORECASE)


@dataclass(frozen=True, slots=True)
class LintIssue:
    code: str
    path: str
    line: int | None
    message: str


@dataclass(frozen=True, slots=True)
class Heading:
    level: int
    title: str
    line: int
    anchor: str


def _plain_heading_title(value: str) -> str:
    value = _MARKDOWN_LINK_TEXT.sub(r"\1", value)
    value = _HTML_TAG.sub("", value)
    return value.replace("`", "").replace("*", "").replace("_", "").strip()


def _base_anchor(title: str) -> str:
    title = _plain_heading_title(title).casefold()
    characters = [character for character in title if character.isalnum() or character in " _-"]
    anchor = "".join(characters).strip()
    return re.sub(r"[\s-]+", "-", anchor)


def markdown_headings(path: Path) -> list[Heading]:
    """Parse ATX headings and assign GitHub-like duplicate anchors."""

    headings: list[Heading] = []
    counts: dict[str, int] = {}
    in_fence = False
    fence_marker = ""
    for line_number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
        stripped = line.lstrip()
        if stripped.startswith(("```", "~~~")):
            marker = stripped[:3]
            if not in_fence:
                in_fence = True
                fence_marker = marker
            elif marker == fence_marker:
                in_fence = False
                fence_marker = ""
            continue
        if in_fence:
            continue
        match = _HEADING.match(line)
        if not match:
            continue
        level = len(match.group(1))
        title = _plain_heading_title(match.group(2).rstrip(" #"))
        base = _base_anchor(title)
        occurrence = counts.get(base, 0)
        counts[base] = occurrence + 1
        anchor = base if occurrence == 0 else f"{base}-{occurrence}"
        headings.append(Heading(level=level, title=title, line=line_number, anchor=anchor))
    return headings


def _target_and_fragment(raw_target: str) -> tuple[str, str | None]:
    target = raw_target.strip().strip("<>")
    if " " in target and not target.startswith(("http://", "https://")):
        target = target.split(" ", 1)[0]
    path, separator, fragment = target.partition("#")
    return unquote(path), unquote(fragment) if separator else None


def _srcset_candidates(value: str) -> list[str]:
    candidates: list[str] = []
    for part in value.split(","):
        token = part.strip().split(None, 1)[0] if part.strip() else ""
        if token:
            candidates.append(token)
    return candidates


def _image_reference_issues(root: Path, source: Path) -> list[LintIssue]:
    """Fail when README picture/srcset, img src, or Markdown images do not resolve locally."""

    issues: list[LintIssue] = []
    relative_source = source.relative_to(root).as_posix()
    lines = source.read_text(encoding="utf-8").splitlines()
    root_resolved = root.resolve()

    def consider(raw: str, line_number: int, *, kind: str) -> None:
        candidate = raw.strip().strip("<>")
        if not candidate:
            issues.append(
                LintIssue(
                    code="image-path-empty",
                    path=relative_source,
                    line=line_number,
                    message=f"empty {kind} path",
                )
            )
            return
        if candidate.startswith(("https://", "http://", "data:", "mailto:")):
            return
        if " " in candidate and not candidate.startswith(("http://", "https://")):
            candidate = candidate.split(" ", 1)[0]
        target = (source.parent / unquote(candidate)).resolve()
        try:
            target.relative_to(root_resolved)
        except ValueError:
            issues.append(
                LintIssue(
                    code="image-path-escapes-root",
                    path=relative_source,
                    line=line_number,
                    message=f"{kind} escapes repository root: {raw}",
                )
            )
            return
        if not target.is_file():
            issues.append(
                LintIssue(
                    code="image-path-missing",
                    path=relative_source,
                    line=line_number,
                    message=f"{kind} target does not exist: {raw}",
                )
            )

    for line_number, line in enumerate(lines, start=1):
        for match in _MARKDOWN_IMAGE.finditer(line):
            consider(match.group(1), line_number, kind="markdown image")
        for match in _HTML_IMG_SRC.finditer(line):
            consider(match.group("src"), line_number, kind="img src")
        for match in _HTML_SRCSET.finditer(line):
            candidates = _srcset_candidates(match.group("srcset"))
            if not candidates:
                issues.append(
                    LintIssue(
                        code="image-path-empty",
                        path=relative_source,
                        line=line_number,
                        message="empty srcset path",
                    )
                )
                continue
            for candidate in candidates:
                consider(candidate, line_number, kind="srcset")
    return issues


def _local_link_issues(root: Path, source: Path) -> list[LintIssue]:
    issues: list[LintIssue] = []
    lines = source.read_text(encoding="utf-8").splitlines()
    heading_cache: dict[Path, set[str]] = {}
    for line_number, line in enumerate(lines, start=1):
        for raw_target in _LINK.findall(line):
            if raw_target.startswith(("https://", "http://", "mailto:")):
                continue
            path_text, fragment = _target_and_fragment(raw_target)
            target = source if not path_text else (source.parent / path_text)
            target = target.resolve()
            try:
                target.relative_to(root.resolve())
            except ValueError:
                issues.append(
                    LintIssue(
                        code="local-link-escapes-root",
                        path=source.relative_to(root).as_posix(),
                        line=line_number,
                        message=f"local link escapes repository root: {raw_target}",
                    )
                )
                continue
            if not target.exists():
                issues.append(
                    LintIssue(
                        code="local-link-missing",
                        path=source.relative_to(root).as_posix(),
                        line=line_number,
                        message=f"local link target does not exist: {raw_target}",
                    )
                )
                continue
            if fragment and target.is_file() and target.suffix.casefold() == ".md":
                anchors = heading_cache.setdefault(
                    target,
                    {heading.anchor for heading in markdown_headings(target)},
                )
                normalized_fragment = fragment.casefold()
                if normalized_fragment not in anchors:
                    issues.append(
                        LintIssue(
                            code="local-fragment-missing",
                            path=source.relative_to(root).as_posix(),
                            line=line_number,
                            message=f"heading fragment does not exist: {raw_target}",
                        )
                    )
    return issues


def _catalog_issues(root: Path, catalog_path: Path) -> list[LintIssue]:
    if not catalog_path.exists():
        return [
            LintIssue(
                code="catalog-missing",
                path=catalog_path.relative_to(root).as_posix(),
                line=None,
                message="catalog file does not exist",
            )
        ]
    payload = yaml.safe_load(catalog_path.read_text(encoding="utf-8")) or {}
    projects = payload.get("projects", [])
    seen: dict[str, str] = {}
    issues: list[LintIssue] = []
    for project in projects:
        if not isinstance(project, dict):
            continue
        slug = str(project.get("slug", "<unknown>"))
        repo = project.get("repo")
        url = project.get("url")
        canonical = (
            f"https://github.com/{str(repo).strip('/')}" if repo else str(url or "").rstrip("/")
        ).casefold()
        if not canonical:
            continue
        if canonical in seen:
            issues.append(
                LintIssue(
                    code="duplicate-catalog-url",
                    path=catalog_path.relative_to(root).as_posix(),
                    line=None,
                    message=f"{slug} duplicates {seen[canonical]} at {canonical}",
                )
            )
        else:
            seen[canonical] = slug
    return issues


def lint_awesome_repository(
    root: Path,
    readme_path: Path,
    catalog_path: Path,
) -> list[LintIssue]:
    """Validate structural Awesome-list and local-link invariants."""

    root = root.resolve()
    readme_path = readme_path.resolve()
    catalog_path = catalog_path.resolve()
    relative_readme = readme_path.relative_to(root).as_posix()
    text = readme_path.read_text(encoding="utf-8")
    lines = text.splitlines()
    headings = markdown_headings(readme_path)
    issues: list[LintIssue] = []

    h1_headings = [heading for heading in headings if heading.level == 1]
    if len(h1_headings) != 1:
        issues.append(
            LintIssue(
                code="top-level-heading-count",
                path=relative_readme,
                line=None,
                message=f"expected exactly one H1 heading, found {len(h1_headings)}",
            )
        )
    elif h1_headings[0].title != "Awesome IINA":
        issues.append(
            LintIssue(
                code="top-level-heading-name",
                path=relative_readme,
                line=h1_headings[0].line,
                message="top-level heading must be 'Awesome IINA'",
            )
        )

    required_tokens = {
        "awesome-badge-missing": "https://awesome.re/badge.svg",
        "contents-section-missing": "## Contents",
        "generated-marker-missing": "generated from src/awesome_iina/catalog/catalog.yaml",
        "contributing-link-missing": ".github/CONTRIBUTING.md",
        "notice-link-missing": "docs/history/NOTICE.md",
    }
    for code, token in required_tokens.items():
        if token not in text:
            issues.append(
                LintIssue(code=code, path=relative_readme, line=None, message=f"missing {token!r}")
            )

    previous: Heading | None = None
    seen_titles: dict[tuple[int, str], int] = {}
    for heading in headings:
        if previous is not None and heading.level > previous.level + 1:
            issues.append(
                LintIssue(
                    code="heading-level-jump",
                    path=relative_readme,
                    line=heading.line,
                    message=f"heading jumps from H{previous.level} to H{heading.level}",
                )
            )
        key = (heading.level, heading.title.casefold())
        if key in seen_titles:
            issues.append(
                LintIssue(
                    code="duplicate-heading",
                    path=relative_readme,
                    line=heading.line,
                    message=(f"duplicates heading from line {seen_titles[key]}: {heading.title}"),
                )
            )
        else:
            seen_titles[key] = heading.line
        previous = heading

    current_section = "<preamble>"
    entries_by_section: dict[str, list[tuple[str, int]]] = {}
    for line_number, line in enumerate(lines, start=1):
        heading_match = _HEADING.match(line)
        if heading_match:
            current_section = _plain_heading_title(heading_match.group(2).rstrip(" #"))
            continue
        entry_match = _PROJECT_ENTRY.match(line)
        if entry_match:
            entries_by_section.setdefault(current_section, []).append(
                (entry_match.group(1), line_number)
            )
        for url in _HTTP_URL.findall(line):
            host = (urlsplit(url).hostname or "").casefold()
            if host not in {"127.0.0.1", "localhost", "::1"}:
                issues.append(
                    LintIssue(
                        code="insecure-http-link",
                        path=relative_readme,
                        line=line_number,
                        message=f"use HTTPS where available: {url}",
                    )
                )

    for section, entries in entries_by_section.items():
        names = [name for name, _ in entries]
        expected = sorted(names, key=str.casefold)
        if len(names) >= 2 and names != expected:
            first_mismatch = next(
                index
                for index, (actual, wanted) in enumerate(zip(names, expected, strict=True))
                if actual != wanted
            )
            issues.append(
                LintIssue(
                    code="project-order",
                    path=relative_readme,
                    line=entries[first_mismatch][1],
                    message=f"project entries in '{section}' are not alphabetized",
                )
            )

    issues.extend(_local_link_issues(root, readme_path))
    issues.extend(_image_reference_issues(root, readme_path))
    issues.extend(_catalog_issues(root, catalog_path))
    return issues
