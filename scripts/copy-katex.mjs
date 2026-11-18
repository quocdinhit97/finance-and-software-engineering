// Copies KaTeX CSS and fonts from node_modules into static/katex so formulas
// are self-hosted (no CDN). Runs automatically before `start` and `build`.
import {cpSync, mkdirSync} from 'node:fs';
import {createRequire} from 'node:module';
import {dirname, join} from 'node:path';

const require = createRequire(import.meta.url);
const dist = join(dirname(require.resolve('katex/package.json')), 'dist');
mkdirSync('static/katex', {recursive: true});
cpSync(join(dist, 'katex.min.css'), 'static/katex/katex.min.css');
cpSync(join(dist, 'fonts'), 'static/katex/fonts', {recursive: true});
console.log('KaTeX assets copied to static/katex');
