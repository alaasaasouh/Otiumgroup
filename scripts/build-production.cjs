// Regenerate only Projects and its modal, preserving published metadata and other sections.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { portfolioSection } = require('./portfolio-component.cjs');
const root = path.resolve(__dirname, '..');
const file = path.join(root, 'production/index.html');
const html = fs.readFileSync(file, 'utf8');
const start = html.indexOf('<section class="work-section');
const end = html.indexOf('</main>', start);
if (start < 0 || end < 0) throw Error('Production Projects boundaries not found');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'data/portfolio.js'), 'utf8'), context);
fs.writeFileSync(file, html.slice(0, start) + portfolioSection(context.window.OTIUM_PORTFOLIO, context.window.OTIUM_PORTFOLIO_CATEGORIES) + html.slice(end));
console.log('Built Production Projects markup');
