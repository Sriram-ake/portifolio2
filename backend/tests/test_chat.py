"""Tests for the chat endpoint and grounded fallback responder."""

from __future__ import annotations

from fastapi.testclient import TestClient

from app.services.context import fallback_answer


def test_fallback_answers_about_profile() -> None:
    answer = fallback_answer("Who is Sri Ram?")
    assert "Ake Sri Ram" in answer or "Information Technology" in answer


def test_fallback_education() -> None:
    answer = fallback_answer("Where does he study?")
    assert "Aditya" in answer
    assert "8.36" in answer


def test_fallback_contact() -> None:
    answer = fallback_answer("How can I contact him?")
    assert "akesurekha@gmail.com" in answer


def test_fallback_no_hallucination() -> None:
    # Something not in the portfolio → must decline, not invent.
    answer = fallback_answer("What car does he drive and what is his salary?")
    assert "don't have that information" in answer.lower()


def test_chat_endpoint_streams(client: TestClient) -> None:
    resp = client.post(
        "/api/chat",
        json={"messages": [{"role": "user", "content": "Tell me about Sri Ram"}]},
    )
    assert resp.status_code == 200
    assert resp.text.strip() != ""


def test_chat_validation_rejects_empty(client: TestClient) -> None:
    resp = client.post("/api/chat", json={"messages": []})
    assert resp.status_code == 422
