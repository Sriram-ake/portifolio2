/** Contact form endpoint with validation, honeypot, and rate limiting. */

import { Router, type Request } from 'express'
import { RateLimiter } from '../cache'
import { settings } from '../config'
import * as brevo from '../services/brevo'

export const contactRouter = Router()

const limiter = new RateLimiter(settings.contactRateLimit, settings.contactRateWindow)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface ContactPayload {
  name: string
  email: string
  subject: string
  message: string
  website?: string
}

function clientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length) return forwarded.split(',')[0].trim()
  return req.ip ?? 'unknown'
}

/** Validate + normalize. Returns the clean payload or a validation error message. */
function validate(body: unknown): { ok: true; value: ContactPayload } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Invalid request body.' }
  const b = body as Record<string, unknown>

  const website = typeof b.website === 'string' ? b.website : ''
  const name = (typeof b.name === 'string' ? b.name : '').trim()
  const email = (typeof b.email === 'string' ? b.email : '').trim()
  const subject = (typeof b.subject === 'string' ? b.subject : '').trim()
  const message = (typeof b.message === 'string' ? b.message : '').trim()

  if (website.length > 0) return { ok: true, value: { name, email, subject, message, website } }
  if (name.length < 1 || name.length > 100) return { ok: false, error: 'Name is required.' }
  if (email.length < 3 || email.length > 254 || !EMAIL_RE.test(email))
    return { ok: false, error: 'Invalid email address.' }
  if (subject.length < 1 || subject.length > 150) return { ok: false, error: 'Subject is required.' }
  if (message.length < 10 || message.length > 2000)
    return { ok: false, error: 'Message must be between 10 and 2000 characters.' }

  return { ok: true, value: { name, email, subject, message, website } }
}

contactRouter.post('/contact', async (req, res, next) => {
  try {
    const result = validate(req.body)
    if (!result.ok) {
      res.status(422).json({ detail: result.error })
      return
    }
    const payload = result.value

    // Honeypot: a filled `website` field means a bot. Pretend success silently.
    if (payload.website) {
      console.info(`Honeypot triggered from ${clientIp(req)}`)
      res.json({ ok: true, message: 'Message sent successfully.' })
      return
    }

    if (!limiter.allow(clientIp(req))) {
      res.status(429).json({ detail: 'Too many messages. Please try again in a little while.' })
      return
    }

    if (!brevo.isConfigured()) {
      console.warn('Contact received but email service is not configured.')
      res.status(503).json({
        detail: "The contact service isn't available right now. Please email directly.",
      })
      return
    }

    const sent = await brevo.sendContactEmail(
      payload.name,
      payload.email,
      payload.subject,
      payload.message,
    )
    if (!sent) {
      res.status(502).json({ detail: 'Something went wrong. Please try again.' })
      return
    }

    res.json({ ok: true, message: 'Message sent successfully.' })
  } catch (err) {
    next(err)
  }
})
