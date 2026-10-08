"use client";

import { useRef, type ReactNode } from "react";
import { AppLink } from "../AppLink";
import { useRise } from "../motion";
import { BLOB_PATH } from "../SurtitleWithDot";
import { C, INK } from "./art";
import { toneFill, type IconItem, type PageHead, type TitledText } from "./content";
import { StickerIcon } from "./icons";
import styles from "./kit.module.css";
import { Section } from "./Section";

const cx = (...names: (string | false | null | undefined)[]) => names.filter(Boolean).join(" ");

/** A link to another page or to the docs, written in the JSON as a path. */
export interface PageLink {
  title: string;
  to: string;
}

/** An inline link in running text, with the site's lime underline. */
export function TextLink({ link }: { link: PageLink }) {
  return (
    <AppLink to={link.to} trailingSlash={false} className={styles.link}>
      {link.title}
    </AppLink>
  );
}

/** A card: a sticker, a title and a short text; white on grey, or outlined on white (`line`). */
export function Card({ item, line = false, index = 0, children }: { item: IconItem; line?: boolean; index?: number; children?: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useRise(ref, { delay: 0.08 * (index % 4) });

  return (
    <article ref={ref} className={cx(styles.card, line && styles.cardLine)}>
      <StickerIcon name={item.icon} tone={toneFill(item.tone)} className={styles.cardIcon} />
      <h3 className={styles.cardTitle}>{item.title}</h3>
      <p className={`${styles.cardText} AppText-8`}>{item.text}</p>
      {children}
    </article>
  );
}

/** Cards in two, three or four columns on desktop (two on wide phones, one on narrow ones). */
export function CardGrid({ items, columns = 3, line = false }: { items: IconItem[]; columns?: 2 | 3 | 4; line?: boolean }) {
  const grid = columns === 2 ? styles.grid2 : columns === 4 ? styles.grid4 : styles.grid3;
  return (
    <div className={cx(styles.grid, grid)}>
      {items.map((item, index) => (
        <Card key={item.title} item={item} line={line} index={index} />
      ))}
    </div>
  );
}

function Step({ step, index }: { step: TitledText; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  useRise(ref, { delay: 0.1 * index });

  return (
    <li ref={ref} className={styles.step}>
      <div className={styles.stepHead}>
        <span className={styles.stepNum} aria-hidden="true" />
        <h3 className={styles.stepTitle}>{step.title}</h3>
      </div>
      <p className={`${styles.stepText} AppText-8`}>{step.text}</p>
    </li>
  );
}

/** Numbered steps: in a row on desktop, stacked on phones. */
export function Steps({ items, className }: { items: TitledText[]; className?: string }) {
  return (
    <ol className={cx(styles.steps, className)}>
      {items.map((step, index) => (
        <Step key={step.title} step={step} index={index} />
      ))}
    </ol>
  );
}

/** An equation in pills: the term defined, then each operator kept on a line with the term after it. */
export function Equation({ terms }: { terms: string[] }) {
  const [first, ...rest] = terms;
  const pairs: [string, string][] = [];
  for (let i = 0; i + 1 < rest.length; i += 2) pairs.push([rest[i], rest[i + 1]]);
  return (
    <p className={styles.equation}>
      <span className={styles.eqTerm}>{first}</span>
      {pairs.map(([op, term]) => (
        <span key={op + term} className={styles.eqPair}>
          <span className={styles.eqOp}>{op}</span> <span className={styles.eqTerm}>{term}</span>
        </span>
      ))}
    </p>
  );
}

/** A numbered list of points to weigh together: number, title and text in a row on desktop. */
export function NumberedList({ items }: { items: TitledText[] }) {
  const ref = useRef<HTMLOListElement>(null);
  useRise(ref, { delay: 0.1 });

  return (
    <ol ref={ref} className={styles.numbered}>
      {items.map((item) => (
        <li key={item.title} className={styles.numberedItem}>
          <span className={styles.stepNum} aria-hidden="true" />
          <h4 className={styles.numberedTitle}>{item.title}</h4>
          <p className={`${styles.numberedText} AppText-8`}>{item.text}</p>
        </li>
      ))}
    </ol>
  );
}

/** A list of entries, each with a sticker beside its title and text. */
export function IconList({ items }: { items: IconItem[] }) {
  const ref = useRef<HTMLUListElement>(null);
  useRise(ref, { delay: 0.1 });

  return (
    <ul ref={ref} className={styles.iconList}>
      {items.map((item) => (
        <li key={item.title} className={styles.iconItem}>
          <StickerIcon name={item.icon} tone={toneFill(item.tone)} className={styles.iconItemIcon} />
          <div>
            <h3 className={styles.iconItemTitle}>{item.title}</h3>
            <p className={`${styles.iconItemText} AppText-8`}>{item.text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** The site's blob as a list bullet. */
export function BlobMark({ fill = C.green, className }: { fill?: string; className?: string }) {
  return (
    <svg className={className ?? styles.bulletMark} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={BLOB_PATH} fill={fill} stroke={INK} strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

/** A list with blob bullets. */
export function Bullets({ items, fill, className }: { items: ReactNode[]; fill?: string; className?: string }) {
  return (
    <ul className={cx(styles.bullets, className)}>
      {items.map((item, index) => (
        <li key={index} className={`${styles.bullet} AppText-8`}>
          <BlobMark fill={fill} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** "Shown before you confirm": what the app sets out before a transaction, as a ticked list. */
export function Confirm({ title, items, icon = "magnifier", columns = 2 }: { title: string; items: string[]; icon?: string; columns?: 1 | 2 | 3 }) {
  const ref = useRef<HTMLDivElement>(null);
  useRise(ref, { delay: 0.1 });

  return (
    <div ref={ref} className={styles.confirm}>
      <div className={styles.confirmHead}>
        <StickerIcon name={icon} className={styles.confirmIcon} />
        <h3 className={styles.confirmTitle}>{title}</h3>
      </div>
      <ul className={cx(styles.checks, columns === 1 && styles.checks1, columns === 3 && styles.checks3)}>
        {items.map((item) => (
          <li key={item} className={`${styles.check} AppText-8`}>
            <StickerIcon name="check" className={styles.checkMark} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A note beside the content: mint for good to know, lemonade with a warning sign for a caution. */
export function Note({ title, text, warn = false, icon }: { title?: string; text: ReactNode; warn?: boolean; icon?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useRise(ref, { delay: 0.1 });

  return (
    <div ref={ref} className={cx(styles.note, warn && styles.noteWarn)} role="note">
      <StickerIcon name={icon ?? (warn ? "warning" : "shield")} tone={warn ? C.white : undefined} className={styles.noteIcon} />
      <p className="AppText-8">
        {title ? <strong className={styles.noteTitle}>{title}</strong> : null}
        {text}
      </p>
    </div>
  );
}

/** A term and what it determines, as a definition list (inside an accordion panel). */
export function Terms({ items }: { items: TitledText[] }) {
  return (
    <dl className={styles.terms}>
      {items.map((item) => (
        <div key={item.title} className={styles.term}>
          <dt className={`${styles.termName} AppText-8`}>{item.title}</dt>
          <dd className={`${styles.termText} AppText-8`}>{item.text}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A centred line with a link under a block ("Read the risks in full"). */
export function MoreLink({ text, link }: { text?: string; link: PageLink }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useRise(ref, { delay: 0.2 });

  return (
    <p ref={ref} className={`${styles.more} AppText-1`}>
      {text ? `${text} ` : null}
      <TextLink link={link} />
    </p>
  );
}

interface RiskSectionProps {
  head: PageHead;
  intro: string;
  items: IconItem[];
  link?: PageLink;
  tone?: "white" | "grey";
}

/** The risks that apply to a page's layer, as cards, with a link to the risk pages of the docs. */
export function RiskSection({ head, intro, items, link, tone = "grey" }: RiskSectionProps) {
  return (
    <Section id="risks" tone={tone} surtitle={head.surtitle} title={head.title} dotColor="flash-red" intro={intro}>
      <CardGrid items={items} columns={3} line={tone === "white"} />
      {link ? <MoreLink link={link} /> : null}
    </Section>
  );
}
