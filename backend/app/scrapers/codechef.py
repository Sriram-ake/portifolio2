"""CodeChef statistics.

CodeChef has no official public API, so this reads the public profile page and
extracts a few visible fields with conservative regexes. It respects a timeout,
does not bypass any protection, and fails gracefully if the page structure
changes or the profile is unavailable.
"""

from __future__ import annotations

import re

import httpx

from ..schemas import CodingPlatformStats, CodingStatItem
from .base import client, ok, unavailable

PLATFORM = "codechef"

_RATING_RE = re.compile(r'class="rating-number"[^>]*>(\d+)')
_STARS_RE = re.compile(r'class="rating"[^>]*>\s*(\d+)\s*★')
_SOLVED_RE = re.compile(r"Total Problems Solved:\s*(\d+)")


async def fetch(username: str) -> CodingPlatformStats:
    try:
        async with client(headers={"Accept": "text/html"}) as http:
            resp = await http.get(f"https://www.codechef.com/users/{username}")
            if resp.status_code == 404:
                return unavailable(PLATFORM, username, "Profile not found.")
            resp.raise_for_status()
            html = resp.text

        stats: list[CodingStatItem] = []
        if m := _RATING_RE.search(html):
            stats.append(CodingStatItem(label="Rating", value=int(m.group(1))))
        if m := _STARS_RE.search(html):
            stats.append(CodingStatItem(label="Stars", value=f"{m.group(1)}★"))
        if m := _SOLVED_RE.search(html):
            stats.append(CodingStatItem(label="Problems Solved", value=int(m.group(1))))

        if not stats:
            return unavailable(PLATFORM, username, "Statistics could not be read right now.")
        return ok(PLATFORM, username, stats)
    except (httpx.HTTPError, ValueError):
        return unavailable(PLATFORM, username)
