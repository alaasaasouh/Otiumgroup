const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {chromium}=require('playwright-core');
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173/';
const routes=['','about/','divisions/','production/','events/','luxury/','digital/','experiences/','travel/','contact/'];
const scope={window:{}};
vm.runInNewContext(fs.readFileSync('data/translations.js','utf8'),scope);
const catalog=scope.window.OTIUM_TRANSLATIONS;
// Coverage comes from the actual ten pages, independently of the translation engine.
for(const route of routes){
 const html=fs.readFileSync(route+'index.html','utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/g,'');
 const strings=[...html.matchAll(/>([^<]+)</g)].map(m=>m[1]);
 strings.push(...[...html.matchAll(/(?:alt|aria-label|placeholder|data-title|data-caption)="([^"]+)"/g)].map(m=>m[1]));
 strings.push(...[...html.matchAll(/<meta (?:name="description"|property="og:(?:title|description)") content="([^"]+)"/g)].map(m=>m[1]));
 for(const raw of strings){const text=raw.trim().replaceAll('&amp;','&').replaceAll('&quot;','"');if(!/[A-Za-z\u0600-\u06ff]/.test(text))continue;assert(catalog[text]?.every(value=>typeof value==='string'&&value.length),route+' missing translation: '+text);}
}
console.log('French and Arabic coverage verified for every static page string and accessibility label.');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const errors=[];
 try{
  for(const language of ['en','fr','ar']){
   const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:1440,height:900}});
   // Exercise the optional local-brief mode without sending test inquiries.
   await context.route('**/data/site.js',async route=>{const response=await route.fetch();await route.fulfill({response,body:(await response.text()).replace(/formEndpoint: '[^']*'/,"formEndpoint: ''")});});
   const page=await context.newPage();
   page.on('pageerror',error=>errors.push(error.message));
   for(const route of routes){
    await page.goto(base+route+'?lang='+language,{waitUntil:'domcontentloaded'});
    if(!route)await page.locator('[data-language="'+language+'"]').click();
    assert.equal(await page.locator('html').getAttribute('lang'),language);
    assert.equal(await page.locator('html').getAttribute('dir'),language==='ar'?'rtl':'ltr');
    assert.equal(await page.locator('h1').count(),1);
    for(const width of [1440,1024,810,390,320]){
     await page.setViewportSize({width,height:900});
     assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),language+' '+route+' overflow at '+width);
     const controls=await page.locator('.site-header').evaluate(el=>[...el.querySelectorAll('.brand,.language-switch,.menu-toggle,.desktop-nav,.header-contact')].filter(n=>n.getBoundingClientRect().width&&getComputedStyle(n).display!=='none').map(n=>{const r=n.getBoundingClientRect();return{left:r.left,right:r.right}}).sort((a,b)=>a.left-b.left));
     for(let i=1;i<controls.length;i++)assert(controls[i].left>=controls[i-1].right-1,language+' '+route+' header overlaps at '+width);
    }
    const links=await page.locator('a[href]').evaluateAll(items=>items.filter(a=>!a.getAttribute('href').startsWith('#')&&a.origin===location.origin&&/\.html$|\/$/.test(a.pathname)).map(a=>a.href));
    assert(links.every(href=>new URL(href).searchParams.get('lang')===language),'Language must follow internal navigation');
    if(language!=='en'&&['','about/','contact/','production/'].includes(route)){
     await page.setViewportSize({width:390,height:844});
     await page.screenshot({path:'preview/i18n-'+language+'-'+(route.replace('/','')||'home')+'-mobile.png'});
     if(!route){await page.setViewportSize({width:1440,height:900});await page.screenshot({path:'preview/i18n-'+language+'-home-desktop.png'});}
    }
   }
   await page.setViewportSize({width:390,height:844});
   await page.locator('.menu-toggle').click();
   assert.equal(await page.locator('.menu-label').textContent(),language==='en'?'Close':catalog.Close[language==='fr'?0:1]);
   await page.keyboard.press('Escape');
   // Form validation and generated files must use the selected language without translating entered content.
   await page.locator('[type=submit]').click();
   assert.equal(await page.locator('#name').evaluate(el=>el.validationMessage),language==='en'?'Please complete this field.':catalog['Please complete this field.'][language==='fr'?0:1]);
   await page.locator('#name').fill('Test Visitor');
   await page.locator('#company').fill('Original Company');
   await page.locator('#email').fill('person@example.com');
   await page.locator('#type').selectOption('Events');
   await page.locator('#message').fill('The art of making things happen.');
   await page.locator('[type=submit]').click();
   await page.locator('.form-result a[download]').waitFor();
   const brief=await page.locator('.form-result a[download]').evaluate(async el=>(await fetch(el.href)).text());
   assert(brief.includes('Test Visitor')&&brief.includes('Original Company')&&brief.includes('The art of making things happen.'));
   assert(brief.includes(language==='en'?'PROJECT INQUIRY':catalog['OTIUM GROUP — PROJECT INQUIRY'][language==='fr'?0:1]));
   assert(brief.includes(language==='en'?'Events':catalog.Events[language==='fr'?0:1]));
   if(language!=='en'){
    await page.locator('[data-language-select]').first().selectOption('en');
    assert.equal(await page.locator('#message').inputValue(),'The art of making things happen.');
    const restored=await page.locator('.form-result a[download]').evaluate(async el=>(await fetch(el.href)).text());
    assert(restored.includes('PROJECT INQUIRY')&&restored.includes('Inquiry: Events'));
   }
   await context.close();
   console.log(language+': ten pages, desktop/mobile layouts, navigation, form validation, translated downloads and English restoration passed.');
  }
  // Starting from the neutral picker must preserve the decoded animation and remember the choice.
  const animated=await browser.newPage({viewport:{width:390,height:844}});
  animated.on('pageerror',error=>errors.push(error.message));
  await animated.goto(base,{waitUntil:'domcontentloaded'});
  await animated.waitForFunction(()=>document.querySelector('.home-scroll').classList.contains('has-frame'));
  const origin=await animated.evaluate(()=>performance.timeOrigin);
  await animated.locator('[data-language="ar"]').click();
  assert.equal(await animated.evaluate(()=>performance.timeOrigin),origin);
  await animated.goto(base+'about/');
  assert.equal(await animated.locator('html').getAttribute('lang'),'ar');
  await animated.locator('[data-language-select]').first().selectOption('fr');
  await animated.reload();assert.equal(await animated.locator('html').getAttribute('lang'),'fr');
  await animated.close();
  const restricted=await browser.newPage({reducedMotion:'reduce'});
  await restricted.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new Error('Storage unavailable');}}));
  await restricted.goto(base+'about/?lang=ar');
  assert.equal(await restricted.locator('html').getAttribute('lang'),'ar');
  await restricted.locator('.desktop-nav a').filter({hasText:'شركاتنا'}).click();
  assert.equal(await restricted.locator('html').getAttribute('lang'),'ar');
  await restricted.close();
  const disabled=await browser.newPage({reducedMotion:'reduce'});
  await disabled.route('**/data/site.js',async route=>{const response=await route.fetch();await route.fulfill({response,body:(await response.text()).replace('localizationEnabled: true','localizationEnabled: false')});});
  await disabled.goto(base+'?lang=ar');await disabled.locator('[data-language="ar"]').click();
  assert.equal(await disabled.locator('html').getAttribute('lang'),'en');
  assert.equal(await disabled.locator('[data-language-switch]:visible').count(),0);
  await disabled.close();
  for(const language of ['fr','ar']){
   const page=await browser.newPage({reducedMotion:'reduce'});
   await page.goto(base+'production/?lang='+language);
   await page.locator('[data-filter="Documentary"]').click();
   assert.equal(await page.locator('.portfolio-card:visible').count(),0);
   assert.equal(await page.locator('[data-filter-status]').textContent(),await page.evaluate(()=>OtiumI18n.t('0 videos shown in Documentary.')));
   await page.locator('[data-filter="Podcasts"]').click();
   assert.equal(await page.locator('.portfolio-card:visible').count(),8);
   await page.locator('.portfolio-open').first().click();
   await page.waitForSelector('mux-player');
   await page.waitForFunction(()=>document.querySelector('mux-player').currentTime>0,{},{timeout:45000});
   assert.equal(await page.locator('media-mute-button').last().getAttribute('aria-label'),language==='fr'?'désactiver le son':'كتم الصوت');
   await page.locator('.portfolio-close').click();
   assert.equal(await page.locator('mux-player').count(),0);
   await page.close();
  }
  const noScript=await browser.newPage({javaScriptEnabled:false});
  await noScript.goto(base+'about/?lang=ar');
  assert.equal(await noScript.locator('html').getAttribute('lang'),'en');
  assert.equal(await noScript.locator('[data-language-switch]:visible').count(),0);
  assert(await noScript.locator('h1').isVisible());
  await noScript.close();
  assert.deepEqual(errors,[]);
  console.log('Animation continuity, saved choice, reloads, restricted storage, English rollback, translated video playback/filters and no-JavaScript fallback passed.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1)});
