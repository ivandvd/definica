import { createElement, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { ORIGIN, type LinkTo } from "./content";

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

/** Internal routes resolve like the original router; only "/" exists in the clone, the rest link to the source site. */
function resolveRoute(to: Exclude<LinkTo, string | null | undefined>) {
  const path = to.path ?? (to.params?.uid ? `/${to.params.uid}` : "/");
  if (path === "/") return "/";
  return ORIGIN + addTrailingSlash(path);
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

  return createElement(
    element,
    { ref, ...attrs, ...rest, className: className ? `AppLink ${className}` : "AppLink" },
    children,
  );
}
