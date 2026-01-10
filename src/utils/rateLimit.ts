export type RateLimitRecord = {
  count: number;
  resetTime: number;
};

// Export map for testing purposes
export const rateLimitMap = new Map<string, RateLimitRecord>();

// 🛡️ Sentinel: Maximum number of records to keep in memory to prevent DoS via memory exhaustion
const MAX_RECORDS = 10000;

/**
 * Rate limiter function.
 * @param ip - The IP address to check.
 * @param limit - The maximum number of requests allowed within the window.
 * @param windowMs - The time window in milliseconds.
 * @returns true if the request is allowed, false if the limit is exceeded.
 */
export function rateLimit(ip: string, limit: number = 5, windowMs: number = 60 * 1000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    // 🛡️ Sentinel: Prevent Memory Exhaustion DoS
    if (rateLimitMap.size >= MAX_RECORDS) {
      // Sentinel Fix: Use LRU eviction instead of clearing the whole map
      // This prevents an attacker from flushing the map to bypass rate limits
      const oldestKeyIterator = rateLimitMap.keys().next();

      if (!oldestKeyIterator.done) {
        rateLimitMap.delete(oldestKeyIterator.value);
      } else {
        // Fallback if map is somehow empty but size > MAX_RECORDS (shouldn't happen)
        rateLimitMap.clear();
      }
    }

    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + windowMs
    });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count += 1;
  return true;
}

// Cleanup periodically to avoid memory leaks
// We use a global interval check to prevent setting multiple intervals in dev HMR
if (typeof global.rateLimitInterval === 'undefined') {
  global.rateLimitInterval = setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of rateLimitMap.entries()) {
      if (now > record.resetTime) {
        rateLimitMap.delete(ip);
      }
    }
  }, 60 * 1000);
}

// Declare global type for the interval to avoid TS errors
declare global {
  var rateLimitInterval: NodeJS.Timeout | undefined;
}
