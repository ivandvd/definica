import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { ReactNode } from "react";

/**
 * Share images (Open Graph / X cards), 1200 × 630, in the site's style: Tomato Grotesk, ink on
 * white, the lime mark and the hand-drawn blobs. Text is laid out with JSX (the only place the
 * custom font applies); the graphics are inline SVGs without text.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const INK = "#0f0f0f";
const GREEN_INK = "#001405";
const LIME = "#d1f500";
const SKY = "#9dc4f5";
const BABY = "#ffcadc";
const LEMON = "#fbe74e";
const GREEN = "#05c92f";

const BLOB = "M12.4 2.3c3.5-.2 7.6 1.6 8.9 5 1.2 3.1-.3 5.4.2 8.2.4 2.7-2 5.6-5.4 6.1-3 .4-4.6-1.3-7.6-1.1-3 .2-5.6-1.7-6.1-4.9-.5-3.1 1.6-4.4 1.6-7.4C4 4.9 7.9 2.5 12.4 2.3Z";
const SPARKLE = "M12 1.5C12.8 7.4 16.6 11.2 22.5 12 16.6 12.8 12.8 16.6 12 22.5 11.2 16.6 7.4 12.8 1.5 12 7.4 11.2 11.2 7.4 12 1.5Z";
const MARK_D =
  "M9.12705 0.252278C10.8655 0.252278 12.4782 0.553437 13.9651 1.15575C15.4519 1.73576 16.7444 2.56116 17.8424 3.63194C18.9632 4.68042 19.8325 5.91851 20.4501 7.34622C21.0677 8.75163 21.3765 10.2909 21.3765 11.964C21.3765 13.6148 21.0677 15.154 20.4501 16.5817C19.8325 18.0095 18.9747 19.2587 17.8767 20.3295C16.7787 21.378 15.4862 22.2034 13.9994 22.8057C12.5125 23.3857 10.9113 23.6757 9.19568 23.6757H1.78138C0.797549 23.6757 0 22.869 0 21.8739V2.05408C0 1.05897 0.797549 0.252278 1.78138 0.252278H9.12705ZM9.38556 5.45784L3.9263 11.3478C3.6051 11.6944 3.6051 12.2336 3.9263 12.5801L4.48495 13.1829L5.90247 14.7122L9.38556 18.4701C9.73745 18.8498 10.3333 18.8498 10.6851 18.4701L16.1444 12.5801C16.4656 12.2336 16.4656 11.6944 16.1444 11.3478L15.6535 10.8182L14.236 9.28886L10.6851 5.45784C10.3333 5.07819 9.73745 5.07819 9.38556 5.45784Z";
const MARK_SLASH = "M16.9295 10.3087L15.6535 10.8182L5.90247 14.7122L3.93511 15.4979L3.21179 13.6913L4.48495 13.1829L14.236 9.28886L16.2061 8.50211L16.9295 10.3087Z";
const MARK_LOWER = "M10.6851 18.4701L16.1444 12.5801C16.4656 12.2336 16.4656 11.6944 16.1444 11.3478L15.6535 10.8182L5.90247 14.7122L9.38556 18.4701C9.73745 18.8498 10.3333 18.8498 10.6851 18.4701Z";
const MARK_UPPER = "M9.38556 5.45784L3.9263 11.3478C3.6051 11.6944 3.6051 12.2336 3.9263 12.5801L4.48495 13.1829L14.236 9.28886L10.6851 5.45784C10.3333 5.07819 9.73745 5.07819 9.38556 5.45784Z";

/** The ink mark with its lime diamond, as in the header logo. */
function Mark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="-1.3 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d={MARK_D} fill={INK} />
      <path d={MARK_SLASH} fill={INK} />
      <path d={MARK_LOWER} fill={LIME} />
      <path d={MARK_UPPER} fill={LIME} />
    </svg>
  );
}

function Blob({ size, fill, x, y }: { size: number; fill: string; x: number; y: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ position: "absolute", left: x, top: y }}>
      <path d={BLOB} fill={fill} stroke={GREEN_INK} strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  );
}

function Sparkle({ size, fill, x, y }: { size: number; fill: string; x: number; y: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ position: "absolute", left: x, top: y }}>
      <path d={SPARKLE} fill={fill} stroke={GREEN_INK} strokeWidth={1.4} strokeLinejoin="round" />
    </svg>
  );
}

/** Home: the inverted mark, large, among blobs. */
function MarkGraphic() {
  return (
    <div style={{ position: "relative", display: "flex", width: 470, height: 470 }}>
      <svg width={430} height={430} viewBox="0 0 24 24" style={{ position: "absolute", left: 20, top: 30 }}>
        <path d={BLOB} fill="#f4fbcc" />
      </svg>
      <svg width={300} height={300} viewBox="-1.3 0 24 24" style={{ position: "absolute", left: 95, top: 95 }}>
        <path fillRule="evenodd" clipRule="evenodd" d={MARK_D} fill={LIME} />
        <path d={MARK_SLASH} fill={LIME} />
        <path d={MARK_LOWER} fill={INK} />
        <path d={MARK_UPPER} fill={INK} />
      </svg>
      <Blob size={70} fill={SKY} x={20} y={40} />
      <Blob size={52} fill={BABY} x={370} y={20} />
      <Sparkle size={56} fill={LEMON} x={390} y={360} />
      <Blob size={40} fill={GREEN} x={60} y={390} />
    </div>
  );
}

/** Roadmap: a road from a pin to a flag through three phase stops. */
function RoadGraphic() {
  const road = "M120 60 C120 160 330 150 330 250 S120 340 120 430";
  return (
    <div style={{ position: "relative", display: "flex", width: 470, height: 500 }}>
      <svg width={470} height={500} viewBox="0 0 470 500" style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={SKY} />
            <stop offset="0.5" stopColor={BABY} />
            <stop offset="1" stopColor={LEMON} />
          </linearGradient>
        </defs>
        <path d={road} fill="none" stroke={INK} strokeWidth={38} strokeLinecap="round" />
        <path d={road} fill="none" stroke="url(#road)" strokeWidth={32} strokeLinecap="round" />
        <path d={road} fill="none" stroke="#ffffff" strokeWidth={3.5} strokeDasharray="14 16" strokeLinecap="round" />
        <path d="M120 70S96 46 96 30a24 24 0 0 1 48 0C144 46 120 70 120 70Z" fill={LIME} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
        <circle cx={120} cy={30} r={9} fill="#ffffff" stroke={INK} strokeWidth={3} />
        <circle cx={120} cy={430} r={28} fill={LIME} stroke={INK} strokeWidth={3} />
        <circle cx={120} cy={430} r={11} fill={BABY} stroke={INK} strokeWidth={3} />
        <path d="M120 430V330" stroke={INK} strokeWidth={5} strokeLinecap="round" />
        <path d="M118 334C90 322 72 346 36 334V380C72 392 90 368 118 380Z" fill="#ffffff" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      </svg>
      <Blob size={84} fill={SKY} x={170} y={90} />
      <Blob size={84} fill={BABY} x={288} y={208} />
      <Blob size={84} fill={LEMON} x={176} y={300} />
      <Sparkle size={46} fill={LIME} x={380} y={60} />
    </div>
  );
}

/** App and docs: a card of the three layers, as in the app's "Your layers". */
function LayersGraphic({ rows }: { rows: { name: string; tone: string }[] }) {
  return (
    <div style={{ position: "relative", display: "flex", width: 470, height: 470 }}>
      <div
        style={{
          position: "absolute",
          left: 10,
          top: 70,
          display: "flex",
          flexDirection: "column",
          width: 455,
          padding: "14px 24px",
          borderRadius: 32,
          border: `3px solid ${INK}`,
          background: "#ffffff",
        }}
      >
        {rows.map((row, index) => (
          <div
            key={row.name}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              padding: "22px 0",
              borderTop: index === 0 ? "none" : "2px solid #e3e7e4",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <svg width={40} height={40} viewBox="0 0 24 24">
                <path d={BLOB} fill={row.tone} stroke={GREEN_INK} strokeWidth={1.6} strokeLinejoin="round" />
              </svg>
              <div style={{ display: "flex", fontSize: 24, color: INK }}>{row.name}</div>
            </div>
            <div
              style={{
                display: "flex",
                flexShrink: 0,
                whiteSpace: "nowrap",
                padding: "5px 14px",
                borderRadius: 999,
                background: "#d5f4e6",
                color: "#138a3b",
                fontSize: 20,
              }}
            >
              {`Phase ${index + 1}`}
            </div>
          </div>
        ))}
      </div>
      <Sparkle size={54} fill={LIME} x={400} y={30} />
      <Blob size={46} fill={SKY} x={10} y={392} />
    </div>
  );
}

export type ShareGraphic = "mark" | "road" | "app" | "docs";

const GRAPHICS: Record<ShareGraphic, () => ReactNode> = {
  mark: () => <MarkGraphic />,
  road: () => <RoadGraphic />,
  app: () => (
    <LayersGraphic
      rows={[
        { name: "Vault shares", tone: LEMON },
        { name: "Liquidity Module", tone: BABY },
        { name: "Borrowing", tone: SKY },
      ]}
    />
  ),
  docs: () => (
    <LayersGraphic
      rows={[
        { name: "Pooled ETH staking", tone: SKY },
        { name: "Liquidity Module", tone: BABY },
        { name: "Borrowing markets", tone: LEMON },
      ]}
    />
  ),
};

let fonts: Promise<{ name: string; data: Buffer; weight: 500 | 600; style: "normal" }[]> | null = null;

const loadFonts = () =>
  (fonts ??= Promise.all([
    readFile(join(process.cwd(), "src/assets/fonts/TomatoGrotesk-Medium.woff")),
    readFile(join(process.cwd(), "src/assets/fonts/TomatoGrotesk-SemiBold.woff")),
  ]).then(([medium, semiBold]) => [
    { name: "Tomato Grotesk", data: medium, weight: 500 as const, style: "normal" as const },
    { name: "Tomato Grotesk", data: semiBold, weight: 600 as const, style: "normal" as const },
  ]));

export interface ShareImageOptions {
  /** Small line above the title, with a blob ("Roadmap"). */
  eyebrow?: string;
  /** The headline; "\n" breaks the line. */
  title: string;
  /** One supporting sentence under the headline. */
  text?: string;
  graphic: ShareGraphic;
  /** Shown at the bottom left. */
  host?: string;
}

export async function shareImage({ eyebrow, title, text, graphic, host = "definica.com" }: ShareImageOptions) {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          padding: "64px 56px 56px 72px",
          background: "#ffffff",
          fontFamily: "Tomato Grotesk",
          color: INK,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Mark size={46} />
            <div style={{ display: "flex", fontSize: 44, fontWeight: 600, letterSpacing: -1 }}>Definica</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {eyebrow ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 30, marginBottom: 18 }}>
                <svg width={30} height={30} viewBox="0 0 24 24">
                  <path d={BLOB} fill={GREEN} stroke={GREEN_INK} strokeWidth={1.7} strokeLinejoin="round" />
                </svg>
                {eyebrow}
              </div>
            ) : null}
            <div style={{ display: "flex", flexDirection: "column", fontSize: 84, lineHeight: 1.02, letterSpacing: -3 }}>
              {title.split("\n").map((line) => (
                <div key={line} style={{ display: "flex" }}>
                  {line}
                </div>
              ))}
            </div>
            {text ? (
              <div style={{ display: "flex", marginTop: 24, maxWidth: 560, fontSize: 28, lineHeight: 1.3, color: "#5a585a" }}>
                {text}
              </div>
            ) : null}
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#5a585a" }}>{host}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 480 }}>{GRAPHICS[graphic]()}</div>
      </div>
    ),
    { ...OG_SIZE, fonts: await loadFonts() },
  );
}
