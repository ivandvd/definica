"use client";

import { useEffect, useRef, useState, type FormEvent, type HTMLAttributes, type RefObject } from "react";
import { AppButton } from "./AppButton";
import { AppSvg } from "./AppSvg";
import { settings } from "./content";
import { useDevice } from "./device";
import { SanityPortableText } from "./SanityPortableText";

const newsletter = settings.newsletter;

type Status = "IDLE" | "PENDING" | "SUCCESS";

/** Stand-in for the original reCAPTCHA + `/.netlify/functions/newsletter` round trip. */
const FAKE_REQUEST_MS = 900;

const HIDDEN = { display: "none" } as const;

const toMs = (value: string) => Math.max(...value.split(",").map((part) => parseFloat(part) || 0)) * 1000;

/**
 * Port of Vue's `<Transition name="…">` wrapped around a `v-show` element: toggles
 * `display` and walks the `{name}-enter-*` / `{name}-leave-*` classes the original CSS
 * targets. Like Vue, nothing is animated on the initial render.
 */
function useShowTransition(ref: RefObject<HTMLElement | null>, show: boolean, name: string) {
  const previous = useRef(show);
  useEffect(() => {
    if (previous.current === show) return;
    previous.current = show;
    const el = ref.current;
    if (!el) return;

    const phase = show ? "enter" : "leave";
    const from = `${name}-${phase}-from`;
    const active = `${name}-${phase}-active`;
    const to = `${name}-${phase}-to`;
    let frame = 0;
    let timer = 0;

    const finish = () => {
      el.classList.remove(from, active, to);
      if (!show) el.style.display = "none";
    };

    if (show) el.style.display = "";
    el.classList.add(from, active);
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        frame = 0;
        el.classList.remove(from);
        el.classList.add(to);
        const style = getComputedStyle(el);
        timer = window.setTimeout(finish, toMs(style.transitionDuration) + toMs(style.transitionDelay) + 1);
      });
    });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      el.classList.remove(from, active, to);
    };
  }, [ref, show, name]);
}

type AppNewsletterProps = Omit<HTMLAttributes<HTMLDivElement>, "children" | "className">;

/**
 * Port of `AppNewsletter` (scope data-v-eee0b83b). Same form, native validation and
 * idle → pending → success UI as the original; the clone has no backend, so instead of
 * posting the address the success state is simulated locally and nothing is sent.
 */
export function AppNewsletter(props: AppNewsletterProps) {
  const { safari } = useDevice();
  const [status, setStatus] = useState<Status>("IDLE");
  const [message, setMessage] = useState<string | null>(null);

  const refForm = useRef<HTMLFormElement>(null);
  const refSuccessMessage = useRef<HTMLDivElement>(null);
  const refBottomIcon = useRef<HTMLDivElement>(null);
  const refBottomInner = useRef<HTMLDivElement>(null);
  const requestTimer = useRef(0);

  useEffect(() => () => window.clearTimeout(requestTimer.current), []);

  const isSuccess = status === "SUCCESS";
  useShowTransition(refSuccessMessage, isSuccess, "success");
  useShowTransition(refBottomIcon, isSuccess, "button");
  useShowTransition(refBottomInner, !isSuccess, "button");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = refForm.current;
    if (!form || !form.reportValidity()) return;
    // Original `setPending`.
    setMessage(null);
    setStatus("PENDING");
    window.clearTimeout(requestTimer.current);
    requestTimer.current = window.setTimeout(() => {
      // Original `setSuccess` + `resetForm`.
      setStatus("SUCCESS");
      form.reset();
      setMessage(null);
    }, FAKE_REQUEST_MS);
  };

  const classes = ["AppNewsletter", status === "PENDING" ? "--pending" : "", safari ? "--is-safari" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div {...props} data-v-eee0b83b="" className={classes}>
      <div className="AppNewsletter-wrapper" data-v-eee0b83b="">
        <div className="AppNewsletter-content" data-v-eee0b83b="">
          <div className="AppNewsletter-contentTitle AppSurtitle-1" data-v-eee0b83b="">
            {newsletter.title}
          </div>
          <div className="AppText-5 --c-grey3" data-v-eee0b83b="">
            <SanityPortableText blocks={newsletter.text} />
          </div>
        </div>
        <form ref={refForm} autoComplete="false" data-v-eee0b83b="" onSubmit={onSubmit}>
          <div className="AppNewsletter-inputWrap" data-v-eee0b83b="">
            <input
              name="email"
              type="email"
              required
              placeholder={isSuccess ? undefined : newsletter.placeholder}
              className={isSuccess ? "AppNewsletter-input --disabled" : "AppNewsletter-input"}
              data-v-eee0b83b=""
            />
            <div ref={refSuccessMessage} style={HIDDEN} className="AppNewsletter-successMessage" data-v-eee0b83b="">
              {newsletter.confirmMessage}
            </div>
          </div>
          <div className="AppNewsletter-bottom" data-v-eee0b83b="">
            <div ref={refBottomIcon} style={HIDDEN} className="AppNewsletter-bottomIcon" data-v-eee0b83b="">
              <AppSvg name="cursor-success_clean" data-v-eee0b83b="" />
            </div>
            <div ref={refBottomInner} className="AppNewsletter-bottomInner" data-v-eee0b83b="">
              <div className="AppNewsletter-message" data-v-eee0b83b="">
                {message}
              </div>
              <AppButton
                tag="button"
                className="AppNewsletter-button"
                size="small"
                type="submit"
                loading={status === "PENDING" || isSuccess}
                label={newsletter.submitLabel}
                data-v-eee0b83b=""
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
