"""Tests for coding statistics normalization and failure handling."""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from app.scrapers import base
from app.schemas import CodingStatItem
from app.services import coding_service


def test_unavailable_shape() -> None:
    result = base.unavailable("github", "someuser")
    assert result.status == "unavailable"
    assert result.platform == "github"
    assert result.stats == []
    assert result.profile_url.endswith("someuser")


def test_ok_shape() -> None:
    result = base.ok("leetcode", "u", [CodingStatItem(label="Solved", value=10)])
    assert result.status == "ok"
    assert result.display_name == "LeetCode"
    assert result.stats[0].value == 10


@pytest.mark.asyncio
async def test_one_failure_does_not_break_summary(monkeypatch: pytest.MonkeyPatch) -> None:
    """If a single fetcher raises, the summary still returns all platforms."""

    async def boom(_username: str):
        raise RuntimeError("network down")

    async def fine(username: str):
        return base.ok("github", username, [CodingStatItem(label="Repositories", value=3)])

    monkeypatch.setitem(coding_service.FETCHERS, "leetcode", boom)
    monkeypatch.setitem(coding_service.FETCHERS, "github", fine)
    coding_service.clear_cache()

    summary = await coding_service.get_summary(force=True)
    platforms = {p.platform: p for p in summary.platforms}
    assert len(summary.platforms) == 6  # all platforms present
    assert platforms["leetcode"].status in {"unavailable", "error"}
    assert platforms["github"].status == "ok"


def test_unknown_platform_404(client: TestClient) -> None:
    resp = client.get("/api/coding/notaplatform")
    assert resp.status_code == 404


def test_coding_summary_serialization(client: TestClient, monkeypatch: pytest.MonkeyPatch) -> None:
    async def fine(username: str):
        return base.ok("github", username, [CodingStatItem(label="Repositories", value=1)])

    # Force every fetcher to a quick, deterministic success to avoid real network.
    for key in list(coding_service.FETCHERS):
        monkeypatch.setitem(coding_service.FETCHERS, key, fine)
    coding_service.clear_cache()

    resp = client.get("/api/coding?force=true")
    assert resp.status_code == 200
    body = resp.json()
    assert "platforms" in body
    assert body["platforms"][0]["displayName"]  # camelCase alias applied
