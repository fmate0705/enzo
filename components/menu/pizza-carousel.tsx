'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { formatPrice, imageAltOf, type MenuItem } from '@/content/menu';

/**
 * The pizzas — one pizza, turning.
 *
 * Not a list that scrolls past. The section is pinned: the copy holds the left
 * of the screen and a SINGLE plate sits on the right, oversized and running off
 * the edge of the viewport. Scrolling turns the plate, and as it comes round it
 * has become the next pizza, with the name, ingredients and price changing to
 * match.
 *
 * The swap is hidden inside the turn. Within one step:
 *
 *   t = 0.00   the current pizza, flat and still
 *   t = 0.50   mid-rotation — the two images cross here, at the least readable
 *              moment of the turn
 *   t = 1.00   the next pizza, flat again and upright for reading
 *
 * Rotation is continuous across the whole section (`--pos` accumulates), so the
 * plate never snaps back to zero between steps.
 *
 * The copy block is a FIXED height and every element inside it has a floor, so
 * nothing reflows as the dish changes. A nineteen-item reel where the price
 * hops up and down with the length of each ingredient list reads as broken, and
 * it is the one thing on a pinned section the eye cannot ignore.
 *
 * Cost:
 * - The per-frame work is two custom properties set on one node. Nothing in
 *   React re-renders while you scroll a step.
 * - React state holds only the active index, so it changes 19 times over the
 *   entire section, not 19 times a second.
 * - Only the plates on either side of the active one are mounted. Nineteen
 *   full-size <Image>s stacked in a pinned panel are all "in the viewport" as
 *   far as the browser is concerned, so lazy loading would not save a single
 *   request — the window does.
 *
 * Without JavaScript, below `md`, and under prefers-reduced-motion this renders
 * as a plain stacked list with every dish and every image present. That is also
 * what the server sends, so the menu is in the HTML for a crawler either way.
 */

/** Scroll distance allotted to each pizza, as a fraction of the viewport. */
const STEP_VH = 78;

export function PizzaCarousel({ items }: { items: readonly MenuItem[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const [active, setActive] = useState(0);

  // Decide once, on the client, whether this visitor gets the pinned version.
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const wide = window.matchMedia('(min-width: 768px)');
    const decide = () => setPinned(wide.matches && !reduced.matches);
    decide();
    reduced.addEventListener('change', decide);
    wide.addEventListener('change', decide);
    return () => {
      reduced.removeEventListener('change', decide);
      wide.removeEventListener('change', decide);
    };
  }, []);

  useEffect(() => {
    if (!pinned) return;
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const last = items.length - 1;
    let frame = 0;

    const measure = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      // The stage is pinned below the header and the rail, not at the top of
      // the viewport, so progress is measured from its resting offset and
      // against its own height — not the full viewport.
      const stageRect = stage.getBoundingClientRect();
      const pinnedAt = parseFloat(getComputedStyle(stage).top) || 0;
      const travel = rect.height - stageRect.height;
      const progress = travel <= 0 ? 0 : Math.min(1, Math.max(0, (pinnedAt - rect.top) / travel));

      // Position along the reel, in pizzas.
      const pos = progress * last;
      const index = Math.min(last, Math.floor(pos + 1e-6));
      const t = pos - index;

      stage.style.setProperty('--pos', String(pos));
      stage.style.setProperty('--t', String(t));
      setActive((current) => (current === index ? current : index));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    // The category filter fires a resize after it swaps sections in, which is
    // what re-measures this reel when it becomes visible again.
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pinned, items.length]);

  /* ---- The plain list: no JS, small screens, reduced motion --------------- */
  if (!pinned) {
    return (
      <ul className="mt-4" data-pizza-list="">
        {items.map((item, index) => (
          <li key={item.slug} className="border-b border-border/50 last:border-0">
            <Link href={`/etlap/${item.slug}`} className="group block py-10">
              <div className="relative mx-auto aspect-square w-full max-w-sm">
                <PlateArt item={item} priority={index < 2} />
              </div>
              <PizzaCopy item={item} index={index} total={items.length} />
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  /* ---- The pinned reel ---------------------------------------------------- */
  const current = items[active];
  if (!current) return null;

  return (
    <div
      ref={sectionRef}
      data-pizza-reel=""
      style={{
        height: `calc(100vh - var(--menu-chrome) + ${(items.length - 1) * STEP_VH}vh)`,
      }}
    >
      {/* The stage's sticky offset and height come from --menu-chrome in
          brand.css, so it parks exactly under the header and the category rail
          rather than behind them. */}
      <div ref={stageRef} data-pizza-stage="" className="sticky overflow-hidden">
        <div className="grid h-full grid-cols-2 items-center">
          {/* ---- The copy -------------------------------------------------- */}
          <div className="flex h-[34rem] max-h-full flex-col justify-center pl-[6vw] pr-8 lg:pl-[8vw]">
            {/*
             * Keyed on the dish, so React replaces the node on every step and the
             * enter animation runs again. Animating a mutated node would need the
             * animation to be removed and re-added by hand on each change.
             */}
            <div key={current.slug} data-pizza-copy="">
              <PizzaCopy item={current} index={active} total={items.length} linked />
            </div>

            {/* Where you are in the category, as a rule that fills. */}
            <div
              aria-hidden="true"
              className="mt-12 flex items-center gap-4 text-[0.6875rem] uppercase tracking-[0.2em] text-muted"
            >
              <span className="tabular-nums text-primary">
                {String(active + 1).padStart(2, '0')}
              </span>
              <span className="relative h-px flex-1 bg-border">
                <span
                  data-pizza-progress=""
                  className="absolute inset-y-0 left-0 bg-primary/70"
                  style={{ width: `${((active + 1) / items.length) * 100}%` }}
                />
              </span>
              <span className="tabular-nums">{String(items.length).padStart(2, '0')}</span>
            </div>
          </div>

          {/* ---- The plate ------------------------------------------------- */}
          {/*
           * Oversized on purpose and deliberately not contained: the plate is
           * pushed past the right edge of the viewport and the stage clips it. A
           * pizza that fits neatly inside a grid cell looks like a product
           * photo; one that runs past the frame looks like it is on the table in
           * front of you.
           *
           * It leaves the frame SIDEWAYS and never vertically. Centring is done
           * with flex, not with a translate, because `transform` on this element
           * belongs to the rotation — a `-translate-y-1/2` here is silently
           * dropped by the rotate rule in brand.css and the plate falls out of
           * the bottom of the stage.
           *
           * Its size is set in brand.css against the stage height, so it is
           * always shorter than the stage no matter how wide the window is.
           */}
          <div className="relative flex h-full items-center justify-end">
            <div data-pizza-halo="" aria-hidden="true" className="absolute inset-0" />
            <div data-pizza-plate="" className="relative aspect-square shrink-0">
              {items.map((item, index) => {
                // Only the neighbours are mounted; see the note at the top.
                if (Math.abs(index - active) > 1) return null;
                return (
                  <div
                    key={item.slug}
                    data-pizza-face={
                      index === active ? 'current' : index === active + 1 ? 'next' : 'prev'
                    }
                    className="absolute inset-0"
                  >
                    <PlateArt item={item} priority={index === 0} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The plate itself.
 *
 * These are cut out against transparency and squared to 1024, so nothing is
 * clipped and nothing is cropped: `object-contain` shows the plate whole and the
 * alpha channel does the shaping. There is no circular mask any more — the
 * earlier one existed only because the previous photographs were JPEGs carrying
 * their own rectangular backgrounds, which read as a spinning picture rather
 * than a turning plate once the rotation started.
 *
 * The upshot is that the plate now turns against the page itself, with the
 * ember halo behind it showing through the transparent corners.
 */
function PlateArt({ item, priority = false }: { item: MenuItem; priority?: boolean }) {
  if (!item.image) {
    return (
      <div className="flex h-full items-center justify-center rounded-full border border-border/60 p-10">
        <p className="font-display text-center text-xl italic text-muted">{item.name}</p>
      </div>
    );
  }

  return (
    <Image
      src={item.image}
      alt={imageAltOf(item)}
      fill
      sizes="(max-width: 767px) 88vw, 64vw"
      priority={priority}
      className="object-contain"
    />
  );
}

function PizzaCopy({
  item,
  index,
  total,
  linked = false,
}: {
  item: MenuItem;
  index: number;
  total: number;
  linked?: boolean;
}) {
  const body = (
    <>
      <p className="text-[0.6875rem] uppercase tracking-[0.2em] text-primary/70">
        {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        {item.popular ? ' · Népszerű' : ''}
      </p>

      {/* The floors below are what stop the block resizing between dishes. */}
      <h3 className="font-display mt-5 min-h-[2.1em] text-4xl leading-[1.05] text-foreground lg:text-5xl">
        {item.name}
      </h3>

      <p className="mt-6 min-h-[7.5rem] max-w-md text-base leading-relaxed text-muted lg:text-lg">
        {item.description}
      </p>

      <div className="mt-8 flex items-baseline gap-3">
        <span data-price="" className="font-display text-3xl text-primary lg:text-4xl">
          {formatPrice(item.price)}
        </span>
        {item.priceFrom ? <span className="text-sm text-muted">-tól</span> : null}
      </div>
    </>
  );

  if (!linked) return <div className="mt-8">{body}</div>;

  return (
    <Link href={`/etlap/${item.slug}`} className="group block">
      {body}
      <span className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-foreground/70 transition-colors group-hover:text-primary">
        Megnézem
        <span
          aria-hidden="true"
          className="transition-transform duration-normal group-hover:translate-x-1"
        >
          →
        </span>
      </span>
    </Link>
  );
}
