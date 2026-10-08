/*
 * Display preferences, kept on this device only (localStorage). An external store, so screens
 * read them with useSyncExternalStore and the server renders the defaults.
 */

export interface Preferences {
  /** Masks every balance and amount (the eye on the position card). */
  hideBalances: boolean;
  /** Lists each source of return under the Liquidity Module total (never a blended figure). */
  showLayers: boolean;
  /** Decimals for amounts: 2 for a calmer screen, 4 for detail. */
  precision: 2 | 4;
  /** The position card's headline: the ETH value or the Vault shares. */
  positionUnit: "eth" | "shares";
}

export const DEFAULT_PREFERENCES: Preferences = {
  hideBalances: false,
  showLayers: true,
  precision: 4,
  positionUnit: "eth",
};

const STORAGE_KEY = "definica.app.preferences";

let current: Preferences | null = null;
const listeners = new Set<() => void>();

function read(): Preferences {
  if (current) return current;
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    current = saved ? { ...DEFAULT_PREFERENCES, ...(JSON.parse(saved) as Partial<Preferences>) } : DEFAULT_PREFERENCES;
  } catch {
    current = DEFAULT_PREFERENCES;
  }
  return current;
}

export const preferencesStore = {
  get: read,
  getServer: () => DEFAULT_PREFERENCES,
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  set(patch: Partial<Preferences>) {
    current = { ...read(), ...patch };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch {
      // Unavailable storage just means the choice lasts for this visit.
    }
    listeners.forEach((listener) => listener());
  },
  /** Settings → Clear local data. */
  clear() {
    current = DEFAULT_PREFERENCES;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nothing stored.
    }
    listeners.forEach((listener) => listener());
  },
};
