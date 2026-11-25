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

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  // scroll progress bar
  const bar = document.querySelector('.progress');
  const onProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.setProperty('--p', max > 0 ? (scrollY / max).toFixed(4) : 0);
  };
  onProgress();
  window.addEventListener('scroll', onProgress, { passive: true });
  window.addEventListener('resize', onProgress);

  // stagger gallery items so a row appears one after another
  document.querySelectorAll('.gallery, .chars, .skill-grid, .collabs, .stats, .compares').forEach(g => {
    [...g.querySelectorAll('.reveal')].forEach((el, i) => { el.style.transitionDelay = (i % 4) * 90 + 'ms'; });
  });

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

  // hero embers: pink sparks drifting up, like the magic in the key art
  const canvas = document.querySelector('.embers');
  if (canvas && !reduced) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, dpr = 1, sparks = [], running = true;
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const spawn = fresh => ({
      // mostly over the art (right side), a few over the title
      x: (Math.random() < .8 ? .3 + Math.random() * .7 : Math.random() * .35) * w,
      y: fresh ? Math.random() * h : h + 10,
      r: .6 + Math.random() * 1.8,
      vy: .25 + Math.random() * .7,
      sway: Math.random() * Math.PI * 2,
      life: 0, max: 260 + Math.random() * 320,
      hue: Math.random() < .75 ? 328 : 18 // pink, some warm candle-orange
    });
    const count = () => Math.round(Math.min(70, w / 22));
    resize();
    sparks = Array.from({ length: count() }, () => spawn(true));
    const frame = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (const s of sparks) {
        s.life++; s.sway += .02;
        s.y -= s.vy; s.x += Math.sin(s.sway) * .35;
        const k = s.life / s.max, a = Math.sin(Math.PI * Math.min(k, 1)) * .9;
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 6);
        g.addColorStop(0, `hsla(${s.hue}, 100%, 75%, ${a})`);
        g.addColorStop(1, `hsla(${s.hue}, 100%, 60%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 6, 0, Math.PI * 2); ctx.fill();
        if (k >= 1 || s.y < -20) Object.assign(s, spawn(false));
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    window.addEventListener('resize', () => { resize(); sparks.length = Math.min(sparks.length, count()); while (sparks.length < count()) sparks.push(spawn(true)); });
    // pause when the hero is off screen
    new IntersectionObserver(([e]) => {
      const was = running; running = e.isIntersecting;
      if (running && !was) requestAnimationFrame(frame);
    }).observe(canvas);
  }

  // flashlight over the House banner: follows the pointer, wanders by itself otherwise
  const houseHero = document.querySelector('.house-hero');
  if (houseHero) {
    let manual = false, t = 0, visible = false;
    const set = (x, y) => {
      houseHero.style.setProperty('--fx', x + '%'); houseHero.style.setProperty('--fy', y + '%');
      // the statue's eyes (at ~67.4% / 38.2% of the hall) glow brighter the closer the light gets
      const d = Math.hypot((x - 67.4) * houseHero.clientWidth / 100, (y - 38.2) * houseHero.clientHeight / 100);
      houseHero.style.setProperty('--eye', Math.max(.12, 1 - d / 240).toFixed(2));
    };
    const wander = () => {
      if (!visible || manual) return;
      t += reduced ? 0 : .006;
      set(56 + Math.sin(t * 1.3) * 30, 46 + Math.sin(t * 2.1) * 20);
      requestAnimationFrame(wander);
    };
    houseHero.addEventListener('pointermove', e => {
      const r = houseHero.getBoundingClientRect();
      manual = true; houseHero.classList.add('touched');
      set((e.clientX - r.left) / r.width * 100, (e.clientY - r.top) / r.height * 100);
    });
    houseHero.addEventListener('pointerleave', () => { manual = false; requestAnimationFrame(wander); });
    new IntersectionObserver(([e]) => {
      const was = visible; visible = e.isIntersecting;
      if (visible && !was) requestAnimationFrame(wander);
    }).observe(houseHero);
  }

  // Blender -> Unreal compare frames: auto-plays while on screen until the visitor takes over
  document.querySelectorAll('.cmp').forEach(cmp => {
    const btns = [...cmp.querySelectorAll('.cmp-switch button')];
    let timer = null, wipeTimer = null;
    cmp.classList.add('is-a');
    const show = k => {
      if (cmp.classList.contains('is-' + k)) return;
      cmp.classList.remove('is-a', 'is-b'); cmp.classList.add('is-' + k, 'wiping');
      btns.forEach(b => b.setAttribute('aria-pressed', b.dataset.k === k));
      clearTimeout(wipeTimer); wipeTimer = setTimeout(() => cmp.classList.remove('wiping'), 1150);
    };
    const toggle = () => show(cmp.classList.contains('is-a') ? 'b' : 'a');
    const stop = () => { clearInterval(timer); timer = null; };
    btns.forEach(b => b.addEventListener('click', e => { e.stopPropagation(); stop(); show(b.dataset.k); }));
    cmp.addEventListener('click', () => { stop(); toggle(); });
    if (!reduced) {
      new IntersectionObserver(([e]) => {
        if (e.isIntersecting && timer === null && !cmp.dataset.manual) { setTimeout(toggle, 700); timer = setInterval(toggle, 3400); }
        else if (!e.isIntersecting) stop();
      }, { threshold: .5 }).observe(cmp);
      cmp.addEventListener('click', () => { cmp.dataset.manual = '1'; }, true);
    }
  });

  // 3D tilt + glare on gallery images (mouse only)
  if (finePointer && !reduced) {
    document.querySelectorAll('.gallery figure').forEach(f => {
      f.addEventListener('pointermove', e => {
        if (!f.classList.contains('in')) return; // let the reveal finish first
        f.classList.add('tilt'); f.style.transitionDelay = '0ms';
        const r = f.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        f.classList.add('tilting');
        f.style.transform = `perspective(900px) rotateX(${(.5 - y) * 6}deg) rotateY(${(x - .5) * 8}deg)`;
        f.style.setProperty('--gx', x * 100 + '%'); f.style.setProperty('--gy', y * 100 + '%');
      });
      f.addEventListener('pointerleave', () => { f.classList.remove('tilting'); f.style.transform = ''; });
    });
  }
  const root = document.documentElement;
  const isAr = () => root.lang === 'ar';

  // opening eyelids: full version on the first visit of a session, skipped after that
  const wake = document.querySelector('.wake');
  if (wake) {
    let seen = false;
    try { seen = sessionStorage.getItem('woke') === '1'; sessionStorage.setItem('woke', '1'); } catch (e) { /* ignore */ }
    if (seen || reduced) { wake.classList.add('done'); root.style.setProperty('--d0', '.15s'); }
    else setTimeout(() => wake.classList.add('done'), 2100);
  }

  // hero parallax: the art drifts against the mouse, the embers drift more (depth)
  const hero = document.querySelector('.hero'), art = document.querySelector('.hero-art'), heroText = document.querySelector('.hero-content');
  if (hero && finePointer && !reduced) {
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      const px = Math.max(-1, Math.min(1, (e.clientX - r.left) / r.width * 2 - 1));
      const py = Math.max(-1, Math.min(1, (e.clientY - r.top) / r.height * 2 - 1));
      art.style.setProperty('--tx', (-(px + 1) * .7).toFixed(3) + '%');
      art.style.setProperty('--ty', (-(py + 1) * .7).toFixed(3) + '%');
      if (canvas) canvas.style.translate = `${(-px * 34).toFixed(1)}px ${(-py * 22).toFixed(1)}px`;
      heroText.style.translate = `${(px * 6).toFixed(1)}px ${(py * 5).toFixed(1)}px`;
    });
    hero.addEventListener('pointerleave', () => {
      art.style.removeProperty('--tx'); art.style.removeProperty('--ty');
      if (canvas) canvas.style.translate = ''; heroText.style.translate = '';
    });
  }

  // light cursor: a small glow that trails the mouse and changes colour per game
  if (finePointer && !reduced && document.querySelector('.cursor')) {
    const cur = document.querySelector('.cursor');
    const dot = cur.querySelector('i'), ring = cur.querySelector('b'), lab = cur.querySelector('span');
    root.classList.add('has-cursor');
    let mx = -200, my = -200, rx = mx, ry = my;
    const COLORS = { pink: '255, 79, 163', green: '77, 255, 149', ember: '255, 138, 112' };
    addEventListener('pointermove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      cur.classList.remove('hide');
    }, { passive: true });
    document.addEventListener('pointerover', e => {
      const t = e.target;
      const view = t.closest('.gallery figure, .cmp');
      cur.classList.toggle('view', !!view);
      cur.classList.toggle('link', !view && !!t.closest('a, button, .collab, .lang-toggle'));
      if (view) lab.textContent = view.classList.contains('cmp') ? (isAr() ? 'بدّل' : 'Swap') : (isAr() ? 'عرض' : 'View');
      const zone = t.closest('.hero, .house-world') ? 'pink' : t.closest('.env') ? 'ember' : 'green';
      cur.style.setProperty('--cc', COLORS[zone]);
    });
    document.addEventListener('pointerleave', () => cur.classList.add('hide'));
    document.addEventListener('pointerdown', () => cur.classList.add('down'));
    document.addEventListener('pointerup', () => cur.classList.remove('down'));
    const loop = () => {
      rx += (mx - rx) * .18; ry += (my - ry) * .18;
      ring.style.transform = lab.style.transform = `translate(${rx.toFixed(1)}px, ${ry.toFixed(1)}px)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  // kinetic marquee bands: drift on their own, speed up with scrolling and follow its direction
  const bands = [...document.querySelectorAll('.marquee')].map((m, i) => {
    const track = m.querySelector('.marquee-track');
    const base = [...track.children];
    const band = { m, track, x: 0, w: 1, dir: i % 2 ? 1 : -1, on: false };
    band.build = () => {
      track.querySelectorAll('.clone').forEach(c => c.remove());
      band.w = base.reduce((s, el) => s + el.getBoundingClientRect().width, 0) || 1;
      const sets = Math.ceil((innerWidth * 1.1 * 2) / band.w) + 1;
      for (let s = 0; s < sets; s++) base.forEach(el => {
        const c = el.cloneNode(true); c.classList.add('clone'); c.removeAttribute('data-i18n'); track.appendChild(c);
      });
    };
    band.build();
    new IntersectionObserver(([e]) => { band.on = e.isIntersecting; }).observe(m);
    return band;
  });
  if (bands.length) {
    let lastY = scrollY, vel = 0, scrollDir = 1;
    const rebuild = () => bands.forEach(b => b.build());
    document.addEventListener('langchange', rebuild);
    window.addEventListener('resize', rebuild);
    document.fonts && document.fonts.ready.then(rebuild);
    const tick = () => {
      const dy = scrollY - lastY; lastY = scrollY;
      if (dy) scrollDir = dy > 0 ? 1 : -1;
      vel += (Math.min(Math.abs(dy), 80) - vel) * .1;
      bands.forEach(b => {
        if (!b.on) return;
        b.x += (reduced ? 0 : .55 + vel * .45) * b.dir * scrollDir;
        if (b.x <= -b.w) b.x += b.w; if (b.x > 0) b.x -= b.w;
        b.track.style.transform = `translate3d(${b.x.toFixed(2)}px, 0, 0)`;
      });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // lightning over the House now and then, only while it's on screen
  if (houseHero && !reduced) {
    let seen = false;
    new IntersectionObserver(([e]) => { seen = e.isIntersecting; }, { threshold: .4 }).observe(houseHero);
    const strike = () => {
      if (seen && !document.hidden) {
        houseHero.classList.remove('flash'); void houseHero.offsetWidth; houseHero.classList.add('flash');
      }
      setTimeout(strike, 5500 + Math.random() * 6000);
    };
    setTimeout(strike, 2500);
  }

  // spotlight that follows the mouse inside the skill and stat cards
  document.querySelectorAll('.skill, .stat').forEach(c => c.addEventListener('pointermove', e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', e.clientX - r.left + 'px'); c.style.setProperty('--my', e.clientY - r.top + 'px');
  }));

  // magnetic buttons
  if (finePointer && !reduced) document.querySelectorAll('.magnetic').forEach(b => {
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect();
      b.style.translate = `${((e.clientX - r.left) / r.width - .5) * 16}px ${((e.clientY - r.top) / r.height - .5) * 12}px`;
    });
    b.addEventListener('pointerleave', () => { b.style.translate = ''; });
  });

  // headings decode letter by letter when they appear (English only; Arabic letters must stay joined)
  if (!reduced) {
    const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+=/<>';
    const scramble = el => {
      if (isAr() || el.children.length) return;
      const final = el.textContent, n = final.length; let f = 0;
      const step = () => {
        if (isAr()) return;
        let out = '';
        for (let i = 0; i < n; i++) {
          const ch = final[i];
          out += (ch === ' ' || f >= i * 1.3 + 8) ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        el.textContent = out;
        if (f++ < n * 1.3 + 8) requestAnimationFrame(step); else el.textContent = final;
      };
      step();
    };
    const sio = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { sio.unobserve(e.target); setTimeout(() => scramble(e.target), 180); }
    }), { threshold: .8 });
    document.querySelectorAll('.sub, .skills h2, .overview h2, .env-hero-inner h2').forEach(h => sio.observe(h));
  }

  // Janob captures become the station's security cameras, with a live night-time clock
  const cams = [...document.querySelectorAll('.g-janob figure')];
  if (cams.length) {
    const stamps = cams.map((f, i) => {
      const o = document.createElement('div');
      o.className = 'cctv'; o.setAttribute('aria-hidden', 'true');
      o.innerHTML = `<span class="rec">REC</span><span class="cam">CAM ${String(i + 1).padStart(2, '0')}</span><span class="ts"></span><span class="live">JANOB ST.</span>`;
      f.appendChild(o);
      return o.querySelector('.ts');
    });
    const start = Date.now(), base = 3 * 3600 + 7 * 60 + 12; // 03:07:12 AM
    const pad = n => String(n).padStart(2, '0');
    const clock = () => {
      const s = base + Math.floor((Date.now() - start) / 1000);
      const t = `${pad(Math.floor(s / 3600) % 12 || 12)}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)} AM`;
      stamps.forEach((el, i) => { el.textContent = `2026-08-20  ${t.replace(/:(\d\d) /, (m, sec) => ':' + pad((+sec + i * 7) % 60) + ' ')}`; });
    };
    clock(); setInterval(clock, 1000);
  }

  // big "SOSHI" behind the contact block drifts slower than the page
  const ghost = document.querySelector('.contact-ghost');
  if (ghost && !reduced) {
    const onGhost = () => {
      const r = ghost.parentElement.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) ghost.style.setProperty('--gy2', ((r.top + r.height / 2 - innerHeight / 2) * -.18).toFixed(1) + 'px');
    };
    window.addEventListener('scroll', onGhost, { passive: true }); onGhost();
  }

  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') close();
    if (!modal.classList.contains('video')) {
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    }
  });
})();

// 11-16 magic threads (shared by the hero cover and the board altar): pink ribbons rising out of a crystal.
// Light: 30 fps, no canvas shadows, 6 chunks per ribbon, DPR max 1.5, paused off screen, nothing with reduced motion.
const magicThreads = (canvas, anchor, opts = {}) => {
  if (!canvas || matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  const ctx = canvas.getContext('2d'), host = canvas.parentElement;
  const TH = opts.threads || [[-1, 0], [1, 1.7], [-1, 3.1], [1, 4.4], [-1, 5.6], [1, .8]];
  let W = 0, H = 0, A = { x: 0, y: 0, s: 200 }, on = false, last = 0, t0 = performance.now();
  const size = () => {
    const d = Math.min(devicePixelRatio || 1, 1.5), r = host.getBoundingClientRect();
    W = r.width; H = r.height; canvas.width = W * d; canvas.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    A = anchor(r) || A;
  };
  const N = 30, CH = 6, pts = new Array(N + 1);
  const draw = t => {
    ctx.clearRect(0, 0, W, H); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const S = A.s, k = opts.alpha || 1;
    for (const [side, p] of TH) {
      const len = S * (.95 + .2 * Math.sin(t * .4 + p));
      for (let j = 0; j <= N; j++) {
        const u = j / N;
        const out = Math.sin(Math.min(u * 1.8, 1) * Math.PI * .5) * S * (.32 + .08 * Math.sin(p));
        const wave = Math.sin(u * 7.5 - t * 1.4 + p) * S * .10 * Math.sqrt(u);
        const curl = Math.sin(u * 3 + t * .3 + p) * S * .12 * u * u;
        pts[j] = [A.x + side * (out + curl) + wave, A.y - u * len * .9];
      }
      for (let c = 0; c < CH; c++) {
        const a = Math.floor(c * N / CH), b = Math.floor((c + 1) * N / CH), u = (c + .5) / CH;
        const fade = Math.sin(Math.min(u * 1.6, 1) * Math.PI * .5) * (1 - u) * (.75 + .25 * Math.sin(t * 2 + p + u * 6)) * k;
        const w = 1 - u * .75;
        for (const [lw, col] of [[16 * w, `rgba(255,40,150,${fade * .07})`], [7 * w, `rgba(255,50,160,${fade * .2})`], [1.3 * w, `rgba(255,220,240,${fade * .65})`]]) {
          ctx.lineWidth = lw; ctx.strokeStyle = col; ctx.beginPath(); ctx.moveTo(pts[a][0], pts[a][1]);
          for (let j = a + 1; j <= b; j++) ctx.lineTo(pts[j][0], pts[j][1]);
          ctx.stroke();
        }
      }
    }
  };
  const loop = n => { if (!on) return; if (n - last > 33) { last = n; draw((n - t0) / 1000); } requestAnimationFrame(loop); };
  const start = () => { if (on) return; on = true; size(); requestAnimationFrame(loop); };
  new IntersectionObserver(([e]) => { if (e.isIntersecting) start(); else on = false; }, { rootMargin: '80px' }).observe(host);
  addEventListener('resize', () => on && size());
  start();
  return { size };
};

// the board altar in the House section
(() => {
  const altar = document.getElementById('hwAltar');
  if (!altar) return;
  const img = altar.querySelector('.hw-board img');
  const th = magicThreads(altar.querySelector('.hw-threads.front'), r => {
    const b = img.getBoundingClientRect();
    return { x: b.left - r.left + b.width / 2, y: b.top - r.top + b.height * .64, s: b.width || 200 };
  });
  if (th && !img.complete) img.addEventListener('load', th.size);
})();

// the hero: threads rise from the crystal of the board in the cover (crystal at 50.8 % / 79.5 % of the art)
(() => {
  const hero = document.querySelector('.hero2'), img = hero && hero.querySelector('.hero-art img');
  if (!hero) return;
  const th = magicThreads(hero.querySelector('.hero-threads'), r => {
    const b = img.getBoundingClientRect();
    // object-fit: cover, centred: work out where the crystal of the art lands on screen
    const s = Math.max(b.width / 1672, b.height / 941), dw = 1672 * s, dh = 941 * s;
    const x = b.left - r.left + (b.width - dw) / 2 + dw * .508, y = b.top - r.top + (b.height - dh) * .30 + dh * .795;
    hero.style.setProperty('--sx', x + 'px'); hero.style.setProperty('--sy', y + 'px');
    const art = hero.querySelector('.hero-art'); art.style.setProperty('--cx', ((x - (b.left - r.left)) / b.width * 100).toFixed(1) + '%'); art.style.setProperty('--cy', ((y - (b.top - r.top)) / b.height * 100).toFixed(1) + '%');
    return { x, y, s: dw * .2 };
  }, { alpha: 1.25 });
  if (th && !img.complete) img.addEventListener('load', th.size);
  // first visit of a session: the full ignition intro; later visits skip straight to the lit scene
  let seen = false;
  try { seen = sessionStorage.getItem('lit') === '1'; sessionStorage.setItem('lit', '1'); } catch (e) { /* ignore */ }
  hero.classList.add('lit', 'quick');
})();


// 11-16 THE HOUSE scroll story: the board wakes and pulls the rooms out of its crystal on magic threads
(() => {
  const sec = document.querySelector('.hx');
  if (!sec) return;
  const pin = sec.querySelector('.hx-pin'), stage = sec.querySelector('.hx-stage'), cv = sec.querySelector('.hx-magic');
  const board = sec.querySelector('.hx-board'), bimg = board.querySelector('img'), cards = [...sec.querySelectorAll('.hx-card')];
  const ctx = cv.getContext('2d');
  const still = matchMedia('(max-width: 760px), (prefers-reduced-motion: reduce)');
  // where each room hangs (stage %), its tilt, its sway phase
  const SPOTS = [[17, 42, -6, 0], [83, 40, 5, 1.3], [20, 71, 4, 2.4], [80, 70, -5, 3.3]];
  let W = 0, H = 0, on = false, p = 0, pS = 0, t0 = performance.now(), last = 0;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = x => 1 - Math.pow(1 - x, 3);
  const size = () => {
    const d = Math.min(devicePixelRatio || 1, 1.5), r = stage.getBoundingClientRect();
    W = r.width; H = r.height; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
  };
  const crystal = () => { const r = stage.getBoundingClientRect(), b = bimg.getBoundingClientRect(); return { x: b.left - r.left + b.width / 2, y: b.top - r.top + b.height * .64, s: b.width }; };
  const progress = () => { if (window.__hxp != null) return window.__hxp; const r = pin.getBoundingClientRect(); return clamp(-r.top / Math.max(1, r.height - innerHeight)); };

  // glowing ribbon along a quadratic curve (3 layered strokes, no shadows = cheap)
  const ribbon = (x0, y0, cx, cy, x1, y1, k, wide) => {
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(cx, cy, x1, y1);
    for (const [lw, col] of [[wide * 2.6, `rgba(255,40,150,${k * .08})`], [wide, `rgba(255,60,165,${k * .28})`], [1.2, `rgba(255,225,242,${k * .75})`]]) { ctx.lineWidth = lw; ctx.strokeStyle = col; ctx.stroke(); }
  };
  const frame = n => {
    if (!on) return;
    requestAnimationFrame(frame);
    if (n - last < 30) return; last = n;
    const t = (n - t0) / 1000;
    pS = window.__hxp != null ? p : pS + (p - pS) * .12;      // smoothed scroll progress
    const q = still.matches ? 1 : pS;
    // the board wakes: grows a little, warms, the crystal flares
    const wake = ease(clamp(q / .2));
    board.style.setProperty('--wake', wake.toFixed(3));
    stage.style.setProperty('--end', ease(clamp((q - .8) / .16)).toFixed(3));
    stage.style.setProperty('--hint', (1 - clamp(q / .08)).toFixed(3));
    const C = crystal();
    ctx.clearRect(0, 0, W, H); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
    // 6 free threads rising from the crystal (stronger when awake)
    for (let i = 0; i < 6; i++) {
      const side = i % 2 ? 1 : -1, ph = i * 1.1, len = C.s * (.45 + .3 * wake), k = .35 + .65 * wake;
      const sw = Math.sin(t * 1.3 + ph) * C.s * .12;
      ribbon(C.x, C.y, C.x + side * C.s * (.25 + .1 * Math.sin(ph)) + sw, C.y - len * .55, C.x + side * C.s * (.12 + .2 * Math.sin(t * .4 + ph)) + sw * .6, C.y - len, k * (.6 + .4 * Math.sin(t * 2 + ph)), 6);
    }
    // the rooms: pulled out of the crystal one by one, then hung on threads, swaying
    cards.forEach((c, i) => {
      const [sx, sy, rot, ph] = SPOTS[i];
      const a = ease(clamp((q - (.18 + i * .14)) / .2));
      const tx = W * sx / 100, ty = H * sy / 100;
      const x = C.x + (tx - C.x) * a, y = C.y + (ty - C.y) * a - Math.sin(a * Math.PI) * H * .12;
      const sway = Math.sin(t * 1.1 + ph) * 2.2 * a;
      c.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%) rotate(${(rot * a + sway).toFixed(2)}deg) scale(${(.12 + .88 * a).toFixed(3)})`;
      c.style.opacity = clamp(a * 3).toFixed(3);
      if (a > .01) {   // the thread from the crystal to the top of the card
        const cw = c.offsetWidth * (.12 + .88 * a), ch = c.offsetHeight * (.12 + .88 * a);
        const ax = x + Math.sin((rot * a + sway) * Math.PI / 180) * ch * .5, ay = y - ch * .5 + 4;
        const mx = (C.x + ax) / 2 + Math.sin(t * 1.4 + ph) * 18, my = Math.min(C.y, ay) - H * .14 - Math.cos(t + ph) * 10;
        ribbon(C.x, C.y, mx, my, ax, ay, .9 * clamp(a * 2), 5);
      }
    });
  };
  const onScroll = () => { p = progress(); };
  const start = () => { if (on) return; on = true; size(); onScroll(); requestAnimationFrame(frame); };
  new IntersectionObserver(([e]) => { if (e.isIntersecting) start(); else on = false; }, { rootMargin: '120px' }).observe(stage);
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { if (on) size(); });
  still.addEventListener && still.addEventListener('change', () => { size(); });
})();


// 11-16 the cover comes alive: the looping video loads only after the page has loaded (and not on save-data / reduced motion),
// then fades in over the still image once it actually plays
(() => {
  const v = document.querySelector('.hero-loop');
  if (!v || matchMedia('(prefers-reduced-motion: reduce)').matches || (navigator.connection && navigator.connection.saveData)) return;
  const go = () => {
    v.src = v.dataset.src;
    v.addEventListener('playing', () => v.classList.add('on'), { once: true });
    const p = v.play(); if (p && p.catch) p.catch(() => {});
  };
  if (document.readyState === 'complete') setTimeout(go, 300); else addEventListener('load', () => setTimeout(go, 300));
  // pause when the hero is off screen
  new IntersectionObserver(([e]) => { if (!v.src) return; e.isIntersecting ? v.play().catch(() => {}) : v.pause(); }).observe(v);
})();


// 11-16 the living house: windows light up one by one when it comes into view; the house leans a little toward the mouse
(() => {
  const scene = document.getElementById('hmScene');
  if (!scene) return;
  const house = scene.querySelector('.hm-house');
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { scene.classList.add('awake'); o.disconnect(); } }, { threshold: .35 }).observe(scene);
  if (matchMedia('(hover: hover) and (pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    scene.addEventListener('pointermove', e => {
      const r = scene.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      house.style.setProperty('--rx', (-y * 3).toFixed(2) + 'deg'); house.style.setProperty('--ry', (x * 4).toFixed(2) + 'deg');
    });
    scene.addEventListener('pointerleave', () => { house.style.removeProperty('--rx'); house.style.removeProperty('--ry'); });
  }
})();


// 11-16 loader: stays at least 1.9 s (so the board can wake), leaves when the page has loaded (max 6 s)
(() => {
  const ld = document.querySelector('.loader'), root = document.documentElement;
  if (!ld) return;
  if (root.classList.contains('ld-skip')) { ld.remove(); root.style.setProperty('--d0', '.15s'); return; }
  document.body.style.overflow = 'hidden';
  const t0 = performance.now();
  let gone = false;
  const leave = () => {
    if (gone) return; gone = true;
    setTimeout(() => {
      ld.classList.add('done'); root.style.setProperty('--d0', '.5s');
      setTimeout(() => { document.body.style.overflow = ''; ld.remove(); }, 1100);
    }, Math.max(0, 1900 - (performance.now() - t0)));
  };
  if (document.readyState === 'complete') leave(); else addEventListener('load', leave);
  setTimeout(leave, 6000);
})();

// 11-25 "Follow the Development" menus: close on an outside click, on Escape, or after picking an account
(() => {
  const menus = [...document.querySelectorAll('details.follow')];
  if (!menus.length) return;
  document.addEventListener('click', e => menus.forEach(d => { if (d.open && !d.contains(e.target)) d.open = false; }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') menus.forEach(d => { d.open = false; }); });
  menus.forEach(d => d.querySelectorAll('.follow-menu a').forEach(a => a.addEventListener('click', () => { d.open = false; })));
})();


// 11-16 environment accordion: hover (mouse) or tap / focus opens a slice; clicking the open one opens the lightbox
(() => {
  const acc = document.querySelector('.ec-acc');
  if (!acc) return;
  const sl = [...acc.querySelectorAll('.ec-slice')];
  const openOne = s => sl.forEach(x => x.classList.toggle('open', x === s));
  sl.forEach(s => {
    s.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') openOne(s); });
    s.addEventListener('focus', () => openOne(s));
    s.addEventListener('click', e => { if (!s.classList.contains('open')) { e.stopImmediatePropagation(); e.preventDefault(); openOne(s); } }, true);
  });
})();
