"use client";

import { useEffect, useRef, useState, type FormEvent, type HTMLAttributes, type RefObject } from "react";
import { AppButton } from "./AppButton";
import { AppSvg } from "./AppSvg";
import { settings, type CmsLink } from "./content";
import { useDevice } from "./device";
import { SanityPortableText } from "./SanityPortableText";

const newsletter = settings.newsletter;
const follow: { title: string; text: string; links: CmsLink[] } = settings.follow;

/**
 * Where sign-ups are posted (`{ "email": "…" }` as JSON). Until Definica has a sign-up service this
 * is unset, and the block offers the official Telegram and X channels instead of a form.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT;

type Status = "IDLE" | "PENDING" | "SUCCESS";

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

/** The block while there is no sign-up service: the same card, with the official channels instead of a form. */
function FollowLinks(props: AppNewsletterProps) {
  return (
    <div {...props} data-v-eee0b83b="" className="AppNewsletter --follow">
      <div className="AppNewsletter-wrapper" data-v-eee0b83b="">
        <div className="AppNewsletter-content" data-v-eee0b83b="">
          <div className="AppNewsletter-contentTitle AppSurtitle-1" data-v-eee0b83b="">
            {follow.title}
          </div>
          <p className="AppText-5 --c-grey3" data-v-eee0b83b="">
            {follow.text}
          </p>
        </div>
        <div className="AppNewsletter-follow" data-v-eee0b83b="">
          {follow.links.map((link, index) => (
            <AppButton
              key={link.title}
              {...link}
              size="small"
              theme={index === 0 ? "dark" : "border-light"}
              label={link.title}
              data-v-eee0b83b=""
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Port of `AppNewsletter` (scope data-v-eee0b83b), with its idle → pending → success UI. Once
 * `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` is set the address is posted there; the form shows why a
 * sign-up failed (invalid address, already registered, any other error) and keeps what was typed.
 * Without an endpoint it renders the follow links instead.
 */
export function AppNewsletter(props: AppNewsletterProps) {
  return ENDPOINT ? <NewsletterForm endpoint={ENDPOINT} {...props} /> : <FollowLinks {...props} />;
}

function NewsletterForm({ endpoint, ...props }: AppNewsletterProps & { endpoint: string }) {
  const { safari } = useDevice();
  const [status, setStatus] = useState<Status>("IDLE");
  const [message, setMessage] = useState<string | null>(null);

  const refForm = useRef<HTMLFormElement>(null);
  const refSuccessMessage = useRef<HTMLDivElement>(null);
  const refBottomIcon = useRef<HTMLDivElement>(null);
  const refBottomInner = useRef<HTMLDivElement>(null);

  const isSuccess = status === "SUCCESS";
  useShowTransition(refSuccessMessage, isSuccess, "success");
  useShowTransition(refBottomIcon, isSuccess, "button");
  useShowTransition(refBottomInner, !isSuccess, "button");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = refForm.current;
    const input = form?.elements.namedItem("email");
    if (!form || !(input instanceof HTMLInputElement)) return;
    if (!input.value.trim() || !input.checkValidity()) {
      setMessage(newsletter.emailNotValid);
      input.focus();
      return;
    }
    setMessage(null);
    setStatus("PENDING");
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: input.value.trim() }),
    })
      .then((response) => {
        if (response.ok) {
          setStatus("SUCCESS");
          form.reset();
          return;
        }
        setStatus("IDLE");
        setMessage(response.status === 409 ? newsletter.alreadyRegistered : newsletter.errorMessage);
      })
      .catch(() => {
        setStatus("IDLE");
        setMessage(newsletter.errorMessage);
      });
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
        <form ref={refForm} autoComplete="off" noValidate data-v-eee0b83b="" onSubmit={onSubmit}>
          <div className="AppNewsletter-inputWrap" data-v-eee0b83b="">
            <input
              name="email"
              type="email"
              required
              aria-label={newsletter.placeholder}
              aria-invalid={message === newsletter.emailNotValid}
              aria-describedby="newsletter-message"
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
              <div id="newsletter-message" role="status" aria-live="polite" className="AppNewsletter-message" data-v-eee0b83b="">
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
