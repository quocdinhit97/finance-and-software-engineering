// Build src/data/glossary.<locale>.json from the Glossary pages.
// Used by the rehype plugin (which terms to mark in chapters) and by the
// glossary tooltip client module (what to show). Runs before start/build.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const sources = {
  vi: 'docs/glossary/index.md',
  en: 'i18n/en/docusaurus-plugin-content-docs/current/glossary/index.md',
};

/** github-slugger compatible for the characters used in the glossary headings. */
export function slug(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}\- _]/gu, '')
    .replace(/ /g, '-');
}

/** Markdown inline → plain text (the definitions only use code spans, emphasis and links). */
function plain(md) {
  return md
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .trim();
}

export function parseGlossary(text) {
  const body = text.split(/\n## A(?: \{#a\}| \{\/\* #a \*\/\})?\n/)[1] ?? '';
  const entries = [];
  for (const chunk of body.split(/\n### /).slice(1)) {
    const lines = chunk.split('\n');
    const term = lines[0].replace(/\s*(\{#[^}]*\}|\{\/\* #[^*]*\*\/\})\s*$/, '').trim();
    const paras = lines
      .slice(1)
      .join('\n')
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p && !p.startsWith('## '));
    const altPara = paras.find((p) => /^\*[^*].*\*$/.test(p));
    const def = paras.find((p) => p !== altPara && !/^(Xuất hiện trong|Appears in):/.test(p) && !/^\*.*\*$/.test(p));
    if (!def) continue;
    entries.push({term, alt: altPara ? plain(altPara) : '', def: plain(def), anchor: slug(term)});
  }
  return entries;
}

const ALIASES = {
  'Effective Interest Rate': ['EIR'],
  'Net Interest Margin': ['NIM'],
  'Banking-as-a-Service': ['BaaS'],
  'FICO Score': ['FICO'],
  'Gini Coefficient': ['Gini'],
  'KS Statistic': ['KS'],
};
const ACRONYM = /^(?:[A-Z][A-Za-z0-9]*[A-Z][A-Za-z0-9]*|IFRS 9|XGBoost)$/;
// Names that read as ordinary words in running text; never auto-marked.
const NEVER = new Set(['Default', 'Fraud', 'Collections', 'Nudge', 'Bureau', 'Calibration', 'Scorecard']);

/**
 * Patterns that mark a term in chapter text.
 *  - case-sensitive: acronyms and code-like names (DPD, APR, IFRS 9, ContractService)
 *  - case-insensitive: multi-word names in the page language
 *    (English term names on English pages, the Vietnamese name on Vietnamese pages)
 */
function patterns(entry, locale) {
  const exact = [];
  const loose = [];
  if (!NEVER.has(entry.term)) {
    if (ACRONYM.test(entry.term)) exact.push(entry.term);
    else if (locale === 'en' && entry.term.includes(' ')) loose.push(entry.term);
  }
  exact.push(...(ALIASES[entry.term] ?? []));
  if (locale === 'vi') {
    // The italic line is the Vietnamese name, sometimes after an English expansion
    // ("Annual Percentage Rate, lãi suất phần trăm năm"). Use only plain multi-word names.
    const vn = entry.alt.split(',').pop().trim();
    if (vn && !/[()"]/.test(vn) && vn.split(/\s+/).length >= 2 && /[^\x00-\x7F]/.test(vn)) loose.push(vn);
  }
  return {exact, loose};
}

export function buildAll() {
  const out = {};
  for (const [locale, rel] of Object.entries(sources)) {
    const file = path.join(root, rel);
    if (!fs.existsSync(file)) continue;
    const entries = parseGlossary(fs.readFileSync(file, 'utf8')).map((e) => ({...e, ...patterns(e, locale)}));
    out[locale] = entries;
  }
  return out;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dir = path.join(root, 'src', 'data');
  fs.mkdirSync(dir, {recursive: true});
  for (const [locale, entries] of Object.entries(buildAll())) {
    fs.writeFileSync(path.join(dir, `glossary.${locale}.json`), JSON.stringify(entries, null, 1) + '\n');
    const marked = entries.filter((e) => e.exact.length || e.loose.length).length;
    console.log(`glossary.${locale}.json: ${entries.length} terms, ${marked} auto-marked in chapters`);
  }
}
