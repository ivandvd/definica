"use client";

import { useEffect, useRef } from "react";
import { AppSvg } from "../shared/AppSvg";
import { getDevice, useDevice } from "../shared/device";
import { gsap } from "../shared/gsap";
import { useObserve } from "../shared/observe";
import { MobileDownloadButton } from "../shared/MobileDownloadButton";

interface HomeHeroProps {
  surtitle?: string | null;
  title?: string | null;
}

/**
 * Port of `HomeHero` (scope data-v-cca44647): "Take [logo] Ctrl." title whose intro is
 * drawn by a travelling dot, and which scales/fades out over the first half viewport of scroll.
 */
export function HomeHero({ surtitle = null, title = null }: HomeHeroProps) {
  const { desktop } = useDevice();

  const elRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const surtitleRef = useRef<HTMLHeadingElement>(null);
  const mainTitleWrapRef = useRef<HTMLDivElement>(null);
  const mainTitleRef = useRef<HTMLHeadingElement>(null);
  const mainTitleLeftRef = useRef<HTMLSpanElement>(null);
  const mainTitleRightRef = useRef<HTMLSpanElement>(null);
  const logoRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<gsap.core.Timeline | null>(null);

  const words = title?.split(" ") ?? [];

  useEffect(() => {
    const el = elRef.current;
    const mainTitle = mainTitleRef.current;
    const logo = logoRef.current;
    const dot = dotRef.current;
    if (!el || !mainTitle || !logo || !dot) return;

    const dotLeft = () => parseInt(window.getComputedStyle(dot, null).getPropertyValue("left"));
    const dotInlineLeft = () => parseFloat(dot.style.left) || 0;

    const ctx = gsap.context(() => {
      const { desktop: isDesktop, mobile: isMobile } = getDevice();

      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".HomeHero-sticky",
            scrub: 1,
            start: "top top",
            end: "+=" + window.innerHeight / 2,
          },
        })
        .to(mainTitleWrapRef.current, { scale: 0.8, x: 0, autoAlpha: 0, ease: "power1.inOut" }, 0)
        .to(titleRef.current, { autoAlpha: 0, ease: "power2.inOut", duration: 0.5 }, 0);

      const left = dotLeft();
      const appScreens = document.querySelector(".SliceScrollableAppScreens-wrapper");

      const intro = gsap
        .timeline({ paused: true })
        .set(mainTitleLeftRef.current, { x: isMobile ? "3rem" : "8rem", autoAlpha: 1 }, 0)
        .set(mainTitleRightRef.current, { x: isMobile ? "-3rem" : "-8rem", autoAlpha: 1 }, 0)
        .to(dot, { autoAlpha: 1, duration: 0.2, ease: "power1.inOut" }, 0)
        .fromTo(
          surtitleRef.current,
          { y: isDesktop ? "20rem" : "10rem" },
          { y: 0, ease: "power3.out", duration: 1.2 },
          0,
        )
        .fromTo(surtitleRef.current, { autoAlpha: 0 }, { autoAlpha: 1, ease: "power1.inOut", duration: 0.7 }, 0);
      if (appScreens) intro.from(appScreens, { y: "20vh", autoAlpha: 0, ease: "power3.out", duration: 1.2 }, 1);
      intro
        .fromTo(
          mainTitle,
          { clipPath: "inset(-50% 100% -50% 0%)" },
          { clipPath: "inset(-50% 0% -50% 0%)", duration: 0.8, ease: "power2.inOut" },
          0.2,
        )
        .fromTo(
          dot,
          { x: 0 },
          {
            x: mainTitle.getBoundingClientRect().width - logo.getBoundingClientRect().width - left / 2,
            duration: 1,
            ease: "back.inOut",
          },
          0,
        )
        .to(mainTitleLeftRef.current, { x: 0, ease: "power2.inOut", duration: 0.7 }, 1.3)
        .to(mainTitleRightRef.current, { x: 0, ease: "power2.inOut", duration: 0.7 }, 1.3)
        .from(logo, { autoAlpha: 0, ease: "none", duration: 0.25 }, 1.62)
        .from(logo, { scale: 0.7, y: "3rem", ease: "power3.out", duration: 0.8 }, 1.62)
        .to(mainTitle, { clipPath: "inset(-50% -20% -50% 00%)", duration: 0.8, ease: "power2.inOut" }, 1.3)
        .to(
          dot,
          {
            x: mainTitle.getBoundingClientRect().width - dotInlineLeft() - left,
            duration: 1,
            ease: "back.inOut",
          },
          1.2,
        );
      introRef.current = intro;
    });

    // Port of `useResizeObserver(refEl, onResize)`: keeps the dot at the end of the title.
    const resizeObserver = new ResizeObserver(() => {
      gsap.set(dot, { x: mainTitle.getBoundingClientRect().width - dotInlineLeft() - dotLeft() });
    });
    resizeObserver.observe(el);

    return () => {
      resizeObserver.disconnect();
      introRef.current = null;
      ctx.revert();
    };
  }, []);

  useObserve(elRef, { onEnter: () => introRef.current?.play() });

  return (
    <section ref={elRef} data-v-11ce35e1="" data-v-cca44647="" className="HomeHero">
      <div data-v-cca44647="" className="HomeHero-posTitleHelper" />
      <div data-v-cca44647="" className="HomeHero-sticky">
        <div ref={titleRef} data-v-cca44647="" className="HomeHero-title">
          <h2 ref={surtitleRef} data-v-cca44647="" className="HomeHero-titleUp AppSurtitle-1 --line-prewrap">
            {surtitle}
          </h2>
          <div ref={mainTitleWrapRef} data-v-cca44647="" className="HomeHero-titleMain">
            {title ? (
              <h1 ref={mainTitleRef} data-v-cca44647="" className="HomeHero-titleMainInner AppTitle-1">
                <div data-v-cca44647="" className="HomeHero-titleMainItem">
                  <span ref={mainTitleLeftRef} data-v-cca44647="">
                    {words[0]}
                  </span>
                </div>
                <AppSvg ref={logoRef} data-v-cca44647="" name="ctrl-logo-small" />
                <div data-v-cca44647="" className="HomeHero-titleMainItem">
                  <span ref={mainTitleRightRef} data-v-cca44647="">
                    {(words[1] ?? "") + " "}
                    {words[2] ? words[2] : null}
                  </span>
                </div>
              </h1>
            ) : null}
            <div ref={dotRef} data-v-cca44647="" className="FooterTitles-dot AppTitle-1">
              {" . "}
            </div>
          </div>
          <div data-v-cca44647="" className="HomeHero-mobileDownload --tac">
            {desktop ? null : <MobileDownloadButton data-v-cca44647="" />}
          </div>
        </div>
      </div>
    </section>
  );
}
