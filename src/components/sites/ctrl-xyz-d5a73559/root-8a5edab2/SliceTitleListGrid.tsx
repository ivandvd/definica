"use client";

import { useEffect, useRef, useSyncExternalStore, type HTMLAttributes } from "react";
import { BaseVideoVimeoLoop, type BaseVideoVimeoLoopHandle, type VimeoVideo } from "../shared/BaseVideoVimeoLoop";
import { getDevice } from "../shared/device";
import { gsap } from "../shared/gsap";
import { SurtitleWithDot } from "../shared/SurtitleWithDot";
import { TitleWithIcon } from "../shared/TitleWithIcon";
import { isLoopSceneName, LoopScene } from "./scenes/LoopScene";
import { titleProps, type SliceTitle } from "./SliceTitleListVertical";

export interface SliceTitleListGridItem {
  title?: string | null;
  /** Animated scene shown instead of a video (see `scenes/LoopScene`); takes precedence over `vimeo`. */
  scene?: string | null;
  vimeo?: VimeoVideo | null;
  /** Self-hosted loop (`BaseVideoLoop` in the original); not used by the home page, see the note below. */
  video?: { sources?: readonly unknown[] | null } | null;
  _key?: string | null;
  _type?: string | null;
}

export interface SliceTitleListGridProps extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
  surtitle?: string | null;
  title?: SliceTitle | null;
  items?: readonly SliceTitleListGridItem[] | null;
  /** Rendered as the `sliceid` attribute, as in the original. */
  sliceId?: string | null;
  /** Consumed by the slice switcher; accepted so the slice data can be spread. */
  componentName?: string;
  /** Scope attribute of the parent (`Slices`). */
  "data-v-fc0f272b"?: string;
}

const COLORS = ["--bg-sky", "--bg-baby", "--bg-lemonade", "--bg-lemonade", "--bg-sky", "--bg-baby"];

const subscribeResize = (onChange: () => void) => {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
};
const isDesktop = () => getDevice().desktop;
const needsCorrectiveColors = () => {
  const { safari, chrome, isMacOs, mobileOrTablet } = getDevice();
  return (safari || chrome) && isMacOs && !mobileOrTablet;
};
/** What the original device refs hold before mount. */
const beforeMount = () => false;

/**
 * Port of `SliceTitleListGrid` (scope data-v-de6b7178): three coloured cards. On desktop a card
 * lifts and its video plays while hovered; below desktop the videos simply autoplay.
 */
export function SliceTitleListGrid({
  surtitle = null,
  title = null,
  items = [],
  sliceId,
  componentName: _componentName,
  className,
  ...rest
}: SliceTitleListGridProps) {
  // Read through an external store rather than `useDevice` so the real values are in place
  // (re-rendered synchronously after hydration) before the videos decide whether to autoplay.
  const desktop = useSyncExternalStore(subscribeResize, isDesktop, beforeMount);
  const correctiveColors = useSyncExternalStore(subscribeResize, needsCorrectiveColors, beforeMount);

  const refAssets = useRef<(BaseVideoVimeoLoopHandle | null)[]>([]);
  const refCards = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const cards = refCards.current;
    return () => gsap.killTweensOf(cards.filter((card) => card !== null));
  }, []);

  const onMouseEnter = (index: number) => {
    if (!desktop) return;
    const card = refCards.current[index];
    refAssets.current[index]?.play();
    // Port of `animateEnterCard`.
    if (card) gsap.timeline().to(card, { y: "-4rem", duration: 0.8, ease: "power3.out" }, 0);
  };

  const onMouseLeave = (index: number) => {
    if (!desktop) return;
    const card = refCards.current[index];
    refAssets.current[index]?.pause({ completeLoop: true });
    if (!card) return;
    gsap.to(card, { y: "0rem", skewX: 0, skewY: 0 });
    // Port of `animateLeaveCard`.
    gsap.to(card, { y: "0rem", duration: 0.5, ease: "power2.out", overwrite: true });
  };

  const attrs: Record<string, string> = {};
  if (sliceId) attrs.sliceid = sliceId;

  return (
    <section
      {...attrs}
      {...rest}
      data-v-de6b7178=""
      className={`SliceTitleListGrid --bg-grey8${className ? ` ${className}` : ""}`}
    >
      <div data-v-de6b7178="" className="SliceTitleListGrid-head AppWrapper-1160">
        <SurtitleWithDot
          data-v-de6b7178=""
          className="SliceTitleListGrid-surtitle AppSurtitle-2"
          dotColor="flash-red"
          surtitle={surtitle ?? ""}
        />
        {title ? (
          <TitleWithIcon
            tag="h2"
            size="small"
            classname="SliceTitleListGrid-title AppTitle-5 --tac"
            {...titleProps(title)}
          />
        ) : null}
      </div>
      {items ? (
        <div data-v-de6b7178="" className="SliceTitleListGrid-list AppWrapper-1330">
          {items.map((item, index) => (
            <article
              key={index}
              ref={(el) => {
                refCards.current[index] = el;
              }}
              data-v-de6b7178=""
              className={`${COLORS[index % COLORS.length]}${correctiveColors ? " --need-corrective-colors" : ""} SliceTitleListGrid-listItem`}
              onMouseEnter={() => onMouseEnter(index)}
              onMouseLeave={() => onMouseLeave(index)}
            >
              <div data-v-de6b7178="" className="SliceTitleListGrid-listItemContent">
                <h3 data-v-de6b7178="" className="SliceTitleListGrid-listItemTitle AppTitle-9">
                  {item.title}
                </h3>
              </div>
              {/* The original falls back to `BaseVideoLoop` for `video.sources`; no card on this page uses it, so it is not ported. */}
              {isLoopSceneName(item.scene) ? (
                <LoopScene
                  ref={(handle) => {
                    refAssets.current[index] = handle;
                  }}
                  data-v-de6b7178=""
                  scene={item.scene}
                  autoplay={!desktop}
                  className="SliceTitleListGrid-listItemAsset"
                />
              ) : item.vimeo && item.vimeo.src ? (
                <BaseVideoVimeoLoop
                  ref={(handle) => {
                    refAssets.current[index] = handle;
                  }}
                  data-v-de6b7178=""
                  video={item.vimeo}
                  autoplay={!desktop}
                  className="SliceTitleListGrid-listItemAsset"
                />
              ) : null}
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
