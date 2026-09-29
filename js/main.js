(() => {
  'use strict';
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.mobile-menu');
  const main = document.querySelector('main');
  const footer = document.querySelector('.site-footer');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let lastFocused;

  function setMenu(open) {
    if (!toggle || !menu) return;
    if (open) lastFocused = document.activeElement;
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.menu-label').textContent = open ? 'Close' : 'Menu';
    document.body.classList.toggle('locked', open);
    if (main) main.inert = open;
    if (footer) footer.inert = open;
    if (open) menu.querySelector('a')?.focus();
    else lastFocused?.focus({ preventScroll: true });
  }
  toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  menu?.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => {
    if (!menu || menu.hidden) return;
    if (e.key === 'Escape') setMenu(false);
    if (e.key === 'Tab') {
      const focusable = [toggle, ...menu.querySelectorAll('a,button')];
      const index = focusable.indexOf(document.activeElement);
      if (e.shiftKey && index <= 0) { e.preventDefault(); focusable.at(-1).focus(); }
      else if (!e.shiftKey && index === focusable.length - 1) { e.preventDefault(); toggle.focus(); }
    }
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 800 && menu && !menu.hidden) setMenu(false); });

  // Native scrolling remains the foundation. One scheduled update per frame.
  const marquee = document.querySelector('.marquee-track');
  let ticking = false;
  function updateScroll() {
    header?.classList.toggle('scrolled', window.scrollY > 90);
    if (marquee && !reducedMotion.matches) {
      const rect = marquee.parentElement.getBoundingClientRect();
      if (rect.top < innerHeight && rect.bottom > 0) {
        const progress = (innerHeight - rect.top) / (innerHeight + rect.height);
        marquee.style.transform = `translateX(${-30 - progress * 200}px)`;
      }
    }
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateScroll); ticking = true; }
  }, { passive: true });
  updateScroll();

  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.remove('is-pending');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -25px 0px' });
    document.querySelectorAll('.reveal').forEach(element => {
      if (element.getBoundingClientRect().top > window.innerHeight) element.classList.add('is-pending');
      observer.observe(element);
    });
    reducedMotion.addEventListener('change', e => {
      if (e.matches) {
        observer.disconnect();
        document.querySelectorAll('.is-pending').forEach(el => el.classList.remove('is-pending'));
        if (marquee) marquee.style.transform = '';
      }
    });
  }

  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
  // Contact details are only shown when approved details are supplied in data/site.js.
  const details = document.querySelector('[data-contact-details]');
  const config = window.OTIUM_SITE || {};
  if (details) {
    for (const key of ['email', 'phone', 'address', 'instagram', 'linkedin']) {
      const value = config[key];
      if (!value) continue;
      const element = document.createElement(key === 'address' ? 'p' : 'a');
      element.textContent = ['instagram','linkedin'].includes(key) ? key[0].toUpperCase() + key.slice(1) : value;
      if (key === 'email') element.href = `mailto:${value}`;
      else if (key === 'phone') element.href = `tel:${value.replace(/[^+\d]/g, '')}`;
      else if (key !== 'address') {
        try { const url = new URL(value); if (url.protocol !== 'https:') continue; element.href = url.href; }
        catch { continue; }
        element.target = '_blank'; element.rel = 'noopener noreferrer';
      }
      details.append(element);
    }
  }
})();
