import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { MARK_D, MARK_SLASH } from "./brand";

/*
 * The action panels' scenes, in the landing page's sticker style (flat pastels, a thin ink line,
 * sparkles): the staking factory, the exit gate and the lock safe. Each runs on one `--speed`,
 * faster while an amount is entered (`active`), and plays its own ending when the action goes
 * through (`done`). Decorative.
 */

export const INK = "#001405";
export const LINE = { stroke: INK, strokeWidth: 1.6, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
const FONT = '"Tomato Grotesk", Arial, sans-serif';

const delay = (seconds: number): CSSProperties => ({ animationDelay: `calc(${seconds}s * var(--speed))` });

/** An ETH coin with its diamond, at the origin. */
export function Coin({ fill = "#9dc4f5" }: { fill?: string }) {
  return (
    <g>
      <circle r="10.5" fill={fill} {...LINE} />
      <path d="M0-6.6 4.2 0.3 0 2.8-4.2 0.3Z" fill={INK} />
      <path d="M-4.2 1.5 0 4 4.2 1.5 0 7Z" fill={INK} />
    </g>
  );
}

/** A Vault share: the ink disc with the lime D, at the origin. */
export function Share() {
  return (
    <g>
      <circle r="10.5" fill={INK} {...LINE} />
      <g transform="translate(-6 -6.4) scale(0.53)">
        <path fillRule="evenodd" clipRule="evenodd" d={MARK_D} fill="#d1f500" />
        <path d={MARK_SLASH} fill="#d1f500" />
      </g>
    </g>
  );
}

export function Sparkle({ x, y, size = 1, fill = "#d1f500", delay: wait = 0 }: { x: number; y: number; size?: number; fill?: string; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`}>
      <path
        d="M0-9C1.4-1.4 1.4-1.4 9 0 1.4 1.4 1.4 1.4 0 9-1.4 1.4-1.4 1.4-9 0-1.4-1.4-1.4-1.4 0-9Z"
        fill={fill}
        {...LINE}
        strokeWidth={1.4 / size}
        style={{ transformBox: "fill-box", transformOrigin: "center", animation: `art-twinkle 2.6s ease-in-out ${wait}s infinite` }}
      />
    </g>
  );
}

/** A sticker label: a pill with bold lettering. */
function Label({ x, y, width, text, fill, rotate = 0 }: { x: number; y: number; width: number; text: string; fill: string; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <rect width={width} height="20" rx="10" fill={fill} {...LINE} />
      <text x={width / 2} y="14" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="10.5" fill={INK}>
        {text}
      </text>
    </g>
  );
}

/** A belt with rollers and a moving lime dash, from x to x + width at y. */
function Belt({ x, y, width }: { x: number; y: number; width: number }) {
  const rollers = Math.max(2, Math.round(width / 24));
  return (
    <g>
      <rect x={x} y={y - 6} width={width} height="12" rx="6" fill={INK} {...LINE} />
      <path className="scene-belt" d={`M${x + 6} ${y}h${width - 12}`} stroke="#d1f500" strokeWidth={2} strokeLinecap="round" />
      {Array.from({ length: rollers }, (_, i) => (
        <circle key={i} cx={x + 10 + (i * (width - 20)) / (rollers - 1)} cy={y} r="3" fill="#c9d0cb" />
      ))}
    </g>
  );
}

function Frame({ children, active, done, className, label }: { children: ReactNode; active: boolean; done: boolean; className?: string; label?: string }) {
  return (
    <svg
      className={cn("scene block h-auto w-full max-w-[340px] overflow-visible", className)}
      data-active={active || done ? "true" : "false"}
      viewBox="0 0 320 184"
      aria-hidden="true"
      focusable="false"
      data-label={label}
    >
      <ellipse cx="160" cy="166" rx="148" ry="7" fill={INK} opacity="0.07" />
      <path d="M12 162h296" {...LINE} />
      {children}
    </svg>
  );
}

/** A gear: teeth around a hub, at the origin. */
function Gear({ r, teeth, fill }: { r: number; teeth: number; fill: string }) {
  const points: string[] = [];
  for (let i = 0; i < teeth * 2; i++) {
    const angle = (Math.PI * i) / teeth;
    const radius = i % 2 === 0 ? r : r * 0.78;
    const half = Math.PI / teeth / 2.4;
    points.push(`${(radius * Math.cos(angle - half)).toFixed(2)},${(radius * Math.sin(angle - half)).toFixed(2)}`);
    points.push(`${(radius * Math.cos(angle + half)).toFixed(2)},${(radius * Math.sin(angle + half)).toFixed(2)}`);
  }
  return (
    <g>
      <polygon points={points.join(" ")} fill={fill} {...LINE} />
      <circle r={r * 0.32} fill="#ffffff" {...LINE} />
    </g>
  );
}

/* ---------- stake: the factory ---------- */

/** ETH drops into the hopper, the gears turn, the chimney puffs, Vault shares ride the belt out. */
export function StakeFactory({ active = false, done = false, className }: { active?: boolean; done?: boolean; className?: string }) {
  return (
    <Frame active={active} done={done} className={className}>
      {[0, 1, 2].map((i) => (
        <g key={i} transform="translate(104 40)">
          <g className="scene-drop" style={delay(i)}>
            <Coin fill={["#9dc4f5", "#fbe74e", "#ffcadc"][i]} />
          </g>
        </g>
      ))}
      <path d="M70 26h68l-20 34h-28Z" fill="#fbe74e" {...LINE} />
      <path d="M90 60h28v10H90Z" fill="#ffffff" {...LINE} />
      <path d="M78 34h52" stroke={INK} strokeWidth={1.2} opacity={0.35} />

      <rect x="190" y="30" width="16" height="30" rx="3" fill="#c9d0cb" {...LINE} />
      <rect x="187" y="26" width="22" height="8" rx="3" fill="#ffffff" {...LINE} />
      {[0, 0.8, 1.6].map((d) => (
        <circle key={d} className="scene-puff" cx="198" cy="16" r="6" fill="#ffffff" {...LINE} style={delay(d)} />
      ))}

      <path d="M80 70V52l46 18V52l46 18V52l48 18Z" fill="#ffcadc" {...LINE} />
      <rect x="80" y="70" width="140" height="92" rx="5" fill="#ffffff" {...LINE} />

      <circle cx="116" cy="108" r="19" fill="#9dc4f5" {...LINE} />
      <g transform="translate(116 108)">
        <g className="scene-spin">
          <Gear r={12} teeth={8} fill="#fbe74e" />
        </g>
      </g>
      <circle cx="176" cy="108" r="19" fill="#e2f2e5" {...LINE} />
      <g transform="translate(176 108)">
        <g className="scene-spin scene-reverse">
          <Gear r={12} teeth={8} fill="#d1f500" />
        </g>
      </g>

      <rect x="132" y="76" width="36" height="16" rx="8" fill={INK} {...LINE} />
      <g transform="translate(144.4 78.4) scale(0.47)">
        <path fillRule="evenodd" clipRule="evenodd" d={MARK_D} fill="#d1f500" />
        <path d={MARK_SLASH} fill="#d1f500" />
      </g>
      <path d="M140 162v-24a10 10 0 0 1 20 0v24" fill="#fbe74e" {...LINE} />

      <rect x="214" y="124" width="12" height="20" rx="3" fill={INK} />
      <Belt x={216} y={150} width={94} />
      {[0, 1, 2].map((i) => (
        <g key={i} transform="translate(224 132)">
          <g className="scene-ride" style={delay(i + 0.6)}>
            <Share />
          </g>
        </g>
      ))}
      {done
        ? [0, 1, 2].map((i) => (
            <g key={i} transform={`translate(296 ${134 - i * 9})`}>
              <g className="animate-pop" style={{ animationDelay: `${300 + i * 140}ms`, transformBox: "fill-box", transformOrigin: "center" }}>
                <Share />
              </g>
            </g>
          ))
        : null}

      <Label x={20} y={66} width={42} text="ETH" fill="#fbe74e" rotate={-8} />
      <Label x={244} y={94} width={62} text="SHARES" fill="#d1f500" rotate={6} />
      <Sparkle x={292} y={36} size={0.85} />
      <Sparkle x={30} y={124} size={0.6} fill="#ffcadc" delay={0.9} />
      {done ? <Sparkle x={304} y={98} size={0.7} delay={0.2} /> : null}
    </Frame>
  );
}

/* ---------- unstake: the exit gate ---------- */

/** Shares ride a belt into the exit gate, the clock ticks, ETH hops out into the wallet. */
export function ExitGate({ active = false, done = false, className }: { active?: boolean; done?: boolean; className?: string }) {
  return (
    <Frame active={active} done={done} className={className}>
      <Belt x={18} y={150} width={128} />
      {[0, 1, 2].map((i) => (
        <g key={i} transform="translate(30 132)">
          <g className="scene-queue" style={delay(i)}>
            <Share />
          </g>
        </g>
      ))}

      {/* The gate and its clock */}
      <path d="M144 162V104a32 32 0 0 1 64 0v58" fill="#ffcadc" {...LINE} />
      <path d="M156 162v-54a20 20 0 0 1 40 0v54" fill={INK} {...LINE} />
      <circle cx="176" cy="62" r="18" fill="#ffffff" {...LINE} />
      <path d="M176 49v-3M176 78v-3M163 62h-3M192 62h-3" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
      <g transform="translate(176 62)">
        <g className="scene-spin scene-slow">
          <path d="M0 0V-11" stroke={INK} strokeWidth={2.2} strokeLinecap="round" />
        </g>
        <path d="M0 0h7" stroke={INK} strokeWidth={2.2} strokeLinecap="round" />
        <circle r="2.2" fill={INK} />
      </g>

      {/* ETH out, into the wallet */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform="translate(204 140)">
          <g className="scene-hop" style={delay(i + 0.5)}>
            <Coin fill={["#9dc4f5", "#fbe74e", "#e2f2e5"][i]} />
          </g>
        </g>
      ))}
      <g className={done ? "scene-bounce" : undefined}>
        <rect x="246" y="102" width="44" height="28" rx="6" fill="#d1f500" {...LINE} transform="rotate(-6 268 116)" />
        <rect x="236" y="116" width="66" height="46" rx="10" fill="#ff5a4d" {...LINE} />
        <path d="M236 128h66" {...LINE} />
        <rect x="278" y="134" width="30" height="18" rx="6" fill="#ffffff" {...LINE} />
        <circle cx="288" cy="143" r="3" fill={INK} />
      </g>

      <Label x={24} y={92} width={62} text="SHARES" fill="#d1f500" rotate={-6} />
      <Label x={250} y={70} width={42} text="ETH" fill="#fbe74e" rotate={7} />
      <Sparkle x={118} y={40} size={0.75} />
      <Sparkle x={306} y={104} size={0.55} fill="#ffcadc" delay={1.1} />
      {done ? <Sparkle x={232} y={92} size={0.8} delay={0.15} /> : null}
    </Frame>
  );
}

/* ---------- locks: the safe ---------- */

const DAYS = ["7", "30", "90", "365"];

/**
 * A share drops into the safe, the dial spins, the calendar flips; the padlock shuts when locked.
 * Given `days`, the calendar shows that duration (flipping over when it changes) instead of cycling.
 */
export function LockSafe({ active = false, done = false, days, className }: { active?: boolean; done?: boolean; days?: number; className?: string }) {
  return (
    <Frame active={active} done={done} className={className}>
      {/* Shares dropping into the slot */}
      {[0, 1].map((i) => (
        <g key={i} transform="translate(124 48)">
          <g className="scene-drop" style={delay(i * 1.5)}>
            <Share />
          </g>
        </g>
      ))}

      {/* The safe */}
      <rect x="70" y="62" width="110" height="100" rx="12" fill="#ffffff" {...LINE} />
      <rect x="82" y="74" width="86" height="76" rx="8" fill="#e2f2e5" {...LINE} />
      <rect x="108" y="62" width="32" height="7" rx="3.5" fill={INK} />
      <circle cx="125" cy="112" r="20" fill="#ffffff" {...LINE} />
      <g transform="translate(125 112)">
        <g className="scene-spin scene-slow">
          <circle r="13" fill="#fbe74e" {...LINE} />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <path key={a} d="M0-13v4" stroke={INK} strokeWidth={1.4} transform={`rotate(${a})`} />
          ))}
          <path d="M0 0V-8" stroke={INK} strokeWidth={2.2} strokeLinecap="round" />
        </g>
        <circle r="2.2" fill={INK} />
      </g>
      <path d="M160 102v20" stroke={INK} strokeWidth={4} strokeLinecap="round" />

      {/* The padlock on the handle */}
      <g transform="translate(166 120)">
        <path
          className={done ? "scene-shackle-shut" : "scene-shackle-open"}
          d="M6 14V8a8 8 0 0 1 16 0v6"
          fill="none"
          stroke={INK}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <rect x="0" y="13" width="28" height="22" rx="6" fill={done ? "#d1f500" : "#ffffff"} {...LINE} style={{ transition: "fill 0.3s ease-out 0.25s" }} />
        <circle cx="14" cy="22" r="2.6" fill={INK} />
        <path d="M14 23.5v4.5" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
      </g>

      {/* The calendar, flipping through durations */}
      <g transform="translate(222 70)">
        <rect width="70" height="74" rx="10" fill="#ffffff" {...LINE} />
        <rect width="70" height="20" rx="10" fill="#ff5a4d" {...LINE} />
        <path d="M0 14h70" stroke="#ff5a4d" strokeWidth={8} />
        <path d="M0 20h70" {...LINE} />
        <path d="M18 -4v10M52 -4v10" stroke={INK} strokeWidth={3} strokeLinecap="round" />
        {days !== undefined ? (
          <text
            key={days}
            x="35"
            y="52"
            textAnchor="middle"
            fontFamily={FONT}
            fontWeight="800"
            fontSize={String(days).length > 2 ? 22 : 26}
            fill={INK}
            style={{ transformBox: "fill-box", animation: "tick-in 0.35s var(--ease-out-soft)" }}
          >
            {days}
          </text>
        ) : (
          DAYS.map((day, i) => (
            <text
              key={day}
              className="scene-flip"
              x="35"
              y="52"
              textAnchor="middle"
              fontFamily={FONT}
              fontWeight="800"
              fontSize={day.length > 2 ? 22 : 26}
              fill={INK}
              style={delay(i * 1.2)}
            >
              {day}
            </text>
          ))
        )}
        <text x="35" y="66" textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="9" fill={INK} opacity={0.6}>
          DAYS
        </text>
      </g>

      <Label x={20} y={84} width={62} text="SHARES" fill="#d1f500" rotate={-7} />
      <Sparkle x={300} y={50} size={0.8} />
      <Sparkle x={40} y={140} size={0.55} fill="#9dc4f5" delay={0.8} />
      {done ? <Sparkle x={210} y={112} size={0.75} delay={0.3} /> : null}
    </Frame>
  );
}
