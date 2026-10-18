// Typewriter
const phrases = ["Computer-Aided Drug Design", "AI Drug Discovery", "Marine Bioactives", "Medicinal Chemistry"];
let phraseIdx = 0, charIdx = 0, deleting = false;
const el = document.getElementById("typewriter");

function tick() {
  const phrase = phrases[phraseIdx];
  if (!deleting) {
    el.textContent = phrase.slice(0, ++charIdx);
    if (charIdx === phrase.length) { deleting = true; setTimeout(tick, 1800); return; }
  } else {
    el.textContent = phrase.slice(0, --charIdx);
    if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
  }
  setTimeout(tick, deleting ? 45 : 80);
}
if (el) setTimeout(tick, 600);

// IntersectionObserver — .reveal → .visible
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// Animated counters
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
function animateCounter(el) {
  const target = +el.dataset.target, duration = 2000, start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(easeOut(p) * target);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCounter(e.target); counterObserver.unobserve(e.target); }
  });
}, { threshold: 0.3 });
document.querySelectorAll(".stat-number[data-target]").forEach(el => counterObserver.observe(el));

// Navbar scroll
const nav = document.querySelector(".navbar");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 60);
}, { passive: true });

// Mobile menu toggle
const toggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
if (toggle && navLinks) {
  toggle.addEventListener("click", () => navLinks.classList.toggle("open"));
  navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));
}

// Active nav link on scroll
const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-links a[href^='#']");
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navItems.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    }
  });
}, { rootMargin: "-40% 0px -55% 0px" });
sections.forEach(s => spy.observe(s));
