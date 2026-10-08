import type { RoadItem, RoadStop } from "./content";
import type { SceneryVariant } from "./Scenery";

/** Which side of the road a node's text sits on (desktop; on mobile everything sits to the right). */
export type NodeSide = "left" | "right" | "centre";

export type RoadNode =
  | { kind: "stop"; stop: RoadStop; x: number; side: NodeSide; scenery?: SceneryVariant }
  | { kind: "item"; item: RoadItem; x: number; side: NodeSide; scenery?: SceneryVariant };

/** Desktop x of each stop as a percentage of the track's width; the road weaves between them. */
const STOP_X = [36, 64, 36, 64];
/** Where the road ends: the finish flag, in the middle. */
export const FINISH_X = 50;
/** The still life beside each phase: coins for staking, a padlock for the lock-ups, a road sign for borrowing. */
const STOP_SCENERY: SceneryVariant[] = ["staking", "liquidity", "borrowing"];
/** Still lifes beside some of the items, by the item's place along the road. */
const ITEM_SCENERY: Partial<Record<number, SceneryVariant>> = { 1: "accounting", 3: "security", 4: "flow" };

/** Text goes on the roomy side of the road; a node in the middle alternates with the one before. */
const sideOf = (x: number, previous: NodeSide): NodeSide =>
  x < 50 ? "right" : x > 50 ? "left" : previous === "left" ? "right" : "left";

/**
 * Lays the stops and their items along the road: the stops alternate between the left and the
 * right of the track, and each stop's items are spread along the curve to the next stop (or to
 * the finish after the last one).
 */
export function layoutRoad(stops: RoadStop[]): RoadNode[] {
  const nodes: RoadNode[] = [];
  let previous: NodeSide = "left";
  let itemIndex = 0;
  stops.forEach((stop, i) => {
    const x = STOP_X[i % STOP_X.length];
    const next = i + 1 < stops.length ? STOP_X[(i + 1) % STOP_X.length] : FINISH_X;
    previous = sideOf(x, previous);
    nodes.push({ kind: "stop", stop, x, side: previous, scenery: STOP_SCENERY[i % STOP_SCENERY.length] });
    stop.items.forEach((item, j) => {
      const t = (j + 1) / (stop.items.length + 1);
      const ix = Math.round((x + (next - x) * t) * 10) / 10;
      previous = sideOf(ix, previous);
      nodes.push({ kind: "item", item, x: ix, side: previous, scenery: ITEM_SCENERY[itemIndex] });
      itemIndex++;
    });
  });
  return nodes;
}

export interface Point {
  x: number;
  y: number;
}

const fmt = (n: number) => n.toFixed(1);

/**
 * The road through the markers: straight into and out of every marker, an S-curve between two
 * that sit at different x. The y of the curve never turns back, which `pointAtY` relies on.
 */
export function roadPath(points: Point[]): string {
  if (!points.length) return "";
  let d = `M${fmt(points[0].x)} ${fmt(points[0].y)}`;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    if (Math.abs(a.x - b.x) < 0.5) {
      d += ` L${fmt(b.x)} ${fmt(b.y)}`;
    } else {
      const k = (b.y - a.y) * 0.5;
      d += ` C${fmt(a.x)} ${fmt(a.y + k)} ${fmt(b.x)} ${fmt(b.y - k)} ${fmt(b.x)} ${fmt(b.y)}`;
    }
  }
  return d;
}

export interface Sample {
  len: number;
  x: number;
  y: number;
}

/** Points along the path every `step` px, so a y can be turned into a point without walking the path each frame. */
export function samplePath(path: SVGPathElement, step = 6): Sample[] {
  const total = path.getTotalLength();
  if (!total) return [];
  const count = Math.max(2, Math.ceil(total / step));
  const samples: Sample[] = [];
  for (let i = 0; i <= count; i++) {
    const len = (total * i) / count;
    const p = path.getPointAtLength(len);
    samples.push({ len, x: p.x, y: p.y });
  }
  return samples;
}

/** The point where the road crosses a horizontal line at `y` (clamped to the road's ends). */
export function pointAtY(samples: Sample[], y: number): Sample {
  const first = samples[0];
  const last = samples[samples.length - 1];
  if (y <= first.y) return first;
  if (y >= last.y) return last;
  let lo = 0;
  let hi = samples.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (samples[mid].y < y) lo = mid;
    else hi = mid;
  }
  const a = samples[lo];
  const b = samples[hi];
  const t = b.y === a.y ? 0 : (y - a.y) / (b.y - a.y);
  return { len: a.len + (b.len - a.len) * t, x: a.x + (b.x - a.x) * t, y };
}
