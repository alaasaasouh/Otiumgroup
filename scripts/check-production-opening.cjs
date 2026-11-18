const {chromium}=require(process.env.PLAYWRIGHT_PATH || 'playwright-core');
const assert=require('node:assert/strict');
const base=process.env.TEST_BASE_URL || 'http://127.0.0.1:4173/';
(async()=>{
  const browser=await chromium.launch({headless:true,channel:'chrome'});
  const errors=[];
  try {
    for(const language of ['en','fr','ar']) for(const width of [1440,768,390,320]){
      const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce',hasTouch:width<=390});
      page.on('pageerror',e=>errors.push(e.message));
      for(const route of ['production','events']){
        await page.goto(`${base}${route}/?lang=${language}`,{waitUntil:'networkidle'});
        const pause=page.locator('.pause-slider');
        assert.equal(await pause.getAttribute('aria-pressed'),'true');
        // The first click used to be lost when focus replaced the icon under the pointer.
        if(width<=390) await pause.tap(); else await pause.click();
        assert.equal(await pause.getAttribute('aria-pressed'),'false');
        await pause.click();
        assert.equal(await pause.getAttribute('aria-pressed'),'true');
        await page.locator('[data-slide-next]').click();
        assert.equal(await page.locator('[data-current-slide]').textContent(),'02');
        await page.locator('[data-slide-prev]').click();
        assert.equal(await page.locator('[data-current-slide]').textContent(),'01');
        await page.locator('[data-slide-prev]').click();
        assert.equal(await page.locator('[data-current-slide]').textContent(),'03');
        await page.locator('[data-slide-next]').click();
        assert.equal(await page.locator('[data-current-slide]').textContent(),'01');
        await page.locator('[data-slide-next]').focus();
        await page.keyboard.press('ArrowRight');
        assert.equal(await page.locator('[data-current-slide]').textContent(),'02');
        await page.keyboard.press('ArrowLeft');
        assert.equal(await page.locator('[data-current-slide]').textContent(),'01');
        assert.equal(await page.locator('.hero-slide.active').count(),1);
        const track=page.locator('.format-track');
        await page.locator('[data-format-next]').click();
        await page.waitForFunction(()=>Math.abs(document.querySelector('.format-track').scrollLeft)>0);
        await page.locator('[data-format-prev]').click();
        await page.waitForFunction(()=>Math.abs(document.querySelector('.format-track').scrollLeft)<2);
        await track.focus();
        await page.keyboard.press('End');
        assert(await page.locator('.format-card').last().evaluate(el=>{const a=el.getBoundingClientRect(),b=el.parentElement.getBoundingClientRect();return a.left>=b.left-2&&a.right<=b.right+2;}));
        await page.keyboard.press('Home');
        await page.waitForFunction(()=>Math.abs(document.querySelector('.format-track').scrollLeft)<2);
        await page.waitForFunction(()=>document.querySelector('[data-format-prev]').disabled);
        assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
        assert.equal(await page.locator('#capabilities').count(),1);
      }
      console.log(`${language} ${width}px: both slideshows, first-click play/pause, keyboard controls and service carousels passed.`);
      await page.close();
    }
    assert.deepEqual(errors,[]);
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exit(1)});
