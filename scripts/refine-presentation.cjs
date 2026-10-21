/* Final presentation refinements, shared by every generated page. */
module.exports = (html, page) => {
  const icon = path => `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${path}"/></svg>`;
  html=html.replace(/<p class="eyebrow">People\. Ideas\. Businesses\.<\/p>/g,'')
    .replace(/>Let\u2019s talk\s*</g,'>Contact<').replace(/>Get in touch\s*</g,'>Contact<')
    .replace('placeholder="The idea, the ambition, the possibilities\u2026"','placeholder="Tell us about your project."');
  if(page.active==='home') html=html.replace(/<a class="scroll-cue"[\s\S]*?<\/a>/,'').replace(/<a href="#top">[\s\S]*?<\/a>/,'');
  if(page.active==='contact') html=html.replace(/<div class="footer-cta">[\s\S]*?(?=<div class="footer-middle">)/,'');
  html=html.replace(/>\u2190<\/button>/g,'>'+icon('M19 12H5m7-7-7 7 7 7')+'</button>')
    .replace(/>\u2192<\/button>/g,'>'+icon('M5 12h14m-7-7 7 7-7 7')+'</button>')
    .replace(/<span class="arrow" aria-hidden="true">\u2191<\/span>/g,icon('M12 19V5m-7 7 7-7 7 7'))
    .replace(/<span aria-hidden="true">\u00d7<\/span>/g,icon('m6 6 12 12M6 18 18 6'))
    .replace(/<span aria-hidden="true">\+<\/span>/g,icon('M5 12h14M12 5v14'));
  return html;
};
