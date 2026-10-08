import type { NextConfig } from "next";

type Redirects = Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>>;

/**
 * Where the dApp and the docs live once they are deployed on their own hosts (see .env.example).
 * Unset, `/app` is served by this app and `/docs` expects the docs site to be proxied there.
 */
const DAPP_URL = process.env.DAPP_URL;
const DOCS_URL = process.env.DOCS_URL;

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    // One 404 page for every URL, as the site and the app have separate root layouts (app/global-not-found.tsx).
    globalNotFound: true,
  },
  async redirects() {
    const redirects: Redirects = [];
    if (DAPP_URL) redirects.push({ source: "/app/:path*", destination: `${DAPP_URL}/:path*`, permanent: false });
    if (DOCS_URL) redirects.push({ source: "/docs/:path*", destination: `${DOCS_URL}/:path*`, permanent: false });
    return redirects;
  },
};

export default nextConfig;
