'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CONSENT_EVENT, readConsent, writeConsent } from '@/lib/consent';
import { cn } from '@/lib/cn';

/**
 * The consent notice.
 *
 * A small panel in the lower corner, in the site's own material — not a bar
 * across the viewport and not a modal that blocks the page. The visitor can read
 * and use the site while deciding, which is both better manners and lawful:
 * nothing non-essential has loaded yet, so nothing is waiting on the answer.
 *
 * The three answers are given equal visual weight. Making "accept" loud and
 * "reject" a grey link is a dark pattern and is not a free choice under GDPR.
 *
 * It renders nothing until it has checked storage on the client, so a returning
 * visitor never sees it flash before it works out they already answered.
 */
export function CookieConsent() {
  const [status, setStatus] = useState<'checking' | 'asking' | 'settled'>('checking');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const sync = useCallback(() => {
    setStatus(readConsent() ? 'settled' : 'asking');
  }, []);

  useEffect(() => {
    sync();
    // The footer's "Cookie beállítások" link clears the record and fires this.
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, [sync]);

  // Move focus to the panel when it is re-opened from the footer, so a keyboard
  // user is taken to the thing they just asked for.
  useEffect(() => {
    if (status !== 'asking') return;
    if (!readConsent() && document.activeElement?.closest('footer')) {
      panelRef.current?.focus();
    }
  }, [status]);

  if (status !== 'asking') return null;

  const decide = (externalMedia: boolean) => {
    writeConsent({ externalMedia });
    setStatus('settled');
  };

  return (
    <div
      ref={panelRef}
      role="region"
      aria-label="Adatvédelmi beállítások"
      tabIndex={-1}
      data-consent-panel=""
      className={cn(
        'fixed bottom-0 left-0 right-0 z-[70] p-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-[26rem] sm:p-0',
      )}
    >
      <div className="relative border border-border bg-surface/95 p-6 shadow-xl backdrop-blur-md">
        <span
          aria-hidden="true"
          className="absolute left-3 top-3 h-3 w-3 border-l border-t border-primary/40"
        />

        <h2 className="font-display text-xl text-foreground">Az Ön adatvédelme</h2>

        <p className="mt-3 text-sm leading-relaxed text-muted">
          Ez az oldal a működéséhez szükséges tárolást használ. A Google Térkép beágyazása külső
          szolgáltatás, amely saját sütiket helyez el — ezt csak az Ön hozzájárulásával töltjük be.
        </p>

        <button
          type="button"
          onClick={() => setDetailsOpen((open) => !open)}
          aria-expanded={detailsOpen}
          aria-controls="consent-details"
          className="mt-4 text-xs uppercase tracking-[0.16em] text-primary transition-opacity hover:opacity-75"
        >
          {detailsOpen ? 'Részletek elrejtése' : 'Beállítások és részletek'}
        </button>

        {detailsOpen ? (
          <dl id="consent-details" className="mt-4 space-y-4 border-t border-border pt-4 text-sm">
            <div>
              <dt className="flex items-baseline justify-between gap-3 text-foreground">
                Szükséges
                <span className="text-xs uppercase tracking-[0.14em] text-muted">Mindig aktív</span>
              </dt>
              <dd className="mt-1 text-xs leading-relaxed text-muted">
                Az Ön adatvédelmi döntésének megjegyzése. Nem követi Önt, és nem hagyja el a
                böngészőjét.
              </dd>
            </div>
            <div>
              <dt className="flex items-baseline justify-between gap-3 text-foreground">
                Külső tartalom
                <span className="text-xs uppercase tracking-[0.14em] text-muted">Választható</span>
              </dt>
              <dd className="mt-1 text-xs leading-relaxed text-muted">
                Google Térkép a Megközelítés oldalon. Hozzájárulás nélkül a cím, a nyitvatartás és
                az útvonaltervezés gombja továbbra is elérhető.
              </dd>
            </div>
          </dl>
        ) : null}

        {/* Equal weight: accepting is not made easier than declining. */}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button type="button" onClick={() => decide(true)} size="sm" className="flex-1">
            Elfogadom
          </Button>
          <Button
            type="button"
            onClick={() => decide(false)}
            size="sm"
            variant="outline"
            className="flex-1"
          >
            Csak szükséges
          </Button>
        </div>

        <p className="mt-4 text-xs text-muted">
          Részletek a{' '}
          <Link href="/cookie-tajekoztato" className="text-primary underline underline-offset-4">
            cookie tájékoztatóban
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
