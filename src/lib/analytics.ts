/** Send a GA4 event through gtag when it is present (deploy builds with GA_MEASUREMENT_ID). */
export function sendEvent(name: string, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;
  const gtag = (window as unknown as {gtag?: (c: 'event', n: string, p: Record<string, unknown>) => void}).gtag;
  if (typeof gtag !== 'function') return;
  gtag('event', name, {page_path: window.location.pathname, page_locale: document.documentElement.lang, ...params});
}
