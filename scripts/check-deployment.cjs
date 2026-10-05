const assert = require('node:assert/strict');
const { chromium } = require('playwright-core');
const sites = process.argv[2] ? [process.argv[2]] : ['https://otiumgroup.vercel.app/', 'https://alaasaasouh.github.io/Otiumgroup/'];
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    for (const [index, base] of sites.entries()) {
      const context = await browser.newContext({ viewport: { width: index ? 1440 : 390, height: 900 } });
      const page = await context.newPage();
      const errors = [];
      const failed = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('response', response => { if (response.url().startsWith(base) && response.status() >= 400) failed.push(response.url()); });
      for (const language of ['en', 'ar', 'fr']) {
        console.log('Checking ' + base + ' language ' + language);
        const response = await page.goto(base, { waitUntil: 'domcontentloaded' });
        assert.equal(response.status(), 200);
        await page.waitForSelector('.home-intro[open]');
        assert.equal(await page.locator('.intro-language').count(), 3);
        await page.waitForFunction(() => document.querySelector('.home-scroll').classList.contains('has-frame'));
        const origin = await page.evaluate(() => performance.timeOrigin);
        await page.locator('[data-language="' + language + '"]').click();
        assert.equal(await page.locator('.home-intro').count(), 0);
        assert.equal(await page.locator('html').getAttribute('lang'), language);
        assert.equal(await page.evaluate(() => performance.timeOrigin), origin);
        assert(await page.locator('main').isVisible());
      }
      await page.screenshot({ path: 'preview/live-' + new URL(base).hostname + '-home.png' });
      const production = await page.goto(base + 'production/index.html');
      assert.equal(production.status(), 200);
      assert.equal(await page.locator('.portfolio-open').count(), 8);
      const image = page.locator('.portfolio-poster img').first();
      await image.scrollIntoViewIfNeeded();
      await image.evaluate(img => img.decode());
      for (const route of ['about/', 'contact/', 'digital/', 'divisions/', 'events/', 'experiences/', 'luxury/', 'travel/', 'js/generated/otium-video-player.js', 'frames/frame_0145.jpg', 'frames/mobile/frame_0145.jpg']) {
        const response = await context.request.get(base + route);
        assert.equal(response.status(), 200, base + route);
        await response.dispose();
      }
      assert.deepEqual(errors, []);
      assert.deepEqual(failed, []);
      console.log(base + ' — all language choices, background animation, 10 pages, Production posters/player assets passed; no page errors or failed site assets.');
      await context.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
