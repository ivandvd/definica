"use client";

import { useEffect, useId, useRef, useState } from "react";
import { gsap } from "../shared/gsap";
import { roadmap } from "./content";
import { useRise } from "./motion";
import styles from "./roadmap.module.css";
import { Scenery } from "./Scenery";
import { SectionHead } from "./SectionHead";

const { about } = roadmap;
const FIRST_OPEN = 0;

/**
 * "About this roadmap": what it is and isn't, how progress is measured, why StakeWise — an
 * accordion in the home FAQ's clothes, one item open at a time, the first one to begin with.
 * The panels' heights are tweened (GSAP owns the inline height after the first render).
 */
export function About() {
  const id = useId();
  const refList = useRef<HTMLDivElement>(null);
  const refPanels = useRef<(HTMLDivElement | null)[]>([]);
  const [open, setOpen] = useState(FIRST_OPEN);
  const shown = useRef(FIRST_OPEN);
  useRise(refList);

  useEffect(() => {
    if (shown.current === open) return;
    const closing = refPanels.current[shown.current];
    const opening = refPanels.current[open];
    shown.current = open;
    if (closing) gsap.to(closing, { height: 0, duration: 0.45, ease: "power2.out", overwrite: true });
    if (opening) gsap.to(opening, { height: "auto", duration: 0.5, ease: "power2.out", overwrite: true });
  }, [open]);

  return (
    <section id="about" className={`${styles.section} ${styles.sectionGrey}`}>
      <Scenery variant="aboutLeft" className={styles.aboutSceneLeft} size={12} depth={0.5} />
      <Scenery variant="aboutRight" className={styles.aboutSceneRight} size={10} depth={0.7} />
      <SectionHead className="AppWrapper-1160" surtitle={about.surtitle} title={about.title} dotColor="green" titleClass="AppTitle-5" />
      <p className={`${styles.note} AppText-8 --tac`}>{about.note}</p>
      <div ref={refList} className={`${styles.faqList} AppWrapper-1330`}>
        {about.items.map((item, index) => {
          const panelId = `${id}-panel-${index}`;
          const headId = `${id}-head-${index}`;
          const isOpen = open === index;
          return (
            <article key={item.title} className={styles.faq} data-open={isOpen ? "true" : "false"}>
              <h3 className={styles.faqHeading}>
                <button
                  type="button"
                  id={headId}
                  className={styles.faqHead}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen((current) => (current === index ? -1 : index))}
                >
                  <span className={`${styles.faqTitle} AppTitle-10`}>{item.title}</span>
                  <span className={styles.faqIcon} aria-hidden="true">
                    <span />
                    <span />
                  </span>
                </button>
              </h3>
              <div
                ref={(node) => {
                  refPanels.current[index] = node;
                }}
                id={panelId}
                role="region"
                aria-labelledby={headId}
                className={styles.faqPanel}
                style={index === FIRST_OPEN ? { height: "auto" } : undefined}
              >
                <p className={`${styles.faqBody} AppText-8`}>{item.text}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
