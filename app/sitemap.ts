import type { MetadataRoute } from 'next';
import { getContent } from '@/lib/store/store';
import { absoluteUrl } from '@/lib/site-url';

/**
 * The sitemap.
 *
 * Built from the same data the pages are, so a dish added to content/menu.ts
 * appears here without anyone remembering to update a list. Priorities reflect
 * the site's actual conversion path: the menu is the page that matters most
 * after the home page, and the legal pages are indexable but unimportant.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { menu } = await getContent();
  const lastModified = new Date();

  const pages: MetadataRoute.Sitemap = (
    [
      { url: absoluteUrl('/'), changeFrequency: 'monthly', priority: 1 },
      { url: absoluteUrl('/etlap'), changeFrequency: 'weekly', priority: 0.9 },
      { url: absoluteUrl('/megkozelites'), changeFrequency: 'monthly', priority: 0.8 },
      { url: absoluteUrl('/tortenet'), changeFrequency: 'yearly', priority: 0.6 },
      { url: absoluteUrl('/galeria'), changeFrequency: 'monthly', priority: 0.6 },
      { url: absoluteUrl('/impresszum'), changeFrequency: 'yearly', priority: 0.2 },
      { url: absoluteUrl('/adatkezelesi-tajekoztato'), changeFrequency: 'yearly', priority: 0.2 },
      { url: absoluteUrl('/cookie-tajekoztato'), changeFrequency: 'yearly', priority: 0.2 },
      { url: absoluteUrl('/felhasznalasi-feltetelek'), changeFrequency: 'yearly', priority: 0.2 },
    ] satisfies MetadataRoute.Sitemap
  ).map((entry) => ({ ...entry, lastModified }));

  const dishes: MetadataRoute.Sitemap = menu.map((item) => ({
    url: absoluteUrl(`/etlap/${item.slug}`),
    lastModified,
    changeFrequency: 'monthly',
    priority: item.signature ? 0.7 : 0.5,
  }));

  return [...pages, ...dishes];
}
