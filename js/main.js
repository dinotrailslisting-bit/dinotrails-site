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
