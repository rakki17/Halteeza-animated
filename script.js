(() => {
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress');
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  const glow = document.querySelector('.cursor-glow');

  const updateScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 30);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
  };
  updateScroll();
  window.addEventListener('scroll', updateScroll, {passive:true});

  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

  const reveal = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:.12, rootMargin:'0px 0px -50px'});
    reveal.forEach(el => observer.observe(el));
  } else reveal.forEach(el => el.classList.add('visible'));

  if (glow && window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', e => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    }, {passive:true});
  }

  document.querySelectorAll('[data-tilt]').forEach(card => {
    if (!window.matchMedia('(pointer:fine)').matches) return;
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX-r.left)/r.width-.5;
      const y = (e.clientY-r.top)/r.height-.5;
      const panel = card.querySelector('.hero-dashboard');
      if (panel) panel.style.transform = `perspective(1000px) rotateY(${x*-10-7}deg) rotateX(${y*-6+3}deg) translateZ(3px)`;
    });
    card.addEventListener('pointerleave', () => {
      const panel = card.querySelector('.hero-dashboard');
      if (panel) panel.style.transform = '';
    });
  });

  document.querySelectorAll('.magnetic').forEach(btn => {
    if (!window.matchMedia('(pointer:fine)').matches) return;
    btn.addEventListener('pointermove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX-r.left-r.width/2, y = e.clientY-r.top-r.height/2;
      btn.style.transform = `translate(${x*.12}px,${y*.12}px)`;
    });
    btn.addEventListener('pointerleave', () => btn.style.transform = '');
  });

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });
})();
