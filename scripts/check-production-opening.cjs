const {chromium}=require(process.env.PLAYWRIGHT_PATH || 'playwright-core');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const assert=require('node:assert/strict');
(async()=>{
  const browser=await chromium.launch({headless:true,channel:'chrome'});
  for(const width of [1440,768,390,320]){
    const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(pathToFileURL(path.resolve(__dirname,'../production/index.html')).href);
    await page.locator('[data-slide-next]').click();
    assert.equal(await page.locator('[data-current-slide]').textContent(),'02');
    await page.locator('[data-slide-prev]').click();
    assert.equal(await page.locator('[data-current-slide]').textContent(),'01');
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    assert.equal(await page.locator('#capabilities').count(),1);
    assert.equal(await page.locator('.hero-slide.active').count(),1);
    await page.screenshot({path:`preview/production-opening-${width}.png`});
    assert.deepEqual(errors,[]);
    console.log(`${width}px: slideshow controls, section destination, overflow and console passed`);
    await page.close();
  }
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
