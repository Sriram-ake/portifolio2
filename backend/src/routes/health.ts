/** Health check endpoint. */

import { Router } from 'express'
import * as brevo from '../services/brevo'
import * as nvidia from '../services/nvidia'

export const healthRouter = Router()

healthRouter.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    services: {
      chat: nvidia.isConfigured() ? 'configured' : 'fallback',
      email: brevo.isConfigured() ? 'configured' : 'unconfigured',
    },
    // Per-variable readiness (booleans only, no secret values) so a missing
    // env var can be pinpointed without dashboard access.
    emailConfig: brevo.configStatus(),
  })
})
