import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** Definica palette used by the Mermaid theme (the stylesheet carries the same values). */
const INK = '#0f0f0f';
const GRAPHIC_INK = '#001405';
const WHITE = '#ffffff';
const GREY = 'rgb(249,250,249)';
const MINT = 'rgb(214,238,219)';
const LEMONADE = '#fbe74e';
const BABY = 'rgb(255,208,226)';
const FONT = '"Tomato Grotesk", Arial, sans-serif';

/**
 * Where the website and the app are. Set SITE_URL and APP_URL at build time when they move to
 * definica.com; until then they are the Vercel addresses. Markdown can use {{SITE_URL}} and
 * {{APP_URL}} in links.
 */
const SITE_URL = (process.env.SITE_URL ?? 'https://definica-flame.vercel.app').replace(/\/$/, '');
const APP_URL = (process.env.APP_URL ?? 'https://app-definica.vercel.app/app').replace(/\/$/, '');

const config: Config = {
  title: 'Definica Docs',
  tagline: 'Pooled ETH staking, committed liquidity and borrowing, explained',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
    faster: true,
  },

  url: 'https://docs.definica.com',
  baseUrl: '/',

  organizationName: 'definica',
  projectName: 'definica-docs',

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  onDuplicateRoutes: 'throw',

  markdown: {
    mermaid: true,
    preprocessor: ({fileContent}) => fileContent.replaceAll('{{SITE_URL}}', SITE_URL).replaceAll('{{APP_URL}}', APP_URL),
    hooks: {
      onBrokenMarkdownLinks: 'throw',
      onBrokenMarkdownImages: 'throw',
    },
  },

  themes: [
    '@docusaurus/theme-mermaid',
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        docsRouteBasePath: '/',
        indexBlog: false,
        indexPages: false,
        language: ['en'],
        explicitSearchResultPath: true,
        highlightSearchTermsOnTargetPage: false,
        searchBarShortcutHint: true,
        searchResultLimits: 10,
      },
    ],
  ],

  headTags: [
    {
      tagName: 'link',
      attributes: {rel: 'icon', type: 'image/svg+xml', href: '/img/icon.svg'},
    },
    {
      tagName: 'link',
      attributes: {rel: 'icon', type: 'image/png', sizes: '32x32', href: '/img/favicon-32x32.png'},
    },
    {
      tagName: 'link',
      attributes: {rel: 'icon', type: 'image/png', sizes: '16x16', href: '/img/favicon-16x16.png'},
    },
    {
      tagName: 'link',
      attributes: {rel: 'apple-touch-icon', sizes: '180x180', href: '/img/apple-touch-icon.png'},
    },
    // The body weight (500), the regular weight Mermaid renders with (400) and the heading weight (600)
    // are preloaded so text, and in particular diagram labels, is measured with the real font.
    {
      tagName: 'link',
      attributes: {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        href: '/fonts/TomatoGrotesk-Medium.woff2',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        href: '/fonts/TomatoGrotesk-Regular.woff2',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        href: '/fonts/TomatoGrotesk-SemiBold.woff2',
        crossorigin: 'anonymous',
      },
    },
  ],

  // Read in the browser by src/theme/Root.tsx: analytics stays off until a key is set and the
  // visitor accepts cookies (POSTHOG_KEY / POSTHOG_HOST at build time).
  customFields: {
    siteUrl: SITE_URL,
    appUrl: APP_URL,
    posthogKey: process.env.POSTHOG_KEY ?? '',
    posthogHost: process.env.POSTHOG_HOST ?? 'https://eu.i.posthog.com',
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          breadcrumbs: true,
          showLastUpdateTime: false,
        },
        blog: false,
        pages: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    metadata: [
      {
        name: 'description',
        content:
          'Documentation for Definica: pooled ETH staking through a dedicated StakeWise Vault, the Main Liquidity Module for osETH supplied to Aave V3, and borrowing markets for ETH-correlated collateral.',
      },
    ],
    // The docs always look like the landing page: light only.
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    docs: {
      sidebar: {
        // No collapse ("«") button: the sidebar is always shown on desktop.
        hideable: false,
        autoCollapseCategories: false,
      },
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 3,
    },
    mermaid: {
      theme: {light: 'base', dark: 'base'},
      options: {
        fontFamily: FONT,
        fontSize: 16,
        themeVariables: {
          fontFamily: FONT,
          fontSize: '16px',
          background: WHITE,
          // Nodes: white, ink text, ink borders.
          primaryColor: WHITE,
          primaryTextColor: INK,
          primaryBorderColor: INK,
          secondaryColor: GREY,
          secondaryTextColor: INK,
          secondaryBorderColor: INK,
          tertiaryColor: MINT,
          tertiaryTextColor: INK,
          tertiaryBorderColor: INK,
          mainBkg: WHITE,
          nodeBorder: INK,
          nodeTextColor: INK,
          textColor: INK,
          titleColor: INK,
          lineColor: INK,
          defaultLinkColor: INK,
          edgeLabelBackground: WHITE,
          clusterBkg: GREY,
          clusterBorder: 'rgba(15,15,15,0.25)',
          // Notes.
          noteBkgColor: LEMONADE,
          noteTextColor: INK,
          noteBorderColor: INK,
          // Sequence diagrams.
          actorBkg: WHITE,
          actorBorder: INK,
          actorTextColor: INK,
          actorLineColor: 'rgba(15,15,15,0.35)',
          signalColor: INK,
          signalTextColor: INK,
          labelBoxBkgColor: GREY,
          labelBoxBorderColor: INK,
          labelTextColor: INK,
          loopTextColor: INK,
          activationBkgColor: MINT,
          activationBorderColor: INK,
          sequenceNumberColor: WHITE,
          // State diagrams.
          labelColor: INK,
          stateBkg: WHITE,
          stateLabelColor: INK,
          stateBorder: INK,
          transitionColor: INK,
          transitionLabelColor: INK,
          labelBackgroundColor: WHITE,
          compositeBackground: GREY,
          compositeTitleBackground: GREY,
          compositeBorder: INK,
          altBackground: GREY,
          innerEndBackground: GRAPHIC_INK,
          specialStateColor: GRAPHIC_INK,
          errorBkgColor: BABY,
          errorTextColor: INK,
        },
        flowchart: {
          curve: 'basis',
          padding: 16,
          // Wide enough for the longest single word in a label (EthPooledStakingVault) at 16px.
          wrappingWidth: 260,
          nodeSpacing: 36,
          rankSpacing: 48,
          diagramPadding: 8,
          useMaxWidth: true,
          htmlLabels: true,
        },
        sequence: {
          useMaxWidth: true,
          mirrorActors: false,
          actorMargin: 28,
          width: 160,
          height: 46,
          boxMargin: 10,
          boxTextMargin: 6,
          noteMargin: 10,
          messageMargin: 34,
          wrap: true,
          actorFontSize: 15,
          actorFontWeight: 600,
          messageFontSize: 15,
          noteFontSize: 14,
        },
        state: {
          useMaxWidth: true,
          padding: 12,
          nodeSpacing: 40,
          rankSpacing: 48,
        },
      },
    },
    navbar: {
      title: '',
      hideOnScroll: false,
      logo: {
        alt: 'Definica',
        src: 'img/logo.svg',
        // The logo goes to the website's landing page, as in the app.
        href: SITE_URL,
        target: '_self',
        width: 115,
        height: 24,
      },
      items: [
        {to: '/concepts', label: 'Concepts', position: 'left'},
        {
          type: 'dropdown',
          label: 'Phases',
          position: 'left',
          items: [
            {to: '/phase-1', label: 'Phase 1 — Pooled ETH staking'},
            {to: '/phase-2', label: 'Phase 2 — Main Liquidity Module'},
            {to: '/phase-3', label: 'Phase 3 — Borrowing markets'},
          ],
        },
        {to: '/risks', label: 'Risks', position: 'left'},
        {to: '/app', label: 'App', position: 'left'},
        {to: '/faq', label: 'FAQ', position: 'left'},
        {to: '/roadmap', label: 'Roadmap', position: 'right'},
        {
          href: APP_URL,
          label: 'Launch app',
          position: 'right',
          className: 'navbar__item--cta',
        },
      ],
    },
    footer: {
      style: 'light',
      logo: {
        alt: 'Definica',
        src: 'img/logo.svg',
        href: SITE_URL,
        width: 115,
        height: 24,
      },
      links: [
        {
          title: 'Protocol',
          items: [
            {label: 'Staking', to: '/phase-1'},
            {label: 'Liquidity Module', to: '/phase-2'},
            {label: 'Borrowing', to: '/phase-3'},
            {label: 'Risks', to: '/risks'},
          ],
        },
        {
          title: 'Company',
          items: [
            {label: 'About', href: `${SITE_URL}/about`},
            {label: 'Roadmap', to: '/roadmap'},
            {label: 'Contact', href: `${SITE_URL}/about#contact`},
          ],
        },
        {
          title: 'Resources',
          items: [
            {label: 'Docs', to: '/'},
            {label: 'FAQ', to: '/faq'},
            {label: 'Glossary', to: '/glossary'},
            {label: 'Community', href: 'https://t.me/definica'},
          ],
        },
      ],
      copyright: '© 2026 Definica',
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.github,
      additionalLanguages: ['solidity'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
