import { SiteChrome } from '@/components/site/site-chrome';

/**
 * The public site.
 *
 * Everything a visitor sees lives in this route group so it can share the
 * header, footer and consent notice. /admin sits outside the group and gets
 * none of them.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
