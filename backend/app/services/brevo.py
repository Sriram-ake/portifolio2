"""Brevo (Sendinblue) transactional email integration for the contact form.

Credentials live only on the backend. Returns a boolean success flag; internal
errors are logged, never surfaced to the client verbatim.
"""

from __future__ import annotations

import html
import logging

import httpx

from ..config import settings

logger = logging.getLogger(__name__)

BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email"


def is_configured() -> bool:
    return bool(
        settings.brevo_api_key
        and settings.brevo_sender_email
        and settings.contact_receiver_email
    )


async def send_contact_email(name: str, email: str, subject: str, message: str) -> bool:
    """Send the contact message via Brevo. Returns True on success."""
    if not is_configured():
        logger.warning("Brevo is not configured; contact email not sent.")
        return False

    # Escape every user-supplied field before embedding in HTML email.
    safe_name = html.escape(name)
    safe_email = html.escape(email)
    safe_subject = html.escape(subject)
    safe_message = html.escape(message).replace("\n", "<br>")
    payload = {
        "sender": {"email": settings.brevo_sender_email, "name": settings.brevo_sender_name},
        "to": [{"email": settings.contact_receiver_email}],
        "replyTo": {"email": email, "name": name},
        "subject": f"[Portfolio] {subject}",
        "htmlContent": (
            f"<p><strong>From:</strong> {safe_name} &lt;{safe_email}&gt;</p>"
            f"<p><strong>Subject:</strong> {safe_subject}</p>"
            f"<hr><p>{safe_message}</p>"
        ),
    }
    headers = {
        "api-key": settings.brevo_api_key or "",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=httpx.Timeout(15.0, connect=5.0)) as client:
            resp = await client.post(BREVO_ENDPOINT, json=payload, headers=headers)
            if resp.status_code in (200, 201, 202):
                return True
            logger.error("Brevo send failed: %s %s", resp.status_code, resp.text[:300])
            return False
    except httpx.HTTPError as exc:
        logger.error("Brevo transport error: %s", exc)
        return False
