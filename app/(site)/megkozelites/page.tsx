import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { ExternalButtonLink } from '@/components/ui/button';
import { PageHeader } from '@/components/site/page-header';
import { MapEmbed } from '@/components/site/map-embed';
import { getSite } from '@/lib/site';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { absoluteUrl } from '@/lib/site-url';

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return {
    title: 'Megközelítés',
    description: `Az ${site.name} címe: ${site.fullAddress}. Nyitvatartás, telefonszám, útvonaltervezés és rendelési lehetőségek.`,
    alternates: { canonical: absoluteUrl('/megkozelites') },
    openGraph: {
      url: absoluteUrl('/megkozelites'),
      title: 'Megközelítés — Enzo di Napoli',
      description: `${site.fullAddress} · ${site.phone.display}`,
    },
  };
}

export default async function LocationPage() {
  const site = await getSite();
  const { contact } = site.content;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Főoldal', path: '/' },
              { name: 'Megközelítés', path: '/megkozelites' },
            ]),
          ),
        }}
      />

      <PageHeader
        title={
          <>
            {contact.street}
            <br />
            <span className="text-primary">
              {contact.postalCode} {contact.city}
            </span>
          </>
        }
        lede="Hatvan belvárosában, a Kossuth téren, utcafronti terasszal. Helyben fogyasztás, elvitel és házhozszállítás."
      />

      {/* ---- The map, then how to use it ----------------------------------
       *
       * The map leads and runs the full width. This page exists to get somebody
       * through the door, so the map is the subject, not an illustration beside
       * a column of text — at a third of the page it was the smallest useful
       * thing on a page about location.
       *
       * The opening hours are deliberately not repeated here. They are in the
       * footer of every page, including this one, and a second copy is a second
       * thing to forget to update.
       */}
      <Container className="pb-20 pt-16 md:pt-24">
        <MapEmbed
          className="aspect-[4/5] sm:aspect-[16/10] lg:aspect-[21/9]"
          title={`${site.name} a térképen — ${site.fullAddress}`}
          fullAddress={site.fullAddress}
          latitude={contact.latitude}
          longitude={contact.longitude}
          embedUrl={site.maps.embed}
          directionsUrl={site.maps.directions}
        />

        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-primary">Cím</h2>
            <address className="font-display mt-4 text-2xl not-italic leading-snug text-foreground">
              {contact.street}
              <br />
              {contact.postalCode} {contact.city}
              <br />
              {contact.country}
            </address>
            <ExternalButtonLink
              href={site.maps.directions}
              size="sm"
              className="mt-6"
              label="Útvonaltervezés a Google Térképen — új lapon nyílik meg"
            >
              Útvonaltervezés
            </ExternalButtonLink>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-primary">Telefon</h2>
            <a
              href={site.phone.href}
              className="font-display mt-4 block text-2xl text-foreground transition-colors hover:text-primary"
            >
              {site.phone.display}
            </a>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Asztalfoglalás és allergénekkel kapcsolatos kérdések telefonon.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{contact.deliveryHoursNote}</p>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-primary">Szolgáltatások</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {contact.services.map((service) => (
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

        {/* The street itself, so a visitor knows what to look for. */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/images/etterem/utcafront.webp"
              alt="Az Enzo di Napoli utcafronti homlokzata és terasza a Kossuth téren"
              fill
              sizes="(max-width: 639px) 92vw, 46vw"
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/images/etterem/bejarat.jpg"
              alt="A pizzéria boltíves bejárata az aranyszínű Enzo di Napoli logóval"
              fill
              sizes="(max-width: 639px) 92vw, 46vw"
              className="object-cover"
            />
          </div>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted">
          A bejárat a boltíves kapualjban, az aranyszínű logó alatt található.
        </p>
      </Container>

      {/* ---- Ordering ----------------------------------------------------- */}
      <Section size="sm" className="atmos atmos--engraved border-t border-border bg-surface/40">
        <Container>
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="font-display text-2xl text-foreground md:text-3xl">
                Rendelés és házhozszállítás
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
                A rendeléseket a Foodora kezeli — ott látható az aktuális kínálat, a szállítási díj
                és a várható idő. Elvitelre telefonon is leadható a rendelés.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <ExternalButtonLink
                href={site.links.foodora}
                size="lg"
                label="Rendelés a Foodorán — új lapon nyílik meg"
              >
                Rendelés Foodorán
              </ExternalButtonLink>
              <a
                href={site.phone.href}
                className="inline-flex h-14 items-center justify-center rounded-sm border border-primary/50 px-8 text-sm uppercase tracking-[0.14em] text-primary transition-colors hover:border-primary hover:bg-primary/10"
              >
                {site.phone.display}
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
