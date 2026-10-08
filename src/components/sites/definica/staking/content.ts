import stakingJson from "@/data/sites/definica/staking.json";
import type { PageLink } from "../shared/page-kit/Blocks";
import type { IconItem, PageButton, PageHead, PageSeo, TitledText } from "../shared/page-kit/content";
import type { StationItem } from "../shared/page-kit/Stations";

/** How a price event moves the share price: up, down, up by less than the reward, or not at all. */
export type Effect = "up" | "down" | "less" | "flat";

export interface StakingContent {
  seo: PageSeo;
  hero: PageHead & { text: string; buttons: PageButton[] };
  flow: PageHead & { intro: string; stations: StationItem[]; confirm: { title: string; items: string[] } };
  shares: PageHead & {
    intro: string;
    /** Each row reads as an equation: term, operator, term… */
    equations: string[][];
    harvest: TitledText;
    moves: { title: string; items: (TitledText & { effect: string })[] };
    note: string;
  };
  rewards: PageHead & {
    intro: string;
    sources: IconItem[];
    fees: { title: string; items: TitledText[] };
    treasury: TitledText;
  };
  locks: PageHead & {
    intro: string;
    stats: { value: string; unit: string; text: string }[];
    states: TitledText[];
    meter: { slots: string; from: string; to: string };
    warn: TitledText;
    note: string;
    link: PageLink;
  };
  exits: PageHead & {
    intro: string;
    steps: TitledText[];
    sources: IconItem[];
    /** The two routes as columns; each row starts with its label. */
    routes: { title: string; columns: string[]; rows: string[][] };
    notes: { icon: string; text: string }[];
  };
  verify: PageHead & {
    intro: string;
    checks: { title: string; read: string }[];
    noteTitle: string;
    note: string;
    link: PageLink;
  };
  risks: PageHead & { intro: string; items: IconItem[]; link: PageLink };
  closing: PageHead & { text: string; buttons: PageButton[] };
}

/** Staking page content; every string on the page comes from here. */
export const staking: StakingContent = stakingJson;

const EFFECTS: readonly string[] = ["up", "down", "less", "flat"] satisfies Effect[];

/** The effect named in the JSON, or "flat". */
export const effectOf = (effect: string): Effect => (EFFECTS.includes(effect) ? (effect as Effect) : "flat");
