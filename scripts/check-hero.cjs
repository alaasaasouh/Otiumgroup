const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright-core');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const url = pathToFileURL(path.resolve(__dirname, '../index.html')).href;
  for (const width of [1440, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(url);
    await page.waitForFunction(() => document.querySelector('.home-scroll').dataset.frame === '1');
    const distance = await page.evaluate(() => {
      const s = document.querySelector('.home-scroll');
      return s.offsetHeight - s.firstElementChild.offsetHeight;
    });
    await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), distance * .5);
    await page.waitForFunction(() => Number(document.querySelector('.home-scroll').dataset.frame) >= 70);
    assert(Math.abs(await page.locator('.group-hero').evaluate(el => el.getBoundingClientRect().top)) < 2, 'Hero must stay pinned');
    await page.screenshot({ path: `preview/hero-scroll-${width}.png` });
    await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), distance);
    await page.waitForFunction(() => document.querySelector('.home-scroll').dataset.frame === '145');
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForFunction(() => document.querySelector('.home-scroll').dataset.frame === '1');
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.hero-canvas')).display === 'none');
    await page.reload();
    assert.equal(await page.locator('.home-scroll').evaluate(el => el.classList.contains('is-active')), false);
    assert.deepEqual(errors, []);
    console.log(`${width}px: forward/reverse frames, sticky hero, reduced motion, no overflow or JS errors passed`);
    await page.close();
  }
  const page = await browser.newPage({ javaScriptEnabled: false });
  await page.goto(url);
  assert(await page.locator('.home-scroll picture img').evaluate(el => el.complete && el.naturalWidth > 0));
  assert.equal(await page.locator('.home-scroll').evaluate(el => el.classList.contains('is-active')), false);
  console.log('No JavaScript: static poster and normal document flow passed');
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
