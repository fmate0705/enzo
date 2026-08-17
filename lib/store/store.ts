import 'server-only';

import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { cache } from 'react';
import { defaultContent } from './defaults';
import { migrateContent } from './migrate';
import { sanitizeContent } from './validate';
import { CONTENT_VERSION, type SiteContent } from './types';

/**
 * The content store.
 *
 * A single JSON document on disk. For one admin editing ~29 dishes and four
 * documents, that is the whole requirement — a database would add a service to
 * run, back up and upgrade in exchange for concurrency this site will never see.
 *
 * The path is configurable so the Docker deployment can point it at a mounted
 * volume; without a volume the file lives inside the container and is lost on
 * redeploy, which is why `deploy/DEPLOY.md` makes the mount a required step.
 */
const DATA_DIR = process.env.CONTENT_DATA_DIR ?? join(process.cwd(), 'data');
const CONTENT_PATH = join(DATA_DIR, 'content.json');

/**
 * Reads the store once per request.
 *
 * `cache()` dedupes within a single render pass, so a page that shows the menu,
 * the footer hours and the JSON-LD reads the file once rather than three times.
 * It deliberately does not cache across requests: after a save, the next request
 * must see the new content.
 */
export const getContent = cache(async (): Promise<SiteContent> => {
  const defaults = defaultContent();
  try {
    const raw = await readFile(CONTENT_PATH, 'utf8');
    const parsed: unknown = JSON.parse(raw);
    // Everything from disk is validated, not trusted. A file edited by hand, or
    // written by an older version of the app, must not be able to crash a page
    // or inject a value the UI assumes is well-formed.
    //
    // Then reconciled with the assets that actually shipped, so a photograph
    // replaced in the repo does not leave the stored path pointing at a file
    // that no longer exists. See migrate.ts — it is narrower than it sounds.
    return migrateContent(sanitizeContent(parsed, defaults), defaults);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException)?.code;
    if (code !== 'ENOENT') {
      // A corrupt or unreadable store is worth a loud log — but the site still
      // has to serve, so it falls back to the reviewed defaults.
      console.error('Content store unreadable, serving defaults instead:', error);
    }
    return defaults;
  }
});

/**
 * Replaces the store.
 *
 * Written to a temporary file and renamed into place. `rename` is atomic within
 * a filesystem, so a reader can never observe a half-written document and a
 * crash mid-write cannot destroy the previous one.
 */
export async function saveContent(next: SiteContent): Promise<void> {
  const content: SiteContent = {
    ...sanitizeContent(next, defaultContent()),
    version: CONTENT_VERSION,
    updatedAt: new Date().toISOString(),
  };

  await mkdir(dirname(CONTENT_PATH), { recursive: true });
  const temporary = `${CONTENT_PATH}.${randomUUID()}.tmp`;
  await writeFile(temporary, `${JSON.stringify(content, null, 2)}\n`, 'utf8');
  await rename(temporary, CONTENT_PATH);
}

/** Applies a change to the current content and persists the result. */
export async function updateContent(
  mutate: (current: SiteContent) => SiteContent,
): Promise<SiteContent> {
  const current = await getContent();
  // The read is cached per request, so clone before mutating to avoid handing a
  // caller a reference into what other components on this page are rendering.
  const next = mutate(structuredClone(current));
  await saveContent(next);
  return next;
}

export { CONTENT_PATH };
