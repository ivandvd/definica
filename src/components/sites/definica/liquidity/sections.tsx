"use client";

import { useRef } from "react";
import { useRise } from "../shared/motion";
import { Accordion } from "../shared/page-kit/Accordion";
import { CardGrid, Confirm, Equation, IconList, Note, Steps, Terms } from "../shared/page-kit/Blocks";
import { StickerIcon } from "../shared/page-kit/icons";
import kit from "../shared/page-kit/kit.module.css";
import { Section } from "../shared/page-kit/Section";
import { Stations } from "../shared/page-kit/Stations";
import type { TitledText } from "../shared/page-kit/content";
import { liquidity } from "./content";
import { ConsentArt, PathToken, UnwindArt } from "./LiquidityArt";
import styles from "./liquidity.module.css";

/** The committed-liquidity path: four stations, with a token that changes from osETH to a receipt to a commitment. */
export function Path() {
  const { path } = liquidity;
  const refEntries = useRef<HTMLDivElement>(null);
  useRise(refEntries);

  return (
    <Section id="path" tone="grey" surtitle={path.surtitle} title={path.title} dotColor="sky" intro={path.intro}>
      <Stations items={path.stations} token={<PathToken />} />
      <div ref={refEntries} className={kit.gap}>
        <h3 className={`${kit.subhead} ${kit.subheadCentre}`}>{path.entries.title}</h3>
        <CardGrid items={path.entries.items} columns={2} />
      </div>
      <div className={kit.gap}>
        <Note text={path.note} icon="vault" />
      </div>
    </Section>
  );
}

/** Optional financing: what authorising means, what is shown first, and how a financed result adds up. */
export function Financing() {
  const { financing } = liquidity;
  const refArt = useRef<HTMLDivElement>(null);
  const refResult = useRef<HTMLDivElement>(null);
  useRise(refArt, { delay: 0.15 });
  useRise(refResult, { delay: 0.1 });

  return (
    <Section id="financing" tone="white" surtitle={financing.surtitle} title={financing.title} dotColor="baby" intro={financing.intro}>
      <div className={`${kit.split} ${kit.splitFlip}`}>
        <IconList items={financing.points} />
        <div ref={refArt} className={kit.splitArt}>
          <ConsentArt />
        </div>
      </div>
      <div className={kit.gap}>
        <Confirm title={financing.confirm.title} items={financing.confirm.items} />
      </div>
      <div ref={refResult} className={`${styles.result} ${kit.gap}`}>
        <h3 className={styles.resultTitle}>{financing.result.title}</h3>
        <div className={kit.equations}>
          <Equation terms={financing.result.terms} />
        </div>
        <p className={`${styles.resultText} AppText-8`}>{financing.result.text}</p>
      </div>
    </Section>
  );
}

function LedgerRow({ row, index }: { row: TitledText; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  useRise(ref, { delay: 0.08 * index, distanceDesktop: 1.2, distanceMobile: 1 });

  return (
    <li ref={ref} className={styles.ledgerRow}>
      <span className={`${styles.ledgerName} AppText-8`}>{row.title}</span>
      <span className={`${styles.ledgerText} AppText-8`}>{row.text}</span>
    </li>
  );
}

/** Separate lines: what can earn and what can be owed, as one statement split down the middle. */
export function Lines() {
  const { lines } = liquidity;
  const refLedger = useRef<HTMLDivElement>(null);
  useRise(refLedger);

  return (
    <Section id="lines" tone="grey" surtitle={lines.surtitle} title={lines.title} dotColor="green" intro={lines.intro}>
      <div ref={refLedger} className={styles.ledger}>
        <div className={styles.ledgerCol}>
          <h3 className={styles.ledgerHead}>
            <StickerIcon name="plus" className={styles.ledgerIcon} />
            {lines.returns.title}
          </h3>
          <ul className={styles.ledgerRows}>
            {lines.returns.items.map((row, index) => (
              <LedgerRow key={row.title} row={row} index={index} />
            ))}
          </ul>
        </div>
        <div className={`${styles.ledgerCol} ${styles.ledgerOwed}`}>
          <h3 className={styles.ledgerHead}>
            <StickerIcon name="minus" className={styles.ledgerIcon} />
            {lines.obligations.title}
          </h3>
          <ul className={styles.ledgerRows}>
            {lines.obligations.items.map((row, index) => (
              <LedgerRow key={row.title} row={row} index={index} />
            ))}
          </ul>
        </div>
      </div>
      <div className={kit.gap}>
        <Note text={lines.note} icon="receipt" />
      </div>
    </Section>
  );
}

/** Module rules: what each rule decides, by group, and the three statements that always hold. */
export function Rules() {
  const { rules } = liquidity;
  return (
    <Section id="rules" tone="white" surtitle={rules.surtitle} title={rules.title} dotColor="lemonade" intro={rules.intro} wrapper="AppWrapper-1330">
      <Accordion items={rules.groups.map((group) => ({ title: group.title, icon: group.icon, content: <Terms items={group.items} /> }))} />
      <div className={kit.gap}>
        <Confirm title={rules.always.title} items={rules.always.items} icon="shield" columns={3} />
      </div>
    </Section>
  );
}

/** Leaving a position: the way out drawn right to left, the four steps, and the two cautions. */
export function Leaving() {
  const { leaving } = liquidity;
  const refArt = useRef<HTMLDivElement>(null);
  useRise(refArt);

  return (
    <Section id="leaving" tone="grey" surtitle={leaving.surtitle} title={leaving.title} dotColor="sky" intro={leaving.intro}>
      <div ref={refArt} className={styles.unwind}>
        <UnwindArt />
      </div>
      <Steps items={leaving.steps} />
      <div className={`${styles.notes} ${kit.gap}`}>
        <Note text={leaving.minted} icon="coin" />
        <Note title={leaving.warn.title} text={leaving.warn.text} warn />
      </div>
    </Section>
  );
}
