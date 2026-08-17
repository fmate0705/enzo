import type { Metadata, Viewport } from 'next';
import { Archivo, Bodoni_Moda } from 'next/font/google';
import './globals.css';
import '@/styles/brand.css';
import { restaurantJsonLd, websiteJsonLd } from '@/lib/seo/jsonld';
import { siteUrl } from '@/lib/site-url';

/**
 * The document.
 *
 * Deliberately thin: the html and body elements, the fonts, and the site-wide
 * structured data. The visible chrome — header, footer, consent notice — lives
 * in the (site) route group instead, so /admin can render without it.
 */

/**
 * Bodoni is the display voice. Giambattista Bodoni was Italian, and the Didone
 * hairline contrast gives the headlines the editorial weight the brand needs
 * without reaching for a script face or a "trattoria" cliché.
 */
const bodoni = Bodoni_Moda({
  subsets: ['latin-ext'], // latin-ext carries ő and ű.
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-bodoni',
});

/** Archivo carries every piece of running text, UI and price. */
const archivo = Archivo({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-archivo',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Enzo di Napoli — nápolyi pizzéria Hatvanban',
    template: '%s — Enzo di Napoli',
  },
  description:
    'Nápolyi pizza AVPN minősítésű Forni kemencéből, Hatvan szívében. Friss olasz alapanyagok, hagyományos receptek. Étlap, nyitvatartás, rendelés.',
  applicationName: 'Enzo di Napoli',
  authors: [{ name: 'Enzo di Napoli' }],
  creator: 'Enzo di Napoli',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
  /*
   * No canonical here on purpose. Every page declares its own, and a root-level
   * default is inherited by pages that should not have one — it was putting a
   * canonical to the home page on the 404.
   */
  openGraph: {
    type: 'website',
    siteName: 'Enzo di Napoli',
    locale: 'hu_HU',
    url: siteUrl,
    title: 'Enzo di Napoli — nápolyi pizzéria Hatvanban',
    description:
      'Nápolyi pizza AVPN minősítésű Forni kemencéből, Hatvan szívében. Friss olasz alapanyagok, hagyományos receptek.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Enzo di Napoli — nápolyi pizzéria Hatvanban',
    description: 'Nápolyi pizza AVPN minősítésű Forni kemencéből, Hatvan szívében.',
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: true, address: true },
};

export const viewport: Viewport = {
  themeColor: '#1B191A',
  colorScheme: 'dark',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [restaurantLd, websiteLd] = [await restaurantJsonLd(), websiteJsonLd()];

  return (
    /*
     * data-theme is fixed at "dark". The brand has one scheme, so there is no
     * toggle, no stored preference and no pre-hydration theme script to ship.
     */
    /*
     * suppressHydrationWarning is required, not cosmetic. The inline script in
     * <head> below adds the `js` class to documentElement, and it runs before
     * React hydrates — so the class list React finds on the client is always one
     * token longer than the one it rendered on the server. Without this, every
     * page logs a hydration mismatch for a difference we create on purpose.
     * It suppresses the warning for this element's own attributes only; children
     * are still checked normally.
     */
    <html
      lang="hu"
      data-theme="dark"
      className={`${bodoni.variable} ${archivo.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/*
         * Marks the document as scripted. Reveal animations hide their content
         * only under html.js, so if this never runs the page degrades to fully
         * visible rather than to blank sections.
         */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}
