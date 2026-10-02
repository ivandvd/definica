# Definica

A Next.js 16 app (App Router, React 19, TypeScript). The home page is currently a port of the ctrl.xyz home page, with its content, fonts, videos and Lottie animations served locally.

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
  app/                            Routes, root layout, global CSS
  components/
    sites/ctrl-xyz-d5a73559/
      root-8a5edab2/              Home page and its sections
      shared/                     Header, footer, app shell, shared helpers
    ui/                           shadcn/ui primitives
  data/sites/ctrl-xyz-d5a73559/   Page content and site settings (JSON)
  styles/sites/ctrl-xyz-d5a73559/ Site stylesheet
public/
  sites/ctrl-xyz-d5a73559/        Fonts, videos, images, Lottie files, favicons
```
