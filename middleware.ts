import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth/session';

/**
 * Guards /admin and tightens the policy there.
 *
 * Two jobs:
 *
 * 1. **Route protection.** An unauthenticated request to any /admin page is
 *    redirected to the login screen. This is a convenience gate, not the
 *    security boundary — middleware protects navigation, and a Server Action is
 *    reachable by POST no matter which page the caller claims to be on. Every
 *    mutation calls `requireSession()` itself; see lib/auth/session.ts.
 *
 * 2. **A stricter CSP for /admin.** The public site ships a static, form-free,
 *    input-free set of pages and can afford `script-src 'unsafe-inline'`
 *    (reasoned through in next.config.mjs). The admin has forms, a session
 *    cookie and an authenticated writer, so it gets a per-request nonce instead
 *    — the trade that made no sense on 43 prerendered pages is obviously worth
 *    it on the handful of routes that can change the site.
 */
export const config = {
  matcher: ['/admin/:path*'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === '/admin/belepes';

  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value).catch(
    // A missing or malformed AUTH_SECRET throws. Treat that as "not signed in"
    // rather than a 500 — the operator gets the login screen and its message.
    () => null,
  );

  if (!session && !isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/belepes';
    url.search = '';
    // Where to return to after signing in. Only ever a path on this site.
    if (pathname !== '/admin') url.searchParams.set('tovabb', pathname);
    return NextResponse.redirect(url);
  }

  if (session && isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    url.search = '';
    return NextResponse.redirect(url);
  }

  const nonce = crypto.randomUUID().replace(/-/g, '');

  /*
   * The root layout ships one hand-written inline script — the `js` flag that
   * the reveal animations key off. Next applies the nonce to its own scripts
   * but not to that one, so it is allowed by hash instead. The script is a
   * fixed literal, so the hash is stable; it is asserted in tests/csp.test.ts
   * so an edit to the script cannot silently break the admin.
   */
  const JS_FLAG_HASH = "'sha256-Du+OJKJSbdUgz5nrHeWWINvez6XKDDU/tyj/5c2uvwo='";

  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    `script-src 'self' 'nonce-${nonce}' ${JS_FLAG_HASH} 'strict-dynamic'`,
    "connect-src 'self'",
    "frame-src 'none'",
  ].join('; ');

  const headers = new Headers(request.headers);
  headers.set('x-nonce', nonce);

  const response = NextResponse.next({ request: { headers } });
  response.headers.set('Content-Security-Policy', csp);
  // Admin pages are per-session and must never be held by a shared cache.
  response.headers.set('Cache-Control', 'no-store, must-revalidate');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}
