"""NVIDIA NIM chat integration (OpenAI-compatible streaming API).

The API key lives only on the backend. The frontend never sees it.
"""

from __future__ import annotations

import json
from collections.abc import AsyncGenerator

import httpx

from ..config import settings
from .context import SYSTEM_PROMPT


def is_configured() -> bool:
    return bool(settings.nvidia_nim_api_key)


async def stream_chat(messages: list[dict[str, str]]) -> AsyncGenerator[str, None]:
    """Stream assistant tokens from NVIDIA NIM.

    `messages` is the conversation history ([{role, content}, ...]).
    Yields text deltas. Raises httpx.HTTPError on transport failure so the
    caller can fall back gracefully.
    """
    payload = {
        "model": settings.nvidia_nim_model,
        "messages": [{"role": "system", "content": SYSTEM_PROMPT}, *messages],
        "temperature": 0.3,
        "top_p": 0.9,
        "max_tokens": 1024,
        "stream": True,
    }
    headers = {
        "Authorization": f"Bearer {settings.nvidia_nim_api_key}",
        "Accept": "text/event-stream",
        "Content-Type": "application/json",
    }

    url = f"{settings.nvidia_nim_base_url.rstrip('/')}/chat/completions"
    timeout = httpx.Timeout(60.0, connect=10.0)

    async with httpx.AsyncClient(timeout=timeout) as client:
        async with client.stream("POST", url, json=payload, headers=headers) as resp:
            resp.raise_for_status()
            async for line in resp.aiter_lines():
                if not line or not line.startswith("data:"):
                    continue
                chunk = line[len("data:") :].strip()
                if chunk == "[DONE]":
                    break
                try:
                    parsed = json.loads(chunk)
                    delta = parsed["choices"][0]["delta"].get("content")
                    if delta:
                        yield delta
                except (json.JSONDecodeError, KeyError, IndexError):
                    continue
