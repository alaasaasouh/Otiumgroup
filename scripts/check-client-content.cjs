/* Document completeness, localization, company links and Our Story interactions. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');
const {chromium} = require('playwright-core');
const root = path.resolve(__dirname,'..');
const source = require('./client-content.json');
const fr = require('./client-content.fr.json');
const ar = require('./client-content.ar.json');
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:4173/';
const routes = ['','about/','divisions/','production/','events/','contact/'];
const range = (first,last) => Array.from({length:last-first+1},(_,i)=>first+i);
const storyIds = range(6,21);
const productionIds = range(26,46);
const eventIds = range(48,69);
const normalized = value => value.replace(/\s+/g,' ').trim();
const scope = {window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'data/translations.js'),'utf8'),scope);
const catalog = scope.window.OTIUM_TRANSLATIONS;
const documentPath = path.join(root,source.source);
if (fs.existsSync(documentPath)) {
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(documentPath)).digest('hex'),source.sha256,'Source Word document changed: re-extract before checking coverage.');
} else {
  console.log('Original Word document is local-only; checking the complete numbered extraction. The source hash is retained for traceability.');
}
assert.equal(source.paragraphs.length,65);
// Check actual generated strings, independently of the runtime translation engine.
for (const route of routes) {
  const html = fs.readFileSync(path.join(root,route,'index.html'),'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/g,'');
  const strings = [...html.matchAll(/>([^<]+)</g)].map(m=>m[1]);
  strings.push(...[...html.matchAll(/(?:alt|aria-label|placeholder|data-title|data-caption)="([^"]+)"/g)].map(m=>m[1]));
  strings.push(...[...html.matchAll(/<meta (?:name="description"|property="og:(?:title|description|site_name)") content="([^"]+)"/g)].map(m=>m[1]));
  for (const raw of strings) {
    const value = normalized(raw.replaceAll('&amp;','&').replaceAll('&quot;','"'));
    if (/[A-Za-z\u0600-\u06ff]/.test(value)) assert(catalog[value]?.every(v=>typeof v==='string' && v.length),route+' missing translation: '+value);
  }
}
console.log('All generated page strings have French and Arabic translations.');
(async () => {
  const browser = await chromium.launch({channel:'chrome',headless:true});
  const errors = [];
  const records = [];
  const en = Object.fromEntries(source.paragraphs.map(p=>[p.id,p.text]));
  try {
    for (const [language,expected] of [['en',en],['fr',fr],['ar',ar]]) {
      const context = await browser.newContext({reducedMotion:'reduce',viewport:{width:1440,height:1000}});
      const page = await context.newPage();
      page.on('pageerror',error=>errors.push(language+': '+error.message));
      async function checkParagraphs(ids,container,label) {
        for (const id of ids) {
          const paragraph = container.locator(`[data-client-paragraph="${id}"]`).first();
          assert.equal(await paragraph.count(),1,`${label}: missing paragraph ${id}`);
          const value = await paragraph.evaluate(el=>{
            const clone=el.cloneNode(true);
            clone.querySelectorAll('br').forEach(br=>br.replaceWith(' '));
            clone.querySelectorAll('h3,p').forEach(block=>block.append(' '));
            return clone.textContent;
          });
          const revisedIntro = require('./home-company-cards.cjs').introText;
          const expectedText = id === 24 && label === 'Homepage'
            ? (language === 'en' ? revisedIntro : catalog[revisedIntro][language === 'fr' ? 0 : 1])
            : expected[id];
          assert.equal(normalized(value),normalized(expectedText),`${label}: changed paragraph ${id}`);
          if (language==='en') records.push({id,placement:label,verified:true});
        }
      }
      for (const route of routes) {
        const response = await page.goto(base+route+'?lang='+language,{waitUntil:'domcontentloaded'});
        assert.equal(response.status(),200);
        if (!route) await page.locator(`[data-language="${language}"]`).click();
        assert.equal(await page.locator('html').getAttribute('lang'),language);
        assert.equal(await page.locator('html').getAttribute('dir'),language==='ar'?'rtl':'ltr');
        assert.equal(await page.locator('h1').count(),1);
        const duplicateIds = await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(el=>el.id);return ids.filter((id,i)=>ids.indexOf(id)!==i)});
        assert.deepEqual(duplicateIds,[],route+' duplicate IDs');
        for (const width of [1440,810,390,320]) {
          await page.setViewportSize({width,height:1000});
          assert(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+1),`${language} ${route} overflow at ${width}`);
          const boxes = await page.locator('.site-header').evaluate(el=>[...el.querySelectorAll('.brand,.language-switch,.menu-toggle,.desktop-nav,.header-contact')].filter(n=>n.getBoundingClientRect().width && getComputedStyle(n).display!=='none').map(n=>{const r=n.getBoundingClientRect();return {left:r.left,right:r.right}}).sort((a,b)=>a.left-b.left));
          for (let i=1;i<boxes.length;i++) assert(boxes[i].left>=boxes[i-1].right-1,`${language} ${route} header overlap at ${width}`);
        }
        await page.setViewportSize({width:1440,height:1000});
        if (!route) {
          if (language==='en') {
            assert.equal(await page.title(),'Otium Nexus Group — Global standards. Local roots.');
            assert.equal(await page.locator('.site-header .brand-logo').getAttribute('alt'),'Otium Nexus Group');
          }
          await checkParagraphs([2,3,24],page,'Homepage');
          for (const [id,open,ids] of [['our-story','[data-story-open]',storyIds]]) {
            const opener = page.locator(open), dialog = page.locator('#'+id);
            await opener.click();
            assert(await dialog.evaluate(el=>el.open));
            await checkParagraphs(ids,dialog,id);
            for (const width of [1440,390,320]) {
              await page.setViewportSize({width,height:900});
              assert(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth+1),`${language} ${id} horizontal overflow at ${width}`);
              await dialog.evaluate(el=>{el.scrollTop=el.scrollHeight});
              assert(await dialog.locator('[data-client-paragraph]').last().isVisible());
            }
            await page.keyboard.press('Escape');
            assert.equal(await dialog.evaluate(el=>el.open),false);
            assert(await opener.evaluate(el=>el===document.activeElement),'Focus must return to dialog opener');
            await page.setViewportSize({width:1440,height:1000});
          }
        } else if (route==='about/') await checkParagraphs(storyIds,page,'About Us page');
        else if (route==='divisions/') await checkParagraphs([24],page,'Companies directory');
        else if (route==='production/') {
          await checkParagraphs(productionIds,page,'Productions page');
          assert.equal(await page.locator('.format-card').count(),5);
          assert((await page.locator('.portfolio-card').count())>0,'Video portfolio missing');
        } else if (route==='events/') {
          await checkParagraphs(eventIds,page,'Events page');
          assert.equal(await page.locator('.format-card').count(),6);
          await page.locator('[data-format-next]').click();
          await page.locator('.format-track').focus();
          await page.keyboard.press('End');
          assert(await page.locator('.format-card').last().evaluate(el=>{const a=el.getBoundingClientRect(),b=el.parentElement.getBoundingClientRect();return a.left>=b.left-2&&a.right<=b.right+2}),'Sixth Events card must be reachable');
        }
      }
      // Our Story close button, backdrop dismissal and mobile layout.
      await page.goto(base+'?lang='+language,{waitUntil:'domcontentloaded'});
      await page.locator(`[data-language="${language}"]`).click();
      await page.locator('[data-story-open]').click();
      await page.locator('#our-story [data-story-close]').click();
      assert.equal(await page.locator('#our-story').evaluate(el=>el.open),false);
      await page.locator('[data-story-open]').click();
      await page.mouse.click(2,2);
      assert.equal(await page.locator('#our-story').evaluate(el=>el.open),false);
      assert.equal(await page.locator('body').evaluate(el=>el.classList.contains('story-open')),false);
      await page.setViewportSize({width:390,height:844});
      await page.locator('[data-story-open]').click();
      await page.locator('#our-story').screenshot({path:path.join(root,`preview/client-story-dialog-${language}.png`)});
      await page.keyboard.press('Escape');
      console.log(language+': exact paragraphs, six responsive pages, Our Story dialog, focus restoration and six Events services passed.');
      await context.close();
    }
    const plain = await browser.newPage({javaScriptEnabled:false});
    await plain.goto(base);
    for (const kind of ['production','events']) assert.equal(await plain.locator(`.home-company-card--${kind}`).getAttribute('href'),`${kind}/index.html`);
    await plain.close();
    assert.deepEqual(errors,[]);
    const special = [
      {id:1,placement:'Homepage group identity and browser title',verified:true,type:'document section label'},
      {id:5,placement:'Our Story button and functioning dialog',verified:true,type:'interaction instruction'},
      {id:23,placement:'Productions and Events cards navigate directly to their full pages',verified:true,type:'interaction instruction'}
    ];
    const coverage = source.paragraphs.map(p=>({id:p.id,text:p.text,placements:records.filter(r=>r.id===p.id).map(r=>r.placement),instruction:special.find(r=>r.id===p.id)||undefined}));
    assert(coverage.every(p=>p.placements.length || p.instruction),'Every document paragraph must have a destination');
    fs.writeFileSync(path.join(root,'docs/client-content-coverage.json'),JSON.stringify({source:source.source,sourceSha256:source.sha256,paragraphCount:65,verifiedParagraphCount:coverage.length,languages:['en','fr','ar'],viewportWidths:[1440,810,390,320],coverage},null,2)+'\n');
    console.log('65/65 document paragraphs accounted for. Coverage saved to docs/client-content-coverage.json.');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
