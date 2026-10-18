/* ================================================================
   Dr. N. Kiruthiga — Academic Portfolio
   main.js: Particles (hero only), Typewriter, Counters,
            IntersectionObserver, Navbar, Mobile Menu, Active Nav
   ================================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------------
     HERO PARTICLE CANVAS  — subtle, contained within #hero only
  ---------------------------------------------------------------- */
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [], animFrame;

    function resize() {
      const hero = document.getElementById('hero');
      W = canvas.width  = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
    }

    function randomBetween(a, b) { return a + Math.random() * (b - a); }

    function createParticle() {
      return {
        x:     randomBetween(0, W),
        y:     randomBetween(0, H),
        r:     randomBetween(1, 2.2),
        vx:    randomBetween(-0.3, 0.3),
        vy:    randomBetween(-0.25, 0.25),
        alpha: randomBetween(0.15, 0.35),
        color: Math.random() > 0.5 ? '147,197,253' : '94,234,212',
      };
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < 55; i++) particles.push(createParticle());
    }

    function drawParticles() {
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        /* draw dot */
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.color + ',' + p.alpha + ')';
        ctx.fill();

        /* draw connections */
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const lineAlpha = 0.07 * (1 - dist / 120);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = 'rgba(147,197,253,' + lineAlpha + ')';
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        /* move */
        p.x += p.vx;
        p.y += p.vy;

        /* wrap edges */
        if (p.x < -5)    p.x = W + 5;
        if (p.x > W + 5) p.x = -5;
        if (p.y < -5)    p.y = H + 5;
        if (p.y > H + 5) p.y = -5;
      }

      animFrame = requestAnimationFrame(drawParticles);
    }

    resize();
    initParticles();
    drawParticles();

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        cancelAnimationFrame(animFrame);
        resize();
        initParticles();
        drawParticles();
      }, 150);
    });
  }

  /* ----------------------------------------------------------------
     TYPEWRITER EFFECT
  ---------------------------------------------------------------- */
  const typeTarget = document.getElementById('typewriterText');
  if (typeTarget) {
    const phrases = [
      'Computer-Aided Drug Design',
      'Medicinal Chemistry',
      'AI-Driven Drug Discovery',
      'Marine Bioactive Research',
    ];
    let pIdx = 0, cIdx = 0, deleting = false;
    const TYPING_SPEED   = 90;
    const DELETING_SPEED = 55;
    const PAUSE_AFTER    = 2200;
    const PAUSE_BEFORE   = 350;

    function typeStep() {
      const phrase = phrases[pIdx];
      if (!deleting) {
        typeTarget.textContent = phrase.slice(0, cIdx + 1);
        cIdx++;
        if (cIdx === phrase.length) {
          deleting = true;
          setTimeout(typeStep, PAUSE_AFTER);
          return;
        }
        setTimeout(typeStep, TYPING_SPEED);
      } else {
        typeTarget.textContent = phrase.slice(0, cIdx - 1);
        cIdx--;
        if (cIdx === 0) {
          deleting = false;
          pIdx = (pIdx + 1) % phrases.length;
          setTimeout(typeStep, PAUSE_BEFORE);
          return;
        }
        setTimeout(typeStep, DELETING_SPEED);
      }
    }
    setTimeout(typeStep, 800);
  }

  /* ----------------------------------------------------------------
     INTERSECTION OBSERVER — reveal on scroll
  ---------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ----------------------------------------------------------------
     ANIMATED COUNTERS
  ---------------------------------------------------------------- */
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el) {
    const target   = parseFloat(el.dataset.target);
    const isDecimal = el.classList.contains('stat-decimal');
    const duration = 2000;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const current  = easeOut(progress) * target;
      el.textContent = isDecimal ? current.toFixed(1) : Math.round(current);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = isDecimal ? target.toFixed(1) : String(Math.round(target));
      }
    }
    requestAnimationFrame(step);
  }

  const statNumbers = document.querySelectorAll('.stat-number');
  if ('IntersectionObserver' in window && statNumbers.length) {
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statNumbers.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ----------------------------------------------------------------
     NAVBAR — scroll shadow + active link highlight
  ---------------------------------------------------------------- */
  const navbar   = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach(function (sec) {
      if (window.scrollY >= sec.offsetTop - 90) current = sec.id;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ----------------------------------------------------------------
     MOBILE MENU
  ---------------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navLinks');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const open = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', String(open));
    });

    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', function (e) {
      if (!navbar.contains(e.target)) {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ----------------------------------------------------------------
     SMOOTH ANCHOR SCROLL (accounts for fixed navbar height)
  ---------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = navbar ? navbar.offsetHeight + 8 : 68;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

})();
