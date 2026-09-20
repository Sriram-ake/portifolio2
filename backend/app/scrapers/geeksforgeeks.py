"""GeeksforGeeks statistics.

GeeksforGeeks has no official public API. This reads the public profile page and
extracts visible counts conservatively, failing gracefully on any change. No
protection is bypassed.
"""

from __future__ import annotations

import re

import httpx

from ..schemas import CodingPlatformStats, CodingStatItem
from .base import client, ok, unavailable

PLATFORM = "geeksforgeeks"

# The modern GFG profile is a Next.js app that embeds stats as escaped JSON in
# the server flight data, e.g.  \"score\":35 , \"total_problems_solved\":25 .
# Match both escaped and plain forms so the parser is resilient.
_SCORE_RE = re.compile(r'\\?"score\\?"\s*:\s*(\d+)')
_SOLVED_RE = re.compile(r'\\?"total_problems_solved\\?"\s*:\s*(\d+)')
_RANK_RE = re.compile(r'\\?"institute_rank\\?"\s*:\s*(\d+)')


async def fetch(username: str) -> CodingPlatformStats:
    try:
        # follow_redirects is enabled in the base client (/user/ -> /profile/).
        async with client(headers={"Accept": "text/html"}) as http:
            resp = await http.get(f"https://www.geeksforgeeks.org/user/{username}/")
            if resp.status_code == 404:
                return unavailable(PLATFORM, username, "Profile not found.")
            resp.raise_for_status()
            html = resp.text

        stats: list[CodingStatItem] = []
        if m := _SCORE_RE.search(html):
            stats.append(CodingStatItem(label="Coding Score", value=int(m.group(1))))
        if m := _SOLVED_RE.search(html):
            stats.append(CodingStatItem(label="Problems Solved", value=int(m.group(1))))
        if m := _RANK_RE.search(html):
            stats.append(CodingStatItem(label="Institute Rank", value=int(m.group(1))))

        if not stats:
            return unavailable(PLATFORM, username, "Statistics could not be read right now.")
        return ok(PLATFORM, username, stats)
    except (httpx.HTTPError, ValueError):
        return unavailable(PLATFORM, username)
