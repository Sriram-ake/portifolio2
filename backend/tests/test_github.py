"""Tests for GitHub activity/commits endpoints and event normalization."""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from app.scrapers import github
from app.schemas import GitHubActivityResponse, RepoCommitsResponse
from app.services import coding_service


def test_describe_event_push() -> None:
    ev = {"type": "PushEvent", "payload": {"size": 3}}
    action, detail = github._describe_event(ev)
    assert action == "Pushed"
    assert detail == "3 commits"


def test_describe_event_push_singular() -> None:
    ev = {"type": "PushEvent", "payload": {"size": 1}}
    action, detail = github._describe_event(ev)
    assert detail == "1 commit"


def test_describe_event_create_repo() -> None:
    ev = {"type": "CreateEvent", "payload": {"ref_type": "repository"}}
    action, _ = github._describe_event(ev)
    assert action == "Created repository"


def test_describe_event_star() -> None:
    action, detail = github._describe_event({"type": "WatchEvent", "payload": {}})
    assert action == "Starred"
    assert detail is None


def test_describe_event_unknown_skipped() -> None:
    # Noisy/irrelevant events are filtered out.
    assert github._describe_event({"type": "MemberEvent", "payload": {}}) is None


@pytest.mark.asyncio
async def test_activity_failure_isolated(monkeypatch: pytest.MonkeyPatch) -> None:
    async def boom(_username: str, *args, **kwargs):
        raise RuntimeError("network down")

    monkeypatch.setattr(github, "fetch_activity", boom)
    coding_service.clear_cache()
    result = await coding_service.get_activity(force=True)
    assert result.status == "unavailable"
    assert result.items == []


@pytest.mark.asyncio
async def test_commits_failure_isolated(monkeypatch: pytest.MonkeyPatch) -> None:
    async def boom(_owner: str, _repo: str, *args, **kwargs):
        raise RuntimeError("network down")

    monkeypatch.setattr(github, "fetch_commits", boom)
    coding_service.clear_cache()
    result = await coding_service.get_commits("owner", "repo", force=True)
    assert result.status == "unavailable"
    assert result.commits == []


def test_activity_endpoint_serialization(
    client: TestClient, monkeypatch: pytest.MonkeyPatch
) -> None:
    async def fake(_username: str, *args, **kwargs):
        return GitHubActivityResponse(
            status="ok",
            items=[
                {
                    "id": "1",
                    "type": "Pushed",
                    "repo": "Sriram-ake/portifolio2",
                    "repo_url": "https://github.com/Sriram-ake/portifolio2",
                    "detail": "2 commits",
                    "created_at": "2026-09-20T10:00:00Z",
                }
            ],
        )

    monkeypatch.setattr(github, "fetch_activity", fake)
    coding_service.clear_cache()

    resp = client.get("/api/github/activity?force=true")
    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] == "ok"
    item = body["items"][0]
    # camelCase aliases applied on serialization
    assert item["repoUrl"].endswith("portifolio2")
    assert item["createdAt"] == "2026-09-20T10:00:00Z"


def test_commits_rejects_bad_identifier(client: TestClient) -> None:
    # Path-traversal / injection attempts must never reach the GitHub proxy.
    resp = client.get("/api/github/repos/owner/..%2f..%2fetc/commits")
    assert resp.status_code in (400, 404)


def test_commits_endpoint_serialization(
    client: TestClient, monkeypatch: pytest.MonkeyPatch
) -> None:
    async def fake(_owner: str, _repo: str, *args, **kwargs):
        return RepoCommitsResponse(
            status="ok",
            commits=[
                {
                    "sha": "abc1234",
                    "message": "Initial commit",
                    "url": "https://github.com/Sriram-ake/portifolio2/commit/abc1234",
                    "date": "2026-09-19T08:00:00Z",
                }
            ],
        )

    monkeypatch.setattr(github, "fetch_commits", fake)
    coding_service.clear_cache()

    resp = client.get("/api/github/repos/Sriram-ake/portifolio2/commits?force=true")
    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] == "ok"
    assert body["commits"][0]["sha"] == "abc1234"
