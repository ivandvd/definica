"use client";

import { useRef, type ReactNode } from "react";
import { useRise } from "../motion";
import { toneFill } from "./content";
import { StickerIcon } from "./icons";
import styles from "./kit.module.css";
import { PathTrack } from "./PathTrack";

export interface StationItem {
  /** One of the kit's stickers. */
  icon: string;
  tone?: string;
  name: string;
  text: string;
}

function Station({ station, index }: { station: StationItem; index: number }) {
  const refBody = useRef<HTMLDivElement>(null);
  useRise(refBody, { delay: 0.1 * index });

  return (
    <li className={styles.station}>
      <span className={styles.stop} data-track-stop="">
        <StickerIcon name={station.icon} tone={toneFill(station.tone)} className={styles.stopIcon} />
      </span>
      <div ref={refBody} className={styles.stationBody}>
        <h3 className={styles.stationName}>{station.name}</h3>
        <p className={`${styles.stationText} AppText-8`}>{station.text}</p>
      </div>
    </li>
  );
}

/**
 * Stations in order, joined by a pipe that a token travels along as the page scrolls: across a
 * row on desktop, down a column on phones. Each station's circle turns lime once the token is there.
 */
export function Stations({ items, token }: { items: StationItem[]; token: ReactNode }) {
  return (
    <PathTrack token={token}>
      <ol className={styles.stations}>
        {items.map((station, index) => (
          <Station key={station.name} station={station} index={index} />
        ))}
      </ol>
    </PathTrack>
  );
}
