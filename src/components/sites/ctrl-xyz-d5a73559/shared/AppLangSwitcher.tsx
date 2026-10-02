"use client";

import { useState, type HTMLAttributes } from "react";
import { AppLink } from "./AppLink";
import { AppSvg } from "./AppSvg";
import { ORIGIN } from "./content";

/** The original i18n config (`normalizedLocales`). */
const LOCALES = [
  { code: "en", iso: "en-gb", name: "English" },
  { code: "fr", iso: "fr-fr", name: "French" },
  { code: "de", iso: "de", name: "Deutsch" },
  { code: "es", iso: "es", name: "Español" },
  { code: "pt", iso: "pt-br", name: "Portuguese" },
  { code: "zh-hans", iso: "zh-hans", name: "简体中文" },
  { code: "ru", iso: "ru", name: "Русский" },
  { code: "vi", iso: "vi", name: "Tiếng Việt" },
  { code: "tr", iso: "tr", name: "Türkçe" },
] as const;

/** Only the English home page exists in the clone. */
const CURRENT_LOCALE = "en";

type AppLangSwitcherProps = Omit<HTMLAttributes<HTMLDivElement>, "children">;

/**
 * Port of `AppLangSwitcher` (scope data-v-99bb7c1b): click-to-open dropdown listing every
 * locale but the current one. The other locales are not part of the clone, so their
 * links point at the original site's localized home page.
 */
export function AppLangSwitcher({ className, ...rest }: AppLangSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const current = LOCALES.find((locale) => locale.code === CURRENT_LOCALE);
  const others = LOCALES.filter((locale) => locale.code !== CURRENT_LOCALE);

  const classes = ["LangSwitcher --c-grey1", isOpen ? "--is-open" : "", className ?? ""].filter(Boolean).join(" ");

  return (
    <div data-v-99bb7c1b="" {...rest} className={classes}>
      <div data-v-99bb7c1b="" className="LangSwitcher-dropdownOverlay" onClick={() => setIsOpen(false)} />
      <div data-v-99bb7c1b="" className="LangSwitcher-button --c-grey1" onClick={() => setIsOpen((open) => !open)}>
        {current?.name} <AppSvg data-v-99bb7c1b="" name="arrow-down" className="LangSwitcher-arrow" />
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
