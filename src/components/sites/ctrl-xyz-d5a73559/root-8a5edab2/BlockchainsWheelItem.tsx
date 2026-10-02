"use client";

import { useEffect, useState, type HTMLAttributes } from "react";
import { AppImage, type AppImageProps } from "../shared/AppImage";

/** CMS image object of a blockchain icon (spread into `AppImage`). */
export type BlockchainIconImage = Pick<AppImageProps, "url" | "fullUrl" | "alt" | "dimensions" | "lqip" | "modifiers">;

/** A `blockchain` document as projected by the original GROQ query. */
export interface Blockchain {
  name: string;
  slug?: string | null;
  icon?: { image?: BlockchainIconImage | null } | null;
  color?: string | null;
  isFeatured?: boolean;
}

export interface BlockchainsWheelItemProps
  extends Omit<Partial<Blockchain>, "name">, Omit<HTMLAttributes<HTMLDivElement>, "color" | "children"> {
  name?: string | null;
  selected?: boolean;
}

const BG_CLASSES = ["--bg-lemonade", "--bg-baby", "--bg-sky", "--bg-light-green", "--bg-sky", "--bg-grey6"];
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

/** Port of `BlockchainsWheelItem` (scope data-v-ee17630f): round icon badge + chain name. */
export function BlockchainsWheelItem({
  name = null,
  slug: _slug = null,
  icon = null,
  color = "#FFFFFF",
  isFeatured: _isFeatured = false,
  selected = false,
  className,
  ...rest
}: BlockchainsWheelItemProps) {
  // CMS fields the original declares as props but never renders.
  void _slug;
  void _isFeatured;
  // Picked after mount, like the original (keeps the server render deterministic).
  const [bgIndex, setBgIndex] = useState(0);
  useEffect(() => {
    const pick = () => setBgIndex(randomInt(0, BG_CLASSES.length - 1));
    pick();
  }, []);

  const image = icon?.image;
  const classes = ["BlockchainsWheelItem", selected ? "--selected" : "", className ?? ""].filter(Boolean).join(" ");

  return (
    <div {...rest} data-v-ee17630f="" className={classes}>
      <div
        data-v-ee17630f=""
        className={color ? "BlockchainsWheelItem-icon" : `BlockchainsWheelItem-icon ${BG_CLASSES[bgIndex]}`}
        style={{ backgroundColor: color || undefined }}
      >
        {image?.url ? (
          <AppImage
            data-v-ee17630f=""
            className="BlockchainsWheelItem-iconImage"
            {...image}
            mockupWidth={48}
            mockupHeight={48}
            fit="contain"
            sizes="xs:20vw sm:20vw md:20vw lg:20vw xl:20vw"
          />
        ) : name && name[0] ? (
          <div data-v-ee17630f="" className="BlockchainsWheelItem-iconLetter">
            {name[0]}
          </div>
        ) : null}
      </div>
      <div data-v-ee17630f="" className="BlockchainsWheelItem-content">
        <div data-v-ee17630f="" className="BlockchainsWheelItem-name --desktop-text-60 --mobile-text-28">
          {name}
        </div>
      </div>
    </div>
  );
}
