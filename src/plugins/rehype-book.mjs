/**
 * Rehype plugin for book pages. It changes markup only, never the text of
 * prose or code:
 *
 *  1. Glossary terms: the first occurrence of each glossary term on a page is
 *     wrapped in a link to its Glossary entry (class "glossary-term",
 *     data-term=<anchor>). The client module glossaryTooltip.ts shows the
 *     definition on hover, focus or first tap.
 *  2. Character diagrams: `text` code blocks drawn with box-drawing characters
 *     are wrapped in a <figure> with an accessible name and a short note for
 *     screen reader users. The code block itself is left untouched.
 *  3. English pages: runs of Vietnamese words (names, the Vietnamese term in
 *     the Glossary) get lang="vi" so screen readers switch pronunciation.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const glossary = {};
for (const locale of ['vi', 'en']) {
  const file = path.join(root, 'src', 'data', `glossary.${locale}.json`);
  glossary[locale] = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : [];
}

const SKIP_TAGS = new Set(['a', 'code', 'pre', 'kbd', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'script', 'style', 'svg', 'math', 'button']);
const NO_TERMS_IN = /(\/glossary\/|table-of-contents|\/reference\/)/;
const BOX = /[─-╿]/g;
const VI_CHAR = '[ăâđêôơưĂÂĐÊÔƠƯàáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵÀÁẢÃẠẰẮẲẴẶẦẤẨẪẬÈÉẺẼẸỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌỒỐỔỖỘỜỚỞỠỢÙÚỦŨỤỪỨỬỮỰỲÝỶỸỴ]';
// A run of Vietnamese text: Vietnamese words, joined by up to two capitalized
// plain words ("Công ty TNHH Kế toán Thành An"), plus capitalized plain words
// that finish a name ("Chợ Sao", "Phương Nam"). Lowercase plain words end the
// run, since in English text they are English ("Tuấn met Hương").
const VI_WORD = `[\\p{L}]*${VI_CHAR}[\\p{L}]*`;
const CAP = '(?:\\p{Lu}[\\p{L}\\p{N}]*|ty)(?![\\p{L}\\p{N}])';
const VI_RUN = new RegExp(`${VI_WORD}(?:(?:[ \\-]+${CAP}){0,2}[ \\-]+${VI_WORD})*(?:[ ]+${CAP}){0,2}`, 'gu');

const LABELS = {
  vi: {diagram: 'Sơ đồ ký tự', note: 'Sơ đồ vẽ bằng ký tự. Các ý chính được giải thích trong đoạn văn xung quanh.'},
  en: {diagram: 'Text diagram', note: 'A diagram drawn with characters. Its main points are explained in the surrounding text.'},
};

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildMatcher(entries) {
  const byKey = new Map();
  const alts = [];
  for (const e of entries) {
    for (const p of e.exact ?? []) {
      byKey.set(p, e);
      alts.push({p, sensitive: true});
    }
    for (const p of e.loose ?? []) {
      byKey.set(p.toLocaleLowerCase('vi'), e);
      alts.push({p, sensitive: false});
    }
  }
  if (!alts.length) return null;
  alts.sort((a, b) => b.p.length - a.p.length);
  const source = alts.map((a) => escapeRegExp(a.p)).join('|');
  const re = new RegExp(`(?<![\\p{L}\\p{N}_])(?:${source})(?![\\p{L}\\p{N}_])`, 'giu');
  const sensitive = new Set(alts.filter((a) => a.sensitive).map((a) => a.p));
  return {
    re,
    lookup(match) {
      if (sensitive.has(match)) return byKey.get(match);
      const lower = match.toLocaleLowerCase('vi');
      const e = byKey.get(lower);
      // a case-insensitive hit on an acronym ("Pd", "el") is not the acronym
      if (e && (e.loose ?? []).some((p) => p.toLocaleLowerCase('vi') === lower)) return e;
      return undefined;
    },
  };
}
const matchers = {vi: buildMatcher(glossary.vi), en: buildMatcher(glossary.en)};

function textOf(node) {
  if (node.type === 'text') return node.value;
  return (node.children ?? []).map(textOf).join('');
}

function className(node) {
  const c = node.properties?.className;
  return Array.isArray(c) ? c : typeof c === 'string' ? c.split(' ') : [];
}

function isSkipped(node) {
  if (node.type === 'element') {
    if (SKIP_TAGS.has(node.tagName)) return true;
    const cls = className(node);
    if (cls.some((c) => c === 'katex' || c === 'katex-display' || c === 'math' || c.startsWith('math-'))) return true;
    if (node.properties?.lang) return true;
  }
  if ((node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') && node.name && /^[A-Z]/.test(node.name)) {
    // custom components (charts, calculators) render their own text
    return node.name !== 'details';
  }
  return false;
}

/** Replace one text node by several nodes produced by `split`. */
function splitText(parent, index, pieces) {
  parent.children.splice(index, 1, ...pieces);
  return pieces.length;
}

function markTerms(tree, matcher) {
  const seen = new Set();
  const walk = (node) => {
    if (!node.children || isSkipped(node)) return;
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      if (child.type !== 'text') {
        walk(child);
        continue;
      }
      const value = child.value;
      matcher.re.lastIndex = 0;
      const pieces = [];
      let last = 0;
      let m;
      while ((m = matcher.re.exec(value))) {
        const entry = matcher.lookup(m[0]);
        if (!entry || seen.has(entry.anchor)) continue;
        seen.add(entry.anchor);
        if (m.index > last) pieces.push({type: 'text', value: value.slice(last, m.index)});
        pieces.push({
          type: 'element',
          tagName: 'a',
          properties: {href: `/docs/glossary#${entry.anchor}`, className: ['glossary-term'], dataTerm: entry.anchor},
          children: [{type: 'text', value: m[0]}],
        });
        last = m.index + m[0].length;
      }
      if (!pieces.length) continue;
      if (last < value.length) pieces.push({type: 'text', value: value.slice(last)});
      i += splitText(node, i, pieces) - 1;
    }
  };
  walk(tree);
}

function wrapDiagrams(tree, labels) {
  let heading = '';
  const walk = (node) => {
    if (!node.children) return;
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      if (child.type === 'element' && /^h[2-3]$/.test(child.tagName)) heading = textOf(child).trim();
      if (child.type === 'element' && child.tagName === 'pre') {
        const code = child.children?.find((c) => c.type === 'element' && c.tagName === 'code');
        const isText = code && className(code).includes('language-text');
        const boxChars = isText ? (textOf(code).match(BOX) ?? []).length : 0;
        if (isText && boxChars >= 8) {
          node.children[i] = {
            type: 'element',
            tagName: 'figure',
            properties: {className: ['text-diagram'], role: 'group', ariaLabel: heading ? `${labels.diagram}: ${heading}` : labels.diagram},
            children: [
              {type: 'element', tagName: 'span', properties: {className: ['sr-only']}, children: [{type: 'text', value: labels.note}]},
              child,
            ],
          };
        }
        continue;
      }
      walk(child);
    }
  };
  walk(tree);
}

function markVietnamese(tree) {
  const walk = (node) => {
    if (!node.children || isSkipped(node)) return;
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      if (child.type !== 'text') {
        walk(child);
        continue;
      }
      const value = child.value;
      VI_RUN.lastIndex = 0;
      const pieces = [];
      let last = 0;
      let m;
      while ((m = VI_RUN.exec(value))) {
        if (m.index > last) pieces.push({type: 'text', value: value.slice(last, m.index)});
        pieces.push({type: 'element', tagName: 'span', properties: {lang: 'vi'}, children: [{type: 'text', value: m[0]}]});
        last = m.index + m[0].length;
      }
      if (!pieces.length) continue;
      if (last < value.length) pieces.push({type: 'text', value: value.slice(last)});
      i += splitText(node, i, pieces) - 1;
    }
  };
  walk(tree);
}

export default function rehypeBook() {
  return (tree, file) => {
    const filePath = (file.path ?? file.history?.[0] ?? '').replace(/\\/g, '/');
    const locale = /\/i18n\/en\//.test(filePath) ? 'en' : 'vi';
    wrapDiagrams(tree, LABELS[locale]);
    if (!NO_TERMS_IN.test(filePath) && matchers[locale]) markTerms(tree, matchers[locale]);
    if (locale === 'en') markVietnamese(tree);
  };
}
