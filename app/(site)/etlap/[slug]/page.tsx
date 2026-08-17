import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { ButtonLink, ExternalButtonLink } from '@/components/ui/button';
import { FoodCard } from '@/components/menu/food-card';
import { Reveal } from '@/components/motion/reveal';
import { allergenNotice, categories, formatPrice, imageAltOf, ingredientsOf } from '@/content/menu';
import { findItem, getSite, relatedTo } from '@/lib/site';
import { getContent } from '@/lib/store/store';
import { breadcrumbJsonLd, menuItemJsonLd } from '@/lib/seo/jsonld';
import { absoluteUrl } from '@/lib/site-url';

/** Every dish known at build time gets a static page. */
export async function generateStaticParams() {
  const { menu } = await getContent();
  return menu.map((item) => ({ slug: item.slug }));
}

/**
 * A dish added through the admin after the build has no static param, so
 * unknown slugs are rendered on demand rather than 404'd. `findItem` still
 * returns undefined for a slug that is genuinely not on the menu, and that
 * path calls notFound().
 */
export const dynamicParams = true;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const site = await getSite();
  const item = findItem(site.menu, slug);
  if (!item) return { title: 'Nem található' };

  const canonical = absoluteUrl(`/etlap/${item.slug}`);
  const description = `${item.name} — ${item.description}. ${formatPrice(item.price)}${
    item.priceFrom ? '-tól' : ''
  }. ${site.name}, ${site.city}.`;

  return {
    title: item.name,
    description: description.slice(0, 160),
    alternates: { canonical },
    openGraph: {
      type: 'article',
      url: canonical,
      title: `${item.name} — ${site.name}`,
      description: description.slice(0, 160),
      ...(item.image ? { images: [{ url: item.image, alt: imageAltOf(item) }] } : {}),
    },
  };
}

export default async function MenuItemPage({ params }: Params) {
  const { slug } = await params;
  const site = await getSite();
  const item = findItem(site.menu, slug);
  if (!item) notFound();

  const category = categories.find((c) => c.id === item.category);
  const ingredients = ingredientsOf(item);
  const related = relatedTo(site.menu, item);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(await menuItemJsonLd(item)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Főoldal', path: '/' },
              { name: 'Étlap', path: '/etlap' },
              { name: item.name, path: `/etlap/${item.slug}` },
            ]),
          ),
        }}
      />

      <article className="pt-32 md:pt-40">
        <Container>
          <nav aria-label="Morzsamenü" className="mb-10">
            <ol className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted">
              <li>
                <Link href="/" className="transition-colors hover:text-foreground">
                  Főoldal
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/etlap" className="transition-colors hover:text-foreground">
                  Étlap
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-primary">{item.name}</li>
            </ol>
          </nav>

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="relative">
              {item.image ? (
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={imageAltOf(item)}
                    fill
                    priority
                    sizes="(max-width: 1023px) 92vw, 46vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-square w-full items-center justify-center border border-border bg-surface p-10">
                  <p className="font-display max-w-xs text-center text-2xl italic leading-snug text-muted">
                    Erről a fogásról még nem készült fénykép.
                  </p>
                </div>
              )}
            </div>

            <div className="lg:pt-6">
              <p className="text-xs uppercase tracking-[0.2em] text-primary">{category?.name}</p>
              <h1 className="font-display mt-5 text-4xl text-foreground md:text-5xl">
                {item.name}
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-muted">{item.description}</p>

              <div className="mt-9 flex items-baseline gap-3 border-y border-border py-6">
                <span className="font-display text-3xl text-primary">
                  {formatPrice(item.price)}
                </span>
                {item.priceFrom ? (
                  <span className="text-sm text-muted">
                    -tól · feláras feltétekkel bővíthető a Foodorán
                  </span>
                ) : null}
              </div>

              {ingredients.length > 0 ? (
                <div className="mt-8">
                  <h2 className="text-xs uppercase tracking-[0.2em] text-muted">Összetevők</h2>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {ingredients.map((ingredient) => (
                      <li
                        key={ingredient}
                        className="border border-border px-3 py-1.5 text-sm text-foreground"
                      >
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {category?.note ? (
                <p className="mt-8 text-sm text-muted">
                  <span className="text-foreground">{category.note}</span> · {site.oven} kemencében
                  sül
                </p>
              ) : null}

              <div className="mt-10 flex flex-wrap gap-3">
                <ExternalButtonLink
                  href={site.links.foodora}
                  size="lg"
                  label={`${item.name} rendelése a Foodorán — új lapon nyílik meg`}
                >
                  Rendelés a Foodorán
                </ExternalButtonLink>
                <ButtonLink href="/etlap" variant="outline" size="lg">
                  Vissza az étlaphoz
                </ButtonLink>
              </div>

              <p className="mt-6 max-w-md text-xs leading-relaxed text-muted">{allergenNotice}</p>
            </div>
          </div>
        </Container>

        {related.length > 0 ? (
          <Section
            aria-labelledby="related-title"
            className="atmos atmos--brass atmos--engraved mt-8 border-t border-border/60"
          >
            <Container>
              <h2 id="related-title" className="font-display text-3xl text-foreground">
                Hasonló a {category?.name.toLowerCase()} közül
              </h2>
              <ul className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((other, index) => (
                  <Reveal as="li" key={other.slug} delay={index * 70}>
                    <FoodCard item={other} />
                  </Reveal>
                ))}
              </ul>
            </Container>
          </Section>
        ) : null}
      </article>
    </>
  );
}
