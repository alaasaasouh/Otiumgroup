/* A bounded, optional introduction. Never waits for the entire sequence. */
(() => {
  if (!document.querySelector('.home-scroll')) return;
  let dialog, showTimer, stopTimer, finished=false;
  function finish() {
    if(finished)return;
    finished=true;clearTimeout(showTimer);clearTimeout(stopTimer);
    document.documentElement.classList.remove('intro-loading');
    if(dialog){const focused=dialog.contains(document.activeElement);dialog.close();dialog.remove();if(focused)document.querySelector('main')?.focus({preventScroll:true});}
    try{sessionStorage.setItem('otium-intro-seen','1');}catch{}
  }
  window.OtiumIntro={finish,progress(loaded,total){if(dialog)dialog.querySelector('progress').value=loaded/total;}};
  let seen=false;try{seen=sessionStorage.getItem('otium-intro-seen')==='1';}catch{}
  if(seen||matchMedia('(prefers-reduced-motion: reduce)').matches||navigator.connection?.saveData){finish();return;}
  // Avoid flashing a loading screen when cached frames are already ready.
  showTimer=setTimeout(()=>{
    if(finished)return;
    dialog=document.createElement('dialog');dialog.className='home-intro';dialog.setAttribute('aria-labelledby','intro-heading');
    dialog.innerHTML='<div class="intro-inner"><div class="intro-identity" role="img" aria-label="Otium Group"><span class="brand-mark" aria-hidden="true"><img src="assets/images/otium-logo.webp" alt="" width="600" height="400"></span><span class="brand-name" aria-hidden="true">OTIUM<small>GROUP</small></span></div><h2 id="intro-heading">The art of making<br><em>things happen.</em></h2><p class="intro-status" role="status">Preparing your first glimpse</p><progress max="1" value="0" aria-label="Preparing opening animation"></progress><button class="text-link" autofocus>Enter website</button></div>';
    dialog.querySelector('button').addEventListener('click',finish);
    dialog.addEventListener('cancel',e=>{e.preventDefault();finish();});
    document.body.append(dialog);document.documentElement.classList.add('intro-loading');dialog.showModal();
  },150);
  stopTimer=setTimeout(finish,3000);
  addEventListener('pagehide',finish,{once:true});
})();
