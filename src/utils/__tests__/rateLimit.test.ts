import { describe, it, expect, vi, beforeEach } from 'vitest';
import { rateLimit } from '../rateLimit';

describe('rateLimit', () => {
  beforeEach(() => {
    // Reset any state if necessary. Since rateLimit uses a module-level Map,
    // we might need to rely on using unique IPs for each test or mocking Date.now
    // However, for simplicity, we'll use unique IPs.
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
});
