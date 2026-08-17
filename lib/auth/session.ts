import { cookies } from 'next/headers';
import { jwtVerify, SignJWT, type JWTPayload } from 'jose';

/**
 * The admin session.
 *
 * A short-lived HS256 JWT in an httpOnly cookie. Chosen over a server-side
 * session table because there is no database and one operator: the token is the
 * session, and its eight-hour lifetime bounds the damage if it leaks.
 *
 * Signed and verified with `jose` rather than a hand-rolled HMAC. JWT
 * verification is where algorithm-confusion and timing bugs live, and this is
 * the one place in the project where getting it subtly wrong hands over write
 * access to the site.
 *
 * The cookie is:
 * - httpOnly — script cannot read it, so an XSS bug cannot exfiltrate the session
 * - SameSite=Strict — it is not sent on any cross-site navigation, which is what
 *   stops a third-party page driving a logged-in admin's browser into a mutation
 * - Secure in production — never sent over plain HTTP
 * - path=/admin-scoped only for the API it needs; kept at / so the login
 *   redirect and logout work from anywhere on the site
 */

export const SESSION_COOKIE = 'enzo_admin_session';
const ISSUER = 'enzo-di-napoli';
const AUDIENCE = 'enzo-admin';
const MAX_AGE_SECONDS = 60 * 60 * 8;

export interface AdminSession extends JWTPayload {
  sub: string;
}

/**
 * The signing key.
 *
 * Read lazily so that a missing secret fails at the moment of use with a clear
 * message, rather than crashing the whole server at import time — the public
 * site must keep serving even if the admin is misconfigured.
 */
function secretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      'AUTH_SECRET is missing or shorter than 32 characters. Generate one with "pnpm run admin:secret".',
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(username: string): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(username)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secretKey());
}

/** Verifies a token. Returns null for anything that does not check out. */
export async function verifySessionToken(token: string | undefined): Promise<AdminSession | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      issuer: ISSUER,
      audience: AUDIENCE,
      // Pinning the algorithm is what prevents an attacker swapping alg to
      // "none" or to an asymmetric scheme and forging a token.
      algorithms: ['HS256'],
    });
    if (typeof payload.sub !== 'string' || payload.sub === '') return null;
    return payload as AdminSession;
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'strict' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  };
}

/** The current admin session, or null. Use in server components and actions. */
export async function getSession(): Promise<AdminSession | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/**
 * Asserts an authenticated admin.
 *
 * Every server action that writes calls this first. Middleware already blocks
 * unauthenticated navigation to /admin, but middleware protects routes, not
 * actions — a server action is reachable by POST regardless of which page the
 * caller claims to be on, so the check has to be at the mutation itself.
 */
export async function requireSession(): Promise<AdminSession> {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  return session;
}
