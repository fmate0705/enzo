import { Container } from '@/components/ui/container';
import { Section, SectionHeading } from '@/components/ui/section';
import { ButtonLink } from '@/components/ui/button';
import { Reveal } from '@/components/motion/reveal';
import { FoodCard } from '@/components/menu/food-card';
import { getSite, signatureItems } from '@/lib/site';

/**
 * The five pizzas the restaurant is worth visiting for.
 *
 * The selection lives in content/menu.ts as a `signature` flag rather than in
 * this file, so changing what the home page features is a content edit.
 *
 * Layout is deliberately uneven — the first two run large, the remaining three
 * sit smaller beneath. A five-up grid of identical tiles is the shape every
 * restaurant template produces; this one has a first course.
 */
export async function Signature() {
  const site = await getSite();
  const items = signatureItems(site.menu);
  const [lead, second, ...rest] = items;

  if (!lead || !second) return null;

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
            lede="Az étlap teljes — ez öt pizza belőle, amit a legtöbben visznek haza, és amit mi is elsőként ajánlunk."
          />
          <ButtonLink href="/etlap" variant="outline" className="shrink-0">
            Teljes étlap
          </ButtonLink>
        </div>

        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 md:mt-20 lg:grid-cols-6">
          {[lead, second].map((item, index) => (
            <Reveal key={item.slug} delay={index * 90} className="lg:col-span-3">
              <FoodCard
                item={item}
                priority={index === 0}
                sizes="(max-width: 639px) 90vw, (max-width: 1023px) 45vw, 46vw"
              />
            </Reveal>
          ))}

          {rest.map((item, index) => (
            <Reveal key={item.slug} delay={index * 90} className="lg:col-span-2">
              <FoodCard
                item={item}
                sizes="(max-width: 639px) 90vw, (max-width: 1023px) 45vw, 30vw"
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
