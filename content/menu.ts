/**
 * Enzo di Napoli — the menu.
 *
 * Every name, description and price is transcribed from the restaurant's live
 * Foodora listing, which is the vendor-maintained source of truth for what is
 * actually orderable. Categories and their order follow Foodora exactly.
 *
 * Photography is the restaurant's own, from the same listing. Nothing here is
 * generated, substituted or illustrated with stock.
 *
 * To update: re-read the Foodora page and edit this file. No component contains
 * a dish name, a price or an image path.
 */

import { links } from './restaurant';

/* -------------------------------------------------------------------------- */
/* Types                                                                        */
/* -------------------------------------------------------------------------- */

export type CategoryId = 'pizzak' | 'eloetelek' | 'salatak' | 'desszertek' | 'uditok';

export interface MenuCategory {
  readonly id: CategoryId;
  readonly name: string;
  /** Shown under the category heading; null when the category needs no qualifier. */
  readonly note: string | null;
}

export interface MenuItem {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly category: CategoryId;
  /** Verbatim from Foodora. For food items this is the ingredient list. */
  readonly description: string;
  readonly price: number;
  /**
   * True when Foodora shows the price as "…Ft-tól" — the item has paid options,
   * so this is a starting price. Rendering must say so; quoting a "from" price as
   * final would be a lie to the guest.
   */
  readonly priceFrom: boolean;
  /** Path under /public. null when the restaurant has published no photo. */
  readonly image: string | null;
  /** Foodora's "Népszerű" (popular) marker, not our opinion. */
  readonly popular: boolean;
  /** Chosen for the home page. Editorial selection, recorded here rather than in JSX. */
  readonly signature: boolean;
}

/* -------------------------------------------------------------------------- */
/* Categories                                                                   */
/* -------------------------------------------------------------------------- */

export const categories: readonly MenuCategory[] = [
  { id: 'pizzak', name: 'Pizzák', note: '32 cm · nápolyi tészta' },
  { id: 'eloetelek', name: 'Előételek', note: null },
  { id: 'salatak', name: 'Saláták', note: null },
  { id: 'desszertek', name: 'Desszertek', note: null },
  { id: 'uditok', name: 'Üdítők', note: null },
];

/* -------------------------------------------------------------------------- */
/* Items                                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Photo paths.
 *
 * Two helpers rather than one because the two sets of photographs are genuinely
 * different assets, not the same asset in a different container:
 *
 * - `png` — the pizzas. Cut out against transparency and squared to 1024, so
 *   the plate can be rotated and laid over the page ground with no box around
 *   it. The alpha channel is the whole point, which is why they are not JPEGs.
 * - `img` — everything else. Ordinary rectangular JPEG photographs.
 *
 * The extension is not decoration: `image` is read straight into next/image, so
 * a path pointing at a file that is not there renders nothing at all.
 */
const img = (slug: string) => `/images/etelek/${slug}.jpg`;
const png = (slug: string) => `/images/etelek/${slug}.png`;

export const menu: readonly MenuItem[] = [
  /* ---- Pizzák ------------------------------------------------------------ */
  {
    id: '26267064',
    slug: 'margherita',
    name: 'Margherita',
    category: 'pizzak',
    description: 'paradicsomszósz, Fior di Latte mozzarella sajt, bazsalikom, olívaolaj',
    price: 2900,
    priceFrom: true,
    image: png('margherita'),
    popular: true,
    signature: true,
  },
  {
    id: '26267065',
    slug: 'prosciutto-cotto-e-funghi',
    name: 'Prosciutto cotto e funghi',
    category: 'pizzak',
    description:
      'paradicsomszósz, Fior di Latte mozzarella sajt, fűszeres gomba, prosciutto cotto, bazsalikom, olívaolaj',
    price: 3790,
    priceFrom: true,
    image: png('prosciutto-cotto-e-funghi'),
    popular: true,
    signature: false,
  },
  {
    id: '26267066',
    slug: 'diavola',
    name: 'Diavola',
    category: 'pizzak',
    description:
      'paradicsomszósz, Fior di Latte mozzarella sajt, Diavola pikáns szalámi, fűszeres, erős pepperoni, bazsalikom',
    price: 3590,
    priceFrom: true,
    image: png('diavola'),
    popular: true,
    signature: true,
  },
  {
    id: '26267067',
    slug: 'salame',
    name: 'Salame',
    category: 'pizzak',
    description:
      'paradicsomszósz, Fior di Latte mozzarella sajt, Napoli csemegeszalámi, bazsalikom',
    price: 3790,
    priceFrom: true,
    image: png('salame'),
    popular: true,
    signature: false,
  },
  {
    id: '26267068',
    slug: 'quattro-formaggi',
    name: 'Quattro formaggi',
    category: 'pizzak',
    description:
      'paradicsomszósz, Fior di Latte mozzarella sajt, gorgonzola sajt, Provola füstölt sajt, Grana Padano parmezán sajt, bazsalikom, olívaolaj',
    price: 3950,
    priceFrom: true,
    image: png('quattro-formaggi'),
    popular: true,
    signature: true,
  },
  {
    id: '26267069',
    slug: 'tonno-e-cipolla',
    name: 'Tonno e cipolla',
    category: 'pizzak',
    description:
      'paradicsomszósz, Fior di Latte mozzarella sajt, tonhaltörzs, lila hagyma, kapribogyó, olívabogyó, citrusolaj',
    price: 3950,
    priceFrom: true,
    image: png('tonno-e-cipolla'),
    popular: false,
    signature: false,
  },
  {
    id: '26267070',
    slug: 'genovese',
    name: 'Genovese',
    category: 'pizzak',
    description:
      'bazsalikomos pesto, bivaly mozzarella sajt, koktélparadicsom, Grana Padano parmezán sajt, bazsalikom, fenyőmag, olívaolaj',
    price: 4190,
    priceFrom: true,
    image: png('genovese'),
    popular: false,
    signature: false,
  },
  {
    id: '26267071',
    slug: 'bufalina',
    name: 'Bufalina',
    category: 'pizzak',
    description: 'paradicsomszósz, bivaly mozzarella sajt, bazsalikom, olívaolaj',
    price: 4190,
    priceFrom: true,
    image: png('bufalina'),
    popular: false,
    signature: false,
  },
  {
    id: '26267072',
    slug: 'capricciosa',
    name: 'Capricciosa',
    category: 'pizzak',
    description:
      'paradicsomszósz, Fior di Latte mozzarella sajt, fűszeres gomba, articsóka, prosciutto cotto, Napoli csemegeszalámi, bazsalikom, olívaolaj',
    price: 4450,
    priceFrom: true,
    image: png('capricciosa'),
    popular: false,
    signature: false,
  },
  {
    id: '26267073',
    slug: 'maradona',
    name: 'Maradona',
    category: 'pizzak',
    description:
      'Fior di Latte mozzarella sajt, prosciutto cotto, pancetta, rukkola, ricotta, narancslekvár, bazsalikom, pirított dió',
    price: 4550,
    priceFrom: true,
    image: png('maradona'),
    popular: false,
    signature: false,
  },
  {
    id: '26267074',
    slug: 'zucchine-e-pancetta',
    name: 'Zucchine e pancetta',
    category: 'pizzak',
    description:
      'pisztáciás-sós krém, Fior di Latte mozzarella sajt, pancetta, fűszeres, sárga datolyaparadicsom, grillezett cukkini',
    price: 4450,
    priceFrom: true,
    image: png('zucchine-e-pancetta'),
    popular: false,
    signature: false,
  },
  {
    id: '26267075',
    slug: 'tartufo',
    name: 'Tartufo',
    category: 'pizzak',
    description:
      'szarvasgombakrém, Fior di Latte mozzarella sajt, fűszeres vargányagomba, grillezett cukkini, bazsalikom',
    price: 4550,
    priceFrom: true,
    image: png('tartufo'),
    popular: false,
    signature: true,
  },
  {
    id: '26267076',
    slug: 'prosciutto-crudo',
    name: 'Prosciutto crudo',
    category: 'pizzak',
    description:
      'paradicsomszósz, Fior di Latte mozzarella sajt, prosciutto crudo fűszeres piros és sárga datolyaparadicsom, olívabogyó, rukkola, parmezánpehely, olívaolaj',
    price: 4550,
    priceFrom: true,
    image: png('prosciutto-crudo'),
    popular: false,
    signature: false,
  },
  {
    id: '26267077',
    slug: 'quattro-carni',
    name: 'Quattro carni',
    category: 'pizzak',
    description:
      'paradicsomszósz, Fior di Latte mozzarella sajt, prosciutto cotto, pancetta, Napoli csemegeszalámi, Nduja pikáns szalámikrém, bazsalikom',
    price: 4870,
    priceFrom: true,
    image: png('quattro-carni'),
    popular: true,
    signature: false,
  },
  {
    id: '26267078',
    slug: 'burrata',
    name: 'Burrata',
    category: 'pizzak',
    description:
      'paradicsomszósz, Grana Padano parmezán sajt, fűszeres sárga és piros datolyaparadicsom, burrata sajt, bazsalikom, olívaolaj',
    price: 4890,
    priceFrom: true,
    image: png('burrata'),
    popular: false,
    signature: true,
  },
  {
    id: '26267079',
    slug: 'enzo',
    name: 'Enzo',
    category: 'pizzak',
    description:
      'paradicsomszósz, Fior di Latte mozzarella sajt, fűszeres datolyaparadicsom, bivaly mozzarella sajt, prosciutto crudo, grillezett paprika, grillezett cukkini, rukkola, parmezánpehely, olívaolaj',
    price: 4800,
    priceFrom: true,
    image: png('enzo'),
    popular: false,
    signature: false,
  },
  {
    id: '26267080',
    slug: 'oro-di-napoli',
    name: 'Oro di Napoli',
    category: 'pizzak',
    description:
      'sárga paradicsomszósz, Fior di Latte mozzarella sajt, pancetta, sárga és piros fűszeres datolyaparadicsom, rukkola, bivaly mozarella sajt',
    price: 5190,
    priceFrom: true,
    image: png('oro-di-napoli'),
    popular: false,
    signature: false,
  },
  {
    id: '26267081',
    slug: 'focaccia-rozmaring',
    name: 'Rozmaringos focaccia',
    category: 'pizzak',
    description: 'olasz kenyér, rozmaring, olívaolaj',
    price: 1890,
    priceFrom: true,
    image: png('focaccia-rozmaring'),
    popular: false,
    signature: false,
  },
  {
    id: '26267082',
    slug: 'focaccia-fokhagyma',
    name: 'Fokhagymás focaccia',
    category: 'pizzak',
    description: 'olasz kenyér, fokhagymás olívaolaj, oregánó',
    price: 1890,
    priceFrom: true,
    image: png('focaccia-fokhagyma'),
    popular: false,
    signature: false,
  },

  /* ---- Előételek --------------------------------------------------------- */
  {
    id: '26267107',
    slug: 'antipasto-di-enzo',
    name: 'Antipasto di Enzo',
    category: 'eloetelek',
    description:
      'prosciutto cotto, prosciutto crudo, mozzarella di bufala, Napoli csemegeszalámi, rukkola, fűszeres datolyaparadicsom, olívabogyó, articsóka, focaccia',
    price: 6590,
    priceFrom: false,
    // The restaurant has published no photograph of this dish. Rendered as a
    // typographic card rather than filled with a stand-in image.
    image: null,
    popular: false,
    signature: false,
  },

  /* ---- Saláták ----------------------------------------------------------- */
  {
    id: '26267083',
    slug: 'insalata-mista',
    name: 'Insalata mista',
    category: 'salatak',
    description:
      'salátalevél, fűszeres koktélparadicsom, lila hagyma, olívabogyó, parmezánpehely, bazsalikom, olívaolaj',
    price: 2500,
    priceFrom: false,
    image: img('insalata-mista'),
    popular: false,
    signature: false,
  },
  {
    id: '26267084',
    slug: 'insalata-di-tonno',
    name: 'Insalata di tonno',
    category: 'salatak',
    description:
      'salátalevél, fűszeres koktélparadicsom, tonhaltörzs, lila hagyma, olívabogyó, citrusolaj',
    price: 3190,
    priceFrom: false,
    image: img('insalata-di-tonno'),
    popular: false,
    signature: false,
  },
  {
    id: '26267085',
    slug: 'insalata-di-enzo',
    name: 'Insalata di Enzo',
    category: 'salatak',
    description:
      'rukkola, salátalevél, fűszeres piros és sárga datolya paradicsom, grillezett cukkini, grillezett paprika, pármai sonka, burrata sajt, bazsalikom, olívaolaj',
    price: 4290,
    priceFrom: false,
    image: img('insalata-di-enzo'),
    popular: false,
    signature: false,
  },

  /* ---- Desszertek -------------------------------------------------------- */
  {
    id: '26267086',
    slug: 'tiramisu-classico',
    name: 'Tiramisu classico',
    category: 'desszertek',
    description: 'Klasszikus olasz tiramisu, 120 g.',
    price: 2490,
    priceFrom: false,
    image: img('tiramisu-classico'),
    popular: false,
    signature: false,
  },
  {
    id: '26267089',
    slug: 'riccottas-kortetorta',
    name: 'Riccottás körtetorta',
    category: 'desszertek',
    description: 'Ricottás körtetorta, 120 g.',
    price: 2190,
    priceFrom: false,
    image: img('riccottas-kortetorta'),
    popular: false,
    signature: false,
  },

  /* ---- Üdítők ------------------------------------------------------------ */
  {
    id: '26267090',
    slug: 'aranciata',
    name: 'Aranciata narancslé',
    category: 'uditok',
    description: 'Olasz narancslé, 275 ml.',
    price: 1090,
    priceFrom: false,
    image: img('aranciata'),
    popular: false,
    signature: false,
  },
  {
    id: '26267091',
    slug: 'aranciata-rossa',
    name: 'Aranciata Rossa vérnarancs szóda',
    category: 'uditok',
    description: 'Vérnarancs kivonatos szóda, 275 ml.',
    price: 1090,
    priceFrom: false,
    image: img('aranciata-rossa'),
    popular: false,
    signature: false,
  },
  {
    id: '26267092',
    slug: 'limonata',
    name: 'Limonata limonádé',
    category: 'uditok',
    description: 'Citromos limonádé, 275 ml.',
    price: 1090,
    priceFrom: false,
    image: img('limonata'),
    popular: false,
    signature: false,
  },
  {
    id: '26267093',
    slug: 'mandarino-verde',
    name: 'Mandarino Verde zöld mandarinlé',
    category: 'uditok',
    description: 'Zöld mandarinlé, 275 ml.',
    price: 1090,
    priceFrom: false,
    image: img('mandarino-verde'),
    popular: false,
    signature: false,
  },
];

/* -------------------------------------------------------------------------- */
/* Queries                                                                      */
/* -------------------------------------------------------------------------- */

export const menuBySlug = new Map(menu.map((item) => [item.slug, item]));

export function itemsIn(category: CategoryId): readonly MenuItem[] {
  return menu.filter((item) => item.category === category);
}

export function signatureItems(): readonly MenuItem[] {
  return menu.filter((item) => item.signature);
}

/**
 * Related items for a detail page: same category first, closest in price, never
 * the item itself. Deterministic, so the same dish always shows the same three.
 */
export function relatedTo(item: MenuItem, count = 3): readonly MenuItem[] {
  return menu
    .filter((other) => other.slug !== item.slug && other.category === item.category)
    .sort((a, b) => Math.abs(a.price - item.price) - Math.abs(b.price - item.price))
    .slice(0, count);
}

/** The item's own Foodora entry is not addressable, so ordering opens the listing. */
export const orderUrl = links.foodora;

const forintFormatter = new Intl.NumberFormat('hu-HU', {
  style: 'currency',
  currency: 'HUF',
  maximumFractionDigits: 0,
});

export function formatPrice(value: number): string {
  return forintFormatter.format(value);
}

/**
 * The ingredient list, split from the Foodora description. Splitting a written
 * list is structuring given data — no ingredient is added, removed or guessed.
 */
export function ingredientsOf(item: MenuItem): readonly string[] {
  if (item.category === 'uditok' || item.category === 'desszertek') return [];
  return item.description
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

const CATEGORY_NOUN: Record<CategoryId, string> = {
  pizzak: 'nápolyi pizza',
  eloetelek: 'olasz előétel',
  salatak: 'saláta',
  desszertek: 'olasz desszert',
  uditok: 'olasz üdítő',
};

/**
 * Alt text for a dish photograph.
 *
 * Describes the subject for a screen-reader user and, incidentally, gives an
 * image search something true to index. Focaccia is not a pizza, so the two
 * items that are bread say so rather than inheriting the category's noun.
 */
export function imageAltOf(item: MenuItem): string {
  const noun = item.slug.startsWith('focaccia') ? 'olasz focaccia' : CATEGORY_NOUN[item.category];
  return `${item.name} — ${noun} az Enzo di Napoli kínálatából`;
}

/**
 * ALLERGENS.
 *
 * Deliberately absent. Allergen declaration is regulated (EU 1169/2011) and the
 * restaurant publishes none in any public source. Inferring "contains gluten"
 * from the word "tészta" would be a guess presented as a health statement. The
 * menu shows this notice and points the guest at the restaurant instead.
 */
export const allergenNotice =
  'Allergénekkel kapcsolatos kérdésekkel keressen minket telefonon vagy szóljon a kollégáknak — minden alapanyagról pontos felvilágosítást adunk.';
