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
  // Abre o aplicativo de e-mail do visitante com a mensagem já preenchida
  const subject = document.getElementById('fsubject').value.trim() || 'Contato pelo portfólio';
  const body = `${msg}\n\n${name}\n${email}`;
  window.location.href = `mailto:mirela.bertosilva@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  showToast('✉️ Abrindo seu aplicativo de e-mail...');
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

/* ── CARROSSEL DE PROJETOS ── */
(function () {
  const carousel = document.querySelector('.projects-carousel');
  const track = document.getElementById('projTrack');
  if (!carousel || !track) return;
  const prev = document.getElementById('projPrev');
  const next = document.getElementById('projNext');
  const dotsBox = document.getElementById('projDots');
  const cards = () => [...track.querySelectorAll('.project-card')];

  const cardStep = () => {
    const c = cards();
    return c.length > 1 ? c[1].offsetLeft - c[0].offsetLeft : track.clientWidth;
  };
  const perView = () => Math.max(1, Math.round(track.clientWidth / cardStep()));
  const pages = () => Math.max(1, cards().length - perView() + 1);

  function buildDots() {
    const total = pages();
    dotsBox.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const b = document.createElement('button');
      b.setAttribute('aria-label', 'Ir para o projeto ' + (i + 1));
      b.addEventListener('click', () => track.scrollTo({ left: i * cardStep() }));
      dotsBox.appendChild(b);
    }
  }

  function update() {
    const max = track.scrollWidth - track.clientWidth;
    carousel.classList.toggle('no-scroll', max <= 4);
    prev.disabled = track.scrollLeft <= 4;
    next.disabled = track.scrollLeft >= max - 4;
    const idx = Math.round(track.scrollLeft / cardStep());
    [...dotsBox.children].forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  prev.addEventListener('click', () => track.scrollBy({ left: -cardStep() }));
  next.addEventListener('click', () => track.scrollBy({ left: cardStep() }));
  track.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });

  // Setas do teclado quando o carrossel está em foco
  track.tabIndex = 0;
  track.setAttribute('aria-label', 'Projetos. Use as setas para navegar.');
  track.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next.click(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev.click(); }
  });

  // Arrastar com o mouse (no celular o toque já rola nativamente)
  let down = false, startX = 0, startLeft = 0, moved = false;
  track.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse') return;
    down = true; moved = false; startX = e.clientX; startLeft = track.scrollLeft;
    track.classList.add('dragging');
    track.style.scrollSnapType = 'none'; track.style.scrollBehavior = 'auto';
  });
  window.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 5) moved = true;
    track.scrollLeft = startLeft - dx;
  });
  window.addEventListener('pointerup', () => {
    if (!down) return;
    down = false;
    track.classList.remove('dragging');
    track.style.scrollSnapType = ''; track.style.scrollBehavior = '';
    track.scrollTo({ left: Math.round(track.scrollLeft / cardStep()) * cardStep() });
  });
  // Evita abrir um link ao soltar o mouse depois de arrastar
  track.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  track.addEventListener('dragstart', e => e.preventDefault());

  window.addEventListener('resize', () => { buildDots(); update(); });
  buildDots();
  update();
})();
