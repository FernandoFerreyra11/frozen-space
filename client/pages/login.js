// =============================================
// Frozen Space - Login / Register Page
// =============================================

import { t, applyTranslations, getCurrentLang, toggleLang } from '../js/i18n.js';
import { api } from '../js/api.js';
import { setUser } from '../js/auth.js';
import { navigate } from '../js/router.js';

export function renderLoginPage(container, isRegister = false) {
  const mode = isRegister ? 'register' : 'login';

  container.innerHTML = `
    <div class="login-page">
      <div class="login-page__bg"></div>
      <div class="login-card">
        <div class="login-card__logo">
          <div class="login-card__logo-icon">❄️</div>
          <h1 class="login-card__title" data-i18n="login_page.${isRegister ? 'register_title' : 'title'}">
            ${t(`login_page.${isRegister ? 'register_title' : 'title'}`)}
          </h1>
          <p class="login-card__subtitle" data-i18n="login_page.${isRegister ? 'register_subtitle' : 'subtitle'}">
            ${t(`login_page.${isRegister ? 'register_subtitle' : 'subtitle'}`)}
          </p>
        </div>

        <div id="auth-alert"></div>

        <form id="auth-form">
          ${isRegister ? `
            <div class="form-group">
              <label class="form-label" data-i18n="login_page.name">${t('login_page.name')}</label>
              <input type="text" id="auth-name" class="form-input" placeholder="${t('login_page.name')}" data-i18n="login_page.name" required>
            </div>
          ` : ''}

          <div class="form-group">
            <label class="form-label" data-i18n="login_page.email">${t('login_page.email')}</label>
            <input type="email" id="auth-email" class="form-input" placeholder="${t('login_page.email')}" data-i18n="login_page.email" required>
          </div>

          <div class="form-group">
            <label class="form-label" data-i18n="login_page.password">${t('login_page.password')}</label>
            <input type="password" id="auth-password" class="form-input" placeholder="${t('login_page.password')}" data-i18n="login_page.password" required minlength="6">
          </div>

          <button type="submit" id="auth-submit" class="btn btn--primary btn--block btn--lg">
            <span data-i18n="login_page.${isRegister ? 'submit_register' : 'submit_login'}">
              ${t(`login_page.${isRegister ? 'submit_register' : 'submit_login'}`)}
            </span>
          </button>
        </form>

        <div class="login-card__footer">
          <span data-i18n="login_page.${isRegister ? 'has_account' : 'no_account'}">
            ${t(`login_page.${isRegister ? 'has_account' : 'no_account'}`)}
          </span>
          <a id="auth-toggle" data-i18n="login_page.${isRegister ? 'login_link' : 'register_link'}">
            ${t(`login_page.${isRegister ? 'login_link' : 'register_link'}`)}
          </a>
        </div>

        <div style="text-align: center; margin-top: var(--space-4);">
          <button class="navbar__lang-toggle" id="login-lang-toggle">
            ${getCurrentLang() === 'es' ? 'EN' : 'ES'}
          </button>
        </div>
      </div>
    </div>
  `;

  applyTranslations();

  // Event handlers
  const form = document.getElementById('auth-form');
  const alertEl = document.getElementById('auth-alert');
  const toggleLink = document.getElementById('auth-toggle');
  const langToggle = document.getElementById('login-lang-toggle');

  toggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    navigate(isRegister ? '/login' : '/register');
  });

  langToggle.addEventListener('click', () => {
    toggleLang();
    renderLoginPage(container, isRegister);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('auth-submit');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span>';
    alertEl.innerHTML = '';

    try {
      const email = document.getElementById('auth-email').value;
      const password = document.getElementById('auth-password').value;

      let result;
      if (isRegister) {
        const name = document.getElementById('auth-name').value;
        result = await api.register(name, email, password);
      } else {
        result = await api.login(email, password);
      }

      setUser(result.user, result.token);
      navigate('/home');
    } catch (err) {
      alertEl.innerHTML = `<div class="alert alert--error">⚠️ ${err.message}</div>`;
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span data-i18n="login_page.${isRegister ? 'submit_register' : 'submit_login'}">${t(`login_page.${isRegister ? 'submit_register' : 'submit_login'}`)}</span>`;
    }
  });
}
