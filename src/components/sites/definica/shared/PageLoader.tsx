"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "./gsap";
import { viewportObserver } from "./observe";
import { smoothScroll } from "./smooth-scroll";

/**
 * Port of `PageLoader` (scope data-v-48ad1a87): white cover that waits for fonts,
 * then fades out and switches the viewport observers on 0.3s in.
 */
export function PageLoader() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timeline: gsap.core.Timeline | null = null;

    document.fonts.ready
      .catch(() => undefined)
      .then(() => {
        if (cancelled) return;
        setProgress(1);
        smoothScroll.goToTop(true);
        document.body.classList.add("cursor-loading");
        timeline = gsap
          .timeline({
            onComplete: () => {
              document.body.classList.remove("cursor-loading");
              setShow(false);
              smoothScroll.onResize();
            },
          })
          .add(() => viewportObserver.setActive(true), 0.3)
          .to(ref.current, { autoAlpha: 0, ease: "power1.inOut", duration: 0.5 }, 0);
      });

    return () => {
      cancelled = true;
      timeline?.kill();
    };
  }, []);

  return (
    <div
      ref={ref}
      data-v-48ad1a87=""
      className={show ? "PageLoader --show" : "PageLoader"}
      style={{ "--progress": progress } as React.CSSProperties}
    />
  );
}

/** Port of `PageTransition` (scope data-v-2f2c7624). The clone has a single route, so it only renders its idle state. */
export function PageTransition() {
  return <div data-v-2f2c7624="" className="PageTransition" style={{ "--progress": 0 } as React.CSSProperties} />;
}
