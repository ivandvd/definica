/**
 * The visitor's cookie choice, kept in one strictly necessary cookie (`definica_consent`, 12 months).
 * On definica.com it is set for the whole domain, so a choice made on the site also holds on the
 * docs and the web app; elsewhere (localhost, previews) it stays on the current host.
 * Browser-only: every function here must run after mount.
 */
export type ConsentChoice = "granted" | "denied";

const COOKIE = "definica_consent";
const MAX_AGE = 60 * 60 * 24 * 365;
const OPEN_EVENT = "definica:consent-open";

const listeners = new Set<(choice: ConsentChoice) => void>();

const domainAttribute = () => {
  const host = window.location.hostname;
  return host === "definica.com" || host.endsWith(".definica.com") ? "; domain=.definica.com" : "";
};

export function readConsent(): ConsentChoice | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE}=([^;]*)`));
  const value = match ? decodeURIComponent(match[1]) : null;
  return value === "granted" || value === "denied" ? value : null;
}

export function writeConsent(choice: ConsentChoice) {
  const secure = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${COOKIE}=${choice}; max-age=${MAX_AGE}; path=/; samesite=lax${secure}${domainAttribute()}`;
  listeners.forEach((listener) => listener(choice));
}

/** Called whenever the visitor makes or changes a choice. Returns an unsubscribe function. */
export function onConsentChange(listener: (choice: ConsentChoice) => void) {
  listeners.add(listener);
  return () => void listeners.delete(listener);
}

/** Asks the cookie banner to open again (the footer's "Cookie settings" link). */
export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onConsentSettingsOpen(listener: () => void) {
  window.addEventListener(OPEN_EVENT, listener);
  return () => window.removeEventListener(OPEN_EVENT, listener);
}
