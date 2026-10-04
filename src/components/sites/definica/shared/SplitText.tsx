"use client";

import { createElement, useEffect, useImperativeHandle, useMemo, useRef, type HTMLAttributes, type Ref } from "react";
import { SplitText } from "./gsap";

export type SplitTextMainType = "lines" | "words" | "chars";

/** What the original exposes through `defineExpose` (plus `el`, the Vue `$el`). */
export interface SplitTextBlockHandle {
  /** Root element (`$el` in the original). */
  readonly el: HTMLElement | null;
  /** Splits the text (and wraps each `mainType` element when `wrap` is set), then fires `onSplit`. */
  split: () => void;
  revert: () => void;
  /** The `mainType` elements of the current split, if any. */
  getElements: () => Element[] | undefined;
  /** The `.{mainType}-wrapper` elements created by `wrap`. */
  getWrappers: () => NodeListOf<Element>;
}

export interface SplitTextBlockProps extends Omit<HTMLAttributes<HTMLElement>, "children" | "dangerouslySetInnerHTML"> {
  tag?: string;
  html?: string | null;
  /** GSAP SplitText `type`, e.g. `"lines"` or `"lines,words"`. */
  type?: string;
  mainType?: SplitTextMainType;
  wrap?: boolean;
  /** Port of the `split` emit. */
  onSplit?: () => void;
  /** Receives the root element (the original reads it as `$el`). */
  elRef?: Ref<HTMLElement>;
  ref?: Ref<SplitTextBlockHandle>;
}

/**
 * Port of the Vue `SplitText` component (scope data-v-9805fdae). Nothing is split until the
 * parent calls `split()` on the handle, exactly like the original.
 */
export function SplitTextBlock({
  tag = "div",
  html = null,
  type = "lines",
  mainType = "lines",
  wrap = false,
  onSplit,
  elRef,
  ref,
  className,
  ...rest
}: SplitTextBlockProps) {
  const el = useRef<HTMLElement | null>(null);
  const rootRef = useRef<HTMLSpanElement>(null);
  const instance = useRef<SplitText | null>(null);

  const latest = useRef({ type, mainType, wrap, onSplit });
  useEffect(() => {
    latest.current = { type, mainType, wrap, onSplit };
  });

  // Only the first "-" becomes a non-breaking hyphen, as in the original.
  const inner = useMemo(() => ({ __html: (html ?? "").replace("-", "‑") }), [html]);

  useImperativeHandle(
    ref,
    () => ({
      get el() {
        return el.current;
      },
      split() {
        const root = rootRef.current;
        if (!root) return;
        const { type: splitType, mainType: main, wrap: shouldWrap, onSplit: emit } = latest.current;
        instance.current?.revert();
        const split = new SplitText(root, {
          type: splitType,
          charsClass: "chars chars++",
          wordsClass: "words words++",
          linesClass: "lines lines++",
        });
        instance.current = split;
        if (shouldWrap) {
          const elements = split[main];
          elements.forEach((element, index) => {
            const wrapper = document.createElement("div");
            wrapper.classList.add(`${main}-wrapper`);
            const clone = element.cloneNode(true) as Element;
            elements[index] = clone;
            wrapper.appendChild(clone);
            element.parentNode?.replaceChild(wrapper, element);
          });
        }
        emit?.();
      },
      revert() {
        instance.current?.revert();
        instance.current = null;
      },
      getElements() {
        return instance.current ? instance.current[latest.current.mainType] : undefined;
      },
      getWrappers() {
        return (rootRef.current ?? document.createDocumentFragment()).querySelectorAll(
          `.${latest.current.mainType}-wrapper`,
        );
      },
    }),
    [],
  );

  const setEl = (node: HTMLElement | null) => {
    el.current = node;
    if (typeof elRef === "function") elRef(node);
    else if (elRef) elRef.current = node;
  };

  return createElement(
    tag,
    { ref: setEl, "data-v-9805fdae": "", ...rest, className: className ? `SplitText ${className}` : "SplitText" },
    <span ref={rootRef} data-v-9805fdae="" dangerouslySetInnerHTML={inner} />,
  );
}
