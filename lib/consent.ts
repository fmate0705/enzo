/**
 * Consent state.
 *
 * The site sets no cookie and loads no third-party resource until the visitor
 * says so. There is exactly one non-essential category because there is exactly
 * one non-essential thing on the site: the Google Maps embed, which sets Google
 * cookies the moment its iframe loads.
 *
 * A toggle that controls nothing is theatre, so no analytics category is offered
 * — nothing on this site collects analytics today. docs/CONSENT.md explains how
 * to add one properly when something does.
 *
 * The record itself is kept in localStorage, not a cookie: it never needs to
 * reach the server, so sending it on every request would be waste.
 */

export const CONSENT_STORAGE_KEY = 'enzo-consent';
export const CONSENT_EVENT = 'enzo:consent-change';

/** Bumped when the categories change, which re-asks visitors who answered the old set. */
export const CONSENT_VERSION = 1;

export interface ConsentState {
  version: number;
  /** Google Maps embed. */
  externalMedia: boolean;
  /** ISO timestamp of the decision, so the choice is auditable. */
  decidedAt: string;
}

export const DENY_ALL: Omit<ConsentState, 'decidedAt'> = {
  version: CONSENT_VERSION,
  externalMedia: false,
};

export function readConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    // A record written against an older category set is not a decision about
    // the current one. Treat it as unanswered rather than assuming consent.
    if (parsed.version !== CONSENT_VERSION) return null;
    if (typeof parsed.externalMedia !== 'boolean') return null;
    return {
      version: CONSENT_VERSION,
      externalMedia: parsed.externalMedia,
      decidedAt: typeof parsed.decidedAt === 'string' ? parsed.decidedAt : new Date().toISOString(),
    };
  } catch {
    // Private mode, disabled storage, corrupt JSON — all mean "no decision on
    // record", which is the safe reading.
    return null;
  }
}

export function writeConsent(choice: { externalMedia: boolean }): ConsentState {
  const state: ConsentState = {
    version: CONSENT_VERSION,
    externalMedia: choice.externalMedia,
    decidedAt: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable: the choice still applies to this page view via the
    // event below, it simply will not be remembered.
  }
  window.dispatchEvent(new CustomEvent<ConsentState>(CONSENT_EVENT, { detail: state }));
  return state;
}

/** Clears the record so the notice is shown again. Used by the "settings" link. */
export function resetConsent(): void {
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    /* nothing to clear */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }));
}
