const copy = require('./story-content.cjs');
const photo = (name, alt) => `<figure class="about-chapter-photo"><img src="../assets/images/${name}-800.webp" srcset="../assets/images/${name}-800.webp 800w, ../assets/images/${name}-1600.webp 1600w" sizes="(max-width:600px) 85vw, 40vw" alt="${alt}" width="1600" height="900" loading="lazy" decoding="async"></figure>`;
module.exports = () => `<div class="about-chapters container">
  <section class="about-chapter about-story" aria-labelledby="about-story-title">
    <div class="about-chapter-heading"><span class="about-chapter-number" aria-hidden="true">01</span><h1 id="about-story-title">Our <em>Story.</em></h1>${photo('story-about','A production team preparing a studio set')}</div>
    <div class="about-chapter-copy"><p class="about-story-lead">Different perspectives.<br><em>One shared ambition.</em></p><p>${copy.story}</p></div>
  </section>
  <section class="about-chapter about-mission" aria-labelledby="about-mission-title">
    <div class="about-chapter-heading reveal"><span class="about-chapter-number" aria-hidden="true">02</span><h2 id="about-mission-title">Our <em>Mission.</em></h2>${photo('story-mission','Careful preparation of a candlelit table setting')}</div>
    <div class="about-chapter-copy reveal"><p>${copy.mission}</p></div>
  </section>
  <section class="about-chapter about-vision" aria-labelledby="about-vision-title">
    <div class="about-chapter-heading reveal"><span class="about-chapter-number" aria-hidden="true">03</span><h2 id="about-vision-title">Our <em>Vision.</em></h2>${photo('story-vision','A traveler looking across an airport runway at dusk')}</div>
    <div class="about-chapter-copy reveal"><p>${copy.vision}</p></div>
  </section>
</div>`;
