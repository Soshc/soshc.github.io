(() => {
  // solid nav after the hero
  const nav = document.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('solid', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // mobile menu
  const toggle = document.querySelector('.nav-toggle');
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));

  // reveal on scroll
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // count-up stats
  const counter = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      counter.unobserve(e.target);
      const el = e.target, end = parseFloat(el.dataset.count), suffix = el.dataset.suffix || '';
      const decimals = String(end).includes('.') ? 1 : 0, t0 = performance.now(), dur = 1600;
      const tick = now => {
        const k = Math.min(1, (now - t0) / dur), v = end * (1 - Math.pow(1 - k, 3));
        el.textContent = v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(el => counter.observe(el));

  // lightbox + video modal
  const modal = document.querySelector('.modal'), body = modal.querySelector('.modal-body');
  let group = [], idx = 0;
  const show = () => { body.innerHTML = ''; const img = new Image(); img.src = group[idx].src; img.alt = group[idx].alt; body.appendChild(img); };
  const open = () => { modal.hidden = false; document.body.style.overflow = 'hidden'; };
  const close = () => { modal.hidden = true; modal.classList.remove('video'); body.innerHTML = ''; document.body.style.overflow = ''; };
  const step = d => { idx = (idx + d + group.length) % group.length; show(); };

  document.querySelectorAll('.gallery').forEach(g => {
    const imgs = [...g.querySelectorAll('img')];
    imgs.forEach((img, i) => img.closest('figure').addEventListener('click', () => {
      group = imgs; idx = i; modal.classList.remove('video'); show(); open();
    }));
  });
  document.querySelectorAll('[data-video]').forEach(b => b.addEventListener('click', () => {
    modal.classList.add('video');
    body.innerHTML = `<video src="${b.dataset.video}" controls autoplay playsinline></video>`;
    open();
  }));
  modal.querySelector('.modal-close').addEventListener('click', close);
  modal.querySelector('.modal-prev').addEventListener('click', () => step(-1));
  modal.querySelector('.modal-next').addEventListener('click', () => step(1));
  modal.addEventListener('click', e => { if (e.target === modal || e.target === body) close(); });
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') close();
    if (!modal.classList.contains('video')) {
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    }
  });
})();
