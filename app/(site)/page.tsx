import type { Metadata } from 'next';
import { OvenHero } from '@/components/home/oven-hero';
import { Pillars } from '@/components/home/pillars';
import { Signature } from '@/components/home/signature';
import { Craft } from '@/components/home/craft';
import { Recognition } from '@/components/home/recognition';
import { LocationBlock } from '@/components/home/location-block';
import { ClosingCta } from '@/components/home/closing-cta';
import { absoluteUrl } from '@/lib/site-url';
import { getSite } from '@/lib/site';

export const metadata: Metadata = {
  // `absolute` so the layout's "%s — Enzo di Napoli" template is not applied on
  // top of a title that already names the restaurant.
  title: { absolute: 'Enzo di Napoli — nápolyi pizzéria Hatvanban' },
  description:
    'Nápolyi pizza AVPN minősítésű Forni kemencéből, Hatvan belvárosában. Friss olasz alapanyagok, hagyományos receptek. Étlap, nyitvatartás, rendelés.',
  alternates: { canonical: absoluteUrl('/') },
  openGraph: {
    url: absoluteUrl('/'),
    title: 'Enzo di Napoli — nápolyi pizzéria Hatvanban',
    description:
      'Nápolyi pizza AVPN minősítésű Forni kemencéből, Hatvan belvárosában. Friss olasz alapanyagok, hagyományos receptek.',
  },
};

export default async function HomePage() {
  const site = await getSite();

  return (
    <>
      <OvenHero foodoraUrl={site.links.foodora} />
      <Pillars />
      <Signature />
      <Craft />
      <Recognition />
      <LocationBlock />
      <ClosingCta />
    </>
  );
}
