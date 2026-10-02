import homeJson from "@/data/sites/ctrl-xyz-d5a73559/home.json";
import settingsJson from "@/data/sites/ctrl-xyz-d5a73559/settings.json";

/** Home page content (hero + slices) decoded from the original Nuxt payload. */
export const home = homeJson;
/** Site-wide settings (header, footer, download link, newsletter, socials, locales). */
export const settings = settingsJson;

export const SITE_KEY = "ctrl-xyz-d5a73559";
export const PAGE_KEY = "root-8a5edab2";
/** Public base path of this page's assets (images, videos, cms files). */
export const ASSET_BASE = `/sites/${SITE_KEY}/${PAGE_KEY}`;
/** Origin of the cloned site; routes that are not part of the clone link back to it. */
export const ORIGIN = "https://ctrl.xyz";

export type RouteTo = { name?: string; params?: { uid?: string }; path?: string };
export type LinkTo = string | RouteTo | null | undefined;

/** Shape of the CMS link objects found throughout the settings/home data. */
export interface CmsLink {
  linkType?: string | null;
  title?: string | null;
  to?: LinkTo;
  openInNewTab?: boolean | null;
  trailingSlash?: boolean | null;
  lang?: string | null;
}

export type HomeSlice = (typeof home.slices)[number];

/** Narrowing helper: `getSlice("SliceFAQ")`. */
export function getSlice<N extends HomeSlice["componentName"]>(name: N) {
  return home.slices.find((s) => s.componentName === name) as Extract<HomeSlice, { componentName: N }>;
}
