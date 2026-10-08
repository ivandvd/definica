"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { gsap } from "../gsap";
import { prefersReducedMotion, useRise } from "../motion";
import { StickerIcon } from "./icons";
import styles from "./kit.module.css";

export interface AccordionItem {
  title: string;
  icon?: string;
  content: ReactNode;
}

/**
 * The roadmap's accordion in the home FAQ's clothes: one item open at a time, the first to begin
 * with, the panels' heights tweened (GSAP owns the inline height after the first render). A
 * closed panel is inert, so its contents stay out of the tab order and the accessibility tree.
 */
export function Accordion({ items, firstOpen = 0 }: { items: AccordionItem[]; firstOpen?: number }) {
  const id = useId();
  const refList = useRef<HTMLDivElement>(null);
  const refPanels = useRef<(HTMLDivElement | null)[]>([]);
  const [open, setOpen] = useState(firstOpen);
  const shown = useRef(firstOpen);
  useRise(refList);

  useEffect(() => {
    if (shown.current === open) return;
    const closing = refPanels.current[shown.current];
    const opening = refPanels.current[open];
    shown.current = open;
    const still = prefersReducedMotion();
    if (closing) gsap.to(closing, { height: 0, duration: still ? 0 : 0.45, ease: "power2.out", overwrite: true });
    if (opening) gsap.to(opening, { height: "auto", duration: still ? 0 : 0.5, ease: "power2.out", overwrite: true });
  }, [open]);

  return (
    <div ref={refList} className={styles.acc}>
      {items.map((item, index) => {
        const panelId = `${id}-panel-${index}`;
        const headId = `${id}-head-${index}`;
        const isOpen = open === index;
        return (
          <article key={item.title} className={styles.accItem} data-open={isOpen ? "true" : "false"}>
            <h3 className={styles.accHeading}>
              <button
                type="button"
                id={headId}
                className={styles.accHead}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen((current) => (current === index ? -1 : index))}
              >
                <span className={styles.accLead}>
                  {item.icon ? <StickerIcon name={item.icon} className={styles.accIcon} /> : null}
                  <span className={styles.accTitle}>{item.title}</span>
                </span>
                <span className={styles.accToggle} aria-hidden="true">
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
              className={styles.accPanel}
              inert={!isOpen}
              style={index === firstOpen ? { height: "auto" } : undefined}
            >
              <div className={styles.accBody}>{item.content}</div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
