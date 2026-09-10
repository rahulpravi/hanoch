/* ============================================================
   HANOCH AUTOMATIONS — Interactive JS
   Cursor glow · Particles · GSAP animations · Counters · Tilt
============================================================ */

/* 1. CURSOR GLOW */
const cg = document.getElementById('cg');
document.addEventListener('mousemove', e => {
  cg.style.left = e.clientX + 'px';
  cg.style.top  = e.clientY + 'px';
});

/* 2. PARTICLES CANVAS */
(function initParticles() {
  const canvas = document.getElementById('pc');
  const ctx = canvas.getContext('2d');
  let P = [], W, H;

  function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x     = Math.random() * W;
      this.y     = Math.random() * H;
      this.r     = Math.random() * 1.4 + 0.3;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.vx    = (Math.random() - 0.5) * 0.3;
      this.vy    = -Math.random() * 0.5 - 0.15;
      this.life  = 1;
      this.decay = Math.random() * 0.003 + 0.001;
      this.color = Math.random() > 0.55 ? '#00d4ff' : '#77b80f';
    }
    update() {
      this.x += this.vx; this.y += this.vy; this.life -= this.decay;
      if (this.life <= 0 || this.y < 0) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha * this.life;
      ctx.fillStyle   = this.color;
      ctx.shadowBlur  = 6;
      ctx.shadowColor = this.color;
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  }

  function init()  { resize(); P = Array.from({ length: 80 }, () => new Particle()); }
  function loop()  { ctx.clearRect(0, 0, W, H); P.forEach(p => { p.update(); p.draw(); }); requestAnimationFrame(loop); }
  addEventListener('resize', resize);
  init(); loop();
})();

/* 3. SCROLL PROGRESS BAR */
const scrollProgress = document.getElementById('scroll-progress');
function updateScrollProgress() {
  const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
  if (scrollProgress) {
    scrollProgress.style.width = scrolled + '%';
  }
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });

/* 4. NAVBAR SCROLL & LOGO TRANSFORMATION */
const nav = document.getElementById('nav');
function updateNavOnScroll() {
  if (nav) {
    nav.classList.toggle('sc', window.scrollY > 50);
  }
}
window.addEventListener('scroll', updateNavOnScroll, { passive: true });
updateNavOnScroll();

/* 5. SCROLLSPY — ACTIVE NAV LINK HIGHLIGHTING */
const navSections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nm a[href^="#"]');

function updateScrollSpy() {
  const scrollY = window.pageYOffset;
  navSections.forEach(sec => {
    const secTop = sec.offsetTop - 140;
    const secHeight = sec.offsetHeight;
    const secId = sec.getAttribute('id');
    if (scrollY >= secTop && scrollY < secTop + secHeight) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === '#' + secId);
      });
    }
  });
}
window.addEventListener('scroll', updateScrollSpy, { passive: true });

/* 6. MOBILE MENU */
const hbtn = document.getElementById('hbtn');
const mnav = document.getElementById('mnav');
if (hbtn && mnav) {
  hbtn.addEventListener('click', () => {
    hbtn.classList.toggle('open');
    mnav.classList.toggle('open');
    document.body.style.overflow = mnav.classList.contains('open') ? 'hidden' : '';
  });
  document.querySelectorAll('.ml').forEach(l => l.addEventListener('click', () => {
    hbtn.classList.remove('open');
    mnav.classList.remove('open');
    document.body.style.overflow = '';
  }));
}

/* 7. SCROLL TO TOP */
const st = document.getElementById('st');
if (st) {
  addEventListener('scroll', () => st.classList.toggle('v', window.scrollY > 400), { passive: true });
  st.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
}

/* 8. GSAP HERO ENTRANCE TIMELINE */
if (window.gsap) {
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .to('#hey',   { opacity: 1, y: 0, duration: 0.8, delay: 0.2 })
    .to('#ht',    { opacity: 1, y: 0, duration: 0.9 }, '-=0.5')
    .to('#hsub',  { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
    .to('#htags', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
    .to('#hcta',  { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
    .to('#hv',    { opacity: 1, x: 0, duration: 1, ease: 'power2.out' }, '-=0.7');
}

/* 9. SCROLL REVEAL (IntersectionObserver with smooth 3D entry) */
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      // Trigger counter animation if inside
      const countEl = entry.target.querySelector('.cn[data-target]') || (entry.target.classList.contains('cn') ? entry.target : null);
      if (countEl && !countEl.dataset.started) {
        countEl.dataset.started = 'true';
        animCount(countEl);
      }
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.rv, .rv-up, .rv-left, .rv-right, .rv-scale').forEach(el => {
  revealObserver.observe(el);
});

/* 10. MULTI-LAYER SCROLL PARALLAX */
window.addEventListener('scroll', () => {
  const sy = window.pageYOffset;
  // Parallax floating orbs
  document.querySelectorAll('.orb').forEach((o, i) => {
    o.style.transform = `translateY(${sy * (0.09 + i * 0.04)}px)`;
  });
  // Hero 3D visual card slight float
  const hv = document.getElementById('hv');
  if (hv && sy < 800) {
    hv.style.transform = `translateY(${sy * 0.1}px)`;
  }
  // Secondary machine image parallax
  const ais2 = document.querySelector('.ais2');
  if (ais2) {
    const rect = ais2.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      ais2.style.transform = `translateY(${(rect.top - window.innerHeight / 2) * -0.06}px)`;
    }
  }
}, { passive: true });

/* 11. SMOOTH ANIMATED COUNTERS */
function animCount(el) {
  const target = parseInt(el.dataset.target, 10);
  if (isNaN(target)) return;
  const suffix = el.dataset.suffix || '+';
  const duration = 1800;
  const startTime = performance.now();

  function updateNumber(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Smooth exponential ease-out
    const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const val = Math.floor(easeOut * target);
    el.textContent = val + suffix;
    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    } else {
      el.textContent = target + suffix;
    }
  }
  requestAnimationFrame(updateNumber);
}

/* 12. SERVICE CARDS — 3D Parallax on Hover */
document.querySelectorAll('.sc2').forEach(card => {
  const img = card.querySelector('.sci');
  if (!img) return;
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    img.style.transform = `scale(1.07) translate(${x * 10}px, ${y * 10}px)`;
  });
  card.addEventListener('mouseleave', () => {
    img.style.transform = '';
  });
});

/* 13. SMOOTH SCROLL FOR ALL ANCHOR LINKS (with navbar height offset) */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#' || href === '') return;
    const tgt = document.querySelector(href);
    if (tgt) {
      e.preventDefault();
      const navOffset = 70;
      const targetPos = tgt.getBoundingClientRect().top + window.pageYOffset - navOffset;
      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });
    }
  });
});

/* 14. VANILLA TILT INITIALIZATION */
window.addEventListener('load', () => {
  if (window.VanillaTilt) {
    VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
      max: 8,
      speed: 500,
      glare: false
    });
  }
  if (window.ScrollTrigger) {
    ScrollTrigger.refresh();
  }
});
