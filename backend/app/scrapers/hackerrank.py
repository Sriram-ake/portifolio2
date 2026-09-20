"""HackerRank statistics.

HackerRank exposes a public REST endpoint for badges on profiles. This reads
that public JSON where available and falls back gracefully otherwise. No
authentication or anti-bot mechanism is bypassed.
"""

from __future__ import annotations

import httpx

from ..schemas import CodingPlatformStats, CodingStatItem
from .base import client, ok, unavailable

PLATFORM = "hackerrank"


async def fetch(username: str) -> CodingPlatformStats:
    try:
        async with client(headers={"Accept": "application/json"}) as http:
            resp = await http.get(f"https://www.hackerrank.com/rest/hackers/{username}/badges")
            if resp.status_code == 404:
                return unavailable(PLATFORM, username, "Profile not found.")
            resp.raise_for_status()
            payload = resp.json()

        models = payload.get("models", []) if isinstance(payload, dict) else []
        if not models:
            return unavailable(PLATFORM, username, "No public badges available.")

        badge_count = len(models)
        total_stars = sum(int(m.get("stars", 0)) for m in models)
        top = max(models, key=lambda m: int(m.get("stars", 0)), default=None)

        stats = [
            CodingStatItem(label="Badges", value=badge_count),
            CodingStatItem(label="Total Stars", value=total_stars),
        ]
        if top and top.get("badge_name"):
            stats.append(CodingStatItem(label="Top Badge", value=str(top["badge_name"])))
        return ok(PLATFORM, username, stats)
    except (httpx.HTTPError, ValueError, KeyError, TypeError):
        return unavailable(PLATFORM, username)
