"use client";

import { SurtitleWithDot } from "../shared/SurtitleWithDot";
import { TitleWithIcon } from "../shared/TitleWithIcon";
import styles from "./roadmap.module.css";

interface SectionHeadProps {
  surtitle: string;
  /** A "\n" breaks the line on desktop. */
  title: string;
  /** Suffix of the surtitle blob's colour (see `SurtitleWithDot`). */
  dotColor: string;
  /** Site title class, e.g. `AppTitle-5`. */
  titleClass: string;
  className?: string;
}

/** A section head as on the home page: the surtitle with its blob, then the title revealing word by word. */
export function SectionHead({ surtitle, title, dotColor, titleClass, className }: SectionHeadProps) {
  return (
    <div className={className ? `${styles.head} ${className}` : styles.head}>
      <SurtitleWithDot className="AppSurtitle-2" dotColor={dotColor} surtitle={surtitle} />
      <TitleWithIcon tag="h2" classname={`${styles.title} ${titleClass} --tac`} title={title} />
    </div>
  );
}
