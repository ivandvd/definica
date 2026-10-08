"use client";

import { Fragment, type MouseEvent, type ReactNode } from "react";
import { BLOB_FILLS, BLOB_PATH, SurtitleWithDot } from "../shared/SurtitleWithDot";
import { smoothScroll } from "../shared/smooth-scroll";
import styles from "./legal.module.css";

export type LegalBlock = { readonly type: "p"; readonly text: string } | { readonly type: "ul"; readonly items: readonly string[] };

export interface LegalDocument {
  readonly title: string;
  readonly description: string;
  readonly updated: string;
  readonly intro: readonly string[];
  readonly sections: readonly { readonly id: string; readonly heading: string; readonly blocks: readonly LegalBlock[] }[];
}

/** Email addresses and Definica's own addresses become links; everything else stays plain text. */
const LINKABLE = /([a-z]+@definica\.com|https?:\/\/[^\s,;)]+|\b(?:docs\.)?definica\.com(?:\/[^\s,;)]*)?|\bt\.me\/definica\b|\bx\.com\/definicacom\b)/g;

function linkify(text: string): ReactNode {
  const parts = text.split(LINKABLE);
  return parts.map((part, index) => {
    if (index % 2 === 0) return <Fragment key={index}>{part}</Fragment>;
    const trimmed = part.replace(/[.]+$/, "");
    const rest = part.slice(trimmed.length);
    const href = trimmed.includes("@") ? `mailto:${trimmed}` : trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
    const external = !trimmed.includes("@") && !/^(https?:\/\/)?definica\.com/.test(trimmed);
    return (
      <Fragment key={index}>
        <a className={styles.link} href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : null)}>
          {trimmed}
        </a>
        {rest}
      </Fragment>
    );
  });
}

function Bullet() {
  return (
    <svg className={styles.bullet} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={BLOB_PATH} fill={BLOB_FILLS.green} stroke="#001405" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

/** Glide to a section below the floating header (the smooth scroll ignores scroll-margin). */
function goTo(event: MouseEvent<HTMLAnchorElement>, id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  event.preventDefault();
  smoothScroll.easeToElement(target, -110, false, 1);
  window.history.replaceState(null, "", `#${id}`);
}

/** Terms and Privacy: a short hero, a contents list (sticky on desktop) and the document itself. */
export function LegalPage({ doc, surtitle }: { doc: LegalDocument; surtitle: string }) {
  return (
    <div className={`${styles.page} Page`}>
      <header className={`${styles.hero} AppWrapper-1160`}>
        <SurtitleWithDot className="AppSurtitle-2" dotColor="green" surtitle={surtitle} />
        <h1 className={`${styles.title} AppTitle-5`}>{doc.title}</h1>
        <p className={`${styles.updated} AppText-8`}>Last updated {doc.updated}</p>
      </header>
      <div className={`${styles.layout} AppWrapper-1330`}>
        <nav className={styles.toc} aria-label="Contents">
          <p className={styles.tocTitle}>Contents</p>
          <ol className={styles.tocList}>
            {doc.sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className={styles.tocLink} onClick={(event) => goTo(event, section.id)}>
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <article className={styles.body}>
          <div className={styles.intro}>
            {doc.intro.map((paragraph) => (
              <p key={paragraph} className="AppText-1">
                {linkify(paragraph)}
              </p>
            ))}
          </div>
          {doc.sections.map((section) => (
            <section key={section.id} id={section.id} className={styles.section}>
              <h2 className={`${styles.heading} AppTitle-10`}>{section.heading}</h2>
              {section.blocks.map((block, index) =>
                block.type === "p" ? (
                  <p key={index} className={`${styles.paragraph} AppText-8`}>
                    {linkify(block.text)}
                  </p>
                ) : (
                  <ul key={index} className={styles.list}>
                    {block.items.map((item) => (
                      <li key={item} className={`${styles.item} AppText-8`}>
                        <Bullet />
                        <span>{linkify(item)}</span>
                      </li>
                    ))}
                  </ul>
                ),
              )}
            </section>
          ))}
        </article>
      </div>
    </div>
  );
}
