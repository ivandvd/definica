"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { AppButton } from "./AppButton";
import { AppLink } from "./AppLink";
import { AppSvg } from "./AppSvg";
import { settings, type CmsLink } from "./content";
import { getDevice } from "./device";
import { gsap } from "./gsap";
import { useObserve } from "./observe";
import { smoothScroll, type ScrollState } from "./smooth-scroll";

const header: { links?: CmsLink[]; download?: CmsLink } = settings.header;

/**
 * Port of `AppHeader` (scope data-v-d5c9479a): the hit-zone strip plus the fixed header.
 * - intro timeline played when the hit-zone enters the viewport (i.e. once the page loader releases the observers)
 * - `--is-hidden` while scrolling down past half a viewport, unless the pointer is over the hit-zone / nav
 * - sliding `Header-navBg` pill behind the hovered nav item (fine pointers only)
 * - mobile burger menu with its GSAP open/close timelines
 */
export function AppHeader() {
  const refEl = useRef<HTMLElement>(null);
  const refHitzone = useRef<HTMLDivElement>(null);
  const refNav = useRef<HTMLElement>(null);
  const refNavBg = useRef<HTMLDivElement>(null);

  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  /** Original `se`: pointer is over the hit-zone or the nav. */
  const isHovered = useRef(false);
  /** Original `ne`: the nav background pill is currently shown. */
  const isNavBgVisible = useRef(false);
  const introTimeline = useRef<gsap.core.Timeline | null>(null);

  // Intro timeline (paused; its fromTo tweens render immediately, hiding the header until played).
  useEffect(() => {
    const el = refEl.current;
    if (!el) return;
    const timeline = gsap
      .timeline({ paused: true })
      .fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, ease: "none", duration: 0.5 }, 0.5)
      .fromTo(el, { y: "-10rem" }, { y: 0, ease: "power3.out", duration: 1.2, clearProps: "all" }, 0.5);
    introTimeline.current = timeline;
    return () => {
      timeline.kill();
      introTimeline.current = null;
    };
  }, []);

  useObserve(refHitzone, { onEnter: () => introTimeline.current?.play() });

  // Hide on scroll down / show on scroll up; any scroll closes the mobile nav. Unlike the original,
  // this applies on mobile too, and hides the logo and Launch App as well (see definica.css).
  useEffect(() => {
    const onScroll = ({ value, direction }: ScrollState) => {
      setIsNavOpen(false);
      const half = window.innerHeight / 2;
      if (value < half) setIsHidden(false);
      else setIsHidden(direction === "down" && !isHovered.current);
    };
    smoothScroll.on("scroll", onScroll);
    return () => smoothScroll.off("scroll", onScroll);
  }, []);

  // Mobile menu open / close animation (original `watch(isNavOpen)`: runs on change only).
  const previousNavOpen = useRef(isNavOpen);
  useEffect(() => {
    if (previousNavOpen.current === isNavOpen) return;
    previousNavOpen.current = isNavOpen;
    const el = refEl.current;
    if (!el || !getDevice().mobile) return;
    const list = el.querySelectorAll(".Header-navList");
    const items = el.querySelectorAll(".Header-navListItem");
    if (isNavOpen) {
      gsap
        .timeline()
        .fromTo(list, { y: "-120%" }, { y: "0", duration: 0.8, ease: "power3.out" }, 0)
        .fromTo(items, { y: "30rem" }, { y: "0rem", duration: 0.7, stagger: 0.04, ease: "power3.out" }, 0.1)
        .fromTo(items, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, stagger: 0.04, ease: "none" }, 0.1);
    } else {
      gsap
        .timeline()
        .to(list, { y: "-120%", duration: 0.6, ease: "power3.inOut" }, 0)
        .to(items, { y: "30rem", duration: 0.6, ease: "power3.inOut" }, 0)
        .to(items, { autoAlpha: 0, duration: 0.3, ease: "none" }, 0);
    }
  }, [isNavOpen]);

  const onZoneEnter = useCallback(() => {
    if (getDevice().mouse) isHovered.current = true;
  }, []);

  const onZoneLeave = useCallback(() => {
    if (!getDevice().mouse) return;
    isHovered.current = false;
    const bg = refNavBg.current;
    if (!bg) return;
    const rect = bg.getBoundingClientRect();
    gsap.to(bg, { width: "0", scaleY: 0.5, x: "+=" + rect.width / 2, ease: "power2.inOut", duration: 0.4 });
    gsap.to(bg, { autoAlpha: 0, ease: "power1.inOut", duration: 0.2, delay: 0.1 });
    isNavBgVisible.current = false;
  }, []);

  const onItemEnter = useCallback((event: MouseEvent<HTMLLIElement>) => {
    if (!getDevice().mouse) return;
    const bg = refNavBg.current;
    const nav = refNav.current;
    if (!bg || !nav) return;
    const item = event.currentTarget.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    if (isNavBgVisible.current) {
      gsap.to(bg, { scaleY: 1, x: item.left - navRect.left + item.width / 2, ease: "power2.inOut", duration: 0.5 });
    } else {
      gsap.set(bg, { y: "0rem", scaleY: 0.5 });
      gsap.set(bg, { x: item.left - navRect.left + item.width / 2 });
    }
    gsap.to(bg, {
      width: item.width * 0.85,
      scaleY: 1,
      y: 0,
      x: item.left - navRect.left,
      ease: "power3.out",
      duration: 0.5,
    });
    gsap.to(bg, { autoAlpha: 1, ease: "power1.inOut", duration: 0.1 });
    isNavBgVisible.current = true;
  }, []);

  const headerClass = ["Header", isNavOpen ? "--is-nav-open" : "", isHidden ? "--is-hidden" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div
        ref={refHitzone}
        className="Header-hitzone"
        data-v-d5c9479a=""
        onMouseEnter={onZoneEnter}
        onMouseLeave={onZoneLeave}
      />
      <header ref={refEl} className={headerClass} data-v-d5c9479a="">
        <div className="Header-overlay" data-v-d5c9479a="" onClick={() => setIsNavOpen(false)} />
        <div className="Header-wrapper AppWrapper-1600" data-v-d5c9479a="">
          <div className="Header-logoWrap" data-v-d5c9479a="">
            <AppLink
              to={{ path: "/" }}
              aria-current="page"
              aria-label="Go back home"
              className="nuxt-link-active router-link-exact-active Header-logo"
              data-v-d5c9479a=""
            >
              <AppSvg name="definica-logo" className="Header-logoIcon" data-v-d5c9479a="" />
            </AppLink>
            <nav
              ref={refNav}
              className="Header-nav"
              data-v-d5c9479a=""
              onMouseEnter={onZoneEnter}
              onMouseLeave={onZoneLeave}
            >
              <div ref={refNavBg} className="Header-navBg" data-v-d5c9479a="" />
              {header.links ? (
                <ul className="Header-navList" data-v-d5c9479a="">
                  {header.links.map((link, index) => (
                    <li key={index} className="Header-navListItem" data-v-d5c9479a="" onMouseEnter={onItemEnter}>
                      <AppLink {...link} className="Header-navListItemLink --text-15 --fw-600" data-v-d5c9479a="">
                        <span data-v-d5c9479a="">{link.title}</span>
                      </AppLink>
                    </li>
                  ))}
                </ul>
              ) : null}
            </nav>
            <button
              aria-label="Open nav"
              className="Header-burger"
              data-v-d5c9479a=""
              onClick={() => setIsNavOpen((open) => !open)}
            >
              <div className="Header-burgerIcon" data-v-d5c9479a="">
                <div className="Header-burgerOpen" data-v-d5c9479a="">
                  <span data-v-d5c9479a="" />
                  <span data-v-d5c9479a="" />
                  <span data-v-d5c9479a="" />
                </div>
                <div className="Header-burgerClose" data-v-d5c9479a="">
                  <span data-v-d5c9479a="" />
                  <span data-v-d5c9479a="" />
                </div>
              </div>
            </button>
          </div>
          {header.download ? (
            <AppButton
              size="small"
              className="Header-download"
              data-v-d5c9479a=""
              {...header.download}
              label={header.download.title}
            />
          ) : null}
        </div>
      </header>
    </>
  );
}
