# Definica

The Definica landing page: a Next.js 16 app (App Router, React 19, TypeScript) for a hybrid Ethereum-native staking, liquidity and collateralized borrowing protocol. Its sections are illustrated with live GSAP-animated scenes and Lottie icons, all served locally.

## Getting started

Requires Node.js 24 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Commands

```bash
npm run dev        # Start the dev server
npm run build      # Production build
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run check      # Lint, typecheck and build
```

## Docker

```bash
docker compose up app --build   # Production image on port 3000
docker compose up dev --build   # Dev mode on port 3001
```

## Project structure

```
src/
  app/                        Routes, root layout, global CSS
  components/
    sites/definica/
      root-8a5edab2/          Home page, its sections, phone screens and animated scenes
      shared/                 Header, footer, app shell, shared helpers
    ui/                       shadcn/ui primitives
  data/sites/definica/        Page content and site settings (JSON)
  styles/sites/definica/      Site stylesheet and Definica overrides
public/
  sites/definica/             Fonts, images, stickers, glyphs, Lottie files, favicons
```
