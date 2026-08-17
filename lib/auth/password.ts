import 'server-only';

import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number,
  options: { N: number; r: number; p: number; maxmem: number },
) => Promise<Buffer>;

/**
 * Password hashing with scrypt from the Node standard library.
 *
 * scrypt is memory-hard and ships with Node, so there is no native module to
 * compile into the Docker image and no dependency to keep patched. bcrypt and
 * argon2 are both fine choices; neither is worth a native build step for a
 * single-operator login.
 *
 * Parameters follow the current OWASP guidance for scrypt (N = 2^16, r = 8,
 * p = 1), which costs roughly 64 MB and ~100 ms per verification — slow enough
 * to make offline cracking expensive, fast enough for a login form.
 */
const N = 2 ** 16;
const R = 8;
const P = 1;
const KEY_LENGTH = 64;
const MAX_MEM = 128 * N * R * 2;

/**
 * Encoded as `scrypt:N:r:p:salt:hash`, salt and hash base64url.
 *
 * Self-describing, so the cost parameters can be raised later without
 * invalidating existing hashes.
 *
 * The separator is `:` rather than the conventional `$` of a PHC string, and
 * that is deliberate: this value lives in `.env`, and Next runs dotenv-expand
 * over those files. A `$` there is variable interpolation — `scrypt$65536$8$1$…`
 * loses `$8` and `$1` to empty expansions before the app ever sees it, and the
 * result is a login that rejects the correct password with no error anywhere.
 * `:` has no meaning to dotenv and is outside the base64url alphabet, so it
 * stays an unambiguous separator. Asserted in tests/store.test.ts.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(32);
  const derived = await scryptAsync(password.normalize('NFKC'), salt, KEY_LENGTH, {
    N,
    r: R,
    p: P,
    maxmem: MAX_MEM,
  });
  return ['scrypt', N, R, P, salt.toString('base64url'), derived.toString('base64url')].join(':');
}

/**
 * Verifies a password against a stored hash.
 *
 * Returns false rather than throwing on a malformed hash: a broken
 * ADMIN_PASSWORD_HASH must fail the login, not surface a stack trace that tells
 * an attacker how the secret is stored.
 */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  try {
    // Accept `$` too, so a hash generated before the separator changed still
    // verifies — provided it reached the process intact.
    const [scheme, n, r, p, saltB64, hashB64] = stored.split(stored.includes(':') ? ':' : '$');
    if (scheme !== 'scrypt' || !n || !r || !p || !saltB64 || !hashB64) return false;

    const salt = Buffer.from(saltB64, 'base64url');
    const expected = Buffer.from(hashB64, 'base64url');
    const cost = Number(n);
    const blockSize = Number(r);
    const parallel = Number(p);
    if (!Number.isFinite(cost) || !Number.isFinite(blockSize) || !Number.isFinite(parallel)) {
      return false;
    }

    const derived = await scryptAsync(password.normalize('NFKC'), salt, expected.length, {
      N: cost,
      r: blockSize,
      p: parallel,
      maxmem: 128 * cost * blockSize * 2,
    });

    // Constant-time: comparing with === leaks how many leading bytes matched.
    return derived.length === expected.length && timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}
