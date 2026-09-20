"""Shared helpers for platform fetchers."""

from __future__ import annotations

from datetime import datetime, timezone

import httpx

from ..config import settings
from ..schemas import (
    CodingBreakdownItem,
    CodingPlatformStats,
    CodingStatItem,
    Heatmap,
    HeatmapDay,
)

DEFAULT_TIMEOUT = httpx.Timeout(10.0, connect=5.0)
USER_AGENT = "AkeSriRamPortfolio/1.0 (+https://akesriram.dev)"

PROFILE_URLS = {
    "github": lambda u: f"https://github.com/{u}",
    "leetcode": lambda u: f"https://leetcode.com/u/{u}/",
    "codechef": lambda u: f"https://www.codechef.com/users/{u}",
    "hackerrank": lambda u: f"https://www.hackerrank.com/profile/{u}",
    "geeksforgeeks": lambda u: f"https://www.geeksforgeeks.org/user/{u}/",
    "codeforces": lambda u: f"https://codeforces.com/profile/{u}",
}

DISPLAY_NAMES = {
    "github": "GitHub",
    "leetcode": "LeetCode",
    "codechef": "CodeChef",
    "hackerrank": "HackerRank",
    "geeksforgeeks": "GeeksforGeeks",
    "codeforces": "Codeforces",
}


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def profile_url(platform: str, username: str) -> str:
    return PROFILE_URLS[platform](username)


def ok(
    platform: str,
    username: str,
    stats: list[CodingStatItem],
    breakdown: list[CodingBreakdownItem] | None = None,
) -> CodingPlatformStats:
    return CodingPlatformStats(
        platform=platform,
        display_name=DISPLAY_NAMES[platform],
        profile_url=profile_url(platform, username),
        username=username,
        status="ok",
        updated_at=now_iso(),
        stats=stats,
        breakdown=breakdown,
    )


def unavailable(platform: str, username: str, message: str = "Statistics unavailable right now.") -> CodingPlatformStats:
    return CodingPlatformStats(
        platform=platform,
        display_name=DISPLAY_NAMES[platform],
        profile_url=profile_url(platform, username),
        username=username,
        status="unavailable",
        updated_at=now_iso(),
        stats=[],
        message=message,
    )


def client(**kwargs) -> httpx.AsyncClient:
    headers = {"User-Agent": USER_AGENT, "Accept": "application/json"}
    headers.update(kwargs.pop("headers", {}))
    return httpx.AsyncClient(timeout=DEFAULT_TIMEOUT, headers=headers, follow_redirects=True, **kwargs)


def level_from_count(count: int, thresholds: tuple[int, int, int, int] = (1, 3, 6, 10)) -> int:
    """Map a daily contribution count to a 0-4 intensity bucket."""
    if count <= 0:
        return 0
    for i, t in enumerate(thresholds):
        if count < t:
            return i
    return 4


def heatmap_ok(platform: str, username: str, days: list[HeatmapDay]) -> Heatmap:
    return Heatmap(
        platform=platform,
        display_name=DISPLAY_NAMES[platform],
        profile_url=profile_url(platform, username),
        status="ok",
        total=sum(d.count for d in days),
        days=days,
        updated_at=now_iso(),
    )


def heatmap_unavailable(
    platform: str, username: str, message: str = "Activity data unavailable right now."
) -> Heatmap:
    return Heatmap(
        platform=platform,
        display_name=DISPLAY_NAMES[platform],
        profile_url=profile_url(platform, username),
        status="unavailable",
        updated_at=now_iso(),
        message=message,
    )


def github_headers() -> dict[str, str]:
    headers = {"Accept": "application/vnd.github+json", "User-Agent": USER_AGENT}
    if settings.github_token:
        headers["Authorization"] = f"Bearer {settings.github_token}"
    return headers
