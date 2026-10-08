import React, {type ReactNode} from 'react';
import {
  useDocById,
  findFirstSidebarItemLink,
} from '@docusaurus/plugin-content-docs/client';
import {
  extractLeadingEmoji,
  useDocCardDescriptionCategoryItemsPlural,
} from '@docusaurus/theme-common/internal';
import Layout from '@theme/DocCard/Layout';

import type {Props} from '@theme/DocCard';
import type {
  PropSidebarItemCategory,
  PropSidebarItemLink,
} from '@docusaurus/plugin-content-docs';

/**
 * Fills of the card's blob badge, in the landing page's tones (see `BLOB_FILLS` in the main
 * repo's SurtitleWithDot). A card's tone is derived from its title so a grid mixes them.
 */
const BLOB_TONES = ['#05c92f', '#9dc4f5', '#fbe74e', '#ffcadc'];

function pickTone(title: string): string {
  let hash = 7;
  for (const char of title) {
    hash = (hash * 31 + char.charCodeAt(0)) % 1000003;
  }
  return BLOB_TONES[hash % BLOB_TONES.length]!;
}

/**
 * The card badge is always the blob, never an emoji. A leading emoji in a sidebar label is
 * dropped from the title; the blob's fill is passed to `DocCard/Heading/Icon` as `icon`.
 */
function getIconTitleProps(
  item: PropSidebarItemLink | PropSidebarItemCategory,
): {icon: ReactNode; title: string} {
  const extracted = extractLeadingEmoji(item.label);
  const title = extracted.rest.trim() || item.label;
  return {icon: pickTone(title), title};
}

function CardCategory({item}: {item: PropSidebarItemCategory}): ReactNode {
  const href = findFirstSidebarItemLink(item);
  const categoryItemsPlural = useDocCardDescriptionCategoryItemsPlural();

  // Unexpected: categories that don't have a link have been filtered upfront
  if (!href) {
    return null;
  }
  return (
    <Layout
      item={item}
      className={item.className}
      href={href}
      description={item.description ?? categoryItemsPlural(item.items.length)}
      {...getIconTitleProps(item)}
    />
  );
}

function CardLink({item}: {item: PropSidebarItemLink}): ReactNode {
  const doc = useDocById(item.docId ?? undefined);
  return (
    <Layout
      item={item}
      className={item.className}
      href={item.href}
      description={item.description ?? doc?.description}
      {...getIconTitleProps(item)}
    />
  );
}

export default function DocCard({item}: Props): ReactNode {
  switch (item.type) {
    case 'link':
      return <CardLink item={item} />;
    case 'category':
      return <CardCategory item={item} />;
    default:
      throw new Error(`unknown item type ${JSON.stringify(item)}`);
  }
}
