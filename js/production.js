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
        timer = setTimeout(() => show(index + 1), 7000);
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

  const projects = window.OTIUM_PROJECTS || [];
  const grid = document.querySelector('.project-grid');
  if (grid) {
    const buttons = [...document.querySelectorAll('[data-filter]')];
    const cards = [...grid.querySelectorAll('.project-card')];
    buttons.forEach(button => button.addEventListener('click', () => {
      buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      let count = 0;
      cards.forEach(card => {
        const match = button.dataset.filter === 'All' || card.dataset.category === button.dataset.filter;
        card.hidden = !match;
        if (match) { count++; card.classList.remove('is-pending'); }
      });
      document.querySelector('[data-filter-status]').textContent = `${count} ${count === 1 ? 'project' : 'projects'} shown${button.dataset.filter === 'All' ? '' : ` in ${button.dataset.filter}`}.`;
      document.querySelector('.project-empty').hidden = count !== 0;
    }));
  }

  const dialog = document.querySelector('.lightbox');
  if (!dialog) return;
  const media = dialog.querySelector('.lightbox-media');
  const title = dialog.querySelector('#lightbox-title');
  const category = dialog.querySelector('[data-lightbox-category]');
  const description = dialog.querySelector('.lightbox-description');
  let trigger;

  function embedUrl(value) {
    // Only approved, well-formed Vimeo or YouTube addresses become embeds.
    if (!value) return null;
    try {
      const url = new URL(value);
      if (url.protocol !== 'https:') return null;
      const host = url.hostname.replace(/^www\./, '');
      if (host === 'vimeo.com' || host === 'player.vimeo.com') {
        const match = url.pathname.match(/^\/(?:video\/)?(\d+)\/?$/);
        return match ? `https://player.vimeo.com/video/${match[1]}?autoplay=1&dnt=1` : null;
      }
      if (host === 'youtube.com' || host === 'youtu.be' || host === 'youtube-nocookie.com') {
        const id = host === 'youtu.be' ? url.pathname.slice(1) : url.searchParams.get('v') || url.pathname.split('/').pop();
        return /^[a-zA-Z0-9_-]{11}$/.test(id || '') ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0` : null;
      }
    } catch { return null; }
    return null;
  }
  function openProject(project, source) {
    trigger = source;
    title.textContent = project.title;
    category.textContent = project.category;
    description.textContent = project.description;
    media.replaceChildren();
    const url = embedUrl(project.videoUrl);
    if (url) {
      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.title = `${project.title} — film`;
      iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      media.append(iframe);
    } else {
      const poster = document.createElement('img');
      poster.src = `../assets/images/${project.image || project.thumbnail || 'production'}-1600.webp`;
      poster.alt = '';
      media.append(poster);
      const message = document.createElement('div');
      message.className = 'lightbox-placeholder';
      const label = document.createElement('p'); label.className = 'eyebrow';
      label.textContent = project.category === 'Showreel' ? 'The next chapter' : 'Visual concept';
      const heading = document.createElement('h3'); heading.textContent = project.category === 'Showreel' ? 'Something worth watching.' : 'A glimpse of what’s possible.';
      const copy = document.createElement('p');
      copy.textContent = project.category === 'Showreel' ? 'The official Otium showreel is coming soon. In the meantime, explore our creative direction below.' : 'This is illustrative imagery for the portfolio design. The approved project and film will be added here.';
      message.append(label, heading, copy); media.append(message);
    }
    document.body.classList.add('locked');
    dialog.showModal();
  }
  document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
    const project = projects.find(p => p.id === button.dataset.project);
    if (project) openProject(project, button);
  }));
  document.querySelector('[data-showreel]')?.addEventListener('click', e => openProject(window.OTIUM_SITE.showreel, e.currentTarget));
  dialog.querySelector('.close-lightbox').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => {
    if (e.target === dialog) {
      const box = dialog.getBoundingClientRect();
      if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) dialog.close();
    }
  });
  dialog.addEventListener('close', () => {
    media.replaceChildren();
    document.body.classList.remove('locked');
    trigger?.focus({ preventScroll: true });
  });
})();
