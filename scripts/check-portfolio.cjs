const fs=require('node:fs');
const assert=require('node:assert/strict');
const {chromium}=require('playwright-core');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const results=[];
 for(const width of [1440,768,390,320]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  const requests=[],errors=[];page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/production/',{waitUntil:'networkidle'});
  await page.locator('#work').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  assert.equal(requests.filter(u=>/mux.com|otium-video-player|youtube|googlevideo|facebook/.test(u)).length,0,'No player or third-party media before click');
  assert.equal(await page.locator('mux-player,iframe,video').count(),0);
  assert.equal(await page.locator('.portfolio-card').count(),8);
  const entries=await page.evaluate(()=>window.OTIUM_PORTFOLIO);
  for(let i=0;i<(width===1440?8:1);i++){
   const card=page.locator('.portfolio-open').nth(i);
   await card.scrollIntoViewIfNeeded();await card.focus();await page.keyboard.press('Enter');
   await page.waitForSelector('mux-player');
   assert.equal(await page.locator('mux-player').count(),1);
   assert.equal(await page.locator('mux-player').getAttribute('playback-id'),entries[i].muxPlaybackId);
   await page.waitForFunction(()=>{const p=document.querySelector('mux-player');return p&&p.readyState>=2&&p.currentTime>0&&!p.paused;},{},{timeout:45000});
   assert.equal(await page.evaluate(()=>document.body.style.position),'fixed');
   const box=await page.locator('.portfolio-stage').boundingBox();assert(Math.abs(box.width/box.height-16/9)<.02);
   assert.equal(await page.locator('mux-player').getAttribute('playsinline'),'');
   // Retain a reference to prove the disconnected player is paused on close.
   await page.evaluate(()=>{window.lastPlayer=document.querySelector('mux-player');});
   if(i===0){
    await page.locator('mux-player').evaluate(p=>p.pause());assert(await page.locator('mux-player').evaluate(p=>p.paused));
    await page.locator('mux-player').evaluate(p=>{p.currentTime=10;p.volume=.5;p.muted=true;});
    assert(await page.locator('mux-player').evaluate(p=>p.muted&&p.volume===.5));
    await page.locator('mux-player').evaluate(p=>p.play());
    const fullscreen=page.locator('media-fullscreen-button').last();
    await fullscreen.click();await page.waitForFunction(()=>!!document.fullscreenElement);
    await page.evaluate(()=>document.exitFullscreen());
    await page.screenshot({path:'preview/mux-modal-'+width+'.png'});
   }
   await page.locator('.portfolio-close').focus();await page.keyboard.press('Escape');
   await page.waitForFunction(()=>!document.querySelector('.portfolio-modal').open);
   assert.equal(await page.locator('mux-player,video').count(),0);
   assert(await page.evaluate(()=>!window.lastPlayer.isConnected&&window.lastPlayer.paused));
   assert.equal(await page.evaluate(()=>document.activeElement.dataset.videoId),entries[i].id);
   const count=requests.filter(u=>/stream.mux.com/.test(u)).length;await page.waitForTimeout(350);assert.equal(requests.filter(u=>/stream.mux.com/.test(u)).length,count,'No new stream requests after close');
   results.push({width,card:i+1,id:entries[i].muxPlaybackId,played:true});
   console.log(width+'px card '+(i+1)+': actual Mux playback, correct ID, close/unmount passed');
  }
  await page.locator('.portfolio-open').first().click();await page.waitForSelector('mux-player');await page.mouse.click(2,2);await page.waitForFunction(()=>!document.querySelector('.portfolio-modal').open);assert.equal(await page.locator('mux-player').count(),0);
  await page.locator('[data-filter="Documentary"]').click();assert.equal(await page.locator('.portfolio-card:visible').count(),0);
  await page.locator('[data-filter="Podcasts"]').click();assert.equal(await page.locator('.portfolio-card:visible').count(),8);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.deepEqual(errors,[]);await page.screenshot({path:'preview/mux-cards-'+width+'.png'});await page.close();
 }
 // Closing before the lazy import resolves must not resurrect a player.
 const page=await browser.newPage();await page.route('**/js/generated/otium-video-player.js',async route=>{await new Promise(r=>setTimeout(r,800));await route.continue();});
 await page.goto('http://127.0.0.1:4173/production/');await page.locator('.portfolio-open').first().click();await page.locator('.portfolio-close').click();await page.waitForTimeout(1500);assert.equal(await page.locator('mux-player').count(),0);
 fs.writeFileSync('preview/mux-verification.json',JSON.stringify(results,null,2));await browser.close();console.log('All Mux checks passed, including lazy-import cancellation.');
})().catch(e=>{console.error(e);process.exit(1)});
