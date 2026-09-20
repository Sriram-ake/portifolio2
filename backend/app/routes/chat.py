"""AI assistant chat endpoint (streaming plain-text chunks)."""

from __future__ import annotations

import asyncio
from collections.abc import AsyncGenerator

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from ..schemas import ChatRequest
from ..services import nvidia
from ..services.context import fallback_answer

router = APIRouter(tags=["chat"])


async def _fallback_stream(question: str) -> AsyncGenerator[bytes, None]:
    """Stream the rule-based answer word-by-word for a natural feel."""
    answer = fallback_answer(question)
    for word in answer.split(" "):
        yield (word + " ").encode("utf-8")
        await asyncio.sleep(0.015)


async def _nim_stream(messages: list[dict[str, str]], question: str) -> AsyncGenerator[bytes, None]:
    """Stream from NVIDIA NIM, falling back to the rule-based answer on failure."""
    produced = False
    try:
        async for delta in nvidia.stream_chat(messages):
            produced = True
            yield delta.encode("utf-8")
    except Exception:  # noqa: BLE001 - graceful degradation to rule-based answer
        if not produced:
            async for chunk in _fallback_stream(question):
                yield chunk


@router.post("/chat")
async def chat(request: ChatRequest) -> StreamingResponse:
    messages = [{"role": m.role, "content": m.content} for m in request.messages]
    last_user = next((m["content"] for m in reversed(messages) if m["role"] == "user"), "")

    generator = (
        _nim_stream(messages, last_user)
        if nvidia.is_configured()
        else _fallback_stream(last_user)
    )
    return StreamingResponse(
        generator,
        media_type="text/plain; charset=utf-8",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
