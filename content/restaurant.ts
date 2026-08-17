/**
 * Enzo di Napoli — the single source of truth for every restaurant fact on this site.
 *
 * Nothing here is invented. Each field carries its source so a future editor can
 * re-verify it. Fields marked NEEDS CLIENT CONFIRMATION are the ones a business
 * owner must sign off before the site goes to production; they are listed together
 * in docs/CONTENT-INVENTORY.md.
 *
 * Change a value here and it changes everywhere: pages, metadata, JSON-LD, footer,
 * map links. No component hard-codes an address, a phone number or an opening hour.
 */

/* -------------------------------------------------------------------------- */
/* Identity                                                                     */
/* -------------------------------------------------------------------------- */

export const restaurant = {
  name: 'Enzo di Napoli',
  /** From the signage and the logo mark. */
  descriptor: 'Pizza Tradizionale',
  city: 'Hatvan',

  /**
   * The restaurant's own one-line description, taken verbatim from its Facebook
   * page. This is the source that verifies the AVPN / Forni claim — it is the
   * business's own statement about itself, not a third-party summary.
   */
  ownDescription: 'Nápolyi pizza eredeti AVPN minősítésű Forni kemencéből.',

  /**
   * ADDRESS — resolved from a genuine conflict between sources.
   *
   *   Facebook (the restaurant's own page)  → Kossuth tér 16   ✓
   *   Foodora JSON-LD (vendor-maintained)   → Kossuth tér 16   ✓
   *   Foodora geo pin 47.6669, 19.6824      → Kossuth tér      ✓
   *   Turul Gasztronómia directory profile  → Horváth Mihály út 7
   *   nyitva.hu / Cylex directory           → Horváth Mihály út 7
   *
   * Horváth Mihály út 7 geocodes to 19.6892 — roughly 700 m east of the pin the
   * restaurant itself publishes. Both directory entries are third-party listings;
   * both business-controlled sources agree on Kossuth tér 16. Kossuth tér 16 is
   * therefore authoritative. See docs/CONTENT-INVENTORY.md.
   */
  address: {
    street: 'Kossuth tér 16.',
    postalCode: '3000',
    city: 'Hatvan',
    country: 'Magyarország',
    countryCode: 'HU',
    /** Kossuth tér 16 (OpenStreetMap node 3387822153). */
    geo: { latitude: 47.6667312, longitude: 19.6824158 },
  },

  /** Consistent across Facebook, Foodora and both directory listings. */
  phone: { display: '+36 20 932 3270', href: 'tel:+36209323270' },

  /**
   * OPENING HOURS — from the restaurant's own Facebook page
   * ("Nyitva: Kedd - Vasárnap, 11-22 h").
   *
   * NEEDS CLIENT CONFIRMATION: nyitva.hu lists 11:00–21:00 (updated 2026-05-22)
   * and Foodora's delivery window closes at 20:30. Delivery closing earlier than
   * the dining room is normal, but the 21:00 / 22:00 difference is not resolvable
   * from public sources.
   */
  hours: [
    { day: 'Hétfő', dayShort: 'H', opens: null, closes: null, schemaDay: 'Monday' },
    { day: 'Kedd', dayShort: 'K', opens: '11:00', closes: '22:00', schemaDay: 'Tuesday' },
    { day: 'Szerda', dayShort: 'Sze', opens: '11:00', closes: '22:00', schemaDay: 'Wednesday' },
    { day: 'Csütörtök', dayShort: 'Cs', opens: '11:00', closes: '22:00', schemaDay: 'Thursday' },
    { day: 'Péntek', dayShort: 'P', opens: '11:00', closes: '22:00', schemaDay: 'Friday' },
    { day: 'Szombat', dayShort: 'Szo', opens: '11:00', closes: '22:00', schemaDay: 'Saturday' },
    { day: 'Vasárnap', dayShort: 'V', opens: '11:00', closes: '22:00', schemaDay: 'Sunday' },
  ],

  /** Foodora's own delivery window, shown separately so the two are never conflated. */
  deliveryHoursNote: 'A Foodora kiszállítás kedd–vasárnap 11:00–20:30 között él.',

  /** From the Facebook page's service tags. */
  services: ['Fogyasztás helyben', 'Elvitel', 'Szabadtéri ülőhelyek', 'Házhozszállítás'],

  /** The oven model is legible on the oven itself in the restaurant's photographs. */
  oven: 'MP Forni',

  /** Announced on the restaurant's Facebook page. */
  openedOn: '2024-10-22',

  priceRange: '$$',
  currency: 'HUF',
} as const;

/* -------------------------------------------------------------------------- */
/* External links                                                               */
/* -------------------------------------------------------------------------- */

export const links = {
  /** Ordering is Foodora's job. This site never takes an order itself. */
  foodora: 'https://www.foodora.hu/restaurant/tclu/enzo-di-napoli',
  facebook: 'https://www.facebook.com/profile.php?id=61566147444470',
  /** Handle published on the restaurant's Facebook page. */
  instagram: 'https://www.instagram.com/enzo_di_napoli_hatvan/',
  turul: 'https://www.gasztronomiaturul.eu/profile-140459-enzo-di-napoli',
} as const;

/** Google Maps deep links, built from the resolved address so they can never drift. */
const mapsQuery = encodeURIComponent(
  `${restaurant.name}, ${restaurant.address.street} ${restaurant.address.postalCode} ${restaurant.address.city}`,
);

export const maps = {
  directions: `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`,
  place: `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`,
  /** Keyless embed — no API key to leak, no consent-gated third-party cookie on load. */
  embed: `https://maps.google.com/maps?q=${mapsQuery}&z=17&output=embed`,
} as const;

/* -------------------------------------------------------------------------- */
/* Recognition                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Turul Gasztronómia awards, read from the restaurant's public profile.
 * Only what the profile actually shows. No award is inferred or rounded up.
 */
export const awards = [
  { year: 2026, title: 'Arany fokozat', issuer: 'Turul Gasztronómia' },
  { year: 2026, title: 'Projekt díjazottja', issuer: 'Turul Gasztronómia' },
  { year: 2025, title: 'Arany fokozat', issuer: 'Turul Gasztronómia' },
  { year: 2025, title: 'Projekt díjazottja', issuer: 'Turul Gasztronómia' },
] as const;

/**
 * Aggregate ratings, each from a named platform with its own count.
 *
 * These are the site's social proof. Individual guest quotes are deliberately
 * absent: no verifiable review text was available to license or attribute, and a
 * plausible-sounding invented testimonial is exactly the thing this project
 * refuses to ship. See docs/CONTENT-INVENTORY.md for how to add real ones.
 */
export const ratings = [
  {
    source: 'Turul Gasztronómia',
    value: '9,7',
    scale: '10',
    count: 413,
    countLabel: 'értékelés',
    href: links.turul,
  },
  {
    source: 'Foodora',
    value: '4,9',
    scale: '5',
    count: 335,
    countLabel: 'értékelés',
    href: links.foodora,
  },
  {
    source: 'Facebook',
    value: '100%',
    scale: null,
    count: 54,
    countLabel: 'ajánlás',
    href: links.facebook,
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Derived helpers                                                              */
/* -------------------------------------------------------------------------- */

export const fullAddress = `${restaurant.address.street}, ${restaurant.address.postalCode} ${restaurant.address.city}`;

/** "Kedd–Vasárnap 11:00–22:00" — collapses consecutive days that share a window. */
export function summarizeHours(): string {
  const open = restaurant.hours.filter((h) => h.opens !== null);
  if (open.length === 0) return 'Jelenleg zárva';
  const first = open[0];
  const last = open[open.length - 1];
  if (!first?.opens || !last) return 'Jelenleg zárva';
  const sameWindow = open.every((h) => h.opens === first.opens && h.closes === first.closes);
  if (!sameWindow) return 'Lásd a nyitvatartást';
  return open.length === 1
    ? `${first.day} ${first.opens}–${first.closes}`
    : `${first.day}–${last.day} ${first.opens}–${first.closes}`;
}

/** Schema.org openingHoursSpecification, built from the same array the page renders. */
export function openingHoursSpecification() {
  return restaurant.hours
    .filter((h) => h.opens !== null && h.closes !== null)
    .map((h) => ({
      '@type': 'OpeningHoursSpecification' as const,
      dayOfWeek: `https://schema.org/${h.schemaDay}`,
      opens: h.opens as string,
      closes: h.closes as string,
    }));
}
