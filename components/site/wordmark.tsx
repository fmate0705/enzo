import Link from 'next/link';
import { cn } from '@/lib/cn';

/**
 * The wordmark, set in type rather than shipped as an image.
 *
 * The supplied logo is a JPEG with its own near-black ground baked in, which
 * would show a visible seam against the page and would soften at small sizes.
 * Setting the mark in Bodoni keeps it sharp at every size and in every colour,
 * costs no request, and matches the lettering on the restaurant's own signage.
 * The bitmap logo is still used where a self-contained mark is required — the
 * social card and the icons.
 *
 * Sizes are explicit rather than derived with `em` from whatever the parent
 * happens to be. An em-scaled descriptor is how a tracked-out micro-label ends
 * up rendering at six pixels; the descriptor here has a floor of 10px at every
 * size, which is the smallest this lettering stays readable at 0.4em tracking.
 */
const SIZES = {
  sm: { name: 'text-[0.9375rem]', descriptor: 'text-[0.625rem]' },
  md: { name: 'text-[1.0625rem]', descriptor: 'text-[0.625rem]' },
  lg: { name: 'text-[1.375rem]', descriptor: 'text-[0.6875rem]' },
} as const;

export function Wordmark({
  className,
  size = 'md',
  descriptor = true,
  href = '/',
}: {
  className?: string;
  size?: keyof typeof SIZES;
  descriptor?: boolean;
  href?: string | null;
}) {
  const scale = SIZES[size];

  const mark = (
    <span className={cn('inline-flex flex-col leading-none', className)}>
      <span className={cn('font-display tracking-[0.06em] text-foreground', scale.name)}>
        ENZO DI NAPOLI
      </span>
      {descriptor ? (
        <span
          className={cn(
            'mt-1.5 font-medium uppercase tracking-[0.38em] text-primary',
            scale.descriptor,
          )}
        >
          Pizza Tradizionale
        </span>
      ) : null}
    </span>
  );

  if (!href) return mark;

  return (
    <Link href={href} className="rounded-sm" aria-label="Enzo di Napoli — vissza a főoldalra">
      {mark}
    </Link>
  );
}
