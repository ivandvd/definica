"use client";

import { useRef, type ReactNode } from "react";
import { useRise } from "../motion";
import { SectionHead } from "../SectionHead";
import styles from "./kit.module.css";

interface SectionProps {
  id?: string;
  /** Background: white, or the site's lightest grey. */
  tone?: "white" | "grey";
  surtitle: string;
  /** A "\n" breaks the line on desktop. */
  title: string;
  /** Suffix of the surtitle blob's colour (see `SurtitleWithDot`). */
  dotColor?: string;
  /** The line under the head. */
  intro?: ReactNode;
  /** Stickers placed in the section, behind its content. */
  deco?: ReactNode;
  /** The wrapper class the body sits in. */
  wrapper?: string;
  className?: string;
  children?: ReactNode;
}

/** A content section in the roadmap's rhythm: the head (surtitle and title), an intro, then the body. */
export function Section({
  id,
  tone = "white",
  surtitle,
  title,
  dotColor = "green",
  intro,
  deco,
  wrapper = "AppWrapper-1330",
  className,
  children,
}: SectionProps) {
  const refIntro = useRef<HTMLParagraphElement>(null);
  useRise(refIntro, { delay: 0.1 });

  return (
    <section id={id} className={[styles.section, styles[tone], className].filter(Boolean).join(" ")}>
      {deco ? (
        <div className={styles.deco} aria-hidden="true">
          {deco}
        </div>
      ) : null}
      <SectionHead className="AppWrapper-1160" surtitle={surtitle} title={title} dotColor={dotColor} titleClass="AppTitle-5" />
      {intro ? (
        <div className="AppWrapper-1160">
          <p ref={refIntro} className={`${styles.intro} AppText-1`}>
            {intro}
          </p>
        </div>
      ) : null}
      {children ? <div className={`${styles.body} ${wrapper}`}>{children}</div> : null}
    </section>
  );
}
