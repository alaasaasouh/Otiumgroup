/* One lazy player per modal. No iframe, SDK or video request before a click. */
(() => {
  'use strict';
  const dialog=document.querySelector('.portfolio-modal');
  if(!dialog)return;
  const entries=window.OTIUM_PORTFOLIO || [];
  const stage=dialog.querySelector('.portfolio-stage');
  const mount=dialog.querySelector('.portfolio-mount');
  const loading=dialog.querySelector('.portfolio-loading');
  const external=dialog.querySelector('[data-video-external]');
  let trigger, dispose, timeout, scrollPosition=0, previousStyles, generation=0;
  const providers=new Map();
  providers.set('youtube', (project, ready) => {
    if(!/^[\w-]{11}$/.test(project.videoId))throw Error('Invalid video ID');
    const iframe=document.createElement('iframe');
    iframe.title=project.title;
    iframe.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframe.allowFullscreen=true;
    iframe.referrerPolicy='strict-origin-when-cross-origin';
    iframe.addEventListener('load',ready,{once:true});
    iframe.src=`https://www.youtube-nocookie.com/embed/${project.videoId}?autoplay=1&playsinline=1&rel=0`;
    mount.append(iframe);
    return ()=>{iframe.src='about:blank';iframe.remove();};
  });
  // Future provider contract: mount(project, ready) => dispose().
  // A Mux adapter can lazy-import its player here only when explicitly selected.
  window.OtiumPortfolio={registerProvider(name,factory){if(typeof factory!=='function')throw TypeError('Provider must be a function');providers.set(name,(project,ready)=>factory({project,container:mount,onReady:ready}));}};
  function ready(){clearTimeout(timeout);stage.classList.add('is-ready');stage.setAttribute('aria-busy','false');loading.hidden=true;}
  function clearPlayer(){generation++;clearTimeout(timeout);dispose?.();dispose=undefined;mount.replaceChildren();stage.classList.remove('is-ready');stage.setAttribute('aria-busy','false');loading.hidden=true;}
  function open(project,button){
    clearPlayer();trigger=button;
    dialog.querySelector('#portfolio-modal-title').textContent=project.title;
    dialog.querySelector('[data-video-category]').textContent=project.category;
    external.hidden=project.provider!=='youtube';
    if(project.provider==='youtube')external.href=`https://www.youtube.com/watch?v=${project.videoId}`;
    if(!dialog.open){
      scrollPosition=scrollY;
      previousStyles={position:document.body.style.position,top:document.body.style.top,width:document.body.style.width,paddingRight:document.body.style.paddingRight};
      const gutter=innerWidth-document.documentElement.clientWidth;
      document.body.style.position='fixed';document.body.style.top=`-${scrollPosition}px`;document.body.style.width='100%';
      if(gutter)document.body.style.paddingRight=`${gutter}px`;
      document.body.classList.add('portfolio-locked');dialog.showModal();
    }
    loading.textContent='Opening your film…';loading.hidden=false;stage.setAttribute('aria-busy','true');
    timeout=setTimeout(()=>{stage.setAttribute('aria-busy','false');loading.textContent='Taking longer than expected. You can also watch on YouTube below.';},12000);
    try{
      const provider=providers.get(project.provider);
      if(!provider)throw Error('Unsupported provider');
      const session=generation;
      dispose=provider(project,()=>{if(session===generation&&dialog.open)ready();});
    }catch{clearTimeout(timeout);stage.setAttribute('aria-busy','false');loading.textContent='This player is unavailable. Please use the video link below.';}
  }
  document.querySelectorAll('[data-video-id]').forEach(button=>button.addEventListener('click',()=>{
    const project=entries.find(p=>p.id===button.dataset.videoId);if(project)open(project,button);
  }));
  function close(){clearPlayer();dialog.close();}
  dialog.querySelector('.portfolio-close').addEventListener('click',close);
  dialog.addEventListener('click',event=>{if(event.target===dialog)close();});
  dialog.addEventListener('cancel',()=>clearPlayer());
  dialog.addEventListener('close',()=>{
    clearPlayer();document.body.classList.remove('portfolio-locked');
    if(previousStyles)Object.assign(document.body.style,previousStyles);
    window.scrollTo({top:scrollPosition,behavior:'instant'});trigger?.focus({preventScroll:true});
  });
  addEventListener('pagehide',()=>{if(dialog.open)dialog.close();clearPlayer();});
  const cards=[...document.querySelectorAll('.portfolio-card')];
  const filters=[...document.querySelectorAll('[data-filter]')];
  filters.forEach(button=>button.addEventListener('click',()=>{
    const category=button.dataset.filter;let count=0;
    filters.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    cards.forEach(card=>{card.hidden=category!=='All'&&card.dataset.category!==category;if(!card.hidden)count++;});
    document.querySelector('[data-filter-status]').textContent=`${count} videos shown${category==='All'?'':` in ${category}`}.`;
    document.querySelector('.project-empty').hidden=count!==0;
  }));
})();
