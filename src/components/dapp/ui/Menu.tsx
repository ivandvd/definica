"use client";

import { Menu } from "@base-ui/react/menu";
import { MoreVertical } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface MenuAction {
  label: string;
  icon?: ReactNode;
  /** A route to open, or a function to call. */
  href?: string;
  onSelect?: () => void;
  disabled?: boolean;
  tone?: "default" | "danger";
}

const itemClass =
  "flex w-full cursor-pointer items-center gap-3 rounded-[9px] px-3 py-2.5 text-sm font-medium text-ink outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-40 data-[highlighted]:bg-canvas [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-ink-3";

/** The walkthrough's kebab: a small menu of what can be done with a row. */
export function KebabMenu({ label, actions, className }: { label: string; actions: MenuAction[]; className?: string }) {
  return (
    <Menu.Root>
      <Menu.Trigger
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-canvas hover:text-ink data-[popup-open]:bg-canvas data-[popup-open]:text-ink",
          className,
        )}
        aria-label={label}
      >
        <MoreVertical className="size-4" aria-hidden="true" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={6} align="end" className="z-50">
          <Menu.Popup className="min-w-[200px] rounded-[16px] bg-card p-1.5 shadow-pop outline-none transition-[opacity,scale] duration-150 data-[ending-style]:scale-[0.97] data-[ending-style]:opacity-0 data-[starting-style]:scale-[0.97] data-[starting-style]:opacity-0">
            {actions.map((action) =>
              action.href ? (
                <Menu.Item key={action.label} disabled={action.disabled} className={cn(itemClass, action.tone === "danger" && "text-red [&_svg]:text-red")} render={<Link href={action.href} />}>
                  {action.icon}
                  {action.label}
                </Menu.Item>
              ) : (
                <Menu.Item key={action.label} disabled={action.disabled} onClick={action.onSelect} className={cn(itemClass, action.tone === "danger" && "text-red [&_svg]:text-red")}>
                  {action.icon}
                  {action.label}
                </Menu.Item>
              ),
            )}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

export const menuItemClass = itemClass;
