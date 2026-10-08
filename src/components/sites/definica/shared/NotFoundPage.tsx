"use client";

import { AppButton } from "./AppButton";
import { AppLink } from "./AppLink";
import { AppSvg } from "./AppSvg";
import styles from "./NotFoundPage.module.css";

const INK = "#001405";
const ROAD = "M46 150C120 150 150 96 236 96S356 150 430 150";

/** A road that leaves from a pin and stops at a barrier: the page's only graphic. */
function DeadEnd() {
  return (
    <svg className={styles.graphic} viewBox="0 0 520 230" aria-hidden="true" focusable="false">
      <path d={ROAD} fill="none" stroke={INK} strokeWidth="34" strokeLinecap="round" />
      <path d={ROAD} fill="none" stroke="#9dc4f5" strokeWidth="28" strokeLinecap="round" />
      <path d={ROAD} fill="none" stroke="#ffffff" strokeWidth="3" strokeDasharray="12 14" strokeLinecap="round" />
      <g className={styles.pin}>
        <path d="M46 150S26 128 26 112a20 20 0 0 1 40 0C66 128 46 150 46 150Z" fill="#d1f500" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <circle cx="46" cy="112" r="7.5" fill="#ffffff" stroke={INK} strokeWidth="3" />
      </g>
      <g className={styles.barrier}>
        <path d="M430 196V122M486 196V122" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <rect x="414" y="118" width="90" height="30" rx="6" fill="#ffffff" stroke={INK} strokeWidth="3" />
        <path d="M428 118l-14 14M452 118l-30 30M476 118l-30 30M500 118l-30 30M504 138l-10 10" stroke={INK} strokeWidth="7" />
        <rect x="414" y="118" width="90" height="30" rx="6" fill="none" stroke={INK} strokeWidth="3" />
      </g>
      <g className={styles.sparkle}>
        <path
          d="M470 22C471 33 478 40 489 41 478 42 471 49 470 60 469 49 462 42 451 41 462 40 469 33 470 22Z"
          fill="#d1f500"
          stroke={INK}
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
      </g>
      <g className={styles.blob}>
        <path
          d="M215 6c7-.4 15 3.2 17.8 10 2.4 6.2-.6 10.8.4 16.4.8 5.4-4 11.2-10.8 12.2-6 .8-9.2-2.6-15.2-2.2-6 .4-11.2-3.4-12.2-9.8-1-6.2 3.2-8.8 3.2-14.8C198.4 9.8 206.2 5 215 6Z"
          fill="#ffcadc"
          stroke={INK}
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

/** The 404 page (rendered by app/global-not-found.tsx for any unknown URL, on the site or in the app). */
export function NotFoundPage() {
  return (
    <main className={styles.page}>
      <header className={`${styles.top} AppWrapper-1600`}>
        <AppLink to={{ path: "/" }} aria-label="Definica home" className={styles.logo}>
          <AppSvg name="definica-logo" className={styles.logoIcon} />
        </AppLink>
      </header>
      <section className={`${styles.body} AppWrapper-1160`}>
        <DeadEnd />
        <p className={`${styles.code} AppSurtitle-2`}>Error 404</p>
        <h1 className={`${styles.title} AppTitle-5`}>This road doesn’t go anywhere.</h1>
        <p className={`${styles.text} AppText-1`}>
          The page you’re looking for has moved, or never existed. These roads do lead somewhere.
        </p>
        <div className={styles.actions}>
          <AppButton to={{ path: "/" }} size="small" theme="dark" label="Back to home" />
          <AppButton to={{ path: "/roadmap" }} size="small" theme="border-light" label="See the roadmap" />
          <AppButton to={{ path: "/docs" }} size="small" theme="border-light" label="Read the docs" />
        </div>
      </section>
    </main>
  );
}
