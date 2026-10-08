import type { ReactNode } from "react";

/* The walkthrough's own icons (1.8 stroke, round joins), for the tab bar and the places it shows them. */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const Svg = ({ children, className }: { children: ReactNode; className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    {children}
  </svg>
);

export const HomeIcon = ({ className, filled = true }: { className?: string; filled?: boolean }) => (
  <Svg className={className}>
    {filled ? (
      <path d="M4 10.4 12 4l8 6.4V19a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H5.5A1.5 1.5 0 0 1 4 19Z" fill="currentColor" />
    ) : (
      <path {...stroke} d="M4 10.4 12 4l8 6.4V19a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H5.5A1.5 1.5 0 0 1 4 19Z" />
    )}
  </Svg>
);

export const ActivityIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path {...stroke} d="M3.6 12.6A8.5 8.5 0 1 0 6 6.4" />
    <path {...stroke} d="M3.5 3.8v3.6h3.6M12 7.8V12l3 2" />
  </Svg>
);

export const PhasesIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path {...stroke} d="M12 3.5 20.5 8 12 12.5 3.5 8Z" />
    <path {...stroke} d="M3.5 12 12 16.5 20.5 12M3.5 16 12 20.5 20.5 16" />
  </Svg>
);

export const GearIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <circle {...stroke} cx="12" cy="12" r="3" />
    <path
      {...stroke}
      d="M12 2.8l1.6 2.3 2.7-.7.7 2.7 2.3 1.6-1.2 2.5 1.2 2.5-2.3 1.6-.7 2.7-2.7-.7L12 21.2l-1.6-2.3-2.7.7-.7-2.7-2.3-1.6 1.2-2.5-1.2-2.5 2.3-1.6.7-2.7 2.7.7Z"
    />
  </Svg>
);

export const StakeIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <ellipse {...stroke} cx="12" cy="6.5" rx="7" ry="2.8" />
    <path {...stroke} d="M5 6.5v5c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-5M5 11.5v5c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-5" />
  </Svg>
);

export const UnstakeIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path {...stroke} d="M12 15V4.5M7.5 9 12 4.5 16.5 9" />
    <path {...stroke} d="M4.5 14.5v3A2.5 2.5 0 0 0 7 20h10a2.5 2.5 0 0 0 2.5-2.5v-3" />
  </Svg>
);

export const LockIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <rect {...stroke} x="5" y="10.5" width="14" height="10" rx="2.5" />
    <path {...stroke} d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
  </Svg>
);

export const LiquidityIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path {...stroke} d="M12 3.5c4 5 6.5 8.4 6.5 11.2a6.5 6.5 0 0 1-13 0c0-2.8 2.5-6.2 6.5-11.2Z" />
    <path {...stroke} d="M9.2 15.4a3 3 0 0 0 2.4 2.4" />
  </Svg>
);

export const BorrowIcon = ({ className }: { className?: string }) => (
  <Svg className={className}>
    <path {...stroke} d="M3.5 16a8.5 8.5 0 0 1 17 0" />
    <path {...stroke} d="M12 16l4-5" />
    <path {...stroke} d="M3.5 19.5h17" />
  </Svg>
);
