/* ==========================================================================
   Carl Joseph P. Nacario — Portfolio JavaScript
   script.js
   ========================================================================== */


/* ============================================================
   1. SCROLL REVEAL
   Adds .visible to .reveal elements when they enter the viewport
   ============================================================ */
(function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.08 }
  );

  reveals.forEach((el) => observer.observe(el));
})();


/* ============================================================
   2. ACTIVE NAV LINK HIGHLIGHT
   Highlights the nav link matching the current visible section
   ============================================================ */
(function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function updateActiveLink() {
    let current = '';

    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 120) {
        current = section.id;
      }
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === '#' + current;
      link.style.color = isActive ? 'var(--gold)' : '';
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
})();


/* ============================================================
   3. CONTACT FORM HANDLER
   Validates inputs, shows loading state, displays toast feedback
   ============================================================ */

/**
 * Validates the contact form, gives visual feedback on each
 * field, and shows a success or error toast message.
 */
function handleContactForm() {
  /* ── Grab elements ──────────────────────────────────────── */
  const nameInput    = document.getElementById('contact-name');
  const emailInput   = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const msgInput     = document.getElementById('contact-message');
  const sendBtn      = document.getElementById('send-btn');
  const toast        = document.getElementById('form-toast');

  /* ── Reset previous error states ───────────────────────── */
  [nameInput, emailInput, subjectInput, msgInput].forEach(clearError);

  /* ── Validate fields ────────────────────────────────────── */
  const name    = nameInput.value.trim();
  const email   = emailInput.value.trim();
  const subject = subjectInput.value.trim();
  const message = msgInput.value.trim();

  let hasError = false;

  if (!name) {
    showError(nameInput, 'Please enter your name.');
    hasError = true;
  }

  if (!email) {
    showError(emailInput, 'Please enter your email address.');
    hasError = true;
  } else if (!isValidEmail(email)) {
    showError(emailInput, 'Please enter a valid email address.');
    hasError = true;
  }

  if (!subject) {
    showError(subjectInput, 'Please enter a subject.');
    hasError = true;
  }

  if (!message) {
    showError(msgInput, 'Please enter a message.');
    hasError = true;
  } else if (message.length < 10) {
    showError(msgInput, 'Message must be at least 10 characters.');
    hasError = true;
  }

  if (hasError) {
    shakeButton(sendBtn);
    showToast(toast, 'error', 'Please fill in all required fields correctly.');
    return;
  }

  /* ── Simulate sending (loading state) ──────────────────── */
  setButtonLoading(sendBtn, true);
  hideToast(toast);

  // Simulate a network request (replace with a real fetch/API call later)
  setTimeout(() => {
    setButtonLoading(sendBtn, false);
    resetForm([nameInput, emailInput, subjectInput, msgInput]);
    showToast(
      toast,
      'success',
      `Thanks, ${name}! Your message has been sent. Carl will get back to you soon.`
    );
  }, 1800);
}


/* ── Helper: email regex check ──────────────────────────────────────────── */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ── Helper: mark a field as errored ───────────────────────────────────── */
function showError(input, message) {
  input.classList.add('input-error');
  input.setAttribute('aria-invalid', 'true');

  // Insert error hint below the field if not already there
  let hint = input.parentElement.querySelector('.input-error-hint');
  if (!hint) {
    hint = document.createElement('span');
    hint.className = 'input-error-hint';
    input.parentElement.appendChild(hint);
  }
  hint.textContent = message;
}

/* ── Helper: clear field error state ──────────────────────────────────── */
function clearError(input) {
  input.classList.remove('input-error');
  input.removeAttribute('aria-invalid');
  const hint = input.parentElement.querySelector('.input-error-hint');
  if (hint) hint.remove();
}

/* ── Helper: shake the button on validation failure ─────────────────────── */
function shakeButton(btn) {
  btn.classList.remove('btn-shake'); // reset first
  void btn.offsetWidth;             // force reflow
  btn.classList.add('btn-shake');
  btn.addEventListener('animationend', () => btn.classList.remove('btn-shake'), { once: true });
}

/* ── Helper: toggle loading state on send button ─────────────────────── */
function setButtonLoading(btn, isLoading) {
  if (isLoading) {
    btn.disabled = true;
    btn.dataset.originalText = btn.textContent;
    btn.innerHTML = '<span class="btn-spinner"></span> Sending…';
    btn.style.opacity = '0.75';
    btn.style.cursor  = 'not-allowed';
  } else {
    btn.disabled = false;
    btn.innerHTML  = btn.dataset.originalText || 'Send Message →';
    btn.style.opacity = '';
    btn.style.cursor  = '';
  }
}

/* ── Helper: clear all form fields ──────────────────────────────────────── */
function resetForm(inputs) {
  inputs.forEach((input) => {
    input.value = '';
    clearError(input);
  });
}

/* ── Helper: show toast notification ────────────────────────────────────── */
function showToast(toastEl, type, message) {
  toastEl.textContent  = message;
  toastEl.className    = `form-toast form-toast--${type} form-toast--visible`;

  // Auto-hide after 5 seconds
  clearTimeout(toastEl._hideTimer);
  toastEl._hideTimer = setTimeout(() => hideToast(toastEl), 5000);
}

/* ── Helper: hide toast notification ────────────────────────────────────── */
function hideToast(toastEl) {
  toastEl.classList.remove('form-toast--visible');
}


/* ============================================================
   4. CLEAR FIELD ERROR ON INPUT (live feedback)
   Once the user starts typing, clear the error on that field
   ============================================================ */
(function initLiveValidation() {
  const fields = ['contact-name', 'contact-email', 'contact-subject', 'contact-message'];

  fields.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => clearError(el));
    }
  });
})();
