(() => {
  'use strict';
  const hero = document.querySelector('.production-hero');
  const slides = [...document.querySelectorAll('.hero-slide')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (slides.length) {
    const current = document.querySelector('[data-current-slide]');
    const slideTitle = document.querySelector('[data-slide-title]');
    const slideCaption = document.querySelector('[data-slide-caption]');
    const progress = document.querySelector('.slider-progress');
    const pause = document.querySelector('.pause-slider');
    let index = 0;
    let timer;
    let userPaused = reducedMotion.matches;
    let hovered = false;
    let focused = false;
    let visible = true;
    function restart() {
      clearTimeout(timer);
      progress.classList.remove('running', 'paused');
      const shouldPlay = !userPaused && !hovered && !focused && visible && !document.hidden;
      if (shouldPlay) {
        void progress.offsetWidth;
        progress.classList.add('running');
        timer = setTimeout(() => show(index + 1), 4500);
      }
      pause.textContent = userPaused ? '▶' : 'Ⅱ';
      pause.setAttribute('aria-label', userPaused ? 'Play slideshow' : 'Pause slideshow');
      pause.setAttribute('aria-pressed', String(userPaused));
    }
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
        slide.setAttribute('aria-hidden', String(i !== index));
        slide.inert = i !== index;
      });
      current.textContent = String(index + 1).padStart(2, '0');
      slideTitle.textContent = slides[index].dataset.title;
      slideCaption.textContent = slides[index].dataset.caption;
      restart();
    }
    document.querySelector('[data-slide-prev]')?.addEventListener('click', () => show(index - 1));
    document.querySelector('[data-slide-next]')?.addEventListener('click', () => show(index + 1));
    pause.addEventListener('click', () => { userPaused = !userPaused; restart(); });
    hero.addEventListener('mouseenter', () => { hovered = true; restart(); });
    hero.addEventListener('mouseleave', () => { hovered = false; restart(); });
    hero.addEventListener('focusin', () => { focused = true; restart(); });
    hero.addEventListener('focusout', e => { if (!hero.contains(e.relatedTarget)) { focused = false; restart(); } });
    hero.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1); }
    });
    let touchX = 0, touchY = 0;
    hero.addEventListener('touchstart', e => { touchX = e.changedTouches[0].clientX; touchY = e.changedTouches[0].clientY; }, { passive: true });
    hero.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchX;
      const dy = e.changedTouches[0].clientY - touchY;
      if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.5) show(index + (dx < 0 ? 1 : -1));
    }, { passive: true });
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting; restart();
    }, { threshold: .1 }).observe(hero);
    document.addEventListener('visibilitychange', restart);
    reducedMotion.addEventListener('change', e => { userPaused = e.matches; restart(); });
    restart();
  }

})();
