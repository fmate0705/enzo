import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { ButtonLink } from '@/components/ui/button';
import { primaryNav } from '@/content/navigation';
import { SiteChrome } from '@/components/site/site-chrome';
import { getSite } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Az oldal nem található',
  robots: { index: false, follow: true },
};

/**
 * 404.
 *
 * Gives the visitor somewhere to go rather than an apology: the four
 * destinations, the menu as the primary action, and the phone number — because
 * a decent share of people who hit a dead end on a restaurant site were trying
 * to reach the restaurant.
 */
export default async function NotFound() {
  const site = await getSite();

  return (
    <SiteChrome>
      <div className="relative flex min-h-[75vh] items-center py-32">
        <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(50vw 30rem at 50% 0%, rgb(var(--enzo-ember-rgb) / 0.10), transparent 70%)',
          }}
        />

        <Container className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-display mt-6 text-4xl text-foreground md:text-5xl">
              Ez az oldal <span className="text-primary">nincs meg.</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Lehet, hogy elírás történt a címben, vagy az oldal már nem létezik. Az étlap és az
              elérhetőségek innen egy kattintásra vannak.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/etlap" size="lg">
                Étlap
              </ButtonLink>
              <ButtonLink href="/" variant="outline" size="lg">
                Főoldal
              </ButtonLink>
            </div>

            <nav aria-label="Oldalak" className="mt-14 border-t border-border pt-8">
              <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3">
                {primaryNav.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-primary"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <p className="mt-8 text-sm text-muted">
              Vagy hívjon minket:{' '}
              <a
                href={site.phone.href}
                className="text-foreground underline underline-offset-4 transition-colors hover:text-primary"
              >
                {site.phone.display}
              </a>
            </p>
          </div>
        </Container>
      </div>
    </SiteChrome>
  );
}
