"""Codeforces statistics via the official public API (codeforces.com/api)."""

from __future__ import annotations

import httpx

from ..schemas import CodingPlatformStats, CodingStatItem
from .base import client, ok, unavailable

PLATFORM = "codeforces"
API = "https://codeforces.com/api"


async def fetch(username: str) -> CodingPlatformStats:
    try:
        async with client() as http:
            info_resp = await http.get(f"{API}/user.info", params={"handles": username})
            info_resp.raise_for_status()
            info = info_resp.json()
            if info.get("status") != "OK" or not info.get("result"):
                return unavailable(PLATFORM, username, "Profile not found.")
            user = info["result"][0]

            # Count distinct solved problems from submission history.
            solved: set[str] = set()
            status_resp = await http.get(
                f"{API}/user.status", params={"handle": username, "from": 1, "count": 10000}
            )
            if status_resp.status_code == 200:
                sdata = status_resp.json()
                if sdata.get("status") == "OK":
                    for sub in sdata["result"]:
                        if sub.get("verdict") == "OK":
                            prob = sub.get("problem", {})
                            key = f"{prob.get('contestId')}-{prob.get('index')}"
                            solved.add(key)

        stats: list[CodingStatItem] = []
        if user.get("rating") is not None:
            stats.append(CodingStatItem(label="Rating", value=user["rating"]))
        if user.get("maxRating") is not None:
            stats.append(CodingStatItem(label="Max Rating", value=user["maxRating"]))
        if user.get("rank"):
            stats.append(CodingStatItem(label="Rank", value=str(user["rank"]).title()))
        if solved:
            stats.append(CodingStatItem(label="Problems Solved", value=len(solved)))

        if not stats:
            return unavailable(PLATFORM, username, "No public statistics available.")
        return ok(PLATFORM, username, stats)
    except (httpx.HTTPError, ValueError, KeyError, IndexError):
        return unavailable(PLATFORM, username)
