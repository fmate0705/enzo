/**
 * The shape of everything the admin can edit.
 *
 * `content/*.ts` remains the seed: the defaults the store is created from and
 * falls back to. Once an admin saves, the JSON store is authoritative and the
 * TS files are only the starting point. Keeping both means a fresh deployment
 * with an empty volume still renders a complete, correct site.
 */

import type { CategoryId, MenuItem } from '@/content/menu';

export type { CategoryId, MenuItem };

/** A day in the opening-hours table. `opens: null` means closed. */
export interface DayHours {
  readonly day: string;
  readonly dayShort: string;
  readonly opens: string | null;
  readonly closes: string | null;
  readonly schemaDay: string;
}

export interface ContactContent {
  street: string;
  postalCode: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  phoneDisplay: string;
  /** Derived from phoneDisplay on save; kept in the store so pages never parse. */
  phoneHref: string;
  hours: DayHours[];
  deliveryHoursNote: string;
  services: string[];
  foodoraUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  turulUrl: string;
}

/**
 * The company identity the impresszum and privacy policy need.
 *
 * Every field may legitimately be empty — that is the "client has not supplied
 * it yet" state, and it renders as a visible pending marker rather than as a
 * blank or an invention. `pnpm run check:pending` reports on it.
 */
export interface CompanyContent {
  legalName: string;
  seat: string;
  registrationNumber: string;
  taxNumber: string;
  registeringCourt: string;
  representative: string;
  email: string;
  hostingProvider: string;
  hostingLogRetention: string;
  conciliationBoard: string;
  securityContact: string;
}

export type LegalDocId = 'impresszum' | 'adatkezeles' | 'cookie' | 'feltetelek';

export interface LegalDoc {
  /** Rendered as the page's <h1> and its <title>. */
  title: string;
  /** Shown under the heading. Plain text. */
  lede: string;
  /** Displayed as "Utoljára frissítve". Free text so it can read "2026. augusztus 15." */
  updated: string;
  /**
   * The document body, in the constrained Markdown subset implemented by
   * lib/markdown.ts. Raw HTML is never parsed or rendered, so an admin cannot
   * introduce script into a public page even by pasting it.
   */
  body: string;
  /** Set false once a qualified legal professional has signed the text off. */
  draft: boolean;
}

export interface SiteContent {
  /** Bumped when the shape changes so a stale store can be migrated or reseeded. */
  version: number;
  updatedAt: string;
  menu: MenuItem[];
  /**
   * The pizzas the home page features, in the order they appear there.
   *
   * Slugs rather than indexes, so reordering or editing the menu cannot silently
   * repoint the home page at a different dish. Capped at FEATURED_COUNT; an
   * empty list means "fall back to the signature flag", which is what a store
   * written before this field existed contains.
   */
  featured: string[];
  contact: ContactContent;
  company: CompanyContent;
  legal: Record<LegalDocId, LegalDoc>;
}

export const CONTENT_VERSION = 1;

/** How many pizzas the home page reel shows. The admin picks exactly this many. */
export const FEATURED_COUNT = 3;

/** Company fields, in the order the admin form shows them, with Hungarian labels. */
export const COMPANY_FIELDS: readonly {
  key: keyof CompanyContent;
  label: string;
  hint: string;
}[] = [
  { key: 'legalName', label: 'Cégnév', hint: 'A cégjegyzék szerinti teljes név' },
  { key: 'seat', label: 'Székhely', hint: 'A cég bejegyzett székhelye' },
  { key: 'registrationNumber', label: 'Cégjegyzékszám', hint: 'Például 10-09-123456' },
  { key: 'taxNumber', label: 'Adószám', hint: 'Például 12345678-2-10' },
  { key: 'registeringCourt', label: 'Nyilvántartó bíróság', hint: 'A bejegyzést végző cégbíróság' },
  { key: 'representative', label: 'Képviselő', hint: 'A képviseletre jogosult neve' },
  { key: 'email', label: 'E-mail cím', hint: 'Hivatalos, figyelt e-mail cím' },
  { key: 'hostingProvider', label: 'Tárhelyszolgáltató', hint: 'Név, székhely és elérhetőség' },
  {
    key: 'hostingLogRetention',
    label: 'Naplómegőrzés',
    hint: 'Mennyi ideig őrzi a tárhelyszolgáltató a naplókat',
  },
  {
    key: 'conciliationBoard',
    label: 'Békéltető testület',
    hint: 'A területileg illetékes testület neve és elérhetősége',
  },
  {
    key: 'securityContact',
    label: 'Biztonsági kapcsolat',
    hint: 'A security.txt címe — figyelt postafiók legyen',
  },
];

export const LEGAL_DOCS: readonly { id: LegalDocId; route: string; label: string }[] = [
  { id: 'impresszum', route: '/impresszum', label: 'Impresszum' },
  { id: 'adatkezeles', route: '/adatkezelesi-tajekoztato', label: 'Adatkezelési tájékoztató' },
  { id: 'cookie', route: '/cookie-tajekoztato', label: 'Cookie tájékoztató' },
  { id: 'feltetelek', route: '/felhasznalasi-feltetelek', label: 'Felhasználási feltételek' },
];
