const {chromium}=require(process.env.PLAYWRIGHT_PATH || 'playwright-core');
const fs=require('node:fs');const path=require('node:path');const {pathToFileURL}=require('node:url');const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const root=path.resolve(__dirname,'..');fs.mkdirSync(path.join(root,'preview'),{recursive:true});
 const errors=[];
 for(const width of [1440,768,390,320]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('https://www.youtube-nocookie.com/embed/**',r=>r.fulfill({contentType:'text/html',body:'<button>Player test</button>'}));
  for(const route of ['','about','divisions','production','events','luxury','digital','experiences','travel','contact']){
   await page.goto(pathToFileURL(path.join(root,route,'index.html')).href);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${route} ${width}: overflow`);
   assert.equal(await page.locator('h1').count(),1,`${route}: heading`);
   const links=await page.locator('a[href]').evaluateAll(items=>items.map(a=>a.getAttribute('href')));
   for(const href of links){if(!href||/^(https?:|mailto:|tel:|#)/.test(href))continue;assert(fs.existsSync(path.resolve(root,route,href.split(/[?#]/)[0])),`Missing link ${route}: ${href}`);}
   if(route==='production'){
    await page.locator('[data-slide-next]').click();assert.equal(await page.locator('[data-current-slide]').textContent(),'02');
    await page.locator('.brand-accordions summary').first().click();assert(await page.locator('.brand-accordions details').first().evaluate(el=>el.open));
    await page.locator('[data-video-id]').first().click();assert(await page.locator('dialog').evaluate(el=>el.open));await page.keyboard.press('Escape');
   }
   if(route==='events'){await page.locator('#event-capabilities summary').first().click();assert(await page.locator('#event-capabilities details').first().evaluate(el=>el.open));}
   await page.evaluate(()=>scrollTo(0,0));
   if(['','production','events','contact'].includes(route)&&[1440,390].includes(width))await page.screenshot({path:path.join(root,'preview',`brand-${route||'home'}-${width}.png`),fullPage:true});
  }
  await page.goto(pathToFileURL(path.join(root,'contact/index.html')).href+'?type=Events');assert.equal(await page.locator('#type').inputValue(),'Events');
  await page.goto(pathToFileURL(path.join(root,'contact/index.html')).href+'?type=Production');assert.equal(await page.locator('#type').inputValue(),'Productions');
  console.log(`${width}px: ten pages, local links, headings, overflow, slideshow, accordions, project dialog and inquiry routing passed`);await page.close();
 }
 assert.deepEqual(errors,[]);await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
