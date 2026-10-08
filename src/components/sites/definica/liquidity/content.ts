import liquidityJson from "@/data/sites/definica/liquidity.json";
import type { PageLink } from "../shared/page-kit/Blocks";
import type { IconItem, PageButton, PageHead, PageSeo, TitledText } from "../shared/page-kit/content";

export interface PathStation {
  icon: string;
  tone?: string;
  name: string;
  text: string;
}

export interface RuleGroup {
  title: string;
  icon: string;
  items: TitledText[];
}

export interface LiquidityContent {
  seo: PageSeo;
  hero: PageHead & { text: string; buttons: PageButton[] };
  path: PageHead & {
    intro: string;
    stations: PathStation[];
    entries: { title: string; items: IconItem[] };
    note: string;
  };
  financing: PageHead & {
    intro: string;
    points: IconItem[];
    confirm: { title: string; items: string[] };
    /** `terms` reads as an equation: term, operator, term… */
    result: { title: string; terms: string[]; text: string };
  };
  lines: PageHead & {
    intro: string;
    returns: { title: string; items: TitledText[] };
    obligations: { title: string; items: TitledText[] };
    note: string;
  };
  rules: PageHead & {
    intro: string;
    groups: RuleGroup[];
    always: { title: string; items: string[] };
  };
  leaving: PageHead & {
    intro: string;
    steps: TitledText[];
    minted: string;
    warn: TitledText;
  };
  risks: PageHead & { intro: string; items: IconItem[]; link: PageLink };
  closing: PageHead & { text: string; buttons: PageButton[] };
}

/** Main Liquidity Module page content; every string on the page comes from here. */
export const liquidity: LiquidityContent = liquidityJson;
