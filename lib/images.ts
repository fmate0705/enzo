import 'server-only';

import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Resolves a stored image path to a file that actually exists.
 *
 * The store records an explicit path like `/images/etelek/margherita.jpg`. That
 * is fine until someone replaces the photographs with a different format — which
 * is exactly what happened: nineteen pizzas were re-shot as transparent PNGs,
 * the old `.jpg` files went away, and every one of those images 404'd. The
 * seed in `content/menu.ts` was updated to match; the store was not, and the
 * store is what renders. The result was a menu with no pizzas on it.
 *
 * So the extension is treated as a hint, not a contract. If the exact file is
 * there it wins. If it is not, the basename is looked up among the images that
 * do exist, in a fixed preference order. Swapping jpg → png → webp is now a
 * matter of dropping the files in.
 *
 * Scanned once per process. Files under `public/` do not change while the server
 * runs; adding one needs a restart, which a deploy does anyway.
 */

const PUBLIC_DIR = join(process.cwd(), 'public');
const IMAGE_DIRS = ['images/etelek', 'images/etterem', 'images/brand'];

/** Smallest-first, so a directory holding several formats serves the best one. */
const PREFERENCE = ['.avif', '.webp', '.jpg', '.jpeg', '.png'];

type Index = Map<string, string>;

let index: Index | null = null;

function buildIndex(): Index {
  const byBasename: Index = new Map();

  for (const dir of IMAGE_DIRS) {
    let entries: string[];
    try {
      entries = readdirSync(join(PUBLIC_DIR, dir));
    } catch {
      continue; // a directory that does not exist simply contributes nothing
    }

    for (const file of entries) {
      const dot = file.lastIndexOf('.');
      if (dot <= 0) continue;
      const ext = file.slice(dot).toLowerCase();
      if (!PREFERENCE.includes(ext)) continue;

      const key = `${dir}/${file.slice(0, dot)}`;
      const candidate = `/${dir}/${file}`;
      const existing = byBasename.get(key);

      if (!existing) {
        byBasename.set(key, candidate);
        continue;
      }

      // Keep whichever format we would rather serve.
      const rank = (p: string) => {
        const i = PREFERENCE.indexOf(p.slice(p.lastIndexOf('.')).toLowerCase());
        return i === -1 ? PREFERENCE.length : i;
      };
      if (rank(candidate) < rank(existing)) byBasename.set(key, candidate);
    }
  }

  return byBasename;
}

function getIndex(): Index {
  if (!index) index = buildIndex();
  return index;
}

/**
 * Returns a servable path, or null when nothing matches.
 *
 * Null is a real state, not a failure: a dish with no photograph renders as a
 * typographic card. Returning a path to a file that is not there would instead
 * produce an empty rectangle where the food should be.
 */
export function resolveImagePath(stored: string | null | undefined): string | null {
  if (!stored) return null;

  // Fast path: the file is exactly where the store says it is.
  if (existsSync(join(PUBLIC_DIR, stored))) return stored;

  const dot = stored.lastIndexOf('.');
  const key = (dot > 0 ? stored.slice(0, dot) : stored).replace(/^\//, '');
  const found = getIndex().get(key);

  if (found) {
    // Loud enough to fix, quiet enough not to spam a request loop.
    warnOnce(`Image "${stored}" is missing; serving "${found}" instead.`);
    return found;
  }

  warnOnce(`Image "${stored}" is missing and no file with that name exists.`);
  return null;
}

const warned = new Set<string>();
function warnOnce(message: string): void {
  if (warned.has(message)) return;
  warned.add(message);
  console.warn(`[images] ${message}`);
}

/** Every image the admin can choose from, newest formats first. */
export function availableImages(): string[] {
  return [...getIndex().values()].sort();
}

/** Test seam — the index is process-wide and would otherwise outlive a fixture. */
export function resetImageIndex(): void {
  index = null;
  warned.clear();
}
