const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright-core');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const base='http://127.0.0.1:4173/';
 const errors=[];
 const newPage=async options=>{
  const page=await browser.newPage(options);
  page.on('pageerror',e=>errors.push(e.message));
  return page;
 };
 const enter=async(page,language)=>{
  const url=page.url();
  const timeOrigin=await page.evaluate(()=>performance.timeOrigin);
  await page.locator('[data-language="'+language+'"]').click();
  assert.equal(await page.locator('.home-intro').count(),0);
  assert.equal(await page.evaluate(()=>document.documentElement.classList.contains('intro-pending')),false);
  assert.equal(await page.locator('main').evaluate(el=>getComputedStyle(el).visibility),'visible');
  assert.equal(await page.locator('html').getAttribute('lang'),language);
  assert.equal(await page.evaluate(()=>document.activeElement.id),'main');
  assert.equal(new URL(page.url()).pathname,new URL(url).pathname,'A choice must reveal the prepared page without a redirect');
  assert.equal(new URL(page.url()).searchParams.get('lang'),language);
  assert.equal(await page.evaluate(()=>performance.timeOrigin),timeOrigin,'A choice must not reload the page');
 };
 try {
  const page=await newPage({viewport:{width:390,height:844}});
  // Hold later frames until after entry to verify loading behind the picker and homepage.
  let releaseFrames;
  const heldFrames=new Promise(resolve=>{releaseFrames=resolve;});
  await page.route('**/frames/**/*.jpg',async route=>{
   if(!route.request().url().endsWith('frame_0001.jpg'))await heldFrames;
   await route.continue().catch(()=>{});
  });
  await page.goto(base,{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.home-intro[open]');
  assert.deepEqual(await page.locator('.intro-language').allTextContents(),['English','العربية','Français']);
  assert.equal(await page.locator('main').evaluate(el=>getComputedStyle(el).visibility),'hidden');
  await page.waitForFunction(()=>document.querySelector('.home-scroll').classList.contains('has-frame'));
  assert(await page.locator('progress').evaluate(el=>el.value>0&&el.value<1),'Progress must reflect background preparation');
  await page.screenshot({path:'preview/home-loading-mobile.png'});
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.home-intro').evaluate(el=>el.open),true,'Escape must not skip language selection');
  await page.locator('[data-language="en"]').focus();
  for(const language of ['ar','fr']){
   await page.keyboard.press('Tab');
   assert.equal(await page.evaluate(()=>document.activeElement.dataset.language),language,'Language choices are reachable by Tab');
  }
  await enter(page,'en');
  releaseFrames();
  await page.waitForLoadState('networkidle');
  assert(await page.evaluate(()=>performance.getEntriesByType('resource').some(r=>r.name.endsWith('frame_0009.jpg'))),'Animation requests continue after entry');
  await page.close();
  console.log('Mobile: languages, background preparation, early entry without reload, keyboard focus and continued loading passed');

  const ready=await newPage({viewport:{width:1440,height:900}});
  await ready.goto(base);
  await ready.waitForFunction(()=>document.querySelector('.home-intro progress').value===1);
  await ready.waitForTimeout(2800);
  assert.equal(await ready.locator('.home-intro').evaluate(el=>el.open),true,'Readiness and the old timeout must not skip selection');
  assert.equal(await ready.locator('.intro-status').textContent(),'Your first glimpse is ready');
  await ready.screenshot({path:'preview/home-loading-desktop.png'});
  for(const [width,height] of [[320,568],[844,390],[1440,900]]){
   await ready.setViewportSize({width,height});
   assert(await ready.locator('.home-intro').evaluate(el=>el.scrollWidth<=el.clientWidth),'Language picker must fit narrow screens');
   for(const button of await ready.locator('.intro-language').all()){
    const box=await button.boundingBox();
    assert(box.width>=44&&box.height>=44&&box.y>=0&&box.y+box.height<=height,'Language choices must be reachable on short screens');
   }
  }
  await enter(ready,'ar');
  await ready.reload();
  await ready.waitForSelector('.home-intro[open]');
  await ready.locator('[data-language="fr"]').focus();
  await ready.keyboard.press('Enter');
  assert.equal(await ready.locator('.home-intro').count(),0);
  assert.equal(await ready.locator('html').getAttribute('lang'),'fr');
  assert.equal(await ready.evaluate(()=>document.activeElement.id),'main');
  await ready.close();
  console.log('Ready/repeat visits: picker persists; Arabic/French translate in place; desktop, narrow and landscape layouts passed');

  const failed=await newPage();
  await failed.route('**/frames/**/*.jpg',route=>route.abort());
  await failed.goto(base);
  assert.equal(await failed.locator('.home-intro').evaluate(el=>el.open),true);
  assert.equal(await failed.locator('.home-scroll.is-active').count(),0);
  assert.equal(await failed.locator('.home-intro progress').isVisible(),false);
  await enter(failed,'fr');
  assert(await failed.locator('.hero-media img').evaluate(img=>img.naturalWidth>0),'Independent poster must survive failed JPG frames');
  await failed.close();

  const stalled=await newPage();
  await stalled.route('**/frames/**/*.jpg',()=>{});
  await stalled.goto(base,{waitUntil:'domcontentloaded'});
  await stalled.waitForTimeout(2800);
  assert.equal(await stalled.locator('.home-intro').evaluate(el=>el.open),true);
  await enter(stalled,'ar');
  await stalled.close();
  console.log('Failed/stalled frames: language choices stay available and do not block entry passed');

  for(const preference of ['reducedMotion','saveData']){
   const accessible=await newPage(preference==='reducedMotion'?{reducedMotion:'reduce'}:{});
   if(preference==='saveData')await accessible.addInitScript(()=>Object.defineProperty(navigator,'connection',{value:{saveData:true},configurable:true}));
   let frames=0;
   accessible.on('request',r=>{if(/frame_\d+\.jpg/.test(r.url()))frames++;});
   await accessible.goto(base);
   assert.equal(await accessible.locator('.home-intro').evaluate(el=>el.open),true);
   assert.equal(await accessible.locator('.home-intro progress').isVisible(),false);
   assert(frames<=1,'Static preferences must not preload animation');
   await enter(accessible,'en');
   assert.equal(await accessible.locator('.home-scroll.is-active').count(),0);
   await accessible.close();
  }
  const plain=await newPage({javaScriptEnabled:false});
  await plain.goto(base);
  assert.equal(await plain.locator('.home-intro').isVisible(),false);
  assert.equal(await plain.locator('main').evaluate(el=>getComputedStyle(el).visibility),'visible');
  assert(await plain.locator('.hero-media img').evaluate(img=>img.naturalWidth>0));
  await plain.close();
  const blocked=await newPage();
  await blocked.route('**/js/*.js',route=>route.abort());
  await blocked.goto(base);
  await blocked.waitForFunction(()=>!document.documentElement.classList.contains('intro-pending'),{},{timeout:3000});
  assert.equal(await blocked.locator('main').evaluate(el=>getComputedStyle(el).visibility),'visible');
  await blocked.close();
  assert.deepEqual(errors,[]);
  console.log('Reduced motion, data saving, JavaScript-disabled access and script-failure safety passed; no page errors');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
