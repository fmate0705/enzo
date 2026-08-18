import Image from 'next/image';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Reveal } from '@/components/motion/reveal';
import { ScrollStatement } from '@/components/motion/scroll-statement';
import { restaurant } from '@/content/restaurant';

/**
 * The oven.
 *
 * A two-image editorial spread — the oven itself, and the moment a pizza leaves
 * it — against the one claim the restaurant makes about how it cooks. Both
 * photographs are the restaurant's own; the brass-tiled dome in the first is the
 * actual oven, which is also where the brand's accent colour comes from.
 */
export function Craft() {
  return (
    <Section aria-labelledby="craft-title" size="lg" className="atmos atmos--ember atmos--rise">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
          {/* ---- Images ------------------------------------------------- */}
          <div className="relative">
            <Reveal className="relative aspect-[3/4] w-full overflow-hidden">
              <Image
                src="/images/etterem/kemence.webp"
                alt={`Az Enzo di Napoli sárgaréz mozaikkal borított ${restaurant.oven} kupolás pizzakemencéje`}
                fill
                sizes="(max-width: 1023px) 90vw, 42vw"
                className="object-cover"
              />
            </Reveal>

            {/* Overlaps the first image at its lower edge — the two are one
                composition rather than two stacked pictures.

                z-10 and `isolate` are load-bearing. Both images are reveal
                targets, and a reveal carries `will-change: transform` while it
                animates and drops it to `auto` when it lands. will-change
                creates a stacking context, so the overlap's paint order was
                being decided by whether the animation happened to be running —
                which is why this one flickered against its neighbour mid-
                reveal. Pinning the order explicitly makes it independent of the
                animation's state. */}
            <Reveal
              delay={140}
              className="relative isolate z-10 -mt-24 ml-auto aspect-[4/3] w-2/3 overflow-hidden border border-background sm:-mt-32"
            >
              <Image
                src="/images/etterem/kemence-parban.jpg"
                alt="Frissen sült pizza a kemence izzó szája előtt, bazsalikomcserepek között"
                fill
                sizes="(max-width: 1023px) 60vw, 28vw"
                className="object-cover"
              />
            </Reveal>
          </div>

          {/* ---- Copy --------------------------------------------------- */}
          <div className="lg:pt-10">
            <ScrollStatement
              as="h2"
              id="craft-title"
              text="A tűz nem díszlet. A recept fele."
              accentWords={[4, 5, 6]}
              className="text-4xl text-foreground md:text-5xl"
            />

            <div className="mt-8 max-w-xl space-y-5 text-base leading-relaxed text-muted">
              <p>
                <span className="text-foreground">„{restaurant.ownDescription}”</span> — ez a mondat
                a pizzéria saját megfogalmazása, és ez a különbség lényege.
              </p>
              <p>
                Az AVPN — az Associazione Verace Pizza Napoletana — az a nápolyi szervezet, amely
                meghatározza, mitől nápolyi egy pizza: a liszttől és a tésztakezeléstől a kemence
                típusáig. A kemence nem gyorsítja a sütést, hanem másképp süti: a tészta széle
                percek helyett másodpercek alatt emelkedik meg és hólyagosodik fel, a közepe vékony
                és puha marad.
              </p>
              <p>
                Ezért van minden pizzán viszonylag kevés feltét, és ezért 32 centiméter mind. Nem
                stílusdöntés — a tészta így viselkedik jól.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
