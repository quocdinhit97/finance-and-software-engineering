/**
 * Diacritic-insensitive search for @easyops-cn/docusaurus-search-local.
 *
 * The plugin builds lunr indexes in this Node process (postBuild). Every token
 * that contains Vietnamese diacritics is indexed a second time without them
 * ("lãi" → "lai", "đồng" → "dong"), with the same position metadata, so a query
 * typed without accents matches and highlights the accented text. The folded
 * token is added before the English stemmer, which the query terms also pass. Queries with
 * accents still match the original tokens. Only the indexing pipeline changes;
 * the search pipeline shipped to the browser is untouched, so no client code is
 * needed.
 */
import {createRequire} from 'node:module';

type Token = {toString(): string; clone(fn?: (s: string) => string): Token};
type PipelineFn = ((token: Token) => Token | Token[]) & {label?: string};
interface Lunr {
  Pipeline: {registerFunction(fn: PipelineFn, label: string): void};
  stemmer: PipelineFn;
  Builder: {
    prototype: {
      add: (...args: unknown[]) => unknown;
      pipeline: {_stack: PipelineFn[]; add(fn: PipelineFn): void; before(existing: PipelineFn, fn: PipelineFn): void};
    };
  };
}

export function fold(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

let installed = false;

export function installDiacriticFolding(): void {
  if (installed) return;
  installed = true;
  const require = createRequire(import.meta.url);
  let lunr: Lunr;
  try {
    // Resolve lunr the way the search plugin does, so both use the same module instance.
    const pluginEntry = require.resolve('@easyops-cn/docusaurus-search-local');
    lunr = createRequire(pluginEntry)('lunr') as Lunr;
  } catch {
    return;
  }
  const foldVi: PipelineFn = (token) => {
    const text = token.toString();
    const folded = fold(text);
    return folded === text ? token : [token, token.clone(() => folded)];
  };
  lunr.Pipeline.registerFunction(foldVi, 'foldVietnameseDiacritics');
  const add = lunr.Builder.prototype.add;
  lunr.Builder.prototype.add = function (this: Lunr['Builder']['prototype'], ...args: unknown[]) {
    const stack = this.pipeline._stack;
    if (!stack.includes(foldVi)) {
      // Fold before the English stemmer, so folded tokens are stemmed exactly like
      // the (stemmed) query terms: "tỷ" → "ty" → "ti", and a query "ty" → "ti".
      if (stack.includes(lunr.stemmer)) this.pipeline.before(lunr.stemmer, foldVi);
      else this.pipeline.add(foldVi);
    }
    return add.apply(this, args);
  };
}
