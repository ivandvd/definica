<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Definica

## What This Is
Three Definica surfaces in one repo:
- **Landing site** (`/`, `/roadmap`, `/staking`, `/liquidity`, `/borrowing`, `/about`): header, hero, content slices and footer, with scroll/GSAP animations, animated card scenes and Lottie icons. The four explainer pages share a page kit (`shared/page-kit/`: sections, accordions, sticker art and looping motions in `kit.module.css`) and take their copy from `src/data/sites/definica/{staking,liquidity,borrowing,about}.json`; they go deeper than the home page rather than repeat it.
- **Web app** (`/app`): the staking app — Home, Stake, Unstake, Locks, Activity, Settings, with Liquidity and Borrow in the sidebar as "Coming soon". Frontend only for now: it runs on a preview wallet and a simulated chain behind typed interfaces (`ProtocolClient`, `WalletAdapter`), ready for onchain wiring. See "The web app" below.
- **Docs** (`docs/`): a self-contained Docusaurus site (own `package.json`), served at `/docs` through a redirect.

## Tech Stack
- **Framework:** Next.js 16 (App Router, React 19, TypeScript strict)
- **Site styling:** the site stylesheet (`src/styles/sites/definica/site.css`) with Definica overrides in `definica.css`. Its `rem` scales with the viewport width. Tailwind CSS v4 theme and utilities are loaded without preflight (see `src/app/globals.css`)
- **App styling:** its own Tailwind entry with preflight and a fixed 16px `rem` (`src/app/(dapp)/dapp.css`); tokens come from the landing page's phone walkthrough palette. The site and the app are separate root layouts (route groups) and must stay that way.
- **Motion:** GSAP (ScrollTrigger, SplitText, Draggable, CustomEase), Lenis smooth scroll, dotLottie — site only. The app animates with CSS keyframes in `dapp.css` and small hooks (`useCountUp`), honouring reduced motion.
- **UI primitives:** Base UI (`@base-ui/react`: dialog, drawer, popover, menu, tabs, switch, slider, toast, tooltip) and lucide-react in the app; shadcn/ui (`src/components/ui`, `cn()` utility) scaffolded but unused

## Commands
- `npm run dev` — Start dev server (use `npx next dev -p 3300` if port 3000 is taken)
- `npm run build` — Production build
- `npm run lint` — ESLint check (React Compiler rules: no `Date.now()` in render, no synchronous `setState` in effects)
- `npm run typecheck` — TypeScript check
- `npm run check` — Run lint + typecheck + build
- `cd docs && npm start` — Docs site on port 3400 (`npm run build` there to verify links)

## Environment
`.env.example` documents every variable:
- `DAPP_URL` / `DOCS_URL`: when set, `next.config.ts` redirects `/app` and `/docs` to those hosts (docs.definica.com in production). Unset, `/app` is served here and `/docs` expects the docs site to be proxied (`.env.local` points it at `localhost:3400` in development).
- `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_DOCS_URL`: absolute URLs for metadata, share images, robots.txt and the sitemap (`src/lib/site.ts`). Search engines index production builds only; `NEXT_PUBLIC_NOINDEX=true` hides one anyway.
- `NEXT_PUBLIC_POSTHOG_KEY` / `_HOST`: PostHog analytics, loaded only after the visitor accepts the cookie banner (`src/lib/consent.ts`, `src/lib/analytics.ts`; the docs read `POSTHOG_KEY` / `POSTHOG_HOST` at build time). The consent cookie is shared across *.definica.com. Never send wallet addresses, names or emails to analytics.
- `NEXT_PUBLIC_NEWSLETTER_ENDPOINT`: where sign-ups are posted; unset, the footer shows Telegram and X instead of the form.

## Deployment (Vercel, team JulianTeam)
Both projects deploy on every push to `main`:
- **`definica`** (the repo root: site and app) answers at `definica-flame.vercel.app` (the website) and `app-definica.vercel.app` (the app: its root opens `/app`, and `/app` on the website redirects there). Production env: `NEXT_PUBLIC_SITE_URL`, `DAPP_URL` (`…/app`), `DOCS_URL` and `NEXT_PUBLIC_DOCS_URL`. With `DAPP_URL` set, `next.config.ts` redirects by host, and Launch App always passes `?launch=1` so the curtain survives the hop.
- **`definica-docs`** (root directory `docs/`) answers at `docs-definica.vercel.app`; `/docs` on the website redirects there. Its links to the website and the app come from `SITE_URL` / `APP_URL` at build time (defaults: the Vercel addresses above); `DOCUSAURUS_NO_PERSISTENT_CACHE=true` avoids a build that stalls on a stale cache.
- `vercel.app` addresses are one level only (no `app.app-definica…`). When definica.com moves to Vercel, point the env vars at `definica.com`, `app.definica.com/app` and `docs.definica.com`, and set `SITE_URL` / `APP_URL` on the docs project.

## Launch essentials (where they live)
Per-page `metadata` (title template "%s — Definica", description, canonical) in each route; icons and the manifest are file conventions in `src/app/` (`icon.svg`, `apple-icon.png`, `favicon.ico`, `manifest.ts`), plus `robots.ts` and `sitemap.ts`. Share images are `opengraph-image.tsx` files built with `src/lib/og.tsx` (Tomato Grotesk `.woff` in `src/assets/fonts/`, since the share-image renderer cannot read woff2). The 404 page is `src/app/global-not-found.tsx` (needs `experimental.globalNotFound`, as the site and the app have separate root layouts). Terms and Privacy are `/terms` and `/privacy`, their text in `src/data/sites/definica/legal/`.

## The web app
- **Scope:** Home, Stake, Unstake (request an exit, then claim), Locks (share locks), Activity and Settings work end to end. Liquidity and Borrow are built (`LiquidityScreen`, `BorrowScreen`) but switched off in `src/components/dapp/lib/features.ts`; switched off, their routes show `ComingSoonScreen` and the sidebar shows a "Coming soon" pill. Turning a switch on also seeds that phase's sample data.
- **Simulated chain, live UI:** `lib/environment.ts` builds what the app runs on for now: a simulated chain (`lib/mock/world.ts`) kept in localStorage, with harvests every 12 hours and test accounts. The UI never says so (the owner's call: it must read as live): no "preview", "sample" or "simulated" wording anywhere a visitor can see. The developer tools (Settings: switch account, wallet network, make the next transaction fail, skip time ahead, Vault/access/incident/stale states, start over) show only in a browser opened once with `?devtools=1` (`?devtools=0` hides them; `lib/devtools.ts`). Etherscan links appear once an onchain environment (`preview: null`) replaces it.
- **Transactions:** every action goes through `ProtocolClient.preview()` (live, as the user types) and `execute()`; `tx/useTxFlow` + `TxPanes` (inline panels) or `TxSheet` (from lists) show review → wallet → pending → updating → result, and the provider keeps a transaction running if its panel closes. Every confirmed transaction raises a toast with "View transaction", which opens its receipt (`shell/ReceiptSheet.tsx`: status, amounts, block, fee, hash, Etherscan); the result screens, the bell and every Activity row open the same receipt. In the preview, each wallet request waits in `shell/WalletPrompt.tsx` (a wallet window with Reject / Confirm, portalled to `<body>` so it stays reachable over a sheet), so signing feels real. Each state has its own animated picture, cross-fading on one centre (`ui/txart.tsx`, `TxStage`): the wallet window, the block taking the coin in, the check, the seal and confetti; declined (the wallet shaking its head), failed onchain (a coral sticker with a "!", with what stayed with you and the fee spent), the unplugged network, the warning sign. Failed rows and receipts are titled by what was tried ("Stake") with a Failed pill.
- **Look:** the landing page's palette (ink rgb(15,15,15), its greys, lime, green #05c92f, the pastel tones), pill buttons with its green sweep on hover (`btn-sweep`), large figures with `.figure` spacing, token icons from `ui/Glyph.tsx` (`TokenIcon`), sticker-style art (`ui/art.tsx`) and animated panel scenes (`ui/scenes.tsx`: the staking factory, the exit gate, the lock safe, its calendar showing the chosen duration). Time is live: `ui/Countdown.tsx` ticks against the protocol's clock (the next harvest on Home and after staking, each lock's and exit's time left), and `ui/Calendar.tsx` draws the unlock date as a calendar page and saves a reminder (.ics) for a lock's maturity.
- **Launch App:** on the site, `shared/LaunchTransition.tsx` sweeps a lime then an ink curtain with the mark over the page and sets a flag (or `?launch=1` across hosts); the app's root layout reads it before paint and lifts the same curtain (`.launch-curtain` in dapp.css).
- **No cookies, no analytics in the app.** No contract lists, addresses or function names in the UI; the docs' Verify addresses page covers them.
- **Layout:** sidebar from 1024px, two content columns from 1280px; phones get the walkthrough's tab bar and bottom sheets.

## Code Style
- TypeScript strict mode, no `any`
- Named exports, PascalCase components, camelCase utils
- 2-space indentation
- Responsive: mobile-first

## Project Structure
```
src/
  app/
    (site)/                       # Landing site root layout, home page, roadmap/, staking/, liquidity/, borrowing/, about/
    (dapp)/                       # App root layout + dapp.css; app/ routes (stake, unstake, locks, activity, settings, …)
    globals.css                   # Tailwind theme + utilities for the site (no preflight)
  components/
    sites/definica/
      root-8a5edab2/              # Home page, its sections (slices), phone screens and scenes
      roadmap/                    # Roadmap page sections
      staking/ liquidity/         # The explainer pages: page component, sections, art, CSS module
      borrowing/ about/
      shared/                     # Header, footer, app shell, Launch App transition, page-kit/, shared helpers
    dapp/
      lib/                        # Domain types, ProtocolClient + WalletAdapter, features.ts, preferences, formatting
        mock/                     # The preview: simulated chain (world.ts), reads, actions, client, wallet
      providers/                  # DappProvider (wallet, protocol, loaded data, transactions, toasts)
      shell/                      # Sidebar, top bar, tab bar + action sheet, wallet, banners, gates, toasts
      ui/                         # Kit: buttons, cards, pills, token icons, amount input, sheets, chart, art
      tx/                         # One transaction flow: preview → review → wallet → pending → updating → result
      screens/                    # One component per route
    ui/                           # shadcn/ui primitives (unused)
  data/sites/definica/            # Page content (home.json, roadmap.json) and site settings (settings.json)
  styles/sites/definica/          # Site stylesheet (site.css) and overrides (definica.css)
  lib/
    utils.ts                      # cn() utility
docs/                             # Docusaurus documentation site (own package; excluded from root tsconfig/eslint)
public/
  sites/definica/                 # Fonts, images, stickers, glyphs, Lottie files, favicons
    app/tokens/                   # Token icons (ETH CC0, osETH from StakeWise MIT, WETH from Trust Wallet MIT)
```

## Content rules
- The three parts of the protocol are **Phase 1–3** (staking, committed liquidity, borrowing) on the home page, roadmap and docs. Never "Stage". The web app shows no phase labels at all: what isn't open yet sits in the sidebar with a "Coming soon" pill.
- The roadmap and the docs describe the mechanics in the present tense, as the protocol's behaviour. No status labels ("Planned", "Supplied design", "Proposed") and no "not yet live" / "published before activation" phrasing there.
- Never invent a number: no APY/APR, date, contract address or market parameter (LTV, caps, fees, oracles, collateral lists) unless Definica has published it. Say it is set per market or vault and shown in the app before you confirm, and don't claim a module is live, launched or audited.
- British spelling, plain register.
