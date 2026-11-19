/* Events uses the production presentation with its own editorial content. */
module.exports = function eventsPage(image) {
  const scenes = [
    ['event-concert','An audience watching an outdoor concert beneath stage lights','Experiences. Every scale.','<span class="cinema-heading-lead">Experiences</span><br><em>Every scale</em>','Live entertainment','Great things are done by a series of small things brought together.','Vincent Van Gogh'],
    ['event-corporate','Guests attending a corporate launch with a large presentation screen','Ideas brought to life.','<span class="events-ideas-word cinema-heading-lead">Ideas</span><br><em>Brought to life</em>','Corporate & brand experiences','The power of imagination makes us infinite.','John Muir'],
    ['event-wedding','A couple walking down the aisle at a garden wedding','Memories. Entirely yours.','<span class="cinema-heading-lead">Memories</span><br><em>Entirely yours</em>','Weddings & private celebrations','We do not remember days, we remember moments.','Cesare Pavese']
  ];
  const arrow = d => `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
  const slides = scenes.map(([asset,alt,title,heading,caption,copy,author],i) => `<div class="hero-slide ${i===0?'active':''}" data-title="${title}" data-caption="${caption}" aria-hidden="${i!==0}" ${i?'inert':''} role="group" aria-roledescription="slide" aria-label="${i+1} of 3">${image('../',asset,alt,'',i===0,'100vw')}<div class="cinema-copy"><h2${i===0?' data-client-paragraph="49"':''}>${heading}</h2>${author?`<figure class="cinema-quote"><blockquote><p>${copy}</p></blockquote><figcaption><cite>${author}</cite></figcaption></figure>`:`<p class="cinema-description">${copy}</p>`}</div></div>`).join('');
  const opening = `<section class="production-opening cinema-opening events-cinema"><h1 class="sr-only">Otium Events — Moments worth remembering.</h1><div class="production-hero production-gallery cinema-gallery cinema-gallery--events" aria-label="Otium Events introduction" aria-roledescription="carousel"><div class="production-gallery-window"><p class="cinema-fixed-title">Otium Events</p><div class="hero-slides">${slides}</div><div class="gallery-footer"><div class="slider-controls"><span class="slide-count"><b data-current-slide>01</b> <span>/ 03</span></span><div class="slider-progress" aria-hidden="true"></div><button class="pause-slider" aria-label="Pause slideshow" aria-pressed="false">Ⅱ</button><button class="circle-button" data-slide-prev aria-label="Previous slide">${arrow('M19 12H5m7-7-7 7 7 7')}</button><button class="circle-button" data-slide-next aria-label="Next slide">${arrow('M5 12h14m-7-7 7 7-7 7')}</button></div></div></div></div></section>`;
  const intro = `<nav class="production-jumps container" aria-label="Events page sections"><span>Explore Events</span><a href="#capabilities">Our events</a><a href="#event-approach">Our approach</a><a href="../contact/index.html?type=Events">Contact</a></nav><section class="brand-section container brand-split"><div class="reveal"><p class="eyebrow">Otium Events</p><h2 class="heading">Experiences that<br><em>stay with you.</em></h2></div><div class="brand-copy reveal"><p>We create, produce and deliver live experiences across entertainment, corporate events and private celebrations. Each begins with the people at its heart and the feeling you want them to take away.</p><p>From the first conversation to the final guest departure, we bring together creative direction, meticulous planning and hands-on delivery.</p><div class="production-purpose"><h3>Our vision</h3><p>To create moments that bring people closer, spark connection and become lasting memories.</p><h3>Our mission</h3><p>To turn ambitious ideas into thoughtfully designed events, bringing the right people, creative thinking and operational care to every detail.</p></div></div></section>`;
  const formats = [
    ['Live Entertainment','Concerts, festivals and cultural gatherings. Creative programming, stage production and audience experiences built around the energy of a live moment.'],
    ['Corporate Events','Conferences, awards, galas and executive gatherings. Considered experiences that connect your people and reflect your organisation.'],
    ['Brand Experiences','Product launches, activations and experiential campaigns. Bring your brand into the real world and give audiences a reason to engage.'],
    ['Weddings','A celebration shaped around your story. Creative direction, venue coordination, styling, entertainment and thoughtful on-the-day delivery.'],
    ['Private Celebrations','Milestone occasions, intimate dinners and special gatherings. Personal details, warm hospitality and seamless coordination.']
  ];
  const icons = [
    '<path d="M12 58h48M18 58V28h36v30M12 28h48L36 10 12 28M27 38v11m18-11v11"/>',
    '<rect x="10" y="22" width="52" height="38" rx="3"/><path d="M25 22v-9h22v9M10 37h52M30 37v8h12v-8"/>',
    '<path d="m10 27 39-13v44L10 45V27M49 27h11v18H49M18 48l6 15h10l-6-12M58 10l5-6M62 58l5 6"/>',
    '<circle cx="26" cy="39" r="17"/><circle cx="47" cy="39" r="17"/><path d="m26 18-7-9h14l-7 9M47 18l-7-9h14l-7 9"/>',
    '<path d="M15 31h42v31H15zM10 22h52v9H10zM36 22v40M36 22C12 22 16 2 28 10l8 12Zm0 0C60 22 56 2 44 10l-8 12Z"/>'
  ];
  let services = require('./production-formats.cjs')(formats)
    .replace('What we produce','What we create').replace('Every story.<br><em>Its own format.</em>','Every occasion.<br><em>Its own character.</em>').replaceAll('Production formats','Event services').replaceAll('Previous formats','Previous services').replaceAll('Next formats','Next services');
  let iconIndex = 0;
  services = services.replace(/(<div class="format-card-top"><svg[^>]*>)[\s\S]*?(<\/svg>)/g, (_,open,close)=>open+icons[iconIndex++]+close);
  const process = `<section class="brand-section container" id="event-approach"><p class="eyebrow">Our approach</p><h2 class="heading reveal">From first idea<br>to <em>final applause.</em></h2><ol class="brand-process">${['Discover','Concept','Planning','Production','Live delivery','Follow-through'].map(s=>`<li class="reveal">${s}</li>`).join('')}</ol></section>`;
  const capabilities = `<section class="work-section section-pad event-delivery"><div class="container"><div class="work-top"><div><p class="eyebrow">Otium Events / Capabilities</p><h2 class="heading">Every detail.<br><em>Considered.</em></h2></div><p class="body-copy">One team, from the first brief to the final moment.</p></div><div class="event-delivery-grid">${[
    ['Creative & planning','Concept development, creative direction, venue sourcing, scheduling and supplier coordination.'],
    ['Technical production','Stage design, sound, lighting, visual systems and technical teams, coordinated around the experience.'],
    ['People & hospitality','Talent coordination, guest journeys, hospitality and VIP management, with care at every touchpoint.'],
    ['On-site delivery','Production management, team coordination and live operations, followed by a considered post-event review.']
  ].map(([title,copy])=>`<article><h3>${title}</h3><p>${copy}</p></article>`).join('')}</div></div></section>`;
  return opening+intro+services+process+capabilities;
};
