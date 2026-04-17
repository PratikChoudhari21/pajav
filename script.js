/* =============================================
   PAJAV FOUNDATION — Main JavaScript
   ============================================= */

/* ---- Scroll Progress Bar ---- */
const progressBar = document.getElementById('progress-bar');

function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = (scrollTop / docHeight) * 100;
  progressBar.style.width = pct + '%';
}

/* ---- Navbar Shrink ---- */
const navbar = document.getElementById('navbar');

function updateNavbar() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

/* ---- Mobile Nav Toggle ---- */
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    navLinks.classList.contains('open')
      ? (spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)',
         spans[1].style.opacity = '0',
         spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)')
      : (spans[0].style.transform = '',
         spans[1].style.opacity = '',
         spans[2].style.transform = '');
  });
}

// Close nav on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

/* ---- Hero Parallax Background ---- */
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  heroBg.classList.add('loaded');
  window.addEventListener('scroll', () => {
    const offset = window.scrollY;
    if (offset < window.innerHeight) {
      heroBg.style.transform = `scale(1) translateY(${offset * 0.3}px)`;
    }
  }, { passive: true });
}

/* ---- Intersection Observer: Animations ---- */
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, parseInt(delay));
      animObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-anim]').forEach(el => animObserver.observe(el));

/* ---- Timeline Animations ---- */
const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const items = document.querySelectorAll('.timeline-item');
      items.forEach((item, idx) => {
        setTimeout(() => item.classList.add('visible'), idx * 150);
      });
      timelineObserver.disconnect();
    }
  });
}, { threshold: 0.1 });

const timeline = document.querySelector('.timeline');
if (timeline) timelineObserver.observe(timeline);

/* ---- Animated Counters ---- */
function animateCounter(el, target, duration = 2000, suffix = '+') {
  const start = 0;
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);

    // Format with comma if large
    const formatted = current >= 1000
      ? (current / 1000).toFixed(current >= 10000 ? 0 : 1) + 'k'
      : current;
    el.textContent = formatted + suffix;

    if (progress < 1) requestAnimationFrame(step);
    else {
      const finalFormatted = target >= 1000
        ? (target / 1000).toFixed(target >= 10000 ? 0 : 1) + 'k'
        : target;
      el.textContent = finalFormatted + suffix;
    }
  }

  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numEl = entry.target.querySelector('.stat-num');
      const target = parseInt(entry.target.dataset.target);
      const suffix = entry.target.dataset.suffix || '+';
      if (numEl && target) animateCounter(numEl, target, 2200, suffix);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.stat-card[data-target]').forEach(el => counterObserver.observe(el));

/* ---- Gallery Lightbox ---- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (img && lightboxImg) {
      lightboxImg.src = img.src;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });
});

if (lightboxClose) {
  lightboxClose.addEventListener('click', closeLightbox);
}

if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeLightbox();
    closeModal();
  }
});

/* ---- Donation Modal ---- */
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.querySelector('.modal-close');
const donateTriggers = document.querySelectorAll('.open-modal');
const modalAmounts = document.querySelectorAll('.modal-amt');
const customInput = document.getElementById('custom-amount');

donateTriggers.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });
});

if (modalClose) modalClose.addEventListener('click', closeModal);

if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}

function openModal() {
  if (modalOverlay) {
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  if (modalOverlay) {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Amount selection
modalAmounts.forEach(btn => {
  btn.addEventListener('click', () => {
    modalAmounts.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (customInput) customInput.value = '';
  });
});

if (customInput) {
  customInput.addEventListener('input', () => {
    modalAmounts.forEach(b => b.classList.remove('active'));
  });
}

// Quick amount pills in main CTA section
const amountPills = document.querySelectorAll('.amount-pill');
amountPills.forEach(pill => {
  pill.addEventListener('click', () => {
    amountPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    // Open modal with selected amount
    openModal();
    const amt = pill.dataset.amount;
    if (amt) {
      modalAmounts.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.amount === amt) btn.classList.add('active');
      });
    }
  });
});

// Donate button in modal
const modalDonateBtn = document.getElementById('modal-donate-btn');
if (modalDonateBtn) {
  modalDonateBtn.addEventListener('click', () => {
    const activeAmt = document.querySelector('.modal-amt.active');
    const custom = customInput ? customInput.value.trim() : '';
    const amount = custom || (activeAmt ? activeAmt.dataset.amount : null);

    if (!amount) {
      customInput.focus();
      customInput.style.borderColor = '#e24b4a';
      setTimeout(() => { customInput.style.borderColor = ''; }, 2000);
      return;
    }

    closeModal();
    showToast(`🙏 Thank you! Redirecting to payment for ₹${amount}`);
  });
}

/* ---- Volunteer Form ---- */
const volForm = document.getElementById('volunteer-form');
if (volForm) {
  volForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const inputs = volForm.querySelectorAll('input[required], select[required]');
    let valid = true;

    inputs.forEach(input => {
      if (!input.value.trim()) {
        input.style.borderColor = '#e24b4a';
        valid = false;
        setTimeout(() => { input.style.borderColor = ''; }, 2000);
      }
    });

    if (!valid) return;

    // Simulate submit
    const btn = volForm.querySelector('button[type="submit"]');
    btn.textContent = 'Submitting...';
    btn.disabled = true;

    setTimeout(() => {
      showToast('🎉 Thank you! We\'ll contact you shortly.');
      volForm.reset();
      btn.textContent = 'Submit Application →';
      btn.disabled = false;
    }, 1200);
  });
}

/* ---- Contact Form ---- */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    setTimeout(() => {
      showToast('✅ Message sent! We\'ll respond within 24 hours.');
      contactForm.reset();
      btn.textContent = 'Send Message →';
      btn.disabled = false;
    }, 1000);
  });
}

/* ---- Toast Notification ---- */
const toast = document.getElementById('toast');

function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

/* ---- Lazy Load Images ---- */
const lazyImages = document.querySelectorAll('img[data-src]');
const imgObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      imgObserver.unobserve(img);
    }
  });
}, { rootMargin: '100px' });

lazyImages.forEach(img => imgObserver.observe(img));

/* ---- Scroll Events ---- */
window.addEventListener('scroll', () => {
  updateProgress();
  updateNavbar();
}, { passive: true });

/* ---- Smooth Scroll for Anchor Links ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navHeight = navbar ? navbar.offsetHeight : 80;
      const targetTop = target.offsetTop - navHeight;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  });
});

/* ---- Init ---- */
updateNavbar();
