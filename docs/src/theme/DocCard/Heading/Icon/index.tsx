import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import type {Props} from '@theme/DocCard/Heading/Icon';

import styles from './styles.module.css';

/** The landing page's hand-drawn blob: ink outline, flat fill (a 24 x 24 path). */
const BLOB_PATH =
  'M12.4 2.3c3.5-.2 7.6 1.6 8.9 5 1.2 3.1-.3 5.4.2 8.2.4 2.7-2 5.6-5.4 6.1-3 .4-4.6-1.3-7.6-1.1-3 .2-5.6-1.7-6.1-4.9-.5-3.1 1.6-4.4 1.6-7.4C4 4.9 7.9 2.5 12.4 2.3Z';

/** `icon` carries the blob's fill colour (set by `DocCard`); anything else falls back to green. */
export default function DocCardHeadingIcon({icon}: Props): ReactNode {
  const fill = typeof icon === 'string' && icon.startsWith('#') ? icon : '#05c92f';
  return (
    <span
      className={clsx(ThemeClassNames.docs.docCard.icon, styles.cardTitleIcon)}
      aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        <path
          d={BLOB_PATH}
          fill={fill}
          stroke="#001405"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
