import { menu as seedMenu } from '@/content/menu';
import { links, restaurant } from '@/content/restaurant';
import { CONTENT_VERSION, FEATURED_COUNT, type SiteContent } from './types';
import { defaultLegalDocs } from './legal-defaults';

/**
 * The content a brand-new store is created from.
 *
 * Seeded out of `content/*.ts`, which stays the reviewed, version-controlled
 * baseline. A deployment with an empty volume therefore renders the same
 * verified site the repository describes — the store adds editability, it does
 * not become a second source of truth for facts nobody has checked.
 */
export function defaultContent(): SiteContent {
  return {
    version: CONTENT_VERSION,
    updatedAt: new Date(0).toISOString(),
    menu: seedMenu.map((item) => ({ ...item })),
    // Seeded from the reviewed `signature` flags in content/menu.ts, trimmed to
    // the number the home page actually shows. Once an admin saves a selection
    // this list is authoritative and the flag is only the starting point.
    featured: seedMenu
      .filter((item) => item.signature && item.category === 'pizzak')
      .slice(0, FEATURED_COUNT)
      .map((item) => item.slug),
    contact: {
      street: restaurant.address.street,
      postalCode: restaurant.address.postalCode,
      city: restaurant.address.city,
      country: restaurant.address.country,
      latitude: restaurant.address.geo.latitude,
      longitude: restaurant.address.geo.longitude,
      phoneDisplay: restaurant.phone.display,
      phoneHref: restaurant.phone.href,
      hours: restaurant.hours.map((h) => ({ ...h })),
      deliveryHoursNote: restaurant.deliveryHoursNote,
      services: [...restaurant.services],
      foodoraUrl: links.foodora,
      facebookUrl: links.facebook,
      instagramUrl: links.instagram,
      turulUrl: links.turul,
    },
    // Every company field starts empty on purpose. These are the values only the
    // business can supply; an empty string is the honest "not yet provided"
    // state and renders as a visible pending marker.
    company: {
      legalName: '',
      seat: '',
      registrationNumber: '',
      taxNumber: '',
      registeringCourt: '',
      representative: '',
      email: '',
      hostingProvider: '',
      hostingLogRetention: '',
      conciliationBoard: '',
      securityContact: '',
    },
    legal: defaultLegalDocs(),
  };
}
