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


def test_projects_empty_not_fabricated(client: TestClient) -> None:
    # No projects invented — stays empty until real ones are added.
    assert client.get("/api/projects").json() == []


def test_certifications_from_resume(client: TestClient) -> None:
    # Certifications come from the resume (verified), not fabricated.
    certs = client.get("/api/certifications").json()
    titles = {c["title"] for c in certs}
    assert "C Programming" in titles
    assert any(c["issuer"] == "Cisco" for c in certs)
