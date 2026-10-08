import type { PostHog } from "posthog-js";

/**
 * PostHog, loaded only once the visitor accepts analytics cookies (see consent.ts) and only when a
 * project key is configured (`NEXT_PUBLIC_POSTHOG_KEY`). No autocapture and no session recording:
 * events are page views plus the explicit ones sent through `track`, and none of them carries a
 * wallet address, name or email (the Privacy Policy says so). Browser-only.
 */
const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";

let client: PostHog | null = null;
let loading: Promise<PostHog | null> | null = null;

export const analyticsConfigured = Boolean(KEY);

export function startAnalytics(): Promise<PostHog | null> {
  if (!KEY) return Promise.resolve(null);
  if (client) {
    client.opt_in_capturing();
    return Promise.resolve(client);
  }
  loading ??= import("posthog-js").then(({ default: posthog }) => {
    posthog.init(KEY, {
      api_host: HOST,
      capture_pageview: false,
      capture_pageleave: true,
      autocapture: false,
      disable_session_recording: true,
      person_profiles: "identified_only",
      persistence: "localStorage+cookie",
    });
    client = posthog;
    return posthog;
  });
  return loading;
}

/** The visitor withdrew consent: stop capturing and clear PostHog's cookies and storage. */
export function stopAnalytics() {
  if (!client) return;
  client.opt_out_capturing();
  client.reset();
}

export function track(event: string, properties?: Record<string, string | number | boolean>) {
  client?.capture(event, properties);
}

export function trackPageview() {
  client?.capture("$pageview", { $current_url: window.location.href });
}

/**
 * The event a click on a link should send, from where it leads: Launch App, the docs and the
 * community channels. Returns null for any other link.
 */
export function linkEvent(href: string): { event: string; properties: Record<string, string> } | null {
  let url: URL;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return null;
  }
  const host = url.hostname;
  if (host.startsWith("app.") || url.pathname === "/app" || url.pathname.startsWith("/app/")) {
    return { event: "launch_app_clicked", properties: { from: window.location.pathname } };
  }
  if (host.startsWith("docs.") || url.pathname === "/docs" || url.pathname.startsWith("/docs/")) {
    return { event: "docs_clicked", properties: { from: window.location.pathname } };
  }
  if (host === "t.me" || host === "x.com" || host === "twitter.com") {
    return { event: "community_clicked", properties: { network: host === "t.me" ? "telegram" : "x", from: window.location.pathname } };
  }
  return null;
}
