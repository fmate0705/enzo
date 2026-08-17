/**
 * Content Security Policy.
 *
 * `script-src` carries 'unsafe-inline' rather than a nonce, and that is a
 * deliberate trade, not an oversight. Nonces have to be minted per request,
 * which requires middleware and turns all 43 routes dynamic — the whole site is
 * currently prerendered static HTML. The exchange is only worth making where
 * there is untrusted input to protect, and there is none here: no forms, no
 * accounts, no query-driven rendering, no user or CMS content. Every byte of
 * markup is fixed at build time.
 *
 * The directives that block the attacks this site can actually face are all
 * strict: `object-src 'none'` and `base-uri 'self'` close the classic injection
 * routes, and `frame-ancestors 'none'` prevents clickjacking.
 *
 * `frame-src` names Google's map hosts because the Megközelítés page embeds a
 * map — but only after the visitor consents. Listing the host here permits the
 * frame; it does not load it.
 *
 * If a form or any user-supplied content is ever added, replace 'unsafe-inline'
 * with a nonce and accept the move to dynamic rendering.
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  // Tailwind ships a stylesheet, but React style props emit inline styles.
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline'",
  'frame-src https://www.google.com https://maps.google.com',
  "connect-src 'self'",
  "manifest-src 'self'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  // Two years, subdomains included, preload-list eligible.
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Redundant with frame-ancestors, kept for browsers that predate CSP level 2.
  { key: 'X-Frame-Options', value: 'DENY' },
  // The site asks for none of these; deny them rather than leave them available.
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
  },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  /*
   * Self-contained server build — required by the deploy Dockerfile, and the
   * default here so a production build is standalone unless someone opts out.
   *
   * The final step of a standalone build symlinks traced dependencies. On
   * Windows that needs Developer Mode or an elevated shell, so a local
   * verification build on a developer machine can fail at the last step with
   * EPERM even though every page compiled. Set NEXT_STANDALONE=0 to skip it
   * locally. The Docker build never sets it, so the deployed image is always
   * standalone.
   */
  output: process.env.NEXT_STANDALONE === '0' ? undefined : 'standalone',

  images: {
    formats: ['image/avif', 'image/webp'],
    // The largest rendered image is the hero at ~620 CSS px on a 2x display.
    deviceSizes: [360, 420, 640, 828, 1080, 1200, 1600, 1920],
  },

  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
