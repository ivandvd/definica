"use client";

import { useEffect, useRef, type ComponentProps } from "react";
import { AppButton } from "../shared/AppButton";
import type { CmsLink } from "../shared/content";
import { gsap } from "../shared/gsap";
import { SanityContent } from "../shared/SanityPortableText";
import { SurtitleWithDot } from "../shared/SurtitleWithDot";
import { TitleWithIcon } from "../shared/TitleWithIcon";

/** The CMS title object, bound onto `TitleWithIcon` as in the original (`v-bind="props.title"`). */
export interface SliceFAQTitle {
  title?: string | null;
  icon?: string | null;
  iconFile?: { url?: string | null } | null;
  iconPos?: number | null;
  forceWrapBeforeIcon?: boolean | null;
}
type PortableTextBlocks = ComponentProps<typeof SanityContent>["blocks"];

export interface SliceFAQItem {
  _key?: string;
  _type?: string;
  /** Read by the original for the button's `aria-label`; absent from the CMS data. */
  title?: string | null;
  question?: string | null;
  answer?: PortableTextBlocks;
}

export interface SliceFAQProps {
  surtitle?: string | null;
  title?: SliceFAQTitle | null;
  items?: SliceFAQItem[];
  button?: CmsLink | null;
  /** Falls through to the root as the `sliceid` attribute, as on the original. */
  sliceId?: string;
  /** Present in the slice data; not rendered. */
  componentName?: string;
  /** Parent (`Slices`) classes, appended after the component's own class. */
  className?: string;
  /** Parent scope attribute. */
  "data-v-fc0f272b"?: string;
  /** In-page link target. */
  id?: string;
}

/**
 * Port of `SliceFAQ` (scope data-v-5ccfc627): click-driven accordion, one item open at a
 * time. The `--opened` flag lives on the DOM (classList) and the height / icon are tweened
 * with GSAP, as in the original.
 */
export function SliceFAQ({
  surtitle = null,
  title = null,
  items = [],
  button = null,
  sliceId,
  className,
  "data-v-fc0f272b": parentScope,
  id,
}: SliceFAQProps) {
  const refItem = useRef<(HTMLElement | null)[]>([]);
  const refItemContent = useRef<(HTMLDivElement | null)[]>([]);
  const refIcon = useRef<(SVGSVGElement | null)[]>([]);

  useEffect(() => {
    const contents = refItemContent.current;
    const icons = refIcon.current;
    return () => {
      gsap.killTweensOf(contents);
      icons.forEach((icon) => {
        if (icon) gsap.killTweensOf([icon, icon.querySelector("line:nth-child(1)")]);
      });
    };
  }, []);

  const close = (index: number) => {
    const icon = refIcon.current[index];
    if (!icon) return;
    gsap.to(refItemContent.current[index], { height: 0, duration: 0.4, ease: "power2.out" });
    gsap.to(icon, { rotate: "0deg", duration: 0.3, ease: "power2.out" });
    gsap.to(icon.querySelector("line:nth-child(1)"), {
      scaleX: "1",
      transformOrigin: "center",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const open = (index: number) => {
    const icon = refIcon.current[index];
    if (!icon) return;
    gsap.to(refItemContent.current[index], { height: "auto", duration: 0.4, ease: "power2.out" });
    gsap.to(icon, { rotate: "90deg", duration: 0.4, ease: "power1.out" });
    gsap.to(icon.querySelector("line:nth-child(1)"), {
      scaleX: "0",
      transformOrigin: "center",
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const toggle = (index: number) => {
    refItem.current.forEach((item, i) => {
      if (item && i !== index) {
        item.classList.remove("--opened");
        close(i);
      }
    });
    const item = refItem.current[index];
    if (!item) return;
    if (item.classList.contains("--opened")) {
      item.classList.remove("--opened");
      close(index);
    } else {
      item.classList.add("--opened");
      open(index);
    }
  };

  return (
    <section
      {...(sliceId ? { sliceid: sliceId } : null)}
      id={id}
      data-v-fc0f272b={parentScope}
      data-v-5ccfc627=""
      className={className ? `SliceFAQ --bg-grey8 ${className}` : "SliceFAQ --bg-grey8"}
    >
      <div className="SliceFAQ-head AppWrapper-1330" data-v-5ccfc627="">
        <SurtitleWithDot
          className="SliceFAQ-surtitle AppSurtitle-2"
          dotColor="baby"
          surtitle={surtitle ?? ""}
          data-v-5ccfc627=""
        />
        <TitleWithIcon
          tag="h2"
          classname="AppTitle-4"
          title={title?.title ?? ""}
          icon={title?.icon}
          iconFile={title?.iconFile}
          iconPos={title?.iconPos ?? undefined}
          forceWrapBeforeIcon={title?.forceWrapBeforeIcon ?? undefined}
        />
      </div>
      {items ? (
        <div className="SliceFAQ-list AppWrapper-1330" data-v-5ccfc627="">
          {items.map((item, index) => (
            <article
              key={index}
              ref={(node) => {
                refItem.current[index] = node;
              }}
              className="SliceFAQ-listItem --bg-grey7"
              data-v-5ccfc627=""
            >
              <button
                className="SliceFAQ-listItemHead AppTitle-9"
                aria-label={item.title ?? undefined}
                data-v-5ccfc627=""
                onClick={() => toggle(index)}
              >
                {item.question}{" "}
                <div className="SliceFAQ-listItemHeadButton" data-v-5ccfc627="">
                  <svg
                    ref={(node) => {
                      refIcon.current[index] = node;
                    }}
                    width="9"
                    height="9"
                    viewBox="0 0 9 9"
                    fill="none"
                    data-v-5ccfc627=""
                  >
                    <line
                      x1="-4.37114e-08"
                      y1="4.5"
                      x2="9"
                      y2="4.5"
                      strokeWidth="1.6"
                      stroke="#0F0F0F"
                      data-v-5ccfc627=""
                    />
                    <line
                      x1="4.5"
                      y1="-2.18557e-08"
                      x2="4.5"
                      y2="9"
                      strokeWidth="1.6"
                      stroke="#0F0F0F"
                      data-v-5ccfc627=""
                    />
                  </svg>
                </div>
              </button>
              <div
                ref={(node) => {
                  refItemContent.current[index] = node;
                }}
                className="SliceFAQ-listItemContent"
                data-v-5ccfc627=""
              >
                <div className="SliceFAQ-listItemContentText AppText-8 --rich" data-v-5ccfc627="">
                  <SanityContent blocks={item.answer} />
                </div>
              </div>
            </article>
          ))}
          {button ? (
            <AppButton
              {...button}
              label={button.title}
              size="small"
              className="SliceFAQ-button"
              theme="border-light"
              data-v-5ccfc627=""
            />
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
