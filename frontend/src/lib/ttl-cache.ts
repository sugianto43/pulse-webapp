/**
 * Generic in-process TTL cache, bounded so it can't grow unbounded.
 * Mirrors backend/app/cache.py's TTLCache — same rationale: free-form keys
 * (e.g. ticker symbols) shouldn't let the cache dict grow forever.
 */
export class TtlCache<T> {
  private store = new Map<string, { expiresAt: number; value: T }>();

  constructor(
    private ttlMs: number,
    private maxSize: number,
  ) {}

  get(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;

    if (Date.now() >= entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }

    // refresh recency for LRU eviction
    this.store.delete(key);
    this.store.set(key, entry);
    return entry.value;
  }

  set(key: string, value: T): void {
    this.evictExpired();

    this.store.delete(key);
    this.store.set(key, { expiresAt: Date.now() + this.ttlMs, value });

    while (this.store.size > this.maxSize) {
      const oldestKey = this.store.keys().next().value;
      if (oldestKey === undefined) break;
      this.store.delete(oldestKey);
    }
  }

  private evictExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.store) {
      if (now >= entry.expiresAt) this.store.delete(key);
    }
  }
}
