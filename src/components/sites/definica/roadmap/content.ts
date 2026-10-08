import roadmapJson from "@/data/sites/definica/roadmap.json";
import type { CardTone } from "../root-8a5edab2/VerticalCard";
import type { CmsLink } from "../shared/content";

export interface RoadmapSection {
  surtitle: string;
  /** A "\n" breaks the line on desktop (the titles go through TitleWithIcon). */
  title: string;
}

export interface RoadmapButton extends CmsLink {
  /** The `AppButton` theme the button is drawn with: "dark" or "border-light". */
  theme: string;
}

export interface AboutItem {
  title: string;
  text: string;
}

/** One of the six items of the definica.com roadmap; a waypoint on the road after its phase. */
export interface RoadItem {
  title: string;
  text: string;
  /** One of the wheel glyphs (public/sites/definica/root-8a5edab2/glyphs). */
  glyph: string;
  glyphColor: string;
}

/** A phase: a stop on the road, with the items it delivers after it. */
export interface RoadStop {
  /** "Phase 1 — Anchor" */
  label: string;
  /** The one-word theme after the label: "Staking". */
  theme: string;
  title: string;
  text: string;
  /** Heading of the bullet list: "Key points". */
  pointsTitle: string;
  bullets: string[];
  /** One of the wheel glyphs, drawn on the stop's blob. */
  glyph: string;
  /** A card colour (see `CardTone`); also the blob's colour and the road's colour at this stop. */
  tone: string;
  items: RoadItem[];
}

export interface RoadFinish {
  label: string;
  title: string;
  text: string;
}

export interface RoadmapContent {
  seo: { title: string; description: string };
  hero: RoadmapSection & { text: string; buttons: RoadmapButton[] };
  about: RoadmapSection & { note: string; items: AboutItem[] };
  northStar: RoadmapSection & { lead: string; text: string };
  road: RoadmapSection & { intro: string; start: string; stops: RoadStop[]; finish: RoadFinish };
  closing: RoadmapSection & { text: string; buttons: RoadmapButton[] };
}

/** Roadmap page content; every string on the page comes from here. */
export const roadmap: RoadmapContent = roadmapJson;

const TONES: readonly string[] = ["sky", "baby", "lemonade", "mint"] satisfies CardTone[];

/** The card colour named in the JSON, falling back to mint when it is not one of the site's tones. */
export const cardTone = (tone: string): CardTone => (TONES.includes(tone) ? (tone as CardTone) : "mint");

/** URL of one of the wheel glyphs (ink on transparent). */
export const glyphSrc = (glyph: string) => `/sites/definica/root-8a5edab2/glyphs/${glyph}.svg`;
