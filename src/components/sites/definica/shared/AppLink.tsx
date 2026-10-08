import { createElement, type HTMLAttributes, type MouseEvent, type ReactNode, type Ref } from "react";
import { LOCAL_ROUTES, ORIGIN, type LinkTo } from "./content";
import { smoothScroll } from "./smooth-scroll";

export interface AppLinkProps extends Omit<HTMLAttributes<HTMLElement>, "title" | "lang"> {
  tag?: string | null;
  title?: string | null;
  type?: "email" | "tel" | "place" | "submit" | null;
  to?: LinkTo;
  openInNewTab?: boolean | null;
  trailingSlash?: boolean | null;
  /** Accepted for parity with the CMS link objects; unused. */
  lang?: string | null;
  linkType?: string | null;
  children?: ReactNode;
  ref?: Ref<HTMLElement>;
}

export const addTrailingSlash = (url: string) => {
  let out = url.replace("?", "/?");
  if (!out.endsWith("/") && !out.includes("?")) out += "/";
  return out;
};

/** Internal routes resolve like the original router: the routes this app serves stay local, the rest link to the main site. */
function resolveRoute(to: Exclude<LinkTo, string | null | undefined>) {
  const path = to.path ?? (to.params?.uid ? `/${to.params.uid}` : "/");
  if (LOCAL_ROUTES.has(path)) return path;
  return ORIGIN + addTrailingSlash(path);
}

/** The element an in-page link ("/#faq", "#faq") points at, when that section is on the current page. */
function samePageTarget(href: string) {
  const hash = href.indexOf("#");
  if (hash === -1) return null;
  const path = href.slice(0, hash);
  const here = window.location.pathname;
  if (path && path !== here && `${path}/` !== here) return null;
  return document.getElementById(decodeURIComponent(href.slice(hash + 1)));
}

/** Port of `AppLink`: picks `<a>` / `<button>` / `<div>` from its props, always carries class `AppLink`. */
export function AppLink({
  tag,
  title,
  type,
  to,
  openInNewTab,
  trailingSlash = true,
  lang: _lang,
  linkType,
  className,
  children,
  ref,
  ...rest
}: AppLinkProps) {
  const attrs: Record<string, unknown> = {};
  let element = "div";

  if (type === "submit") attrs.type = "submit";
  if (tag) {
    element = tag;
  } else if (to) {
    element = "a";
    if (typeof to === "string") {
      if (type === "email") Object.assign(attrs, { href: `mailto:${to}`, target: "_blank", rel: "noreferrer" });
      else if (type === "tel") Object.assign(attrs, { href: `tel:${to}`, target: "_blank", rel: "noreferrer" });
      else if (type === "place")
        Object.assign(attrs, {
          href: `https://www.google.com/maps/search/?api=1&query=${encodeURI(to)}`,
          target: "_blank",
          rel: "noreferrer",
        });
      else attrs.href = trailingSlash ? addTrailingSlash(to) : to;
    } else {
      attrs.href = resolveRoute(to);
    }
    if (title) attrs.title = title;
    if (openInNewTab) Object.assign(attrs, { target: "_blank", rel: "noreferrer" });
  }
  if (linkType) attrs.linktype = linkType;

  // In-page links glide there with the smooth scroll instead of jumping.
  const { onClick, ...others } = rest;
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || typeof attrs.href !== "string" || attrs.target === "_blank") return;
    const target = samePageTarget(attrs.href);
    if (!target) return;
    event.preventDefault();
    smoothScroll.easeToElement(target, 0, false, 1);
    window.history.replaceState(null, "", attrs.href.slice(attrs.href.indexOf("#")));
  };

  return createElement(
    element,
    { ref, ...attrs, ...others, onClick: handleClick, className: className ? `AppLink ${className}` : "AppLink" },
    children,
  );
}
