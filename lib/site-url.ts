/** The site's public origin. Override per environment with NEXT_PUBLIC_SITE_URL. */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://enzodinapoli.hu';

/** Builds an absolute URL for a site-relative path. */
export function absoluteUrl(path = '/'): string {
  return new URL(path, siteUrl).toString();
}
