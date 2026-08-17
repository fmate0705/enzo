import type { SiteContent } from './types';

/**
 * Reconciles a stored document with the assets that actually ship.
 *
 * The problem this solves is specific and silent. Dish photographs are part of
 * the repository, but the path to each one is part of the STORE, because the
 * admin can pick a different picture for a dish. So when a photograph is
 * replaced by a different format — the pizzas went from `.jpg` to cut-out
 * `.png` — the files on disk change and the saved paths do not. Every pizza
 * then points at a file that no longer exists, and next/image renders nothing:
 * no error, no log, just nineteen empty squares.
 *
 * Editing the JSON by hand fixes one machine. It does not fix the production
 * volume, which holds its own copy of the document and is the whole reason the
 * volume exists. Hence a migration at read time.
 *
 * The rule is deliberately narrow:
 *
 *   stored and default differ ONLY in file extension  ->  take the default
 *   anything else                                     ->  leave it alone
 *
 * Same basename means this is the same photograph in a new format, which the
 * admin never chose and cannot have meant. A different basename means someone
 * picked a different picture in the editor, and that choice is theirs to keep.
 *
 * Applied on read rather than written back, so it costs nothing when there is
 * nothing to fix, needs no version bump, and never writes to disk during a
 * render. The corrected paths persist naturally the next time the admin saves.
 */
const withoutExtension = (path: string) => path.replace(/\.[a-z0-9]+$/i, '');

export function migrateContent(stored: SiteContent, defaults: SiteContent): SiteContent {
  const defaultsBySlug = new Map(defaults.menu.map((item) => [item.slug, item]));
  let changed = false;

  const menu = stored.menu.map((item) => {
    const shipped = defaultsBySlug.get(item.slug);
    if (!shipped?.image || !item.image) return item;
    if (item.image === shipped.image) return item;
    // A genuine editorial choice — a different picture, not a different format.
    if (withoutExtension(item.image) !== withoutExtension(shipped.image)) return item;

    changed = true;
    return { ...item, image: shipped.image };
  });

  return changed ? { ...stored, menu } : stored;
}
