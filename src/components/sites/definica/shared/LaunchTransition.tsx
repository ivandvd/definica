"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./LaunchTransition.module.css";

/* The Definica "D" and its slash, in lime on the ink curtain (the app's tab-bar hexagon colours). */
const MARK_D =
  "M9.12705 0.252278C10.8655 0.252278 12.4782 0.553437 13.9651 1.15575C15.4519 1.73576 16.7444 2.56116 17.8424 3.63194C18.9632 4.68042 19.8325 5.91851 20.4501 7.34622C21.0677 8.75163 21.3765 10.2909 21.3765 11.964C21.3765 13.6148 21.0677 15.154 20.4501 16.5817C19.8325 18.0095 18.9747 19.2587 17.8767 20.3295C16.7787 21.378 15.4862 22.2034 13.9994 22.8057C12.5125 23.3857 10.9113 23.6757 9.19568 23.6757H1.78138C0.797549 23.6757 0 22.869 0 21.8739V2.05408C0 1.05897 0.797549 0.252278 1.78138 0.252278H9.12705ZM9.38556 5.45784L3.9263 11.3478C3.6051 11.6944 3.6051 12.2336 3.9263 12.5801L4.48495 13.1829L5.90247 14.7122L9.38556 18.4701C9.73745 18.8498 10.3333 18.8498 10.6851 18.4701L16.1444 12.5801C16.4656 12.2336 16.4656 11.6944 16.1444 11.3478L15.6535 10.8182L14.236 9.28886L10.6851 5.45784C10.3333 5.07819 9.73745 5.07819 9.38556 5.45784Z";
const MARK_SLASH =
  "M16.9295 10.3087L15.6535 10.8182L5.90247 14.7122L3.93511 15.4979L3.21179 13.6913L4.48495 13.1829L14.236 9.28886L16.2061 8.50211L16.9295 10.3087Z";

/** How long the curtain takes to close before the app loads behind it. */
const CLOSE_MS = 640;

/** The flag the app reads to lift the same curtain on arrival (see the app's root layout). */
const FLAG = "definica:launch";

function isAppLink(url: URL) {
  if (url.origin === window.location.origin) return url.pathname === "/app" || url.pathname.startsWith("/app/");
  return url.hostname.startsWith("app.");
}

/**
 * Launch App, with a transition: a lime then an ink curtain sweep up over the page (the brand
 * buttons' green sweep, scaled up) with the Definica mark in the middle, then the app loads behind
 * it and lifts the same curtain. Plain navigation with reduced motion or a modified click.
 */
export function LaunchTransition() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (!isAppLink(url) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      event.preventDefault();
      event.stopPropagation();
      try {
        window.sessionStorage.setItem(FLAG, String(Date.now()));
      } catch {
        // Without storage the app simply opens without its reveal.
      }
      // The app may sit on another address (or be redirected there), which can't read this tab's
      // storage: say it in the URL too. The app takes it out of the address bar on arrival.
      url.searchParams.set("launch", "1");
      setActive(true);
      window.setTimeout(() => window.location.assign(url.href), CLOSE_MS);
    };
    // Coming back with the back button restores this page from the cache, curtain and all.
    const onShow = (event: PageTransitionEvent) => {
      if (event.persisted) setActive(false);
    };
    document.addEventListener("click", onClick, { capture: true });
    window.addEventListener("pageshow", onShow);
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener("pageshow", onShow);
    };
  }, []);

  if (!active) return null;
  return createPortal(
    <div className={styles.root} aria-hidden="true">
      <div className={styles.lime} />
      <div className={styles.ink}>
        <svg className={styles.mark} viewBox="-0.6 0 22.6 24" focusable="false">
          <path fillRule="evenodd" clipRule="evenodd" d={MARK_D} fill="#d1f500" />
          <path d={MARK_SLASH} fill="#d1f500" />
        </svg>
      </div>
    </div>,
    document.body,
  );
}
