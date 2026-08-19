import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { menu } from '@/content/menu';
import { galleryImages } from '@/content/gallery';
import { resolveImagePath, resetImageIndex } from '@/lib/images';

/**
 * Every image path the site can render must resolve to a file that exists.
 *
 * The earlier version of this file checked only `content/menu.ts`. That is the
 * seed, and the seed is not what renders once a store exists — so when the
 * pizzas were re-shot and the store kept the old `.jpg` paths, this suite went
 * green while nineteen images 404'd on the live menu. The store is now checked
 * too, and so is the resolver that reconciles them.
 */

const PUBLIC_DIR = join(process.cwd(), 'public');
const CONTENT_PATH = join(
  process.env.CONTENT_DATA_DIR ?? join(process.cwd(), 'data'),
  'content.json',
);

describe('seed image paths', () => {
  it('points every dish photograph at a file that exists', () => {
    const missing = menu
      .filter((item) => item.image !== null)
      .map((item) => item.image as string)
      .filter((path) => !existsSync(join(PUBLIC_DIR, path)));
    expect(missing).toEqual([]);
  });

  it('points every gallery photograph at a file that exists', () => {
    const missing = galleryImages
      .map((image) => image.src)
      .filter((path) => !existsSync(join(PUBLIC_DIR, path)));
    expect(missing).toEqual([]);
  });

  it('has the restaurant photographs the pages reference directly', () => {
    const referenced = [
      '/images/etterem/kemence-belso.jpg',
      '/images/etterem/kemence-belso-hideg.jpg',
      '/images/etterem/kemence-pizza.jpg',
      '/images/etterem/kemence-parban.jpg',
      '/images/etterem/kemence.webp',
      '/images/etterem/bejarat.jpg',
      '/images/etterem/utcafront.webp',
      '/images/etterem/belso-1.webp',
      '/images/etterem/belso-3.webp',
      '/images/etterem/foodora-listing.jpg',
    ];
    expect(referenced.filter((path) => !existsSync(join(PUBLIC_DIR, path)))).toEqual([]);
  });

  it('ships the hero video the desktop hero scrubs', () => {
    expect(existsSync(join(PUBLIC_DIR, 'video/kemence-belso.mp4'))).toBe(true);
  });
});

describe('stored image paths', () => {
  it('resolves every image the content store holds', async () => {
    if (!existsSync(CONTENT_PATH)) {
      // No store on this machine — the seed tests above are the whole surface.
      return;
    }
    const { readFile } = await import('node:fs/promises');
    const stored = JSON.parse(await readFile(CONTENT_PATH, 'utf8')) as {
      menu?: { slug: string; image: string | null }[];
    };

    resetImageIndex();
    const unresolvable = (stored.menu ?? [])
      .filter((item) => item.image)
      .filter((item) => resolveImagePath(item.image) === null)
      .map((item) => `${item.slug} -> ${item.image}`);

    expect(unresolvable).toEqual([]);
  });
});

describe('image resolver', () => {
  it('returns the exact path when the file is there', () => {
    resetImageIndex();
    expect(resolveImagePath('/images/etelek/margherita.webp')).toBe(
      '/images/etelek/margherita.webp',
    );
  });

  it('recovers when only the extension changed', () => {
    // This is the failure that shipped: the store said .jpg, the files were not.
    resetImageIndex();
    expect(resolveImagePath('/images/etelek/margherita.jpg')).toBe(
      '/images/etelek/margherita.webp',
    );
  });

  it('returns null for a name that matches nothing, rather than a dead path', () => {
    resetImageIndex();
    expect(resolveImagePath('/images/etelek/nincs-ilyen-pizza.jpg')).toBeNull();
    expect(resolveImagePath(null)).toBeNull();
  });

  it('never serves a source asset from outside public/', () => {
    // The 1.9 MB source PNGs live in assets-source/ and must not be reachable.
    expect(existsSync(join(process.cwd(), 'assets-source'))).toBe(true);
    const served = readdirSync(join(PUBLIC_DIR, 'images/etelek'));
    expect(served.filter((f) => f.endsWith('.png'))).toEqual([]);
  });
});
