"use client";

import type { Ref } from "react";
import { AppButton } from "../AppButton";
import type { PageButton } from "./content";

/** A row of calls to action (the site's small buttons): dark first, the outlined one after. */
export function Buttons({ buttons, className, ref }: { buttons: PageButton[]; className?: string; ref?: Ref<HTMLDivElement> }) {
  return (
    <div ref={ref} className={className}>
      {buttons.map(({ theme, ...link }) => (
        <AppButton key={link.title} {...link} label={link.title} size="small" theme={theme === "dark" ? "dark" : "border-light"} />
      ))}
    </div>
  );
}
