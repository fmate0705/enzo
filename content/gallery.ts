/**
 * The gallery.
 *
 * Every photograph is the restaurant's own — its rooms, its oven, its food.
 * Nothing is stock and nothing is generated. Intrinsic dimensions are recorded
 * so the masonry reserves the right space before an image loads and the grid
 * never shifts under the reader.
 *
 * Categories exist only where there are genuinely photographs to fill them.
 *
 * One supplied interior photograph is deliberately not included: it is lit by a
 * large green neon sign that fights the palette everywhere it appears. It is a
 * real photograph and it remains in the project's source assets — it is simply
 * not the right one for a curated gallery.
 */

import { menuBySlug } from './menu';

export type GalleryCategoryId = 'pizza' | 'kemence' | 'etterem' | 'etelek';

export interface GalleryCategory {
  readonly id: GalleryCategoryId;
  readonly name: string;
}

export interface GalleryImage {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  readonly category: GalleryCategoryId;
  /** Shown in the lightbox caption. */
  readonly caption: string;
}

export const galleryCategories: readonly GalleryCategory[] = [
  { id: 'pizza', name: 'Pizza' },
  { id: 'kemence', name: 'Kemence' },
  { id: 'etterem', name: 'Étterem' },
  { id: 'etelek', name: 'Ételek' },
];

/** Builds a gallery entry from a menu item, so a dish is described once. */
function fromMenu(slug: string, category: GalleryCategoryId): GalleryImage {
  const item = menuBySlug.get(slug);
  if (!item?.image) {
    throw new Error(`Gallery references "${slug}", which has no menu photograph.`);
  }
  return {
    src: item.image,
    alt: `${item.name} — ${item.description}`,
    width: 1200,
    height: 877,
    category,
    caption: item.name,
  };
}

export const galleryImages: readonly GalleryImage[] = [
  // ---- Kemence ------------------------------------------------------------
  {
    src: '/images/etterem/kemence-pizza.jpg',
    alt: 'Burrata pizza az MP Forni kemence szájánál, foltosan megsült peremmel',
    width: 1200,
    height: 1600,
    category: 'kemence',
    caption: 'A kemence szája',
  },
  {
    src: '/images/etterem/kemence.webp',
    alt: 'Az MP Forni kupolás pizzakemence sárgaréz mozaikborítással',
    width: 382,
    height: 510,
    category: 'kemence',
    caption: 'MP Forni · AVPN',
  },
  {
    src: '/images/etterem/kemence-parban.jpg',
    alt: 'Frissen sült pizza a kemence izzó szája előtt, bazsalikomcserepek között',
    width: 516,
    height: 387,
    category: 'kemence',
    caption: 'Bazsalikom és tűz',
  },

  // ---- Étterem ------------------------------------------------------------
  {
    src: '/images/etterem/bejarat.jpg',
    alt: 'Az Enzo di Napoli boltíves bejárata aranyszínű logóval, citrusfákkal a két oldalán',
    width: 720,
    height: 960,
    category: 'etterem',
    caption: 'Bejárat · Kossuth tér 16.',
  },
  {
    src: '/images/etterem/utcafront.webp',
    alt: 'Az étterem utcafronti terasza napsütésben, sárga napernyővel',
    width: 423,
    height: 510,
    category: 'etterem',
    caption: 'Terasz',
  },
  {
    src: '/images/etterem/belso-3.webp',
    alt: 'Az étterem belső tere: sötét fa asztalok, meleg fényű lámpák, olasz utcaképek a falon',
    width: 680,
    height: 383,
    category: 'etterem',
    caption: 'Étterem',
  },
  {
    src: '/images/etterem/belso-1.webp',
    alt: 'Asztalok az étterem oldalfala mellett, borospolccal és olasz utcaképpel',
    width: 287,
    height: 510,
    category: 'etterem',
    caption: 'Asztalok',
  },

  // ---- Pizza --------------------------------------------------------------
  fromMenu('margherita', 'pizza'),
  fromMenu('tartufo', 'pizza'),
  fromMenu('burrata', 'pizza'),
  fromMenu('diavola', 'pizza'),
  fromMenu('quattro-formaggi', 'pizza'),
  fromMenu('maradona', 'pizza'),
  fromMenu('oro-di-napoli', 'pizza'),
  fromMenu('genovese', 'pizza'),
  fromMenu('prosciutto-crudo', 'pizza'),

  // ---- Ételek -------------------------------------------------------------
  {
    src: '/images/etterem/foodora-listing.jpg',
    alt: 'Válogatás az étlapról: burrata pizza, előételek és desszertek sötét asztalon',
    width: 1600,
    height: 1170,
    category: 'etelek',
    caption: 'Az asztal',
  },
  fromMenu('insalata-di-enzo', 'etelek'),
  fromMenu('insalata-mista', 'etelek'),
  fromMenu('tiramisu-classico', 'etelek'),
  fromMenu('riccottas-kortetorta', 'etelek'),
  fromMenu('focaccia-rozmaring', 'etelek'),
];
