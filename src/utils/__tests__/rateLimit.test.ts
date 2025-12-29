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

  it('should clear the map when MAX_RECORDS is exceeded', () => {
    // Fill the map to the limit (assuming limit is 10000)
    // We'll verify the logic by forcing size check.
    // Note: Creating 10000 entries in a test might be slow, but let's try a smaller batch
    // and spy on console.warn or just trust the logic if we could mock the size check.
    // Since we can't easily mock internal constant MAX_RECORDS, we will simulate filling it.

    // Actually, generating 10,000 strings is fast in JS.
    const MAX = 10000;

    // Fill up to MAX - 1
    for (let i = 0; i < MAX; i++) {
        rateLimitMap.set(`ip-${i}`, { count: 1, resetTime: Date.now() + 1000 });
    }

    expect(rateLimitMap.size).toBe(MAX);

    // Next request should trigger clear because size >= MAX (logic is if size >= MAX_RECORDS)
    // Wait, the logic is:
    // if (!record || now > record.resetTime) {
    //   if (rateLimitMap.size >= MAX_RECORDS) { clear() }
    //   set()
    // }

    // So if we have MAX items, next UNIQUE ip will trigger clear.
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = rateLimit('unique-ip', 5, 1000);

    expect(consoleSpy).toHaveBeenCalledWith('Rate limit map full, clearing to prevent OOM.');
    expect(rateLimitMap.size).toBe(1); // Should be 1 (the new unique-ip)
    expect(result).toBe(true);

    consoleSpy.mockRestore();
  });
});
