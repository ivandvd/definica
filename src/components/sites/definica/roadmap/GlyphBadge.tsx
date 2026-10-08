import { glyphSrc } from "./content";
import styles from "./roadmap.module.css";

/** A wheel glyph in a coloured circle, as in the home page's "DeFi Infrastructure" wheel. */
export function GlyphBadge({ glyph, color, className }: { glyph: string; color: string; className?: string }) {
  return (
    <span className={className ? `${styles.glyph} ${className}` : styles.glyph} style={{ backgroundColor: color }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- tiny decorative svg, no optimisation needed */}
      <img src={glyphSrc(glyph)} alt="" draggable={false} />
    </span>
  );
}
