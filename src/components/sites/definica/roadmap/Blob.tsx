import type { CSSProperties } from "react";
import { BLOB_FILLS, BLOB_PATH } from "../shared/SurtitleWithDot";

export const INK = "#001405";
export const GREEN = BLOB_FILLS.green;

interface BlobProps {
  className?: string;
  fill?: string;
  style?: CSSProperties;
}

/** The site's blob marker: the surtitle graphic, reused as bullets, stop markers and scenery. */
export function Blob({ className, fill = GREEN, style }: BlobProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={BLOB_PATH} fill={fill} stroke={INK} strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}
