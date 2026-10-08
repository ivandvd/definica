"use client";

import { useRef } from "react";
import { AppButton } from "../shared/AppButton";
import { SurtitleWithDot } from "../shared/SurtitleWithDot";
import { TitleWithIcon } from "../shared/TitleWithIcon";
import { roadmap } from "./content";
import { useRise } from "./motion";
import styles from "./roadmap.module.css";
import { Scenery } from "./Scenery";

const { hero } = roadmap;

/** Surtitle, the headline (the site's word reveal, no icon), the lead paragraph and the two calls to action, with floating pieces around. */
export function RoadmapHero() {
  const refBody = useRef<HTMLDivElement>(null);
  const refScene = useRef<HTMLDivElement>(null);
  useRise(refBody, { delay: 0.7, offset: 0 });
  useRise(refScene, { delay: 1, offset: 0 });

  return (
    <section className={styles.hero}>
      <div ref={refScene} className={styles.heroScene} aria-hidden="true">
        <Scenery variant="heroLeft" className={styles.heroSceneA} size={16} sizeMobile={9} depth={0.5} />
        <Scenery variant="heroRight" className={styles.heroSceneB} size={11} sizeMobile={6} depth={0.8} />
        <Scenery variant="heroBottom" className={styles.heroSceneC} size={12} depth={0.6} />
      </div>
      <div className="AppWrapper-1600">
        <div className={styles.head}>
          <SurtitleWithDot className="AppSurtitle-2" dotColor="green" surtitle={hero.surtitle} />
          <TitleWithIcon tag="h1" classname={`${styles.title} AppTitle-2 --tac`} title={hero.title} />
        </div>
        <div ref={refBody}>
          <p className={`${styles.heroText} AppText-1 --tac`}>{hero.text}</p>
          <div className={styles.heroActions}>
            {hero.buttons.map(({ theme, ...link }) => (
              <AppButton key={link.title} {...link} label={link.title} size="small" theme={theme === "dark" ? "dark" : "border-light"} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
