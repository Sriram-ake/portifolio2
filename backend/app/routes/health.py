"""Health check and service configuration status."""

from __future__ import annotations

from fastapi import APIRouter

from ..services import brevo, nvidia

router = APIRouter(tags=["health"])


@router.get("/health")
async def health() -> dict[str, object]:
    return {
        "status": "ok",
        "services": {
            "chat": "configured" if nvidia.is_configured() else "fallback",
            "email": "configured" if brevo.is_configured() else "unconfigured",
        },
    }
