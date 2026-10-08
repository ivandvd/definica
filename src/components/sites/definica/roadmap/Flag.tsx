import { icons } from "../shared/icons";
import { INK } from "./Blob";
import { PALETTE } from "./Pieces";

/** The Definica mark's paths (ink D, lime diamond), without the outer `<svg>`. */
const MARK = icons["definica-mark"].replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");

interface FlagProps {
  className?: string;
  /** Class of the cloth group (it waves). */
  clothClass?: string;
  /** Class of the group that raises the cloth up the pole. */
  raiseClass?: string;
}

/** The finish flag: an ink pole with a white cloth carrying the Definica mark. Its foot is at (10, 78) of the 60 × 80 box. */
export function Flag({ className, clothClass, raiseClass }: FlagProps) {
  return (
    <svg className={className} viewBox="0 0 60 80" overflow="visible" aria-hidden="true" focusable="false">
      <g className={raiseClass}>
        <g className={clothClass}>
          <path
            d="M10 9C22 2 32 15 52 8V36C32 43 22 30 10 37Z"
            fill={PALETTE.white}
            stroke={INK}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <svg
            x="22.5"
            y="13.5"
            width="17"
            height="17"
            viewBox="-1.3 0 24 24"
            style={{ color: "#0f0f0f" }}
            dangerouslySetInnerHTML={{ __html: MARK }}
          />
        </g>
      </g>
      <line x1="10" y1="7" x2="10" y2="78" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="10" cy="6" r="3.2" fill={INK} />
    </svg>
  );
}
