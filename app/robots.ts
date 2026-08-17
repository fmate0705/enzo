import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site-url';

/**
 * Everything on this site is public and worth indexing — there is no account
 * area, no search results page and no faceted URL space to keep crawlers out of.
 * AI crawlers are allowed deliberately: a local restaurant benefits from being
 * quotable when someone asks an assistant where to eat in Hatvan.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/').replace(/\/$/, ''),
  };
}
