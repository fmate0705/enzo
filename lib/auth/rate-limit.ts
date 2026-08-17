import 'server-only';

/**
 * Login throttling.
 *
 * An in-process fixed window, keyed by client IP. It is deliberately modest:
 * the site runs as a single container, so a map in memory is the whole
 * requirement — a shared store would mean running Redis to rate-limit one
 * person's login form.
 *
 * What it is for: making an online password-guessing run impractical. scrypt
 * already costs ~100 ms per attempt, and five attempts per fifteen minutes
 * turns "guess overnight" into "do not bother". It is not a defence against a
 * distributed attacker with many source addresses — against that, the password
 * strength and the hash cost are what matter, which is why the setup script
 * refuses short passwords.
 *
 * State resets when the process restarts. That is acceptable here: a restart is
 * an operator action, not something an attacker can trigger.
 */

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/** Drops expired buckets so a long-lived process cannot grow the map forever. */
function sweep(now: number): void {
  if (buckets.size < 512) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function checkLoginRate(key: string): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, retryAfterSeconds: 0 };
  }

  if (existing.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: MAX_ATTEMPTS - existing.count,
    retryAfterSeconds: 0,
  };
}

/** Clears the bucket after a success, so one good login restores the allowance. */
export function clearLoginRate(key: string): void {
  buckets.delete(key);
}

/**
 * Best-effort client identity.
 *
 * `x-forwarded-for` is attacker-controlled unless a trusted proxy sets it. The
 * deployment runs behind Traefik, which does. If the header is absent the key
 * falls back to a constant, which makes the limit global rather than per-client
 * — stricter, not weaker, which is the right way for this to fail.
 */
export function clientKey(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  const first = forwarded?.split(',')[0]?.trim();
  return first && first.length <= 45 ? first : 'unknown';
}
