#!/usr/bin/env node
/**
 * Generates the admin credentials for .env.
 *
 *   node scripts/admin-credentials.mjs "a strong passphrase here"
 *
 * Prints ADMIN_PASSWORD_HASH and AUTH_SECRET. Nothing is written to disk and
 * nothing is stored — paste the output into .env yourself. The plaintext
 * password is never persisted anywhere by this project.
 *
 * The password is taken as an argument rather than prompted because the prompt
 * would need a TTY this often does not have. That does put it in shell history:
 * on a shared machine, clear it afterwards.
 */

import { randomBytes, scrypt } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

// Must match lib/auth/password.ts.
const N = 2 ** 16;
const R = 8;
const P = 1;
const KEY_LENGTH = 64;

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/admin-credentials.mjs "your password"');
  process.exit(1);
}

if (password.length < 12) {
  // The rate limiter slows online guessing; only length defeats an offline
  // attack on a leaked hash. Twelve characters is the floor, not a target.
  console.error('Password must be at least 12 characters. Longer is better than more complex.');
  process.exit(1);
}

const salt = randomBytes(32);
const derived = await scryptAsync(password.normalize('NFKC'), salt, KEY_LENGTH, {
  N,
  r: R,
  p: P,
  maxmem: 128 * N * R * 2,
});

// `:` not `$` — dotenv-expand would eat `$1`/`$8` out of the value in .env.
// See lib/auth/password.ts.
const hash = ['scrypt', N, R, P, salt.toString('base64url'), derived.toString('base64url')].join(
  ':',
);
const secret = randomBytes(48).toString('base64url');

console.log(`
Add these to .env — never commit that file.

ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=${hash}
AUTH_SECRET=${secret}

Changing AUTH_SECRET signs every existing session out immediately.
`);
