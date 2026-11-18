const assert = require('node:assert/strict');
const {chromium} = require(process.env.PLAYWRIGHT_PATH || 'playwright-core');
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:4173/';
const routes = ['', 'about/', 'divisions/', 'production/', 'events/', 'contact/'];

(async () => {
  const browser = await chromium.launch({headless:true, channel:'chrome'});
  const errors = [];
  try {
    for (const language of ['en', 'fr', 'ar']) {
      for (const width of [1440, 390]) {
        const context = await browser.newContext({viewport:{width,height:900}, reducedMotion:'reduce', hasTouch:width===390});
        const page = await context.newPage();
        page.on('pageerror', error => errors.push(error.message));
        async function enterHome() {
          await page.goto(base+'?lang='+language, {waitUntil:'domcontentloaded'});
          await page.locator(`[data-language="${language}"]`).click();
        }
        async function checkDestination(expected) {
          await page.waitForURL(expected,{timeout:5000,waitUntil:'domcontentloaded'});
          await page.waitForLoadState('domcontentloaded');
          if (new URL(expected).pathname === new URL('index.html',base).pathname) {
            await page.locator(`[data-language="${language}"]`).click();
          }
          assert.equal(await page.locator('html').getAttribute('lang'), language);
          assert(await page.locator('h1').isVisible(), 'Destination page heading must be visible');
          assert.equal(await page.locator('dialog[open]').count(), 0, 'Navigation must open a page');
        }

        // Actually follow cards: href-only checks missed the old dialog interception.
        for (const kind of ['production', 'events']) {
          for (const method of width===390 ? ['tap'] : ['click', 'keyboard']) {
            await enterHome();
            const card = page.locator('.home-company-card--'+kind);
            const expected = new URL(await card.getAttribute('href'),page.url()).href;
            assert.equal(new URL(expected).pathname, new URL(kind+'/index.html',base).pathname);
            assert.equal(new URL(expected).searchParams.get('lang'), language);
            if (method==='keyboard') { await card.focus(); await page.keyboard.press('Enter'); }
            else if (method==='tap') await card.locator('h2').tap();
            else await card.locator('img').click();
            await checkDestination(expected);
            assert(await page.locator(`[data-client-paragraph="${kind==='production'?28:51}"]`).isVisible());
            await page.goBack({waitUntil:'domcontentloaded'});
            assert.equal(new URL(page.url()).pathname,new URL(base).pathname);
            if (await page.locator('.home-intro').count()) await page.locator(`[data-language="${language}"]`).click();
            assert.equal(await page.locator('dialog[open]').count(),0);
            assert.equal(await page.locator('body').evaluate(el=>el.classList.contains('story-open')),false);
          }
        }

        // Follow every destination in desktop/mobile navigation and the footer.
        const navigation = width===390 ? '.mobile-menu nav' : '.desktop-nav';
        for (const group of [navigation, '.footer-nav']) {
          const count = group===navigation && width===1440 ? 4 : 5;
          await enterHome();
          for (let index=0; index<count; index++) {
            if (group===navigation && width===390) await page.locator('.menu-toggle').tap();
            const link = page.locator(group+' a').nth(index);
            const expected = new URL(await link.getAttribute('href'),page.url()).href;
            if (width===390) await link.tap(); else await link.click();
            await checkDestination(expected);
            assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
            assert.equal(await page.locator('main').evaluate(el=>el.inert),false);
          }
        }
        if (width===1440) {
          await enterHome();
          const contact = page.locator('.header-contact');
          const expected = new URL(await contact.getAttribute('href'),page.url()).href;
          await contact.click();
          await checkDestination(expected);
        }

        if (language==='en' && width===390) {
          await enterHome();
          await page.locator('.skip-link').focus();
          await page.keyboard.press('Enter');
          assert.equal(await page.evaluate(()=>document.activeElement.id),'main');
          assert.equal(await page.locator('.scroll-cue,.footer-bottom a[href="#top"]').count(),0);
          await page.locator('.menu-toggle').click();
          await page.keyboard.press('Shift+Tab');
          assert.equal(await page.evaluate(()=>document.activeElement.className),'menu-toggle');
          await page.keyboard.press('Shift+Tab');
          assert.match(await page.evaluate(()=>document.activeElement.textContent),/Contact/);
          await page.keyboard.press('Tab');
          assert.equal(await page.evaluate(()=>document.activeElement.className),'menu-toggle');
          await page.keyboard.press('Escape');
          assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
        }

        if (width===1440) {
          const checked = new Set();
          for (const route of routes) {
            await page.goto(base+route+'?lang='+language,{waitUntil:'domcontentloaded'});
            if (!route) await page.locator(`[data-language="${language}"]`).click();
            const links = await page.locator('a[href]').evaluateAll(items=>items.map(a=>({raw:a.getAttribute('href'),url:a.href})));
            for (const link of links) {
              if (link.raw.startsWith('#')) {
                assert(await page.evaluate(id=>!!document.getElementById(id),decodeURIComponent(link.raw.slice(1))),route+' missing anchor '+link.raw);
                continue;
              }
              const url = new URL(link.url);
              if (url.origin!==new URL(base).origin) continue;
              assert.equal(url.searchParams.get('lang'),language,route+' loses selected language');
              if (!checked.has(url.href)) {
                const response = await context.request.get(url.href);
                assert.equal(response.status(),200,'Broken link: '+url.href);
                await response.dispose();
                checked.add(url.href);
              }
            }
          }
        }
        await context.close();
        console.log(`${language} ${width}px: company cards, Back, header/mobile menu, footer and language retention passed.`);
      }
    }
    const plain = await browser.newPage({javaScriptEnabled:false});
    for (const kind of ['production','events']) {
      await plain.goto(base);
      await plain.locator('.home-company-card--'+kind).click();
      assert.equal(new URL(plain.url()).pathname,new URL(kind+'/index.html',base).pathname);
      assert(await plain.locator('h1').isVisible());
    }
    await plain.close();
    assert.deepEqual(errors,[]);
    console.log('All six pages: internal links and hash targets verified; keyboard focus and no-JavaScript navigation passed.');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
