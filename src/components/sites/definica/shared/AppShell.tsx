"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { CustomScrollBar } from "./CustomScrollBar";
import { PageLoader, PageTransition } from "./PageLoader";
import { smoothScroll } from "./smooth-scroll";

interface AppShellProps {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}

/**
 * Port of the root `app` component: scroll container, global CSS variables
 * (`--sbw`, `--vh`), banners, loader, scrollbar, header and the page + footer.
 */
export function AppShell({ header, footer, children }: AppShellProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const setVars = () => {
      const style = document.documentElement.style;
      style.setProperty("--sbw", `${window.innerWidth - document.body.offsetWidth}px`);
      style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
    };
    setVars();
    smoothScroll.init();
    smoothScroll.start(el);
    const observer = new ResizeObserver(setVars);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <PageLoader />
      <PageTransition />
      <CustomScrollBar />
      {header}
      <main style={{ paddingTop: "var(--banner-h, 0px)" }}>
        <div className="Site-inner">
          {children}
          {footer}
        </div>
      </main>
    </div>
  );
}
