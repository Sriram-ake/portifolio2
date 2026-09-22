import request from 'supertest'
import { afterAll, describe, expect, it, vi } from 'vitest'
import { app } from '../src/index'
import * as coding from '../src/services/codingService'
import type { CodingPlatformStats } from '../src/types'

afterAll(() => {
  vi.restoreAllMocks()
})

describe('content endpoints', () => {
  it('GET /api/health returns ok with services', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
    expect(res.body).toHaveProperty('services')
  })

  it('GET /api/profile exposes public fields, hides sensitive ones', async () => {
    const res = await request(app).get('/api/profile')
    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Ake Sri Ram')
    expect(res.body.cgpa).toBe('8.36')
    expect(res.body.social.instagram).toBe('https://www.instagram.com/pspk_ram_42/')
    expect(res.body.social.codolio).toContain('codolio.com')
    expect(res.body).not.toHaveProperty('phone')
    expect(res.body).not.toHaveProperty('dateOfBirth')
  })

  it('GET /api/education is ordered with 3 items', async () => {
    const res = await request(app).get('/api/education')
    expect(res.status).toBe(200)
    expect(res.body[0].id).toBe('btech')
    expect(res.body).toHaveLength(3)
  })

  it('GET /api/skills includes the programming category', async () => {
    const res = await request(app).get('/api/skills')
    expect(res.status).toBe(200)
    expect(res.body.some((c: { id: string }) => c.id === 'programming')).toBe(true)
  })

  it('GET /api/projects returns real projects', async () => {
    const res = await request(app).get('/api/projects')
    const titles = res.body.map((p: { title: string }) => p.title)
    expect(titles).toContain('Calculator')
    const calc = res.body.find((p: { title: string }) => p.title === 'Calculator')
    expect(calc.githubUrl.startsWith('https://github.com/Sriram-ake/')).toBe(true)
  })

  it('GET /api/certifications comes from the resume', async () => {
    const res = await request(app).get('/api/certifications')
    const titles = res.body.map((c: { title: string }) => c.title)
    expect(titles).toContain('C Programming')
    expect(res.body.some((c: { issuer: string }) => c.issuer === 'Cisco')).toBe(true)
  })
})

describe('coding endpoints', () => {
  it('GET /api/coding/notaplatform is 404', async () => {
    const res = await request(app).get('/api/coding/notaplatform')
    expect(res.status).toBe(404)
  })

  it('GET /api/coding/codechef/heatmap is 404 (unsupported)', async () => {
    const res = await request(app).get('/api/coding/codechef/heatmap')
    expect(res.status).toBe(404)
  })

  it('GET /api/coding serializes with camelCase displayName (fetchers mocked)', async () => {
    const fake = (): Promise<CodingPlatformStats> =>
      Promise.resolve({
        platform: 'github',
        displayName: 'GitHub',
        profileUrl: 'https://github.com/x',
        username: 'x',
        status: 'ok',
        updatedAt: new Date().toISOString(),
        stats: [{ label: 'Repositories', value: 1 }],
      })
    const spy = vi.spyOn(coding, 'getSummary').mockResolvedValue({
      platforms: [await fake()],
      updatedAt: new Date().toISOString(),
    })
    const res = await request(app).get('/api/coding')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('platforms')
    expect(res.body.platforms[0].displayName).toBeTruthy()
    spy.mockRestore()
  })
})

describe('github proxy validation', () => {
  it('rejects a bad repo identifier with 400', async () => {
    const res = await request(app).get('/api/github/repos/own%20er/repo/commits')
    expect(res.status).toBe(400)
  })
})

describe('contact validation', () => {
  it('rejects an invalid email with 422', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'T', email: 'bad', subject: 'Hi', message: 'This is a test message.' })
    expect(res.status).toBe(422)
  })

  it('returns 503 when email service is unconfigured (valid payload)', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({
        name: 'Test User',
        email: 't@example.com',
        subject: 'Hello',
        message: 'This is a valid test message.',
      })
    // No BREVO_* env in tests → service unconfigured.
    expect(res.status).toBe(503)
  })

  it('silently accepts a honeypot submission', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({
        name: 'Bot',
        email: 'bot@example.com',
        subject: 'spam',
        message: 'buy now buy now',
        website: 'http://spam.example',
      })
    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)
  })
})
