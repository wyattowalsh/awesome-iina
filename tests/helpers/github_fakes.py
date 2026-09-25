from __future__ import annotations

from typing import Any

from awesome_iina.discovery.settings import GithubConfig
from awesome_iina.github import GhClient


def github_config() -> GithubConfig:
    return GithubConfig(
        repository_request_delay_seconds=0,
        code_search_delay_seconds=0,
        max_retries=1,
        initial_backoff_seconds=0,
        max_backoff_seconds=1,
    )


class StubClient(GhClient):
    def __init__(self, responses: list[Any]) -> None:
        super().__init__(github_config())
        self.responses = responses
        self.calls: list[tuple[list[str], str | None, bool]] = []

    def _run(
        self,
        args: list[str],
        *,
        stdin: str | None = None,
        parse_json: bool = True,
        retries: int | None = None,
    ) -> Any:
        del retries
        self.calls.append((args, stdin, parse_json))
        response = self.responses.pop(0)
        if isinstance(response, Exception):
            raise response
        return response
