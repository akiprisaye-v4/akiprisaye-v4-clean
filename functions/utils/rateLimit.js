/**
 * Simple in-memory rate limiter for Cloudflare Functions
 * Note: In production, use Durable Objects or KV for distributed rate limiting
 */

// Store: IP -> { count, resetTime }
const rateLimitStore = new Map();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitStore.entries()) {
    if (data.resetTime < now) {
      rateLimitStore.delete(ip);
    }
  }
}, 5 * 60 * 1000);

/**
 * Check if an IP has exceeded the rate limit
 * @param {string} ip - IP address to check
 * @param {number} maxRequests - Maximum requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Object} { allowed: boolean, remaining: number, resetTime: number }
 */
export function checkRateLimit(ip, maxRequests = 5, windowMs = 60 * 60 * 1000) {
  const now = Date.now();
  const data = rateLimitStore.get(ip);
  
  // No previous requests or window expired
  if (!data || data.resetTime < now) {
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: now + windowMs,
    };
  }
  
  // Within window, check count
  if (data.count < maxRequests) {
    data.count++;
    
    return {
      allowed: true,
      remaining: maxRequests - data.count,
      resetTime: data.resetTime,
    };
  }
  
  // Rate limit exceeded
  return {
    allowed: false,
    remaining: 0,
    resetTime: data.resetTime,
  };
}

/**
 * Reset rate limit for an IP (for testing or admin override)
 */
export function resetRateLimit(ip) {
  rateLimitStore.delete(ip);
}
