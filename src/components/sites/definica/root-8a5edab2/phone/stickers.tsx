import { useId, type ReactNode } from "react";
import styles from "./phone.module.css";

/*
 * Definica stickers for the phone intro, drawn in the site's sticker style: flat pastel shapes,
 * a thin ink outline and bold grotesk lettering.
 */

const INK = "#001405";
const LINE = { stroke: INK, strokeWidth: 1.6 };
const TEXT = { fill: INK, fontFamily: '"Tomato Grotesk", Arial, sans-serif', fontWeight: 700 };

function Sticker({ width, height, children }: { width: number; height: number; children: ReactNode }) {
  return (
    <svg
      className={styles.sticker}
      data-el="sticker"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ marginLeft: -width / 2, marginTop: -height / 2 }}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

const StakeTogether = () => (
  <Sticker width={108} height={88}>
    <rect x="1" y="1" width="106" height="86" rx="3" fill="#fbe74e" {...LINE} />
    <text {...TEXT} fontSize="17" letterSpacing="-0.2">
      <tspan x="10" y="27">STAKE</tspan>
      <tspan x="10" y="50">ETH</tspan>
      <tspan x="10" y="73">TOGETHER</tspan>
    </text>
  </Sticker>
);

const OnePosition = () => (
  <Sticker width={150} height={60}>
    <rect x="1" y="1" width="148" height="58" rx="29" fill="#e2f2e5" {...LINE} />
    <text {...TEXT} fontSize="13" textAnchor="middle">
      <tspan x="75" y="27">ONE POSITION,</tspan>
      <tspan x="75" y="44">EVERY LAYER</tspan>
    </text>
  </Sticker>
);

function ThreeStages() {
  const id = useId();
  return (
    <Sticker width={92} height={92}>
      <circle cx="46" cy="46" r="44.5" fill="#05c92f" {...LINE} />
      <circle cx="46" cy="46" r="17" fill="#fbe74e" {...LINE} />
      <circle cx="46" cy="46" r="5.5" fill={INK} />
      <path id={id} d="M46 46m-31 0a31 31 0 1 1 62 0a31 31 0 1 1-62 0" fill="none" />
      <text {...TEXT} fontSize="9.5" letterSpacing="1">
        <textPath href={`#${id}`} textLength="190" lengthAdjust="spacing">
          THREE STAGES · THREE STAGES ·
        </textPath>
      </text>
    </Sticker>
  );
}

const Heart = () => (
  <Sticker width={46} height={46}>
    <circle cx="23" cy="23" r="21.5" fill="#ffcadc" {...LINE} />
    <path
      d="M23 32c-9-6.5-10.5-11-9.5-14.2 1.1-3.3 5.1-4.4 7.7-1.9l1.8 1.8 1.8-1.8c2.6-2.5 6.6-1.4 7.7 1.9 1 3.2-.5 7.7-9.5 14.2Z"
      fill="none"
      stroke={INK}
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
  </Sticker>
);

const Arrow = () => (
  <Sticker width={42} height={42}>
    <circle cx="21" cy="21" r="20" fill="#2a5cd3" {...LINE} />
    <path d="M15 27 27 15M18 15h9v9" fill="none" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </Sticker>
);

const PooledStaking = () => (
  <Sticker width={136} height={40}>
    <rect x="1" y="1" width="134" height="38" rx="19" fill="#ff5a4d" {...LINE} />
    <text {...TEXT} fontSize="12.5" textAnchor="middle" x="68" y="25">
      POOLED STAKING
    </text>
  </Sticker>
);

const OsEth = () => (
  <Sticker width={86} height={46}>
    <rect x="1" y="1" width="84" height="44" rx="22" fill="#9dc4f5" {...LINE} />
    <text {...TEXT} fontSize="20" textAnchor="middle" x="43" y="30">
      osETH
    </text>
  </Sticker>
);

function MultiLayerRewards() {
  const points: string[] = [];
  for (let i = 0; i < 28; i++) {
    const angle = (Math.PI * i) / 14 - Math.PI / 2;
    const radius = i % 2 === 0 ? 47 : 40;
    points.push(`${(48 + radius * Math.cos(angle)).toFixed(2)},${(48 + radius * Math.sin(angle)).toFixed(2)}`);
  }
  return (
    <Sticker width={96} height={96}>
      <polygon points={points.join(" ")} fill="#fbe74e" {...LINE} strokeLinejoin="round" />
      <text {...TEXT} fontSize="10.5" textAnchor="middle">
        <tspan x="48" y="45">MULTI-LAYER</tspan>
        <tspan x="48" y="59">REWARDS</tspan>
      </text>
    </Sticker>
  );
}

const EthCoin = () => (
  <Sticker width={46} height={46}>
    <circle cx="23" cy="23" r="21.5" fill="#d1f500" {...LINE} />
    <path d="M23 10.5 30.4 23 23 27.4 15.6 23Z" fill={INK} />
    <path d="M15.6 24.6 23 29l7.4-4.4L23 35.5Z" fill={INK} />
  </Sticker>
);

const NonCustodial = () => (
  <Sticker width={124} height={40}>
    <path d="M15 1.5h99a8.5 8.5 0 0 1 8.5 8.5v20a8.5 8.5 0 0 1-8.5 8.5H15L1.5 20Z" fill="#ffffff" {...LINE} strokeLinejoin="round" />
    <circle cx="15.5" cy="20" r="3" fill="none" {...LINE} />
    <text {...TEXT} fontSize="11.5" textAnchor="middle" x="70" y="24.5">
      NON-CUSTODIAL
    </text>
  </Sticker>
);

const Check = () => (
  <Sticker width={38} height={38}>
    <circle cx="19" cy="19" r="17.5" fill="#e2f2e5" {...LINE} />
    <path d="M11.5 19.5 16.5 24.5 26 14" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </Sticker>
);

const VaultShares = () => (
  <Sticker width={76} height={76}>
    <rect x="1" y="1" width="74" height="74" rx="14" fill="#ffcadc" {...LINE} />
    <path d="M38 24V12.5A11.5 11.5 0 1 0 49.5 24Z" fill={INK} transform="translate(-4 0)" />
    <path d="M40 22h11A11 11 0 0 0 40 11Z" fill={INK} transform="translate(-2 -1)" />
    <text {...TEXT} fontSize="11.5" textAnchor="middle">
      <tspan x="38" y="52">VAULT</tspan>
      <tspan x="38" y="65">SHARES</tspan>
    </text>
  </Sticker>
);

/** Stickers in burst order, with the direction (degrees) and distance each one flies out to. */
export const STICKERS: { Component: () => ReactNode; angle: number; distance: number; rotation: number }[] = [
  { Component: OsEth, angle: -150, distance: 122, rotation: 10 },
  { Component: StakeTogether, angle: -118, distance: 128, rotation: -14 },
  { Component: EthCoin, angle: -88, distance: 134, rotation: -6 },
  { Component: Heart, angle: -58, distance: 108, rotation: 8 },
  { Component: Arrow, angle: -28, distance: 128, rotation: 0 },
  { Component: MultiLayerRewards, angle: 2, distance: 128, rotation: 12 },
  { Component: Check, angle: 32, distance: 108, rotation: -10 },
  { Component: OnePosition, angle: 60, distance: 140, rotation: 24 },
  { Component: PooledStaking, angle: 92, distance: 150, rotation: -8 },
  { Component: VaultShares, angle: 122, distance: 128, rotation: 14 },
  { Component: ThreeStages, angle: 152, distance: 128, rotation: -10 },
  { Component: NonCustodial, angle: 182, distance: 126, rotation: -18 },
];
