"""GitHub statistics via the official public REST API."""

from __future__ import annotations

import httpx

from ..schemas import CodingPlatformStats, CodingStatItem
from .base import client, github_headers, ok, unavailable

PLATFORM = "github"
API = "https://api.github.com"


async def fetch(username: str) -> CodingPlatformStats:
    try:
        async with client(headers=github_headers()) as http:
            user_resp = await http.get(f"{API}/users/{username}")
            if user_resp.status_code == 404:
                return unavailable(PLATFORM, username, "Profile not found.")
            user_resp.raise_for_status()
            user = user_resp.json()

            # Sum stars across public repos (first 100 — sufficient for most users).
            stars = 0
            repos_resp = await http.get(
                f"{API}/users/{username}/repos",
                params={"per_page": 100, "type": "owner", "sort": "updated"},
            )
            if repos_resp.status_code == 200:
                stars = sum(r.get("stargazers_count", 0) for r in repos_resp.json())

        stats = [
            CodingStatItem(label="Repositories", value=user.get("public_repos", 0)),
            CodingStatItem(label="Followers", value=user.get("followers", 0)),
            CodingStatItem(label="Following", value=user.get("following", 0)),
            CodingStatItem(label="Stars", value=stars),
        ]
        return ok(PLATFORM, username, stats)
    except (httpx.HTTPError, ValueError, KeyError):
        return unavailable(PLATFORM, username)
