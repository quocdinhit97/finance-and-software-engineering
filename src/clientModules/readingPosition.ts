/**
 * Remembers where the reader is in the book (page, current section, percent read)
 * so the home page can offer "Continue reading". Stored only in this browser.
 */
import type {ClientModule} from '@docusaurus/types';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import {savePosition} from '../lib/readingPosition';

const ARTICLE = '.theme-doc-markdown';
// Pages that are not "reading": navigation and reference lists.
const SKIP = /\/docs\/(table-of-contents|glossary|tools)(\/|$)/;

let stop: (() => void) | null = null;

function locale(): string {
  return (document.documentElement.lang || 'vi').slice(0, 2);
}

function start(pathname: string): () => void {
  let timer = 0;
  const save = () => {
    timer = 0;
    const article = document.querySelector<HTMLElement>(ARTICLE);
    if (!article) return;
    const rect = article.getBoundingClientRect();
    if (rect.height <= 0) return;
    const percent = Math.round(Math.min(1, Math.max(0, (window.innerHeight - rect.top) / rect.height)) * 100);
    const line = window.innerHeight * 0.3;
    let current: HTMLElement | null = null;
    article.querySelectorAll<HTMLElement>('h2[id]').forEach((h) => {
      if (h.getBoundingClientRect().top < line) current = h;
    });
    const h = current as HTMLElement | null;
    const title = document.querySelector('header h1')?.textContent?.trim() || document.title;
    savePosition(locale(), {
      path: pathname,
      title,
      section: h?.textContent?.replace(/[#\u200b]/g, '').trim() || undefined,
      sectionId: h?.id || undefined,
      percent,
      at: Date.now(),
    });
  };
  const onScroll = () => {
    if (!timer) timer = window.setTimeout(save, 800);
  };
  window.addEventListener('scroll', onScroll, {passive: true});
  // Record the visit itself even without scrolling (short pages).
  const first = window.setTimeout(save, 1500);
  return () => {
    window.removeEventListener('scroll', onScroll);
    window.clearTimeout(first);
    if (timer) window.clearTimeout(timer);
  };
}

const clientModule: ClientModule = {
  onRouteDidUpdate({location, previousLocation}) {
    if (!ExecutionEnvironment.canUseDOM) return;
    if (previousLocation && previousLocation.pathname === location.pathname) return;
    stop?.();
    stop = null;
    if (/\/docs\//.test(location.pathname) && !SKIP.test(location.pathname)) {
      stop = start(location.pathname);
    }
  },
};

export default clientModule;
