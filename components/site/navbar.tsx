'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Container } from '@/components/ui/container';
import { ExternalButtonLink } from '@/components/ui/button';
import { MobileNav } from './mobile-nav';
import { Brandmark } from './brandmark';
import { primaryNav } from '@/content/navigation';
import { cn } from '@/lib/cn';

/**
 * The site header.
 *
 * At the top of a page it is a transparent band sitting over the hero. Past the
 * first screenful the ground fills in behind it, a hairline appears, and the
 * ordering action changes from an outline to a filled brass button — the further
 * you are from the hero, the harder the header works to keep the primary action
 * available.
 *
 * The bar's HEIGHT is deliberately constant. A header that shrinks on scroll
 * reflows everything inside it — the logo, the wordmark, the nav rail all move
 * — and the page appears to twitch at the exact moment the reader is trying to
 * read. Only colour, border and blur cross-fade here; nothing changes size or
 * position.
 *
 * The state is a single boolean, so there is one class change per scroll
 * crossing rather than a value recomputed on every frame.
 */
export interface NavbarProps {
  phoneDisplay: string;
  phoneHref: string;
  foodoraUrl: string;
  fullAddress: string;
  hoursSummary: string;
}

export function Navbar({
  phoneDisplay,
  phoneHref,
  foodoraUrl,
  fullAddress,
  hoursSummary,
}: NavbarProps) {
  const [condensed, setCondensed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 72);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      data-condensed={condensed ? '' : undefined}
      className={cn(
        'fixed inset-x-0 top-0 z-50',
        'transition-[background-color,border-color,backdrop-filter] duration-slow ease-standard',
        condensed
          ? 'border-b border-border/70 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <Container wide>
        {/* Fixed height at every scroll position — see the note above. */}
        <div className="flex h-20 items-center justify-between gap-6 md:h-24">
          <Brandmark />

          <nav aria-label="Fő navigáció" className="hidden md:block">
            <ul className="flex items-center gap-9">
              {primaryNav.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'nav-link text-xs uppercase tracking-[0.18em]',
                        active ? 'text-primary' : 'text-foreground/85 hover:text-foreground',
                      )}
                    >
                      {/* Two stacked copies; the pair slides on hover so the
                          label lifts out and its twin arrives from below. */}
                      <span className="nav-link__mask">
                        <span className="nav-link__line">{item.label}</span>
                        <span aria-hidden="true" className="nav-link__line">
                          {item.label}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={phoneHref}
              className="hidden text-xs uppercase tracking-[0.18em] text-foreground/85 transition-colors hover:text-primary lg:block"
            >
              {phoneDisplay}
            </a>
            <ExternalButtonLink
              href={foodoraUrl}
              size="sm"
              variant={condensed ? 'primary' : 'outline'}
              label="Rendelés a Foodorán — új lapon nyílik meg"
              className="hidden sm:inline-flex"
            >
              Rendelés
            </ExternalButtonLink>
            <MobileNav
              phoneDisplay={phoneDisplay}
              phoneHref={phoneHref}
              foodoraUrl={foodoraUrl}
              fullAddress={fullAddress}
              hoursSummary={hoursSummary}
            />
          </div>
        </div>
      </Container>
    </header>
  );
}
