import type { CSSProperties, ReactNode } from "react";
import { Move, type Motion } from "./art";
import { IconShape } from "./icons";
import styles from "./kit.module.css";

interface StickerProps {
  /** One of the kit's stickers… */
  icon?: string;
  tone?: string;
  /** …or a drawing of its own, in a 64 × 64 box. */
  children?: ReactNode;
  /** Desktop position and size (any CSS length; percentages are of the parent). */
  x: string;
  y: string;
  size: string;
  /** Phone position and size, where they differ. */
  mx?: string;
  my?: string;
  ms?: string;
  motion?: Motion;
  dur?: number;
  delay?: number;
  /** Shown from 769px only. */
  desktopOnly?: boolean;
  /** Resting angle, in degrees. */
  rotate?: number;
}

/** A sticker placed around a hero or a section head, moving on a loop. Decorative only. */
export function Sticker({
  icon,
  tone,
  children,
  x,
  y,
  size,
  mx,
  my,
  ms,
  motion = "float",
  dur,
  delay,
  desktopOnly = false,
  rotate,
}: StickerProps) {
  const style: Record<string, string> = { "--x": x, "--y": y, "--s": size };
  if (mx) style["--mx"] = mx;
  if (my) style["--my"] = my;
  if (ms) style["--ms"] = ms;

  return (
    <span className={desktopOnly ? `${styles.sticker} ${styles.stickerDesktop}` : styles.sticker} style={style as CSSProperties}>
      <svg
        className={styles.art}
        viewBox="0 0 64 64"
        overflow="visible"
        aria-hidden="true"
        focusable="false"
        style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}
      >
        <Move motion={motion} dur={dur} delay={delay}>
          {children ?? (icon ? <IconShape name={icon} tone={tone} /> : null)}
        </Move>
      </svg>
    </span>
  );
}
