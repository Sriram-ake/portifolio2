"""Orchestrates coding-platform fetchers with caching and failure isolation."""

from __future__ import annotations

import asyncio

from ..cache import TTLCache
from ..config import settings
from ..scrapers import FETCHERS, HEATMAP_FETCHERS, github
from ..scrapers.base import heatmap_unavailable, now_iso, unavailable
from ..schemas import CodingPlatformStats, CodingSummary, GitHubReposResponse, Heatmap

_USERNAMES = {
    "github": settings.github_username,
    "leetcode": settings.leetcode_username,
    "codechef": settings.codechef_username,
    "hackerrank": settings.hackerrank_username,
    "geeksforgeeks": settings.geeksforgeeks_username,
    "codeforces": settings.codeforces_username,
}

_cache: TTLCache[CodingPlatformStats] = TTLCache(settings.coding_cache_ttl)
_heatmap_cache: TTLCache[Heatmap] = TTLCache(settings.coding_cache_ttl)
_repos_cache: TTLCache[GitHubReposResponse] = TTLCache(settings.coding_cache_ttl)

# Preserve a stable card order in the UI.
PLATFORM_ORDER = ["github", "leetcode", "codechef", "hackerrank", "geeksforgeeks", "codeforces"]


async def _fetch_one(platform: str, *, force: bool = False) -> CodingPlatformStats:
    """Fetch a single platform, using cache and isolating any failure."""
    username = _USERNAMES[platform]
    if not force:
        cached = _cache.get(platform)
        if cached is not None:
            return cached

    fetcher = FETCHERS[platform]
    try:
        result = await fetcher(username)
    except Exception:  # noqa: BLE001 - never let one platform crash the request
        result = unavailable(platform, username)

    # Only cache successful results so a transient failure doesn't stick.
    if result.status == "ok":
        _cache.set(platform, result)
    return result


async def get_platform(platform: str, *, force: bool = False) -> CodingPlatformStats:
    if platform not in FETCHERS:
        raise KeyError(platform)
    return await _fetch_one(platform, force=force)


async def get_summary(*, force: bool = False) -> CodingSummary:
    results = await asyncio.gather(
        *(_fetch_one(p, force=force) for p in PLATFORM_ORDER),
        return_exceptions=False,
    )
    ordered = sorted(results, key=lambda r: PLATFORM_ORDER.index(r.platform))
    return CodingSummary(platforms=ordered, updated_at=now_iso())


HEATMAP_PLATFORMS = list(HEATMAP_FETCHERS.keys())


async def get_heatmap(platform: str, *, force: bool = False) -> Heatmap:
    if platform not in HEATMAP_FETCHERS:
        raise KeyError(platform)
    username = _USERNAMES[platform]
    if not force:
        cached = _heatmap_cache.get(platform)
        if cached is not None:
            return cached
    try:
        result = await HEATMAP_FETCHERS[platform](username)
    except Exception:  # noqa: BLE001 - isolate failures
        result = heatmap_unavailable(platform, username)
    if result.status == "ok":
        _heatmap_cache.set(platform, result)
    return result


async def get_repos(*, force: bool = False) -> GitHubReposResponse:
    if not force:
        cached = _repos_cache.get("repos")
        if cached is not None:
            return cached
    try:
        result = await github.fetch_repos(settings.github_username)
    except Exception:  # noqa: BLE001 - isolate failures
        result = GitHubReposResponse(status="unavailable", message="Could not load repositories.")
    if result.status == "ok":
        _repos_cache.set("repos", result)
    return result


def clear_cache() -> None:
    _cache.clear()
    _heatmap_cache.clear()
    _repos_cache.clear()
