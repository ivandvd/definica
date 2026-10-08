"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AppSvg } from "./AppSvg";
import { gsap } from "./gsap";
import { LottiePlayer, type LottiePlayerHandle } from "./LottiePlayer";
import { useObserve } from "./observe";
import { SplitTextBlock, type SplitTextBlockHandle, type SplitTextMainType } from "./SplitText";

export interface TitleWithIconProps {
  tag?: string;
  /** Extra classes for the title element. */
  classname?: string | null;
  title: string;
  /** Only its presence matters: `null` adds `--no-icon`; otherwise the "smile" svg is the fallback icon. */
  icon?: string | null;
  /** Lottie file shown inside the title. */
  iconFile?: { url?: string | null } | null;
  isSvg?: boolean;
  /** Colour class of the svg icon. */
  svgColor?: string;
  /** Index of the word the icon is inserted before. */
  iconPos?: number;
  /** Definica: where the icon goes on mobile (≤768px), when it differs from `iconPos`. */
  iconPosMobile?: number;
  delay?: number;
  hasTitleAnimation?: boolean;
  forceWrapBeforeIcon?: boolean;
  size?: "small" | "medium" | "large" | "xlarge";
  /** Inherited from the SplitText props by the original, which always overrides them; unused. */
  html?: string | null;
  /** Inherited from the SplitText props by the original, which always overrides them; unused. */
  type?: string;
  /** Inherited from the SplitText props by the original, which always overrides them; unused. */
  mainType?: SplitTextMainType;
  /** Inherited from the SplitText props by the original, which always overrides them; unused. */
  wrap?: boolean;
}

const ICON_WRAP = '<div class="iconWrap">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>';

/**
 * An icon wrap for one breakpoint (`desktopOnly` / `mobileOnly`, see definica.css), remembering its
 * word index. No hyphens: SplitTextBlock turns the first "-" of the markup into a non-breaking one.
 */
const iconWrapFor = (variant: string, pos: number) =>
  `<div class="iconWrap ${variant}" iconpos="${pos}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>`;

/** The icon wrap that is displayed at the current breakpoint. */
const visibleIconWrap = (root: Element | null) =>
  Array.from(root?.querySelectorAll(".iconWrap") ?? []).find((wrap) => getComputedStyle(wrap).display !== "none") ?? null;

/**
 * Port of `TitleWithIcon` (scope data-v-100b8b8e): a title split into lines/words that reveals
 * word by word when it enters the viewport, with an icon that pops in between two words.
 */
export function TitleWithIcon({
  tag = "h2",
  classname = null,
  title,
  icon = null,
  iconFile = null,
  isSvg = false,
  svgColor = "--bg-lemonade",
  iconPos = 0,
  iconPosMobile,
  delay = 0,
  hasTitleAnimation = true,
  forceWrapBeforeIcon = false,
  size = "large",
}: TitleWithIconProps) {
  const refSplitText = useRef<SplitTextBlockHandle>(null);
  const refEl = useRef<HTMLElement>(null);
  const refIcon = useRef<LottiePlayerHandle>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const entered = useRef(false);
  /** The `.iconWrap` created by the split; the icon is rendered into it. */
  const [iconWrap, setIconWrap] = useState<Element | null>(null);

  const iconUrl = iconFile?.url ?? null;

  const html = useMemo(() => {
    // Definica: a "\n" in the title is a line break on desktop (hidden on mobile, see definica.css).
    if (!iconUrl) return title.replace(/\n/g, '<br class="titleBreak">');
    // Definica: a "\n" in the title is a line break on desktop (hidden on mobile, see definica.css).
    const words = title.split(" ").map((word) => word.replace(/\n/g, '<br class="titleBreak">'));
    if (!forceWrapBeforeIcon && iconPos > 0) {
      // Definica: glue the icon to the word before it, so it never wraps onto a line of its own.
      // With a separate mobile position, both wraps are written and CSS shows one per breakpoint.
      const mobile = iconPosMobile && iconPosMobile > 0 && iconPosMobile !== iconPos ? iconPosMobile : null;
      const glue = (pos: number, wrap: string) => {
        const before = Math.min(pos, words.length) - 1;
        words[before] = `<span class="iconGlue">${words[before]} ${wrap}</span>`;
      };
      glue(iconPos, mobile ? iconWrapFor("desktopOnly", iconPos) : ICON_WRAP);
      if (mobile) glue(mobile, iconWrapFor("mobileOnly", mobile));
      return words.join(" ");
    }
    words.splice(iconPos, 0, forceWrapBeforeIcon ? `<br>${ICON_WRAP}` : ICON_WRAP);
    return words.join(" ");
  }, [title, iconUrl, iconPos, iconPosMobile, forceWrapBeforeIcon]);

  const latest = useRef({ iconPos, delay, hasTitleAnimation, isSvg });
  useEffect(() => {
    latest.current = { iconPos, delay, hasTitleAnimation, isSvg };
  });

  /** Port of `setTimeline`. */
  const buildTimeline = (wrapEl: Element | null) => {
    const el = refEl.current;
    const split = refSplitText.current;
    if (!el || !split) return;
    const { iconPos: defaultPos, delay: startDelay, hasTitleAnimation: animateTitle, isSvg: svg } = latest.current;
    // A breakpoint-specific wrap carries its own word index (see `iconWrapFor`).
    const pos = Number(wrapEl?.getAttribute("iconpos") ?? defaultPos);

    const tl = gsap.timeline({ paused: true, delay: startDelay });
    timeline.current = tl;
    gsap.set(el, { opacity: 1 });

    if (animateTitle) {
      const wrappers = el.querySelectorAll(".words-wrapper");
      tl.from(wrappers, { y: "120%", ease: "power3.out", stagger: 0.07, duration: 0.8 }, 0);
      tl.from(wrappers, { autoAlpha: 0, ease: "power1.inOut", stagger: 0.07, duration: 0.3 }, 0);
    }

    if (wrapEl) {
      const line = wrapEl.closest(".lines");
      // Words that follow the icon on its own line make room for it.
      const following = (split.getElements() ?? []).filter((word, index) => index >= pos && !!line?.contains(word));
      const width = wrapEl.getBoundingClientRect().width;
      tl.set(following, { x: -width }, 0)
        .from(
          wrapEl,
          { scale: 0, y: "20%", transformOrigin: "0% 50%", duration: 1, ease: "power2.inOut" },
          (pos < 2 ? 2 : pos) * 0.25,
        )
        .from(following, { x: -width, duration: 1.2, ease: "power2.inOut", stagger: -0.02 }, (pos < 2 ? 2 : pos) * 0.2);
      if (!svg) tl.add(() => refIcon.current?.play(), pos < 2 ? 1 : pos * 0.4);
    }

    if (entered.current) tl.play();
  };
  const build = useRef(buildTimeline);
  useEffect(() => {
    build.current = buildTimeline;
  });

  const killTimeline = () => {
    timeline.current?.revert();
    timeline.current = null;
  };

  /** Port of the `split` handler: the icon moves into the (displayed) `.iconWrap` of the split markup. */
  const handleSplit = () => {
    setIconWrap(iconUrl ? visibleIconWrap(refEl.current) : null);
  };

  // Port of `onMounted`; re-runs when the markup changes (the original bumps a key).
  useLayoutEffect(() => {
    const split = refSplitText.current;
    const el = refEl.current;
    if (!split || !el) return;
    gsap.set(el, { opacity: 0 });
    // Definica: a "\n" break hidden at this breakpoint (see definica.css) is dropped before the
    // split, which would otherwise still start a new line there and strand a word on its own.
    el.querySelectorAll(".titleBreak").forEach((br) => {
      if (getComputedStyle(br).display === "none") br.remove();
    });
    split.split();
    // With an icon, the timeline is built once the icon has been rendered into its wrap (effect below).
    if (!iconUrl || !el.querySelector(".iconWrap")) buildTimeline(null);
    return () => {
      killTimeline();
      split.revert();
    };
  }, [html, iconUrl]);

  useLayoutEffect(() => {
    if (!iconWrap || !refEl.current?.contains(iconWrap)) return;
    build.current(iconWrap);
    return killTimeline;
  }, [iconWrap]);

  useObserve(refEl, {
    onEnter: () => {
      entered.current = true;
      timeline.current?.play();
    },
  });

  const className = useMemo(
    () =>
      ["TitleWithIcon", classname ?? "", `--size-${size}`, icon === null ? "--no-icon" : ""].filter(Boolean).join(" "),
    [classname, size, icon],
  );

  const iconNode =
    iconUrl && !isSvg ? (
      <LottiePlayer
        ref={refIcon}
        data-v-100b8b8e=""
        className="TitleWithIcon-icon"
        url={iconUrl}
        autoplay={false}
        loop
      />
    ) : icon ? (
      <AppSvg data-v-100b8b8e="" className={`${svgColor} TitleWithIcon-icon --svg`} name="smile" />
    ) : null;

  return (
    <>
      <SplitTextBlock
        key={html}
        ref={refSplitText}
        elRef={refEl}
        data-v-100b8b8e=""
        type="lines,words"
        mainType="words"
        wrap
        className={className}
        tag={tag}
        html={html}
        onSplit={handleSplit}
      />
      {iconNode && iconUrl && iconWrap ? createPortal(iconNode, iconWrap) : iconNode}
    </>
  );
}
