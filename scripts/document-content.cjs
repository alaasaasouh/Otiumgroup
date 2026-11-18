/* Exact client copy, extracted from the supplied Word document. */
const source = require('./client-content.json');
const paragraphs = new Map(source.paragraphs.map(p => [p.id, p.text]));
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const text = id => {
  if (!paragraphs.has(id)) throw new Error(`Missing client paragraph ${id}`);
  return paragraphs.get(id);
};
const p = id => `<p data-client-paragraph="${id}">${esc(text(id))}</p>`;
const ps = ids => ids.map(p).join('');
const heading = (id, level = 2, attrs = '') => `<h${level} data-client-paragraph="${id}" ${attrs}>${esc(text(id))}</h${level}>`;
const cities = 'London · Amman · Beirut · Cairo · Doha · Riyadh';
const storySections = [
  { heading: 6, ids: [7,8,9,10], photo: 'story-about', alt: 'A production team preparing a studio set', className: 'story' },
  { heading: 11, ids: [12,13,14,15], className: 'name' },
  { heading: 16, ids: [17,18], photo: 'story-mission', alt: 'Careful preparation of a candlelit table setting', className: 'mission' },
  { heading: 19, ids: [20,21], photo: 'story-vision', alt: 'A traveler looking across an airport runway at dusk', className: 'vision' }
];
const companies = {
  production: { name: 26, about: 27, intro: [28,29,30], mission: 31, missionCopy: [32,33], vision: 34, visionCopy: [35], services: 36, serviceCopy: [37,38,39,40,41], additional: [42], approach: 43, approachCopy: [44], location: 45, locationCopy: [46] },
  events: { name: 48, tagline: 49, about: 50, intro: [51,52,53], mission: 54, missionCopy: [55,56], vision: 57, visionCopy: [58], services: 59, serviceCopy: [60,61,62,63,64,65], additional: [], approach: 66, approachCopy: [67], location: 68, locationCopy: [69] }
};
function photo(section, base = '') {
  if (!section.photo) return '';
  return `<img class="story-photo" src="${base}assets/images/${section.photo}-800.webp" srcset="${base}assets/images/${section.photo}-800.webp 800w, ${base}assets/images/${section.photo}-1600.webp 1600w" sizes="(max-width:600px) 80vw, 620px" alt="${section.alt}" width="1600" height="900" loading="lazy" decoding="async">`;
}
function storyDialog() {
  return `<dialog class="story-dialog" id="our-story" aria-labelledby="story-title"><div class="story-shell"><button class="story-close" type="button" data-story-close aria-label="Close our story" autofocus><span aria-hidden="true">×</span></button><p class="eyebrow no-dot">Otium Nexus Group</p><h2 id="story-title">Our Story</h2><div class="story-sections">${storySections.map((s,i) => `<section><span class="story-number" aria-hidden="true">0${i+1}</span><div>${heading(s.heading,3)}${ps(s.ids)}${photo(s)}</div></section>`).join('')}</div></div></dialog>`;
}
function aboutPage() {
  return `<div class="about-chapters container"><h1 class="document-about-title">Our Story</h1>${storySections.map((s,i) => `<section class="about-chapter about-${s.className}" aria-labelledby="about-${s.className}-title"><div class="about-chapter-heading"><span class="about-chapter-number" aria-hidden="true">0${i+1}</span>${heading(s.heading,2,`id="about-${s.className}-title"`)}${s.photo ? `<figure class="about-chapter-photo">${photo(s,'../')}</figure>` : ''}</div><div class="about-chapter-copy">${ps(s.ids)}</div></section>`).join('')}</div>`;
}
function companyPage(kind) {
  const c = companies[kind];
  const formats = c.serviceCopy.map(id => {
    const value = text(id), split = value.indexOf('. ') + 1;
    return [value.slice(0,split), value.slice(split+1)];
  });
  const intro = `<section class="brand-section container brand-split" id="company-about"><div><p class="eyebrow">${esc(text(c.name))}</p>${heading(c.about,2,'class="heading"')}</div><div class="brand-copy">${ps(c.intro)}<div class="production-purpose">${heading(c.mission,3)}${ps(c.missionCopy)}${heading(c.vision,3)}${ps(c.visionCopy)}</div></div></section>`;
  const services = require('./production-formats.cjs')(formats, { heading: text(c.services), eyebrow: text(c.name), paragraphIds: c.serviceCopy, headingId: c.services, additional: ps(c.additional), events: kind === 'events' });
  const split = (id, ids, anchor) => `<section class="brand-section container brand-split" id="${anchor}"><div>${heading(id,2,'class="heading"')}</div><div class="brand-copy">${ps(ids)}</div></section>`;
  return intro + services + split(c.approach,c.approachCopy,kind === 'events' ? 'event-approach' : 'production-approach') + split(c.location,c.locationCopy,'local-knowledge');
}
module.exports = { source, text, esc, p, ps, heading, cities, storySections, companies, storyDialog, aboutPage, companyPage };
