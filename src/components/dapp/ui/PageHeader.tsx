import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  /** The phase pill (or another status) above the title. */
  eyebrow?: ReactNode;
  /** Controls beside the title in the wide layout, under it on phones (sub-navigation, filters). */
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, eyebrow, actions, className }: PageHeaderProps) {
  return (
    <header className={cn("mb-5 flex flex-col gap-4 lg:mb-7 lg:flex-row lg:items-end lg:justify-between", className)}>
      <div className="min-w-0">
        {eyebrow ? <div className="mb-2 flex flex-wrap items-center gap-2">{eyebrow}</div> : null}
        <h1 className="text-[28px] leading-[1.1] font-extrabold tracking-[-0.02em] lg:text-[36px]">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-[15px] leading-6 text-ink-2">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}
