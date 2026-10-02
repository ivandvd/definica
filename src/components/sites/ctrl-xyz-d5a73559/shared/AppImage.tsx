"use client";

import { useEffect, useRef, useSyncExternalStore, type CSSProperties, type HTMLAttributes } from "react";

export interface AppImageDimensions {
  aspectRatio: number;
  width?: number;
  height?: number;
  _type?: string;
}

export type AppImageFit = "cover" | "contain" | "fill" | "none";

export interface AppImageProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "placeholder"> {
  /** Sanity asset id in the CMS data (`image-<hash>-<w>x<h>-<ext>`) or a plain URL. */
  url: string;
  /** Local file URL in the clone; preferred over `url` for the rendered `src`. */
  fullUrl?: string | null;
  alt?: string | null;
  preload?: boolean;
  mockupWidth?: number;
  mockupHeight?: number;
  dimensions?: AppImageDimensions | null;
  loading?: "lazy" | "eager";
  placeholder?: "none" | "blur" | false;
  fit?: AppImageFit;
  /** Accepted for parity; no srcset is generated for local files. */
  sizes?: string;
  lqip?: string | null;
  /** Accepted for parity; local files are served as-is. */
  quality?: number;
  /** Accepted for parity; local files are served as-is. */
  modifiers?: Record<string, unknown> | null;
  /** Accepted for parity; local files are served as-is. */
  forceAlpha?: boolean;
}

/** Replaces the original `$urlFor` / NuxtImg Sanity provider: resolves to the plain local file. */
export function resolveImageUrl(url: string, fullUrl?: string | null) {
  return fullUrl && fullUrl.length > 0 ? fullUrl : url;
}

const subscribeNever = () => () => {};
/** Same client checks the original runs before showing the blurred placeholder. */
const canShowPlaceholder = () =>
  "loading" in HTMLImageElement.prototype &&
  "onscroll" in window &&
  !/(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent);

/** Port of `AppImage`: aspect-ratio box with an LQIP placeholder layer and a lazy `<img>` that fades in. */
export function AppImage({
  url,
  fullUrl = null,
  alt,
  preload: _preload = false,
  mockupWidth = 1440,
  mockupHeight,
  dimensions,
  loading = "lazy",
  placeholder = "blur",
  fit = "cover",
  sizes: _sizes = "autosize",
  lqip,
  quality: _quality = 80,
  modifiers: _modifiers,
  forceAlpha: _forceAlpha = false,
  className,
  style,
  ...rest
}: AppImageProps) {
  const refEl = useRef<HTMLDivElement>(null);
  const refImg = useRef<HTMLImageElement>(null);
  // false during SSR and hydration, like the original's post-mount `placeholderStyle` ref.
  const placeholderReady = useSyncExternalStore(subscribeNever, canShowPlaceholder, () => false);

  const onLoad = () => {
    const el = refEl.current;
    el?.querySelector(".AppImage-image:not(.--loaded,.--placeholder)")?.classList.add("--loaded");
    el?.querySelector(".AppImage-image.--placeholder:not(.--loaded)")?.classList.add("--loaded");
  };

  useEffect(() => {
    // The image may have finished loading before hydration attached `onLoad`.
    if (refImg.current?.complete) onLoad();
  }, []);

  if (!url || url.length === 0) return null;

  const aspectRatio: CSSProperties["aspectRatio"] =
    mockupWidth && mockupHeight ? mockupWidth / mockupHeight : dimensions ? dimensions.aspectRatio : undefined;

  const placeholderStyle: CSSProperties =
    placeholderReady && lqip
      ? { backgroundImage: `url(${lqip})`, backgroundSize: fit, backgroundPosition: "center center", objectFit: fit }
      : { objectFit: fit };

  return (
    <div
      ref={refEl}
      data-v-42926a7b=""
      {...rest}
      className={className ? `AppImage ${className}` : "AppImage"}
      style={{ aspectRatio, ...style }}
    >
      {placeholder ? (
        <div className={`AppImage-image --placeholder --${loading}`} style={placeholderStyle} data-v-42926a7b="" />
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element -- 1:1 port of the NuxtImg output */}
      <img
        ref={refImg}
        src={resolveImageUrl(url, fullUrl)}
        width={mockupWidth}
        height={mockupHeight}
        alt={alt && alt.length > 0 ? alt : "Ctrl"}
        loading={loading}
        data-nuxt-img=""
        className={`AppImage-image --${loading}`}
        style={{ objectFit: fit }}
        data-v-42926a7b=""
        onLoad={onLoad}
        onError={(e) => e.currentTarget.setAttribute("data-error", "1")}
      />
    </div>
  );
}
