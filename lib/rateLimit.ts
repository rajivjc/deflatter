// --- Per-IP rate limiting ---
const ipCounts = new Map<string, { count: number; resetAt: number }>();

// --- Global rate limiting (cost ceiling) ---
let globalCount = 0;
let globalResetAt = Date.now() + 86400000;

const IP_DAILY_LIMIT = 15;       // per IP per 24h
const GLOBAL_DAILY_LIMIT = 500;  // total across all users per 24h (resets on cold start)
const WINDOW_MS = 86400000;      // 24 hours

export function checkRateLimit(ip: string): { allowed: boolean; message?: string } {
  const now = Date.now();

  // --- Global ceiling ---
  if (now > globalResetAt) {
    globalCount = 0;
    globalResetAt = now + WINDOW_MS;
  }
  globalCount++;
  if (globalCount > GLOBAL_DAILY_LIMIT) {
    return { allowed: false, message: "DeFlatter is popular today. Try again tomorrow." };
  }

  // --- Per-IP limit ---
  const entry = ipCounts.get(ip);
  if (!entry || now > entry.resetAt) {
    ipCounts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  entry.count++;
  if (entry.count > IP_DAILY_LIMIT) {
    return { allowed: false, message: "Daily limit reached. Come back tomorrow." };
  }

  // --- Cleanup stale entries (prevent memory leak) ---
  if (ipCounts.size > 10000) {
    for (const [key, val] of ipCounts) {
      if (now > val.resetAt) ipCounts.delete(key);
    }
  }

  return { allowed: true };
}
