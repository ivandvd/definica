import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  /** A glyph badge or an icon. */
  art: ReactNode;
  title: ReactNode;
  text?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ art, title, text, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center px-4 py-10 text-center", className)}>
      <div className="flex items-center justify-center">{art}</div>
      <h3 className="mt-4 text-base font-bold">{title}</h3>
      {text ? <p className="mt-1.5 max-w-sm text-[13px] leading-5 text-ink-2">{text}</p> : null}
      {action ? <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div> : null}
    </div>
  );
}
