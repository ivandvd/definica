"use client";

import { useRef } from "react";
import { About } from "./About";
import { Closing } from "./Closing";
import { useRefreshOnResize } from "./motion";
import { NorthStar } from "./NorthStar";
import { Road } from "./Road";
import styles from "./roadmap.module.css";
import { RoadmapHero } from "./RoadmapHero";

/** The roadmap page: hero, about this roadmap, the north star, the road (phases and what they deliver), and the close. */
export function RoadmapPage() {
  const ref = useRef<HTMLDivElement>(null);
  useRefreshOnResize(ref);

  return (
    <div ref={ref} className={`${styles.page} Page`}>
      <RoadmapHero />
      <About />
      <NorthStar />
      <Road />
      <Closing />
    </div>
  );
}
