"use client";

import type { HTMLAttributes } from "react";
import { SurtitleWithDot } from "../shared/SurtitleWithDot";
import { TitleWithIcon, type TitleWithIconProps } from "../shared/TitleWithIcon";
import { VerticalCard, type VerticalCardProps } from "./VerticalCard";

/** CMS title object: `TitleWithIcon` props, where unset fields come through as `null`. */
export type SliceTitle = {
  [K in keyof Omit<TitleWithIconProps, "title" | "tag" | "classname">]?: TitleWithIconProps[K] | null;
} & { title: string };

/** Drops the `null`s of a CMS title object so `TitleWithIcon` falls back to its (equally falsy) defaults. */
export function titleProps(title: SliceTitle): Pick<TitleWithIconProps, "title"> & Partial<TitleWithIconProps> {
  const props: Record<string, unknown> = {};
  for (const [field, value] of Object.entries(title)) {
    // `icon: null` is meaningful (it is the default and adds `--no-icon`).
    if (value !== null) props[field] = value;
  }
  return { ...props, title: title.title };
}

export interface SliceTitleListVerticalProps extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
  surtitle?: string | null;
  title?: SliceTitle | null;
  items?: readonly VerticalCardProps[] | null;
  /** Rendered as the `sliceid` attribute, as in the original. */
  sliceId?: string | null;
  /** Consumed by the slice switcher; accepted so the slice data can be spread. */
  componentName?: string;
  /** Scope attribute of the parent (`Slices`). */
  "data-v-fc0f272b"?: string;
}

/** Port of `SliceTitleListVertical` (scope data-v-27a8be81): centred title above a column of `VerticalCard`s. */
export function SliceTitleListVertical({
  surtitle = null,
  title = null,
  items = [],
  sliceId,
  componentName: _componentName,
  className,
  ...rest
}: SliceTitleListVerticalProps) {
  const attrs: Record<string, string> = {};
  if (sliceId) attrs.sliceid = sliceId;

  return (
    <section
      {...attrs}
      {...rest}
      data-v-27a8be81=""
      className={`SliceTitleListVertical --bg-white${className ? ` ${className}` : ""}`}
    >
      <div data-v-27a8be81="" className="SliceTitleListVertical-head AppWrapper-1600">
        <SurtitleWithDot
          data-v-27a8be81=""
          className="SliceTitleListVertical-surtitle AppSurtitle-2"
          dotColor="green"
          surtitle={surtitle ?? ""}
        />
        {title ? (
          <TitleWithIcon {...titleProps(title)} tag="h2" classname="SliceTitleListVertical-title AppTitle-2" />
        ) : null}
      </div>
      {items ? (
        <div data-v-27a8be81="" className="SliceTitleListVertical-list AppWrapper-1330">
          {items.map((item, index) => (
            <VerticalCard
              key={index}
              data-v-27a8be81=""
              {...item}
              className={item.tone ? "SliceTitleListVertical-listItem" : "SliceTitleListVertical-listItem --bg-grey8"}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
