'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button, ExternalButtonLink } from '@/components/ui/button';
import { CONSENT_EVENT, readConsent, writeConsent } from '@/lib/consent';

/**
 * The Google Maps embed, gated on consent.
 *
 * Before consent nothing from Google is requested — no iframe, no script, no
 * cookie. In its place sits a designed panel carrying the same information the
 * map would: the address, the coordinates, and a working directions link that
 * leaves the site rather than embedding it.
 *
 * Two failure modes are handled rather than assumed away:
 * - The visitor declines. The panel stays, permanently useful. It is not a
 *   nag: the one button re-offers the map, it does not re-ask on every visit.
 * - The iframe itself fails (blocked by an extension, offline, Google down).
 *   The `loaded` flag never flips, and the fallback content stays underneath.
 */
export function MapEmbed({
  title,
  fullAddress,
  latitude,
  longitude,
  embedUrl,
  directionsUrl,
}: {
  title: string;
  fullAddress: string;
  latitude: number;
  longitude: number;
  embedUrl: string;
  directionsUrl: string;
}) {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [loaded, setLoaded] = useState(false);

  const sync = useCallback(() => {
    setAllowed(readConsent()?.externalMedia ?? false);
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, [sync]);

  // Until the client has read storage we render the placeholder's frame without
  // its prompt, so the layout never jumps between the two states.
  const undecided = allowed === null;

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden border border-border bg-surface sm:aspect-[16/10]">
      {allowed ? (
        <>
          <iframe
            src={embedUrl}
            title={title}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setLoaded(true)}
            className="absolute inset-0 h-full w-full border-0 [color-scheme:dark]"
            style={{
              // Google's tiles are light. A restrained filter seats the map in
              // the page without making the streets unreadable.
              filter: 'grayscale(0.55) contrast(0.92) brightness(0.82)',
            }}
          />
          {!loaded ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <p className="text-sm text-muted">Térkép betöltése…</p>
            </div>
          ) : null}
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-8 text-center">
          <div className="grain absolute inset-0" aria-hidden="true" />

          <div className="relative">
            <p className="font-display mt-3 text-2xl text-foreground">{fullAddress}</p>
            <p className="mt-2 text-xs tabular-nums tracking-[0.1em] text-muted">
              {latitude.toFixed(5)}° É, {longitude.toFixed(5)}° K
            </p>
          </div>

          {!undecided ? (
            <div className="relative flex flex-col items-center gap-3">
              <p className="max-w-sm text-sm leading-relaxed text-muted">
                A Google Térkép külső szolgáltatás, amely sütiket helyez el. Betöltéshez
                hozzájárulás szükséges.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    writeConsent({ externalMedia: true });
                    setAllowed(true);
                  }}
                >
                  Térkép betöltése
                </Button>
                <ExternalButtonLink
                  href={directionsUrl}
                  size="sm"
                  variant="outline"
                  label="Útvonaltervezés a Google Térképen — új lapon nyílik meg"
                >
                  Útvonaltervezés
                </ExternalButtonLink>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
