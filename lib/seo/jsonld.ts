import 'server-only';

import { categories, type MenuItem } from '@/content/menu';
import { awards, restaurant as identity } from '@/content/restaurant';
import { getSite, type Site } from '@/lib/site';
import { absoluteUrl } from '@/lib/site-url';

/**
 * Structured data.
 *
 * Built from the live store, so an address or price the admin edits reaches
 * search engines with the same edit that changes the page. Facts the admin
 * cannot change — the name, the oven, the award record — still come from the
 * reviewed constants in `content/`.
 *
 * Two rules held throughout:
 * - Only verified facts appear. There is one address on this site and it is the
 *   one in the store; no alternative is emitted anywhere.
 * - `sameAs` lists only profiles that are actually filled in. An empty field
 *   produces no entry rather than a link to nowhere.
 */

const RESTAURANT_ID = absoluteUrl('/#restaurant');

function openingHoursSpecification(site: Site) {
  return site.content.contact.hours
    .filter((h) => h.opens !== null && h.closes !== null)
    .map((h) => ({
      '@type': 'OpeningHoursSpecification' as const,
      dayOfWeek: `https://schema.org/${h.schemaDay}`,
      opens: h.opens as string,
      closes: h.closes as string,
    }));
}

export async function restaurantJsonLd() {
  const site = await getSite();
  const { contact } = site.content;

  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': RESTAURANT_ID,
    name: site.name,
    description: site.ownDescription,
    url: absoluteUrl('/'),
    telephone: site.phone.display,
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.street,
      addressLocality: contact.city,
      postalCode: contact.postalCode,
      addressCountry: 'HU',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: contact.latitude,
      longitude: contact.longitude,
    },
    hasMap: absoluteUrl('/megkozelites'),
    image: [
      absoluteUrl('/images/etterem/kemence-belso.jpg'),
      absoluteUrl('/images/etterem/utcafront.webp'),
      absoluteUrl('/images/etelek/margherita.jpg'),
    ],
    servesCuisine: ['Olasz', 'Nápolyi pizza', 'Pizza'],
    priceRange: identity.priceRange,
    currenciesAccepted: identity.currency,
    openingHoursSpecification: openingHoursSpecification(site),
    hasMenu: absoluteUrl('/etlap'),
    menu: absoluteUrl('/etlap'),
    /* Tables are taken by phone, not through this site. */
    acceptsReservations: 'False',
    potentialAction: {
      '@type': 'OrderAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: site.links.foodora,
        inLanguage: 'hu',
        actionPlatform: [
          'https://schema.org/DesktopWebPlatform',
          'https://schema.org/MobileWebPlatform',
        ],
      },
      deliveryMethod: ['https://schema.org/OnSitePickup', 'https://schema.org/ParcelService'],
    },
    award: awards.map((a) => `${a.issuer} ${a.year} — ${a.title}`),
    sameAs: [
      site.links.facebook,
      site.links.instagram,
      site.links.foodora,
      site.links.turul,
    ].filter(Boolean),
  } as const;
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': absoluteUrl('/#website'),
    name: identity.name,
    url: absoluteUrl('/'),
    inLanguage: 'hu-HU',
    publisher: { '@id': RESTAURANT_ID },
  } as const;
}

/* -------------------------------------------------------------------------- */
/* Menu                                                                         */
/* -------------------------------------------------------------------------- */

function menuItemNode(item: MenuItem, foodoraUrl: string) {
  return {
    '@type': 'MenuItem',
    '@id': absoluteUrl(`/etlap/${item.slug}#item`),
    name: item.name,
    description: item.description,
    url: absoluteUrl(`/etlap/${item.slug}`),
    ...(item.image ? { image: absoluteUrl(item.image) } : {}),
    offers: {
      '@type': 'Offer',
      price: item.price,
      priceCurrency: identity.currency,
      availability: 'https://schema.org/InStock',
      url: foodoraUrl,
    },
  };
}

export async function menuJsonLd() {
  const site = await getSite();
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    '@id': absoluteUrl('/etlap#menu'),
    name: `${site.name} étlap`,
    url: absoluteUrl('/etlap'),
    inLanguage: 'hu-HU',
    hasMenuSection: categories
      .filter((category) => site.menu.some((item) => item.category === category.id))
      .map((category) => ({
        '@type': 'MenuSection',
        name: category.name,
        hasMenuItem: site.menu
          .filter((item) => item.category === category.id)
          .map((item) => menuItemNode(item, site.links.foodora)),
      })),
  } as const;
}

export async function menuItemJsonLd(item: MenuItem) {
  const site = await getSite();
  return {
    '@context': 'https://schema.org',
    ...menuItemNode(item, site.links.foodora),
    isPartOf: { '@id': absoluteUrl('/etlap#menu') },
  };
}

/* -------------------------------------------------------------------------- */
/* Breadcrumbs                                                                  */
/* -------------------------------------------------------------------------- */

export function breadcrumbJsonLd(trail: readonly { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/**
 * aggregateRating is intentionally NOT emitted.
 *
 * The site shows three real scores (Turul, Foodora, Facebook), but every one was
 * earned on another platform. Google's structured data policy requires that a
 * rating marked up on a page be collected by that site itself, so marking up
 * third-party scores is a manual-action risk. They are displayed, attributed and
 * linked — simply not claimed as this site's own data.
 */
