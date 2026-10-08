# Definica Docs

The Definica documentation site, built with [Docusaurus](https://docusaurus.io/) 3 (classic preset, TypeScript, Docusaurus Faster, Mermaid, local search). It uses the landing page's design system: Tomato Grotesk, ink on white, the lime call-to-action colour, the four pastel tones and the hand-drawn blob. Light theme only.

## Commands

```bash
npm install          # once
npm run start        # dev server on http://localhost:3400
npm run build        # production build into ./build (fails on any broken link or anchor)
npm run serve        # serve ./build locally (use --port 3400 to match the site's /docs redirect)
npm run typecheck    # tsc over docusaurus.config.ts and sidebars.ts
```

## Layout

```
docs/                     # all pages (.md, parsed as MDX); the sidebar is generated from this tree
  index.md                # Introduction (route /)
  concepts/               # one page per building block
  phase-1/ phase-2/ phase-3/
  app/ risks/ security/
  roadmap.md faq.md glossary.md
  reference/
src/css/custom.css        # Definica theme: fonts, palette, Infima mapping, cards, admonitions, footer
src/components/Cards      # branded link cards with the blob badge (used on the Introduction and Roadmap)
src/theme/                # swizzled DocCard (blob badge, no emoji), Footer, MDXComponents, Mermaid
static/fonts static/img   # Tomato Grotesk woff2, logo and favicons
```

## Authoring rules

- Every page starts with front matter (`title`, `description`, `sidebar_position`); quote values that contain `: `. The description shows on cards, so keep it to one plain sentence.
- Write in the present tense about how Definica behaves. Say "Phase 1/2/3", never "Stage". No status labels, no APR/APY figures, dates or Definica addresses; values that vary per Vault or market are "shown in the app before you confirm".
- Explicit heading IDs use the escaped form `## Heading \{#custom-id\}` (the site runs with `future.v4`, which disables the MDX1 compat shims).
- Admonition titles use the directive label form: `:::tip[Before you sign]`.
- Avoid raw `<`, `>` and `{` in prose; put expressions in backticks.
- Link pages by absolute path (`/phase-1/fees`) and glossary terms by anchor (`/glossary#vault-fee`). The build throws on broken links and anchors.
- Mermaid: top to bottom by default, at most three nodes side by side, at most three short lines per label. The theme lays left-to-right flowcharts out top to bottom on phones and never shrinks a diagram below 80%.
