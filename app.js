(function () {
  'use strict';

  var root = document.documentElement;
  var aw   = document.getElementById('avatar-wrap');

  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
    if (aw) {
      aw.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
    var themeMeta = document.getElementById('meta-theme-color');
    if (themeMeta) {
      themeMeta.setAttribute('content', t === 'dark' ? '#080809' : '#f5f6f9');
    }
  }

  applyTheme(
    localStorage.getItem('theme') ||
    (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
  );

  if (aw) {
    aw.addEventListener('click', function () {
      applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
    aw.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); aw.click(); }
    });
  }
}());

(function () {
  'use strict';

  var btn       = document.getElementById('cf-submit');
  var status    = document.getElementById('contact-status');
  var copyBtn   = document.getElementById('contact-copy-btn');
  var emailLink = document.getElementById('contact-email-link');

  if (typeof CONFIG !== 'undefined' && CONFIG.email && emailLink) {
    emailLink.textContent = CONFIG.email;
    emailLink.href = 'mailto:' + CONFIG.email;
  }

  if (copyBtn && typeof CONFIG !== 'undefined' && CONFIG.email) {
    copyBtn.addEventListener('click', function () {
      navigator.clipboard.writeText(CONFIG.email).then(function () {
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
        setTimeout(function () {
          copyBtn.classList.remove('copied');
          copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
        }, 2000);
      }).catch(function () {
        status.textContent = 'Failed to copy email.';
      });
    });
  }

  function resetForm() {
    var cfName = document.getElementById('cf-name');
    var cfEmail = document.getElementById('cf-email');
    var cfMessage = document.getElementById('cf-message');
    if (cfName) cfName.value = '';
    if (cfEmail) cfEmail.value = '';
    if (cfMessage) cfMessage.value = '';
    if (window.hcaptcha) { try { window.hcaptcha.reset(); } catch (_) {} }
  }

  if (!btn) return;

  btn.addEventListener('click', function () {
    if (btn.disabled) return;
    
    var nameVal    = (document.getElementById('cf-name').value || '').trim();
    var emailVal   = (document.getElementById('cf-email').value || '').trim();
    var messageVal = (document.getElementById('cf-message').value || '').trim();

    if (!messageVal) {
      status.textContent = 'Please enter a message.';
      status.style.color = 'var(--accent)';
      return;
    }

    var captcha    = document.querySelector('textarea[name=h-captcha-response]');
    var captchaVal = captcha ? captcha.value : '';

    if (!captchaVal) {
      status.textContent = 'Please complete the captcha verification.';
      status.style.color = 'var(--accent)';
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<span>Sending...</span>';
    status.textContent = '';
    status.style.color = 'var(--text-muted)';

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: '7f033f14-0c92-4205-ab36-b67da9a73303',
        name: nameVal,
        email: emailVal,
        message: messageVal,
        'h-captcha-response': captchaVal
      })
    })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      if (d.success) {
        status.textContent = '✓ Message sent successfully!';
        status.style.color = '#10b981';
        resetForm();
      } else {
        status.textContent = d.message || 'Something went wrong. Please try again.';
        status.style.color = 'var(--accent)';
      }
    })
    .catch(function () {
      status.textContent = 'Network error. Please check your connection.';
      status.style.color = 'var(--accent)';
    })
    .finally(function () {
      btn.disabled = false;
      btn.innerHTML = '<span>Send Message</span><svg class="btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
    });
  });
}());
