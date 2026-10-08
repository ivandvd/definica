"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { openConsentSettings } from "@/lib/consent";
import { AppFooterTitles } from "./AppFooterTitles";
import { AppLangSwitcher } from "./AppLangSwitcher";
import { AppLink } from "./AppLink";
import { AppNewsletter } from "./AppNewsletter";
import { AppSvg } from "./AppSvg";
import { settings, type CmsLink } from "./content";
import type { IconName } from "./icons";
import { StickersEffect } from "./StickersEffect";

const footer: {
  titles?: string[] | null;
  linksList?: { title?: string | null; links?: CmsLink[] | null }[] | null;
  secondsLinks?: CmsLink[] | null;
} = settings.footer;
const socials = settings.socials as { links: { icon: IconName; link: CmsLink }[] };
const locales = settings.locales;

// `<ClientOnly>`: false on the server and during hydration, true afterwards.
const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Port of `AppFooter` (scope data-v-b3bc0079): sticker trail, newsletter, animated titles,
 * socials, link columns, language switcher and legal links.
 * The sticker trail is paused while the pointer is over any of the link groups.
 */
export function AppFooter() {
  const isClient = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const [isStickersActive, setIsStickersActive] = useState(true);

  const pauseStickers = useCallback(() => setIsStickersActive(false), []);
  const resumeStickers = useCallback(() => setIsStickersActive(true), []);

  return (
    <footer className="Footer" data-v-b3bc0079="">
      <StickersEffect data-v-b3bc0079="" isActive={isStickersActive} />
      <AppNewsletter data-v-b3bc0079="" />
      <div className="Footer-bottom" data-v-b3bc0079="">
        <div className="Footer-wrapper AppWrapper-1600" data-v-b3bc0079="">
          <div data-v-b3bc0079="">
            {footer.titles && footer.titles.length > 0 ? (
              <AppFooterTitles data-v-b3bc0079="" titles={footer.titles} />
            ) : null}
          </div>
          <div className="Footer-cols" data-v-b3bc0079="">
            <div
              className="Footer-socials"
              data-v-b3bc0079=""
              onMouseEnter={pauseStickers}
              onMouseLeave={resumeStickers}
            >
              {socials.links.map((social, index) => (
                <AppLink key={index} {...social.link} className="Footer-socialsItem" data-v-b3bc0079="">
                  <AppSvg
                    name={social.icon}
                    title={social.icon}
                    className={`Footer-socialsItemIcon --${social.icon} --themed-fill`}
                    data-v-b3bc0079=""
                  />
                </AppLink>
              ))}
            </div>
            <div className="Footer-links" data-v-b3bc0079="" onMouseEnter={pauseStickers} onMouseLeave={resumeStickers}>
              {footer.linksList?.map((list, index) => (
                <nav key={index} className="Footer-linksList" data-v-b3bc0079="">
                  <span className="Footer-linksListTitle --text-20" data-v-b3bc0079="">
                    {list.title}
                  </span>
                  {list.links?.map((link, linkIndex) => (
                    <AppLink
                      key={linkIndex}
                      {...link}
                      className="Footer-linksListItem --desktop-text-16 --mobile-text-12 --c-grey1"
                      data-v-b3bc0079=""
                    >
                      {link.title}
                    </AppLink>
                  ))}
                </nav>
              ))}
              {isClient ? <AppLangSwitcher className="Footer-linksList" data-v-b3bc0079="" /> : <span />}
            </div>
          </div>
          <div className="Footer-posButtonHelper" data-v-b3bc0079="" />
          <ul
            className="Footer-secondLinks"
            data-v-b3bc0079=""
            onMouseEnter={pauseStickers}
            onMouseLeave={resumeStickers}
          >
            {footer.secondsLinks?.map((link, index) => (
              <li key={index} data-v-b3bc0079="">
                <AppLink {...link} className="Footer-secondLinksItem --c-grey1 --text-12" data-v-b3bc0079="">
                  {link.title}
                </AppLink>
              </li>
            ))}
            <li data-v-b3bc0079="">
              {/* Reopens the cookie banner (CookieBanner). */}
              <button
                type="button"
                className="Footer-secondLinksItem Footer-secondLinksButton --c-grey1 --text-12"
                data-v-b3bc0079=""
                onClick={openConsentSettings}
              >
                {locales.cookies}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
