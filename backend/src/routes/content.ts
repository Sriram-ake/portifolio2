/** Static portfolio content endpoints (profile, education, skills, projects, certs) + GitHub. */

import { Router } from 'express'
import { CERTIFICATIONS, EDUCATION, PROFILE, PROJECTS, SKILLS } from '../data'
import * as coding from '../services/codingService'

export const contentRouter = Router()

const wantsForce = (v: unknown): boolean => v === 'true' || v === '1'

contentRouter.get('/profile', (_req, res) => {
  // Sensitive fields (phone, dateOfBirth) are intentionally not part of Profile.
  res.json(PROFILE)
})

contentRouter.get('/education', (_req, res) => {
  res.json(EDUCATION)
})

contentRouter.get('/skills', (_req, res) => {
  res.json(SKILLS)
})

contentRouter.get('/projects', (_req, res) => {
  res.json(PROJECTS)
})

contentRouter.get('/certifications', (_req, res) => {
  res.json(CERTIFICATIONS)
})

contentRouter.get('/github/repos', async (req, res, next) => {
  try {
    res.json(await coding.getRepos(wantsForce(req.query.force)))
  } catch (err) {
    next(err)
  }
})

contentRouter.get('/github/activity', async (req, res, next) => {
  try {
    res.json(await coding.getActivity(wantsForce(req.query.force)))
  } catch (err) {
    next(err)
  }
})

// GitHub owner/repo names: letters, digits, hyphen, underscore, dot only.
const GH_NAME_RE = /^[A-Za-z0-9._-]{1,100}$/

contentRouter.get('/github/repos/:owner/:repo/commits', async (req, res, next) => {
  try {
    const { owner, repo } = req.params
    // Guard the proxied path segments so nothing but a plain owner/repo reaches GitHub.
    if (!GH_NAME_RE.test(owner) || !GH_NAME_RE.test(repo)) {
      res.status(400).json({ detail: 'Invalid repository identifier.' })
      return
    }
    res.json(await coding.getCommits(owner, repo, wantsForce(req.query.force)))
  } catch (err) {
    next(err)
  }
})
