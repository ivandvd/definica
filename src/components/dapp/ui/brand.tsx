import { icons } from "@/components/sites/definica/shared/icons";
import { cn } from "@/lib/utils";

/* The Definica marks, as drawn in the landing page's phone walkthrough. */

export const MARK_D =
  "M9.12705 0.252278C10.8655 0.252278 12.4782 0.553437 13.9651 1.15575C15.4519 1.73576 16.7444 2.56116 17.8424 3.63194C18.9632 4.68042 19.8325 5.91851 20.4501 7.34622C21.0677 8.75163 21.3765 10.2909 21.3765 11.964C21.3765 13.6148 21.0677 15.154 20.4501 16.5817C19.8325 18.0095 18.9747 19.2587 17.8767 20.3295C16.7787 21.378 15.4862 22.2034 13.9994 22.8057C12.5125 23.3857 10.9113 23.6757 9.19568 23.6757H1.78138C0.797549 23.6757 0 22.869 0 21.8739V2.05408C0 1.05897 0.797549 0.252278 1.78138 0.252278H9.12705ZM9.38556 5.45784L3.9263 11.3478C3.6051 11.6944 3.6051 12.2336 3.9263 12.5801L4.48495 13.1829L5.90247 14.7122L9.38556 18.4701C9.73745 18.8498 10.3333 18.8498 10.6851 18.4701L16.1444 12.5801C16.4656 12.2336 16.4656 11.6944 16.1444 11.3478L15.6535 10.8182L14.236 9.28886L10.6851 5.45784C10.3333 5.07819 9.73745 5.07819 9.38556 5.45784Z";
export const MARK_SLASH =
  "M16.9295 10.3087L15.6535 10.8182L5.90247 14.7122L3.93511 15.4979L3.21179 13.6913L4.48495 13.1829L14.236 9.28886L16.2061 8.50211L16.9295 10.3087Z";
const MARK_LOWER =
  "M10.6851 18.4701L16.1444 12.5801C16.4656 12.2336 16.4656 11.6944 16.1444 11.3478L15.6535 10.8182L5.90247 14.7122L9.38556 18.4701C9.73745 18.8498 10.3333 18.8498 10.6851 18.4701Z";
const MARK_UPPER =
  "M9.38556 5.45784L3.9263 11.3478C3.6051 11.6944 3.6051 12.2336 3.9263 12.5801L4.48495 13.1829L14.236 9.28886L10.6851 5.45784C10.3333 5.07819 9.73745 5.07819 9.38556 5.45784Z";

/** The Definica "D" mark. `accent: null` leaves the diamond open so the background shows through. */
export function DefinicaMark({ className, color = "currentColor", accent = "#d1f500" }: { className?: string; color?: string; accent?: string | null }) {
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

/** The Definica wordmark (the site's logo asset). */
export function DefinicaLogo({ className }: { className?: string }) {
  return <span className={cn("block [&_svg]:block [&_svg]:h-full [&_svg]:w-auto", className)} dangerouslySetInnerHTML={{ __html: icons["definica-logo"] }} />;
}

/** The mark on a white tile, as in the walkthrough's top bar. */
export function MarkTile({ className }: { className?: string }) {
  return (
    <span className={cn("flex size-10 items-center justify-center rounded-control bg-card", className)}>
      <DefinicaMark className="h-5 w-5" color="#0f0f0f" />
    </span>
  );
}

const HEX = "M23.5 3.2a7 7 0 0 1 7 0l15.3 8.8a7 7 0 0 1 3.5 6.1v17.7a7 7 0 0 1-3.5 6.1L30.5 50.8a7 7 0 0 1-7 0L8.2 41.9a7 7 0 0 1-3.5-6.1V18.1a7 7 0 0 1 3.5-6.1Z";

/** The ink hexagon with the lime D: the centre of the phone tab bar. */
export function HexMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 54 54" aria-hidden="true" focusable="false">
      <path d={HEX} fill="#0f0f0f" />
      <g transform="translate(17.3 15.4) scale(0.92)">
        <path fillRule="evenodd" clipRule="evenodd" d={MARK_D} fill="#d1f500" />
        <path d={MARK_SLASH} fill="#d1f500" />
      </g>
    </svg>
  );
}

/** The Ethereum diamond, in one colour. */
export function EthDiamond({ className, color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 26" aria-hidden="true" focusable="false">
      <path d="M8 0.8 15.1 12.6 8 16.8 0.9 12.6Z" fill={color} />
      <path d="M0.9 14.2 8 18.4l7.1-4.2L8 25.2Z" fill={color} opacity="0.65" />
    </svg>
  );
}

/** A wallet avatar: a deterministic two-tone gradient from the address. */
export function AddressAvatar({ address, className }: { address: string; className?: string }) {
  const seed = parseInt(address.slice(2, 8), 16) || 0;
  const hue = seed % 360;
  const hue2 = (hue + 70) % 360;
  return (
    <span
      className={cn("inline-block shrink-0 rounded-full ring-2 ring-white", className)}
      style={{ background: `linear-gradient(135deg, hsl(${hue} 70% 62%), hsl(${hue2} 80% 52%))` }}
      aria-hidden="true"
    />
  );
}
