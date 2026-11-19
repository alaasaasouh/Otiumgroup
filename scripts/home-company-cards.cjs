const introText = 'In Latin, otium means time well spent. That’s what we share with you.';
module.exports = () => `<section class="home-companies" id="introduction" aria-label="Our companies">
  <div class="container home-company-intro"><p data-client-paragraph="24">${introText.replace('That’s what we share with you.', 'That’s\u00a0what\u00a0we\u00a0share\u00a0with\u00a0you.')}</p></div>
  <div class="home-company-grid container">
    ${require('./companies.cjs').map(([title, route, line]) => `<a class="home-company-card home-company-card--${route} reveal" href="${route}/index.html">
      <img class="home-company-image" src="assets/images/${route}-800.webp" srcset="assets/images/${route}-800.webp 800w, assets/images/${route}-1600.webp 1600w" sizes="(max-width: 650px) 90vw, 45vw" alt="" loading="lazy" decoding="async" width="1600" height="900">
      <div class="home-company-copy"><h2>Otium ${title}</h2><p>${line}</p></div>
      <span class="home-company-bottom"><span class="home-company-action">Dive in</span><span class="home-company-arrow" aria-hidden="true"><svg viewBox="0 0 40 24" fill="none"><path d="M3 12h32m-9-8 9 8-9 8"/></svg></span></span>
    </a>`).join('')}
  </div>
</section>`;
module.exports.introText = introText;
