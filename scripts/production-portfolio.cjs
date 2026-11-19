const {portfolioSection}=require('./portfolio-component.cjs');
const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
module.exports=function updateProduction(page,image){
  const data={window:{}};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../data/portfolio.js'),'utf8'),data);
  const entries=data.window.OTIUM_PORTFOLIO;
  const sceneData=[
    {image:'production',alt:'A film crew working on a historic Beirut street',title:'Stories worth telling.',heading:'Stories<br><em>worth telling.</em>',caption:'Otium Productions',quote:'Every great film should seem new every time you see it.',author:'Roger Ebert'},
    {image:'production-podcast',alt:'Microphones arranged around a warm podcast studio table',title:'Voices worth hearing.',heading:'Voices<br><em>worth hearing.</em>',caption:'Podcasts & original stories',quote:'A story should have a beginning, a middle, and an end, but not necessarily in that order.',author:'Jean-Luc Godard'},
    {image:'production-documentary',alt:'A documentary crew filming on location in Doha',title:'Perspective. Beyond ordinary.',heading:'<span class="cinema-heading-lead">Perspective</span><br><em class="cinema-heading-finish">Beyond ordinary</em>',caption:'Documentary & digital content',quote:"Never be limited by other people's limited imaginations.",author:'Dr. Mae Jemison'}
  ];
  const intro=`<section class="production-opening cinema-opening"><h1 class="sr-only">Otium Productions — Stories worth telling.</h1><div class="production-hero production-gallery cinema-gallery cinema-gallery--production" aria-label="Otium Productions introduction" aria-roledescription="carousel"><div class="production-gallery-window"><p class="cinema-fixed-title">Otium Productions</p><div class="hero-slides">${sceneData.map((s,i)=>`<div class="hero-slide ${i===0?'active':''}" data-title="${s.title}" data-caption="${s.caption}" aria-hidden="${i!==0}" ${i?'inert':''} role="group" aria-roledescription="slide" aria-label="${i+1} of 3">${image('../',s.image,s.alt,'',i===0,'100vw')}<div class="cinema-copy"><h2>${s.heading}</h2><figure class="cinema-quote"><blockquote><p>${s.quote}</p></blockquote><figcaption><cite>${s.author}</cite></figcaption></figure></div></div>`).join('')}</div><div class="gallery-footer"><div class="slider-controls"><span class="slide-count"><b data-current-slide>01</b> <span>/ 03</span></span><div class="slider-progress" aria-hidden="true"></div><button class="pause-slider" aria-label="Pause slideshow" aria-pressed="false">Ⅱ</button><button class="circle-button" data-slide-prev aria-label="Previous slide">←</button><button class="circle-button" data-slide-next aria-label="Next slide">→</button></div></div></div></div></section>`;
  page.body=intro+page.body.slice(page.body.indexOf('<nav class="production-jumps'));
  const work=page.body.indexOf('<section class="work-section');
  page.body=page.body.slice(0,work)+portfolioSection(entries,data.window.OTIUM_PORTFOLIO_CATEGORIES);
  page.extra+='<script defer src="../js/production-formats.js"></script><script defer src="../data/portfolio.js"></script><script defer src="../js/portfolio.js"></script><link rel="stylesheet" href="../portfolio.css">';
};
