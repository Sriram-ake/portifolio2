"""LeetCode statistics via the public GraphQL endpoint."""

from __future__ import annotations

import json
from datetime import datetime, timezone

import httpx

from ..schemas import (
    CodingBreakdownItem,
    CodingPlatformStats,
    CodingStatItem,
    Heatmap,
    HeatmapDay,
)
from .base import client, heatmap_ok, heatmap_unavailable, level_from_count, ok, unavailable

PLATFORM = "leetcode"
GRAPHQL = "https://leetcode.com/graphql"

CALENDAR_QUERY = """
query userCalendar($username: String!) {
  matchedUser(username: $username) {
    submissionCalendar
  }
}
"""

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


async def fetch_heatmap(username: str) -> Heatmap:
    """LeetCode submission calendar (public GraphQL). Returns a daily heatmap."""
    try:
        async with client(
            headers={"Content-Type": "application/json", "Referer": "https://leetcode.com"}
        ) as http:
            resp = await http.post(
                GRAPHQL,
                json={"query": CALENDAR_QUERY, "variables": {"username": username}},
            )
            resp.raise_for_status()
            payload = resp.json()

        matched = (payload.get("data") or {}).get("matchedUser")
        if not matched:
            return heatmap_unavailable(PLATFORM, username, "Profile not found.")

        raw_calendar = matched.get("submissionCalendar")
        if not raw_calendar:
            return heatmap_unavailable(PLATFORM, username, "No activity data available.")

        # submissionCalendar is a JSON string: {"<unix_seconds>": count, ...}
        calendar: dict[str, int] = json.loads(raw_calendar)
        days: list[HeatmapDay] = []
        for ts, count in calendar.items():
            date = datetime.fromtimestamp(int(ts), tz=timezone.utc).strftime("%Y-%m-%d")
            days.append(HeatmapDay(date=date, count=int(count), level=level_from_count(int(count))))

        if not days:
            return heatmap_unavailable(PLATFORM, username, "No activity data available.")
        days.sort(key=lambda d: d.date)
        return heatmap_ok(PLATFORM, username, days)
    except (httpx.HTTPError, ValueError, KeyError, TypeError, json.JSONDecodeError):
        return heatmap_unavailable(PLATFORM, username)
