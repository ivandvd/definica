"use client";

import { useEffect, useRef, useState } from "react";
import { getDevice } from "./device";
import { smoothScroll, type ScrollState } from "./smooth-scroll";

/** Port of `CustomScrollBar`: draggable thumb that mirrors the Lenis scroll position. */
export function CustomScrollBar() {
  const ref = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const thumb = thumbRef.current;
    if (!el || !thumb) return;

    const { safari, touch } = getDevice();
    const updateVisible = () => {
      const containerHeight = smoothScroll.container?.clientHeight ?? 0;
      setVisible(smoothScroll.active && containerHeight >= window.innerHeight && !(safari && touch));
    };
    const onScroll = ({ target, value }: ScrollState) => {
      const position = dragging.current ? target : value;
      const offset = (position / smoothScroll.bounds) * (el.clientHeight - thumb.clientHeight - 4);
      thumb.style.transform = `translate3d(0px, ${(Number.isFinite(offset) ? offset : 0).toFixed(2)}px, 0px)`;
    };
    const onMouseUp = () => {
      dragging.current = false;
      setIsDragging(false);
      document.body.style.cursor = "";
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      smoothScroll.goTo((e.clientY / el.clientHeight) * smoothScroll.bounds);
    };

    updateVisible();
    smoothScroll.on("scroll", onScroll);
    smoothScroll.on("resize", updateVisible);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      smoothScroll.off("scroll", onScroll);
      smoothScroll.off("resize", updateVisible);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <div
      ref={ref}
      className={isDragging ? "ScrollBar-component --is-dragging" : "ScrollBar-component"}
      style={visible ? undefined : { display: "none" }}
    >
      <div
        ref={thumbRef}
        className="ScrollBar-thumb"
        onMouseDown={() => {
          dragging.current = true;
          setIsDragging(true);
          document.body.style.cursor = "grabbing";
        }}
      />
    </div>
  );
}
