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
  let record = rateLimitMap.get(ip);

  // If record exists, verify if it's expired
  if (record && now > record.resetTime) {
    // Expired record. Treat as if it doesn't exist, but we reuse the key slot later.
    record = undefined;
    // We will overwrite it, so no need to delete explicitly yet,
    // but to ensure LRU order (newest at end), we should delete it before setting new one.
    rateLimitMap.delete(ip);
  }

  if (!record) {
    // 🛡️ Sentinel: Prevent Memory Exhaustion DoS
    // Only check size if we are adding a truly new key (we already deleted expired one above)
    // Note: If we just deleted an expired key, size decreased by 1, so we are fine.
    // If we didn't find a key, size is whatever it is.

    if (rateLimitMap.size >= MAX_RECORDS) {
      // Sentinel Fix: Use True LRU eviction.
      // The first key in a Map is the "oldest" (least recently inserted/updated).
      const oldestKeyIterator = rateLimitMap.keys().next();

      if (!oldestKeyIterator.done) {
        rateLimitMap.delete(oldestKeyIterator.value);
      }
    }

    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + windowMs
    });
    return true;
  }

  // Record exists and is valid.
  // Move to end of Map to mark as recently used (LRU policy).
  rateLimitMap.delete(ip);
  rateLimitMap.set(ip, record);

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
