/** The site's navigation. Four destinations — the nav stays short by design. */
export const primaryNav = [
  { href: '/etlap', label: 'Étlap' },
  { href: '/tortenet', label: 'Történet' },
  { href: '/galeria', label: 'Galéria' },
  { href: '/megkozelites', label: 'Megközelítés' },
] as const;

export const legalNav = [
  { href: '/adatkezelesi-tajekoztato', label: 'Adatkezelési tájékoztató' },
  { href: '/cookie-tajekoztato', label: 'Cookie tájékoztató' },
  { href: '/felhasznalasi-feltetelek', label: 'Felhasználási feltételek' },
  { href: '/impresszum', label: 'Impresszum' },
] as const;
