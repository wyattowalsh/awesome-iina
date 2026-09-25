from __future__ import annotations

import json

REPOSITORY_SEARCH_QUERY = r"""
query SearchRepositories($query: String!, $cursor: String, $pageSize: Int!) {
  search(type: REPOSITORY, query: $query, first: $pageSize, after: $cursor) {
    repositoryCount
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      ... on Repository {
        id
        databaseId
        nameWithOwner
        url
        description
        createdAt
        updatedAt
        pushedAt
        isPrivate
        isArchived
        isDisabled
        isEmpty
        isFork
        isMirror
        isTemplate
        stargazerCount
        forkCount
        primaryLanguage { name }
        licenseInfo { spdxId }
        defaultBranchRef { name }
        repositoryTopics(first: 20) {
          nodes { topic { name } }
        }
      }
    }
  }
  rateLimit {
    cost
    remaining
    resetAt
  }
}
"""


def build_repository_batch_query(repositories: list[str]) -> str:
    fields: list[str] = []
    for index, repository in enumerate(repositories):
        owner, name = repository.split("/", maxsplit=1)
        owner_literal = json.dumps(owner)
        name_literal = json.dumps(name)
        fields.append(
            f"""repo{index}: repository(owner: {owner_literal}, name: {name_literal}) {{
              id
              databaseId
              nameWithOwner
              url
              description
              homepageUrl
              createdAt
              updatedAt
              pushedAt
              isPrivate
        isArchived
              isDisabled
              isEmpty
              isFork
              isMirror
              isTemplate
              diskUsage
              stargazerCount
              forkCount
              watchers {{ totalCount }}
              issues(states: OPEN) {{ totalCount }}
              pullRequests(states: OPEN) {{ totalCount }}
              licenseInfo {{ spdxId }}
              primaryLanguage {{ name }}
              languages(first: 10, orderBy: {{field: SIZE, direction: DESC}}) {{
                edges {{ size node {{ name }} }}
              }}
              repositoryTopics(first: 30) {{
                nodes {{ topic {{ name }} }}
              }}
              defaultBranchRef {{ name }}
              latestRelease {{ tagName publishedAt }}
              releases {{ totalCount }}
              parent {{ nameWithOwner }}
            }}"""
        )
    joined = "\n".join(fields)
    return f"query EnrichRepositories {{\n{joined}\nrateLimit {{ cost remaining resetAt }}\n}}"
