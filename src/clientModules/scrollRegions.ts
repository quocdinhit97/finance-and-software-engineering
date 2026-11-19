/**
 * Wide tables, display formulas and diagrams scroll horizontally (calculator
 * schedules also vertically). A region that
 * actually overflows gets tabindex="0" so keyboard users can focus and scroll it
 * (WCAG 2.1.1); regions that fit are left out of the tab order.
 */
import type {ClientModule} from '@docusaurus/types';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const SELECTOR = [
  '.theme-doc-markdown table',
  '.theme-doc-markdown .katex-display',
  '.theme-doc-markdown .docusaurus-mermaid-container',
  ".theme-doc-markdown [class*='tableWrap']",
].join(',');

function update(): void {
  document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
    const style = window.getComputedStyle(el);
    const scrollsY = /(auto|scroll)/.test(style.overflowY) && el.scrollHeight > el.clientHeight + 1;
    const overflows = el.scrollWidth > el.clientWidth + 1 || scrollsY;
    if (overflows && !el.hasAttribute('tabindex')) {
      el.setAttribute('tabindex', '0');
      el.dataset.scrollRegion = 'true';
    } else if (!overflows && el.dataset.scrollRegion) {
      el.removeAttribute('tabindex');
      delete el.dataset.scrollRegion;
    }
  });
}

let resizeTimer = 0;
if (ExecutionEnvironment.canUseDOM) {
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(update, 200);
  });
}

const clientModule: ClientModule = {
  onRouteDidUpdate() {
    if (!ExecutionEnvironment.canUseDOM) return;
    // Mermaid and KaTeX settle after the first paint.
    window.setTimeout(update, 300);
    window.setTimeout(update, 1500);
  },
};

export default clientModule;
