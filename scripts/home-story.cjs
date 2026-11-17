const copy = require('./document-content.cjs');
/* Shared homepage story presentation. */
module.exports = html => {
  html = html.replace('<p class="eyebrow">Otium Group</p>', '<p class="eyebrow no-dot">Otium Group</p>')
    .replace(/<div class="hero-actions">[\s\S]*?<\/div>/, '<div class="hero-actions"><button class="pill solid" type="button" data-story-open aria-haspopup="dialog" aria-controls="our-story">Our Story</button></div>');
  if (html.includes('id="our-story"')) return html;
  return html.replace('</main>', '</main>' + copy.storyDialog());
};
