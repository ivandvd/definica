"use client";

import { useSyncExternalStore } from "react";

const DESKTOP = "(min-width: 1024px)";

const subscribe = (query: string) => (onChange: () => void) => {
  const list = window.matchMedia(query);
  list.addEventListener("change", onChange);
  return () => list.removeEventListener("change", onChange);
};

const subscribeDesktop = subscribe(DESKTOP);
const getDesktop = () => window.matchMedia(DESKTOP).matches;
const getServer = () => false;

/**
 * Whether the wide layout is showing. For choosing a sheet or a dialog when one opens; layout itself
 * stays in CSS so the first paint is right.
 */
export function useIsDesktop() {
  return useSyncExternalStore(subscribeDesktop, getDesktop, getServer);
}
