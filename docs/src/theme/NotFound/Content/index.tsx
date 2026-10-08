import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type {Props} from '@theme/NotFound/Content';

const INK = '#001405';
const ROAD = 'M46 150C120 150 150 96 236 96S356 150 430 150';

/** The docs' 404, matching the site's: a road that stops at a barrier, and the ways back. */
export default function NotFoundContent({className}: Props): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <main className={clsx('container', 'df-404', className)}>
      <svg className="df-404__graphic" viewBox="0 0 520 230" aria-hidden="true" focusable="false">
        <path d={ROAD} fill="none" stroke={INK} strokeWidth="34" strokeLinecap="round" />
        <path d={ROAD} fill="none" stroke="#9dc4f5" strokeWidth="28" strokeLinecap="round" />
        <path d={ROAD} fill="none" stroke="#ffffff" strokeWidth="3" strokeDasharray="12 14" strokeLinecap="round" />
        <path d="M46 150S26 128 26 112a20 20 0 0 1 40 0C66 128 46 150 46 150Z" fill="#d1f500" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <circle cx="46" cy="112" r="7.5" fill="#ffffff" stroke={INK} strokeWidth="3" />
        <path d="M430 196V122M486 196V122" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <rect x="414" y="118" width="90" height="30" rx="6" fill="#ffffff" stroke={INK} strokeWidth="3" />
        <path d="M428 118l-14 14M452 118l-30 30M476 118l-30 30M500 118l-30 30M504 138l-10 10" stroke={INK} strokeWidth="7" />
        <rect x="414" y="118" width="90" height="30" rx="6" fill="none" stroke={INK} strokeWidth="3" />
        <path d="M470 22C471 33 478 40 489 41 478 42 471 49 470 60 469 49 462 42 451 41 462 40 469 33 470 22Z" fill="#d1f500" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      </svg>
      <p className="df-404__code">Error 404</p>
      <h1 className="df-404__title">This page doesn’t exist.</h1>
      <p className="df-404__text">
        It may have moved when the docs were organised by phase. Search the docs, or start from one of these.
      </p>
      <div className="df-404__actions">
        <Link className="df-404__button df-404__button--primary" to="/">
          Docs home
        </Link>
        <Link className="df-404__button" to="/phase-1">
          Phase 1
        </Link>
        <Link className="df-404__button" href={String(siteConfig.customFields?.siteUrl ?? '/')}>
          Definica website
        </Link>
      </div>
    </main>
  );
}
