// Editorial and anonymization checks for the published content.
// Usage: npm run check:content   (exit code 1 if any blocking issue is found)
import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {join} from 'node:path';

const ROOTS = ['docs', 'i18n', 'src'].filter((d) => existsSync(d));
/* FORBIDDEN is built from scripts/entities.json below (original names are not kept in this file). */
// Old technical identifiers (modules, tables, classes, fee codes) must not survive either.
// entities.json may be absent in a public repository (it lists original names); then only the
// built-in FORBIDDEN list is checked.
const ENTITIES = 'scripts/entities.json';
const TECH = existsSync(ENTITIES)
  ? JSON.parse(readFileSync(ENTITIES, 'utf8')).technical.map(([a, , kind]) =>
      kind === 'regex' ? new RegExp(a) : new RegExp(a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
  : [];
const FORBIDDEN = existsSync(ENTITIES)
  ? JSON.parse(readFileSync(ENTITIES, 'utf8')).forbidden.map((r) => new RegExp(r, 'i'))
  : [];
if (!TECH.length) console.log('Note: scripts/entities.json not found, technical-identifier check skipped.');
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2705}\u{274C}\u{2B50}]/u;

const files = [];
const walk = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(mdx?|tsx?|json|css)$/.test(f)) files.push(p);
  }
};
ROOTS.forEach(walk);

let blocking = 0;
const report = (level, file, line, msg) => {
  if (level === 'ERROR') blocking++;
  console.log(`${level} ${file}:${line} ${msg}`);
};

for (const file of files) {
  const internal = file.includes('docs/reference/');
  const lines = readFileSync(file, 'utf8').split('\n');
  let inCode = false;
  lines.forEach((l, i) => {
    if (/^\s*```/.test(l)) inCode = !inCode;
    if (!internal) {
      for (const re of FORBIDDEN) if (re.test(l)) report('ERROR', file, i + 1, `original entity name: ${l.trim().slice(0, 80)}`);
      for (const re of TECH) if (re.test(l)) report('ERROR', file, i + 1, `original technical identifier ${re}: ${l.trim().slice(0, 60)}`);
    }
    if (!/\.mdx?$/.test(file) || inCode) return;
    if (!/^\s*\|/.test(l) && /(^|[^\-`])--([^\-`]|$)/.test(l.replace(/`[^`]*`/g, ''))) report('ERROR', file, i + 1, 'double hyphen used in prose');
    if (EMOJI.test(l)) report('ERROR', file, i + 1, 'decorative emoji');
    if (/^\s*(\*\*\*|___)\s*$/.test(l)) report('ERROR', file, i + 1, 'decorative horizontal rule');
    if (/\s—\s/.test(l)) report('WARN', file, i + 1, 'em dash used as clause separator');
  });
}
console.log(`\n${files.length} files checked, ${blocking} blocking issue(s).`);
process.exit(blocking ? 1 : 0);
