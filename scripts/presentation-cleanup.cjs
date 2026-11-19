/* Final shared navigation and wording cleanup. */
function wording(text) {
  // Client copy must pass through verbatim, including international positioning.
  return text;
}
module.exports = (html, base = '') => {
  html = html.replace(/<div class="footer-credit">[\s\S]*?<\/div>/g, '')
    .replace(/<p class="eyebrow(?: no-dot)?">International by nature\.?<\/p>/g, '')
    .replace(/<br>International by nature\./g, '')
    .replace(/<nav class="footer-nav" aria-label="(?:Our companies|Our divisions)">[\s\S]*?<\/nav>/g, '')
    .replace(/<nav class="footer-nav" aria-label="Footer navigation">[\s\S]*?<\/nav>/g, '<nav class="footer-nav" aria-label="Footer navigation"><h3>Explore</h3>' + [['Home','index.html'],['Productions','production/index.html'],['Events','events/index.html'],['About Us','about/index.html'],['Contact','contact/index.html']].map(([label,href]) => '<a href="' + base + href + '">' + label + '</a>').join('') + '</nav>');
  html = html.replace(/(<div class="container hero-content">)<p class="eyebrow(?: no-dot)?">Otium Group<\/p>/, '$1');
  html = html.replace(/(<a\b[^>]*href="[^"]*production\/index\.html"[^>]*>)(?:Production|Productions)(<\/a>)/g, '$1Otium Productions$2')
    .replace(/(<a\b[^>]*href="[^"]*events\/index\.html"[^>]*>)Events(<\/a>)/g, '$1Otium Events$2')
    .replace(/(<a\b[^>]*href="[^"]*contact\/index\.html"[^>]*>)Contact(<\/a>)/g, '$1Contact Us$2');
  return wording(html);
};
module.exports.wording = wording;
