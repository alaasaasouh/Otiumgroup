module.exports = () => `<section class="home-companies" id="introduction" aria-label="Our companies">
  <div class="home-company-grid container">
    ${require('./companies.cjs').map(([title, route, line]) => `<a class="home-company-card home-company-card--${route} reveal" href="${route}/index.html">
      <img class="home-company-image" src="assets/images/${route}-800.webp" srcset="assets/images/${route}-800.webp 800w, assets/images/${route}-1600.webp 1600w" sizes="(max-width: 650px) 90vw, 45vw" alt="" loading="lazy" decoding="async" width="1600" height="1000">
      <div class="home-company-copy"><h2>${title}</h2><p>${line}</p></div>
      <span class="home-company-bottom"><span class="home-company-action">${route === 'production' ? 'View productions' : 'View events'}</span><span class="home-company-arrow" aria-hidden="true"><svg viewBox="0 0 40 24" fill="none"><path d="M3 12h32m-9-8 9 8-9 8"/></svg></span></span>
    </a>`).join('')}
  </div>
</section>`;
