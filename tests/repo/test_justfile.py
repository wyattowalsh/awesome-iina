from pathlib import Path


def test_discover_deep_invocations_use_strict() -> None:
    lines = Path("justfile").read_text().splitlines()
    start = next(index for index, line in enumerate(lines) if line.startswith("discover-deep"))
    end = next(
        (
            index
            for index, line in enumerate(lines[start + 1 :], start + 1)
            if line and not line[:1].isspace() and not line.startswith("#") and ":" in line
        ),
        len(lines),
    )
    block = "\n".join(lines[start:end])
    rest_at = block.index("--backend rest")
    graphql_at = block.index("--backend graphql")
    assert "--strict" in block[rest_at:graphql_at]
    assert "--strict" in block[graphql_at:]
    assert block.count("awesome-iina discover") == 2
