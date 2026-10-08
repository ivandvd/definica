"use client";

import { useRef, type CSSProperties } from "react";
import { useRise, useScrollProgress } from "../shared/motion";
import { C } from "../shared/page-kit/art";
import { BlobMark, CardGrid, Confirm, Equation, MoreLink, Note, Steps } from "../shared/page-kit/Blocks";
import { StickerIcon } from "../shared/page-kit/icons";
import kit from "../shared/page-kit/kit.module.css";
import { Section } from "../shared/page-kit/Section";
import { Stations } from "../shared/page-kit/Stations";
import { effectOf, staking } from "./content";
import { FlowCoin, HarvestSplitArt, LockArt, QueueArt, SharePriceArt, VerifyArt } from "./StakingArt";
import styles from "./staking.module.css";

/** Writes a scroll progress (0 → 1) into an element's `--p`, for the drawings that follow the scroll. */
const writeProgress = (el: HTMLElement | null, value: number) => el?.style.setProperty("--p", value.toFixed(4));

/** How a deposit flows: four stations on a pipe, with a coin travelling along it as the page scrolls. */
export function Flow() {
  const { flow } = staking;
  return (
    <Section id="flow" tone="grey" surtitle={flow.surtitle} title={flow.title} dotColor="sky" intro={flow.intro}>
      <Stations items={flow.stations} token={<FlowCoin />} />
      <div className={kit.gap}>
        <Confirm title={flow.confirm.title} items={flow.confirm.items} />
      </div>
    </Section>
  );
}

/** Vault shares: the two equations, the harvest that re-prices them, and what moves the price. */
export function Shares() {
  const { shares } = staking;
  const refText = useRef<HTMLDivElement>(null);
  const refArt = useRef<HTMLDivElement>(null);
  const refMoves = useRef<HTMLDivElement>(null);
  useRise(refText);
  useRise(refArt, { delay: 0.15 });
  useRise(refMoves, { delay: 0.1 });

  return (
    <Section id="shares" tone="white" surtitle={shares.surtitle} title={shares.title} dotColor="lemonade" intro={shares.intro}>
      <div className={kit.split}>
        <div ref={refText}>
          <div className={kit.equations}>
            {shares.equations.map((terms) => (
              <Equation key={terms.join(" ")} terms={terms} />
            ))}
          </div>
          <div className={styles.harvestHead}>
            <StickerIcon name="clock" className={styles.harvestIcon} />
            <h3 className={styles.harvestTitle}>{shares.harvest.title}</h3>
          </div>
          <p className={`${styles.harvestText} AppText-8`}>{shares.harvest.text}</p>
        </div>
        <div ref={refArt} className={kit.splitArt}>
          <SharePriceArt />
        </div>
      </div>
      <div ref={refMoves} className={kit.gap}>
        <h3 className={`${kit.subhead} ${kit.subheadCentre}`}>{shares.moves.title}</h3>
        <ul className={styles.moves}>
          {shares.moves.items.map((move) => (
            <li key={move.title} className={styles.move}>
              <StickerIcon name={effectOf(move.effect)} className={styles.moveIcon} />
              <div>
                <h4 className={styles.moveTitle}>{move.title}</h4>
                <p className={`${styles.moveText} AppText-8`}>{move.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className={kit.gap}>
        <Note text={shares.note} icon="coins" />
      </div>
    </Section>
  );
}

/** Where rewards come from, the fees and how they are taken, and the treasury's separate line. */
export function Rewards() {
  const { rewards } = staking;
  const refFees = useRef<HTMLDivElement>(null);
  const refArt = useRef<HTMLDivElement>(null);
  useRise(refFees);
  useRise(refArt, { delay: 0.15 });

  return (
    <Section id="rewards" tone="grey" surtitle={rewards.surtitle} title={rewards.title} dotColor="green" intro={rewards.intro}>
      <CardGrid items={rewards.sources} columns={3} />
      <div className={`${kit.split} ${kit.splitFlip} ${kit.gap}`}>
        <div ref={refFees}>
          <h3 className={kit.subhead}>{rewards.fees.title}</h3>
          <ul className={styles.fees}>
            {rewards.fees.items.map((fee) => (
              <li key={fee.title} className={`${styles.fee} AppText-8`}>
                <BlobMark className={styles.feeMark} fill={C.lemonade} />
                <p>
                  <span className={styles.feeName}>{fee.title}.</span> <span className={styles.feeText}>{fee.text}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div ref={refArt} className={kit.splitArt}>
          <HarvestSplitArt />
        </div>
      </div>
      <div className={kit.gap}>
        <Note title={rewards.treasury.title} text={rewards.treasury.text} icon="gift" />
      </div>
    </Section>
  );
}

/** Share locks: the two numbers, the three states, the lock with its meter, and the cautions. */
export function Locks() {
  const { locks } = staking;
  const refText = useRef<HTMLDivElement>(null);
  const refArt = useRef<HTMLDivElement>(null);
  const refMeter = useRef<HTMLDivElement>(null);
  useRise(refText);
  useRise(refArt, { delay: 0.15 });
  useScrollProgress(refMeter, (value) => writeProgress(refMeter.current, value), { start: "top 85%", end: "bottom 45%" });

  return (
    <Section id="locks" tone="white" surtitle={locks.surtitle} title={locks.title} dotColor="baby" intro={locks.intro}>
      <div className={kit.split}>
        <div ref={refText}>
          <div className={styles.stats}>
            {locks.stats.map((stat) => (
              <p key={stat.unit} className={styles.stat}>
                <span className={styles.statValue}>
                  {stat.value}
                  <span className={styles.statUnit}>{stat.unit}</span>
                </span>
                <span className={`${styles.statText} AppText-8`}>{stat.text}</span>
              </p>
            ))}
          </div>
          <ol className={styles.states}>
            {locks.states.map((state) => (
              <li key={state.title} className={styles.state}>
                <span className={styles.stateName}>{state.title}</span>
                <p className={`${styles.stateText} AppText-8`}>{state.text}</p>
              </li>
            ))}
          </ol>
        </div>
        <div ref={refArt} className={kit.splitArt}>
          <LockArt />
          <div ref={refMeter} className={styles.meter} aria-hidden="true">
            <span className={kit.label}>{locks.meter.slots}</span>
            <div className={styles.slots}>
              {Array.from({ length: 10 }, (_, i) => (
                <span key={i} className={styles.slot} style={{ "--i": i } as CSSProperties}>
                  <StickerIcon name="lock" tone={C.white} className={styles.slotBase} />
                  <StickerIcon name="lock" className={styles.slotFill} />
                </span>
              ))}
            </div>
            <div className={styles.range}>
              <span className={styles.rangeFill} />
              <span className={styles.rangeKnob} />
            </div>
            <div className={`${styles.rangeLabels} AppText-8`}>
              <span>{locks.meter.from}</span>
              <span>{locks.meter.to}</span>
            </div>
          </div>
        </div>
      </div>
      <div className={`${styles.notes} ${kit.gap}`}>
        <Note title={locks.warn.title} text={locks.warn.text} warn />
        <Note text={locks.note} icon="lock" />
      </div>
      <MoreLink link={locks.link} />
    </Section>
  );
}

/** Unstaking: five steps, where the ETH comes from, the two routes and the practical points. */
export function Exits() {
  const { exits } = staking;
  const refArt = useRef<HTMLDivElement>(null);
  const refRoutes = useRef<HTMLDivElement>(null);
  const refNotes = useRef<HTMLDivElement>(null);
  useRise(refArt, { delay: 0.1 });
  useRise(refRoutes);
  useRise(refNotes, { delay: 0.1 });
  useScrollProgress(refArt, (value) => writeProgress(refArt.current, value), { start: "top 90%", end: "bottom 40%" });

  return (
    <Section id="unstaking" tone="grey" surtitle={exits.surtitle} title={exits.title} dotColor="sky" intro={exits.intro}>
      <Steps items={exits.steps} />
      <div className={kit.gap}>
        <div ref={refArt} className={styles.queueArt}>
          <QueueArt />
        </div>
        <CardGrid items={exits.sources} columns={2} />
      </div>
      <div ref={refRoutes} className={kit.gap}>
        <h3 className={`${kit.subhead} ${kit.subheadCentre}`}>{exits.routes.title}</h3>
        <table className={styles.routes}>
          <thead>
            <tr>
              <td />
              {exits.routes.columns.map((head) => (
                <th key={head} scope="col">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {exits.routes.rows.map(([label, ...cells]) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                {cells.map((cell, index) => (
                  <td key={index}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div ref={refNotes} className={`${styles.notes} ${styles.notes3} ${kit.gap}`}>
        {exits.notes.map((note) => (
          <Note key={note.text} text={note.text} icon={note.icon} />
        ))}
      </div>
    </Section>
  );
}

/** Verify: the onchain reads behind what the app shows, and where the addresses come from. */
export function Verify() {
  const { verify } = staking;
  const refList = useRef<HTMLUListElement>(null);
  const refArt = useRef<HTMLDivElement>(null);
  useRise(refList);
  useRise(refArt, { delay: 0.15 });

  return (
    <Section id="verify" tone="white" surtitle={verify.surtitle} title={verify.title} dotColor="green" intro={verify.intro}>
      <div className={`${kit.split} ${kit.splitFlip}`}>
        <ul ref={refList} className={styles.reads}>
          {verify.checks.map((check) => (
            <li key={check.title} className={`${styles.read} AppText-8`}>
              <StickerIcon name="check" className={styles.readMark} />
              <p>
                <span className={styles.readTitle}>{check.title}</span>
                <code className={styles.readCode}>{check.read}</code>
              </p>
            </li>
          ))}
        </ul>
        <div ref={refArt} className={kit.splitArt}>
          <VerifyArt />
        </div>
      </div>
      <div className={kit.gap}>
        <Note title={verify.noteTitle} text={verify.note} warn />
      </div>
      <MoreLink link={verify.link} />
    </Section>
  );
}
