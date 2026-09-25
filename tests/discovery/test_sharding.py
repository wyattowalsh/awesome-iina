from datetime import date

from awesome_iina.discovery.sharding import split_shard
from awesome_iina.models import SearchShard


def shard(**updates: object) -> SearchShard:
    base = SearchShard(
        query_id="test",
        base_query="topic:iina-plugin",
        created_from=date(2020, 1, 1),
        created_to=date(2020, 1, 10),
    )
    return base.model_copy(update=updates)


def test_date_split_is_non_overlapping_and_complete() -> None:
    left, right = split_shard(shard()) or (None, None)
    assert left is not None and right is not None
    assert left.created_from == date(2020, 1, 1)
    assert left.created_to + (right.created_from - right.created_from) < right.created_from
    assert right.created_to == date(2020, 1, 10)


def test_single_day_initializes_star_partition() -> None:
    result = split_shard(shard(created_to=date(2020, 1, 1)))
    assert result is not None
    left, right = result
    assert left.stars_min == 0
    assert left.stars_max is not None
    assert right.stars_min == left.stars_max + 1


def test_exact_star_value_initializes_size_partition() -> None:
    result = split_shard(
        shard(
            created_to=date(2020, 1, 1),
            stars_min=1,
            stars_max=1,
        )
    )
    assert result is not None
    left, right = result
    assert left.size_min == 0
    assert left.size_max is not None
    assert right.size_min == left.size_max + 1


def test_exact_all_dimensions_is_unsplittable() -> None:
    assert (
        split_shard(
            shard(
                created_to=date(2020, 1, 1),
                stars_min=1,
                stars_max=1,
                size_min=2,
                size_max=2,
            )
        )
        is None
    )


def test_compile_query_contains_all_bounds() -> None:
    value = shard(stars_min=1, stars_max=10, size_min=2, size_max=20).compile_query()
    assert "created:2020-01-01..2020-01-10" in value
    assert "stars:1..10" in value
    assert "size:2..20" in value
