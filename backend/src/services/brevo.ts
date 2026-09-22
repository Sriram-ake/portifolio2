/**
 * Brevo (Sendinblue) transactional email integration for the contact form.
 *
 * Credentials live only on the backend. Returns a boolean success flag; internal
 * errors are logged, never surfaced to the client verbatim.
 */

import { settings } from '../config'

const BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email'

export function isConfigured(): boolean {
  return Boolean(settings.brevoApiKey && settings.brevoSenderEmail && settings.contactReceiverEmail)
}

/** Escape HTML special characters to prevent injection into the email body. */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function sendContactEmail(
  name: string,
  email: string,
  subject: string,
  message: string,
): Promise<boolean> {
  if (!isConfigured()) {
    console.warn('Brevo is not configured; contact email not sent.')
    return false
  }

  // Escape every user-supplied field before embedding in HTML email.
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeSubject = escapeHtml(subject)
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>')

  const payload = {
    sender: { email: settings.brevoSenderEmail, name: settings.brevoSenderName },
    to: [{ email: settings.contactReceiverEmail }],
    replyTo: { email, name },
    subject: `[Portfolio] ${subject}`,
    htmlContent:
      `<p><strong>From:</strong> ${safeName} &lt;${safeEmail}&gt;</p>` +
      `<p><strong>Subject:</strong> ${safeSubject}</p>` +
      `<hr><p>${safeMessage}</p>`,
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15_000)
  try {
    const resp = await fetch(BREVO_ENDPOINT, {
      method: 'POST',
      headers: {
        'api-key': settings.brevoApiKey ?? '',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
    if ([200, 201, 202].includes(resp.status)) return true
    const text = await resp.text().catch(() => '')
    console.error(`Brevo send failed: ${resp.status} ${text.slice(0, 300)}`)
    return false
  } catch (err) {
    console.error('Brevo transport error:', err)
    return false
  } finally {
    clearTimeout(timeout)
  }
}
