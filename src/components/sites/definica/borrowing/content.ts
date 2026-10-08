import borrowingJson from "@/data/sites/definica/borrowing.json";
import type { PageLink } from "../shared/page-kit/Blocks";
import type { IconItem, PageButton, PageHead, PageSeo, TitledText } from "../shared/page-kit/content";

export interface Participant {
  icon: string;
  title: string;
  brings: string;
  receives: string;
  bears: string;
}

export interface ParameterGroup {
  title: string;
  icon: string;
  items: TitledText[];
}

export interface BorrowingContent {
  seo: PageSeo;
  hero: PageHead & { text: string; buttons: PageButton[] };
  markets: PageHead & {
    intro: string;
    labels: { brings: string; receives: string; bears: string };
    participants: Participant[];
    asset: string;
  };
  collateral: PageHead & {
    intro: string;
    items: IconItem[];
    paths: { title: string; items: TitledText[]; note: string };
  };
  parameters: PageHead & {
    intro: string;
    groups: ParameterGroup[];
    reading: { title: string; items: TitledText[] };
  };
  health: PageHead & {
    intro: string;
    /** Reads as an equation: term, operator, term… */
    equation: string[];
    factors: { title: string; items: TitledText[] };
    gauge: { safe: string; edge: string; line: string };
    liquidation: TitledText;
    cushion: TitledText;
  };
  lending: PageHead & {
    intro: string;
    split: { you: string; youLabel: string; definica: string; definicaLabel: string; caption: string };
    points: IconItem[];
  };
  rules: PageHead & { intro: string; items: IconItem[] };
  risks: PageHead & { intro: string; items: IconItem[]; link: PageLink };
  closing: PageHead & { text: string; buttons: PageButton[] };
}

/** Borrowing page content; every string on the page comes from here. */
export const borrowing: BorrowingContent = borrowingJson;
