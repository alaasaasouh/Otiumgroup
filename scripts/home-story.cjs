const copy = require('./story-content.cjs');
/* Shared homepage story presentation. */
module.exports = html => {
  html = html.replace('<p class="eyebrow">Otium Group</p>', '<p class="eyebrow no-dot">Otium Group</p>')
    .replace(/<div class="hero-actions">[\s\S]*?<\/div>/, '<div class="hero-actions"><button class="pill solid" type="button" data-story-open aria-haspopup="dialog" aria-controls="our-story">Our Story</button></div>');
  if (html.includes('id="our-story"')) return html;
  return html.replace('</main>', `</main><dialog class="story-dialog" id="our-story" aria-labelledby="story-title"><div class="story-shell"><button class="story-close" type="button" data-story-close aria-label="Close our story" autofocus><span aria-hidden="true">&times;</span></button><p class="eyebrow no-dot">Otium Group</p><h2 id="story-title">Our <em>Story.</em></h2><p class="story-intro">Different perspectives. One shared ambition.</p><div class="story-sections"><section><span class="story-number" aria-hidden="true">01</span><div><h3>About Us</h3><p>${copy.story}</p></div></section><section><span class="story-number" aria-hidden="true">02</span><div><h3>Our Vision</h3><p>${copy.vision}</p></div></section><section><span class="story-number" aria-hidden="true">03</span><div><h3>Our Mission</h3><p>${copy.mission}</p></div></section></div></div></dialog>`);
};
