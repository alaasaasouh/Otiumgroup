const {portfolioSection}=require('./portfolio-component.cjs');
const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
module.exports=function updateProduction(page,image){
  const data={window:{}};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../data/portfolio.js'),'utf8'),data);
  const entries=data.window.OTIUM_PORTFOLIO;
  const sceneData=[
    {image:'production',alt:'Clapperboard at a film location',title:'Stories worth telling.',heading:'Stories<br><em>worth telling.</em>',caption:'Otium Productions',copy:'Documentaries, web series, podcasts and original content.'},
    {image:'events',alt:'An audience gathered under stage lights',title:'Voices worth hearing.',heading:'Voices<br><em>worth hearing.</em>',caption:'Podcasts & original stories',copy:'Conversations, perspectives and ideas that stay with you.'},
    {image:'landscape',alt:'Mountain peaks beneath a wide open sky',title:'A different perspective.',heading:'A different<br><em>perspective.</em>',caption:'Documentary & digital content',copy:'International stories. Local intelligence. Creative ambition.'}
  ];
  const intro=`<section class="production-opening cinema-opening"><h1 class="sr-only">Otium Productions — Stories worth telling.</h1><div class="production-hero production-gallery cinema-gallery" aria-label="Otium Productions introduction" aria-roledescription="carousel"><div class="production-gallery-window"><div class="hero-slides">${sceneData.map((s,i)=>`<div class="hero-slide ${i===0?'active':''}" data-title="${s.title}" data-caption="${s.caption}" aria-hidden="${i!==0}" ${i?'inert':''} role="group" aria-roledescription="slide" aria-label="${i+1} of 3">${image('../',s.image,s.alt,'',i===0,'100vw')}<div class="cinema-copy"><p class="eyebrow">${s.caption}</p><h2>${s.heading}</h2><p class="cinema-description">${s.copy}</p><a class="pill solid" href="#work">Explore the portfolio</a></div></div>`).join('')}</div><div class="gallery-footer"><p class="slide-description"><strong data-slide-title>${sceneData[0].title}</strong><span data-slide-caption>${sceneData[0].caption}</span></p><div class="slider-controls"><span class="slide-count"><b data-current-slide>01</b> <span>/ 03</span></span><div class="slider-progress" aria-hidden="true"></div><button class="pause-slider" aria-label="Pause slideshow" aria-pressed="false">Ⅱ</button><button class="circle-button" data-slide-prev aria-label="Previous slide">←</button><button class="circle-button" data-slide-next aria-label="Next slide">→</button></div></div></div></div></section>`;
  page.body=intro+page.body.slice(page.body.indexOf('<nav class="production-jumps'));
  const work=page.body.indexOf('<section class="work-section');
  page.body=page.body.slice(0,work)+portfolioSection(entries,data.window.OTIUM_PORTFOLIO_CATEGORIES);
  page.extra=page.extra.replace('<script defer src="../data/projects.js"></script>','')+'<script defer src="../data/portfolio.js"></script><script defer src="../js/portfolio.js"></script><link rel="stylesheet" href="../portfolio.css">';
};
