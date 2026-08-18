import { categories, type CategoryId, type MenuItem } from '@/content/menu';
import {
  FEATURED_COUNT,
  LEGAL_DOCS,
  type LegalDoc,
  type LegalDocId,
  type SiteContent,
} from './types';

/**
 * Coerces unknown data into a valid SiteContent.
 *
 * Used on every read from disk and every write, so the same rules apply whether
 * the data came from the admin form, a hand-edited file, or an older release.
 * The strategy throughout is "repair towards the default" rather than "throw":
 * a restaurant site that refuses to render because one price is a string is
 * worse than one that falls back to the reviewed value and logs.
 *
 * It is also the last line of defence for the public pages — every string that
 * reaches a template has had its length bounded and its control characters
 * stripped here.
 */

/** Strips control characters and caps length. Applied to every stored string. */
function text(value: unknown, fallback: string, maxLength = 400): string {
  if (typeof value !== 'string') return fallback;
  // eslint-disable-next-line no-control-regex -- stripping C0/C1 controls is the point
  const cleaned = value.replace(/[\u0000-\u001F\u007F-\u009F]/g, '').trim();
  return cleaned.slice(0, maxLength);
}

/** Long-form text keeps newlines and tabs; everything else is still stripped. */
function longText(value: unknown, fallback: string, maxLength = 40_000): string {
  if (typeof value !== 'string') return fallback;
  const cleaned = value
    .replace(/\r\n/g, '\n')
    // eslint-disable-next-line no-control-regex -- keep \n (000A) and \t (0009)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '');
  return cleaned.slice(0, maxLength);
}

function bool(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function int(value: unknown, fallback: number, min: number, max: number): number {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

function float(value: unknown, fallback: number, min: number, max: number): number {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

const CATEGORY_IDS = new Set<string>(categories.map((c) => c.id));

/** Slugs address filesystem paths and URLs, so the character set is restricted. */
export function toSlug(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/**
 * Image paths must stay inside the project's own image directories.
 *
 * The admin picks from existing files rather than uploading, so anything that
 * is not one of those paths is rejected outright — this closes path traversal
 * and stops an arbitrary remote URL being rendered as a dish photograph.
 */
function imagePath(value: unknown, fallback: string | null): string | null {
  if (value === null) return null;
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  if (trimmed === '') return null;
  const allowed = /^\/images\/(etelek|etterem)\/[a-z0-9][a-z0-9-]*\.(jpg|jpeg|png|webp|avif)$/;
  if (!allowed.test(trimmed)) return fallback;
  return trimmed;
}

function menuItem(value: unknown, fallback: MenuItem | undefined): MenuItem | null {
  if (typeof value !== 'object' || value === null) return fallback ?? null;
  const raw = value as Record<string, unknown>;

  const name = text(raw.name, fallback?.name ?? '', 120);
  if (name === '') return null; // an unnamed dish is not a dish

  const slugSource = typeof raw.slug === 'string' && raw.slug.trim() !== '' ? raw.slug : name;
  const slug = toSlug(slugSource) || toSlug(name);
  if (slug === '') return null;

  const category = CATEGORY_IDS.has(String(raw.category))
    ? (String(raw.category) as CategoryId)
    : (fallback?.category ?? 'pizzak');

  return {
    id: text(raw.id, fallback?.id ?? slug, 40) || slug,
    slug,
    name,
    category,
    description: text(raw.description, fallback?.description ?? '', 600),
    // Prices are whole forints. The cap is a sanity bound, not a business rule —
    // it stops a typo turning into a 9-digit price on a public page.
    price: int(raw.price, fallback?.price ?? 0, 0, 10_000_000),
    priceFrom: bool(raw.priceFrom, fallback?.priceFrom ?? false),
    image: imagePath(raw.image, fallback?.image ?? null),
    popular: bool(raw.popular, fallback?.popular ?? false),
    signature: bool(raw.signature, fallback?.signature ?? false),
  };
}

function legalDoc(value: unknown, fallback: LegalDoc): LegalDoc {
  if (typeof value !== 'object' || value === null) return fallback;
  const raw = value as Record<string, unknown>;
  return {
    title: text(raw.title, fallback.title, 120) || fallback.title,
    lede: text(raw.lede, fallback.lede, 400),
    updated: text(raw.updated, fallback.updated, 60),
    body: longText(raw.body, fallback.body),
    draft: bool(raw.draft, fallback.draft),
  };
}

export function sanitizeContent(value: unknown, fallback: SiteContent): SiteContent {
  if (typeof value !== 'object' || value === null) return fallback;
  const raw = value as Record<string, unknown>;

  // ---- Menu --------------------------------------------------------------
  const rawMenu = Array.isArray(raw.menu) ? raw.menu : [];
  const byId = new Map(fallback.menu.map((item) => [item.id, item]));
  const seenSlugs = new Set<string>();
  const menu: MenuItem[] = [];

  for (const entry of rawMenu.slice(0, 300)) {
    const id =
      typeof entry === 'object' && entry !== null ? String((entry as { id?: unknown }).id) : '';
    const item = menuItem(entry, byId.get(id));
    if (!item) continue;
    // Slugs are routes. A duplicate would make one dish unreachable, so the
    // later one is suffixed rather than silently dropped.
    let slug = item.slug;
    let suffix = 2;
    while (seenSlugs.has(slug)) slug = `${item.slug}-${suffix++}`;
    seenSlugs.add(slug);
    menu.push({ ...item, slug });
  }

  // ---- Contact -----------------------------------------------------------
  const rawContact = (
    typeof raw.contact === 'object' && raw.contact !== null ? raw.contact : {}
  ) as Record<string, unknown>;
  const fc = fallback.contact;

  const rawHours = Array.isArray(rawContact.hours) ? rawContact.hours : [];
  const hours = fc.hours.map((day, index) => {
    const entry = (
      typeof rawHours[index] === 'object' && rawHours[index] !== null ? rawHours[index] : {}
    ) as Record<string, unknown>;
    const opens = entry.opens === null ? null : text(entry.opens, day.opens ?? '', 5);
    const closes = entry.closes === null ? null : text(entry.closes, day.closes ?? '', 5);
    const valid = (t: string | null) => (t && /^\d{1,2}:\d{2}$/.test(t) ? t : null);
    const o = valid(opens);
    const c = valid(closes);
    // A day is open only if both ends parse; a half-filled row reads as closed
    // rather than as an open-ended one.
    return { ...day, opens: o && c ? o : null, closes: o && c ? c : null };
  });

  const phoneDisplay = text(rawContact.phoneDisplay, fc.phoneDisplay, 40);

  const contact = {
    street: text(rawContact.street, fc.street, 120),
    postalCode: text(rawContact.postalCode, fc.postalCode, 12),
    city: text(rawContact.city, fc.city, 80),
    country: text(rawContact.country, fc.country, 80),
    latitude: float(rawContact.latitude, fc.latitude, -90, 90),
    longitude: float(rawContact.longitude, fc.longitude, -180, 180),
    phoneDisplay,
    // Derived, never taken from input — a tel: href is a link target.
    phoneHref: `tel:${phoneDisplay.replace(/[^\d+]/g, '')}`,
    hours,
    deliveryHoursNote: text(rawContact.deliveryHoursNote, fc.deliveryHoursNote, 300),
    services: (Array.isArray(rawContact.services) ? rawContact.services : fc.services)
      .slice(0, 12)
      .map((s) => text(s, '', 60))
      .filter((s) => s !== ''),
    foodoraUrl: httpsUrl(rawContact.foodoraUrl, fc.foodoraUrl),
    facebookUrl: httpsUrl(rawContact.facebookUrl, fc.facebookUrl),
    instagramUrl: httpsUrl(rawContact.instagramUrl, fc.instagramUrl),
    turulUrl: httpsUrl(rawContact.turulUrl, fc.turulUrl),
  };

  // ---- Company -----------------------------------------------------------
  const rawCompany = (
    typeof raw.company === 'object' && raw.company !== null ? raw.company : {}
  ) as Record<string, unknown>;
  const company = { ...fallback.company };
  for (const key of Object.keys(company) as (keyof typeof company)[]) {
    company[key] = text(rawCompany[key], '', 400);
  }

  // ---- Legal -------------------------------------------------------------
  const rawLegal = (typeof raw.legal === 'object' && raw.legal !== null ? raw.legal : {}) as Record<
    string,
    unknown
  >;
  const legal = {} as Record<LegalDocId, LegalDoc>;
  for (const doc of LEGAL_DOCS) {
    legal[doc.id] = legalDoc(rawLegal[doc.id], fallback.legal[doc.id]);
  }

  // ---- Featured ----------------------------------------------------------
  // Validated against the menu that just survived sanitising, not against the
  // input: a slug that no longer exists would render an empty home page section
  // with no error anywhere. Deduped and capped, and order is preserved because
  // order is the whole point of the field.
  const finalMenu = menu.length > 0 ? menu : fallback.menu;
  const sellable = new Set(finalMenu.filter((i) => i.category === 'pizzak').map((i) => i.slug));
  const rawFeatured = Array.isArray(raw.featured) ? raw.featured : fallback.featured;
  const featured: string[] = [];
  for (const entry of rawFeatured) {
    if (typeof entry !== 'string') continue;
    const slug = entry.trim();
    if (!sellable.has(slug) || featured.includes(slug)) continue;
    featured.push(slug);
    if (featured.length === FEATURED_COUNT) break;
  }

  return {
    version: int(raw.version, fallback.version, 0, 1000),
    updatedAt: text(raw.updatedAt, fallback.updatedAt, 40),
    menu: finalMenu,
    featured,
    contact,
    company,
    legal,
  };
}

/** External links are rendered as anchors, so only http(s) is accepted. */
function httpsUrl(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  if (trimmed === '') return '';
  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return fallback;
    return url.toString();
  } catch {
    return fallback;
  }
}
