"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { linkEvent, startAnalytics, stopAnalytics, track, trackPageview } from "@/lib/analytics";
import { onConsentSettingsOpen, readConsent, writeConsent, type ConsentChoice } from "@/lib/consent";
import { AppButton } from "./AppButton";
import { AppLink } from "./AppLink";
import { settings, type CmsLink } from "./content";
import styles from "./CookieBanner.module.css";

const copy: { title: string; text: string; accept: string; reject: string; policy: CmsLink } = settings.cookieBanner;

/** Shown once the page has settled, so it doesn't compete with the loader. */
const FIRST_SHOW_DELAY = 1400;

/** A hand-drawn cookie in the stickers' style. */
function CookieIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <path
        d="M20 3.5c2 0 3.4 1.6 3.2 3.4-.3 2.3 1.6 4 3.8 3.6 2-.3 3.6 1.3 3.4 3.3-.2 2.4 2 4.1 4.3 3.5 1.1 7.7-4.4 18.2-14.7 18.2C10.6 35.5 3.5 28.4 3.5 19.8 3.5 10.8 10.8 3.5 20 3.5Z"
        fill="#fbe74e"
        stroke="#001405"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="13" cy="16" r="2.2" fill="#001405" />
      <circle cx="20.5" cy="23.5" r="2.4" fill="#001405" />
      <circle cx="12.5" cy="26" r="1.7" fill="#001405" />
      <circle cx="27" cy="27" r="1.8" fill="#001405" />
      <circle cx="19" cy="13.5" r="1.4" fill="#001405" />
    </svg>
  );
}

/**
 * The cookie banner and the analytics it controls. Nothing is tracked until the visitor accepts;
 * the choice is remembered (see consent.ts) and can be changed from "Cookie settings" in the
 * footer. With consent, page views and clicks towards the app, the docs and the community
 * channels are sent to PostHog.
 */
export function CookieBanner() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // First visit: ask once the page has settled. The footer link can reopen the banner at any time.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!readConsent()) setOpen(true);
    }, FIRST_SHOW_DELAY);
    const unsubscribe = onConsentSettingsOpen(() => setOpen(true));
    return () => {
      window.clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  // A page view per route, once consent is given.
  useEffect(() => {
    if (readConsent() !== "granted") return;
    startAnalytics().then(() => trackPageview());
  }, [pathname]);

  // Clicks towards the app, the docs and the community channels.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!anchor || readConsent() !== "granted") return;
      const tracked = linkEvent(anchor.getAttribute("href") ?? "");
      if (tracked) track(tracked.event, tracked.properties);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  const choose = (choice: ConsentChoice) => {
    writeConsent(choice);
    setOpen(false);
    if (choice === "granted") startAnalytics().then(() => trackPageview());
    else stopAnalytics();
  };

  return (
    <section className={styles.banner} data-open={open ? "true" : "false"} aria-label="Cookie consent" aria-hidden={!open}>
      <div className={styles.head}>
        <CookieIcon />
        <h2 className={`${styles.title} AppTitle-10`}>{copy.title}</h2>
      </div>
      <p className={`${styles.text} AppText-8`}>
        {copy.text}{" "}
        <AppLink {...copy.policy} className={styles.link} tabIndex={open ? 0 : -1}>
          {copy.policy.title}
        </AppLink>
      </p>
      <div className={styles.actions}>
        <AppButton
          tag="button"
          size="small"
          theme="border-light"
          label={copy.reject}
          className={styles.button}
          tabIndex={open ? 0 : -1}
          onClick={() => choose("denied")}
        />
        <AppButton
          tag="button"
          size="small"
          theme="dark"
          label={copy.accept}
          className={styles.button}
          tabIndex={open ? 0 : -1}
          onClick={() => choose("granted")}
        />
      </div>
    </section>
  );
}
