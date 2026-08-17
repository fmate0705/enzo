'use client';

import { resetConsent } from '@/lib/consent';

/**
 * Re-opens the consent notice from the footer.
 *
 * A withdrawal route has to be as easy to reach as the original consent was, so
 * it sits in the legal row on every page. Clearing the record is what actually
 * withdraws consent: the map embed listens to the same event and unmounts its
 * iframe immediately, rather than staying loaded until the next navigation.
 */
export function ConsentSettingsButton() {
  return (
    <button
      type="button"
      onClick={resetConsent}
      className="text-xs text-muted underline-offset-4 transition-colors hover:text-foreground hover:underline"
    >
      Cookie beállítások
    </button>
  );
}
