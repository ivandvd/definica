"use client";

import { useEffect, useRef, useState } from "react";
import { AppSvg } from "../shared/AppSvg";
import {
  BaseVideoVimeoLoop,
  type BaseVideoVimeoLoopHandle,
  type VimeoVideo,
} from "../shared/BaseVideoVimeoLoop";
import { getDevice } from "../shared/device";
import { CustomEase, gsap } from "../shared/gsap";
import { icons, type IconName } from "../shared/icons";
import { LottiePlayer } from "../shared/LottiePlayer";
import { smoothScroll } from "../shared/smooth-scroll";

export interface SliceScrollableAppScreensItem {
  title?: string | null;
  tag?: string | null;
  titleIcon?: string | null;
  text?: string | null;
  iconFile?: { url?: string | null } | null;
  vimeo?: VimeoVideo | null;
  /** Non-Vimeo fallback of the original (`VideoLoop` with `sources`); unused by the page data. */
  video?: { sources?: unknown[] } | null;
}

export interface SliceScrollableAppScreensProps {
  vimeo?: VimeoVideo | null;
  /** Non-Vimeo fallback of the original (`VideoLoop` with `sources`); unused by the page data. */
  video?: { sources?: unknown[] } | null;
  items?: SliceScrollableAppScreensItem[];
  /** Falls through to the root as the `sliceid` attribute, as on the original. */
  sliceId?: string;
  /** Present in the slice data; not rendered. */
  componentName?: string;
  /** Parent (`Slices`) classes, appended after the component's own class. */
  className?: string;
  /** Parent scope attribute. */
  "data-v-fc0f272b"?: string;
}

const APP_ITEM_EASE =
  "M0,0 C0.126,0.024 0.189,0.117 0.261,0.207 0.336,0.301 0.347,0.357 0.422,0.5 0.479,0.609 0.555,0.824 0.661,0.916 0.734,0.98 0.869,1 1,1 ";

const isIconName = (name: string | null | undefined): name is IconName => !!name && name in icons;

/**
 * Port of `SliceScrollableAppScreens` (scope data-v-c86fbc86): a pinned phone mock-up whose
 * screens, titles and side texts are swapped by a paused timeline that the scroll position
 * scrubs over ~3.5 viewports.
 */
export function SliceScrollableAppScreens({
  vimeo = null,
  items = [],
  sliceId,
  className,
  "data-v-fc0f272b": parentScope,
}: SliceScrollableAppScreensProps) {
  const elRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const appMainRef = useRef<HTMLDivElement>(null);
  const appMainVideoRef = useRef<BaseVideoVimeoLoopHandle>(null);
  const appItemVideoRefs = useRef<(BaseVideoVimeoLoopHandle | null)[]>([]);
  // Port of `lottieKey`: bumped when the scroll timeline starts, which re-creates the lottie players.
  const [lottieKey, setLottieKey] = useState(0);

  const lottieCount = items.filter((item) => item.iconFile?.url).length;
  const lottieCountRef = useRef(lottieCount);
  useEffect(() => {
    lottieCountRef.current = lottieCount;
  });

  useEffect(() => {
    const el = elRef.current;
    const sticky = stickyRef.current;
    const appMain = appMainRef.current;
    if (!el || !sticky || !appMain) return;

    const y = smoothScroll.y;
    const { desktop } = getDevice();
    const titleBoxes = el.querySelectorAll<HTMLElement>(".SliceScrollableAppScreens-box.--is-title");
    const textBoxes = el.querySelectorAll<HTMLElement>(".SliceScrollableAppScreens-box.--is-text");
    const boxTitles = el.querySelectorAll<HTMLElement>(".SliceScrollableAppScreens-boxTitle");
    const boxTags = el.querySelectorAll<HTMLElement>(".SliceScrollableAppScreens-boxTag");
    const appItems = el.querySelectorAll<HTMLElement>(".SliceScrollableAppScreens-appItem");
    // Vue's `ref_for` array only holds the videos that were actually rendered.
    const itemVideo = (index: number) => appItemVideoRefs.current.filter((v) => v !== null)[index];

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });

      const initAppItems = (_start: number, offset: number) => {
        const ease = CustomEase.create("custom", APP_ITEM_EASE);
        gsap.set(appItems, { display: "none", y: "100%" });
        for (let k = 0; k < appItems.length; k++) {
          tl.add(
            () => {
              if (y.direction === "down") {
                itemVideo(k)?.play();
                gsap.fromTo(
                  appItems[k],
                  { display: "none", y: "100%" },
                  {
                    display: "block",
                    y: "0%",
                    duration: 0.9,
                    ease,
                    onComplete: () => {
                      if (y.direction === "down") gsap.set(appMain, { display: "none" });
                    },
                  },
                );
              } else {
                if (k === 0) appMainVideoRef.current?.play();
                itemVideo(k)?.pause();
                gsap.set(appMain, { display: "block" });
                gsap.to(appItems[k], { display: "none", y: "100%", duration: 0.8, ease });
              }
            },
            0.05 + k * 2,
          );
          tl.add(
            () => {
              if (y.direction === "down") {
                if (k === appItems.length - 1) return;
                itemVideo(k)?.pause();
                gsap.to(appItems[k], { display: "none", y: "-20%", duration: 0.9, ease, stagger: 2 });
              } else {
                itemVideo(k)?.play();
                gsap.to(appItems[k], { display: "block", y: "0%", duration: 0.8, ease, stagger: 2 });
              }
            },
            k * 2 + 2 + offset,
          );
          tl.add(
            () => {
              if (y.direction === "down") {
                if (k === appItems.length - 1) return;
                gsap.to(appItems[k], { filter: "blur(5px)", duration: 0.5, ease: "power1.inOut", stagger: 2 });
              } else {
                gsap.to(appItems[k], { filter: "blur(0px)", duration: 0.5, ease: "power1.inOut", stagger: 2 });
              }
            },
            k * 2 + 2 + offset,
          );
        }
      };

      tl.fromTo(
        ".HomePage",
        { backgroundColor: "transparent" },
        { backgroundColor: "#F4F4F4", ease: "power1.inOut", duration: 0.5 },
        0,
      );
      tl.to(
        appMain,
        {
          ease: "power1.inOut",
          duration: 0.5,
          filter: "blur(5px)",
          y: "-0%",
          onComplete: () => {
            appMainVideoRef.current?.pause();
          },
        },
        0.2,
      );

      if (desktop) {
        tl.from(titleBoxes, { y: window.innerHeight / 2, duration: 1, ease: "power3.out", stagger: 2 }, 0.1);
        tl.from(titleBoxes, { autoAlpha: 0, duration: 0.5, ease: "power1.inOut", stagger: 2 }, 0.1);
        tl.to(titleBoxes, { height: "10rem", duration: 1, ease: "power2.inOut", stagger: 2 }, 0.1 + 0.9);
        tl.from(boxTitles, { y: 0, duration: 1, ease: "power1.inOut", stagger: 2 }, 0.1);
        tl.to(boxTitles, { y: "-10rem", duration: 1, ease: "power1.inOut", stagger: 2 }, 0.1 + 0.9);
        tl.to(boxTitles, { autoAlpha: 0, duration: 0.5, ease: "power1.inOut", stagger: 2 }, 0.1 + 0.9);
        initAppItems(0.1, 0);
        tl.from(textBoxes, { y: window.innerHeight / 2, duration: 1.2, ease: "power3.out", stagger: 2 }, 0.1);
        tl.from(textBoxes, { autoAlpha: 0, duration: 0.5, ease: "power1.inOut", stagger: 2 }, 0.1);
        tl.to(textBoxes, { y: -window.innerHeight / 2, duration: 1, ease: "power1.inOut", stagger: 2 }, 0.1 + 1.4);
        tl.to(textBoxes, { autoAlpha: 0, duration: 0.5, ease: "power1.inOut", stagger: 2 }, 0.1 + 1.4);
      } else {
        gsap.set(titleBoxes, { y: "100%", autoAlpha: 0 });
        tl.to(titleBoxes, { height: "10rem", duration: 1, ease: "power2.inOut", stagger: 2 }, 1 + 0.2);
        tl.from(boxTitles, { y: 0, duration: 1, ease: "power1.inOut", stagger: 2 }, 0);
        tl.to(boxTitles, { y: "-10rem", duration: 1, ease: "power1.inOut", stagger: 2 }, 0.8 + 0.2);
        tl.to(boxTitles, { autoAlpha: 0, duration: 0.5, ease: "power1.inOut", stagger: 2 }, 0.8 + 0.2);
        tl.from(boxTags, { autoAlpha: 0, duration: 0.5, ease: "power1.inOut", stagger: 2 }, 1 + 0.2);
        for (let i = 0; i < titleBoxes.length; i++) {
          tl.add(
            () => {
              if (y.direction === "down") {
                gsap.fromTo(titleBoxes[i], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: "power1.inOut" });
                gsap.fromTo(
                  titleBoxes[i],
                  { y: window.innerHeight / 2 },
                  { y: 0, duration: 1, ease: "power3.out" },
                );
              } else {
                gsap.to(titleBoxes[i], { y: "100%", autoAlpha: 0, duration: 0.5, ease: "power2.inOut" });
              }
            },
            0.05 + i * 2,
          );
        }
        initAppItems(0, 0.2);
      }

      gsap.timeline({
        onStart: () => {
          setLottieKey((key) => key + lottieCountRef.current);
        },
        scrollTrigger: {
          trigger: sticky,
          scrub: 1,
          start: "top top",
          end: "+=" + (desktop ? window.innerHeight * 3.5 : window.innerHeight * 3.8),
          onUpdate: (self) => {
            tl.progress(self.progress * (desktop ? 0.93 : 1));
          },
        },
      });
    });

    appMainVideoRef.current?.play();

    return () => {
      // Tweens spawned from the timeline callbacks live outside the context.
      const loose = [appMain, ...appItems, ...titleBoxes];
      gsap.killTweensOf(loose);
      ctx.revert();
      gsap.set(loose, { clearProps: "all" });
    };
  }, []);

  return (
    <section
      ref={elRef}
      {...(sliceId ? { sliceid: sliceId } : null)}
      data-v-fc0f272b={parentScope}
      data-v-c86fbc86=""
      className={className ? `SliceScrollableAppScreens ${className}` : "SliceScrollableAppScreens"}
    >
      <div ref={stickyRef} data-v-c86fbc86="" className="SliceScrollableAppScreens-sticky">
        <div data-v-c86fbc86="" className="SliceScrollableAppScreens-wrapper">
          <div data-v-c86fbc86="" className="SliceScrollableAppScreens-titles">
            {items.map((item, index) => (
              <div key={index} data-v-c86fbc86="" className="SliceScrollableAppScreens-titlesItem">
                <div data-v-c86fbc86="" className="SliceScrollableAppScreens-box --is-title">
                  <div data-v-c86fbc86="" className="SliceScrollableAppScreens-boxTitle AppTitle-3">
                    {item.title}
                  </div>
                  <div data-v-c86fbc86="" className="SliceScrollableAppScreens-boxTag --text-20">
                    {item.tag}
                  </div>
                  {isIconName(item.titleIcon) ? (
                    <AppSvg data-v-c86fbc86="" name={item.titleIcon} className="SliceScrollableAppScreens-boxIcon" />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
          <div data-v-c86fbc86="" className="SliceScrollableAppScreens-app">
            <div data-v-c86fbc86="" className="SliceScrollableAppScreens-appInner">
              <div ref={appMainRef} data-v-c86fbc86="" className="SliceScrollableAppScreens-appMain">
                {vimeo?.src ? (
                  <BaseVideoVimeoLoop
                    ref={appMainVideoRef}
                    data-v-c86fbc86=""
                    video={vimeo}
                    restartOnPlay
                    autoplay={false}
                    className="SliceScrollableAppScreens-appMainVideo"
                  />
                ) : null}
              </div>
              {items.map((item, index) => (
                <div key={index} data-v-c86fbc86="" className="SliceScrollableAppScreens-appItem">
                  {item.vimeo?.src ? (
                    <BaseVideoVimeoLoop
                      ref={(handle) => {
                        appItemVideoRefs.current[index] = handle;
                      }}
                      data-v-c86fbc86=""
                      video={item.vimeo}
                      restartOnPlay
                      autoplay={false}
                      className="SliceScrollableAppScreens-appItemVideo"
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
          <div data-v-c86fbc86="" className="SliceScrollableAppScreens-texts">
            {items.map((item, index) => (
              <div key={index} data-v-c86fbc86="" className="SliceScrollableAppScreens-textsItem">
                <div data-v-c86fbc86="" className="SliceScrollableAppScreens-box --is-text">
                  <div data-v-c86fbc86="" className="SliceScrollableAppScreens-boxText AppTitle-12">
                    {item.text}
                  </div>
                  {item.iconFile?.url ? (
                    <LottiePlayer
                      key={lottieKey}
                      data-v-c86fbc86=""
                      url={item.iconFile.url}
                      className={`SliceScrollableAppScreens-boxAnimatedIcon --${index}`}
                    />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
