/**
 * Reading analytics for book pages (GA4, through @docusaurus/plugin-google-gtag).
 *
 * Page views are sent by the gtag plugin itself. This module adds two events on
 * /docs/ pages so the reports show how far readers get, not only which pages
 * they open:
 *
 *   read_progress  { percent: 25 | 50 | 75 | 100, engaged_seconds, page_path, page_title, page_locale }
 *     Sent once per threshold per page view, when the bottom of the viewport
 *     passes that share of the article body.
 *   read_complete  { engaged_seconds, page_path, page_title, page_locale }
 *     Sent once per page view when the reader reaches the end of the article
 *     after at least MIN_READ_SECONDS of visible time, to tell reading from skimming.
 *   read_section   { section_id, section_index, section_count, section_title, engaged_seconds, ... }
 *     Sent once per H2 section per page view when its heading passes the upper
 *     half of the viewport. Counting events per section_index shows where in a
 *     chapter readers stop (see ANALYTICS.md).
 *
 * engaged_seconds counts only time while the tab is visible. Nothing is sent
 * when gtag is absent (local builds, `npm start`, or no GA_MEASUREMENT_ID).
 * To use percent and engaged_seconds in GA4 reports, register them as
 * event-scoped custom dimension / metric in GA4 Admin.
 */
import type {ClientModule} from '@docusaurus/types';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const THRESHOLDS = [25, 50, 75, 100] as const;
const MIN_READ_SECONDS = 60;
const START_DELAY_MS = 600;
const ARTICLE_SELECTOR = '.theme-doc-markdown';

type Gtag = (command: 'event', name: string, params: Record<string, unknown>) => void;

let cleanup: (() => void) | null = null;

function gtag(): Gtag | undefined {
  const fn = (window as unknown as {gtag?: Gtag}).gtag;
  return typeof fn === 'function' ? fn : undefined;
}

function track(pathname: string): () => void {
  const sent = new Set<number>();
  const sectionsSent = new Set<string>();
  let completeSent = false;
  let engagedMs = 0;
  let visibleSince = document.visibilityState === 'visible' ? performance.now() : null;
  let frame = 0;

  const engagedSeconds = () =>
    Math.round((engagedMs + (visibleSince !== null ? performance.now() - visibleSince : 0)) / 1000);

  const baseParams = () => ({
    page_path: pathname,
    page_title: document.title,
    page_locale: document.documentElement.lang,
    engaged_seconds: engagedSeconds(),
  });

  const measure = () => {
    frame = 0;
    const send = gtag();
    const article = document.querySelector<HTMLElement>(ARTICLE_SELECTOR);
    if (!send || !article) return;
    const rect = article.getBoundingClientRect();
    if (rect.height <= 0) return;
    const seen = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / rect.height));
    const percent = Math.floor(seen * 100);
    for (const t of THRESHOLDS) {
      if (percent >= t && !sent.has(t)) {
        sent.add(t);
        send('event', 'read_progress', {...baseParams(), percent: t});
      }
    }
    const headings = Array.from(article.querySelectorAll<HTMLElement>('h2[id]'));
    headings.forEach((h, index) => {
      if (sectionsSent.has(h.id) || h.getBoundingClientRect().top > window.innerHeight * 0.5) return;
      sectionsSent.add(h.id);
      send('event', 'read_section', {
        ...baseParams(),
        section_id: h.id,
        section_index: index + 1,
        section_count: headings.length,
        section_title: (h.textContent ?? '').replace(/[#\u200b]/g, '').trim().slice(0, 100),
      });
    });
    if (sent.has(100) && !completeSent && engagedSeconds() >= MIN_READ_SECONDS) {
      completeSent = true;
      send('event', 'read_complete', baseParams());
    }
  };

  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(measure);
  };
  const onVisibility = () => {
    if (document.visibilityState === 'visible') {
      visibleSince = performance.now();
      onScroll();
    } else if (visibleSince !== null) {
      engagedMs += performance.now() - visibleSince;
      visibleSince = null;
    }
  };

  window.addEventListener('scroll', onScroll, {passive: true});
  window.addEventListener('resize', onScroll, {passive: true});
  document.addEventListener('visibilitychange', onVisibility);
  // Short pages may be fully visible without scrolling; re-check once content and fonts settle,
  // and again after MIN_READ_SECONDS so read_complete can fire without further scrolling.
  const timers = [window.setTimeout(onScroll, 400), window.setTimeout(onScroll, MIN_READ_SECONDS * 1000 + 500)];

  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    document.removeEventListener('visibilitychange', onVisibility);
    timers.forEach((id) => window.clearTimeout(id));
    if (frame) cancelAnimationFrame(frame);
  };
}

const clientModule: ClientModule = {
  onRouteDidUpdate({location, previousLocation}) {
    if (!ExecutionEnvironment.canUseDOM) return;
    // Hash changes within the same page keep the current tracker.
    if (previousLocation && previousLocation.pathname === location.pathname) return;
    cleanup?.();
    cleanup = null;
    if (/\/docs\//.test(location.pathname)) {
      // Start after the new page has rendered, scroll has been reset to the top and the
      // gtag plugin has sent its page_view; otherwise the previous page's scroll position
      // would be measured against the new article.
      const pathname = location.pathname;
      let stop: (() => void) | null = null;
      const startTimer = window.setTimeout(() => {
        stop = track(pathname);
      }, START_DELAY_MS);
      cleanup = () => {
        window.clearTimeout(startTimer);
        stop?.();
      };
    }
  },
};

export default clientModule;
