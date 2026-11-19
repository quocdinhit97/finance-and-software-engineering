import {translate} from '@docusaurus/Translate';

/**
 * Sidebar / pagination label of a doc in the current locale.
 *
 * A doc without a translated file in i18n/<locale>/ keeps its Vietnamese
 * sidebar_label in every locale. These labels can instead be translated in
 * i18n/<locale>/code.json under the key `doc.label.<docId>` (for example
 * `doc.label.system/ch07-origination`). Without a key the original label is used.
 */
export function localizedDocLabel(docId: string | undefined, label: string): string {
  if (!docId) return label;
  return translate({id: `doc.label.${docId}`, message: label});
}

/** Doc id from a docs permalink ("/en/docs/system/ch07-origination" → "system/ch07-origination"). */
export function docIdFromPermalink(permalink: string): string | undefined {
  const m = /\/docs\/(.+?)\/?$/.exec(permalink);
  if (!m) return undefined;
  // Category index pages (/docs/glossary, /docs/system) are served from <dir>/index.
  return m[1].includes('/') || m[1] === 'table-of-contents' ? m[1] : `${m[1]}/index`;
}
