// ── PASSWORD GATE ──
(function () {
  const PASS = 'SignedListing';
  const SESSION_KEY = 'dtg_auth';
  const gate = document.getElementById('password-gate');
  const banner = document.getElementById('dev-banner');
  const input = document.getElementById('gate-input');
  const btn = document.getElementById('gate-btn');
  const errEl = document.getElementById('gate-error');
  const logoutBtn = document.getElementById('gate-logout');

  function unlock() {
    sessionStorage.setItem(SESSION_KEY, '1');
    gate.classList.add('hidden');
    banner.classList.add('visible');
    document.body.classList.add('has-banner');
  }

  function lock() {
    sessionStorage.removeItem(SESSION_KEY);
    gate.classList.remove('hidden');
    banner.classList.remove('visible');
    document.body.classList.remove('has-banner');
    input.value = '';
    errEl.textContent = '';
  }

  function attempt() {
    if (input.value === PASS) {
      unlock();
    } else {
      input.classList.add('error');
      errEl.textContent = 'Incorrect password. Try again.';
      setTimeout(() => input.classList.remove('error'), 400);
      input.value = '';
      input.focus();
    }
  }

  // Check existing session
  if (sessionStorage.getItem(SESSION_KEY)) {
    unlock();
  }

  btn.addEventListener('click', attempt);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') attempt(); });
  logoutBtn.addEventListener('click', lock);
})();

// ── MOBILE NAV ──
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── NAVBAR SHADOW ON SCROLL ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── SCROLL FADE IN ──
const observer = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.08 }
);
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ── LIGHTBOX ──
(function () {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  const lbImg = document.getElementById('lb-img');
  const lbCaption = document.getElementById('lb-caption');
  const lbCounter = document.getElementById('lb-counter');
  const lbClose = document.getElementById('lb-close');
  const lbPrev = document.getElementById('lb-prev');
  const lbNext = document.getElementById('lb-next');
  let items = [];
  let current = 0;

  function show(idx) {
    current = (idx + items.length) % items.length;
    const item = items[current];
    lbImg.src = item.src;
    lbImg.alt = item.alt || '';
    if (lbCaption) lbCaption.textContent = item.caption;
    if (lbCounter) lbCounter.textContent = `${current + 1} / ${items.length}`;
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.gallery-item').forEach((el, i) => {
    const img = el.querySelector('.gallery-img');
    if (!img) return;
    const cap = el.querySelector('.gallery-caption');
    items.push({ src: img.src, alt: img.alt, caption: cap ? cap.textContent : img.alt });
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => show(i));
  });

  if (!items.length) return;
  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', () => show(current - 1));
  lbNext.addEventListener('click', () => show(current + 1));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
})();

// ── FAQ ACCORDION ──
(function () {
  document.querySelectorAll('.faq-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.cat;
      document.querySelectorAll('.faq-cat-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.faq-section').forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      const section = document.getElementById('faq-' + target);
      if (section) section.classList.add('active');
    });
  });

  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      item.closest('.faq-list')?.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
})();

// ── GALLERY CATEGORY TABS ──
(function () {
  document.querySelectorAll('.gallery-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.cat;
      document.querySelectorAll('.gallery-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.gallery-item').forEach(item => {
        if (cat === 'all' || item.dataset.category === cat) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
})();

// ── CONTACT FORM AJAX ──
(function () {
  const form = document.querySelector('.contact-form');
  const success = document.getElementById('form-success');
  if (!form || !success) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending…';
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        form.reset();
        success.style.display = 'block';
        btn.style.display = 'none';
      } else {
        btn.disabled = false;
        btn.textContent = 'Send Request';
        alert('Something went wrong. Please try again or email directly.');
      }
    } catch {
      btn.disabled = false;
      btn.textContent = 'Send Request';
    }
  });
})();
