'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ExternalButtonLink } from '@/components/ui/button';
import { Wordmark } from './wordmark';
import { primaryNav } from '@/content/navigation';
import { cn } from '@/lib/cn';

/**
 * The mobile menu.
 *
 * Designed for the person standing outside the restaurant with one hand free:
 * targets are large, the ordering action and the phone number are both reachable
 * without scrolling, and the address and today's hours are in the panel rather
 * than one navigation step away.
 *
 * Accessibility, handled rather than approximated:
 * - a real modal dialog (role, aria-modal, labelled by the panel heading)
 * - Escape closes it, and focus returns to the trigger that opened it
 * - Tab is trapped inside the panel while it is open
 * - the page behind is locked from scrolling and hidden from assistive tech
 */
export function MobileNav({
  phoneDisplay,
  phoneHref,
  foodoraUrl,
  fullAddress,
  hoursSummary,
}: {
  phoneDisplay: string;
  phoneHref: string;
  foodoraUrl: string;
  fullAddress: string;
  hoursSummary: string;
}) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  const close = useCallback(() => setOpen(false), []);

  // Route changes close the panel; the visitor has arrived where they asked to go.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const trigger = triggerRef.current;
    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    const focusable = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((el) => el.offsetParent !== null);

    focusable()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== 'Tab') return;

      const items = focusable();
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
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-sm text-foreground md:hidden"
      >
        <span className="sr-only">Menü megnyitása</span>
        <span aria-hidden="true" className="flex w-5 flex-col gap-[5px]">
          <span className="h-px w-full bg-current" />
          <span className="h-px w-full bg-current" />
          <span className="h-px w-3/5 bg-current" />
        </span>
      </button>

      {/* Rendered only while open: no offscreen panel for a screen reader or the
          keyboard to wander into. */}
      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-nav-title"
          className="fixed inset-0 z-[60] md:hidden"
        >
          <div
            ref={panelRef}
            data-mobile-panel=""
            className="flex h-full flex-col overflow-y-auto bg-background"
          >
            <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />

            <div className="relative flex items-center justify-between px-6 py-5">
              <h2 id="mobile-nav-title" className="sr-only">
                Navigáció
              </h2>
              <Wordmark size="md" />
              <button
                type="button"
                onClick={close}
                className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-sm text-foreground"
              >
                <span className="sr-only">Menü bezárása</span>
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

            <nav aria-label="Fő navigáció" className="relative flex-1 px-6 pt-6">
              <ul className="flex flex-col">
                {primaryNav.map((item, index) => {
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <li key={item.href} className="border-b border-border/60">
                      <Link
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        data-mobile-item=""
                        style={{ '--i': index } as React.CSSProperties}
                        className={cn(
                          'font-display flex items-baseline justify-between py-5 text-3xl',
                          active ? 'text-primary' : 'text-foreground',
                        )}
                      >
                        {item.label}
                        <span aria-hidden="true" className="text-xs tracking-[0.2em] text-muted">
                          0{index + 1}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-10 space-y-1 text-sm text-muted">
                <p className="text-foreground">{fullAddress}</p>
                <p>{hoursSummary}</p>
              </div>
            </nav>

            <div className="relative sticky bottom-0 mt-8 space-y-3 border-t border-border bg-background px-6 py-6">
              <ExternalButtonLink
                href={foodoraUrl}
                size="lg"
                label="Rendelés a Foodorán — új lapon nyílik meg"
                className="w-full"
              >
                Rendelés Foodorán
              </ExternalButtonLink>
              <a
                href={phoneHref}
                className="flex h-12 w-full items-center justify-center rounded-sm border border-border text-xs uppercase tracking-[0.14em] text-foreground"
              >
                {phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
