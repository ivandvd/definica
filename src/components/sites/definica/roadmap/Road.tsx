"use client";

import { useEffect, useId, useRef, type CSSProperties } from "react";
import { toneClass } from "../root-8a5edab2/VerticalCard";
import { gsap, ScrollTrigger } from "../shared/gsap";
import { BLOB_PATH } from "../shared/SurtitleWithDot";
import { Blob, INK } from "./Blob";
import { cardTone, glyphSrc, roadmap, type RoadItem, type RoadStop } from "./content";
import { Flag } from "./Flag";
import { GlyphBadge } from "./GlyphBadge";
import { prefersReducedMotion, usePop, useRise } from "./motion";
import { DottedDisc, LIME, PALETTE, Pin, Sparkle } from "./Pieces";
import { FINISH_X, layoutRoad, pointAtY, roadPath, samplePath, type RoadNode, type Sample } from "./road-layout";
import styles from "./roadmap.module.css";
import { Scenery, TONE_FILLS } from "./Scenery";
import { SectionHead } from "./SectionHead";

const { road } = roadmap;
const NODES = layoutRoad(road.stops);

/** The node's desktop x, read by the CSS as `--x` (mobile sets its own). */
const nodeStyle = (x: number): CSSProperties => ({ "--x-desktop": `${x}%` } as CSSProperties);

/** The three widths of the road, in rem. */
const ROAD = { desktop: 2.6, mobile: 1.8, outline: 0.3 };
/** Size of the travelling blob, in rem. */
const PUCK = 3.2;

/** What the finish throws in the air when the blob arrives, in turn. */
const BURST = [
  { shape: "sparkle", fill: LIME },
  { shape: "blob", fill: PALETTE.sky },
  { shape: "sparkle", fill: PALETTE.lemonade },
  { shape: "blob", fill: PALETTE.baby },
  { shape: "sparkle", fill: PALETTE.white },
  { shape: "blob", fill: LIME },
  { shape: "sparkle", fill: PALETTE.baby },
  { shape: "blob", fill: PALETTE.lemonade },
  { shape: "sparkle", fill: PALETTE.sky },
  { shape: "blob", fill: PALETTE.mint },
] as const;

/** Directions of the burst strokes (0° points right), three either side, clear of the road above and below; and their stagger. */
const DASHES = [
  { angle: -150, step: 0 },
  { angle: 180, step: 1 },
  { angle: 150, step: 2 },
  { angle: -30, step: 0 },
  { angle: 0, step: 1 },
  { angle: 30, step: 2 },
];

/** Short ink strokes either side of a marker, like a sticker's emphasis lines; they pop out while the blob passes (see `.dash`). */
function Dashes() {
  return (
    <span className={styles.dashes} aria-hidden="true">
      {DASHES.map(({ angle, step }) => (
        <span key={angle} className={styles.dash} style={{ "--a": `${angle}deg`, "--i": step } as CSSProperties} />
      ))}
    </span>
  );
}

function StartNode({ x }: { x: number }) {
  const refMarker = useRef<HTMLDivElement>(null);
  usePop(refMarker, { from: "drop" });

  return (
    <li className={`${styles.node} ${styles.nodeStart}`} style={nodeStyle(x)} data-side="right">
      {/* The road leaves from the pin's tip, 94% of the way down its box. */}
      <div ref={refMarker} className={`${styles.marker} ${styles.startMarker}`} data-road-marker="start" data-road-anchor="0.94">
        <Pin className={styles.startPin} fill={LIME} />
      </div>
      <span className={`${styles.startLabel} ${styles.roadLabel} --fw-600`}>{road.start}</span>
    </li>
  );
}

function StopNode({ stop, node }: { stop: RoadStop; node: Extract<RoadNode, { kind: "stop" }> }) {
  const refMarker = useRef<HTMLDivElement>(null);
  const refCard = useRef<HTMLElement>(null);
  usePop(refMarker);
  useRise(refCard, { delay: 0.15 });

  return (
    <li className={`${styles.node} ${styles.nodePhase}`} style={nodeStyle(node.x)} data-side={node.side}>
      <div ref={refMarker} className={`${styles.marker} ${styles.stopMarker}`} data-road-marker="phase">
        <Dashes />
        <span className={styles.stopShape}>
          <Blob className={styles.stopBlob} fill={TONE_FILLS[stop.tone] ?? TONE_FILLS.lime} />
          {/* eslint-disable-next-line @next/next/no-img-element -- tiny decorative svg, no optimisation needed */}
          <img className={styles.stopGlyph} src={glyphSrc(stop.glyph)} alt="" draggable={false} />
        </span>
      </div>
      <div className={styles.nodeBody}>
        <article ref={refCard} className={`${styles.stopCard} ${toneClass(cardTone(stop.tone))}`}>
          <span className={styles.phaseLabel}>
            {stop.label} <span className={styles.phaseTheme}>{stop.theme}</span>
          </span>
          <h3 className={`${styles.stopTitle} AppTitle-9`}>{stop.title}</h3>
          <p className={`${styles.stopText} AppText-8`}>{stop.text}</p>
          <div className={styles.points}>
            <span className={`${styles.roadLabel} --fw-600`}>{stop.pointsTitle}</span>
            <ul className={styles.bullets}>
              {stop.bullets.map((bullet) => (
                <li key={bullet} className={`${styles.bullet} AppText-8`}>
                  <Blob className={styles.bulletBlob} />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>
      {node.scenery ? <Scenery variant={node.scenery} className={styles.nodeScenery} /> : null}
    </li>
  );
}

function ItemNode({ item, node }: { item: RoadItem; node: Extract<RoadNode, { kind: "item" }> }) {
  const refMarker = useRef<HTMLDivElement>(null);
  const refCard = useRef<HTMLDivElement>(null);
  usePop(refMarker);
  useRise(refCard, { delay: 0.1 });

  return (
    <li className={`${styles.node} ${styles.nodeItem}`} style={nodeStyle(node.x)} data-side={node.side}>
      <div ref={refMarker} className={`${styles.marker} ${styles.itemMarker}`} data-road-marker="item">
        <Dashes />
        <GlyphBadge glyph={item.glyph} color={item.glyphColor} className={styles.itemBadge} />
      </div>
      <div className={styles.nodeBody}>
        <div ref={refCard} className={styles.itemCard}>
          <h4 className={`${styles.itemTitle} AppTitle-10`}>{item.title}</h4>
          <p className={`${styles.itemText} AppText-8`}>{item.text}</p>
        </div>
      </div>
      {node.scenery ? <Scenery variant={node.scenery} className={styles.nodeScenery} size={11} /> : null}
    </li>
  );
}

function FinishNode() {
  const refMarker = useRef<HTMLDivElement>(null);
  const refBody = useRef<HTMLDivElement>(null);
  usePop(refMarker, { offset: 0 });
  useRise(refBody, { delay: 0.2, offset: 0 });

  return (
    <li className={`${styles.node} ${styles.nodeFinish}`} style={nodeStyle(FINISH_X)} data-side="centre">
      <Scenery variant="finishLeft" className={styles.finishSceneLeft} size={13} depth={0.4} />
      <Scenery variant="finishRight" className={styles.finishSceneRight} size={11} depth={0.5} />
      <div ref={refMarker} className={`${styles.marker} ${styles.finishMarker}`} data-road-marker="finish">
        <Dashes />
        <DottedDisc className={styles.finishDisc} fill={LIME} centre={PALETTE.baby} />
        <Flag className={styles.flag} clothClass={styles.flagCloth} raiseClass={styles.flagRaise} />
        <span className={styles.burst} aria-hidden="true">
          {BURST.map((piece, index) => (
            <span key={index} className={styles.burstPiece} data-burst="">
              {piece.shape === "blob" ? (
                <Blob className={styles.pieceSvg} fill={piece.fill} />
              ) : (
                <Sparkle className={styles.pieceSvg} fill={piece.fill} />
              )}
            </span>
          ))}
        </span>
      </div>
      <div ref={refBody} className={styles.nodeBody}>
        <span className={`${styles.roadLabel} --fw-600`}>{road.finish.label}</span>
        <h3 className={`${styles.finishTitle} AppTitle-9`}>{road.finish.title}</h3>
        <p className={`${styles.finishText} AppText-8`}>{road.finish.text}</p>
      </div>
    </li>
  );
}

/** A marker the travelling blob passes through. */
interface Checkpoint {
  el: HTMLElement;
  kind: string;
  /** Centre on the road, in track coordinates. */
  y: number;
  /** Within this distance the marker is hit: it swells and its burst strokes pop out. */
  reach: number;
  /** Within this distance the blob shrinks into the marker (0: it passes over it). */
  absorb: number;
  active: boolean;
  reached: boolean;
}

/**
 * The track: the nodes in a column, and behind them an SVG road drawn through their markers.
 * The road is measured from the layout (so it follows it at any width) and revealed down to the
 * viewport's middle as the page scrolls, with a blob travelling at its tip. At each phase the blob
 * sinks into the marker and comes out the other side while the marker swells and burst strokes pop
 * out either side of it; at the finish it stays, the flag goes up and a handful of pieces are thrown
 * in the air.
 */
function RoadTrack() {
  const ids = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const clipId = `road-clip-${ids}`;
  const gradientId = `road-gradient-${ids}`;
  const refTrack = useRef<HTMLDivElement>(null);
  const refSvg = useRef<SVGSVGElement>(null);
  const refClip = useRef<SVGRectElement>(null);
  const refGradient = useRef<SVGLinearGradientElement>(null);
  const refPuck = useRef<SVGGElement>(null);
  const refPuckScale = useRef<SVGGElement>(null);
  const refPuckShape = useRef<SVGGElement>(null);

  useEffect(() => {
    const track = refTrack.current;
    const svg = refSvg.current;
    const clip = refClip.current;
    const gradient = refGradient.current;
    const puck = refPuck.current;
    const puckScale = refPuckScale.current;
    const puckShape = refPuckShape.current;
    if (!track || !svg || !clip || !gradient || !puck || !puckScale || !puckShape) return;

    const reduced = prefersReducedMotion();
    const paths = Array.from(svg.querySelectorAll<SVGPathElement>("[data-road-path]"));
    const stops = Array.from(gradient.querySelectorAll("stop"));
    let samples: Sample[] = [];
    let checkpoints: Checkpoint[] = [];
    let height = 0;
    let current = 0;

    const inView = (el: Element) => {
      const rect = el.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight;
    };

    const burst = (cp: Checkpoint) => {
      const pieces = Array.from(cp.el.querySelectorAll<HTMLElement>("[data-burst]"));
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 10;
      pieces.forEach((piece, i) => {
        // Fanned out upwards, never straight down into the text.
        const angle = -Math.PI / 2 + (i / (pieces.length - 1) - 0.5) * Math.PI * 1.5;
        const distance = (5.5 + (i % 3) * 1.8) * rem;
        gsap
          .timeline()
          .fromTo(
            piece,
            { x: 0, y: 0, scale: 0.2, rotation: 0, autoAlpha: 1 },
            {
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              scale: 1,
              rotation: (i % 2 ? 1 : -1) * 150,
              duration: 1,
              ease: "power3.out",
            },
          )
          .to(piece, { autoAlpha: 0, duration: 0.4, ease: "power1.in" }, 0.7);
      });
    };

    /** Reveals the road down to `y` (track coordinates), moves the blob there and plays the checkpoints it passes. */
    const apply = (y: number, effects = true) => {
      current = y;
      if (!samples.length) return;
      const point = pointAtY(samples, y);
      clip.setAttribute("height", String(Math.max(0, Math.min(height, y))));
      puck.setAttribute("transform", `translate(${point.x.toFixed(1)} ${point.y.toFixed(1)})`);

      let scale = 1;
      for (const cp of checkpoints) {
        // Past the finish the blob stays in it.
        const distance = cp.kind === "finish" && y >= cp.y ? 0 : Math.abs(y - cp.y);
        if (cp.absorb && distance < cp.absorb) scale = Math.min(scale, 0.15 + 0.85 * (distance / cp.absorb));
        const active = effects && distance < cp.reach;
        if (active !== cp.active) {
          cp.active = active;
          cp.el.toggleAttribute("data-active", active);
        }
        if (cp.kind === "finish") {
          const reached = y >= cp.y;
          if (reached !== cp.reached) {
            cp.reached = reached;
            cp.el.toggleAttribute("data-reached", reached);
            if (effects && reached && inView(cp.el)) burst(cp);
          }
        }
      }
      puckScale.setAttribute("transform", `scale(${scale.toFixed(3)})`);
    };

    /** Position of an element inside the track, from the layout (the markers' entrance transforms are ignored). */
    const offsetIn = (el: HTMLElement) => {
      let x = 0;
      let y = 0;
      let node: HTMLElement | null = el;
      while (node && node !== track) {
        x += node.offsetLeft;
        y += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }
      return { x, y };
    };

    /** Measures the markers and redraws the road through them. */
    const build = () => {
      const width = track.offsetWidth;
      height = track.offsetHeight;
      if (!width || !height) return;
      const markers = Array.from(track.querySelectorAll<HTMLElement>("[data-road-marker]"));
      const points = markers.map((marker) => {
        const offset = offsetIn(marker);
        const anchor = Number(marker.dataset.roadAnchor ?? 0.5);
        return { x: offset.x + marker.offsetWidth / 2, y: offset.y + marker.offsetHeight * anchor };
      });
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 10;
      const band = (window.innerWidth > 768 ? ROAD.desktop : ROAD.mobile) * rem;
      const widths: Record<string, number> = {
        ghost: 0.2 * rem,
        outline: band + ROAD.outline * rem,
        band,
        dashes: 0.22 * rem,
      };

      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      const d = roadPath(points);
      paths.forEach((path) => {
        const kind = path.dataset.roadPath ?? "band";
        path.setAttribute("d", d);
        path.setAttribute("stroke-width", (widths[kind] ?? band).toFixed(2));
        if (kind === "dashes") path.setAttribute("stroke-dasharray", `${(0.9 * rem).toFixed(1)} ${(1.2 * rem).toFixed(1)}`);
        if (kind === "ghost") path.setAttribute("stroke-dasharray", `${(0.5 * rem).toFixed(1)} ${(0.9 * rem).toFixed(1)}`);
      });
      clip.setAttribute("width", String(width));

      // The road takes each phase's colour at its stop.
      const phases = points.filter((_, i) => markers[i].dataset.roadMarker === "phase");
      if (phases.length > 1) {
        const y1 = phases[0].y;
        const y2 = phases[phases.length - 1].y;
        gradient.setAttribute("y1", y1.toFixed(1));
        gradient.setAttribute("y2", y2.toFixed(1));
        stops.forEach((stop, i) => {
          const phase = phases[Math.min(i, phases.length - 1)];
          stop.setAttribute("offset", ((phase.y - y1) / (y2 - y1)).toFixed(3));
        });
      }

      const known = new Map(checkpoints.map((cp) => [cp.el, cp]));
      checkpoints = markers.flatMap((marker, i): Checkpoint[] => {
        const kind = marker.dataset.roadMarker ?? "";
        if (kind === "start") return [];
        const radius = marker.offsetHeight / 2;
        const old = known.get(marker);
        return [
          {
            el: marker,
            kind,
            y: points[i].y,
            reach: radius * (kind === "item" ? 1.9 : 2.2),
            absorb: kind === "item" ? 0 : radius * 1.3,
            active: old?.active ?? false,
            reached: old?.reached ?? false,
          },
        ];
      });

      puckShape.setAttribute("transform", `scale(${((PUCK * rem) / 24).toFixed(3)}) translate(-12 -12)`);
      samples = samplePath(paths[0], 6);
      apply(reduced ? height : current, !reduced);
    };

    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        build();
        if (!reduced) ScrollTrigger.refresh();
      });
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(track);

    if (reduced) {
      puck.style.display = "none";
      return () => {
        observer.disconnect();
        cancelAnimationFrame(frame);
      };
    }

    const proxy = { y: 0 };
    const ctx = gsap.context(() => {
      gsap.to(proxy, {
        y: () => height,
        ease: "none",
        onUpdate: () => apply(proxy.y),
        scrollTrigger: { trigger: track, start: "top 55%", end: "bottom 55%", scrub: 0.5, invalidateOnRefresh: true },
      });
    });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={refTrack} className={`${styles.track} AppWrapper-1330`}>
      <svg ref={refSvg} className={styles.roadSvg} aria-hidden="true" focusable="false">
        <defs>
          <linearGradient ref={refGradient} id={gradientId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={TONE_FILLS.sky} />
            <stop offset="0.5" stopColor={TONE_FILLS.baby} />
            <stop offset="1" stopColor={TONE_FILLS.lemonade} />
          </linearGradient>
          <clipPath id={clipId}>
            <rect ref={refClip} x="0" y="0" width="0" height="0" />
          </clipPath>
        </defs>
        <path className={styles.ghost} data-road-path="ghost" />
        <g clipPath={`url(#${clipId})`}>
          <path className={styles.roadOutline} data-road-path="outline" />
          <path className={styles.roadBand} data-road-path="band" stroke={`url(#${gradientId})`} />
          <path className={styles.roadDashes} data-road-path="dashes" />
        </g>
        <g ref={refPuck} className={styles.puck}>
          <g ref={refPuckScale}>
            <g ref={refPuckShape}>
              <circle className={styles.puckPulse} cx="12" cy="12" r="11" fill={LIME} />
              <path d={BLOB_PATH} fill={LIME} stroke={INK} strokeWidth="1.7" strokeLinejoin="round" />
            </g>
          </g>
        </g>
      </svg>
      <ol className={styles.nodes}>
        <StartNode x={NODES[0]?.x ?? 50} />
        {NODES.map((node) =>
          node.kind === "stop" ? (
            <StopNode key={node.stop.title} stop={node.stop} node={node} />
          ) : (
            <ItemNode key={node.item.title} item={node.item} node={node} />
          ),
        )}
        <FinishNode />
      </ol>
    </div>
  );
}

/** The roadmap itself: the three phases as stops on a road, each followed by what it delivers, from start to finish. */
export function Road() {
  const refIntro = useRef<HTMLParagraphElement>(null);
  useRise(refIntro, { delay: 0.1 });

  return (
    <section id="road" className={`${styles.section} ${styles.sectionGrey}`}>
      <SectionHead className="AppWrapper-1160" surtitle={road.surtitle} title={road.title} dotColor="sky" titleClass="AppTitle-5" />
      <p ref={refIntro} className={`${styles.intro} AppText-1 --tac`}>
        {road.intro}
      </p>
      <RoadTrack />
    </section>
  );
}
