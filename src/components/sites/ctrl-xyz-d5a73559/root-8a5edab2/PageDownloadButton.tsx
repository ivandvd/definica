"use client";

import { useEffect, useRef } from "react";
import { AppLink } from "../shared/AppLink";
import { AppSvg } from "../shared/AppSvg";
import { settings } from "../shared/content";
import { getDevice, useDevice } from "../shared/device";
import { gsap } from "../shared/gsap";
import { useObserve } from "../shared/observe";
import { smoothScroll, type ScrollState } from "../shared/smooth-scroll";

/**
 * Port of the download-target detection shared by `PageDownloadButton` and
 * `MobileDownloadButton`: OS match first, then browser match, else the default link.
 * Links are passed through exactly as the settings data has them.
 */
export function useDownloadTarget() {
  const { os, browser } = useDevice();
  const { downloadLink } = settings;
  const detected =
    downloadLink.detect.os.find((item) => item.value === os) ??
    downloadLink.detect.browsers.find((item) => item.value === browser) ??
    null;
  const link = detected && detected.link && detected.link.to ? detected.link : downloadLink.link;
  const label = detected
    ? downloadLink.buttonLabelFor.replace("[value]", detected.name || detected.value)
    : downloadLink.buttonLabel;
  return { link, label };
}

/** Scroll distance (px) from either end of the page within which the button is "docked". */
const EDGE = 3;

interface PageDownloadButtonProps {
  isHome?: boolean;
}

interface ButtonAnimations {
  expand: (options?: { delay: number }) => void;
  collapse: () => void;
}

/**
 * Port of `PageDownloadButton` (scope data-v-1d492dfd): fixed pill that sits under the
 * hero title at the top of the page, shrinks to its icon and docks to the bottom of the
 * viewport while scrolling, and expands again above the footer.
 */
export function PageDownloadButton({ isHome = false }: PageDownloadButtonProps) {
  const { link, label } = useDownloadTarget();
  const { downloadLink } = settings;

  const elRef = useRef<HTMLDivElement>(null);
  const vwRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const introRef = useRef<gsap.core.Timeline | null>(null);
  const animationsRef = useRef<ButtonAnimations | null>(null);
  const scrolledRef = useRef(false);

  useEffect(() => {
    const el = elRef.current;
    const button = buttonRef.current;
    if (!el || !button) return;

    let shapeTl: gsap.core.Timeline | null = null;
    let moveTl: gsap.core.Timeline | null = null;

    const labelSpans = () => labelRef.current?.querySelectorAll("span") ?? [];

    const topPosition = () => {
      const helperTop = document.querySelector(".HomeHero-posTitleHelper")?.getBoundingClientRect().top ?? 0;
      if (!isHome) return helperTop;
      const titleHeight = document.querySelector(".HomeHero-title")?.getBoundingClientRect().height ?? 0;
      return helperTop + titleHeight + ((getDevice().desktop ? 80 : 180) * window.innerWidth) / 1920;
    };
    const footerPosition = () =>
      document.querySelector(".Footer-posButtonHelper")?.getBoundingClientRect().top ?? 0;
    const viewportBottomPosition = () =>
      (vwRef.current?.getBoundingClientRect().height ?? 0) - button.getBoundingClientRect().height - 20;

    /** Shrink to the icon-only pill. */
    const collapse = () => {
      const icon = el.querySelector(".PageDownloadButton-buttonIcon")?.getBoundingClientRect();
      const inner = el.querySelector(".PageDownloadButton-inner")?.getBoundingClientRect();
      shapeTl?.kill();
      shapeTl = gsap
        .timeline()
        .to(labelSpans(), { y: "-7rem", duration: 0.5, ease: "power3.out" }, 0)
        .to(
          iconRef.current,
          {
            x: window.innerWidth / 2 - (inner?.left ?? 0) - (icon?.width ?? 0) / 2,
            duration: 0.5,
            ease: "power3.inOut",
          },
          0,
        )
        .to(bgRef.current, { x: "-50%", y: "-50%", width: "11rem", duration: 0.8, ease: "power3.inOut" }, 0);
    };

    /** Grow back to the full pill with its label. */
    const expand = ({ delay }: { delay: number } = { delay: 0 }) => {
      shapeTl?.kill();
      shapeTl = gsap
        .timeline({ delay })
        .fromTo(
          labelSpans(),
          { y: "10rem", x: 0, autoAlpha: 0 },
          { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" },
          0,
        )
        .to(iconRef.current, { x: 0, duration: 0.6, ease: "power3.out", stagger: 0.05 }, 0)
        .to(bgRef.current, { x: "-50%", y: "-50%", width: "100%", duration: 0.7, ease: "power3.out" }, 0);
    };

    const onScroll = ({ value }: ScrollState) => {
      const max = smoothScroll.bounds - EDGE;
      if (value >= EDGE && value <= max && !scrolledRef.current) {
        scrolledRef.current = true;
        moveTl?.kill();
        moveTl = gsap.timeline().to(button, { y: () => viewportBottomPosition(), duration: 0.8, ease: "power2.inOut" });
        collapse();
      } else if ((value < EDGE || value > max) && scrolledRef.current) {
        scrolledRef.current = false;
        moveTl?.kill();
        moveTl = gsap.timeline().to(button, {
          y: value < EDGE ? topPosition() : footerPosition(),
          duration: 0.8,
          ease: "power2.inOut",
        });
        if (isHome) expand({ delay: 0.5 });
        else if (value > max) expand({ delay: 0.5 });
      }
    };

    animationsRef.current = { expand, collapse };
    scrolledRef.current = false;

    gsap.set(button, { y: () => topPosition() });
    collapse();
    const intro = gsap
      .timeline({ paused: true })
      .fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, ease: "power1.inOut", duration: 0.4 }, 0.85);
    if (isHome) intro.add(() => expand(), 0.85);
    introRef.current = intro;

    const timeout = window.setTimeout(() => {
      smoothScroll.on("scroll", onScroll);
      collapse();
    }, 200);

    return () => {
      window.clearTimeout(timeout);
      smoothScroll.off("scroll", onScroll);
      intro.kill();
      shapeTl?.kill();
      moveTl?.kill();
      introRef.current = null;
      animationsRef.current = null;
    };
  }, [isHome]);

  useObserve(elRef, { onEnter: () => introRef.current?.play() });

  const onMouseEnter = () => {
    if (getDevice().touch || (!scrolledRef.current && isHome)) return;
    animationsRef.current?.expand();
  };
  const onMouseLeave = () => {
    if (getDevice().touch || (!scrolledRef.current && isHome)) return;
    animationsRef.current?.collapse();
  };

  if (!downloadLink || !downloadLink.link || !downloadLink.buttonLabelFor) return null;

  return (
    <div ref={elRef} data-v-1d492dfd="" data-v-11ce35e1="" className="PageDownloadButton">
      <div ref={vwRef} data-v-1d492dfd="" className="PageDownloadButton-vwHelper" />
      <AppLink
        data-v-1d492dfd=""
        {...link}
        ref={buttonRef}
        className="PageDownloadButton-button ButtonHover"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div ref={bgRef} data-v-1d492dfd="" className="PageDownloadButton-bg" />
        <div data-v-1d492dfd="" className="PageDownloadButton-inner">
          <AppSvg ref={iconRef} data-v-1d492dfd="" name="download" className="PageDownloadButton-buttonIcon" />
          <div
            ref={labelRef}
            data-v-1d492dfd=""
            className="PageDownloadButton-buttonLabel --desktop-text-20 --mobile-text-16 --fw-600"
          >
            <span data-v-1d492dfd="">{label}</span>
          </div>
        </div>
      </AppLink>
    </div>
  );
}
