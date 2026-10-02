"use client";

import { useEffect, useRef, useSyncExternalStore, type HTMLAttributes } from "react";
import { AppLink } from "./AppLink";
import { AppSvg } from "./AppSvg";
import { settings, type CmsLink } from "./content";
import { getDevice } from "./device";
import { gsap } from "./gsap";
import { useObserve } from "./observe";

interface DetectItem {
  name?: string | null;
  value: string;
  link?: CmsLink | null;
}

interface DownloadLink {
  buttonLabel?: string | null;
  buttonLabelFor?: string | null;
  link?: CmsLink | null;
  detect: { os: DetectItem[]; browsers: DetectItem[] };
}

const downloadLink: DownloadLink | null = settings.downloadLink;

/** Original `onMounted`: match the visitor's OS first, then their browser. */
function detect(): DetectItem | null {
  if (!downloadLink || !downloadLink.link) return null;
  const { os, browser } = getDevice();
  return (
    downloadLink.detect.os.find((item) => item.value === os) ??
    downloadLink.detect.browsers.find((item) => item.value === browser) ??
    null
  );
}

const subscribe = () => () => {};
/** `undefined` = not detected yet (server render / hydration pass). */
const getServerSnapshot = (): DetectItem | null | undefined => undefined;

type MobileDownloadButtonProps = Omit<HTMLAttributes<HTMLElement>, "children" | "className" | "title">;

/**
 * Port of `MobileDownloadButton` (scope data-v-cfeff700): store / extension link picked
 * from the visitor's OS or browser, revealed by a GSAP timeline (background pill widening
 * from the centred icon while the label slides up).
 */
export function MobileDownloadButton(props: MobileDownloadButtonProps) {
  const detected = useSyncExternalStore<DetectItem | null | undefined>(subscribe, detect, getServerSnapshot);

  const refButton = useRef<HTMLElement>(null);
  const refButtonBg = useRef<HTMLDivElement>(null);
  const refButtonIcon = useRef<HTMLSpanElement>(null);
  const refButtonLabel = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  // Original: built on the tick after the detection, i.e. once the final label is rendered.
  useEffect(() => {
    if (detected === undefined) return;
    const button = refButton.current;
    const bg = refButtonBg.current;
    const icon = refButtonIcon.current;
    const label = refButtonLabel.current;
    if (!button || !bg || !icon || !label) return;

    const iconRect = icon.getBoundingClientRect();
    const innerRect = button.querySelector(".DownloadButton-inner")?.getBoundingClientRect();
    const spans = label.querySelectorAll("span");

    const tl = gsap
      .timeline({ paused: false })
      .set(spans, { y: "-7rem" }, 0)
      .set(bg, { x: "-50%", y: "-50%", width: "11rem" }, 0)
      .fromTo(button, { autoAlpha: 0 }, { autoAlpha: 1, ease: "power1.inOut", duration: 0.4 }, 0.75)
      .fromTo(
        spans,
        { y: "10rem", x: 0, autoAlpha: 0 },
        { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out" },
        1.15,
      )
      .fromTo(
        icon,
        { x: window.innerWidth / 2 - (innerRect?.left ?? 0) - iconRect.width / 2 },
        { x: 0, duration: 0.8, ease: "power3.inOut", stagger: 0.05 },
        0.85,
      )
      .to(bg, { x: "-50%", y: "-50%", width: "100%", duration: 0.8, ease: "power3.inOut" }, 0.85);
    timeline.current = tl;

    return () => {
      tl.kill();
      timeline.current = null;
    };
  }, [detected]);

  useObserve(refButton, { onEnter: () => timeline.current?.play() });

  if (!downloadLink || !downloadLink.buttonLabelFor) return null;

  const link = detected && detected.link && detected.link.to ? detected.link : downloadLink.link;

  return (
    <AppLink {...props} data-v-cfeff700="" {...link} ref={refButton} className="DownloadButton-button">
      <div ref={refButtonBg} className="DownloadButton-bg" data-v-cfeff700="" />
      <div className="DownloadButton-inner" data-v-cfeff700="">
        <AppSvg ref={refButtonIcon} name="download" className="DownloadButton-buttonIcon" data-v-cfeff700="" />
        <div
          ref={refButtonLabel}
          className="DownloadButton-buttonLabel --desktop-text-20 --mobile-text-16 --fw-600"
          data-v-cfeff700=""
        >
          <span data-v-cfeff700="">
            {detected
              ? downloadLink.buttonLabelFor.replace("[value]", detected.name || detected.value)
              : downloadLink.buttonLabel}
          </span>
        </div>
      </div>
    </AppLink>
  );
}
