/* Browser checks. Set PLAYWRIGHT_PATH to an installed playwright-core package.
 * This script is a development aid; it is not needed to open or deploy the site.
 */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright-core');
const root = path.resolve(__dirname,'..');
const base = 'http://127.0.0.1:4173';
const output = path.join(root, 'preview');
fs.mkdirSync(output,{recursive:true});
async function main() {
  const browser = await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL || 'chrome'});
  const context = await browser.newContext({viewport:{width:1440,height:960},deviceScaleFactor:1});
  const page = await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const failed=[];
  page.on('response',r=>{if(r.status()>=400)failed.push(`${r.status()} ${r.url()}`);});
  await page.goto(base,{waitUntil:'networkidle'});
  await page.waitForTimeout(1300);
  await page.screenshot({path:path.join(output,'home-desktop.png')});
  for (const route of ['','production/','about/','divisions/','travel/','events/','contact/']) {
    await page.goto(`${base}/${route}`,{waitUntil:'networkidle'});
    assert.equal(await page.locator('h1').count(),1,`${route} needs exactly one h1`);
    for (const width of [1440,768,390,320]) {
      await page.setViewportSize({width,height:width>800?960:844});
      const overflow = await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
      assert.equal(overflow,false,`Horizontal overflow on ${route} at ${width}px`);
    }
    console.log(`Layout OK: /${route || ''}`);
  }
  await page.setViewportSize({width:1440,height:960});
  await page.goto(base,{waitUntil:'networkidle'});
  const height=await page.evaluate(()=>document.documentElement.scrollHeight);
  for(let y=0;y<height;y+=680){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(110);}
  await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(1000);
  await page.screenshot({path:path.join(output,'home-full.png'),fullPage:true});
  await page.goto(`${base}/production/`,{waitUntil:'networkidle'});
  await page.waitForTimeout(1200);
  await page.screenshot({path:path.join(output,'production-desktop.png')});
  await page.locator('[data-slide-next]').click();
  assert.equal(await page.locator('[data-current-slide]').textContent(),'02');
  await page.locator('[data-slide-prev]').click();
  assert.equal(await page.locator('[data-current-slide]').textContent(),'01');
  await page.getByRole('button',{name:'Pause slideshow'}).click();
  assert.equal(await page.locator('.pause-slider').getAttribute('aria-pressed'),'true');
  await page.locator('[data-filter="Events"]').click();
  assert.equal(await page.locator('.project-card:visible').count(),1);
  assert.match(await page.locator('[data-filter-status]').textContent(),/1 project shown in Events/);
  await page.locator('[data-project="after-hours"]').click();
  assert.equal(await page.locator('.lightbox').evaluate(d=>d.open),true);
  assert.equal(await page.locator('.lightbox iframe').count(),0);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.lightbox').evaluate(d=>d.open),false);
  assert.equal(await page.evaluate(()=>document.activeElement.dataset.project),'after-hours');
  await page.locator('[data-filter="All"]').click();
  assert.equal(await page.locator('.project-card:visible').count(),4);
  await page.locator('[data-showreel]').click();
  assert.match(await page.locator('.lightbox-placeholder').textContent(),/official Otium showreel is coming soon/);
  await page.locator('.close-lightbox').click();
  await page.route('https://www.youtube-nocookie.com/**',route=>route.fulfill({contentType:'text/html',body:'<html><body>Test video player</body></html>'}));
  await page.evaluate(()=>window.OTIUM_PROJECTS[0].videoUrl='https://www.youtube.com/watch?v=abcDEFG1234');
  await page.locator('[data-project="in-the-making"]').click();
  assert.equal(await page.locator('.lightbox iframe').count(),1);
  await page.locator('.close-lightbox').click();
  assert.equal(await page.locator('.lightbox iframe').count(),0);
  await page.locator('.service-item summary').first().click();
  assert.equal(await page.locator('.service-item').first().getAttribute('open'),'');
  console.log('Production OK: slideshow, pause, filters, accordion, modal, focus restoration, deferred embed and cleanup');
  const prodHeight=await page.evaluate(()=>document.documentElement.scrollHeight);
  for(let y=0;y<prodHeight;y+=680){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(110);}
  await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(1000);
  await page.screenshot({path:path.join(output,'production-full.png'),fullPage:true});

  await page.setViewportSize({width:390,height:844});
  await page.goto(base,{waitUntil:'networkidle'});await page.waitForTimeout(1200);
  await page.screenshot({path:path.join(output,'home-mobile.png')});
  await page.locator('.menu-toggle').click();
  assert.equal(await page.locator('.mobile-menu').isVisible(),true);
  assert.equal(await page.locator('main').evaluate(el=>el.inert),true);
  await page.screenshot({path:path.join(output,'menu-mobile.png')});
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.mobile-menu').isVisible(),false);
  assert.equal(await page.locator('main').evaluate(el=>el.inert),false);
  await page.locator('.menu-toggle').click();
  await page.locator('.mobile-menu').getByRole('link',{name:'Production'}).click();
  await page.waitForLoadState('networkidle');
  assert.match(page.url(),/production/);
  await page.waitForTimeout(1000);
  await page.screenshot({path:path.join(output,'production-mobile.png')});
  console.log('Mobile menu OK: navigation, escape, focus, inert background');

  await page.goto(`${base}/contact/?type=Production`,{waitUntil:'networkidle'});
  assert.equal(await page.locator('#type').inputValue(),'Production');
  await page.locator('[type=submit]').click();
  assert.equal(await page.locator('.form-result').isVisible(),false);
  await page.locator('#name').fill('Test Visitor');
  await page.locator('#email').fill('visitor@example.com');
  await page.locator('#company').fill('Test Studio');
  await page.locator('#message').fill('I would like to discuss a short production project.');
  await page.locator('[type=submit]').click();
  assert.match(await page.locator('.form-result').textContent(),/Nothing has been sent/);
  const [download] = await Promise.all([page.waitForEvent('download'),page.getByRole('link',{name:'Download inquiry'}).click()]);
  const brief=fs.readFileSync(await download.path(),'utf8');
  assert.match(brief,/Test Visitor/); assert.match(brief,/has not been submitted/);
  await page.setViewportSize({width:1440,height:960});
  await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:path.join(output,'contact-desktop.png'),fullPage:true});
  console.log('Contact OK: validation, query selection, honest preview, downloadable inquiry');

  // Verify the optional delivery path against an intercepted local test response.
  // No real inquiry is sent to any external service.
  await page.route('**/data/site.js', async route => {
    const response = await route.fetch();
    const body = (await response.text()).replace("formEndpoint: ''", "formEndpoint: 'https://forms.example.test/inquiry'");
    await route.fulfill({response,body});
  });
  let deliveryStatus = 500;
  let submitted;
  await page.route('https://forms.example.test/inquiry', async route => {
    if (route.request().method() === 'OPTIONS') {
      await route.fulfill({status:204,headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type','Access-Control-Allow-Methods':'POST, OPTIONS'}});
      return;
    }
    submitted = route.request().postDataJSON();
    await route.fulfill({status:deliveryStatus,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:JSON.stringify({accepted:deliveryStatus===200})});
  });
  await page.goto(`${base}/contact/`,{waitUntil:'networkidle'});
  await page.locator('#name').fill('Delivery Test');
  await page.locator('#email').fill('test@example.com');
  await page.locator('#type').selectOption('General');
  await page.locator('#message').fill('This is an intercepted local browser test only.');
  await page.getByRole('button',{name:'Send inquiry'}).click();
  await page.waitForFunction(()=>!document.querySelector('[type=submit]').disabled);
  assert.match(await page.locator('.form-result').textContent(),/could not send/);
  assert.equal(await page.locator('#name').inputValue(),'Delivery Test');
  assert.equal(submitted.name,'Delivery Test');
  deliveryStatus=200;
  await page.getByRole('button',{name:'Send inquiry'}).click();
  await page.waitForFunction(()=>!document.querySelector('[type=submit]').disabled);
  assert.match(await page.locator('.form-result').textContent(),/inquiry is on its way/);
  assert.equal(await page.locator('#name').inputValue(),'');
  await page.unroute('**/data/site.js');
  console.log('Optional delivery OK: intercepted success, error, retained input, JSON contract');

  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(`${base}/production/`,{waitUntil:'networkidle'});
  assert.equal(await page.locator('.pause-slider').getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('.is-pending').count(),0);
  const initial = await page.locator('[data-current-slide]').textContent();
  await page.waitForTimeout(8000);
  assert.equal(await page.locator('[data-current-slide]').textContent(),initial);
  console.log('Reduced motion OK: no autoplay or hidden content');

  await page.goto('file:///'+path.join(root,'index.html').replaceAll('\\','/'),{waitUntil:'load'});
  assert.equal(await page.locator('h1').textContent(),'Many worlds.One vision.');
  await page.getByRole('link',{name:'Explore our worlds',exact:false}).first().click();
  await page.waitForLoadState('load');
  assert.match(page.url(),/divisions\/index.html/);
  console.log('Direct file opening OK: local fonts, scripts and page links');
  assert.deepEqual(errors,[],'Browser JavaScript errors');
  const unexpectedFailures = failed.filter(value=>!value.includes('forms.example.test'));
  assert.deepEqual(unexpectedFailures,[],'Failed HTTP responses');
  const results={passed:true,checkedAt:new Date().toISOString(),widths:[1440,768,390,320],pages:7,errors,failed:unexpectedFailures};
  fs.writeFileSync(path.join(output,'checks.json'),JSON.stringify(results,null,2));
  await browser.close();
  console.log('All browser checks passed. Screenshots saved in preview/.');
}
main().catch(error=>{console.error(error);process.exit(1);});
