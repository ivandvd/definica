"use client";

import { Fragment, useRef } from "react";
import { useRise, useScrollProgress } from "../shared/motion";
import { Accordion } from "../shared/page-kit/Accordion";
import { C } from "../shared/page-kit/art";
import { Bullets, CardGrid, Equation, IconList, Note, NumberedList, Terms } from "../shared/page-kit/Blocks";
import { StickerIcon } from "../shared/page-kit/icons";
import kit from "../shared/page-kit/kit.module.css";
import { Section } from "../shared/page-kit/Section";
import { DonutArt, GaugeArt, MarketFlowArt, PathsArt } from "./BorrowingArt";
import styles from "./borrowing.module.css";
import { borrowing, type Participant } from "./content";

function ParticipantCard({ participant, index }: { participant: Participant; index: number }) {
  const { labels } = borrowing.markets;
  const ref = useRef<HTMLElement>(null);
  useRise(ref, { delay: 0.1 * index });

  const facts = [
    { label: labels.brings, text: participant.brings },
    { label: labels.receives, text: participant.receives },
    { label: labels.bears, text: participant.bears },
  ];
  return (
    <article ref={ref} className={styles.participant}>
      <div className={styles.participantHead}>
        <StickerIcon name={participant.icon} className={styles.participantIcon} />
        <h3 className={styles.participantTitle}>{participant.title}</h3>
      </div>
      <dl className={styles.facts}>
        {facts.map((fact) => (
          <div key={fact.label} className={styles.fact}>
            <dt className={`${styles.factLabel} ${kit.label}`}>{fact.label}</dt>
            <dd className={`${styles.factText} AppText-8`}>{fact.text}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

/** The markets: liquidity in, loans out, interest back and split; who brings what; what is lent. */
export function Markets() {
  const { markets, lending } = borrowing;
  const refArt = useRef<HTMLDivElement>(null);
  useRise(refArt);

  return (
    <Section id="markets" tone="grey" surtitle={markets.surtitle} title={markets.title} dotColor="lemonade" intro={markets.intro}>
      <div ref={refArt} className={styles.flowArt}>
        <MarketFlowArt you={lending.split.you} definica={lending.split.definica} />
      </div>
      <div className={styles.participants}>
        {markets.participants.map((participant, index) => (
          <ParticipantCard key={participant.title} participant={participant} index={index} />
        ))}
      </div>
      <div className={kit.gap}>
        <Note text={markets.asset} icon="coin" />
      </div>
    </Section>
  );
}

/** Collateral: what counts, by market, and the two paths for one aEthosETH receipt. */
export function Collateral() {
  const { collateral } = borrowing;
  const refArt = useRef<HTMLDivElement>(null);
  const refPaths = useRef<HTMLDivElement>(null);
  useRise(refArt, { delay: 0.15 });
  useRise(refPaths);

  return (
    <Section id="collateral" tone="white" surtitle={collateral.surtitle} title={collateral.title} dotColor="sky" intro={collateral.intro}>
      <CardGrid items={collateral.items} columns={3} line />
      <div className={`${kit.split} ${kit.gap}`}>
        <div ref={refArt} className={kit.splitArt}>
          <PathsArt />
        </div>
        <div ref={refPaths} className={styles.paths}>
          <h3 className={kit.subhead}>{collateral.paths.title}</h3>
          <Bullets
            fill={C.lime}
            items={collateral.paths.items.map((path) => (
              <Fragment key={path.title}>
                <strong>{path.title}.</strong> <span className={kit.muted}>{path.text}</span>
              </Fragment>
            ))}
          />
          <Note text={collateral.paths.note} icon="ticket" />
        </div>
      </div>
    </Section>
  );
}

/** Market parameters: what each one sets, by group, and how to read them together. */
export function Parameters() {
  const { parameters } = borrowing;
  return (
    <Section id="parameters" tone="grey" surtitle={parameters.surtitle} title={parameters.title} dotColor="baby" intro={parameters.intro}>
      <Accordion
        items={parameters.groups.map((group) => ({ title: group.title, icon: group.icon, content: <Terms items={group.items} /> }))}
      />
      <div className={kit.gap}>
        <h3 className={`${kit.subhead} ${kit.subheadCentre}`}>{parameters.reading.title}</h3>
        <NumberedList items={parameters.reading.items} />
      </div>
    </Section>
  );
}

/** The health factor: the definition, the gauge whose needle follows the scroll past each factor, and liquidation. */
export function Health() {
  const { health } = borrowing;
  const refArt = useRef<HTMLDivElement>(null);
  const refFactors = useRef<HTMLOListElement>(null);
  const refEquation = useRef<HTMLDivElement>(null);
  useRise(refEquation);
  useScrollProgress(
    refArt,
    (value) => {
      refArt.current?.style.setProperty("--p", value.toFixed(4));
      const items = refFactors.current?.children;
      if (!items) return;
      Array.from(items).forEach((item, index) => item.toggleAttribute("data-active", value >= (index + 0.5) / items.length - 0.02));
    },
    { start: "top 75%", end: "bottom 40%" },
  );

  return (
    <Section id="health" tone="white" surtitle={health.surtitle} title={health.title} dotColor="flash-red" intro={health.intro}>
      <div ref={refEquation} className={`${kit.equations} ${styles.equationCentre}`}>
        <Equation terms={health.equation} />
      </div>
      <div className={kit.split}>
        <div ref={refArt} className={`${kit.splitArt} ${styles.gauge}`}>
          <GaugeArt safe={health.gauge.safe} edge={health.gauge.edge} line={health.gauge.line} />
        </div>
        <div>
          <h3 className={kit.subhead}>{health.factors.title}</h3>
          <ol ref={refFactors} className={styles.factors}>
            {health.factors.items.map((factor) => (
              <li key={factor.title} className={styles.factor}>
                <h4 className={styles.factorTitle}>{factor.title}</h4>
                <p className={`${styles.factorText} AppText-8`}>{factor.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className={`${styles.notes} ${kit.gap}`}>
        <Note title={health.liquidation.title} text={health.liquidation.text} warn />
        <Note title={health.cushion.title} text={health.cushion.text} icon="shield" />
      </div>
    </Section>
  );
}

/** Lending: the 75 / 25 ring drawing itself as the page scrolls, its legend, and what the split does and doesn't apply to. */
export function Lending() {
  const { lending } = borrowing;
  const refRing = useRef<HTMLDivElement>(null);
  const refSvg = useRef<SVGSVGElement>(null);
  useRise(refRing);
  useScrollProgress(
    refRing,
    (value) => {
      const svg = refSvg.current;
      if (!svg) return;
      svg.querySelector('[data-arc="you"]')?.setAttribute("stroke-dasharray", `${(75 * value).toFixed(2)} 100`);
      svg.querySelector('[data-arc="definica"]')?.setAttribute("stroke-dasharray", `${(25 * value).toFixed(2)} 100`);
    },
    { start: "top 85%", end: "center 50%" },
  );

  return (
    <Section id="lending" tone="grey" surtitle={lending.surtitle} title={lending.title} dotColor="green" intro={lending.intro}>
      <div className={kit.split}>
        <div ref={refRing}>
          <div className={styles.ring}>
            <DonutArt ref={refSvg} you={lending.split.you} definica={lending.split.definica} />
          </div>
          <div className={styles.legend}>
            <p className={styles.legendRow}>
              <span className={styles.swatch} style={{ backgroundColor: C.lime }} aria-hidden="true" />
              <span className={styles.legendValue}>{lending.split.you}</span>
              <span className={`${styles.legendLabel} AppText-8`}>{lending.split.youLabel}</span>
            </p>
            <p className={styles.legendRow}>
              <span className={styles.swatch} style={{ backgroundColor: C.sky }} aria-hidden="true" />
              <span className={styles.legendValue}>{lending.split.definica}</span>
              <span className={`${styles.legendLabel} AppText-8`}>{lending.split.definicaLabel}</span>
            </p>
            <p className={`${styles.legendCaption} AppText-8`}>{lending.split.caption}</p>
          </div>
        </div>
        <IconList items={lending.points} />
      </div>
    </Section>
  );
}

/** The four rules that hold in every market. */
export function Rules() {
  const { rules } = borrowing;
  return (
    <Section id="every-market" tone="white" surtitle={rules.surtitle} title={rules.title} dotColor="lemonade" intro={rules.intro}>
      <CardGrid items={rules.items} columns={2} line />
    </Section>
  );
}
