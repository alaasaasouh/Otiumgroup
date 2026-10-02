/* Reveal the already-prepared homepage, without redirecting or reloading assets. */
(() => {
  const dialog=document.querySelector('.home-intro');
  if(!dialog)return;
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
  window.OtiumIntro={finish,progress(loaded,total){if(!finished)dialog.querySelector('progress').value=loaded/total;}};
  if(!document.documentElement.classList.contains('intro-pending')){finish();return;}
  dialog.querySelector('button').addEventListener('click',finish);
  dialog.addEventListener('cancel',event=>{event.preventDefault();finish();});
  dialog.showModal();
  addEventListener('pagehide',finish,{once:true});
})();
