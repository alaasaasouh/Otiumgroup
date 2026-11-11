const copy = require('./story-content.cjs');
module.exports = () => `<div class="about-chapters container">
  <section class="about-chapter about-story" aria-labelledby="about-story-title">
    <div class="about-chapter-heading"><span class="about-chapter-number" aria-hidden="true">01</span><h1 id="about-story-title">Our <em>Story.</em></h1><div class="about-story-mark" aria-hidden="true"><i></i><i></i><i></i></div></div>
    <div class="about-chapter-copy"><p class="about-story-lead">Different perspectives.<br><em>One shared ambition.</em></p><p>${copy.story}</p></div>
  </section>
  <section class="about-chapter about-mission" aria-labelledby="about-mission-title">
    <div class="about-chapter-heading reveal"><span class="about-chapter-number" aria-hidden="true">02</span><h2 id="about-mission-title">Our <em>Mission.</em></h2></div>
    <div class="about-chapter-copy reveal"><p>${copy.mission}</p></div>
  </section>
  <section class="about-chapter about-vision" aria-labelledby="about-vision-title">
    <div class="about-chapter-heading reveal"><span class="about-chapter-number" aria-hidden="true">03</span><h2 id="about-vision-title">Our <em>Vision.</em></h2></div>
    <div class="about-chapter-copy reveal"><p>${copy.vision}</p></div>
  </section>
</div>`;
