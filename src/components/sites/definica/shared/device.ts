"use client";

import { useEffect, useState } from "react";

/** Port of the original `useDevice` composable (same breakpoints and quirks). */
export interface Device {
  /** width <= 768 */
  mobile: boolean;
  /** 768 < width <= 1080 */
  tablet: boolean;
  /** width >= 768 (sic — overlaps `mobile` at exactly 768, as in the original) */
  desktop: boolean;
  /** width >= 1920 */
  largeDesktop: boolean;
  landscape: boolean;
  portrait: boolean;
  /** (hover: hover) and (pointer: fine) */
  mouse: boolean;
  /** (hover: none) and (pointer: coarse) */
  touch: boolean;
  safari: boolean;
  chrome: boolean;
  isMacOs: boolean;
  browser: "brave" | "opera" | "chrome" | "edge" | "firefox" | "safari" | "internet explorer" | null;
  os: "ios" | "android" | null;
  mobileOrTablet: boolean;
}

/** Values the original refs hold before mount (and therefore during SSR). */
export const initialDevice: Device = {
  mobile: true,
  tablet: false,
  desktop: false,
  largeDesktop: false,
  landscape: false,
  portrait: true,
  mouse: false,
  touch: true,
  safari: false,
  chrome: false,
  isMacOs: false,
  browser: null,
  os: null,
  mobileOrTablet: false,
};

/** Synchronous snapshot — use inside effects/handlers where the original read `.value` after mount. */
export function getDevice(): Device {
  if (typeof window === "undefined") return initialDevice;
  const width = window.innerWidth;
  const height = window.innerHeight;
  const ua = navigator.userAgent;
  const isChrome = ua.indexOf("Chrome") > -1;
  const isSafari = ua.indexOf("Safari") > -1;

  let browser: Device["browser"] = null;
  if (/Chrome/.test(ua) && !/Chromium/.test(ua)) {
    if ("brave" in navigator) browser = "brave";
    else if (/Opera|OPR\//.test(ua)) browser = "opera";
    else browser = "chrome";
  } else if (/Edg/.test(ua)) browser = "edge";
  else if (/Firefox/.test(ua)) browser = "firefox";
  else if (/Safari/.test(ua)) browser = "safari";
  else if (/Trident/.test(ua)) browser = "internet explorer";

  let os: Device["os"] = null;
  if (/iPad|iPhone|iPod/.test(ua)) os = "ios";
  else if (/android/i.test(ua)) os = "android";

  return {
    mobile: width <= 768,
    tablet: width > 768 && width <= 1080,
    desktop: width >= 768,
    largeDesktop: width >= 1920,
    landscape: width > height,
    portrait: width <= height,
    mouse: window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    touch: window.matchMedia("(hover: none) and (pointer: coarse)").matches,
    safari: !isChrome && isSafari,
    chrome: isChrome,
    isMacOs: /Mac/.test(ua),
    browser,
    os,
    mobileOrTablet: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
  };
}

const sameDevice = (a: Device, b: Device) => (Object.keys(a) as (keyof Device)[]).every((k) => a[k] === b[k]);

/** Reactive device info; starts from `initialDevice` and updates on mount and resize. */
export function useDevice(): Device {
  const [device, setDevice] = useState<Device>(initialDevice);
  useEffect(() => {
    const update = () => setDevice((prev) => {
      const next = getDevice();
      return sameDevice(prev, next) ? prev : next;
    });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return device;
}
