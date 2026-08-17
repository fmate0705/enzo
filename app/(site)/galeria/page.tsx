import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { ButtonLink, ExternalButtonLink } from '@/components/ui/button';
import { PageHeader } from '@/components/site/page-header';
import { GalleryGrid } from '@/components/gallery/gallery-grid';
import { galleryImages } from '@/content/gallery';
import { links } from '@/content/restaurant';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { absoluteUrl } from '@/lib/site-url';

export const metadata: Metadata = {
  title: 'Galéria',
  description:
    'Képek az Enzo di Napoliról: a nápolyi pizzák, az AVPN minősítésű MP Forni kemence, az étterem és a terasz Hatvanban.',
  alternates: { canonical: absoluteUrl('/galeria') },
  openGraph: {
    url: absoluteUrl('/galeria'),
    title: 'Galéria — Enzo di Napoli',
    description: 'A pizzák, a kemence és az étterem — saját fotókon.',
  },
};

export default function GalleryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Főoldal', path: '/' },
              { name: 'Galéria', path: '/galeria' },
            ]),
          ),
        }}
      />

      <PageHeader
        title={
          <>
            A pizzák, a kemence
            <br />
            <span className="text-primary">és a hely.</span>
          </>
        }
        lede={`${galleryImages.length} saját fotó a pizzériáról. Minden kép az Enzo di Napoliban készült.`}
      />

      <Container className="pb-24 pt-20 md:pb-32 md:pt-28 lg:pt-32">
        <GalleryGrid />
      </Container>

      <Section size="sm" className="atmos atmos--mesh border-t border-border bg-surface/40">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-8">
            <p className="font-display max-w-lg text-2xl text-foreground md:text-3xl">
              Élőben jobban néz ki.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/megkozelites">Megközelítés</ButtonLink>
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
