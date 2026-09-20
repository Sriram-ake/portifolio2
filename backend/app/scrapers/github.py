"""GitHub statistics via the official public REST API."""

from __future__ import annotations

import re

import httpx

from ..schemas import CodingPlatformStats, CodingStatItem, Heatmap, HeatmapDay
from .base import (
    client,
    github_headers,
    heatmap_ok,
    heatmap_unavailable,
    ok,
    unavailable,
)

PLATFORM = "github"
API = "https://api.github.com"

# Contribution-calendar HTML parsing (public page, no token required).
_DAY_RE = re.compile(
    r'data-date="(\d{4}-\d{2}-\d{2})"\s+id="(contribution-day-component-[\d-]+)"[^>]*?data-level="(\d)"'
)
_TIP_RE = re.compile(
    r'for="(contribution-day-component-[\d-]+)"[^>]*?>(No|[\d,]+)\s+contribution'
)


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


async def fetch_heatmap(username: str) -> Heatmap:
    """GitHub contribution calendar from the public contributions HTML page."""
    try:
        async with client(headers={"Accept": "text/html"}) as http:
            resp = await http.get(f"https://github.com/users/{username}/contributions")
            if resp.status_code == 404:
                return heatmap_unavailable(PLATFORM, username, "Profile not found.")
            resp.raise_for_status()
            html = resp.text

        # Map cell id -> exact count from the accessible tooltips.
        counts: dict[str, int] = {}
        for cell_id, raw in _TIP_RE.findall(html):
            counts[cell_id] = 0 if raw == "No" else int(raw.replace(",", ""))

        days: list[HeatmapDay] = []
        for date, cell_id, level in _DAY_RE.findall(html):
            days.append(
                HeatmapDay(date=date, count=counts.get(cell_id, 0), level=int(level))
            )

        if not days:
            return heatmap_unavailable(PLATFORM, username, "Could not read the contribution graph.")
        days.sort(key=lambda d: d.date)
        return heatmap_ok(PLATFORM, username, days)
    except (httpx.HTTPError, ValueError):
        return heatmap_unavailable(PLATFORM, username)
