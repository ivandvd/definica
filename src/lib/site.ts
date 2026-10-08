/**
 * Where Definica lives, for metadata, share images, robots.txt and the sitemap (see .env.example).
 * The defaults are the production hosts.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://definica.com").replace(/\/$/, "");
export const DOCS_URL = (process.env.NEXT_PUBLIC_DOCS_URL ?? "https://docs.definica.com").replace(/\/$/, "");

/**
 * Whether search engines may index this deployment: production only. On Vercel that is the
 * production environment (previews stay hidden); elsewhere, any production build. Set
 * `NEXT_PUBLIC_NOINDEX=true` to hide a production build anyway (a staging server, say).
 */
export const INDEXABLE =
  process.env.NEXT_PUBLIC_NOINDEX !== "true" &&
  (process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : process.env.NODE_ENV === "production");
