"use client";

import { useRef, type ReactNode } from "react";
import { useParallax, useRise } from "../motion";
import { SurtitleWithDot } from "../SurtitleWithDot";
import { TitleWithIcon } from "../TitleWithIcon";
import { Buttons } from "./Buttons";
import type { PageButton } from "./content";
import head from "../SectionHead.module.css";
import styles from "./kit.module.css";

interface PageHeroProps {
  surtitle: string;
  /** A "\n" breaks the line on desktop. */
  title: string;
  text: string;
  buttons: PageButton[];
  /** Suffix of the surtitle blob's colour (see `SurtitleWithDot`). */
  dotColor?: string;
  /** The page's illustration, under the calls to action. */
  art?: ReactNode;
  /** Small stickers scattered around the title, placed with the kit's `.sticker` class. */
  stickers?: ReactNode;
}

/**
 * A content page's hero, as on the roadmap: the surtitle, the headline (the site's word reveal),
 * the lead and the calls to action, with stickers around the title and the page's illustration
 * rising in underneath and drifting a little against the scroll.
 */
export function PageHero({ surtitle, title, text, buttons, dotColor = "green", art, stickers }: PageHeroProps) {
  const refBody = useRef<HTMLDivElement>(null);
  const refStickers = useRef<HTMLDivElement>(null);
  const refArt = useRef<HTMLDivElement>(null);
  const refDrift = useRef<HTMLDivElement>(null);
  useRise(refBody, { delay: 0.7, offset: 0 });
  useRise(refStickers, { delay: 1, offset: 0 });
  useRise(refArt, { delay: 0.95, offset: 0, distanceDesktop: 5, distanceMobile: 3 });
  useParallax(refDrift, 0.35);

  return (
    <section className={styles.hero}>
      {stickers ? (
        <div ref={refStickers} className={styles.heroStickers} aria-hidden="true">
          {stickers}
        </div>
      ) : null}
      <div className="AppWrapper-1600">
        <div className={styles.heroHead}>
          <SurtitleWithDot className="AppSurtitle-2" dotColor={dotColor} surtitle={surtitle} />
          <TitleWithIcon tag="h1" classname={`${styles.heroTitle} ${head.title} AppTitle-2 --tac`} title={title} />
        </div>
        <div ref={refBody}>
          <p className={`${styles.heroText} AppText-1 --tac`}>{text}</p>
          <Buttons buttons={buttons} className={styles.actions} />
        </div>
      </div>
      {art ? (
        <div ref={refArt} className={styles.heroArt}>
          <div ref={refDrift}>{art}</div>
        </div>
      ) : null}
    </section>
  );
}
