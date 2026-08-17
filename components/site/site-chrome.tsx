import { Navbar } from './navbar';
import { Footer } from './footer';
import { CookieConsent } from './cookie-consent';
import { getSite } from '@/lib/site';

/**
 * The public site's frame: header, main landmark, footer, consent notice.
 *
 * Lives here rather than in the root layout so that /admin can opt out of it.
 * An admin panel wrapped in the restaurant's navigation and cookie banner would
 * be both confusing and obstructive — the consent panel sits in the lower
 * corner, exactly where a form's Save button goes.
 *
 * Used by the (site) route group and by the global 404, which is reached from
 * outside that group but still needs to look like the site.
 */
export async function SiteChrome({ children }: { children: React.ReactNode }) {
  const site = await getSite();

  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-sm bg-primary px-4 py-2 font-medium text-primary-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100]"
      >
        Ugrás a tartalomra
      </a>
      <Navbar
        phoneDisplay={site.phone.display}
        phoneHref={site.phone.href}
        foodoraUrl={site.links.foodora}
        fullAddress={site.fullAddress}
        hoursSummary={site.hoursSummary}
      />
      <main id="main">{children}</main>
      <Footer />
      <CookieConsent />
    </>
  );
}
