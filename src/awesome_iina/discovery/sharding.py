from __future__ import annotations

from datetime import timedelta

from awesome_iina.models import SearchShard

_MAX_STARS = 10_000_000
_MAX_SIZE_KB = 1_000_000_000


def split_shard(shard: SearchShard) -> tuple[SearchShard, SearchShard] | None:
    """Bisect a GitHub repository-search shard without overlapping boundaries."""

    if shard.created_from < shard.created_to:
        span = (shard.created_to - shard.created_from).days
        midpoint = shard.created_from + timedelta(days=span // 2)
        return (
            shard.model_copy(update={"created_to": midpoint, "depth": shard.depth + 1}),
            shard.model_copy(
                update={
                    "created_from": midpoint + timedelta(days=1),
                    "depth": shard.depth + 1,
                }
            ),
        )

    if shard.stars_min is None or shard.stars_max is None:
        return (
            shard.model_copy(
                update={"stars_min": 0, "stars_max": _MAX_STARS // 2, "depth": shard.depth + 1}
            ),
            shard.model_copy(
                update={
                    "stars_min": _MAX_STARS // 2 + 1,
                    "stars_max": _MAX_STARS,
                    "depth": shard.depth + 1,
                }
            ),
        )

    if shard.stars_min < shard.stars_max:
        midpoint = (shard.stars_min + shard.stars_max) // 2
        return (
            shard.model_copy(update={"stars_max": midpoint, "depth": shard.depth + 1}),
            shard.model_copy(update={"stars_min": midpoint + 1, "depth": shard.depth + 1}),
        )

    if shard.size_min is None or shard.size_max is None:
        return (
            shard.model_copy(
                update={"size_min": 0, "size_max": _MAX_SIZE_KB // 2, "depth": shard.depth + 1}
            ),
            shard.model_copy(
                update={
                    "size_min": _MAX_SIZE_KB // 2 + 1,
                    "size_max": _MAX_SIZE_KB,
                    "depth": shard.depth + 1,
                }
            ),
        )

    if shard.size_min < shard.size_max:
        midpoint = (shard.size_min + shard.size_max) // 2
        return (
            shard.model_copy(update={"size_max": midpoint, "depth": shard.depth + 1}),
            shard.model_copy(update={"size_min": midpoint + 1, "depth": shard.depth + 1}),
        )

    return None
