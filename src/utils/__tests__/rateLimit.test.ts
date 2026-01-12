import { describe, it, expect, vi, beforeEach } from 'vitest';
import { rateLimit, rateLimitMap } from '../rateLimit';

describe('rateLimit', () => {
  beforeEach(() => {
    rateLimitMap.clear();
  });

  it('should allow requests under the limit', () => {
    const ip = '1.2.3.4';
    expect(rateLimit(ip, 3, 1000)).toBe(true);
    expect(rateLimit(ip, 3, 1000)).toBe(true);
    expect(rateLimit(ip, 3, 1000)).toBe(true);
  });

  it('should block requests over the limit', () => {
    const ip = '5.6.7.8';
    expect(rateLimit(ip, 2, 1000)).toBe(true);
    expect(rateLimit(ip, 2, 1000)).toBe(true);
    expect(rateLimit(ip, 2, 1000)).toBe(false);
  });

  it('should reset after the window expires', async () => {
    const ip = '9.10.11.12';
    const windowMs = 100;

    expect(rateLimit(ip, 1, windowMs)).toBe(true);
    expect(rateLimit(ip, 1, windowMs)).toBe(false);

    // Wait for window to expire
    await new Promise(resolve => setTimeout(resolve, windowMs + 10));

    expect(rateLimit(ip, 1, windowMs)).toBe(true);
  });

  it('should evict only the oldest record when MAX_RECORDS is exceeded', () => {
    // Fill the map to the limit (assuming limit is 10000)
    const MAX = 10000;

    // Fill up to MAX
    for (let i = 0; i < MAX; i++) {
        rateLimitMap.set(`ip-${i}`, { count: 1, resetTime: Date.now() + 1000 });
    }

    expect(rateLimitMap.size).toBe(MAX);
    expect(rateLimitMap.has('ip-0')).toBe(true);

    // Next unique request should trigger LRU eviction (remove oldest: ip-0)
    const result = rateLimit('unique-ip', 5, 1000);

    // Check size is still MAX (evicted 1, added 1)
    expect(rateLimitMap.size).toBe(MAX);

    // Check that 'ip-0' (oldest) is gone
    expect(rateLimitMap.has('ip-0')).toBe(false);

    // Check that 'unique-ip' is added
    expect(rateLimitMap.has('unique-ip')).toBe(true);

    // Check that 'ip-1' (next oldest) is still there
    expect(rateLimitMap.has('ip-1')).toBe(true);

    expect(result).toBe(true);
  });
});
