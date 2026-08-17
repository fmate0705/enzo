import { describe, expect, it } from 'vitest';
import {
  categories,
  formatPrice,
  imageAltOf,
  ingredientsOf,
  menu,
  menuBySlug,
  relatedTo,
  signatureItems,
} from '@/content/menu';
import { fullAddress, openingHoursSpecification, restaurant } from '@/content/restaurant';
import { galleryImages } from '@/content/gallery';

/**
 * These tests guard the facts, not the markup.
 *
 * The expensive mistakes on a restaurant site are a wrong address, a stale
 * price, a dish whose photograph does not exist, and structured data that
 * claims something the page does not say. Each of those is asserted here so a
 * later edit cannot reintroduce one quietly.
 */

describe('address', () => {
  it('is the one resolved from the business-controlled sources', () => {
    expect(restaurant.address.street).toBe('Kossuth tér 16.');
    expect(restaurant.address.postalCode).toBe('3000');
    expect(restaurant.address.city).toBe('Hatvan');
    expect(fullAddress).toBe('Kossuth tér 16., 3000 Hatvan');
  });

  it('never mentions the conflicting directory address anywhere in the data layer', () => {
    const serialised = JSON.stringify({ restaurant, menu, galleryImages });
    expect(serialised).not.toMatch(/Horváth Mihály/i);
  });

  it('places the map pin on the same street the page prints', () => {
    // Kossuth tér is around 19.682E; Horváth Mihály út is around 19.689E.
    expect(restaurant.address.geo.longitude).toBeGreaterThan(19.68);
    expect(restaurant.address.geo.longitude).toBeLessThan(19.685);
    expect(restaurant.address.geo.latitude).toBeCloseTo(47.6667, 3);
  });
});

describe('menu data', () => {
  it('has a unique slug and id for every item', () => {
    expect(new Set(menu.map((i) => i.slug)).size).toBe(menu.length);
    expect(new Set(menu.map((i) => i.id)).size).toBe(menu.length);
  });

  it('puts every item in a declared category', () => {
    const ids = new Set(categories.map((c) => c.id));
    for (const item of menu) expect(ids.has(item.category)).toBe(true);
  });

  it('leaves no category empty', () => {
    for (const category of categories) {
      expect(menu.some((i) => i.category === category.id)).toBe(true);
    }
  });

  it('prices every item in whole forints above zero', () => {
    for (const item of menu) {
      expect(item.price).toBeGreaterThan(0);
      expect(Number.isInteger(item.price)).toBe(true);
    }
  });

  it('names every photograph after its own dish, in the food image directory', () => {
    // The convention is the point: directory and basename must track the slug,
    // so a renamed dish cannot quietly keep pointing at another dish's picture.
    // The FORMAT is not part of the convention — the pizzas are cut-out PNGs
    // with an alpha channel and everything else is a JPEG photograph — and
    // pinning it here only encoded the state of the asset folder on one day.
    // That a file actually exists at each path is covered in assets.test.ts.
    for (const item of menu) {
      if (item.image === null) continue;
      expect(item.image).toMatch(
        new RegExp(`^/images/etelek/${item.slug}\\.(jpg|jpeg|png|webp|avif)$`),
      );
    }
  });

  it('gives the home page five signature dishes', () => {
    expect(signatureItems()).toHaveLength(5);
  });

  it('formats forints in Hungarian without decimals', () => {
    // Hungarian groups thousands with a space, and which space ICU picks
    // (U+0020, U+00A0 or the narrow U+202F) varies by Node build. Strip every
    // Unicode space and assert on the digits and the currency instead.
    expect(formatPrice(2900).replace(/\p{White_Space}/gu, '')).toBe('2900Ft');
  });

  it('splits ingredients without inventing or dropping any', () => {
    const margherita = menuBySlug.get('margherita');
    expect(margherita).toBeDefined();
    const parts = ingredientsOf(margherita!);
    expect(parts).toEqual([
      'paradicsomszósz',
      'Fior di Latte mozzarella sajt',
      'bazsalikom',
      'olívaolaj',
    ]);
  });

  it('describes focaccia as bread rather than pizza', () => {
    const focaccia = menuBySlug.get('focaccia-rozmaring');
    expect(imageAltOf(focaccia!)).toContain('focaccia');
    expect(imageAltOf(focaccia!)).not.toContain('pizza');
  });

  it('never suggests an item as related to itself', () => {
    for (const item of menu) {
      expect(relatedTo(item).some((r) => r.slug === item.slug)).toBe(false);
    }
  });
});

describe('gallery', () => {
  it('resolves every menu-derived photograph', () => {
    // content/gallery.ts throws at module load if a slug has no image, so
    // reaching this point already proves the references are sound.
    expect(galleryImages.length).toBeGreaterThan(0);
  });

  it('gives every image alt text and intrinsic dimensions', () => {
    for (const image of galleryImages) {
      expect(image.alt.length).toBeGreaterThan(10);
      expect(image.width).toBeGreaterThan(0);
      expect(image.height).toBeGreaterThan(0);
    }
  });

  it('uses each photograph once', () => {
    expect(new Set(galleryImages.map((i) => i.src)).size).toBe(galleryImages.length);
  });
});

describe('opening hours', () => {
  it('marks Monday closed and every other day open', () => {
    const monday = restaurant.hours.find((h) => h.schemaDay === 'Monday');
    expect(monday?.opens).toBeNull();
    expect(restaurant.hours.filter((h) => h.opens !== null)).toHaveLength(6);
  });

  it('emits only open days to structured data', () => {
    const spec = openingHoursSpecification();
    expect(spec).toHaveLength(6);
    expect(spec.some((s) => s.dayOfWeek.endsWith('Monday'))).toBe(false);
  });
});
