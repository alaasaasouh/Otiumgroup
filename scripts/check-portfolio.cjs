const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright-core');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 fs.mkdirSync(path.resolve(__dirname,'../preview'),{recursive:true});
 for(const width of [1440,768,390,320]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  const errors=[],youtube=[];page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(/youtube|ytimg|googlevideo/.test(r.url()))youtube.push(r.url())});
  await page.route('https://www.youtube-nocookie.com/embed/**',route=>route.fulfill({contentType:'text/html',body:'<html><body style="background:#121e19;color:white"><button>Test player controls</button></body></html>'}));
  await page.goto('http://127.0.0.1:4173/production/',{waitUntil:'networkidle'});
  await page.locator('#work').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>[...document.querySelectorAll('.portfolio-poster img')].every(img=>!img.complete||img.naturalWidth>0));
  assert.equal(await page.locator('iframe').count(),0);assert.equal(youtube.length,0,'Third-party request before interaction');
  assert.equal(await page.locator('.portfolio-card').count(),8);
  await page.locator('[data-filter="Documentary"]').click();assert.equal(await page.locator('.portfolio-card:visible').count(),0);assert(await page.locator('.project-empty').isVisible());
  await page.locator('[data-filter="Podcasts"]').click();assert.equal(await page.locator('.portfolio-card:visible').count(),8);
  await page.locator('.portfolio-open').first().focus();const before=await page.evaluate(()=>scrollY);
  await page.keyboard.press('Enter');assert.equal(await page.locator('iframe').count(),1);assert(await page.locator('iframe').getAttribute('src').then(s=>s.includes('autoplay=1')));
  assert(await page.locator('.portfolio-modal').evaluate(el=>el.open));assert.equal(await page.evaluate(()=>document.body.style.position),'fixed');
  await page.waitForFunction(()=>document.querySelector('.portfolio-stage').classList.contains('is-ready'));
  const playerBox=await page.locator('.portfolio-stage').boundingBox();assert(Math.abs(playerBox.width/playerBox.height-16/9)<.02,'Player must be 16:9');
  await page.locator('.portfolio-close').focus();
  await page.keyboard.press('Escape');assert.equal(await page.locator('iframe').count(),0);
  assert.equal(await page.evaluate(()=>document.activeElement.dataset.videoId),'9kM9o1gWy5M');assert(Math.abs(await page.evaluate(()=>scrollY)-before)<3);
  for(let i=0;i<8;i++){
   await page.locator('.portfolio-open').nth(i).click();assert.equal(await page.locator('iframe').count(),1);
   await page.locator('.portfolio-close').click();assert.equal(await page.locator('iframe').count(),0);
  }
  await page.locator('.portfolio-open').first().click();await page.mouse.click(2,2);assert.equal(await page.locator('iframe').count(),0);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  await page.screenshot({path:path.resolve(__dirname,`../preview/production-cinema-${width}.png`)});
  await page.locator('#work').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));await page.screenshot({path:path.resolve(__dirname,`../preview/production-videos-${width}.png`)});
  assert.deepEqual(errors,[]);console.log(`${width}px: zero initial YouTube requests, 8 lazy players, filtering, keyboard, close/reopen, focus, scroll restore and responsive layout passed`);await page.close();
 }
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 await page.goto('http://127.0.0.1:4173/production/');
 await page.waitForFunction(()=>document.querySelector('[data-current-slide]').textContent==='02',{},{timeout:3500});
 await page.locator('.pause-slider').click();const paused=await page.locator('[data-current-slide]').textContent();await page.waitForTimeout(2200);assert.equal(await page.locator('[data-current-slide]').textContent(),paused);
 await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('.hero-slide:not(.active) a:not([tabindex="-1"])').evaluateAll(items=>items.every(a=>a.closest('[inert]')!==null)),true);
 console.log('One-second slideshow, pause, and inactive-slide keyboard isolation passed');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
