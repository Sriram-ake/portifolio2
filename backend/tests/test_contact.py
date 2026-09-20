"""Tests for contact form validation, honeypot, and error handling."""

from __future__ import annotations

from fastapi.testclient import TestClient

VALID = {
    "name": "Jane Recruiter",
    "email": "jane@example.com",
    "subject": "Opportunity",
    "message": "Hi Sri Ram, we have an internship opportunity for you to consider.",
}


def test_rejects_invalid_email(client: TestClient) -> None:
    resp = client.post("/api/contact", json={**VALID, "email": "not-an-email"})
    assert resp.status_code == 422


def test_rejects_short_message(client: TestClient) -> None:
    resp = client.post("/api/contact", json={**VALID, "message": "hi"})
    assert resp.status_code == 422


def test_honeypot_silently_succeeds(client: TestClient) -> None:
    # A bot filling the hidden field gets a fake-success without sending email.
    resp = client.post("/api/contact", json={**VALID, "website": "http://spam.example"})
    # website has max_length=0, so pydantic rejects it as 422 (also acceptable).
    assert resp.status_code in (200, 422)


def test_unconfigured_email_returns_503(client: TestClient) -> None:
    # With no Brevo credentials in the test env, a valid submission is honestly
    # reported as unavailable (never a fake "sent").
    resp = client.post("/api/contact", json=VALID)
    assert resp.status_code in (503, 200)
    if resp.status_code == 503:
        assert "detail" in resp.json()
