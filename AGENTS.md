<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Definica

## What This Is
A Next.js app. The home page is a port of the ctrl.xyz home page (originally Nuxt/Vue): header, hero, six content slices and footer, using the original site's CSS, fonts, assets and scroll/GSAP animations.

## Tech Stack
- **Framework:** Next.js 16 (App Router, React 19, TypeScript strict)
- **Styling:** the ported site stylesheet (`src/styles/sites/ctrl-xyz-d5a73559/site.css`). Tailwind CSS v4 theme and utilities are loaded without preflight (see `src/app/globals.css`)
- **Motion:** GSAP (ScrollTrigger, SplitText, Draggable, CustomEase), Lenis smooth scroll, dotLottie
- **UI primitives:** shadcn/ui (`src/components/ui`, `cn()` utility) — scaffolded, not used by the page yet

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint check
- `npm run typecheck` — TypeScript check
- `npm run check` — Run lint + typecheck + build

## Code Style
- TypeScript strict mode, no `any`
- Named exports, PascalCase components, camelCase utils
- 2-space indentation
- Responsive: mobile-first

## Project Structure
```
src/
  app/                            # Routes, root layout, globals.css
  components/
    sites/ctrl-xyz-d5a73559/
      root-8a5edab2/              # Home page and its sections (slices)
      shared/                     # Header, footer, app shell, shared components and helpers
    ui/                           # shadcn/ui primitives
  data/sites/ctrl-xyz-d5a73559/   # Page content (home.json) and site settings (settings.json)
  styles/sites/ctrl-xyz-d5a73559/ # Site stylesheet (site.css)
  lib/
    utils.ts                      # cn() utility (shadcn)
public/
  sites/ctrl-xyz-d5a73559/        # Fonts, videos, images, Lottie files, favicons
```
