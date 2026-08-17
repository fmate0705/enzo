'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { galleryCategories, galleryImages, type GalleryCategoryId } from '@/content/gallery';
import { cn } from '@/lib/cn';

type Filter = GalleryCategoryId | 'mind';

/**
 * The gallery: a filterable editorial grid with a lightbox.
 *
 * Layout is CSS multi-column, so photographs keep their own proportions and pack
 * by height instead of being cropped into identical tiles. Every image declares
 * its intrinsic width and height, so each slot is reserved before the file
 * arrives — the column heights do not reflow as the page loads.
 *
 * The lightbox is a real dialog: labelled, modal, escapable, arrow-navigable,
 * focus-trapped, and it returns focus to the thumbnail that opened it.
 */
export function GalleryGrid() {
  const [filter, setFilter] = useState<Filter>('mind');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const visible = useMemo(
    () =>
      filter === 'mind'
        ? galleryImages
        : galleryImages.filter((image) => image.category === filter),
    [filter],
  );

  // Categories with nothing in them are never offered.
  const availableCategories = useMemo(
    () => galleryCategories.filter((c) => galleryImages.some((i) => i.category === c.id)),
    [],
  );

  const close = useCallback(() => setOpenIndex(null), []);

  const step = useCallback(
    (direction: 1 | -1) => {
      setOpenIndex((current) => {
        if (current === null) return current;
        return (current + direction + visible.length) % visible.length;
      });
    },
    [visible.length],
  );

  useEffect(() => {
    if (openIndex === null) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        step(1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        step(-1);
      } else if (event.key === 'Tab') {
        // Trap: the dialog's controls are the only focusable things while open.
        const items = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button') ?? []);
        const first = items[0];
        const last = items[items.length - 1];
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    dialogRef.current?.querySelector('button')?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      body.style.overflow = previousOverflow;
      lastTriggerRef.current?.focus();
    };
  }, [openIndex, close, step]);

  const current = openIndex === null ? null : visible[openIndex];

  return (
    <>
      {/* ---- Filter ---------------------------------------------------- */}
      <div className="flex flex-wrap items-center gap-x-1 gap-y-2 border-b border-border pb-4">
        {[{ id: 'mind' as const, name: 'Mind' }, ...availableCategories].map((category) => {
          const isActive = filter === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => {
                setFilter(category.id as Filter);
                setOpenIndex(null);
              }}
              aria-pressed={isActive}
              className={cn(
                'px-4 py-2 text-xs uppercase tracking-[0.16em] transition-colors duration-normal',
                isActive ? 'text-primary' : 'text-muted hover:text-foreground',
              )}
            >
              {category.name}
              <span className="ml-2 text-[0.6875rem] text-muted/70">
                {category.id === 'mind'
                  ? galleryImages.length
                  : galleryImages.filter((i) => i.category === category.id).length}
              </span>
            </button>
          );
        })}
      </div>

      {/* ---- Grid ------------------------------------------------------ */}
      <div className="mt-10 gap-5 [column-fill:balance] sm:columns-2 lg:columns-3">
        {visible.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={(event) => {
              lastTriggerRef.current = event.currentTarget;
              setOpenIndex(index);
            }}
            className="group relative mb-5 block w-full break-inside-avoid overflow-hidden rounded-sm"
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(max-width: 639px) 88vw, (max-width: 1023px) 44vw, 30vw"
              className="h-auto w-full transition-transform duration-slow ease-standard will-change-transform group-hover:scale-[1.03]"
            />
            {/* A brass wash on hover, instead of a scrim with an icon in it. */}
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-primary/0 transition-colors duration-normal group-hover:bg-primary/10"
            />
            <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-background to-transparent px-4 pb-3 pt-8 text-left text-xs uppercase tracking-[0.14em] text-foreground transition-transform duration-slow ease-standard group-hover:translate-y-0 group-focus-visible:translate-y-0">
              {image.caption}
            </span>
          </button>
        ))}
      </div>

      {/* ---- Lightbox -------------------------------------------------- */}
      {current ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${current.caption} — ${openIndex! + 1}. kép a ${visible.length}-ből`}
          className="fixed inset-0 z-[80] flex flex-col bg-background/97 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between px-6 py-5">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">
              <span className="text-primary">{openIndex! + 1}</span> / {visible.length}
            </p>
            <button
              type="button"
              onClick={close}
              className="inline-flex h-11 w-11 items-center justify-center rounded-sm text-foreground"
            >
              <span className="sr-only">Bezárás</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
              >
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-16">
            <Image
              key={current.src}
              src={current.src}
              alt={current.alt}
              width={current.width}
              height={current.height}
              sizes="(max-width: 639px) 92vw, 80vw"
              className="max-h-full w-auto max-w-full object-contain"
              priority
            />
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-border px-6 py-5">
            <button
              type="button"
              onClick={() => step(-1)}
              className="inline-flex h-11 items-center gap-2 rounded-sm px-3 text-xs uppercase tracking-[0.16em] text-foreground transition-colors hover:text-primary"
            >
              <span aria-hidden="true">←</span> Előző
            </button>

            <p className="min-w-0 truncate text-center text-sm text-muted">{current.caption}</p>

            <button
              type="button"
              onClick={() => step(1)}
              className="inline-flex h-11 items-center gap-2 rounded-sm px-3 text-xs uppercase tracking-[0.16em] text-foreground transition-colors hover:text-primary"
            >
              Következő <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
