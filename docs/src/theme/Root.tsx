import React, {useEffect, useState, type ReactNode} from 'react';
import {useLocation} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {onConsentSettingsOpen, readConsent, writeConsent, type ConsentChoice} from '@site/src/lib/consent';
import {startAnalytics, stopAnalytics, trackPageview} from '@site/src/lib/analytics';

/** Shown once the page has settled. */
const FIRST_SHOW_DELAY = 1200;

/** A hand-drawn cookie, as on the site's banner. */
function CookieIcon() {
  return (
    <svg className="df-cookie__icon" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
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
 * Wraps every docs page: the cookie banner (the same choice as on definica.com, shared through the
 * `definica_consent` cookie) and a PostHog page view per route once the visitor accepts.
 */
export default function Root({children}: {children: ReactNode}): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const key = String(siteConfig.customFields?.posthogKey ?? '');
  const host = String(siteConfig.customFields?.posthogHost ?? 'https://eu.i.posthog.com');
  const {pathname} = useLocation();
  const [open, setOpen] = useState(false);

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

  useEffect(() => {
    if (readConsent() !== 'granted') return;
    startAnalytics(key, host).then(() => trackPageview());
  }, [pathname, key, host]);

  const choose = (choice: ConsentChoice) => {
    writeConsent(choice);
    setOpen(false);
    if (choice === 'granted') startAnalytics(key, host).then(() => trackPageview());
    else stopAnalytics();
  };

  return (
    <>
      {children}
      <section className="df-cookie" data-open={open ? 'true' : 'false'} aria-label="Cookie consent" aria-hidden={!open}>
        <div className="df-cookie__head">
          <CookieIcon />
          <h2 className="df-cookie__title">Cookies</h2>
        </div>
        <p className="df-cookie__text">
          We use analytics cookies to understand how Definica is used. They’re only set if you accept.{' '}
          <a href={`${String(siteConfig.customFields?.siteUrl ?? '')}/privacy`} tabIndex={open ? 0 : -1}>
            Privacy policy
          </a>
        </p>
        <div className="df-cookie__actions">
          <button type="button" className="df-cookie__button" tabIndex={open ? 0 : -1} onClick={() => choose('denied')}>
            Reject
          </button>
          <button
            type="button"
            className="df-cookie__button df-cookie__button--primary"
            tabIndex={open ? 0 : -1}
            onClick={() => choose('granted')}>
            Accept
          </button>
        </div>
      </section>
    </>
  );
}
