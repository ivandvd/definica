import { CircleAlert, CircleCheck, Info, OctagonAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type NoticeTone = "info" | "caution" | "danger" | "success" | "neutral";

const STYLES: Record<NoticeTone, { box: string; icon: ReactNode }> = {
  info: { box: "bg-sky-soft", icon: <Info className="size-[18px] text-sky-ink" aria-hidden="true" /> },
  caution: { box: "bg-amber-soft", icon: <CircleAlert className="size-[18px] text-amber" aria-hidden="true" /> },
  danger: { box: "bg-red-soft", icon: <OctagonAlert className="size-[18px] text-red" aria-hidden="true" /> },
  success: { box: "bg-green-soft", icon: <CircleCheck className="size-[18px] text-green-ink" aria-hidden="true" /> },
  neutral: { box: "bg-canvas", icon: <Info className="size-[18px] text-ink-2" aria-hidden="true" /> },
};

export interface NoticeProps {
  tone?: NoticeTone;
  title?: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
  /** Announced by screen readers when it appears (warnings that arrive with new data). */
  live?: boolean;
}

/** An inline message: a caveat before a transaction, a warning about health, a confirmation. */
export function Notice({ tone = "info", title, children, action, icon, className, live = false }: NoticeProps) {
  const style = STYLES[tone];
  return (
    <div className={cn("flex gap-3 rounded-[14px] p-3.5 text-[13px] leading-5", style.box, className)} role={live ? "status" : undefined}>
      <span className="mt-px shrink-0">{icon ?? style.icon}</span>
      <div className="min-w-0 flex-1">
        {title ? <div className="font-semibold text-ink">{title}</div> : null}
        {children ? <div className={cn(title && "mt-0.5", "text-ink-2 [&_a]:font-semibold [&_a]:text-ink [&_a]:underline")}>{children}</div> : null}
      </div>
      {action ? <div className="shrink-0 self-center">{action}</div> : null}
    </div>
  );
}
