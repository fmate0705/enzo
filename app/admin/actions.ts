'use server';

import { revalidatePath } from 'next/cache';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { timingSafeEqual } from 'node:crypto';
import { verifyPassword } from '@/lib/auth/password';
import { checkLoginRate, clearLoginRate, clientKey } from '@/lib/auth/rate-limit';
import {
  createSessionToken,
  requireSession,
  SESSION_COOKIE,
  sessionCookieOptions,
} from '@/lib/auth/session';
import { getContent, updateContent } from '@/lib/store/store';
import { toSlug } from '@/lib/store/validate';
import {
  FEATURED_COUNT,
  LEGAL_DOCS,
  type CompanyContent,
  type LegalDocId,
  type MenuItem,
} from '@/lib/store/types';
import { categories, type CategoryId } from '@/content/menu';

/**
 * Every mutation on this site.
 *
 * Server Actions are POST endpoints reachable by anyone who can guess their id,
 * so each one begins with `requireSession()`. Middleware guards navigation to
 * /admin; this is the boundary that actually protects the data.
 *
 * Next verifies the Origin header against the Host for Server Actions, which
 * together with the SameSite=Strict session cookie is the CSRF story here.
 */

export interface ActionState {
  ok: boolean;
  message: string;
}

/* -------------------------------------------------------------------------- */
/* Session                                                                     */
/* -------------------------------------------------------------------------- */

/** Constant-time string compare that does not leak length through early exit. */
function safeEquals(a: string, b: string): boolean {
  const left = Buffer.from(a.normalize('NFKC'));
  const right = Buffer.from(b.normalize('NFKC'));
  if (left.length !== right.length) {
    // Still burn a comparison so the timing does not advertise a length match.
    timingSafeEqual(left, left);
    return false;
  }
  return timingSafeEqual(left, right);
}

export async function login(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const username = String(formData.get('username') ?? '');
  const password = String(formData.get('password') ?? '');
  const next = String(formData.get('next') ?? '');

  const rate = checkLoginRate(clientKey(await headers()));
  if (!rate.allowed) {
    const minutes = Math.ceil(rate.retryAfterSeconds / 60);
    return {
      ok: false,
      message: `Túl sok sikertelen próbálkozás. Próbálja újra ${minutes} perc múlva.`,
    };
  }

  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedHash = process.env.ADMIN_PASSWORD_HASH;

  if (!expectedUser || !expectedHash) {
    console.error('ADMIN_USERNAME or ADMIN_PASSWORD_HASH is not configured.');
    return { ok: false, message: 'A belépés nincs beállítva. Keresse a fejlesztőt.' };
  }

  // Both checks always run: returning early on a bad username would let an
  // attacker enumerate the account name from the response time.
  const userOk = safeEquals(username, expectedUser);
  const passwordOk = await verifyPassword(password, expectedHash);

  if (!userOk || !passwordOk) {
    // One message for both failures — never "no such user".
    return { ok: false, message: 'Hibás felhasználónév vagy jelszó.' };
  }

  clearLoginRate(clientKey(await headers()));

  const token = await createSessionToken(expectedUser);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, sessionCookieOptions());

  // Only ever redirect to a path inside /admin. Taking the raw value would be
  // an open redirect.
  const destination = next.startsWith('/admin/') && !next.startsWith('/admin//') ? next : '/admin';
  redirect(destination);
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect('/admin/belepes');
}

/* -------------------------------------------------------------------------- */
/* Revalidation                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Rebuilds every page that reads the store.
 *
 * The public site is statically rendered; without this an edit would not appear
 * until the next deploy. Paths are listed explicitly rather than using
 * `revalidatePath('/', 'layout')` so it is obvious what an edit affects.
 */
async function revalidateSite(): Promise<void> {
  const content = await getContent();
  revalidatePath('/');
  revalidatePath('/etlap');
  revalidatePath('/tortenet');
  revalidatePath('/galeria');
  revalidatePath('/megkozelites');
  revalidatePath('/sitemap.xml');
  for (const doc of LEGAL_DOCS) revalidatePath(doc.route);
  for (const item of content.menu) revalidatePath(`/etlap/${item.slug}`);
}

/* -------------------------------------------------------------------------- */
/* Menu                                                                        */
/* -------------------------------------------------------------------------- */

const CATEGORY_IDS = new Set<string>(categories.map((c) => c.id));

function readMenuItem(formData: FormData, index: number, fallbackId: string): MenuItem {
  const get = (field: string) => String(formData.get(`${field}.${index}`) ?? '').trim();
  const name = get('name');
  const rawCategory = get('category');

  return {
    id: get('id') || fallbackId,
    slug: toSlug(get('slug') || name),
    name,
    category: (CATEGORY_IDS.has(rawCategory) ? rawCategory : 'pizzak') as CategoryId,
    description: get('description'),
    price: Number.parseInt(get('price'), 10) || 0,
    priceFrom: formData.get(`priceFrom.${index}`) === 'on',
    image: get('image') === '' ? null : get('image'),
    popular: formData.get(`popular.${index}`) === 'on',
    signature: formData.get(`signature.${index}`) === 'on',
  };
}

export async function saveMenu(_previous: ActionState, formData: FormData): Promise<ActionState> {
  await requireSession();

  const count = Number.parseInt(String(formData.get('count') ?? '0'), 10);
  if (!Number.isFinite(count) || count < 0 || count > 300) {
    return { ok: false, message: 'Érvénytelen űrlap.' };
  }

  const removed = new Set(formData.getAll('remove').map(String));
  const items: MenuItem[] = [];

  for (let index = 0; index < count; index += 1) {
    const id = String(formData.get(`id.${index}`) ?? '');
    if (removed.has(id)) continue;
    const item = readMenuItem(formData, index, `item-${Date.now()}-${index}`);
    // A row with no name is an empty row the operator left alone, not a delete.
    if (item.name === '') continue;
    items.push(item);
  }

  if (items.length === 0) {
    return { ok: false, message: 'Az étlap nem lehet üres.' };
  }

  // The store sanitises again on write; this is the friendly-message pass.
  await updateContent((current) => ({ ...current, menu: items }));
  await revalidateSite();

  const removedCount = count - items.length;
  return {
    ok: true,
    message:
      removedCount > 0
        ? `Mentve — ${items.length} tétel, ${removedCount} törölve.`
        : `Mentve — ${items.length} tétel.`,
  };
}

/**
 * Saves which pizzas the home page features, and in what order.
 *
 * The order of the submitted fields IS the order on the home page, which is why
 * the form posts one field per slot rather than a set of checkboxes: a checkbox
 * group has no order, and "which three" was never the whole question.
 *
 * Blank slots are dropped rather than rejected. An operator clearing a slot to
 * show two pizzas is making a choice; refusing to save it would be pedantry.
 * The store sanitises again on write — unknown or duplicate slugs cannot get in.
 */
export async function saveFeatured(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireSession();

  const slugs: string[] = [];
  for (let slot = 0; slot < FEATURED_COUNT; slot += 1) {
    const slug = String(formData.get(`featured.${slot}`) ?? '').trim();
    if (slug !== '' && !slugs.includes(slug)) slugs.push(slug);
  }

  await updateContent((current) => ({ ...current, featured: slugs }));
  await revalidateSite();

  return {
    ok: true,
    message:
      slugs.length === 0
        ? 'Mentve — nincs kiemelt pizza, a főoldal az alapértelmezettet mutatja.'
        : `Mentve — ${slugs.length} kiemelt pizza a főoldalon.`,
  };
}

export async function addMenuItem(): Promise<void> {
  await requireSession();
  await updateContent((current) => ({
    ...current,
    menu: [
      ...current.menu,
      {
        id: `item-${Date.now()}`,
        slug: `uj-tetel-${current.menu.length + 1}`,
        name: 'Új tétel',
        category: 'pizzak',
        description: '',
        price: 0,
        priceFrom: false,
        image: null,
        popular: false,
        signature: false,
      },
    ],
  }));
  await revalidateSite();
}

/* -------------------------------------------------------------------------- */
/* Contact and hours                                                           */
/* -------------------------------------------------------------------------- */

export async function saveContact(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireSession();
  const get = (field: string) => String(formData.get(field) ?? '').trim();

  await updateContent((current) => ({
    ...current,
    contact: {
      ...current.contact,
      street: get('street'),
      postalCode: get('postalCode'),
      city: get('city'),
      country: get('country'),
      latitude: Number.parseFloat(get('latitude')) || current.contact.latitude,
      longitude: Number.parseFloat(get('longitude')) || current.contact.longitude,
      phoneDisplay: get('phoneDisplay'),
      phoneHref: current.contact.phoneHref, // recomputed by the sanitiser
      deliveryHoursNote: get('deliveryHoursNote'),
      services: get('services')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      foodoraUrl: get('foodoraUrl'),
      facebookUrl: get('facebookUrl'),
      instagramUrl: get('instagramUrl'),
      turulUrl: get('turulUrl'),
      hours: current.contact.hours.map((day, index) => {
        const closed = formData.get(`closed.${index}`) === 'on';
        return {
          ...day,
          opens: closed ? null : String(formData.get(`opens.${index}`) ?? '').trim(),
          closes: closed ? null : String(formData.get(`closes.${index}`) ?? '').trim(),
        };
      }),
    },
  }));

  await revalidateSite();
  return { ok: true, message: 'Elérhetőség és nyitvatartás mentve.' };
}

/* -------------------------------------------------------------------------- */
/* Company                                                                     */
/* -------------------------------------------------------------------------- */

export async function saveCompany(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireSession();

  await updateContent((current) => {
    const company = { ...current.company };
    for (const key of Object.keys(company) as (keyof CompanyContent)[]) {
      company[key] = String(formData.get(key) ?? '').trim();
    }
    return { ...current, company };
  });

  await revalidateSite();
  const content = await getContent();
  const outstanding = Object.values(content.company).filter((v) => v.trim() === '').length;
  return {
    ok: true,
    message:
      outstanding === 0
        ? 'Céges adatok mentve — minden mező kitöltve.'
        : `Mentve. Még ${outstanding} mező üres, ezek a jogi oldalakon kiemelve jelennek meg.`,
  };
}

/* -------------------------------------------------------------------------- */
/* Legal documents                                                             */
/* -------------------------------------------------------------------------- */

export async function saveLegalDoc(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireSession();

  const id = String(formData.get('id') ?? '') as LegalDocId;
  if (!LEGAL_DOCS.some((doc) => doc.id === id)) {
    return { ok: false, message: 'Ismeretlen dokumentum.' };
  }

  await updateContent((current) => ({
    ...current,
    legal: {
      ...current.legal,
      [id]: {
        title: String(formData.get('title') ?? '').trim(),
        lede: String(formData.get('lede') ?? '').trim(),
        updated: String(formData.get('updated') ?? '').trim(),
        body: String(formData.get('body') ?? ''),
        // Unchecked means "reviewed and approved", so the banner comes off.
        draft: formData.get('draft') === 'on',
      },
    },
  }));

  await revalidateSite();
  return { ok: true, message: 'Dokumentum mentve.' };
}
