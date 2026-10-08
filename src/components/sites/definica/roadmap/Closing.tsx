"use client";

import { useRef } from "react";
import { AppButton } from "../shared/AppButton";
import { roadmap } from "./content";
import { useRise } from "../shared/motion";
import styles from "./roadmap.module.css";
import { Scenery } from "./Scenery";
import { SectionHead } from "../shared/SectionHead";

const { closing } = roadmap;

/** The page's close: where the detail lives (a book) and where to ask (a speech bubble), with the two calls to action. */
export function Closing() {
  const refText = useRef<HTMLParagraphElement>(null);
  const refActions = useRef<HTMLDivElement>(null);
  const refScene = useRef<HTMLDivElement>(null);
  useRise(refText, { delay: 0.15 });
  useRise(refActions, { delay: 0.3 });
  useRise(refScene, { delay: 0.5, offset: 0 });

  return (
    <section id="closing" className={`${styles.section} ${styles.sectionWhite}`}>
      <div ref={refScene} className={styles.closingScene} aria-hidden="true">
        <Scenery variant="closingLeft" className={styles.closingSceneLeft} size={12} sizeMobile={6.5} />
        <Scenery variant="closingRight" className={styles.closingSceneRight} size={11} sizeMobile={6} />
      </div>
      <SectionHead className="AppWrapper-1160" surtitle={closing.surtitle} title={closing.title} dotColor="baby" titleClass="AppTitle-5" />
      <p ref={refText} className={`${styles.intro} AppText-1 --tac`}>
        {closing.text}
      </p>
      <div ref={refActions} className={styles.closingActions}>
        {closing.buttons.map(({ theme, ...link }) => (
          <AppButton key={link.title} {...link} label={link.title} size="small" theme={theme === "dark" ? "dark" : "border-light"} />
        ))}
      </div>
    </section>
  );
}
