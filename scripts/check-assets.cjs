const {chromium}=require(process.env.PLAYWRIGHT_PATH || 'playwright-core');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
(async()=>{
  const browser=await chromium.launch({headless:true,channel:'chrome'});
  const page=await browser.newPage({reducedMotion:'reduce'});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
  page.on('requestfailed',r=>errors.push(r.url()));
  for(const route of ['', 'about/', 'divisions/', 'production/', 'travel/', 'events/', 'contact/', 'digital/', 'experiences/', 'luxury/']){
    await page.goto(`http://127.0.0.1:4173/${route}`,{waitUntil:'networkidle'});
    if(!route)await page.locator('[data-language="en"]').click();
    await page.locator('img').evaluateAll(images=>images.forEach(img=>img.loading='eager'));
    await page.waitForFunction(()=>[...document.images].every(img=>img.complete));
    assert(await page.locator('img').evaluateAll(images=>images.every(img=>img.naturalWidth>0)),`Broken image on ${route}`);
    console.log(`Assets intact: /${route}`);
  }
  for(const folder of ['frames','frames/mobile']) for(let i=1;i<=145;i++){
    assert(fs.existsSync(path.resolve(__dirname,'..',folder,`frame_${String(i).padStart(4,'0')}.jpg`)));
  }
  assert.deepEqual(errors,[]);
  console.log('All ten pages and 290 animation frames verified.');
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
