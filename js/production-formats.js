(() => {
  const track = document.querySelector('.format-track');
  if (!track) return;
  const cards = [...track.children];
  const previous = document.querySelector('[data-format-prev]');
  const next = document.querySelector('[data-format-next]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  const visibleCount = () => Math.max(1, Math.round(track.clientWidth / cards[0].getBoundingClientRect().width));
  const lastIndex = () => Math.max(0, cards.length - visibleCount());
  function sync() {
    const bounds = track.getBoundingClientRect();
    const rtl = getComputedStyle(track).direction === 'rtl';
    const distances = cards.map(card => Math.abs(rtl ? bounds.right - card.getBoundingClientRect().right : card.getBoundingClientRect().left - bounds.left));
    index = distances.indexOf(Math.min(...distances));
    previous.disabled = index === 0;
    next.disabled = index >= lastIndex();
  }
  function go(delta) {
    index = Math.max(0, Math.min(lastIndex(), index + delta));
    const rtl = getComputedStyle(track).direction === 'rtl';
    const distance = cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0);
    track.scrollTo({left: (rtl ? -1 : 1) * index * distance, behavior: reduced.matches ? 'instant' : 'smooth'});
  }
  previous.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  track.addEventListener('scroll', sync, {passive:true});
  track.addEventListener('keydown', event => {
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') return go(-cards.length);
    if (event.key === 'End') return go(cards.length);
    const rtl = getComputedStyle(track).direction === 'rtl';
    go((event.key === 'ArrowRight' ? 1 : -1) * (rtl ? -1 : 1));
  });
  new ResizeObserver(sync).observe(track);
  new MutationObserver(() => {track.scrollLeft = 0; sync();}).observe(document.documentElement, {attributes:true, attributeFilter:['dir']});
  sync();
})();
