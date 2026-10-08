"use client";

import Link from "next/link";
import { LINKS } from "./nav";

/** The wide layout's footer: where to read more and where to ask. */
export function Footer() {
  const linkClass = "transition-colors hover:text-ink";
  return (
    <footer className="mx-auto hidden w-full max-w-[1240px] px-8 pt-4 pb-8 text-[13px] text-ink-3 lg:block">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-5">
        <span className="font-semibold text-ink-2">Definica</span>
        <a className={linkClass} href={LINKS.docs}>
          Docs
        </a>
        <Link className={linkClass} href={LINKS.roadmap}>
          Roadmap
        </Link>
        <a className={linkClass} href={LINKS.telegram} target="_blank" rel="noreferrer">
          Telegram
        </a>
        <a className={linkClass} href={LINKS.x} target="_blank" rel="noreferrer">
          X
        </a>
        <span className="ml-auto flex gap-5">
          <Link className={linkClass} href={LINKS.terms}>
            Terms
          </Link>
          <Link className={linkClass} href={LINKS.privacy}>
            Privacy
          </Link>
        </span>
      </div>
    </footer>
  );
}
