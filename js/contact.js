(() => {
  'use strict';
  const form = document.querySelector('.inquiry-form');
  if (!form) return;
  const config = window.OTIUM_SITE || {};
  const result = document.querySelector('.form-result');
  const button = form.querySelector('[type=submit]');
  const buttonText = button.querySelector('span');
  const notice = document.querySelector('.form-notice');
  let downloadUrl;
  if (config.formEndpoint) {
    buttonText.textContent = 'Send inquiry';
    notice.textContent = 'Your details will only be used to respond to your inquiry.';
  }
  const params = new URLSearchParams(window.location.search);
  const requestedType = params.get('type');
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
        const response = await fetch(endpoint.href, {
          method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data), signal: AbortSignal.timeout(20000)
        });
        if (!response.ok) throw new Error('Your inquiry could not be sent. Please try again.');
        status('Your inquiry is on its way.', 'Thank you for sharing your idea. The Otium team will be in touch.');
        form.reset();
      } else {
        const brief = `OTIUM GROUP — PROJECT INQUIRY\n\nName: ${data.name}\nCompany: ${data.company || '—'}\nEmail: ${data.email}\nPhone: ${data.phone || '—'}\nInquiry: ${data.type}\n\n${data.message}\n\nThis brief was prepared locally and has not been submitted to Otium Group.`;
        if (downloadUrl) URL.revokeObjectURL(downloadUrl);
        downloadUrl = URL.createObjectURL(new Blob([brief], { type: 'text/plain;charset=utf-8' }));
        status('Your brief is ready.', 'Download or copy your inquiry to keep it. Nothing has been sent; direct inquiries will open when the contact details are confirmed.');
        const download = document.createElement('a');
        download.href = downloadUrl; download.download = 'otium-project-inquiry.txt'; download.textContent = 'Download inquiry';
        const copy = document.createElement('button'); copy.type = 'button'; copy.textContent = 'Copy inquiry';
        copy.addEventListener('click', async () => {
          try { await navigator.clipboard.writeText(brief); copy.textContent = 'Copied'; }
          catch {
            if (!result.querySelector('pre')) {
              const preview = document.createElement('pre'); preview.className = 'form-preview'; preview.textContent = brief;
              result.append(preview); copy.textContent = 'Select and copy the text below';
            }
          }
        });
        result.append(download, copy);
      }
    } catch (error) {
      status('Let’s try that again.', error.name === 'TimeoutError' ? 'The request took too long. Your details are still here; please try again.' : 'We could not send your inquiry. Your details are still here; please try again later.', true);
    } finally {
      button.disabled = false;
      buttonText.textContent = config.formEndpoint ? 'Send inquiry' : 'Prepare inquiry';
      form.removeAttribute('aria-busy');
    }
  });
  window.addEventListener('pagehide', () => { if (downloadUrl) URL.revokeObjectURL(downloadUrl); });
})();
