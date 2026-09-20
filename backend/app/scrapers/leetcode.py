"""LeetCode statistics via the public GraphQL endpoint."""

from __future__ import annotations

import httpx

from ..schemas import CodingBreakdownItem, CodingPlatformStats, CodingStatItem
from .base import client, ok, unavailable

PLATFORM = "leetcode"
GRAPHQL = "https://leetcode.com/graphql"

QUERY = """
query userStats($username: String!) {
  matchedUser(username: $username) {
    submitStatsGlobal {
      acSubmissionNum { difficulty count }
    }
  }
  userContestRanking(username: $username) {
    rating
    globalRanking
    attendedContestsCount
  }
}
"""


async def fetch(username: str) -> CodingPlatformStats:
    try:
        async with client(headers={"Content-Type": "application/json", "Referer": "https://leetcode.com"}) as http:
            resp = await http.post(
                GRAPHQL,
                json={"query": QUERY, "variables": {"username": username}},
            )
            resp.raise_for_status()
            payload = resp.json()

        data = payload.get("data") or {}
        matched = data.get("matchedUser")
        if not matched:
            return unavailable(PLATFORM, username, "Profile not found.")

        submissions = matched["submitStatsGlobal"]["acSubmissionNum"]
        by_diff = {row["difficulty"]: row["count"] for row in submissions}
        total = by_diff.get("All", 0)

        stats = [CodingStatItem(label="Solved", value=total)]
        contest = data.get("userContestRanking")
        if contest and contest.get("rating"):
            stats.append(CodingStatItem(label="Contest Rating", value=round(contest["rating"])))

        breakdown = [
            CodingBreakdownItem(name="Easy", value=by_diff.get("Easy", 0)),
            CodingBreakdownItem(name="Medium", value=by_diff.get("Medium", 0)),
            CodingBreakdownItem(name="Hard", value=by_diff.get("Hard", 0)),
        ]
        return ok(PLATFORM, username, stats, breakdown)
    except (httpx.HTTPError, ValueError, KeyError, TypeError):
        return unavailable(PLATFORM, username)
