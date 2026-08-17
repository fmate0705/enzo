import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Reveal } from '@/components/motion/reveal';
import { ScrollStatement } from '@/components/motion/scroll-statement';

/**
 * What makes the pizza what it is.
 *
 * Composed as an editorial column rather than a row of feature cards: a numbered
 * list set in the display face, with the reasoning beside each item. Each entry
 * states a fact about how the food is made — no entry is a slogan.
 */
const pillars = [
  {
    number: '01',
    title: 'AVPN minősítésű kemence',
    body: 'A tészta MP Forni kemencében sül, az AVPN — az Associazione Verace Pizza Napoletana — minősítése szerint. A kemence a nápolyi pizza egyetlen olyan eszköze, amit nem lehet kiváltani.',
  },
  {
    number: '02',
    title: 'Olasz alapanyagok',
    body: 'Fior di Latte és bivalymozzarella, Grana Padano, prosciutto crudo és cotto, Napoli csemegeszalámi, datolyaparadicsom. Az étlapon minden feltét néven van nevezve.',
  },
  {
    number: '03',
    title: 'Hagyományos receptek',
    body: 'A Margheritán négy dolog van: paradicsomszósz, mozzarella, bazsalikom, olívaolaj. Ennyi. Amit rá lehetne még tenni, az egy másik pizza.',
  },
  {
    number: '04',
    title: '32 centiméter',
    body: 'Minden pizza egy méretben készül, azon a méreten, amin a nápolyi tészta a legjobban viselkedik: a széle megemelkedik és felhólyagosodik, a közepe vékony marad.',
  },
];

export function Pillars() {
  return (
    <Section
      aria-labelledby="pillars-title"
      className="atmos atmos--rule border-t border-border/60"
    >
      <Container>
        <div className="max-w-4xl">
          <ScrollStatement
            as="h2"
            text="Négy dolog, amin nem változtatunk."
            accentWords={[0]}
            className="text-4xl text-foreground md:text-5xl"
          />
        </div>

        <ol className="mt-16 grid gap-x-16 gap-y-12 md:mt-20 md:grid-cols-2">
          {pillars.map((pillar, index) => (
            <Reveal as="li" key={pillar.number} delay={index * 70} className="flex gap-6">
              <span
                aria-hidden="true"
                className="font-display shrink-0 text-lg leading-none text-primary/70"
              >
                {pillar.number}
              </span>
              <div>
                <h3 className="font-display text-2xl text-foreground">{pillar.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-muted">{pillar.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
