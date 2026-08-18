import { Container } from '@/components/ui/container';
import { Section, SectionHeading } from '@/components/ui/section';
import { ButtonLink } from '@/components/ui/button';
import { Reveal } from '@/components/motion/reveal';
import { FoodCard } from '@/components/menu/food-card';
import { PizzaCarousel } from '@/components/menu/pizza-carousel';
import { getSite, featuredItems } from '@/lib/site';

/**
 * The pizzas the restaurant is worth visiting for.
 *
 * Which ones, and in what order, is set by the admin under Étlap → "Kiemelt
 * pizzák a főoldalon". Nothing here decides the selection.
 *
 * Two presentations, chosen by width rather than one layout bent to fit both:
 *
 * - Desktop gets the turning reel — the same pinned plate as the menu page, so
 *   the home page teases the thing the menu page does at length. Three pizzas is
 *   about two and a half screens of scroll, which is a section rather than a
 *   detour.
 * - Below `md` it stays a card grid. The reel needs two columns to work at all:
 *   a plate that fills a phone leaves nowhere for the name and the price, and a
 *   pinned section is a poor citizen on a touch screen mid-page.
 *
 * The reel is passed `fallback="none"` so it renders nothing on the widths the
 * cards already cover — without it a phone would list all three dishes twice.
 * The cards are the server-rendered copy, so the dishes are in the HTML for a
 * crawler regardless of which one a visitor sees.
 */
export async function Signature() {
  const site = await getSite();
  const items = featuredItems(site.menu, site.content.featured);

  if (items.length === 0) return null;

  return (
    <Section
      aria-labelledby="signature-title"
      className="atmos atmos--brass atmos--engraved bg-surface/40"
    >
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            id="signature-title"
            title="Amiért érdemes bejönni."
            lede="Az étlap teljes — ez a három pizza belőle, amit a legtöbben visznek haza, és amit mi is elsőként ajánlunk."
          />
          <ButtonLink href="/etlap" variant="outline" className="shrink-0">
            Teljes étlap
          </ButtonLink>
        </div>
      </Container>

      {/* ---- Phones: the card grid ----------------------------------------- */}
      <Container className="md:hidden">
        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2">
          {items.map((item, index) => (
            <Reveal key={item.slug} delay={index * 90}>
              <FoodCard item={item} priority={index === 0} sizes="(max-width: 639px) 90vw, 45vw" />
            </Reveal>
          ))}
        </div>
      </Container>

      {/* ---- Desktop: the turning reel, full bleed -------------------------- */}
      {/* `chrome` is the header alone — this page has no category rail above the
          reel, so the stage parks 6rem down rather than the menu page's 9.5rem. */}
      <div className="mt-16 hidden md:block">
        <PizzaCarousel items={items} chrome="6rem" fallback="none" />
      </div>
    </Section>
  );
}
