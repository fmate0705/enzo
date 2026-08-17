import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { menu } from '@/content/menu';
import { galleryImages } from '@/content/gallery';

/**
 * Every image path referenced by the content layer must exist on disk.
 *
 * A broken image on a restaurant site is worse than a missing one: the layout
 * holds its space and the visitor is shown an empty rectangle where the food
 * should be. This is the cheapest possible guard against a rename.
 */

const PUBLIC_DIR = join(process.cwd(), 'public');

describe('image assets', () => {
  it('has a file for every dish photograph', () => {
    const missing = menu
      .filter((item) => item.image !== null)
      .map((item) => item.image as string)
      .filter((path) => !existsSync(join(PUBLIC_DIR, path)));
    expect(missing).toEqual([]);
  });

  it('has a file for every gallery photograph', () => {
    const missing = galleryImages
      .map((image) => image.src)
      .filter((path) => !existsSync(join(PUBLIC_DIR, path)));
    expect(missing).toEqual([]);
  });

  it('has the restaurant photographs the pages reference directly', () => {
    const referenced = [
      '/images/etterem/kemence-pizza.jpg',
      '/images/etterem/kemence-parban.jpg',
      '/images/etterem/kemence.webp',
      '/images/etterem/bejarat.jpg',
      '/images/etterem/utcafront.webp',
      '/images/etterem/belso-1.webp',
      '/images/etterem/belso-3.webp',
      '/images/etterem/foodora-listing.jpg',
    ];
    const missing = referenced.filter((path) => !existsSync(join(PUBLIC_DIR, path)));
    expect(missing).toEqual([]);
  });
});
