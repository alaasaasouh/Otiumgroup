const assert=require('node:assert/strict');
const {chromium}=require('playwright-core');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  for(const lang of ['en','fr','ar']){
   const page=await browser.newPage({reducedMotion:'reduce'});
   let mode='success',payload,requests=0;
   // Intercept every delivery request: these checks never send email.
   await page.route('https://formsubmit.co/**',async route=>{
    requests++;payload=route.request().postDataJSON();
    if(mode==='network')return route.abort();
    const body=mode==='activation'?{success:'false',message:'Please activate your form by confirming your email.'}:mode==='rejected'?{success:'false',message:'Unable to submit form.'}:{success:'true',message:'Form submitted successfully'};
    await route.fulfill({status:mode==='server'?500:200,contentType:'application/json',body:JSON.stringify(body)});
   });
   await page.goto('http://127.0.0.1:4173/contact/?lang='+lang);
   assert.equal(await page.locator('[data-contact-details] a').first().getAttribute('href'),'mailto:asonyxmedia@gmail.com');
   await page.locator('[type=submit]').click();assert.equal(requests,0);
   for(mode of ['activation','rejected','server','network','success']){
    await page.locator('#name').fill('Contact Verification');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#type').selectOption('Events');
    await page.locator('#message').fill('A test intercepted locally. No email is sent.');
    const before=requests;
    await page.locator('[type=submit]').click();
    await page.waitForFunction(()=>!document.querySelector('[type=submit]').disabled);
    assert.equal(requests,before+1);
    assert.equal(payload.email,'test@example.com');assert.equal(payload.language,lang);
    assert.equal(payload._subject,'Otium Group — Events inquiry');
    assert.equal(await page.locator('.form-result').evaluate(el=>el.classList.contains('error')),mode!=='success');
    const heading=mode==='success'?'Your inquiry is on its way.':mode==='activation'?'Email delivery is being activated.':'Let’s try that again.';
    assert.equal(await page.locator('.form-result h3').textContent(),await page.evaluate(s=>OtiumI18n.t(s),heading));
    if(mode==='success')assert.equal(await page.locator('#name').inputValue(),'');
    else{assert.equal(await page.locator('#name').inputValue(),'Contact Verification');assert.equal(await page.locator('.form-result a').getAttribute('href'),'mailto:asonyxmedia@gmail.com');}
   }
   await page.close();console.log(lang+': validation, delivery payload, activation, rejection, network/server errors and success passed (no emails sent).');
  }
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1)});
