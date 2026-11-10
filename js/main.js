/* ── TOAST ── */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

/* ── HAMBURGER ── */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
let mobileOpen = false;

hamburger.addEventListener('click', () => {
  mobileOpen = !mobileOpen;
  mobileNav.style.display = mobileOpen ? 'flex' : 'none';
});

function closeMobileNav() {
  mobileOpen = false;
  mobileNav.style.display = 'none';
}

/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll('.reveal, .timeline-item');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const siblings = [...el.parentElement.children].filter(c => c === el || c.classList.contains('reveal') || c.classList.contains('timeline-item'));
      const idx = siblings.indexOf(el);
      setTimeout(() => {
        el.classList.add('visible');
      }, idx * 80);
      observer.unobserve(el);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

/* ── NAVBAR SCROLL ── */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 20) {
    nav.style.background = 'rgba(2,6,23,0.92)';
  } else {
    nav.style.background = 'rgba(2,6,23,0.6)';
  }
});

/* ── ACTIVE NAV ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const secObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -40% 0px' });

sections.forEach(s => secObserver.observe(s));

/* ── FORM ── */
function handleForm() {
  const name = document.getElementById('fname').value.trim();
  const email = document.getElementById('femail').value.trim();
  const msg = document.getElementById('fmessage').value.trim();
  if (!name || !email || !msg) {
    showToast('⚠️ Preencha todos os campos obrigatórios.');
    return;
  }
  showToast('✅ Mensagem enviada! Responderei em breve 💜');
  document.getElementById('fname').value = '';
  document.getElementById('femail').value = '';
  document.getElementById('fsubject').value = '';
  document.getElementById('fmessage').value = '';
}

/* ── PARTICLES subtle (canvas) ── */
const canvas = document.createElement('canvas');
canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0;opacity:0.35';
document.body.prepend(canvas);
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = Array.from({ length: 55 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: Math.random() * 1.4 + 0.4,
  vx: (Math.random() - 0.5) * 0.18,
  vy: (Math.random() - 0.5) * 0.18,
  color: ['#8B5CF6','#38BDF8','#EC4899'][Math.floor(Math.random()*3)]
}));

function animParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
  });
  requestAnimationFrame(animParticles);
}
animParticles();
