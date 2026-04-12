

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  lucide.createIcons();

  initNavbar();
  initTypingEffect();
  initParticles();
  initScrollReveal();
  initCountUp();
  initContactForm();
  initSmoothScroll();
});

function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('.nav-link, .btn--nav-cta');

  // Scroll — add glassy background
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    highlightActiveSection();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile toggle
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('open');
  });

  // Close mobile nav on link click
  navItems.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('open');
    });
  });

  // Active section highlight
  function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navHeight = navbar.offsetHeight;
    let currentId = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      // If the top of the section is within range (considering nav height offset)
      if (window.scrollY >= sectionTop - navHeight - 100) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === currentId) {
          link.classList.add('active');
        }
      });
    }
  }
}


function initTypingEffect() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const phrases = [
    'Full-Stack Developer',
    'iOS App Developer',
    'UI / UX Enthusiast',
    'Creative Problem Solver',
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  const typeSpeed = 80;
  const deleteSpeed = 40;
  const pauseEnd = 1800;
  const pauseStart = 400;

  function tick() {
    const current = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(tick, pauseEnd);
        return;
      }
      setTimeout(tick, typeSpeed);
    } else {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(tick, pauseStart);
        return;
      }
      setTimeout(tick, deleteSpeed);
    }
  }

  setTimeout(tick, 600);
}

function initParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const count = 35;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');

    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const duration = Math.random() * 12 + 8;
    const delay = Math.random() * 15;
    const hue = Math.random() > 0.5 ? 260 : 220;
    const lightness = 50 + Math.random() * 30;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: -10px;
      background: hsl(${hue}, 80%, ${lightness}%);
      box-shadow: 0 0 ${size * 3}px hsl(${hue}, 80%, ${lightness}%);
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;

    container.appendChild(p);
  }
}


function initScrollReveal() {
  // Tag elements for reveal
  const selectors = [
    '.section__header',
    '.about__text',
    '.about__skills',
    '.project-featured',
    '.project-card',
    '.contact__form',
    '.contact__info',
    '.stat-card',
    '.info-card',
  ];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.setProperty('--i', i);
    });
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ----------------------------------------------------------
   COUNT-UP ANIMATION
   ---------------------------------------------------------- */
function initCountUp() {
  const counters = document.querySelectorAll('[data-count]');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        animateCount(el, target);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));

  function animateCount(el, target) {
    const duration = 1600;
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;               // back-to-top handled separately
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}
function initContactForm() {
  // Initialise EmailJS with your public key
  emailjs.init("YOUR_PUBLIC_KEY");

  const form = document.getElementById('contactForm');
  if (!form) return;

  /* ── helpers ── */
  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  function setError(input, msg) {
    const group = input.closest('.cl-form-group') || input.closest('.form-group');
    if (!group) return;
    input.classList.add('input--error');
    input.classList.remove('input--ok');
    let err = group.querySelector('.form-error');
    if (!err) {
      err = document.createElement('p');
      err.className = 'form-error';
      group.appendChild(err);
    }
    err.textContent = msg;
  }

  function clearError(input) {
    const group = input.closest('.cl-form-group') || input.closest('.form-group');
    if (!group) return;
    input.classList.remove('input--error');
    input.classList.add('input--ok');
    const err = group.querySelector('.form-error');
    if (err) err.remove();
  }

  /* ── inline (on-blur) validation ── */
  const nameInput    = form.querySelector('#name');
  const emailInput   = form.querySelector('#email');
  const messageInput = form.querySelector('#message');

  nameInput.addEventListener('blur', () => {
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      setError(nameInput, 'Please enter your full name (at least 2 characters).');
    } else {
      clearError(nameInput);
    }
  });

  emailInput.addEventListener('blur', () => {
    if (!emailInput.value.trim()) {
      setError(emailInput, 'Email address is required.');
    } else if (!isValidEmail(emailInput.value)) {
      setError(emailInput, 'Please enter a valid email address.');
    } else {
      clearError(emailInput);
    }
  });

  messageInput.addEventListener('blur', () => {
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      setError(messageInput, 'Message must be at least 10 characters.');
    } else {
      clearError(messageInput);
    }
  });

  /* ── submit handler ── */
  form.addEventListener('submit', e => {
    e.preventDefault();

    // Validate all fields on submit
    let valid = true;

    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      setError(nameInput, 'Please enter your full name (at least 2 characters).');
      valid = false;
    } else { clearError(nameInput); }

    if (!emailInput.value.trim()) {
      setError(emailInput, 'Email address is required.');
      valid = false;
    } else if (!isValidEmail(emailInput.value)) {
      setError(emailInput, 'Please enter a valid email address.');
      valid = false;
    } else { clearError(emailInput); }

    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      setError(messageInput, 'Message must be at least 10 characters.');
      valid = false;
    } else { clearError(messageInput); }

    if (!valid) {
      const btn = form.querySelector('#submitBtn');
      btn.classList.add('btn--shake');
      setTimeout(() => btn.classList.remove('btn--shake'), 600);
      return;
    }

    // Loading state
    const submitBtn = form.querySelector('#submitBtn');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i data-lucide="loader" class="btn__icon"></i> Sending…`;
    lucide.createIcons();

    // Send via EmailJS
    emailjs.sendForm(
      "service_0jnnihs",    // service ID
      "template_xr7wmud",   // template ID
      e.target,
      "YOUR_PUBLIC_KEY"
    )
    .then(() => {
      // ── Success UI ──
      const senderName = nameInput.value.trim();
      const senderEmail = emailInput.value.trim();
      const formHTML = form.innerHTML;

      form.innerHTML = `
        <div class="form-success" style="color:#1a1a1a;">
          <div class="form-success__icon" style="background:rgba(34,197,94,0.1);color:#22c55e;">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                 viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h3 class="form-success__title" style="color:#1a1a1a;">Message Sent!</h3>
          <p class="form-success__text" style="color:#666;">
            Thanks for reaching out, <strong>${senderName.split(' ')[0]}</strong>!
            I'll get back to you at <em>${senderEmail}</em> as soon as possible.
          </p>
          <button class="btn btn--dark" id="sendAnother" style="margin-top:24px;">
            Send another message
          </button>
        </div>
      `;

      form.querySelector('#sendAnother').addEventListener('click', () => {
        form.innerHTML = formHTML;
        lucide.createIcons();
        initContactForm();
      });
    })
    .catch(err => {
      // ── Error UI ──
      console.error('EmailJS error:', err);
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      lucide.createIcons();

      // Show a brief error message below the button
      let errMsg = form.querySelector('.send-error');
      if (!errMsg) {
        errMsg = document.createElement('p');
        errMsg.className = 'send-error';
        errMsg.style.cssText = 'color:#ef4444;font-size:0.85rem;margin-top:8px;text-align:center;';
        submitBtn.parentNode.insertBefore(errMsg, submitBtn.nextSibling);
      }
      errMsg.textContent = 'Oops! Something went wrong. Please try again or email me directly.';
    });
  });
}

