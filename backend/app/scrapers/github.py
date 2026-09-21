"""GitHub statistics via the official public REST API."""

from __future__ import annotations

import re

import httpx

from ..schemas import (
    CodingPlatformStats,
    CodingStatItem,
    GitHubActivityItem,
    GitHubActivityResponse,
    GitHubRepo,
    GitHubReposResponse,
    Heatmap,
    HeatmapDay,
    RepoCommit,
    RepoCommitsResponse,
)
from .base import (
    client,
    github_headers,
    heatmap_ok,
    heatmap_unavailable,
    now_iso,
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


async def fetch_repos(username: str, limit: int = 6) -> GitHubReposResponse:
    """Top public, non-fork repositories via the official REST API."""
    try:
        async with client(headers=github_headers()) as http:
            resp = await http.get(
                f"{API}/users/{username}/repos",
                params={"per_page": 100, "type": "owner", "sort": "updated"},
            )
            if resp.status_code == 404:
                return GitHubReposResponse(status="unavailable", message="Profile not found.")
            resp.raise_for_status()
            raw = resp.json()

        repos = [
            GitHubRepo(
                name=r["name"],
                description=r.get("description"),
                language=r.get("language"),
                url=r["html_url"],
                homepage=(r.get("homepage") or None),
                stars=r.get("stargazers_count", 0),
                forks=r.get("forks_count", 0),
                updated_at=r.get("updated_at"),
            )
            for r in raw
            # Skip forks and the special profile-README repo (named after the user).
            if not r.get("fork") and r.get("name", "").lower() != username.lower()
        ]
        # Rank: stars first, then most-recently updated (already sorted by update).
        repos.sort(key=lambda x: x.stars, reverse=True)
        return GitHubReposResponse(status="ok", repos=repos[:limit], updated_at=now_iso())
    except (httpx.HTTPError, ValueError, KeyError):
        return GitHubReposResponse(status="unavailable", message="Could not load repositories.")


def _describe_event(ev: dict) -> tuple[str, str | None] | None:
    """Map a GitHub event to (action, detail). Returns None to skip the event."""
    etype = ev.get("type")
    payload = ev.get("payload") or {}
    if etype == "PushEvent":
        n = payload.get("size") or len(payload.get("commits") or [])
        return "Pushed", f"{n} commit{'s' if n != 1 else ''}"
    if etype == "CreateEvent":
        ref_type = payload.get("ref_type", "repository")
        return f"Created {ref_type}", payload.get("ref")
    if etype == "PullRequestEvent":
        action = payload.get("action", "updated")
        return f"{action.capitalize()} pull request", None
    if etype == "IssuesEvent":
        action = payload.get("action", "updated")
        return f"{action.capitalize()} issue", None
    if etype == "WatchEvent":
        return "Starred", None
    if etype == "ForkEvent":
        return "Forked", None
    if etype == "ReleaseEvent":
        return "Released", (payload.get("release") or {}).get("tag_name")
    if etype == "PublicEvent":
        return "Made public", None
    return None


async def fetch_activity(username: str, limit: int = 12) -> GitHubActivityResponse:
    """Recent public activity via the GitHub events API."""
    try:
        async with client(headers=github_headers()) as http:
            resp = await http.get(
                f"{API}/users/{username}/events/public", params={"per_page": 50}
            )
            if resp.status_code == 404:
                return GitHubActivityResponse(status="unavailable", message="Profile not found.")
            resp.raise_for_status()
            events = resp.json()

        items: list[GitHubActivityItem] = []
        for ev in events:
            described = _describe_event(ev)
            if described is None:
                continue
            action, detail = described
            repo_name = (ev.get("repo") or {}).get("name", "")
            items.append(
                GitHubActivityItem(
                    id=str(ev.get("id")),
                    type=action,
                    repo=repo_name,
                    repo_url=f"https://github.com/{repo_name}",
                    detail=detail,
                    created_at=ev.get("created_at", ""),
                )
            )
            if len(items) >= limit:
                break
        return GitHubActivityResponse(status="ok", items=items, updated_at=now_iso())
    except (httpx.HTTPError, ValueError, KeyError):
        return GitHubActivityResponse(status="unavailable", message="Could not load activity.")


async def fetch_commits(owner: str, repo: str, limit: int = 5) -> RepoCommitsResponse:
    """Recent commits for a public repository."""
    try:
        async with client(headers=github_headers()) as http:
            resp = await http.get(
                f"{API}/repos/{owner}/{repo}/commits", params={"per_page": limit}
            )
            if resp.status_code in (404, 409):
                return RepoCommitsResponse(status="unavailable", message="No commits available.")
            resp.raise_for_status()
            raw = resp.json()

        commits = [
            RepoCommit(
                sha=(c.get("sha") or "")[:7],
                message=((c.get("commit") or {}).get("message") or "").split("\n")[0][:120],
                url=c.get("html_url", ""),
                date=((c.get("commit") or {}).get("author") or {}).get("date"),
            )
            for c in raw
        ]
        return RepoCommitsResponse(status="ok", commits=commits)
    except (httpx.HTTPError, ValueError, KeyError):
        return RepoCommitsResponse(status="unavailable", message="Could not load commits.")


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
