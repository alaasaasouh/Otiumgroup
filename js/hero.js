(() => {
  'use strict';
  const section = document.querySelector('.home-scroll');
  if (!section) return;
  const canvas = section.querySelector('canvas');
  const poster=section.querySelector('.hero-media img');
  function fallbackPoster(){
    if(!poster || poster.dataset.fallback)return;
    poster.dataset.fallback='true';
    poster.closest('picture')?.querySelectorAll('source').forEach(source=>source.remove());
    poster.src='assets/images/hero-800.webp';
  }
  poster?.addEventListener('error',fallbackPoster);
  if(poster?.complete && !poster.naturalWidth)fallbackPoster();
  const context = canvas.getContext('2d', { alpha: false });
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 600px)').matches;
  const count = 145;
  const folder = mobile ? 'frames/mobile/' : 'frames/';
  const cache = new Map();
  const limit = mobile ? 36 : 44;
  const milestones = Array.from({length:13},(_,i)=>i*12);
  const concurrency = mobile ? 3 : 4;
  let target = 0, current = 0, tick = 0, active = 0, last = -1, generation = 0;
  let failed = false;
  const enabled = () => context && !failed && !motion.matches && !navigator.connection?.saveData;
  const url = i => `${folder}frame_${String(i + 1).padStart(4, '0')}.jpg`;

  function draw() {
    const wanted = Math.round(current);
    let index=-1,entry,distance=Infinity;
    for(const [candidate,item] of cache){
      if(item.ready && Math.abs(candidate-wanted)<distance){index=candidate;entry=item;distance=Math.abs(candidate-wanted);}
    }
    if(!entry)return;
    if (last === index) return;
    const img = entry.image;
    const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    const width = img.naturalWidth * scale, height = img.naturalHeight * scale;
    context.drawImage(img, (canvas.width - width) * .6, (canvas.height - height) / 2, width, height);
    last = index;
    section.classList.add('has-frame');
    section.dataset.frame = String(index + 1);
  }

  function loadNearby() {
    if (!enabled()) return;
    if (document.hidden) return;
    const center = Math.round(target);
    const desired = [center, Math.round(current)];
    for (let distance = 1; distance <= 8; distance++) {
      desired.push(center + distance, center - distance);
    }
    desired.push(...milestones);
    for (const index of desired) {
      if (index < 0 || index >= count || cache.has(index) || active >= concurrency) continue;
      const image = new Image();
      const entry = { image, ready: false };
      const token = generation;
      cache.set(index, entry);
      active++;
      image.onload = async () => {
        try { await image.decode(); } catch {}
        if (token !== generation) return;
        active--;
        entry.ready = true;
        draw();
        const prepared=Array.from({length:9},(_,i)=>cache.get(i)?.ready).filter(Boolean).length;
        window.OtiumIntro?.progress(prepared,9);
        if(prepared===9)window.OtiumIntro?.finish();
        // Keep a bounded window of decoded images, including the displayed frame.
        const removable = [...cache.keys()].filter(i => i !== last && !milestones.includes(i) && cache.get(i).ready)
          .sort((a, b) => Math.abs(b - target) - Math.abs(a - target));
        while (cache.size > limit && removable.length) cache.delete(removable.shift());
        loadNearby();
      };
      image.onerror = () => {
        if (token !== generation) return;
        active--;
        if (index === 0 && !section.classList.contains('has-frame')) {
          failed = true; configure();
        } else loadNearby();
      };
      image.src = url(index);
    }
  }

  function animate() {
    tick = 0;
    if (!enabled()) return;
    current += (target - current) * .18;
    if (Math.abs(target - current) < .05) current = target;
    section.style.setProperty('--hero-progress', current / (count - 1));
    draw();
    loadNearby();
    if (current !== target) tick = requestAnimationFrame(animate);
  }

  function update() {
    if (!enabled()) return;
    const distance = section.offsetHeight - section.querySelector('.group-hero').offsetHeight;
    target = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / Math.max(1, distance))) * (count - 1);
    if (!tick) tick = requestAnimationFrame(animate);
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    last = -1;
    if (enabled()) { draw(); update(); }
  }

  function configure() {
    section.classList.toggle('is-active', !!enabled());
    if (enabled()) { resize(); loadNearby(); }
    else {
      window.OtiumIntro?.finish();
      cancelAnimationFrame(tick); tick = 0;
      generation++; active = 0; cache.clear(); last = -1;
      section.classList.remove('has-frame');
    }
  }
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', resize);
  motion.addEventListener('change', configure);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)update();});
  configure();
})();
