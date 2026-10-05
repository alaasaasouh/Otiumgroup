/* Reveal the already-prepared homepage, without redirecting or reloading assets. */
(() => {
  const dialog=document.querySelector('.home-intro');
  if(!dialog)return;
  const progress=dialog.querySelector('progress');
  const status=dialog.querySelector('.intro-status');
  let finished=false;
  function finish(){
    if(finished)return;
    finished=true;clearTimeout(window.otiumIntroDeadline);
    const focused=dialog.contains(document.activeElement);
    if(dialog.open)dialog.close();
    document.documentElement.classList.remove('intro-pending');
    dialog.remove();
    if(focused)document.querySelector('main')?.focus({preventScroll:true});
  }
  window.OtiumIntro={
    progress(loaded,total){
      if(finished)return;
      progress.hidden=false;
      progress.value=loaded/total;
      status.textContent=loaded>=total?'Your first glimpse is ready':'Preparing your first glimpse';
    },
    static(){
      if(finished)return;
      progress.hidden=true;
      status.textContent='Welcome to Otium Group';
    }
  };
  if(!document.documentElement.classList.contains('intro-pending')){finish();return;}
  dialog.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>{
    window.OtiumI18n?.setLanguage(button.dataset.language);
    finish();
  }));
  dialog.addEventListener('cancel',event=>event.preventDefault());
  dialog.showModal();
  clearTimeout(window.otiumIntroDeadline);
  addEventListener('pagehide',finish,{once:true});
})();
