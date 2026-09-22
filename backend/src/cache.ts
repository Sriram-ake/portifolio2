/**
 * Tiny in-memory TTL cache and fixed-window rate limiter.
 *
 * Dependency-free. Sufficient for a single-instance deployment; swap for Redis
 * if the app is scaled horizontally. (Node is single-threaded per process, so
 * no explicit locking is needed.)
 */

export class TTLCache<T> {
  private ttlMs: number
  private store = new Map<string, { expiresAt: number; value: T }>()

  constructor(ttlSeconds: number) {
    this.ttlMs = ttlSeconds * 1000
  }

  get(key: string): T | null {
    const entry = this.store.get(key)
    if (!entry) return null
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return null
    }
    return entry.value
  }

  set(key: string, value: T): void {
    this.store.set(key, { expiresAt: Date.now() + this.ttlMs, value })
  }

  clear(): void {
    this.store.clear()
  }
}

/** Fixed-window per-key rate limiter. */
export class RateLimiter {
  private limit: number
  private windowMs: number
  private hits = new Map<string, number[]>()

  constructor(limit: number, windowSeconds: number) {
    this.limit = limit
    this.windowMs = windowSeconds * 1000
  }

  allow(key: string): boolean {
    const now = Date.now()
    const recent = (this.hits.get(key) ?? []).filter((t) => now - t < this.windowMs)
    if (recent.length >= this.limit) {
      this.hits.set(key, recent)
      return false
    }
    recent.push(now)
    this.hits.set(key, recent)
    return true
  }
}
