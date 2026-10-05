// Stage the complete static website with the same URL paths as GitHub Pages.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = path.resolve(root, 'dist');
if (path.dirname(output) !== root || path.basename(output) !== 'dist') {
  throw new Error('Static output must be the workspace dist directory');
}
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

const entries = [
  'index.html', 'style.css', 'brand.css', 'hero.css', 'production.css', 'portfolio.css', 'i18n.css',
  'robots.txt', 'sitemap.xml',
  'about', 'contact', 'digital', 'divisions', 'events', 'experiences', 'luxury',
  'production', 'travel', 'assets', 'data', 'frames', 'js', 'public'
];
for (const entry of entries) {
  fs.cpSync(path.join(root, entry), path.join(output, entry), { recursive: true });
}
console.log('Staged complete static website in dist/');
