"use client";

import { Fragment, useRef } from "react";
import { useScrubWords } from "../motion";

/** A statement whose words darken into ink one after another as it scrolls up (the roadmap's north star). */
export function Statement({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useScrubWords(ref);

  return (
    <p ref={ref} className={className}>
      {text.split(" ").map((word, index) => (
        <Fragment key={index}>
          {index > 0 ? " " : null}
          <span data-word="">{word}</span>
        </Fragment>
      ))}
    </p>
  );
}
