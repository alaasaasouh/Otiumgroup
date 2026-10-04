/* One lazy player per modal. No iframe, SDK or video request before a click. */
(() => {
  'use strict';
  const dialog=document.querySelector('.portfolio-modal');
  if(!dialog)return;
  const entries=window.OTIUM_PORTFOLIO || [];
  const stage=dialog.querySelector('.portfolio-stage');
  const mount=dialog.querySelector('.portfolio-mount');
  const loading=dialog.querySelector('.portfolio-loading');
  const retry=dialog.querySelector('[data-video-retry]');
  const bundleUrl=new URL('generated/otium-video-player.js',document.currentScript.src).href;
  let trigger, dispose, timeout, scrollPosition=0, previousStyles, generation=0, activeProject;
  let playerModule;
  function loadPlayer(){
    if(window.OtiumMuxPlayer)return Promise.resolve(window.OtiumMuxPlayer);
    // A classic deferred script also works for file:// previews; module imports do not.
    if(playerModule)return playerModule;
    playerModule=new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      script.src=bundleUrl;script.async=true;
      script.onload=()=>{
        if(window.OtiumMuxPlayer)resolve(window.OtiumMuxPlayer);
        else{script.remove();reject(Error('Player bundle did not initialize'));}
      };
      script.onerror=()=>{script.remove();reject(Error('Player bundle could not load'));};
      document.head.append(script);
    }).catch(error=>{playerModule=null;throw error;});
    return playerModule;
  }
  function failed(error,phase='stream'){
    // Recoverable HLS events must not cover a working player with a failure screen.
    if(error?.fatal===false)return;
    clearTimeout(timeout);stage.setAttribute('aria-busy','false');loading.hidden=false;
    const reasons={1:'Playback was interrupted.',2:'The stream request failed.',3:'Your browser could not decode this video.',4:'The stream format is unavailable in this browser.'};
    const reason=reasons[error?.code]||'The stream could not be opened.';
    loading.textContent=phase==='loader'?'The video player could not load. Please try again.':`${reason} ${error?.message||''} ${error?.code?`(Code ${error.code})`:''} Please try again.`;
    if(phase==='stream'){
      stage.classList.add('is-ready');
      loading.classList.add('is-error');
    }
    retry.hidden=false;
    console.error('[Otium video]',phase,error?.message||error?.code||error);
  }
  function ready(){clearTimeout(timeout);stage.classList.add('is-ready');stage.setAttribute('aria-busy','false');loading.hidden=true;loading.classList.remove('is-error');}
  function clearPlayer(){generation++;clearTimeout(timeout);dispose?.();dispose=undefined;mount.replaceChildren();stage.classList.remove('is-ready');stage.setAttribute('aria-busy','false');loading.hidden=true;loading.classList.remove('is-error');}
  async function open(project,button){
    clearPlayer();trigger=button;activeProject=project;retry.hidden=true;
    dialog.querySelector('#portfolio-modal-title').textContent=project.title;
    dialog.querySelector('[data-video-category]').textContent=project.category;
    if(!dialog.open){
      scrollPosition=scrollY;
      previousStyles={position:document.body.style.position,top:document.body.style.top,width:document.body.style.width,paddingRight:document.body.style.paddingRight};
      const gutter=innerWidth-document.documentElement.clientWidth;
      document.body.style.position='fixed';document.body.style.top=`-${scrollPosition}px`;document.body.style.width='100%';
      if(gutter)document.body.style.paddingRight=`${gutter}px`;
      document.body.classList.add('portfolio-locked');dialog.showModal();
    }
    loading.textContent='Opening your film…';loading.hidden=false;stage.setAttribute('aria-busy','true');
    const session=generation;
    timeout=setTimeout(()=>{if(session===generation){loading.textContent='Taking longer than expected. You can retry this film.';retry.hidden=false;}},15000);
    try{
      const {mountPlayer}=await loadPlayer();
      if(session!==generation||!dialog.open)return;
      dispose=mountPlayer({container:mount,project,onReady:()=>{if(session===generation&&dialog.open){retry.hidden=true;ready();}},onError:error=>{if(session===generation&&dialog.open)failed(error);}});
    }catch(error){if(session===generation&&dialog.open)failed(error,'loader');}
  }
  retry.addEventListener('click',()=>{if(activeProject)open(activeProject,trigger);});
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
