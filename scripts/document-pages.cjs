/* Apply the supplied document after the legacy layout and portfolio builders. */
const copy = require('./document-content.cjs');
module.exports = page => {
  if (page.active === 'home') {
    page.title = 'Otium Nexus Group — Global standards. Local roots.';
    page.description = copy.text(3);
    page.body = page.body.replace('The art of making<br><em>things happen.</em>','Global standards. <em>Local roots.</em>')
      .replace('class="hero-title"','class="hero-title" data-client-paragraph="2"')
      .replace(/<p class="hero-description">[\s\S]*?<\/p>/,`<p class="hero-description" data-client-paragraph="3">${copy.esc(copy.text(3)).replace('the project takes us.', 'the\u00a0project\u00a0takes\u00a0us.')}</p>`)
      .replace(/<p class="hero-geography">[\s\S]*?<\/p>/,`<p class="hero-geography">${copy.cities}</p>`);
  } else if (page.active === 'about') {
    page.title = 'About Us — Otium Nexus Group';
    page.description = copy.text(7);
    page.body = copy.aboutPage();
  } else if (page.active === 'production') {
    page.title = 'Otium Productions — Otium Nexus Group';
    page.description = copy.text(28);
    const navEnd = page.body.indexOf('</nav>') + 6;
    const workStart = page.body.indexOf('<section class="work-section');
    if (navEnd < 6 || workStart < 0) throw new Error('Production opening or portfolio is missing');
    page.body = page.body.slice(0,navEnd) + copy.companyPage('production') + page.body.slice(workStart);
    page.body = page.body.replace('Documentaries, web series, podcasts and original content.','Films, television series, documentaries, web-series and video podcasts.');
    page.body = page.body.replace('<p class="cinema-fixed-title">','<p class="cinema-fixed-title" data-client-paragraph="26">');
  } else if (page.active === 'events') {
    page.title = 'Otium Events — Every occasion, every size.';
    page.description = copy.text(51);
    const navEnd = page.body.indexOf('</nav>') + 6;
    if (navEnd < 6) throw new Error('Events opening is missing');
    page.body = page.body.slice(0,navEnd) + copy.companyPage('events');
    page.body = page.body.replaceAll('Moments worth remembering.','Every occasion, every size.')
      .replace('Moments worth<br><em>remembering.</em>','Every occasion,<br><em>every size.</em>');
    page.body = page.body.replace('<p class="cinema-fixed-title">','<p class="cinema-fixed-title" data-client-paragraph="48">')
      .replace('<h2>Every occasion,','<h2 data-client-paragraph="49">Every occasion,');
  } else if (page.active === 'divisions') {
    page.title = 'Our Companies — Otium Nexus Group';
    page.body = page.body.replace('Independent disciplines, brought together through creative thinking and hands-on execution.',`<span data-client-paragraph="24">${copy.esc(copy.text(24))}</span>`);
  } else if (page.active === 'contact') {
    page.title = 'Contact — Otium Nexus Group';
    page.description = 'Contact Otium Nexus Group for productions and events. London headquarters, with offices in Amman, Beirut, Cairo, Doha and Riyadh.';
    page.body = page.body.replace('alt="Otium Group — people, ideas, businesses, a brighter tomorrow"','alt="Otium Nexus Group"')
      .replace('<div class="contact-details" data-contact-details></div>',`<p class="contact-office-heading">London headquarters</p><p class="contact-office-cities">${copy.cities}</p><div class="contact-details" data-contact-details></div>`);
  }
};
