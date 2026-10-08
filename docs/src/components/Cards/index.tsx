import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';

/** The landing page's hand-drawn blob (see `BLOB_PATH` in the main repo's SurtitleWithDot). */
const BLOB_PATH =
  'M12.4 2.3c3.5-.2 7.6 1.6 8.9 5 1.2 3.1-.3 5.4.2 8.2.4 2.7-2 5.6-5.4 6.1-3 .4-4.6-1.3-7.6-1.1-3 .2-5.6-1.7-6.1-4.9-.5-3.1 1.6-4.4 1.6-7.4C4 4.9 7.9 2.5 12.4 2.3Z';

/** Blob fills, as `BLOB_FILLS` on the landing page. */
const BLOB_FILLS = {
  green: '#05c92f',
  red: '#ff5a4d',
  baby: '#ffcadc',
  lemonade: '#fbe74e',
  sky: '#9dc4f5',
} as const;

export type BlobFill = keyof typeof BLOB_FILLS;
export type CardTone = 'white' | 'sky' | 'baby' | 'lemonade' | 'mint' | 'grey';

export function Blob({fill = 'green', className}: {fill?: BlobFill; className?: string}): ReactNode {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d={BLOB_PATH}
        fill={BLOB_FILLS[fill]}
        stroke="#001405"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Cards({
  children,
  columns = 3,
}: {
  children: ReactNode;
  columns?: 2 | 3;
}): ReactNode {
  return <div className={clsx('df-cards', columns === 2 && 'df-cards--2')}>{children}</div>;
}

export function Card({
  to,
  title,
  kicker,
  tone = 'white',
  blob = 'green',
  more = 'Read more',
  children,
}: {
  to: string;
  title: string;
  kicker?: string;
  tone?: CardTone;
  blob?: BlobFill;
  more?: string;
  children?: ReactNode;
}): ReactNode {
  return (
    <Link to={to} className={clsx('df-card', tone !== 'white' && `df-tone-${tone}`)}>
      <Blob fill={blob} className="df-card__blob" />
      {kicker && <span className="df-card__kicker">{kicker}</span>}
      <span className="df-card__title">{title}</span>
      {children && <span className="df-card__text">{children}</span>}
      <span className="df-card__more">{more}</span>
    </Link>
  );
}
