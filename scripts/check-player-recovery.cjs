const assert=require('node:assert/strict');
const {chromium}=require('playwright-core');
(async()=>{
 const b=await chromium.launch({headless:true,channel:'chrome'});
 const p=await b.newPage();let attempts=0;
 await p.route('**/js/generated/otium-video-player.js',r=>++attempts===1?r.abort('failed'):r.continue());
 await p.goto('http://localhost:4173/production/');await p.locator('.portfolio-open').first().click();
 await p.locator('[data-video-retry]').waitFor({state:'visible'});
 assert.match(await p.locator('.portfolio-loading').textContent(),/player could not load/);
 await p.locator('[data-video-retry]').click();
 await p.waitForFunction(()=>{const v=document.querySelector('mux-player');return v&&v.currentTime>0&&!v.paused;},{},{timeout:45000});
 assert.equal(attempts,2);assert.equal(await p.locator('mux-player').count(),1);
 assert(await p.locator('.portfolio-loading').isHidden());
 // Simulate a transient error after playback and verify recovery clears the overlay.
 await p.locator('mux-player').evaluate(v=>v.dispatchEvent(new Event('error')));
 await p.locator('mux-player').evaluate(v=>v.dispatchEvent(new Event('canplay')));
 assert(await p.locator('.portfolio-loading').isHidden());
 await p.locator('.portfolio-close').click();assert.equal(await p.locator('mux-player').count(),0);
 console.log('PASS localhost: failed bundle retry plays real stream; one player; transient error recovery; cleanup');
 await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
