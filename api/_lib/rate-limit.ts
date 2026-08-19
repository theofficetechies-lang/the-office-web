/**
 * Simple in-memory rate limiter for Vercel Serverless Functions.
 * Resets on cold start, which is acceptable for a low-traffic studio site.
 * For higher traffic, replace with Redis (e.g., Upstash).
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 5;

function getClientIp(req: {
  headers: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
}): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  if (Array.isArray(forwarded)) {
    return forwarded[0].trim();
  }
  return req.socket?.remoteAddress ?? "unknown";
}

export function rateLimit(req: {
  headers: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
}): {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
} {
  const ip = getClientIp(req);
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetTime) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + WINDOW_MS,
    };
    store.set(ip, newEntry);
    return {
      success: true,
      limit: MAX_REQUESTS,
      remaining: MAX_REQUESTS - 1,
      reset: newEntry.resetTime,
    };
  }

  if (entry.count >= MAX_REQUESTS) {
    return {
      success: false,
      limit: MAX_REQUESTS,
      remaining: 0,
      reset: entry.resetTime,
    };
  }

  entry.count += 1;
  return {
    success: true,
    limit: MAX_REQUESTS,
    remaining: MAX_REQUESTS - entry.count,
    reset: entry.resetTime,
  };
}

// Periodic cleanup to prevent unbounded memory growth
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of store.entries()) {
    if (now > entry.resetTime) {
      store.delete(ip);
    }
  }
}, 60_000);
