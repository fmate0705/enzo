'use client';

import { useEffect, useRef, useState } from 'react';
import type { MenuCategory } from '@/content/menu';
import { cn } from '@/lib/cn';

/**
 * The category selector on the menu page.
 *
 * A filter, not a table of contents. Picking a category SHOWS that category and
 * hides the rest; it does not travel down the page to reach it. Scrolling past
 * nineteen pizzas to arrive at the salads was the price of the anchor-link
 * version, and it was not worth paying.
 *
 * The sections themselves stay server-rendered — this component never receives
 * or re-renders the menu, it only toggles `hidden` on sections that are already
 * in the document. That keeps the whole menu in the HTML for a crawler, keeps it
 * out of the client bundle, and means the page still works before this script
 * runs: with no JavaScript nothing is ever hidden, so every category is simply
 * visible one after another, which is a perfectly good menu page.
 *
 * Two details that are easy to get wrong:
 *
 * - Switching from a tall category to a short one can leave the viewport parked
 *   below the whole document, so the browser scrolls on its own and the switch
 *   looks like a jump. The rail is pulled back to its own resting position
 *   first, instantly — a filter should not animate the page underneath it.
 * - The pizza reel measures itself against the scroll position and cannot do
 *   that while it is hidden. A resize event after the swap is what tells it to
 *   re-measure now that it has a size again.
 */
export function CategoryRail({ categories }: { categories: readonly MenuCategory[] }) {
  const [active, setActive] = useState<string>(categories[0]?.id ?? '');
  // Filtering only starts after hydration, so the server-rendered page (and any
  // visitor without JavaScript) keeps every category visible.
  const [filtering, setFiltering] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => setFiltering(true), []);

  useEffect(() => {
    if (!filtering) return;

    for (const category of categories) {
      const section = document.querySelector<HTMLElement>(
        `[data-category-section="${category.id}"]`,
      );
      if (section) section.hidden = category.id !== active;
    }

    // Let the reel re-measure now that it has a height again.
    window.dispatchEvent(new Event('resize'));
  }, [active, filtering, categories]);

  const select = (id: string) => {
    setActive(id);

    // Keep the rail where it is rather than letting the shortened document drag
    // the viewport. Instant, never smooth: this is a filter, not a journey.
    const rail = railRef.current;
    if (!rail) return;
    const restingTop = rail.getBoundingClientRect().top + window.scrollY;
    if (window.scrollY > restingTop) window.scrollTo({ top: restingTop, behavior: 'auto' });
  };

  return (
    <div
      ref={railRef}
      // Sits directly under the header, which is 80px tall and 96px from md up.
      className="sticky top-20 z-40 -mx-6 border-y border-border bg-background/90 backdrop-blur-md sm:-mx-8 md:top-24 lg:-mx-12"
    >
      <nav aria-label="Étlap kategóriák">
        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ul className="mx-auto flex w-max min-w-full gap-1 px-6 sm:px-8 lg:px-12">
            {categories.map((category) => {
              const isActive = filtering && active === category.id;
              return (
                <li key={category.id}>
                  <button
                    type="button"
                    onClick={() => select(category.id)}
                    data-category={category.id}
                    aria-pressed={isActive}
                    className={cn(
                      'relative flex h-14 items-center whitespace-nowrap px-4 text-xs uppercase tracking-[0.16em] transition-colors duration-normal',
                      isActive ? 'text-primary' : 'text-muted hover:text-foreground',
                    )}
                  >
                    {category.name}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute inset-x-3 bottom-0 h-px origin-center bg-primary transition-transform duration-slow ease-standard',
                        isActive ? 'scale-x-100' : 'scale-x-0',
                      )}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </div>
  );
}
