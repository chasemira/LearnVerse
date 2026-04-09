/**
 * GitHub Pages serves 404.html for unknown paths. Copying the built index lets
 * deep links (e.g. /LearnVerse/contacts) load the SPA after refresh.
 */
import { copyFileSync, existsSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const indexHtml = resolve(root, 'dist', 'index.html');
const notFoundHtml = resolve(root, 'dist', '404.html');

if (!existsSync(indexHtml)) {
  console.error('copy-spa-fallback: dist/index.html missing — run vite build first');
  process.exit(1);
}
copyFileSync(indexHtml, notFoundHtml);
console.log('copy-spa-fallback: wrote dist/404.html');
