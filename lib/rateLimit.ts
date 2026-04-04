const ipCounts = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string): { allowed: boolean; message?: string } {
  const now = Date.now();
  const entry = ipCounts.get(ip);

  if (!entry || now > entry.resetAt) {
    ipCounts.set(ip, { count: 1, resetAt: now + 86400000 }); // 24h window
    return { allowed: true };
  }

  entry.count++;

  if (entry.count > 10) {
    return { allowed: false, message: "Daily limit reached. Come back tomorrow." };
  }

  return { allowed: true };
}
