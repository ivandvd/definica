"use client";

import { useSyncExternalStore } from "react";

/*
 * The developer tools (Settings: switch account, wallet network, make the next transaction fail,
 * move time on, Vault states) are hidden unless this browser has them on. Open any app page with
 * `?devtools=1` to turn them on, `?devtools=0` to turn them off again; the choice is remembered here.
 */

const KEY = "definica.app.devtools";
const listeners = new Set<() => void>();

function read(): boolean {
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

/** Applies `?devtools=1` / `?devtools=0` from the address bar, if present. */
export function syncDevToolsFromUrl() {
  try {
    const value = new URLSearchParams(window.location.search).get("devtools");
    if (value === null) return;
    if (value === "1") window.localStorage.setItem(KEY, "1");
    else window.localStorage.removeItem(KEY);
    listeners.forEach((listener) => listener());
  } catch {
    // Storage blocked: the tools stay off.
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/** Whether this browser shows the developer tools. */
export const useDevTools = () => useSyncExternalStore(subscribe, read, () => false);
