'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { formatPrice, imageAltOf, type MenuItem } from '@/content/menu';

/**
 * Everything that is not a pizza — starters, salads, desserts, drinks.
 *
 * These sit beside the copy the way the pizzas do, but they are deliberately a
 * different animal:
 *
 * - Nothing rotates. A pizza is a disc shot from directly above and turning it
 *   reads as the dish being turned. A tiramisu, a salad bowl or a bottle of
 *   aranciata has an up: rotate any of them and it reads as a photograph being
 *   spun, which is exactly the cheap effect this page is trying to avoid.
 * - The plate is larger and the type is larger than in the pizza reel. There are
 *   only a handful of items per category, so each one can be given the room the
 *   nineteen pizzas cannot have.
 * - The motion is a rise, not a turn: the picture arrives the same way its own
 *   copy does — fading up from a little below — and then drifts slower than the
 *   page as it crosses. Vertical, unhurried, and unmistakably not the pizza
 *   reel. It used to uncover itself with a clip-path wipe from the bottom edge,
 *   which read as the photograph being unveiled rather than as it arriving; the
 *   picture and its text now move as one object.
 * - Sides alternate. With rotation gone, alternating is what keeps a category
 *   from reading as a spreadsheet.
 *
 * `--d` runs from -1 (arriving, below) through 0 (centred) to 1 (leaving), set
 * by an IntersectionObserver-gated scroll pass so only rows on screen are
 * measured. It defaults to 0, so with no JavaScript every row renders centred
 * and still — which is the state the layout is designed around.
 */
export function CourseRail({ items }: { items: readonly MenuItem[] }) {
  const rootRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rows = Array.from(root.querySelectorAll<HTMLElement>('[data-course-row]'));
    if (rows.length === 0) return;

    const active = new Set<HTMLElement>();
    let frame = 0;

    const measure = () => {
      frame = 0;
      const viewport = window.innerHeight;
      for (const row of active) {
        const rect = row.getBoundingClientRect();
        const centre = rect.top + rect.height / 2;
        const d = (centre - viewport / 2) / (viewport / 2);
        row.style.setProperty('--d', String(Math.min(1.2, Math.max(-1.2, d))));
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const row = entry.target as HTMLElement;
          if (entry.isIntersecting) active.add(row);
          else active.delete(row);
          // The reveal runs once, on arrival, and is never replayed — a row
          // that re-animates every time it passes makes a long page feel
          // unstable.
          if (entry.isIntersecting) row.setAttribute('data-arrived', '');
        }
        measure();
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.15 },
    );

    for (const row of rows) observer.observe(row);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    measure();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [items]);

  return (
    <ul ref={rootRef} className="mt-4">
      {items.map((item, index) => (
        <li
          key={item.slug}
          data-course-row=""
          data-course-side={index % 2 === 0 ? 'left' : 'right'}
          className="border-b border-border/50 last:border-0"
        >
          <Link
            href={`/etlap/${item.slug}`}
            className="group grid items-center gap-10 py-16 md:grid-cols-2 md:gap-20 md:py-28"
          >
            {/* ---- The plate --------------------------------------------- */}
            {/* Two nested hooks on purpose: the outer one carries the scroll
                parallax, the inner one carries the arrival. Both are transforms,
                and they need different durations — a 700ms arrival easing on the
                drift would make the parallax lag the scroll. */}
            <div data-course-media="" className="order-1">
              <div data-course-frame="" className="relative mx-auto aspect-square w-full max-w-xl">
                <div data-course-glow="" aria-hidden="true" className="absolute inset-0" />
                {item.image ? (
                  /*
                   * INTERIM CROP — remove once the transparent, cropped shots land.
                   * Same reason as the pizzas: these are JPEGs with their own
                   * backgrounds. A circle is the one crop that does not fight the
                   * photograph's own framing. When the transparent versions
                   * arrive, drop `rounded-full` and use `object-contain`.
                   */
                  <span className="absolute inset-0 block overflow-hidden rounded-full">
                    <Image
                      src={item.image}
                      alt={imageAltOf(item)}
                      fill
                      sizes="(max-width: 767px) 90vw, 48vw"
                      className="object-cover"
                    />
                  </span>
                ) : (
                  <div className="flex h-full items-center justify-center rounded-full border border-border/60 p-10">
                    <p className="font-display text-center text-2xl italic text-muted">
                      {item.name}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ---- The copy ---------------------------------------------- */}
            <div data-course-copy="" className="order-2">
              <p className="text-[0.6875rem] uppercase tracking-[0.2em] text-primary/70">
                {String(index + 1).padStart(2, '0')}
                {item.popular ? ' · Népszerű' : ''}
              </p>

              <h3 className="font-display mt-5 text-4xl leading-[1.05] text-foreground transition-colors duration-normal group-hover:text-primary lg:text-5xl">
                {item.name}
              </h3>

              <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">{item.description}</p>

              <div className="mt-8 flex items-baseline gap-3">
                <span data-price="" className="font-display text-3xl text-primary lg:text-4xl">
                  {formatPrice(item.price)}
                </span>
                {item.priceFrom ? <span className="text-sm text-muted">-tól</span> : null}
              </div>

              <span className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-foreground/70 transition-colors group-hover:text-primary">
                Megnézem
                <span
                  aria-hidden="true"
                  className="transition-transform duration-normal group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
