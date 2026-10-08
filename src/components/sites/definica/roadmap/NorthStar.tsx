"use client";

import { Fragment, useRef } from "react";
import { roadmap } from "./content";
import { useScrubWords } from "./motion";
import styles from "./roadmap.module.css";
import { Scenery } from "./Scenery";
import { SectionHead } from "./SectionHead";

const { northStar } = roadmap;

/** Every word in its own span, for the scroll-driven reveal (see `useScrubWords`). */
function Words({ text }: { text: string }) {
  return text.split(" ").map((word, index) => (
    <Fragment key={index}>
      {index > 0 ? " " : null}
      <span data-word="">{word}</span>
    </Fragment>
  ));
}

/** The north star: the title reveals word by word, then the statement darkens into ink as it scrolls up. */
export function NorthStar() {
  const refText = useRef<HTMLParagraphElement>(null);
  useScrubWords(refText);

  return (
    <section id="north-star" className={`${styles.section} ${styles.sectionWhite}`}>
      <Scenery variant="compass" className={styles.starCompass} size={12} sizeMobile={6} depth={0.5} />
      <Scenery variant="spark" className={styles.starSpark} size={5} sizeMobile={3} depth={0.9} />
      <SectionHead className="AppWrapper-1160" surtitle={northStar.surtitle} title={northStar.title} dotColor="lemonade" titleClass="AppTitle-5" />
      <div className={`${styles.starWrap} AppWrapper-1160`}>
        <p ref={refText} className={`${styles.star} AppTitle-9`}>
          <Words text={`${northStar.lead} ${northStar.text}`} />
        </p>
      </div>
    </section>
  );
}
