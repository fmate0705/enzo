import 'server-only';

import { getContent } from '@/lib/store/store';
import { restaurant as identity } from '@/content/restaurant';
import type { MenuItem, SiteContent } from '@/lib/store/types';
import { categories, type CategoryId } from '@/content/menu';

/**
 * The read model every public page uses.
 *
 * Pages previously imported the constants in `content/*.ts` directly. Those are
 * now the *seed* — this is the live view, assembled from the store so an admin
 * edit reaches the page. Facts the admin cannot change (the restaurant's name,
 * the oven, the award record) still come from the reviewed constants.
 *
 * Everything derived lives here rather than in a component: the full address
 * string, the map URLs, the hours summary, the schema fragments. A page that
 * needs the address gets the same string as the footer, the metadata and the
 * JSON-LD, because there is one place that builds it.
 */
export interface Site {
  content: SiteContent;
  name: string;
  descriptor: string;
  ownDescription: string;
  oven: string;
  city: string;
  fullAddress: string;
  phone: { display: string; href: string };
  links: {
    foodora: string;
    facebook: string;
    instagram: string;
    turul: string;
  };
  maps: { directions: string; place: string; embed: string };
  menu: readonly MenuItem[];
  hoursSummary: string;
}

export async function getSite(): Promise<Site> {
  const content = await getContent();
  const { contact } = content;

  const fullAddress = `${contact.street}, ${contact.postalCode} ${contact.city}`;
  const query = encodeURIComponent(
    `${identity.name}, ${contact.street} ${contact.postalCode} ${contact.city}`,
  );

  return {
    content,
    name: identity.name,
    descriptor: identity.descriptor,
    ownDescription: identity.ownDescription,
    oven: identity.oven,
    city: contact.city,
    fullAddress,
    phone: { display: contact.phoneDisplay, href: contact.phoneHref },
    links: {
      foodora: contact.foodoraUrl,
      facebook: contact.facebookUrl,
      instagram: contact.instagramUrl,
      turul: contact.turulUrl,
    },
    maps: {
      directions: `https://www.google.com/maps/dir/?api=1&destination=${query}`,
      place: `https://www.google.com/maps/search/?api=1&query=${query}`,
      embed: `https://maps.google.com/maps?q=${query}&z=17&output=embed`,
    },
    menu: content.menu,
    hoursSummary: summarize(content),
  };
}

/** "Kedd–Vasárnap 11:00–22:00" — collapses days that share a window. */
function summarize(content: SiteContent): string {
  const open = content.contact.hours.filter((h) => h.opens !== null);
  const first = open[0];
  const last = open[open.length - 1];
  if (!first?.opens || !last) return 'Jelenleg zárva';
  const uniform = open.every((h) => h.opens === first.opens && h.closes === first.closes);
  if (!uniform) return 'Lásd a nyitvatartást';
  return open.length === 1
    ? `${first.day} ${first.opens}–${first.closes}`
    : `${first.day}–${last.day} ${first.opens}–${first.closes}`;
}

/* -------------------------------------------------------------------------- */
/* Menu queries                                                                */
/* -------------------------------------------------------------------------- */

export function itemsIn(menu: readonly MenuItem[], category: CategoryId): readonly MenuItem[] {
  return menu.filter((item) => item.category === category);
}

export function signatureItems(menu: readonly MenuItem[]): readonly MenuItem[] {
  return menu.filter((item) => item.signature);
}

export function findItem(menu: readonly MenuItem[], slug: string): MenuItem | undefined {
  return menu.find((item) => item.slug === slug);
}

export function relatedTo(
  menu: readonly MenuItem[],
  item: MenuItem,
  count = 3,
): readonly MenuItem[] {
  return menu
    .filter((other) => other.slug !== item.slug && other.category === item.category)
    .sort((a, b) => Math.abs(a.price - item.price) - Math.abs(b.price - item.price))
    .slice(0, count);
}

export function categoriesWithItems(menu: readonly MenuItem[]) {
  return categories.filter((category) => menu.some((item) => item.category === category.id));
}

/* -------------------------------------------------------------------------- */
/* Token substitution for the legal documents                                  */
/* -------------------------------------------------------------------------- */

/**
 * The `{{token}}` values the legal Markdown can reference.
 *
 * A token whose value is empty renders as a visible pending marker carrying the
 * label below — which is how "the client has not supplied the tax number yet"
 * stays visible on the page instead of becoming a blank line.
 */
export function legalTokens(site: Site) {
  const { company } = site.content;
  return {
    'restaurant.name': { value: site.name, label: 'Étterem neve' },
    'contact.address': { value: site.fullAddress, label: 'Cím' },
    'contact.phone': { value: site.phone.display, label: 'Telefonszám' },
    'company.legalName': { value: company.legalName, label: 'A cégjegyzék szerinti teljes cégnév' },
    'company.seat': { value: company.seat, label: 'A cég bejegyzett székhelye' },
    'company.registrationNumber': { value: company.registrationNumber, label: 'Cégjegyzékszám' },
    'company.taxNumber': { value: company.taxNumber, label: 'Adószám' },
    'company.registeringCourt': {
      value: company.registeringCourt,
      label: 'A bejegyzést végző cégbíróság',
    },
    'company.representative': {
      value: company.representative,
      label: 'A képviseletre jogosult neve',
    },
    'company.email': { value: company.email, label: 'Hivatalos e-mail cím' },
    'company.hostingProvider': {
      value: company.hostingProvider,
      label: 'A tárhelyszolgáltató neve, székhelye és elérhetősége',
    },
    'company.hostingLogRetention': {
      value: company.hostingLogRetention,
      label: 'A tárhelyszolgáltató naplómegőrzési ideje',
    },
    'company.conciliationBoard': {
      value: company.conciliationBoard,
      label: 'A területileg illetékes békéltető testület neve és elérhetősége',
    },
  } as const;
}
