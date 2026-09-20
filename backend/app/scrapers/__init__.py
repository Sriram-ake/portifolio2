"""Coding platform data clients / scrapers.

Each module exposes an async `fetch(username: str) -> CodingPlatformStats`.
Every fetcher must:
  * use official/public APIs where available,
  * apply a timeout and handle failure gracefully (return status != "ok"),
  * never bypass authentication, CAPTCHA, or anti-bot mechanisms,
  * never fabricate statistics.
"""

from . import codechef, codeforces, geeksforgeeks, github, hackerrank, leetcode

FETCHERS = {
    "github": github.fetch,
    "leetcode": leetcode.fetch,
    "codechef": codechef.fetch,
    "hackerrank": hackerrank.fetch,
    "geeksforgeeks": geeksforgeeks.fetch,
    "codeforces": codeforces.fetch,
}

# Platforms that expose a daily contribution/submission calendar.
HEATMAP_FETCHERS = {
    "github": github.fetch_heatmap,
    "leetcode": leetcode.fetch_heatmap,
}

__all__ = ["FETCHERS", "HEATMAP_FETCHERS"]
