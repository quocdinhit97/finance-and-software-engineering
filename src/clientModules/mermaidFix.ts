/**
 * Mermaid attaches tooltip handlers that call `selection.transition()`.
 * That method is added to d3-selection by the side-effect module d3-transition,
 * which the production bundler can tree-shake away, causing
 * "tooltipElem.transition is not a function" on hover. Importing it explicitly
 * from a client module keeps the augmentation in the bundle.
 */
import {selection} from 'd3-selection';
import {transition} from 'd3-transition';

// Reference both so the imports are not dropped; this also asserts the patch is present.
if (typeof (selection.prototype as unknown as {transition?: unknown}).transition !== 'function') {
  // eslint-disable-next-line no-console
  console.warn('d3-transition did not patch d3-selection', transition);
}
