"""Contact form endpoint with validation, honeypot, and rate limiting."""

from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException, Request

from ..cache import RateLimiter
from ..config import settings
from ..schemas import ContactRequest, ContactResponse
from ..services import brevo

logger = logging.getLogger(__name__)

router = APIRouter(tags=["contact"])

_limiter = RateLimiter(settings.contact_rate_limit, settings.contact_rate_window)


def _client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


@router.post("/contact", response_model=ContactResponse)
async def submit_contact(payload: ContactRequest, request: Request) -> ContactResponse:
    # Honeypot: a filled `website` field means a bot. Pretend success silently.
    if payload.website:
        logger.info("Honeypot triggered from %s", _client_ip(request))
        return ContactResponse(ok=True, message="Message sent successfully.")

    # Rate limit per client IP.
    if not _limiter.allow(_client_ip(request)):
        raise HTTPException(
            status_code=429,
            detail="Too many messages. Please try again in a little while.",
        )

    if not brevo.is_configured():
        # Don't fabricate delivery — tell the user honestly (without internals).
        logger.warning("Contact received but email service is not configured.")
        raise HTTPException(
            status_code=503,
            detail="The contact service isn't available right now. Please email directly.",
        )

    sent = await brevo.send_contact_email(
        name=payload.name,
        email=payload.email,
        subject=payload.subject,
        message=payload.message,
    )
    if not sent:
        raise HTTPException(status_code=502, detail="Something went wrong. Please try again.")

    return ContactResponse(ok=True, message="Message sent successfully.")
