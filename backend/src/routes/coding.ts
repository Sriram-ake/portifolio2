/** Coding statistics endpoints. */

import { Router } from 'express'
import * as coding from '../services/codingService'

export const codingRouter = Router()

const VALID = new Set(['github', 'leetcode', 'codechef', 'hackerrank', 'geeksforgeeks', 'codeforces'])
const HEATMAP_VALID = new Set(['github', 'leetcode'])

const wantsForce = (v: unknown): boolean => v === 'true' || v === '1'

codingRouter.get('/coding', async (req, res, next) => {
  try {
    res.json(await coding.getSummary(wantsForce(req.query.force)))
  } catch (err) {
    next(err)
  }
})

codingRouter.get('/coding/:platform/heatmap', async (req, res, next) => {
  try {
    const { platform } = req.params
    if (!HEATMAP_VALID.has(platform)) {
      res.status(404).json({ detail: `No activity heatmap for platform '${platform}'.` })
      return
    }
    res.json(await coding.getHeatmap(platform, wantsForce(req.query.force)))
  } catch (err) {
    next(err)
  }
})

codingRouter.get('/coding/:platform', async (req, res, next) => {
  try {
    const { platform } = req.params
    if (!VALID.has(platform)) {
      res.status(404).json({ detail: `Unknown platform '${platform}'.` })
      return
    }
    res.json(await coding.getPlatform(platform, wantsForce(req.query.force)))
  } catch (err) {
    next(err)
  }
})
