"use client";

import type { ReactNode } from "react";
import { home } from "../shared/content";
import { HomeHero } from "./HomeHero";
import { SliceBlockchainsSearch, type SliceBlockchainsSearchProps } from "./SliceBlockchainsSearch";
import { SliceFAQ, type SliceFAQProps } from "./SliceFAQ";
import { SliceScrollableAppScreens, type SliceScrollableAppScreensProps } from "./SliceScrollableAppScreens";
import { SliceTitleListGrid, type SliceTitleListGridProps } from "./SliceTitleListGrid";
import { SliceTitleListHorizontal, type SliceTitleListHorizontalProps } from "./SliceTitleListHorizontal";
import { SliceTitleListVertical, type SliceTitleListVerticalProps } from "./SliceTitleListVertical";

type Slice = { componentName: string };
const slices: Slice[] = home.slices;

/** Port of `Slices` position classes: first/last plus the neighbouring slice names. */
function sliceClass(index: number) {
  const classes = ["Slices-slice"];
  if (index === 0) classes.push("--is-first-slice");
  if (index === slices.length - 1) classes.push("--is-last-slice");
  const previous = slices[index - 1]?.componentName;
  if (previous) classes.push(`--is-after-${previous}`);
  const next = slices[index + 1]?.componentName;
  if (next) classes.push(`--is-before-${next}`);
  return classes.join(" ");
}

function renderSlice(slice: Slice, index: number): ReactNode {
  const shared = { className: sliceClass(index), "data-v-fc0f272b": "" };
  // The JSON's `componentName` is typed as plain `string`, so each slice is cast to its component's props.
  const data = slice as unknown;
  switch (slice.componentName) {
    case "SliceScrollableAppScreens":
      return <SliceScrollableAppScreens key={index} {...(data as SliceScrollableAppScreensProps)} {...shared} />;
    case "SliceBlockchainsSearch":
      return <SliceBlockchainsSearch key={index} {...(data as SliceBlockchainsSearchProps)} {...shared} />;
    case "SliceTitleListVertical":
      return <SliceTitleListVertical key={index} {...(data as SliceTitleListVerticalProps)} {...shared} />;
    case "SliceTitleListGrid":
      return <SliceTitleListGrid key={index} {...(data as SliceTitleListGridProps)} {...shared} />;
    case "SliceTitleListHorizontal":
      return <SliceTitleListHorizontal key={index} {...(data as SliceTitleListHorizontalProps)} {...shared} />;
    case "SliceFAQ":
      return <SliceFAQ key={index} {...(data as SliceFAQProps)} {...shared} />;
    default:
      return null;
  }
}

/** Port of the home page component (scope data-v-11ce35e1) and its `Slices` list (scope data-v-fc0f272b). */
export function HomePage() {
  return (
    <div className="HomePage Page" data-v-11ce35e1="">
      <HomeHero {...home.hero} />
      <main className="Slices" data-v-11ce35e1="" data-v-fc0f272b="">
        {slices.map(renderSlice)}
      </main>
    </div>
  );
}
