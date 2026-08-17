import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { ExternalButtonLink } from '@/components/ui/button';
import { CategoryRail } from '@/components/menu/category-rail';
import { CourseRail } from '@/components/menu/course-rail';
import { PizzaCarousel } from '@/components/menu/pizza-carousel';
import { allergenNotice } from '@/content/menu';
import { categoriesWithItems, getSite, itemsIn } from '@/lib/site';
import { breadcrumbJsonLd, menuJsonLd } from '@/lib/seo/jsonld';
import { absoluteUrl } from '@/lib/site-url';

export const metadata: Metadata = {
  title: 'Étlap',
  description:
    'Az Enzo di Napoli teljes étlapja: 32 cm-es nápolyi pizzák, előételek, saláták, olasz desszertek és üdítők, árakkal. Rendelés a Foodorán, Hatvan.',
  alternates: { canonical: absoluteUrl('/etlap') },
  openGraph: {
    url: absoluteUrl('/etlap'),
    title: 'Étlap — Enzo di Napoli',
    description:
      'Nápolyi pizzák, előételek, saláták és desszertek. A teljes étlap árakkal, Hatvan.',
  },
};

export default async function MenuPage() {
  const site = await getSite();
  const visibleCategories = categoriesWithItems(site.menu);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(await menuJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Főoldal', path: '/' },
              { name: 'Étlap', path: '/etlap' },
            ]),
          ),
        }}
      />

      {/*
       * A deliberately shallow masthead, not the site's standard PageHeader.
       *
       * This page's content IS the pizza, and the tall header meant a visitor
       * had to scroll most of a screen past a title and a rule before reaching
       * any food. Here the title, the standfirst and the category selector
       * together are shorter than the fixed chrome, so the first screen already
       * shows the plate turning. The title sits on one line beside its
       * standfirst rather than stacked above it, which is what buys the height
       * back without losing the editorial voice.
       */}
      <header className="relative overflow-hidden pb-6 pt-28 md:pt-32">
        <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-64"
          style={{
            background:
              'radial-gradient(52vw 16rem at 24% 0%, rgb(var(--enzo-ember-rgb) / 0.10), transparent 70%)',
          }}
        />
        <Container className="relative">
          <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3">
            <h1 className="font-display text-3xl text-foreground md:text-4xl">
              Minden, ami a <span className="text-primary">kemencéből jön.</span>
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-muted">
              Minden pizza 32 centiméteres, nápolyi tésztából, {site.oven} kemencében sül.
            </p>
          </div>
        </Container>
      </header>

      <Container>
        <CategoryRail categories={visibleCategories} />
      </Container>

      <div className="pb-24 md:pb-32">
        {visibleCategories.map((category) => {
          const items = itemsIn(site.menu, category.id);
          // The pizzas are the pinned, turning reel; everything else is the
          // course rail. The reel runs edge to edge so its oversized plate can
          // leave the viewport, so only the heading is framed for that one.
          const isPizza = category.id === 'pizzak';

          return (
            <section
              key={category.id}
              id={`kategoria-${category.id}`}
              // The hook the category filter toggles `hidden` on.
              data-category-section={category.id}
              aria-labelledby={`kategoria-${category.id}-cim`}
              // No top padding on the reel: every pixel here delays the plate.
              className={isPizza ? 'scroll-mt-32' : 'scroll-mt-32 pt-16 md:pt-24'}
            >
              {/*
               * The pizzas get no visible heading. The selector directly above
               * already says "Pizzák" and is highlighted, so repeating it as an
               * h2 only pushes the plate down the screen. The heading still
               * exists for the accessibility tree and for the section's
               * aria-labelledby.
               */}
              {isPizza ? (
                <h2 id={`kategoria-${category.id}-cim`} className="sr-only">
                  {category.name}
                </h2>
              ) : (
                <Container>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-border pb-5">
                    <h2
                      id={`kategoria-${category.id}-cim`}
                      className="font-display text-3xl text-foreground"
                    >
                      {category.name}
                    </h2>
                    <p className="text-xs uppercase tracking-[0.16em] text-muted">
                      {category.note ? `${category.note} · ` : ''}
                      {items.length} tétel
                    </p>
                  </div>
                </Container>
              )}

              {isPizza ? (
                <PizzaCarousel items={items} />
              ) : (
                <Container>
                  <CourseRail items={items} />
                </Container>
              )}
            </section>
          );
        })}
      </div>

      {/* Allergen notice and the order action, together at the end of the menu. */}
      <Section
        size="sm"
        className="atmos atmos--ember atmos--rise border-t border-border bg-surface/40"
      >
        <Container>
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-xs uppercase tracking-[0.2em] text-primary">Allergének</h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">{allergenNotice}</p>
              <a
                href={site.phone.href}
                className="font-display mt-4 inline-block text-xl text-foreground transition-colors hover:text-primary"
              >
                {site.phone.display}
              </a>
            </div>

            <div className="md:justify-self-end">
              <ExternalButtonLink
                href={site.links.foodora}
                size="lg"
                label="Rendelés a Foodorán — új lapon nyílik meg"
              >
                Rendelés Foodorán
              </ExternalButtonLink>
              <p className="mt-3 max-w-xs text-xs leading-relaxed text-muted">
                {site.content.contact.deliveryHoursNote}
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
