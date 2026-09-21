import { describe, expect, it } from 'vitest'
import { RateLimiter, TTLCache } from '../src/cache'
import { levelFromCount, ok, unavailable } from '../src/scrapers/base'
import { describeEvent } from '../src/scrapers/github'
import { fallbackAnswer } from '../src/services/context'

describe('TTLCache', () => {
  it('stores and returns values', () => {
    const c = new TTLCache<number>(60)
    c.set('a', 1)
    expect(c.get('a')).toBe(1)
    expect(c.get('missing')).toBeNull()
  })

  it('expires entries', () => {
    const c = new TTLCache<number>(-1) // already expired
    c.set('a', 1)
    expect(c.get('a')).toBeNull()
  })

  it('clears', () => {
    const c = new TTLCache<number>(60)
    c.set('a', 1)
    c.clear()
    expect(c.get('a')).toBeNull()
  })
})

describe('RateLimiter', () => {
  it('allows up to the limit then blocks', () => {
    const rl = new RateLimiter(2, 60)
    expect(rl.allow('ip')).toBe(true)
    expect(rl.allow('ip')).toBe(true)
    expect(rl.allow('ip')).toBe(false)
    // Different key is independent.
    expect(rl.allow('other')).toBe(true)
  })
})

describe('levelFromCount', () => {
  it('buckets counts 0-4', () => {
    expect(levelFromCount(0)).toBe(0)
    expect(levelFromCount(1)).toBe(1)
    expect(levelFromCount(4)).toBe(2)
    expect(levelFromCount(100)).toBe(4)
  })
})

describe('coding stat shapes', () => {
  it('ok() has correct shape', () => {
    const r = ok('leetcode', 'u', [{ label: 'Solved', value: 10 }])
    expect(r.status).toBe('ok')
    expect(r.displayName).toBe('LeetCode')
    expect(r.stats[0].value).toBe(10)
  })

  it('unavailable() has correct shape', () => {
    const r = unavailable('github', 'someuser')
    expect(r.status).toBe('unavailable')
    expect(r.platform).toBe('github')
    expect(r.stats).toEqual([])
    expect(r.profileUrl.endsWith('someuser')).toBe(true)
  })
})

describe('describeEvent', () => {
  it('maps a push event with plural commits', () => {
    expect(describeEvent({ type: 'PushEvent', payload: { size: 3 } })).toEqual(['Pushed', '3 commits'])
  })
  it('maps a push event with singular commit', () => {
    expect(describeEvent({ type: 'PushEvent', payload: { size: 1 } })).toEqual(['Pushed', '1 commit'])
  })
  it('maps repository creation', () => {
    expect(describeEvent({ type: 'CreateEvent', payload: { ref_type: 'repository' } })).toEqual([
      'Created repository',
      null,
    ])
  })
  it('maps a star', () => {
    expect(describeEvent({ type: 'WatchEvent', payload: {} })).toEqual(['Starred', null])
  })
  it('skips unknown events', () => {
    expect(describeEvent({ type: 'MemberEvent', payload: {} })).toBeNull()
  })
})

describe('fallbackAnswer', () => {
  it('answers education questions', () => {
    expect(fallbackAnswer('what is your education?').toLowerCase()).toContain('b.tech')
  })
  it('answers skills questions', () => {
    expect(fallbackAnswer('what are your skills?')).toContain('Programming Languages')
  })
  it('points DSA/solved questions at Codolio', () => {
    expect(fallbackAnswer('how many problems have you solved?').toLowerCase()).toContain('codolio')
  })
  it('has a graceful default', () => {
    expect(fallbackAnswer('what is the weather on mars')).toContain("don't have that information")
  })
})
