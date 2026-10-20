module.exports = () => `<section class="home-companies" id="introduction" aria-label="Our companies">
  <div class="home-company-grid container">
    ${require('./companies.cjs').map(([title, route, line], index) => [route, title, line, String(index + 1).padStart(2, '0')]).map(([route, title, line, number]) => `<a class="home-company-card home-company-card--${route} reveal" href="${route}/index.html">
      <img class="home-company-image" src="assets/images/${route}-800.webp" srcset="assets/images/${route}-800.webp 800w, assets/images/${route}-1600.webp 1600w" sizes="(max-width: 650px) 90vw, 45vw" alt="" loading="lazy" decoding="async" width="1600" height="1000">
      <span class="home-company-top"><span>${title}</span><span class="home-company-number" aria-hidden="true">${number}</span></span>
      <div class="home-company-copy"><h2>${title}</h2><p>${line}</p></div>
      <span class="home-company-bottom"><span>Explore</span><span class="home-company-arrow" aria-hidden="true">↗</span></span>
    </a>`).join('')}
  </div>
</section>`;
