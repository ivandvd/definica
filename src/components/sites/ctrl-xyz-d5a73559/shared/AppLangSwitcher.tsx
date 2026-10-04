"use client";

import { useState, type HTMLAttributes } from "react";
import { AppLink } from "./AppLink";
import { AppSvg } from "./AppSvg";
import { ORIGIN } from "./content";

/** Locales the site is published in; add entries here (with their home page URL) when translations exist. */
const LOCALES = [{ code: "en", iso: "en-gb", name: "English" }] as const;

const CURRENT_LOCALE = "en";

type AppLangSwitcherProps = Omit<HTMLAttributes<HTMLDivElement>, "children">;

/**
 * Port of `AppLangSwitcher` (scope data-v-99bb7c1b): click-to-open dropdown listing every
 * locale but the current one. With a single locale it is just the language label, so the
 * footer keeps its column without offering an empty menu.
 */
export function AppLangSwitcher({ className, ...rest }: AppLangSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const current = LOCALES.find((locale) => locale.code === CURRENT_LOCALE);
  const others = LOCALES.filter((locale) => locale.code !== CURRENT_LOCALE);
  const hasMenu = others.length > 0;

  const classes = ["LangSwitcher --c-grey1", isOpen ? "--is-open" : "", className ?? ""].filter(Boolean).join(" ");

  return (
    <div data-v-99bb7c1b="" {...rest} className={classes}>
      <div data-v-99bb7c1b="" className="LangSwitcher-dropdownOverlay" onClick={() => setIsOpen(false)} />
      <div
        data-v-99bb7c1b=""
        className="LangSwitcher-button --c-grey1"
        onClick={hasMenu ? () => setIsOpen((open) => !open) : undefined}
      >
        {current?.name} {hasMenu ? <AppSvg data-v-99bb7c1b="" name="arrow-down" className="LangSwitcher-arrow" /> : null}
      </div>
      <div data-v-99bb7c1b="" className="LangSwitcher-dropdown">
        {others.map((locale) => (
          <AppLink
            key={locale.code}
            data-v-99bb7c1b=""
            className="LangSwitcher-item AppSmallText-1"
            to={`${ORIGIN}/${locale.code}`}
          >
            <span data-v-99bb7c1b="">{locale.name}</span>
          </AppLink>
        ))}
      </div>
    </div>
  );
}
