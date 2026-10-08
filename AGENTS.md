<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Definica

## What This Is
Three Definica surfaces in one repo:
- **Landing site** (`/`, `/roadmap`): header, hero, content slices and footer, with scroll/GSAP animations, animated card scenes and Lottie icons.
- **dApp** (`/app`): the staking app — Overview, Stake, Withdraw, Share locks, Liquidity Module, Borrow, Activity. UI-only for now: it runs on a mock wallet and a mock protocol client behind typed interfaces, ready for onchain wiring.
- **Docs** (`docs/`): a self-contained Docusaurus site (own `package.json`), served at `/docs` through a redirect.

## Tech Stack
- **Framework:** Next.js 16 (App Router, React 19, TypeScript strict)
- **Site styling:** the site stylesheet (`src/styles/sites/definica/site.css`) with Definica overrides in `definica.css`. Its `rem` scales with the viewport width. Tailwind CSS v4 theme and utilities are loaded without preflight (see `src/app/globals.css`)
- **dApp styling:** its own Tailwind entry with preflight and a fixed 16px `rem` (`src/app/(dapp)/dapp.css`); tokens come from the phone-screen palette. The site and the dApp are separate root layouts (route groups) and must stay that way.
- **Motion:** GSAP (ScrollTrigger, SplitText, Draggable, CustomEase), Lenis smooth scroll, dotLottie — site only
- **UI primitives:** Base UI (`@base-ui/react`: dialog, menu, tabs, slider, tooltip) and lucide-react in the dApp; shadcn/ui (`src/components/ui`, `cn()` utility) scaffolded but unused

## Commands
- `npm run dev` — Start dev server (use `npx next dev -p 3300` if port 3000 is taken)
- `npm run build` — Production build
- `npm run lint` — ESLint check (React Compiler rules: no `Date.now()` in render, no synchronous `setState` in effects)
- `npm run typecheck` — TypeScript check
- `npm run check` — Run lint + typecheck + build
- `cd docs && npm start` — Docs site on port 3400 (`npm run build` there to verify links)

## Environment
`.env.example` documents `DAPP_URL` and `DOCS_URL`: when set, `next.config.ts` redirects `/app` and `/docs` to those hosts. Unset, `/app` is served here and `/docs` expects the docs site to be proxied (`.env.local` points it at `localhost:3400` in development).

## Code Style
- TypeScript strict mode, no `any`
- Named exports, PascalCase components, camelCase utils
- 2-space indentation
- Responsive: mobile-first

## Project Structure
```
src/
  app/
    (site)/                       # Landing site root layout, home page, roadmap/
    (dapp)/                       # dApp root layout + dapp.css; app/ routes (stake, withdraw, locks, …)
    globals.css                   # Tailwind theme + utilities for the site (no preflight)
  components/
    sites/definica/
      root-8a5edab2/              # Home page, its sections (slices), phone screens and scenes
      roadmap/                    # Roadmap page sections
      shared/                     # Header, footer, app shell, shared components and helpers
    dapp/
      lib/                        # Domain types, ProtocolClient + WalletAdapter interfaces, mocks, formatting
      providers/                  # DappProvider (wallet + protocol + loaded data)
      shell/                      # Sidebar, top bar, mobile tab bar, wallet button, nav config
      ui/                         # Buttons, cards, pills, fields, dialog, tabs, slider, chart
      tx/                         # Transaction flow (review → wallet → pending → result)
      screens/                    # One component per route
    ui/                           # shadcn/ui primitives (unused)
  data/sites/definica/            # Page content (home.json, roadmap.json) and site settings (settings.json)
  styles/sites/definica/          # Site stylesheet (site.css) and overrides (definica.css)
  lib/
    utils.ts                      # cn() utility
docs/                             # Docusaurus documentation site (own package; excluded from root tsconfig/eslint)
public/
  sites/definica/                 # Fonts, images, stickers, glyphs, Lottie files, favicons
```

## Content rules
- The three parts of the protocol are **Phase 1–3** (staking, committed liquidity, borrowing) everywhere: home page, roadmap, app and docs. Never "Stage".
- The roadmap and the docs describe the mechanics in the present tense, as the protocol's behaviour. No status labels ("Planned", "Supplied design", "Proposed") and no "not yet live" / "published before activation" phrasing there.
- Never invent a number: no APY/APR, date, contract address or market parameter (LTV, caps, fees, oracles, collateral lists) unless Definica has published it. Say it is set per market or vault and shown in the app before you confirm, and don't claim a module is live, launched or audited.
- British spelling, plain register.
