const icons = [
  '<rect x="9" y="27" width="39" height="28" rx="3"/><circle cx="19" cy="16" r="9"/><circle cx="42" cy="13" r="12"/><path d="m48 35 15-8v28l-15-8M18 55l-5 10m27-10 5 10M16 36h24M16 45h15"/>',
  '<rect x="9" y="26" width="54" height="35" rx="3"/><path d="m9 26-2-12L59 4l3 12-53 10M17 12l8 11m7-14 8 11m7-14 8 11M9 36h54M21 46h29M21 53h20"/>',
  '<rect x="26" y="7" width="20" height="37" rx="10"/><path d="M17 30v6a19 19 0 0 0 38 0v-6M36 55v10M23 65h26M32 17h8M32 24h8"/>',
  '<rect x="8" y="12" width="56" height="40" rx="4"/><path d="m30 23 17 9-17 10V23M36 52v11M23 63h26"/><path d="M14 5h15m14 0h15"/>',
  '<circle cx="34" cy="33" r="26"/><circle cx="34" cy="18" r="6"/><circle cx="19" cy="34" r="6"/><circle cx="49" cy="34" r="6"/><circle cx="34" cy="48" r="6"/><path d="M34 59h21q8 0 12 6"/>'
];
const eventIcons = [
  '<path d="M10 58h52M18 58V22h36v36M12 22h48L36 8 12 22M27 34v14m18-14v14"/>',
  '<path d="M27 48V16l27-6v32M27 24l27-6"/><ellipse cx="19" cy="50" rx="8" ry="6"/><ellipse cx="46" cy="44" rx="8" ry="6"/>',
  '<rect x="10" y="22" width="52" height="38" rx="3"/><path d="M25 22v-9h22v9M10 37h52"/>',
  '<path d="M16 10v20m8-20v20m-16-20v14q0 12 16 6M16 30v34M49 64V10q-14 13-12 32h12"/>',
  '<rect x="8" y="14" width="56" height="42" rx="2"/><path d="m16 46 13-14 10 9 9-11 8 16M24 14V7m24 7V7M24 56l-6 10m30-10 6 10"/>',
  '<circle cx="26" cy="39" r="17"/><circle cx="47" cy="39" r="17"/><path d="m26 18-7-9h14l-7 9M47 18l-7-9h14l-7 9"/>'
];
module.exports = (formats, options = {}) => `<section class="format-section container" id="capabilities" aria-labelledby="formats-title">
  <div class="format-heading"><div><p class="eyebrow">${options.eyebrow || 'What we produce'}</p><h2 id="formats-title" ${options.headingId ? `data-client-paragraph="${options.headingId}"` : ''}>${options.heading || 'Every story.<br><em>Its own format.</em>'}</h2></div></div><div class="format-carousel"><div class="format-navigation" role="group" aria-label="${options.events ? 'Event services' : 'Production formats'}"><button type="button" data-format-prev aria-label="Previous formats" aria-controls="format-track">←</button><button type="button" data-format-next aria-label="Next formats" aria-controls="format-track">→</button></div>
<div class="format-track" id="format-track" tabindex="0" aria-label="${options.events ? 'Event services' : 'Production formats'}">
  ${formats.map(([title,copy],i)=>`<article class="format-card" tabindex="0" ${options.paragraphIds ? `data-client-paragraph="${options.paragraphIds[i]}"` : ''}><div class="format-card-top"><svg viewBox="0 0 72 72" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${(options.events ? eventIcons : icons)[i] || icons[0]}</svg></div><h3>${title}</h3><p>${copy}</p></article>`).join('')}
  </div>
</div>${options.additional ? `<div class="brand-copy document-format-additional">${options.additional}</div>` : ''}</section>`;
