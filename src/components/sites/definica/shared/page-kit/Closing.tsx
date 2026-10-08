"use client";

import { useRef, type ReactNode } from "react";
import { useRise } from "../motion";
import { SectionHead } from "../SectionHead";
import { Buttons } from "./Buttons";
import type { PageButton } from "./content";
import styles from "./kit.module.css";

interface ClosingProps {
  surtitle: string;
  title: string;
  text: string;
  buttons: PageButton[];
  dotColor?: string;
  /** Background: white, or grey when the section before it is white. */
  tone?: "white" | "grey";
  /** Stickers around the head, placed with the kit's `.sticker` class. */
  art?: ReactNode;
}

/** A content page's close, as on the roadmap: a head, one line and the calls to action, with stickers around. */
export function Closing({ surtitle, title, text, buttons, dotColor = "baby", tone = "white", art }: ClosingProps) {
  const refText = useRef<HTMLParagraphElement>(null);
  const refActions = useRef<HTMLDivElement>(null);
  const refArt = useRef<HTMLDivElement>(null);
  useRise(refText, { delay: 0.15 });
  useRise(refActions, { delay: 0.3 });
  useRise(refArt, { delay: 0.5, offset: 0 });

  return (
    <section className={`${styles.section} ${styles[tone]}`}>
      {art ? (
        <div ref={refArt} className={styles.closingArt} aria-hidden="true">
          {art}
        </div>
      ) : null}
      <SectionHead className="AppWrapper-1160" surtitle={surtitle} title={title} dotColor={dotColor} titleClass="AppTitle-5" />
      <div className="AppWrapper-1160">
        <p ref={refText} className={`${styles.intro} AppText-1`}>
          {text}
        </p>
      </div>
      <Buttons ref={refActions} buttons={buttons} className={styles.actions} />
    </section>
  );
}
