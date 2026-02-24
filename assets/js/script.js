
'use strict';
/* ---- Ano dinâmico no footer ---- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---- Header: adiciona classe ao rolar ---- */
(function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // estado inicial
})();

/* ---- Menu mobile (hamburger) ---- */
(function initMobileMenu() {
  const btn     = document.getElementById('hamburger');
  const navMob  = document.getElementById('nav-mobile');
  if (!btn || !navMob) return;

  const links = navMob.querySelectorAll('.nav-mobile__link');

  const toggle = (force) => {
    const open = force !== undefined ? force : !btn.classList.contains('open');
    btn.classList.toggle('open', open);
    navMob.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    navMob.setAttribute('aria-hidden', String(!open));
  };

  btn.addEventListener('click', () => toggle());

  // Fecha ao clicar em um link
  links.forEach(link => link.addEventListener('click', () => toggle(false)));

  // Fecha ao clicar fora
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !navMob.contains(e.target)) {
      toggle(false);
    }
  });
})();

/* ---- Accordion ---- */
(function initAccordion() {
  const triggers = document.querySelectorAll('.accordion__trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const isOpen  = trigger.getAttribute('aria-expanded') === 'true';
      const panel   = trigger.nextElementSibling;
      const group   = trigger.closest('.accordion');

      // Fecha todos do mesmo grupo
      group.querySelectorAll('.accordion__trigger').forEach(t => {
        t.setAttribute('aria-expanded', 'false');
        const p = t.nextElementSibling;
        if (p) p.style.maxHeight = null;
      });

      // Abre o clicado (se estava fechado)
      if (!isOpen) {
        trigger.setAttribute('aria-expanded', 'true');
        if (panel) panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
})();

/* ---- Scroll Reveal (AOS simples) ---- */
(function initScrollReveal() {
  const items = document.querySelectorAll('[data-aos]');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    observer.observe(el);
  });
})();

/* ---- Smooth scroll para links âncora ---- */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80; // altura do header
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ---- Galeria: lightbox simples ---- */
(function initLightbox() {
  const items = document.querySelectorAll('.galeria__item');
  if (!items.length) return;

  // Cria overlay
  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Visualizar imagem');
  overlay.innerHTML = `
    <button class="lightbox__close" aria-label="Fechar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    <img class="lightbox__img" src="" alt="">
  `;
  document.body.appendChild(overlay);

  const lbImg   = overlay.querySelector('.lightbox__img');
  const lbClose = overlay.querySelector('.lightbox__close');

  const open = (src, alt) => {
    lbImg.src = src;
    lbImg.alt = alt || '';
    overlay.classList.add('lightbox--open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    overlay.classList.remove('lightbox--open');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 300);
  };

  items.forEach(item => {
    const img = item.querySelector('img');
    if (!img) return;
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => open(img.src, img.alt));
  });

  lbClose.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();
