import type { CmsLink } from "../content";

/** A call to action: a site link drawn as an `AppButton`, in the "dark" or "border-light" theme. */
export interface PageButton extends CmsLink {
  title: string;
  theme: string;
}

/** A surtitle and a title; a "\n" in the title breaks the line on desktop. */
export interface PageHead {
  surtitle: string;
  title: string;
}

export interface TitledText {
  title: string;
  text: string;
}

/** A card or a list entry with one of the kit's stickers. */
export interface IconItem extends TitledText {
  /** One of the kit's stickers (see icons.tsx). */
  icon: string;
  /** A fill for the sticker other than its own. */
  tone?: string;
}

/** A page's search and share details. */
export interface PageSeo {
  title: string;
  description: string;
}

/** The colours a JSON file may name for a sticker, a card or a blob. */
const TONES: Record<string, string> = {
  lime: "#d1f500",
  green: "#05c92f",
  sky: "#9dc4f5",
  baby: "#ffcadc",
  lemonade: "#fbe74e",
  mint: "#d6eedb",
  lightGreen: "#e2f2e5",
  coral: "#ff5a4d",
  white: "#ffffff",
};

/** The colour named in the JSON, or undefined (the sticker keeps its own). */
export const toneFill = (tone?: string) => (tone ? TONES[tone] : undefined);
