"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import {
  BaseVideoVimeoLoop,
  type BaseVideoVimeoLoopHandle,
  type VimeoVideo,
} from "../shared/BaseVideoVimeoLoop";
import { getDevice } from "../shared/device";
import { gsap } from "../shared/gsap";
import { SurtitleWithDot } from "../shared/SurtitleWithDot";
import { TitleWithIcon } from "../shared/TitleWithIcon";
import { isLoopSceneName, LoopScene } from "./scenes/LoopScene";
import { StickyHorizontalList } from "./StickyHorizontalList";

/** The CMS title object, bound onto `TitleWithIcon` as in the original (`v-bind="props.title"`). */
export interface SliceTitleListHorizontalTitle {
  title?: string | null;
  icon?: string | null;
  iconFile?: { url?: string | null } | null;
  iconPos?: number | null;
  forceWrapBeforeIcon?: boolean | null;
}

export interface SliceTitleListHorizontalItem {
  _key?: string;
  _type?: string;
  title?: string | null;
  text?: string | null;
  /** Animated scene shown instead of a video (see `scenes/LoopScene`); takes precedence over `vimeo`. */
  scene?: string | null;
  vimeo?: VimeoVideo | null;
  /** Non-Vimeo fallback of the original (`VideoLoop` with `sources`); unused by the page data. */
  video?: { sources?: unknown[] } | null;
}

export interface SliceTitleListHorizontalProps {
  surtitle?: string | null;
  title?: SliceTitleListHorizontalTitle | null;
  items?: SliceTitleListHorizontalItem[];
  /** Falls through to the root as the `sliceid` attribute, as on the original. */
  sliceId?: string;
  /** Present in the slice data; not rendered. */
  componentName?: string;
  /** Parent (`Slices`) classes, appended after the component's own class. */
  className?: string;
  /** Parent scope attribute. */
  "data-v-fc0f272b"?: string;
}

const subscribeResize = (onChange: () => void) => {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
};
const getDesktop = () => getDevice().desktop;
const getNeedCorrectiveColors = () => {
  const { safari, chrome, isMacOs, mobileOrTablet } = getDevice();
  return (safari || chrome) && isMacOs && !mobileOrTablet;
};
/** Value of the original device refs before mount. */
const getFalse = () => false;

/**
 * Port of `SliceTitleListHorizontal` (scope data-v-80f8c832): a `StickyHorizontalList` of
 * video cards. On desktop the videos only play while their card is hovered (the card
 * lifts by 4rem); below desktop they autoplay.
 */
export function SliceTitleListHorizontal({
  surtitle = null,
  title = null,
  items = [],
  sliceId,
  className,
  "data-v-fc0f272b": parentScope,
}: SliceTitleListHorizontalProps) {
  // Read synchronously right after hydration so the videos get the right `autoplay`
  // before their own mount timers fire (the original device refs are set on mount).
  const desktop = useSyncExternalStore(subscribeResize, getDesktop, getFalse);
  const needCorrectiveColors = useSyncExternalStore(subscribeResize, getNeedCorrectiveColors, getFalse);

  const refVideos = useRef<(BaseVideoVimeoLoopHandle | null)[]>([]);
  const refCards = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const cards = refCards.current;
    return () => gsap.killTweensOf(cards);
  }, []);

  const onMouseEnter = (index: number) => {
    if (!getDevice().desktop) return;
    refVideos.current[index]?.play();
    // animateEnterCard
    gsap.timeline().to(refCards.current[index], { y: "-4rem", duration: 0.8, ease: "power3.out" }, 0);
  };

  const onMouseLeave = (index: number) => {
    if (!getDevice().desktop) return;
    refVideos.current[index]?.pause({ completeLoop: true });
    gsap.to(refCards.current[index], { y: "0rem", skewX: 0, skewY: 0 });
    // animateLeaveCard
    gsap.to(refCards.current[index], { y: "0rem", duration: 0.5, ease: "power2.out", overwrite: true });
  };

  return (
    <section
      {...(sliceId ? { sliceid: sliceId } : null)}
      data-v-fc0f272b={parentScope}
      data-v-80f8c832=""
      className={className ? `SliceTitleListHorizontal ${className}` : "SliceTitleListHorizontal"}
    >
      <StickyHorizontalList
        data-v-80f8c832=""
        items={items}
        listClass="SliceTitleListHorizontal-list"
        head={
          <>
            <div className="SliceTitleListHorizontal-surtitleWrap" data-v-80f8c832="">
              <SurtitleWithDot
                className="SliceTitleListHorizontal-surtitle AppSurtitle-2"
                dotColor="green"
                surtitle={surtitle ?? ""}
                data-v-80f8c832=""
              />
            </div>
            <div className="SliceTitleListHorizontal-head AppWrapper-1160" data-v-80f8c832="">
              <TitleWithIcon
                tag="h2"
                classname="SliceTitleListHorizontal-title AppTitle-2"
                title={title?.title ?? ""}
                icon={title?.icon}
                iconFile={title?.iconFile}
                iconPos={title?.iconPos ?? undefined}
                forceWrapBeforeIcon={title?.forceWrapBeforeIcon ?? undefined}
              />
            </div>
          </>
        }
        renderItem={(item, index) => (
          <article
            ref={(node) => {
              refCards.current[index] = node;
            }}
            className={
              needCorrectiveColors
                ? "SliceTitleListHorizontal-listItem --bg-grey7 --need-corrective-colors"
                : "SliceTitleListHorizontal-listItem --bg-grey7"
            }
            data-v-80f8c832=""
            onMouseEnter={() => onMouseEnter(index)}
            onMouseLeave={() => onMouseLeave(index)}
          >
            <div className="SliceTitleListHorizontal-listItemContent" data-v-80f8c832="">
              <h3 className="SliceTitleListHorizontal-listItemTitle AppTitle-10" data-v-80f8c832="">
                {item.title}
              </h3>
              <p className="SliceTitleListHorizontal-listItemText AppText-6 --c-grey1" data-v-80f8c832="">
                {item.text}
              </p>
            </div>
            {isLoopSceneName(item.scene) ? (
              <LoopScene
                ref={(handle) => {
                  refVideos.current[index] = handle;
                }}
                scene={item.scene}
                autoplay={!desktop}
                className="SliceTitleListHorizontal-listItemAsset"
                data-v-80f8c832=""
              />
            ) : item.vimeo && item.vimeo.src ? (
              <BaseVideoVimeoLoop
                ref={(handle) => {
                  refVideos.current[index] = handle;
                }}
                video={item.vimeo}
                autoplay={!desktop}
                className="SliceTitleListHorizontal-listItemAsset"
                data-v-80f8c832=""
              />
            ) : null}
          </article>
        )}
      />
    </section>
  );
}
