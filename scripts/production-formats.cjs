const icons = [
  '<rect x="9" y="27" width="39" height="28" rx="3"/><circle cx="19" cy="16" r="9"/><circle cx="42" cy="13" r="12"/><path d="m48 35 15-8v28l-15-8M18 55l-5 10m27-10 5 10M16 36h24M16 45h15"/>',
  '<rect x="9" y="26" width="54" height="35" rx="3"/><path d="m9 26-2-12L59 4l3 12-53 10M17 12l8 11m7-14 8 11m7-14 8 11M9 36h54M21 46h29M21 53h20"/>',
  '<rect x="26" y="7" width="20" height="37" rx="10"/><path d="M17 30v6a19 19 0 0 0 38 0v-6M36 55v10M23 65h26M32 17h8M32 24h8"/>',
  '<rect x="8" y="12" width="56" height="40" rx="4"/><path d="m30 23 17 9-17 10V23M36 52v11M23 63h26"/><path d="M14 5h15m14 0h15"/>',
  '<circle cx="34" cy="33" r="26"/><circle cx="34" cy="18" r="6"/><circle cx="19" cy="34" r="6"/><circle cx="49" cy="34" r="6"/><circle cx="34" cy="48" r="6"/><path d="M34 59h21q8 0 12 6"/>'
];
module.exports = formats => `<section class="format-section container" id="capabilities" aria-labelledby="formats-title">
  <div class="format-heading"><div><p class="eyebrow">What we produce</p><h2 id="formats-title">Every story.<br><em>Its own format.</em></h2></div>
  <div class="format-navigation" role="group" aria-label="Production formats"><button type="button" data-format-prev aria-label="Previous formats" aria-controls="format-track">←</button><button type="button" data-format-next aria-label="Next formats" aria-controls="format-track">→</button></div></div>
  <div class="format-track" id="format-track" tabindex="0" aria-label="Production formats">
  ${formats.map(([title,copy],i)=>`<article class="format-card" tabindex="0"><div class="format-card-top"><svg viewBox="0 0 72 72" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[i]}</svg><span aria-hidden="true">0${i+1}</span></div><h3>${title}</h3><p>${copy}</p><div class="format-card-bottom" aria-hidden="true"><span></span><span>OTIUM / 0${i+1}</span></div></article>`).join('')}
  </div>
</section>`;
