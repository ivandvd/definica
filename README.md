# Definica

Definica is a hybrid Ethereum-native staking, liquidity and collateralized borrowing protocol. This repo holds its three web surfaces:

- **Landing site** — `/` and `/roadmap`: a Next.js 16 app (App Router, React 19, TypeScript) whose sections are illustrated with live GSAP-animated scenes and Lottie icons, all served locally.
- **dApp** — `/app`: the staking app (Overview, Stake, Withdraw, Share locks, Liquidity Module, Borrow, Activity). It currently runs on a mock wallet and a mock protocol client behind typed interfaces, so the onchain wiring is a one-class swap once contract addresses are published.
- **Docs** — `docs/`: a self-contained Docusaurus site, reachable from the site at `/docs`.

## Getting started

Requires Node.js 24 or newer.

```bash
npm install
npm run dev            # site + dApp on http://localhost:3000 (or: npx next dev -p 3300)

cd docs && npm install
npm start              # docs on http://localhost:3400
```

Copy `.env.example` to `.env.local` to point `/docs` (and later `/app`) at their own hosts; see [Environment](#environment).

## Commands

```bash
npm run dev        # Start the dev server
npm run build      # Production build
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run check      # Lint, typecheck and build

cd docs
npm start          # Docs dev server (port 3400)
npm run build      # Static docs build (fails on broken links)
```

## Environment

| Variable   | Effect                                                                                                   |
| ---------- | -------------------------------------------------------------------------------------------------------- |
| `DAPP_URL` | When set (e.g. `https://app.definica.com`), `/app` on the site redirects there. Unset, the dApp is served by this app. |
| `DOCS_URL` | When set (e.g. `https://docs.definica.com` or `http://localhost:3400`), `/docs` redirects there.          |

## Docker

```bash
docker compose up app --build   # Production image on port 3000
docker compose up dev --build   # Dev mode on port 3001
```

## Project structure

```
src/
  app/
    (site)/                   Landing site: root layout, home page, roadmap/
    (dapp)/                   dApp: its own root layout and stylesheet, app/ routes
    globals.css               Tailwind theme + utilities for the site
  components/
    sites/definica/
      root-8a5edab2/          Home page, its sections, phone screens and animated scenes
      roadmap/                Roadmap page sections
      shared/                 Header, footer, app shell, shared helpers
    dapp/
      lib/                    Domain types, ProtocolClient + WalletAdapter interfaces, mocks
      providers/              DappProvider (wallet, protocol client, loaded data)
      shell/                  Sidebar, top bar, mobile tab bar, wallet button
      ui/                     Buttons, cards, fields, dialog, tabs, slider, chart
      tx/                     Transaction flow (review → wallet → pending → result)
      screens/                One component per route
  data/sites/definica/        Page content and site settings (JSON)
  styles/sites/definica/      Site stylesheet and Definica overrides
docs/                         Docusaurus documentation site (own package.json)
public/
  sites/definica/             Fonts, images, stickers, glyphs, Lottie files, favicons
```

## Wiring the dApp to the chain

The screens only talk to two interfaces in `src/components/dapp/lib/`:

- `ProtocolClient` (`protocol.ts`) — reads (vault, position, exit queue, locks, markets, activity), previews, and the transactions (`stake`, `requestExit`, `claimExit`, `createLock`, `claimLock`), each reporting its `wallet` → `pending` phases.
- `WalletAdapter` (`wallet.ts`) — an external store with `connect` / `disconnect` / `switchAccount`.

`createMockEnvironment()` (`mock-env.ts`) provides both for the preview. Implement them with viem/wagmi against the published contracts and pass the result as the `environment` prop of `DappProvider`.
