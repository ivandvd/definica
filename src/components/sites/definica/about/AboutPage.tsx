"use client";

import { useRef } from "react";
import { useRefreshOnResize } from "../shared/motion";
import kit from "../shared/page-kit/kit.module.css";
import { PageHero } from "../shared/page-kit/PageHero";
import { AboutHero, HeroStickers } from "./AboutArt";
import { about } from "./content";
import { BuiltOn, Contact, Layers, Mission, Principles, Why } from "./sections";

/**
 * The About page: why Definica exists, its mission, the principles it holds to, what it is built
 * on, the three layers it connects, and how to reach the team (#contact, the page's last section).
 */
export function AboutPage() {
  const ref = useRef<HTMLDivElement>(null);
  useRefreshOnResize(ref);

  return (
    <div ref={ref} className={`${kit.page} Page`}>
      <PageHero {...about.hero} dotColor="green" art={<AboutHero />} stickers={<HeroStickers />} />
      <Why />
      <Mission />
      <Principles />
      <BuiltOn />
      <Layers />
      <Contact />
    </div>
  );
}
