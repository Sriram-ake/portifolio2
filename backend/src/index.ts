/** Express application entrypoint. */

import cors from 'cors'
import express, { type NextFunction, type Request, type Response } from 'express'
import { corsOrigins, settings } from './config'
import { chatRouter } from './routes/chat'
import { codingRouter } from './routes/coding'
import { contactRouter } from './routes/contact'
import { contentRouter } from './routes/content'
import { healthRouter } from './routes/health'

export const app = express()

app.disable('x-powered-by')
app.use(express.json({ limit: '64kb' }))

// CORS: explicit allowlist, no credentials, GET/POST only.
app.use(
  cors({
    origin: corsOrigins(),
    credentials: false,
    methods: ['GET', 'POST', 'OPTIONS'],
  }),
)

// Security headers on every response.
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  next()
})

// All API routes are mounted under /api.
const API_PREFIX = '/api'
app.use(API_PREFIX, healthRouter)
app.use(API_PREFIX, contentRouter)
app.use(API_PREFIX, codingRouter)
app.use(API_PREFIX, chatRouter)
app.use(API_PREFIX, contactRouter)

app.get('/', (_req, res) => {
  res.json({ name: settings.appName, health: '/api/health' })
})

// Never leak internal error details to clients.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  console.error(`Unhandled error on ${req.method} ${req.path}:`, err)
  if (res.headersSent) return
  res.status(500).json({ detail: 'Internal server error.' })
})

// Start the server only when run directly (not when imported by tests).
if (require.main === module) {
  app.listen(settings.port, '0.0.0.0', () => {
    console.log(`${settings.appName} listening on http://0.0.0.0:${settings.port}`)
  })
}
