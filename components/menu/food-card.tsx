import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, imageAltOf, type MenuItem } from '@/content/menu';
import { cn } from '@/lib/cn';

/**
 * One dish.
 *
 * The whole card is a single link, so there is one tab stop and one large target
 * rather than a title link plus a separate button. The visible name is the
 * accessible name; nothing here needs an aria-label to explain itself.
 *
 * Dishes the restaurant has not photographed render as a typographic card — the
 * ingredient list at display size, on the surface tone. An honest empty state,
 * not a stand-in image of somebody else's food.
 */
export function FoodCard({
  item,
  priority = false,
  sizes = '(max-width: 639px) 90vw, (max-width: 1023px) 45vw, 30vw',
  className,
}: {
  item: MenuItem;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  return (
    <Link
      href={`/etlap/${item.slug}`}
      className={cn('group relative flex flex-col rounded-sm', className)}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
        {item.image ? (
          <Image
            src={item.image}
            alt={imageAltOf(item)}
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover transition-transform duration-slow ease-standard will-change-transform group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-6">
            <p className="font-display text-center text-xl italic leading-snug text-muted">
              {item.name}
            </p>
          </div>
        )}

        {item.popular ? (
          <span className="absolute left-0 top-0 bg-background/85 px-3 py-1.5 text-[0.6875rem] uppercase tracking-[0.16em] text-primary backdrop-blur-sm">
            Népszerű
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-xl text-foreground transition-colors duration-normal group-hover:text-primary">
            {item.name}
          </h3>
          <p className="shrink-0 text-sm tabular-nums text-primary">
            {formatPrice(item.price)}
            {item.priceFrom ? (
              <span className="ml-1 text-xs text-muted" title="Feláras feltétekkel bővíthető">
                -tól
              </span>
            ) : null}
          </p>
        </div>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{item.description}</p>
      </div>
    </Link>
  );
}
