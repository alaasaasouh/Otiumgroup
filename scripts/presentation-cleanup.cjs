/* Final shared navigation and wording cleanup. */
function wording(text) {
  return text.replace(/International by nature\.?/g, '')
    .replace(/ \u00b7 Worldwide/g, '').replace(/ and worldwide/g, '')
    .replace(/\bAn international /g, 'A ').replace(/\ban international /g, 'a ')
    .replace(/\binternational outlook/g, 'creative outlook')
    .replace(/\binternational perspective/g, 'creative perspective')
    .replace(/\bInternational perspective/g, 'Creative perspective')
    .replace(/\bInternational stories/g, 'Original stories')
    .replace(/\bInternational expertise/g, 'Shared expertise')
    .replace(/\binternational /g, '').replace(/\bInternational\./g, 'Creative.');
}
module.exports = (html, base = '') => {
  html = html.replace(/<div class="footer-credit">[\s\S]*?<\/div>/g, '')
    .replace(/<p class="eyebrow(?: no-dot)?">International by nature\.?<\/p>/g, '')
    .replace(/<br>International by nature\./g, '')
    .replace(/<nav class="footer-nav" aria-label="(?:Our companies|Our divisions)">[\s\S]*?<\/nav>/g, '')
    .replace(/<nav class="footer-nav" aria-label="Footer navigation">[\s\S]*?<\/nav>/g, '<nav class="footer-nav" aria-label="Footer navigation"><h3>Explore</h3>' + [['Home','index.html'],['Productions','production/index.html'],['Events','events/index.html'],['About Us','about/index.html'],['Contact','contact/index.html']].map(([label,href]) => '<a href="' + base + href + '">' + label + '</a>').join('') + '</nav>');
  html = html.replace(/(<div class="container hero-content">)<p class="eyebrow(?: no-dot)?">Otium Group<\/p>/, '$1');
  return wording(html);
};
module.exports.wording = wording;
