import type { ReactNode } from "react";
import { gsap } from "../../../shared/gsap";
import {
  AlertIcon,
  ArrowsIcon,
  Badge,
  CloseIcon,
  Cursor,
  EyeIcon,
  GaugeIcon,
  GearIcon,
  LockIcon,
  PercentIcon,
  ShieldIcon,
  TargetIcon,
  TopBar,
  type GlyphName,
} from "../kit";
import { allEl, byEl, hideCursor, showCursor, tap } from "../motion";
import styles from "../phone.module.css";

/*
 * The borrowing markets: the cursor taps the osETH market, its parameters cascade open, each
 * with what it sets, and the list scrolls on to the other markets.
 */

// The parameters every market defines (see the docs' Market parameters); the values are set per market.
const PARAMETERS: { name: string; sets: string; icon: ReactNode }[] = [
  { name: "Borrow asset", sets: "What you borrow and repay", icon: <ArrowsIcon /> },
  { name: "Max LTV", sets: "The most you can borrow", icon: <GaugeIcon /> },
  { name: "Liquidation threshold", sets: "Where liquidation starts", icon: <AlertIcon /> },
  { name: "Oracle", sets: "Prices collateral and debt", icon: <TargetIcon /> },
  { name: "Interest rate model", sets: "Follows utilisation", icon: <PercentIcon /> },
  { name: "Market caps", sets: "Limits supply and borrowing", icon: <LockIcon /> },
  { name: "Emergency controls", sets: "Who can pause or cap", icon: <ShieldIcon /> },
];

const MARKETS: { name: string; sub: string; glyph: GlyphName; color: string; value: string; note: string }[] = [
  { name: "aEthosETH", sub: "Liquidity Module collateral", glyph: "aethoseth", color: "#9dc4f5", value: "—", note: "Available" },
  { name: "ETH", sub: "Direct lending supply", glyph: "ethereum", color: "#9dc4f5", value: "—", note: "Available" },
];

function MarketRow({ name, sub, glyph, color, value, note, dataEl }: (typeof MARKETS)[number] & { dataEl?: string }) {
  return (
    <div className={styles.marketRow} data-el={dataEl}>
      <Badge glyph={glyph} color={color} size={34} />
      <div className={styles.marketText}>
        <div className={styles.marketName}>{name}</div>
        <div className={styles.marketSub}>{sub}</div>
      </div>
      <div className={styles.marketSide}>
        <div className={styles.marketName}>{value}</div>
        <div className={styles.marketStatus}>{note}</div>
      </div>
    </div>
  );
}

export function BorrowMarkup() {
  return (
    <>
      <div className={`${styles.layer} ${styles.borrow}`}>
        <TopBar right={<CloseIcon className={styles.closeIcon} />} />
        <div className={styles.borrowHeader}>
          <span className={styles.cardLabel}>
            Collateral
            <EyeIcon />
          </span>
          <div className={styles.bigValue}>
            <span>
              1.00 <small>osETH</small>
            </span>
          </div>
        </div>
        <div className={styles.tabsRow}>
          <span className={styles.tabOn}>Markets</span>
          <span>Parameters</span>
          <GearIcon />
        </div>
        <div className={styles.listCard} data-el="listCard">
          <div className={styles.listInner} data-el="list">
            <MarketRow
              name="osETH"
              sub="Primary collateral"
              glyph="oseth"
              color="#e2f2e5"
              value="1.00"
              note="Supplied"
              dataEl="osethRow"
            />
            <div className={styles.expand} data-el="expand">
              {PARAMETERS.map((parameter) => (
                <div key={parameter.name} className={styles.paramRow} data-el="param">
                  <span className={styles.paramIcon}>{parameter.icon}</span>
                  <div>
                    <div className={styles.paramName}>{parameter.name}</div>
                    <div className={styles.paramValue}>{parameter.sets}</div>
                  </div>
                </div>
              ))}
            </div>
            {MARKETS.map((market) => (
              <MarketRow key={market.name} {...market} />
            ))}
          </div>
        </div>
      </div>
      <Cursor />
    </>
  );
}

export function buildBorrow(canvas: HTMLElement) {
  const listCard = byEl(canvas, "listCard");
  const list = byEl(canvas, "list");
  const osethRow = byEl(canvas, "osethRow");
  const expand = byEl(canvas, "expand");
  const params = allEl(canvas, "param");
  const cursor = byEl(canvas, "cursor");

  // Measure with the parameters collapsed, so repeated builds (resize, dev double-mount) agree.
  gsap.set(expand, { height: 0 });
  const expandedHeight = params.reduce((sum, row) => sum + row.offsetHeight, 0);
  // Scroll far enough to bring the remaining markets into view, as the original list does.
  const scroll = Math.max(0, Math.min(list.offsetHeight + expandedHeight - listCard.offsetHeight + 12, expandedHeight + 40));

  const tl = gsap.timeline({ paused: true, repeat: -1 });

  showCursor(tl, cursor, osethRow, canvas, 0.25);
  tap(tl, cursor, osethRow, 0.85);
  hideCursor(tl, cursor, 1.25);

  tl.to(expand, { height: expandedHeight, duration: 1.0, ease: "power3.inOut" }, 1.0).fromTo(
    params,
    { x: -12, autoAlpha: 0 },
    { x: 0, autoAlpha: 1, duration: 0.4, ease: "power2.out", stagger: 0.11 },
    1.1,
  );

  tl.to(list, { y: -scroll, duration: 1.7, ease: "power2.inOut" }, 3.0);

  tl.to({}, { duration: 2.2 }, 4.7);
  return tl;
}
