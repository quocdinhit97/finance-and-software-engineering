/**
 * Definition popover for glossary terms marked by src/plugins/rehype-book.mjs.
 *
 * The term itself is an ordinary link to its Glossary entry, so it works
 * without JavaScript and with the keyboard. This module adds the definition:
 *  - mouse: on hover (short delay), kept open while the pointer is on the popover
 *  - keyboard: on focus, closed by Escape or leaving the link; the link is
 *    aria-describedby the popover so screen readers announce the definition
 *  - touch: the first tap opens the popover, a second tap follows the link
 */
import type {ClientModule} from '@docusaurus/types';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import {sendEvent} from '../lib/analytics';

interface Entry {
  term: string;
  alt: string;
  def: string;
  anchor: string;
}

const TERM = 'a.glossary-term';
const TIP_ID = 'glossary-tooltip';
const LABELS: Record<string, string> = {vi: 'Xem trong Thuật ngữ', en: 'Open in the Glossary'};

const cache = new Map<string, Promise<Map<string, Entry>>>();
let tip: HTMLDivElement | null = null;
let current: HTMLAnchorElement | null = null;
let showTimer = 0;
let hideTimer = 0;
let lastPointer = 'mouse';
const reported = new Set<string>();

function locale(): string {
  return (document.documentElement.lang || 'vi').slice(0, 2) === 'en' ? 'en' : 'vi';
}

function load(loc: string): Promise<Map<string, Entry>> {
  let p = cache.get(loc);
  if (!p) {
    p = (loc === 'en' ? import('../data/glossary.en.json') : import('../data/glossary.vi.json')).then(
      (m) => new Map((m.default as Entry[]).map((e) => [e.anchor, e])),
    );
    cache.set(loc, p);
  }
  return p;
}

function ensureTip(): HTMLDivElement {
  if (tip && document.body.contains(tip)) return tip;
  tip = document.createElement('div');
  tip.id = TIP_ID;
  tip.className = 'glossary-tooltip';
  tip.setAttribute('role', 'tooltip');
  tip.hidden = true;
  tip.addEventListener('mouseenter', () => window.clearTimeout(hideTimer));
  tip.addEventListener('mouseleave', () => scheduleHide());
  document.body.appendChild(tip);
  return tip;
}

function position(el: HTMLElement, box: HTMLElement): void {
  const r = el.getBoundingClientRect();
  const width = box.offsetWidth;
  const height = box.offsetHeight;
  const margin = 8;
  let left = r.left + window.scrollX;
  left = Math.min(left, window.scrollX + document.documentElement.clientWidth - width - margin);
  left = Math.max(left, window.scrollX + margin);
  const below = r.bottom + window.scrollY + 6;
  const above = r.top + window.scrollY - height - 6;
  const fitsBelow = r.bottom + height + 12 < window.innerHeight;
  box.style.left = `${left}px`;
  box.style.top = `${fitsBelow || above < window.scrollY ? below : above}px`;
}

async function show(el: HTMLAnchorElement): Promise<void> {
  const anchor = el.dataset.term;
  if (!anchor) return;
  const loc = locale();
  const entry = (await load(loc)).get(anchor);
  if (!entry) return;
  const box = ensureTip();
  box.replaceChildren();
  const term = document.createElement('p');
  term.className = 'glossary-tooltip__term';
  term.textContent = entry.term;
  box.appendChild(term);
  if (entry.alt) {
    const alt = document.createElement('p');
    alt.className = 'glossary-tooltip__alt';
    alt.textContent = entry.alt;
    box.appendChild(alt);
  }
  const def = document.createElement('p');
  def.className = 'glossary-tooltip__def';
  def.textContent = entry.def;
  box.appendChild(def);
  const more = document.createElement('a');
  more.className = 'glossary-tooltip__more';
  more.href = el.href;
  more.tabIndex = -1;
  more.textContent = `${LABELS[loc]} →`;
  box.appendChild(more);

  if (current && current !== el) current.removeAttribute('aria-describedby');
  current = el;
  el.setAttribute('aria-describedby', TIP_ID);
  box.hidden = false;
  position(el, box);
  if (!reported.has(anchor)) {
    reported.add(anchor);
    sendEvent('glossary_tooltip', {term: anchor, input: lastPointer});
  }
}

function hide(): void {
  window.clearTimeout(showTimer);
  window.clearTimeout(hideTimer);
  if (tip) tip.hidden = true;
  current?.removeAttribute('aria-describedby');
  current = null;
}

function scheduleHide(): void {
  window.clearTimeout(hideTimer);
  hideTimer = window.setTimeout(hide, 180);
}

function termFrom(target: EventTarget | null): HTMLAnchorElement | null {
  return target instanceof Element ? target.closest<HTMLAnchorElement>(TERM) : null;
}

if (ExecutionEnvironment.canUseDOM) {
  document.addEventListener('pointerdown', (e) => {
    lastPointer = e.pointerType || 'mouse';
  }, true);
  document.addEventListener('mouseover', (e) => {
    const el = termFrom(e.target);
    if (!el || lastPointer === 'touch') return;
    window.clearTimeout(hideTimer);
    window.clearTimeout(showTimer);
    showTimer = window.setTimeout(() => void show(el), 250);
  });
  document.addEventListener('mouseout', (e) => {
    const el = termFrom(e.target);
    if (!el) return;
    window.clearTimeout(showTimer);
    scheduleHide();
  });
  document.addEventListener('focusin', (e) => {
    const el = termFrom(e.target);
    if (el) void show(el);
  });
  document.addEventListener('focusout', (e) => {
    if (termFrom(e.target)) scheduleHide();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && tip && !tip.hidden) hide();
  });
  document.addEventListener(
    'click',
    (e) => {
      const el = termFrom(e.target);
      if (el && lastPointer === 'touch' && current !== el) {
        // first tap: show the definition instead of leaving the page
        e.preventDefault();
        e.stopPropagation();
        void show(el);
        return;
      }
      if (!el && tip && !tip.hidden && !(e.target instanceof Node && tip.contains(e.target))) hide();
    },
    true,
  );
  window.addEventListener('resize', () => current && tip && !tip.hidden && position(current, tip));
}

const clientModule: ClientModule = {
  onRouteDidUpdate() {
    hide();
    reported.clear();
  },
};

export default clientModule;
