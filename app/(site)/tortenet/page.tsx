import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { ButtonLink, ExternalButtonLink } from '@/components/ui/button';
import { PageHeader } from '@/components/site/page-header';
import { Reveal } from '@/components/motion/reveal';
import { ScrollStatement } from '@/components/motion/scroll-statement';
import { awards, links, restaurant } from '@/content/restaurant';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { absoluteUrl } from '@/lib/site-url';

export const metadata: Metadata = {
  title: 'Történet',
  description:
    'Az Enzo di Napoli 2024 októberében nyitott Hatvanban. Nápolyi pizza AVPN minősítésű MP Forni kemencéből, olasz alapanyagokból, hagyományos receptek szerint.',
  alternates: { canonical: absoluteUrl('/tortenet') },
  openGraph: {
    url: absoluteUrl('/tortenet'),
    title: 'Történet — Enzo di Napoli',
    description: 'Hogyan készül a nápolyi pizza Hatvanban, és mi kell hozzá.',
  },
};

/** Rendered as a Hungarian date without pulling in a formatting library. */
const openedOn = new Intl.DateTimeFormat('hu-HU', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}).format(new Date(restaurant.openedOn));

export default function StoryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Főoldal', path: '/' },
              { name: 'Történet', path: '/tortenet' },
            ]),
          ),
        }}
      />

      <PageHeader
        title={
          <>
            Egy kemence,
            <br />
            <span className="text-primary">egy tészta,</span> egy város.
          </>
        }
        lede={`Az Enzo di Napoli ${openedOn} óta működik Hatvan belvárosában. Ami a nyitás óta nem változott: hogyan készül a tészta, és miben sül meg.`}
      />

      {/* ---- The dough ---------------------------------------------------- */}
      <Section aria-labelledby="dough-title" className="atmos atmos--rise">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-20">
            <div>
              <h2 id="dough-title" className="font-display text-3xl text-foreground md:text-4xl">
                A nápolyi pizza nem egy recept. Egy módszer.
              </h2>
              <div className="mt-8 space-y-5 text-base leading-relaxed text-muted">
                <p>
                  Nápolyban a pizza nem feltétkérdés. A tészta és a sütés határozza meg, minden más
                  utána jön. Ezért van az, hogy egy jó Margheritán négy összetevő van, és ezért
                  lehet mégis megmondani róla, hogy jól csinálták-e.
                </p>
                <p>
                  A módszert egy nápolyi szervezet, az{' '}
                  <span className="text-foreground">Associazione Verace Pizza Napoletana</span>{' '}
                  (AVPN) írja le: mit szabad a tésztába tenni, hogyan kell kezelni, és milyen
                  kemencében sülhet meg. Az Enzo di Napoli kemencéje ezt a minősítést viseli.
                </p>
                <p>
                  A gyakorlatban ez annyit jelent, hogy a pizza nagyon rövid ideig, nagyon nagy
                  hőben sül. A széle megemelkedik és foltosan megég — ez a{' '}
                  <span className="text-foreground">cornicione</span>, és nem hiba. A közepe vékony
                  marad, és nem bírja el a végtelen feltétet. Innen jön az étlap szerkezete is.
                </p>
              </div>
            </div>

            <Reveal className="relative aspect-[4/5] w-full overflow-hidden lg:mt-16">
              <Image
                src="/images/etterem/kemence-pizza.jpg"
                alt={`Kisülő pizza az Enzo di Napoli ${restaurant.oven} kemencéjéből, jellegzetes foltosan megsült peremmel`}
                fill
                sizes="(max-width: 1023px) 92vw, 44vw"
                className="object-cover"
              />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ---- Statement --------------------------------------------------- */}
      <Section size="sm" className="border-y border-border/60 bg-surface/40">
        <Container>
          <ScrollStatement
            text="Amit nem lehet meggyorsítani, azt nem gyorsítjuk meg."
            accentWords={[6, 7, 8]}
            className="mx-auto max-w-4xl text-center text-3xl text-foreground md:text-4xl"
          />
        </Container>
      </Section>

      {/* ---- The room ---------------------------------------------------- */}
      <Section aria-labelledby="room-title">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-20">
            <div className="order-2 grid grid-cols-2 gap-4 lg:order-1">
              <Reveal className="relative col-span-2 aspect-[16/10] overflow-hidden">
                <Image
                  src="/images/etterem/belso-3.webp"
                  alt="Az Enzo di Napoli étterme: sötét fa asztalok, meleg fényű lámpák, olasz utcaképek a falon"
                  fill
                  sizes="(max-width: 1023px) 92vw, 44vw"
                  className="object-cover"
                />
              </Reveal>
              <Reveal delay={90} className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/images/etterem/belso-1.webp"
                  alt="Asztalok az étterem oldalfala mellett, borospolccal és képekkel"
                  fill
                  sizes="(max-width: 1023px) 45vw, 22vw"
                  className="object-cover"
                />
              </Reveal>
              <Reveal delay={160} className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/images/etterem/bejarat.jpg"
                  alt="Az Enzo di Napoli boltíves bejárata az aranyszínű logóval, citrusfákkal a két oldalán"
                  fill
                  sizes="(max-width: 1023px) 45vw, 22vw"
                  className="object-cover"
                />
              </Reveal>
            </div>

            <div className="order-1 lg:order-2 lg:pt-10">
              <h2 id="room-title" className="font-display text-3xl text-foreground md:text-4xl">
                Hatvan, Kossuth tér.
              </h2>
              <div className="mt-8 space-y-5 text-base leading-relaxed text-muted">
                <p>
                  A pizzéria a város belvárosában, egy boltíves kapualjban nyílik, utcafronti
                  terasszal. Benn sötét fa, meleg fény és olasz utcaképek — nagyjából annyi díszlet,
                  amennyi egy pizzériához kell, és nem több.
                </p>
                <p>
                  Helyben fogyasztás, elvitel és házhozszállítás is működik. A kiszállítást a
                  Foodora intézi; az asztalfoglalás telefonon megy.
                </p>
              </div>

              <dl className="mt-10 grid grid-cols-2 gap-8 border-t border-border pt-8">
                <div>
                  <dt className="text-xs uppercase tracking-[0.16em] text-muted">Nyitás</dt>
                  <dd className="font-display mt-2 text-2xl text-primary">2024</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.16em] text-muted">Kemence</dt>
                  <dd className="font-display mt-2 text-2xl text-primary">{restaurant.oven}</dd>
                </div>
              </dl>

              <ul className="mt-8 flex flex-wrap gap-2">
                {restaurant.services.map((service) => (
                  <li
                    key={service}
                    className="border border-border px-3 py-1.5 text-sm text-foreground"
                  >
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* ---- Recognition ------------------------------------------------- */}
      <Section
        aria-labelledby="story-awards-title"
        className="atmos atmos--engraved border-t border-border/60"
      >
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
            <div>
              <h2
                id="story-awards-title"
                className="font-display text-3xl text-foreground md:text-4xl"
              >
                Két év, négy elismerés.
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
                A Turul Gasztronómia szakmai és vendégértékelés alapján minősít. Az Enzo di Napoli
                2025-ben és 2026-ban is arany fokozatot kapott.
              </p>
              <a
                href={links.turul}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-primary transition-opacity hover:opacity-75"
              >
                Turul Gasztronómia profil <span aria-hidden="true">↗</span>
                <span className="sr-only">(új lapon nyílik meg)</span>
              </a>
            </div>

            <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {awards.map((award, index) => (
                <Reveal
                  as="li"
                  key={`${award.year}-${award.title}`}
                  delay={index * 70}
                  className="flex items-baseline gap-5 border-t border-border pt-5"
                >
                  <span className="font-display shrink-0 text-2xl text-primary">{award.year}</span>
                  <span>
                    <span className="block text-foreground">{award.title}</span>
                    <span className="mt-1 block text-xs uppercase tracking-[0.16em] text-muted">
                      {award.issuer}
                    </span>
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* ---- CTA --------------------------------------------------------- */}
      <Section size="sm" className="border-t border-border bg-surface/40">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-8">
            <p className="font-display max-w-lg text-2xl text-foreground md:text-3xl">
              A többit a kemence mondja el.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/etlap">Étlap</ButtonLink>
              <ExternalButtonLink
                href={links.foodora}
                variant="outline"
                label="Rendelés a Foodorán — új lapon nyílik meg"
              >
                Rendelés Foodorán
              </ExternalButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
