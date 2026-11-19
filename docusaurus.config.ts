import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeBook from './src/plugins/rehype-book.mjs';
import {installDiacriticFolding} from './src/plugins/search-fold';

// Vietnamese search without diacritics ("lai suat" finds "lãi suất"). See src/plugins/search-fold.ts.
installDiacriticFolding();

/**
 * One Light / One Dark with every token colour adjusted to at least 4.5:1 contrast
 * on the code background (WCAG AA). Only colours change; the code is untouched.
 */
function accessibleTheme(theme: typeof prismThemes.oneLight, mode: 'light' | 'dark') {
  const rgb = (color: string): number[] => {
    const hsl = color.match(/^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%/i);
    if (hsl) {
      const [h, sat, l] = [Number(hsl[1]) / 360, Number(hsl[2]) / 100, Number(hsl[3]) / 100];
      const q = l < 0.5 ? l * (1 + sat) : l + sat - l * sat;
      const p = 2 * l - q;
      const ch = (t: number) => {
        const u = t < 0 ? t + 1 : t > 1 ? t - 1 : t;
        const v = u < 1 / 6 ? p + (q - p) * 6 * u : u < 1 / 2 ? q : u < 2 / 3 ? p + (q - p) * (2 / 3 - u) * 6 : p;
        return Math.round(v * 255);
      };
      return [ch(h + 1 / 3), ch(h), ch(h - 1 / 3)];
    }
    const h = color.replace('#', '');
    const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h.slice(0, 6);
    return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
  };
  const lum = (c: number[]) => {
    const [r, g, b] = c.map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a: number[], b: number[]) => {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05);
  };
  const bg = rgb(theme.plain.backgroundColor ?? (mode === 'light' ? '#fafafa' : '#282c34'));
  const target = mode === 'light' ? 0 : 255;
  const fix = (color?: string) => {
    if (!color || !/^(#[0-9a-f]{3,8}|hsla?\()/i.test(color)) return color;
    let c = rgb(color);
    for (let i = 0; i < 40 && ratio(c, bg) < 4.6; i++) c = c.map((v) => Math.round(v + (target - v) * 0.06));
    return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
  };
  return {
    ...theme,
    plain: {...theme.plain, color: fix(theme.plain.color)},
    styles: theme.styles.map((s) => ({...s, style: {...s.style, color: fix(s.style.color as string | undefined)}})),
  };
}

// Local development serves the site at the root: http://localhost:3000/
// GitHub Pages (project site https://<owner>.github.io/<repo>/) sets SITE_URL and
// BASE_URL in the deploy workflow (website/deploy/deploy.yml).
const siteUrl = process.env.SITE_URL ?? 'http://localhost:3000';
const baseUrl = process.env.BASE_URL ?? '/';
const gaMeasurementId = process.env.GA_MEASUREMENT_ID?.trim() || undefined;
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

  clientModules: [
    './src/clientModules/mermaidFix.ts',
    './src/clientModules/readingAnalytics.ts',
    './src/clientModules/readingPosition.ts',
    './src/clientModules/glossaryTooltip.ts',
    './src/clientModules/scrollRegions.ts',
  ],

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
          // KaTeX output is HTML plus hidden MathML, so screen readers read the formulas.
          rehypePlugins: [[rehypeKatex, {strict: false, output: 'htmlAndMathml'}], rehypeBook],
          showLastUpdateTime: false,
          breadcrumbs: false,
        },
        blog: false,
        // Google Analytics 4 via @docusaurus/plugin-google-gtag. Enabled only when the
        // build has GA_MEASUREMENT_ID (G-XXXXXXXXXX), set as a GitHub Actions repository
        // variable for the deploy workflow; local builds and `npm start` send nothing.
        gtag: gaMeasurementId ? {trackingID: gaMeasurementId, anonymizeIP: true} : undefined,
        theme: {
          customCss: ['./src/css/fonts.css', './src/css/custom.css', './src/css/reading.css'],
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
      sidebar: {hideable: false, autoCollapseCategories: true},
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 3,
    },
    navbar: {
      title: 'Kiến trúc tín dụng',
      // Empty alt: the title next to the logo already names the site.
      logo: {alt: '', src: 'img/logo.png', width: 32, height: 32},
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
      theme: accessibleTheme(prismThemes.oneLight, 'light'),
      darkTheme: accessibleTheme(prismThemes.oneDark, 'dark'),
      additionalLanguages: ['java', 'sql', 'yaml', 'bash', 'json', 'typescript'],
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
