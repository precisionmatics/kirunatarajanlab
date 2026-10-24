// ── Stagger delays on grid children ──────────────────
document.querySelectorAll('.stagger').forEach(container => {
  container.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.setProperty('--reveal-delay', `${i * 75}ms`);
  });
});

// ── Hero stat item stagger indices ───────────────────
document.querySelectorAll('.hero-stat-item').forEach((el, i) => {
  el.style.setProperty('--i', i);
});

// ── Scroll progress (JS fallback for non-supporting browsers) ──
const progressBar = document.getElementById('scroll-progress');
if (progressBar && !CSS.supports('animation-timeline', 'scroll()')) {
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    progressBar.style.transform = `scaleX(${pct})`;
  }, { passive: true });
}

// ── Reveal on scroll ──────────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Animated counters ─────────────────────────────────
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
function runCounter(el) {
  const target = parseFloat(el.dataset.target);
  const isDecimal = el.classList.contains('stat-decimal');
  const duration = 1800;
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const val = easeOut(p) * target;
    el.textContent = isDecimal ? val.toFixed(1) : Math.round(val);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = isDecimal ? target.toFixed(1) : target;
  }
  requestAnimationFrame(step);
}

// Hero stats are visible on load — trigger after hero animations settle
const heroCounters = document.querySelectorAll('.hero-stats-strip .stat-number[data-target]');
if (heroCounters.length) setTimeout(() => heroCounters.forEach(runCounter), 900);

// Remaining counters via IntersectionObserver
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { runCounter(e.target); counterObserver.unobserve(e.target); }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.stat-number[data-target]').forEach(el => {
  if (!el.closest('.hero-stats-strip')) counterObserver.observe(el);
});

// ── Typewriter ────────────────────────────────────────
const twEl = document.getElementById('typewriterText');
if (twEl) {
  const phrases = ['Computer-Aided Drug Design', 'AI-Driven Drug Discovery', 'Marine Bioactives', 'Medicinal Chemistry', 'HDAC Inhibitor Design'];
  let phraseIdx = 0, charIdx = 0, deleting = false;
  function tick() {
    const phrase = phrases[phraseIdx];
    if (!deleting) {
      twEl.textContent = phrase.slice(0, ++charIdx);
      if (charIdx === phrase.length) { deleting = true; setTimeout(tick, 2000); return; }
    } else {
      twEl.textContent = phrase.slice(0, --charIdx);
      if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? 40 : 75);
  }
  setTimeout(tick, 1200);
}

// ── Navbar scroll shadow ──────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Active nav — URL-based (works on all pages) ───────
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage) a.classList.add('active');
});

// ── Mobile menu ───────────────────────────────────────
const toggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (toggle && navLinks) {
  toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}

// ── Back to top ───────────────────────────────────────
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
}
