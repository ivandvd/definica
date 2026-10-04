"use client";

import { useEffect, useRef, type HTMLAttributes } from "react";
import { AppButton } from "../shared/AppButton";
import { AppLink } from "../shared/AppLink";
import { BaseVideoVimeoLoop, type VimeoVideo } from "../shared/BaseVideoVimeoLoop";
import type { CmsLink } from "../shared/content";
import { getDevice } from "../shared/device";
import { gsap } from "../shared/gsap";
import { useObserve } from "../shared/observe";
import { SanityPortableText, type PortableTextNode } from "../shared/SanityPortableText";
import { isLoopSceneName, LoopScene } from "./scenes/LoopScene";

export type VerticalCardVariant = "default" | "sliceJoinTeam" | "sliceMediasList" | "sliceToken";

/** A card's background colour, from the site palette (the stage cards' colours plus light green; see definica.css). */
export type CardTone = "sky" | "baby" | "lemonade" | "mint";
export const toneClass = (tone?: CardTone | null) => (tone ? `--tone-${tone}` : "");

export interface VerticalCardProps extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
  title?: string | null;
  text?: readonly PortableTextNode[] | null;
  /** Background colour; the parent list falls back to its neutral grey when unset. */
  tone?: CardTone | null;
  /** Declared by the original but never read. */
  animation?: string | null;
  /** Self-hosted loop (`BaseVideoLoop` in the original); not used by the home page, see the note below. */
  video?: { sources?: readonly unknown[] | null } | null;
  vimeo?: VimeoVideo | null;
  /** Animated scene shown instead of a video (see `scenes/LoopScene`); takes precedence over `vimeo`. */
  scene?: string | null;
  button?: CmsLink | null;
  link?: CmsLink | null;
  variant?: VerticalCardVariant;
  defaultButtonLabel?: string | null;
  /** CMS item fields that fall through to the root element as attributes, as in the original. */
  _key?: string | null;
  _type?: string | null;
}

/** Port of `AppLinkArrow` (scope data-v-e6eae962), only ever used here on this page. */
function AppLinkArrow({ className, title, to, openInNewTab }: CmsLink & { className?: string }) {
  return (
    <AppLink
      data-v-e6eae962=""
      data-v-eafce9c3=""
      title={title}
      to={to}
      openInNewTab={openInNewTab}
      className={`--fw-600 --mobile-text-14 --desktop-text-20 AppLinkArrow --hover-color-green${className ? ` ${className}` : ""}`}
    >
      {" → "}
      <span data-v-e6eae962="" className="--fw-700">
        {title}
      </span>
    </AppLink>
  );
}

/**
 * Port of `VerticalCard` (scope data-v-eafce9c3): text on one side, looping video on the other.
 * The card rises, scales up and fades in shortly before it scrolls into view.
 */
export function VerticalCard({
  title = null,
  text = null,
  tone = null,
  animation: _animation,
  video: _video = null,
  vimeo = null,
  scene = null,
  button = null,
  link = null,
  variant = "default",
  defaultButtonLabel = null,
  _key,
  _type,
  className,
  ...rest
}: VerticalCardProps) {
  const refEl = useRef<HTMLElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  // Port of `initEnterVerticalCard`: a paused timeline whose start values are applied right away.
  useEffect(() => {
    const el = refEl.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      timeline.current = gsap
        .timeline({ paused: true })
        .fromTo(el, { y: getDevice().desktop ? "40rem" : "20rem" }, { y: 0, ease: "power3.out", duration: 1.2 }, 0)
        .fromTo(el, { scale: 0.75 }, { scale: 1, ease: "power2.inOut", duration: 1.5 }, 0)
        .fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, ease: "power1.inOut", duration: 0.7 }, 0);
    });
    return () => {
      timeline.current = null;
      ctx.revert();
    };
  }, []);

  useObserve(refEl, { onEnter: () => timeline.current?.play(), offset: -400 });

  const itemAttrs: Record<string, string> = {};
  if (_key) itemAttrs._key = _key;
  if (_type) itemAttrs._type = _type;

  return (
    <article
      ref={refEl}
      data-v-eafce9c3=""
      {...itemAttrs}
      {...rest}
      // Kept stable: `useObserve` adds `--in-view` through classList.
      className={["VerticalCard", `--variant-${variant}`, toneClass(tone), className].filter(Boolean).join(" ")}
    >
      <div data-v-eafce9c3="" className="VerticalCard-content">
        {title ? (
          <h3
            data-v-eafce9c3=""
            className={`${variant === "sliceToken" ? "AppTitle-14" : "AppTitle-8"} VerticalCard-title AppTitle-8 --line-prewrap`}
          >
            {title}
          </h3>
        ) : null}
        {text ? (
          <div data-v-eafce9c3="" className="VerticalCard-text AppText-1 --c-grey1 --rich">
            <SanityPortableText blocks={text} />
          </div>
        ) : null}
        {button && button.to ? (
          <AppButton
            data-v-eafce9c3=""
            {...button}
            className="VerticalCard-button"
            label={button.title || defaultButtonLabel}
            theme={variant === "sliceMediasList" ? "grey" : "dark"}
          />
        ) : null}
        {link && link.to ? <AppLinkArrow {...link} className="VerticalCard-link" /> : null}
      </div>
      {/* The original falls back to `BaseVideoLoop` for `video.sources`; no card on this page uses it, so it is not ported. */}
      {isLoopSceneName(scene) ? (
        <LoopScene data-v-eafce9c3="" scene={scene} autoplay className="VerticalCard-asset" />
      ) : vimeo && vimeo.src ? (
        <BaseVideoVimeoLoop data-v-eafce9c3="" video={vimeo} autoplay className="VerticalCard-asset" />
      ) : null}
    </article>
  );
}
