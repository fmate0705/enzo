import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Wordmark } from './wordmark';
import { ConsentSettingsButton } from './consent-settings-button';
import { legalNav, primaryNav } from '@/content/navigation';
import { getSite } from '@/lib/site';

/**
 * The footer closes the experience: the mark, the four destinations, everything
 * needed to arrive or order, and the legal shelf.
 *
 * Address, hours, phone and social links all come from the store, so correcting
 * them in the admin corrects them here.
 */
export async function Footer() {
  const site = await getSite();
  const year = new Date().getFullYear();

  // Only profiles that are actually filled in. An empty field produces no link.
  const social = [
    { href: site.links.facebook, label: 'Facebook' },
    { href: site.links.instagram, label: 'Instagram' },
    { href: site.links.foodora, label: 'Foodora' },
  ].filter((item) => item.href);

  return (
    <footer className="relative overflow-hidden border-t border-border bg-surface/30">
      <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />

      <Container className="relative">
        <div className="grid gap-12 py-16 md:grid-cols-2 md:py-20 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Wordmark size="lg" href={null} />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">
              {site.ownDescription}
            </p>
            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
              {social.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-primary"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer navigáció">
            <h2 className="text-xs uppercase tracking-[0.2em] text-primary">Oldalak</h2>
            <ul className="mt-5 space-y-3">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="-my-1 inline-block py-1 text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={site.links.foodora}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary transition-opacity hover:opacity-75"
                >
                  Rendelés Foodorán ↗
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-primary">Elérhetőség</h2>
            <address className="mt-5 space-y-3 not-italic text-sm text-muted">
              <p className="text-foreground">{site.fullAddress}</p>
              <p>
                <a href={site.phone.href} className="transition-colors hover:text-primary">
                  {site.phone.display}
                </a>
              </p>
            </address>
            <a
              href={site.maps.directions}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-xs uppercase tracking-[0.16em] text-primary transition-opacity hover:opacity-75"
            >
              Útvonaltervezés ↗
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-5 border-t border-border py-8 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-muted">
            © {year} {site.name}. Minden jog fenntartva.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-xs text-muted transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <ConsentSettingsButton />
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
