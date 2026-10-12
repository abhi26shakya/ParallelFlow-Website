// Best-effort per-IP limiter held in server memory. Each server instance
// counts separately and a restart resets it, so this slows simple bots but is
// not a hard guarantee. Add a CAPTCHA if abuse appears.

const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const attempts = new Map<string, number[]>();

export function isRateLimited(key: string, now: number): boolean {
  const recent = (attempts.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_ATTEMPTS) {
    attempts.set(key, recent);
    return true;
  }
  recent.push(now);
  attempts.set(key, recent);

  if (attempts.size > 5000) {
    for (const [k, times] of attempts) {
      if (times.every((t) => now - t >= WINDOW_MS)) attempts.delete(k);
    }
  }
  return false;
}
