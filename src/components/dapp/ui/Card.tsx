import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type CardTone = "card" | "ink" | "canvas" | "mint" | "sky" | "lemonade" | "baby" | "lime";

const TONES: Record<CardTone, string> = {
  card: "bg-card shadow-card",
  ink: "bg-ink text-white",
  canvas: "bg-canvas",
  mint: "bg-mint",
  sky: "bg-sky-soft",
  lemonade: "bg-lemonade",
  baby: "bg-baby",
  lime: "bg-lime",
};

export interface CardProps extends HTMLAttributes<HTMLElement> {
  tone?: CardTone;
  /** Removes the padding, for cards whose content sets its own (lists, charts). */
  flush?: boolean;
  as?: "div" | "section" | "article";
}

/** The walkthrough's white card on the grey-green canvas: flat, generously rounded. It fades in, so content replacing a skeleton never pops. */
export function Card({ className, tone = "card", flush = false, as: Tag = "div", ...rest }: CardProps) {
  return <Tag className={cn("animate-fade rounded-card", TONES[tone], flush ? "" : "p-5 sm:p-6", className)} {...rest} />;
}

/** Title row of a card: a title (and optional hint) on the left, actions on the right. */
export function CardHeader({
  title,
  hint,
  action,
  icon,
  className,
  as: Heading = "h2",
}: {
  title: ReactNode;
  hint?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
  as?: "h2" | "h3";
}) {
  return (
    <div className={cn("mb-4 flex items-start justify-between gap-4", className)}>
      <div className="flex min-w-0 items-start gap-3">
        {icon ? <span className="mt-0.5 shrink-0">{icon}</span> : null}
        <div className="min-w-0">
          <Heading className="text-[15px] leading-6 font-semibold">{title}</Heading>
          {hint ? <p className="mt-0.5 text-[13px] leading-5 text-ink-2">{hint}</p> : null}
        </div>
      </div>
      {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
    </div>
  );
}

/** A label/value row (fees, conditions, parameters). */
export function Row({
  label,
  value,
  hint,
  className,
  strong = true,
}: {
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
  className?: string;
  strong?: boolean;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4 py-3 text-sm", className)}>
      <div className="min-w-0 text-ink-2">
        <div>{label}</div>
        {hint ? <div className="mt-0.5 text-xs leading-4 text-ink-3">{hint}</div> : null}
      </div>
      <div className={cn("max-w-[60%] shrink-0 text-right tabular", strong && "font-semibold text-ink")}>{value}</div>
    </div>
  );
}

/** A small section label above a group of cards, as "Your layers" in the walkthrough. */
export function SectionLabel({ children, action, className }: { children: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cn("mb-3 flex items-center justify-between gap-3 px-1", className)}>
      <h2 className="text-[15px] font-semibold">{children}</h2>
      {action}
    </div>
  );
}
