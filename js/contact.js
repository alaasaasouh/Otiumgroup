(() => {
  'use strict';
  const form = document.querySelector('.inquiry-form');
  if (!form) return;
  const config = window.OTIUM_SITE || {};
  const result = document.querySelector('.form-result');
  const button = form.querySelector('[type=submit]');
  const buttonText = button.querySelector('span');
  const notice = document.querySelector('.form-notice');
  const t=(text,vars)=>window.OtiumI18n?.t(text,vars)||text;
  let downloadUrl;
  let currentBriefData;
  function briefText(){
    const data=currentBriefData;
    return `${t('OTIUM GROUP — PROJECT INQUIRY')}\n\n${t('Name')}: ${data.name}\n${t('Company')}: ${data.company||'—'}\n${t('Email')}: ${data.email}\n${t('Phone')}: ${data.phone||'—'}\n${t('Inquiry')}: ${t(data.type)}\n\n${data.message}\n\n${t('This brief was prepared locally and has not been submitted to Otium Group.')}`;
  }
  function refreshBrief(){
    if(!currentBriefData)return;
    if(downloadUrl)URL.revokeObjectURL(downloadUrl);
    downloadUrl=URL.createObjectURL(new Blob(['\uFEFF'+briefText()],{type:'text/plain;charset=utf-8'}));
    const download=result.querySelector('a[download]');
    if(download){download.href=downloadUrl;download.download=`otium-project-inquiry-${document.documentElement.lang}.txt`;}
    const preview=result.querySelector('pre');if(preview)preview.textContent=briefText();
  }
  function localizeValidation(field){
    if(!field.validity)return;
    field.setCustomValidity('');
    if(field.validity.valid)return;
    const message=field.validity.valueMissing?'Please complete this field.':field.validity.typeMismatch&&field.type==='email'?'Please enter a valid email address.':field.validity.tooShort?'Please enter at least {min} characters.':'Please check this value.';
    field.setCustomValidity(t(message,{min:field.minLength}));
  }
  form.addEventListener('invalid',event=>localizeValidation(event.target),true);
  form.addEventListener('input',event=>event.target.setCustomValidity?.(''));
  form.addEventListener('change',event=>event.target.setCustomValidity?.(''));
  document.addEventListener('otium:languagechange',()=>{
    refreshBrief();
    for(const field of form.elements)if(field.validity?.customError)localizeValidation(field);
  });
  if (config.formEndpoint) {
    buttonText.textContent = 'Send inquiry';
    notice.textContent = 'Your details will only be used to respond to your inquiry.';
  }
  const params = new URLSearchParams(window.location.search);
  const requestedType = params.get('type') === 'Production' ? 'Productions' : params.get('type');
  if (requestedType && [...form.elements.type.options].some(o => o.value === requestedType)) form.elements.type.value = requestedType;

  function status(heading, message, isError = false) {
    result.replaceChildren(); result.hidden = false;
    result.classList.toggle('error', isError);
    const h = document.createElement('h3'); h.textContent = heading;
    const p = document.createElement('p'); p.textContent = message;
    result.append(h, p); result.focus({ preventScroll: true });
  }
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    for (const key of Object.keys(data)) data[key] = data[key].trim();
    if (!data.name || !data.message) {
      status('A little more detail, please.', 'Please include your name and a short message.', true);
      return;
    }
    button.disabled = true;
    buttonText.textContent = config.formEndpoint ? 'Sending…' : 'Preparing…';
    form.setAttribute('aria-busy', 'true');
    try {
      if (config.formEndpoint) {
        const endpoint = new URL(config.formEndpoint, window.location.href);
        if (endpoint.protocol !== 'https:') throw new Error('This inquiry service is not available yet.');
        const isFormSubmit=endpoint.hostname==='formsubmit.co';
        const payload=isFormSubmit?{...data,_subject:'Otium Group — '+data.type+' inquiry',_template:'table',_url:location.href,language:document.documentElement.lang}:data;
        const response = await fetch(endpoint.href, {
          method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload), signal: AbortSignal.timeout(20000)
        });
        if (!response.ok) throw new Error('Your inquiry could not be sent. Please try again.');
        if(isFormSubmit){
          const receipt=await response.json();
          if(/activat|confirm.*email|verify.*email/i.test(receipt.message||'')){
            status('Email delivery is being activated.', 'Please email us directly while we finish setting up the form. Your details are still here.',true);
            return;
          }
          if(receipt.success!==true&&receipt.success!=='true')throw new Error('Inquiry service rejected the submission.');
        }
        status('Your inquiry is on its way.', 'Thank you for sharing your idea. The Otium team will be in touch.');
        form.reset();
      } else {
        currentBriefData=data;
        refreshBrief();
        status('Your brief is ready.', 'Download or copy your inquiry to keep it. Nothing has been sent; direct inquiries will open when the contact details are confirmed.');
        const download = document.createElement('a');
        download.href = downloadUrl; download.download = 'otium-project-inquiry.txt'; download.textContent = 'Download inquiry';
        const copy = document.createElement('button'); copy.type = 'button'; copy.textContent = 'Copy inquiry';
        copy.addEventListener('click', async () => {
          try { await navigator.clipboard.writeText(briefText()); copy.textContent = 'Copied'; }
          catch {
            if (!result.querySelector('pre')) {
              const preview = document.createElement('pre'); preview.className = 'form-preview'; preview.textContent = briefText();
              result.append(preview); copy.textContent = 'Select and copy the text below';
            }
          }
        });
        result.append(download, copy);
        refreshBrief();
      }
    } catch (error) {
      status('Let’s try that again.', error.name === 'TimeoutError' ? 'The request took too long. Your details are still here; please try again.' : 'We could not send your inquiry. Your details are still here; please try again later.', true);
    } finally {
      if(result.classList.contains('error')&&config.email){
        const direct=document.createElement('a');direct.href=`mailto:${config.email}`;direct.textContent=config.email;direct.dir='ltr';result.append(direct);
      }
      button.disabled = false;
      buttonText.textContent = config.formEndpoint ? 'Send inquiry' : 'Prepare inquiry';
      form.removeAttribute('aria-busy');
    }
  });
  window.addEventListener('pagehide', () => { if (downloadUrl) URL.revokeObjectURL(downloadUrl); });
})();
