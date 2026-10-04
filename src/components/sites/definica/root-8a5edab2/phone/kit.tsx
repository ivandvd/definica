import { useId, type ReactNode } from "react";
import { ASSET_BASE } from "../../shared/content";
import styles from "./phone.module.css";

/* Small UI kit shared by the phone screens: icons, the Definica mark, glyph badges and recurring blocks. */

const GLYPHS = `${ASSET_BASE}/glyphs`;

export type GlyphName =
  | "aave-v3"
  | "aethoseth"
  | "borrowing-markets"
  | "definica-core"
  | "ethereum"
  | "exit-queue"
  | "keeper"
  | "liquidity-module"
  | "oseth"
  | "share-locks"
  | "stakewise-vault"
  | "treasury"
  | "validators"
  | "vault-shares";

/** URL of one of the wheel glyphs (ink on transparent). */
export const glyphSrc = (glyph: GlyphName) => `${GLYPHS}/${glyph}.svg`;

/** StakeWise's own logo (from stakewise.io), for the places that name StakeWise itself. */
export const STAKEWISE_LOGO = `${ASSET_BASE}/images/stakewise-logo.png`;

const MARK_D =
  "M9.12705 0.252278C10.8655 0.252278 12.4782 0.553437 13.9651 1.15575C15.4519 1.73576 16.7444 2.56116 17.8424 3.63194C18.9632 4.68042 19.8325 5.91851 20.4501 7.34622C21.0677 8.75163 21.3765 10.2909 21.3765 11.964C21.3765 13.6148 21.0677 15.154 20.4501 16.5817C19.8325 18.0095 18.9747 19.2587 17.8767 20.3295C16.7787 21.378 15.4862 22.2034 13.9994 22.8057C12.5125 23.3857 10.9113 23.6757 9.19568 23.6757H1.78138C0.797549 23.6757 0 22.869 0 21.8739V2.05408C0 1.05897 0.797549 0.252278 1.78138 0.252278H9.12705ZM9.38556 5.45784L3.9263 11.3478C3.6051 11.6944 3.6051 12.2336 3.9263 12.5801L4.48495 13.1829L5.90247 14.7122L9.38556 18.4701C9.73745 18.8498 10.3333 18.8498 10.6851 18.4701L16.1444 12.5801C16.4656 12.2336 16.4656 11.6944 16.1444 11.3478L15.6535 10.8182L14.236 9.28886L10.6851 5.45784C10.3333 5.07819 9.73745 5.07819 9.38556 5.45784Z";
const MARK_SLASH =
  "M16.9295 10.3087L15.6535 10.8182L5.90247 14.7122L3.93511 15.4979L3.21179 13.6913L4.48495 13.1829L14.236 9.28886L16.2061 8.50211L16.9295 10.3087Z";
const MARK_LOWER =
  "M10.6851 18.4701L16.1444 12.5801C16.4656 12.2336 16.4656 11.6944 16.1444 11.3478L15.6535 10.8182L5.90247 14.7122L9.38556 18.4701C9.73745 18.8498 10.3333 18.8498 10.6851 18.4701Z";
const MARK_UPPER =
  "M9.38556 5.45784L3.9263 11.3478C3.6051 11.6944 3.6051 12.2336 3.9263 12.5801L4.48495 13.1829L14.236 9.28886L10.6851 5.45784C10.3333 5.07819 9.73745 5.07819 9.38556 5.45784Z";
/** The mark's upper lime triangle on its own (bounds about 3.7–14.3 x 5.2–13.2). */
export const DEFINICA_TRIANGLE = MARK_UPPER;

interface MarkProps {
  className?: string;
  /** Colour of the D and its slash. */
  color?: string;
  /** Colour of the two diamond halves; `null` leaves them open so the background shows through. */
  accent?: string | null;
}

/** The Definica "D" mark (from the definica.com wordmark). */
export function DefinicaMark({ className, color = "#002012", accent = "#d1f500" }: MarkProps) {
  return (
    <svg className={className} viewBox="-0.6 0 22.6 24" aria-hidden="true" focusable="false">
      <path fillRule="evenodd" clipRule="evenodd" d={MARK_D} fill={color} />
      <path d={MARK_SLASH} fill={color} />
      {accent ? (
        <>
          <path d={MARK_LOWER} fill={accent} />
          <path d={MARK_UPPER} fill={accent} />
        </>
      ) : null}
    </svg>
  );
}

/** A wheel glyph in a coloured circle, as in the "Three stages" wheel. */
export function Badge({ glyph, color, size }: { glyph: GlyphName; color: string; size: number }) {
  return (
    <span className={styles.badge} style={{ width: size, height: size, background: color }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- tiny decorative svg, no optimisation needed */}
      <img src={glyphSrc(glyph)} alt="" draggable={false} />
    </span>
  );
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const Svg = ({ children, className, viewBox = "0 0 24 24" }: { children: ReactNode; className?: string; viewBox?: string }) => (
  <svg className={className} viewBox={viewBox} aria-hidden="true" focusable="false">
    {children}
  </svg>
);

export const EthDiamond = ({ className, color = "currentColor" }: { className?: string; color?: string }) => (
  <Svg className={className} viewBox="0 0 16 26">
    <path d="M8 0.8 15.1 12.6 8 16.8 0.9 12.6Z" fill={color} />
    <path d="M0.9 14.2 8 18.4l7.1-4.2L8 25.2Z" fill={color} />
  </Svg>
);

export const EyeIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path {...stroke} d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle {...stroke} cx="12" cy="12" r="3" />
  </Svg>
);

export const ArrowRightIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path {...stroke} d="M4.5 12h15M13.5 6l6 6-6 6" />
  </Svg>
);

export const PlusIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path {...stroke} d="M12 4.5v15M4.5 12h15" />
  </Svg>
);

export const InfoIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <circle {...stroke} cx="12" cy="12" r="9" />
    <path {...stroke} d="M12 11v5.5M12 7.6v.1" />
  </Svg>
);

export const CloseIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path {...stroke} d="M6 6l12 12M18 6 6 18" />
  </Svg>
);

export const BackIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path {...stroke} d="M19.5 12h-15M10.5 6l-6 6 6 6" />
  </Svg>
);

export const KebabIcon = ({ className }: { className?: string }) => (
  <Svg className={className} viewBox="0 0 4 16">
    <circle cx="2" cy="2" r="1.6" fill="currentColor" />
    <circle cx="2" cy="8" r="1.6" fill="currentColor" />
    <circle cx="2" cy="14" r="1.6" fill="currentColor" />
  </Svg>
);

export const GearIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <circle {...stroke} cx="12" cy="12" r="3" />
    <path
      {...stroke}
      d="M12 2.8l1.6 2.3 2.7-.7.7 2.7 2.3 1.6-1.2 2.5 1.2 2.5-2.3 1.6-.7 2.7-2.7-.7L12 21.2l-1.6-2.3-2.7.7-.7-2.7-2.3-1.6 1.2-2.5-1.2-2.5 2.3-1.6.7-2.7 2.7.7Z"
    />
  </Svg>
);

export const ChevronIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path {...stroke} d="M9 5l7 7-7 7" />
  </Svg>
);

export const LockIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <rect {...stroke} x="5" y="10.5" width="14" height="10" rx="2.5" />
    <path {...stroke} d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
  </Svg>
);

export const GaugeIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path {...stroke} d="M3.5 16a8.5 8.5 0 0 1 17 0" />
    <path {...stroke} d="M12 16l4-5" />
  </Svg>
);

export const AlertIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path {...stroke} d="M12 3.5 21 19.5H3Z" />
    <path {...stroke} d="M12 10v4.5M12 17.2v.1" />
  </Svg>
);

export const TargetIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <circle {...stroke} cx="12" cy="12" r="8" />
    <circle {...stroke} cx="12" cy="12" r="3" />
  </Svg>
);

export const PercentIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <circle {...stroke} cx="7" cy="7" r="2.5" />
    <circle {...stroke} cx="17" cy="17" r="2.5" />
    <path {...stroke} d="M18.5 5.5l-13 13" />
  </Svg>
);

export const ArrowsIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path {...stroke} d="M7 4.5v15M3.5 8 7 4.5 10.5 8M17 19.5v-15M13.5 16l3.5 3.5 3.5-3.5" />
  </Svg>
);

export const ShieldIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path {...stroke} d="M12 3l7.5 3v6c0 4.6-3.2 7.8-7.5 9-4.3-1.2-7.5-4.4-7.5-9V6Z" />
  </Svg>
);

const HomeIcon = () => (
  <Svg>
    <path d="M4 10.4 12 4l8 6.4V19a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H5.5A1.5 1.5 0 0 1 4 19Z" fill="currentColor" />
  </Svg>
);

const ActivityIcon = () => (
  <Svg>
    <path {...stroke} d="M3.6 12.6A8.5 8.5 0 1 0 6 6.4" />
    <path {...stroke} d="M3.5 3.8v3.6h3.6M12 7.8V12l3 2" />
  </Svg>
);

const StagesIcon = () => (
  <Svg>
    <path {...stroke} d="M12 3.5 20.5 8 12 12.5 3.5 8Z" />
    <path {...stroke} d="M3.5 12 12 16.5 20.5 12M3.5 16 12 20.5 20.5 16" />
  </Svg>
);

/**
 * The Definica pointer: the mark's upper lime triangle turned into an arrow, its sharp (~33°) corner
 * as the tip. The tip sits at (3.5, 2) of the 22 x 32 box, so position the box at -3.5px, -2px.
 */
const CURSOR_PATH =
  "M19.33 17.95L5.04 2.72C4.20 1.83 2.81 1.73 1.85 2.50L0.18 3.84L8.52 29.84L19.10 21.32C20.14 20.48 20.25 18.93 19.33 17.95Z";

export function DefinicaCursor({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 22 32" width="22" height="32" aria-hidden="true" focusable="false">
      <path d={CURSOR_PATH} fill="#d1f500" stroke="#001405" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

/** The cursor that moves between targets and taps them: its tip is the element's origin. */
export const Cursor = () => (
  <div className={styles.cursor} data-el="cursor">
    <span className={styles.cursorRipple} data-el="ripple" />
    <DefinicaCursor className={styles.cursorArrow} />
  </div>
);

export function TopBar({ right }: { right?: ReactNode }) {
  return (
    <div className={styles.topBar}>
      <span className={styles.iconButton}>
        <DefinicaMark color="#002012" accent="#d1f500" />
      </span>
      {right ?? (
        <span className={styles.networkPill}>
          <EthDiamond />
          Ethereum
        </span>
      )}
    </div>
  );
}

export function BottomNav({ dataEl }: { dataEl?: string }) {
  return (
    <nav className={styles.nav} data-el={dataEl}>
      <span className={`${styles.navItem} ${styles.navItemActive}`}>
        <HomeIcon />
        Home
      </span>
      <span className={styles.navItem}>
        <ActivityIcon />
        Activity
      </span>
      <svg className={styles.navHex} viewBox="0 0 54 54" aria-hidden="true" focusable="false">
        <path
          d="M23.5 3.2a7 7 0 0 1 7 0l15.3 8.8a7 7 0 0 1 3.5 6.1v17.7a7 7 0 0 1-3.5 6.1L30.5 50.8a7 7 0 0 1-7 0L8.2 41.9a7 7 0 0 1-3.5-6.1V18.1a7 7 0 0 1 3.5-6.1Z"
          fill="#002012"
        />
        <g transform="translate(17.3 15.4) scale(0.92)">
          <path fillRule="evenodd" clipRule="evenodd" d={MARK_D} fill="#d1f500" />
          <path d={MARK_SLASH} fill="#d1f500" />
        </g>
      </svg>
      <span className={styles.navItem}>
        <StagesIcon />
        Stages
      </span>
      <span className={styles.navItem}>
        <GearIcon />
        Settings
      </span>
    </nav>
  );
}

/** Smooth, gently rising line used by the position card. Width 328 x height 82 (card width incl. bleed). */
const CHART_LINE =
  "M0 58 C14 58 20 64 30 62 S46 46 58 44 S80 42 92 42 S110 36 120 40 S140 52 152 56 S170 66 182 64 S198 50 210 48 S228 50 238 46 S252 36 264 36 S282 36 292 34 S304 18 314 16 S322 18 328 18";

export function PositionChart({ lineEl, fillEl }: { lineEl?: string; fillEl?: string }) {
  const gradientId = useId();
  return (
    <svg className={styles.chart} viewBox="0 0 328 82" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1fae4b" stopOpacity="0.22" />
          <stop offset="1" stopColor="#1fae4b" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path data-el={fillEl} d={`${CHART_LINE} L328 82 L0 82 Z`} fill={`url(#${gradientId})`} />
      <path data-el={lineEl} d={CHART_LINE} fill="none" stroke="#1fae4b" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** "Your position" card. `valueEl` marks the number for count-up animations. */
export function PositionCard({ value, valueEl, dataEl, lineEl, fillEl }: {
  value: string;
  valueEl?: string;
  dataEl?: string;
  lineEl?: string;
  fillEl?: string;
}) {
  return (
    <div className={`${styles.card} ${styles.positionCard}`} data-el={dataEl}>
      <div className={styles.rowBetween}>
        <span className={styles.cardLabel}>
          Your position
          <EyeIcon />
        </span>
        <ArrowRightIcon className={styles.arrowIcon} />
      </div>
      <div className={styles.bigValue}>
        <span>
          <span data-el={valueEl}>{value}</span> <small>ETH</small>
        </span>
        <span className={`${styles.pill} ${styles.pillGreen}`}>Vault shares</span>
      </div>
      <PositionChart lineEl={lineEl} fillEl={fillEl} />
      <div className={styles.tabs}>
        <span className={styles.tabActive}>1D</span>
        <span>1W</span>
        <span>1M</span>
        <span>6M</span>
        <span>1Y</span>
      </div>
    </div>
  );
}

const LAYERS: { name: string; glyph: GlyphName; color: string; value: string; stage: string; live: boolean }[] = [
  { name: "Vault shares", glyph: "vault-shares", color: "#fbe74e", value: "1.00 ETH", stage: "Stage 1", live: true },
  { name: "Liquidity Module", glyph: "liquidity-module", color: "#ff5a4d", value: "Planned", stage: "Stage 2", live: false },
  { name: "Borrowing", glyph: "borrowing-markets", color: "#9ca69e", value: "Planned", stage: "Stage 3", live: false },
];

/** "Your layers" header and list: one row per stage of the position. */
export function LayersList({ headEl, listEl, rowEl }: { headEl?: string; listEl?: string; rowEl?: string }) {
  return (
    <>
      <div className={styles.sectionHead} data-el={headEl}>
        Your layers
        <PlusIcon />
      </div>
      <div className={`${styles.card} ${styles.layers}`} data-el={listEl}>
        {LAYERS.map((layer) => (
          <div key={layer.name} className={styles.layerRow} data-el={rowEl}>
            <div>
              <div className={styles.layerName}>
                {layer.name}
                <Badge glyph={layer.glyph} color={layer.color} size={18} />
              </div>
              <div className={`${styles.layerValue} ${layer.live ? "" : styles.layerValueMuted}`}>{layer.value}</div>
            </div>
            <div className={styles.layerSide}>
              <span className={`${styles.pill} ${layer.live ? styles.pillGreen : styles.pillGrey}`}>{layer.stage}</span>
              <KebabIcon className={styles.kebab} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
