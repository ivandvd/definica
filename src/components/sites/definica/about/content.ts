import aboutJson from "@/data/sites/definica/about.json";
import type { PageLink } from "../shared/page-kit/Blocks";
import type { IconItem, PageButton, PageHead, PageSeo, TitledText } from "../shared/page-kit/content";

export interface Foundation {
  icon: string;
  name: string;
  role: string;
  text: string;
}

export interface LayerLink extends IconItem {
  link: PageLink;
}

export interface Channel {
  /** A sticker ("globe") or one of the site's social icons ("telegram", "x"). */
  icon: string;
  label: string;
  handle: string;
  href: string;
}

export interface AboutContent {
  seo: PageSeo;
  hero: PageHead & { text: string; buttons: PageButton[] };
  why: PageHead & { intro: string; questions: string[]; answer: string };
  mission: PageHead & { statement: string };
  principles: PageHead & { intro: string; items: IconItem[] };
  builtOn: PageHead & { intro: string; items: Foundation[]; link: PageLink };
  layers: PageHead & { intro: string; items: LayerLink[] };
  contact: PageHead & {
    intro: string;
    emails: { label: string; address: string }[];
    channels: { title: string; text: string; items: Channel[] };
    safety: TitledText;
  };
}

/** About page content; every string on the page comes from here. */
export const about: AboutContent = aboutJson;
