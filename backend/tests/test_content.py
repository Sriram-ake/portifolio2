"""Tests for static content endpoints."""

from __future__ import annotations

from fastapi.testclient import TestClient


def test_health(client: TestClient) -> None:
    resp = client.get("/api/health")
    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] == "ok"
    assert "services" in body


def test_profile(client: TestClient) -> None:
    resp = client.get("/api/profile")
    assert resp.status_code == 200
    body = resp.json()
    assert body["name"] == "Ake Sri Ram"
    assert body["cgpa"] == "8.36"
    # Instagram must remain null (never invented).
    assert body["social"]["instagram"] is None
    # Sensitive fields must not be exposed.
    assert "dateOfBirth" not in body
    assert "phone" not in body


def test_education_order(client: TestClient) -> None:
    resp = client.get("/api/education")
    assert resp.status_code == 200
    items = resp.json()
    assert items[0]["id"] == "btech"
    assert len(items) == 3


def test_skills(client: TestClient) -> None:
    resp = client.get("/api/skills")
    assert resp.status_code == 200
    categories = resp.json()
    assert any(c["id"] == "programming" for c in categories)


def test_projects_and_certs_empty_not_fabricated(client: TestClient) -> None:
    # No fake data — both start empty.
    assert client.get("/api/projects").json() == []
    assert client.get("/api/certifications").json() == []
