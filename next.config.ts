import type { NextConfig } from "next";

type Redirects = Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>>;

/**
 * Where the app and the docs live on their own addresses (see .env.example). Unset, `/app` is
 * served here and `/docs` expects the docs site to be proxied there. DAPP_URL may name another
 * address of this same deployment (app-definica.vercel.app/app): there its root opens the app.
 */
const DAPP_URL = process.env.DAPP_URL?.replace(/\/$/, "");
const DOCS_URL = process.env.DOCS_URL;
const APP_HOST = DAPP_URL ? new URL(DAPP_URL).host : undefined;

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    // One 404 page for every URL, as the site and the app have separate root layouts (app/global-not-found.tsx).
    globalNotFound: true,
  },
  async redirects() {
    const redirects: Redirects = [];
    if (DAPP_URL && APP_HOST) {
      // On the app's own address, its root opens the app...
      redirects.push({ source: "/", has: [{ type: "host", value: APP_HOST }], destination: "/app", permanent: false });
      // ...and everywhere else the app moves there (never on its own address, so no loop).
      redirects.push({ source: "/app/:path*", missing: [{ type: "host", value: APP_HOST }], destination: `${DAPP_URL}/:path*`, permanent: false });
    }
    if (DOCS_URL) redirects.push({ source: "/docs/:path*", destination: `${DOCS_URL}/:path*`, permanent: false });
    return redirects;
  },
};

export default nextConfig;
