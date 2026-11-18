import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Local development serves the site at the root: http://localhost:3000/
// GitHub Pages (project site https://<owner>.github.io/<repo>/) sets SITE_URL and
// BASE_URL in the deploy workflow (website/deploy/deploy.yml).
const siteUrl = process.env.SITE_URL ?? 'http://localhost:3000';
const baseUrl = process.env.BASE_URL ?? '/';
const organizationName = process.env.GITHUB_OWNER ?? 'example';
const projectName = process.env.GITHUB_REPO ?? 'kien-truc-tin-dung';

const config: Config = {
  title: 'Kiến trúc tín dụng',
  tagline: 'Hệ thống tài chính tiêu dùng: từ kinh tế học đến mã nguồn',
  favicon: 'img/favicon.ico',

  url: siteUrl,
  baseUrl,
  organizationName,
  projectName,
  trailingSlash: false,
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'warn',

  future: {
    v4: true,
  },

  i18n: {
    defaultLocale: 'vi',
    locales: ['vi', 'en'],
    localeConfigs: {
      vi: {label: 'Tiếng Việt', htmlLang: 'vi-VN'},
      en: {label: 'English', htmlLang: 'en-US'},
    },
  },

  markdown: {
    // .md files are parsed as CommonMark, .mdx files as MDX.
    format: 'detect',
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },


  stylesheets: [
    // KaTeX is self-hosted (static/katex) so formulas render without a CDN.
    {href: `${baseUrl}katex/katex.min.css`, type: 'text/css'},
  ],

  headTags: [
    {tagName: 'link', attributes: {rel: 'icon', type: 'image/png', sizes: '32x32', href: `${baseUrl}img/favicon-32.png`}},
    {tagName: 'link', attributes: {rel: 'apple-touch-icon', sizes: '180x180', href: `${baseUrl}img/apple-touch-icon.png`}},
  ],

  clientModules: ['./src/clientModules/mermaidFix.ts'],

  themes: [
    '@docusaurus/theme-mermaid',
    [
      // Offline full-text search (no external service), Vietnamese + English.
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['vi', 'en'],
        indexBlog: false,
        docsRouteBasePath: '/docs',
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        searchBarShortcutHint: true,
        searchResultLimits: 10,
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          remarkPlugins: [remarkMath],
          admonitions: {
            // Book-specific callouts, rendered by src/theme/Admonition/Types.tsx
            keywords: ['summary', 'story', 'key'],
            extendDefaults: true,
          },
          rehypePlugins: [[rehypeKatex, {strict: false}]],
          showLastUpdateTime: false,
          breadcrumbs: false,
        },
        blog: false,
        theme: {
          customCss: ['./src/css/fonts.css', './src/css/custom.css'],
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    metadata: [
      {name: 'keywords', content: 'consumer finance, tín dụng tiêu dùng, loan management, amortization, software architecture, microservices'},
    ],
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {hideable: false, autoCollapseCategories: false},
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 3,
    },
    navbar: {
      title: 'Kiến trúc tín dụng',
      logo: {alt: 'Kiến trúc tín dụng', src: 'img/logo.png', width: 32, height: 32},
      // Section tabs (Đọc sách, Mục lục, ...) are rendered as a second row by src/theme/Navbar.
      items: [
        {type: 'search', position: 'left'},
        {type: 'localeDropdown', position: 'right'},
        {to: '/docs/introduction/preface', label: 'Bắt đầu đọc', position: 'right', className: 'navbar-cta'},
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Đọc',
          items: [
            {label: 'Lời mở đầu', to: '/docs/introduction/preface'},
            {label: 'Cách đọc cuốn sách', to: '/docs/introduction/how-to-read'},
            {label: 'Mục lục', to: '/docs/table-of-contents'},
          ],
        },
        {
          title: 'Tra cứu',
          items: [
            {label: 'Thuật ngữ', to: '/docs/glossary'},
            {label: 'Công thức toán tài chính', to: '/docs/appendices/c-math-reference'},
            {label: 'Kiến trúc tham chiếu', to: '/docs/appendices/a-architecture-reference'},
          ],
        },
      ],
      copyright: `Kiến trúc tín dụng. Mọi tổ chức, hệ thống và nhân vật trong sách đều là hư cấu.`,
    },
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ['java', 'sql', 'yaml', 'bash', 'json', 'typescript'],
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
