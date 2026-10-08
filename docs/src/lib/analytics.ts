import type {PostHog} from 'posthog-js';

/**
 * PostHog for the docs, the same set-up as the site's (src/lib/analytics.ts in the Next app):
 * loaded only after the visitor accepts cookies and only when a key is configured
 * (`customFields.posthogKey`, from POSTHOG_KEY at build time). No autocapture, no recordings.
 */
let client: PostHog | null = null;
let loading: Promise<PostHog | null> | null = null;

export function startAnalytics(key: string, host: string): Promise<PostHog | null> {
  if (!key) return Promise.resolve(null);
  if (client) {
    client.opt_in_capturing();
    return Promise.resolve(client);
  }
  loading ??= import('posthog-js').then(({default: posthog}) => {
    posthog.init(key, {
      api_host: host,
      capture_pageview: false,
      capture_pageleave: true,
      autocapture: false,
      disable_session_recording: true,
      person_profiles: 'identified_only',
      persistence: 'localStorage+cookie',
    });
    client = posthog;
    return posthog;
  });
  return loading;
}

export function stopAnalytics() {
  if (!client) return;
  client.opt_out_capturing();
  client.reset();
}

export function trackPageview() {
  client?.capture('$pageview', {$current_url: window.location.href});
}
