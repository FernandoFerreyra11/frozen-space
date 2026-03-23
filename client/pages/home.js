// =============================================
// Frozen Space - Home / Dashboard Page
// =============================================

import { t, applyTranslations, getCurrentLang, toggleLang, onLangChange } from '../js/i18n.js';
import { getUser, clearAuth } from '../js/auth.js';
import { navigate } from '../js/router.js';
import { api } from '../js/api.js';

export function renderHomePage(container) {
  const user = getUser();
  const userName = user ? user.name : 'Usuario';

  container.innerHTML = `
    <!-- Navbar -->
    <nav class="navbar" id="navbar">
      <div class="navbar__inner">
        <a class="navbar__logo" href="#/home">
          <div class="navbar__logo-icon">❄️</div>
          <span>Frozen Space</span>
        </a>
        <div class="navbar__nav" id="nav-menu">
          <a class="navbar__link active" href="#/home" data-i18n="nav.home">${t('nav.home')}</a>
          <a class="navbar__link" href="#/challenges" data-i18n="nav.challenges">${t('nav.challenges')}</a>
          <a class="navbar__link" href="#contact" data-section="contact" data-i18n="nav.contact">${t('nav.contact')}</a>
        </div>
        <div class="navbar__actions">
          <button class="navbar__lang-toggle" id="lang-toggle">${getCurrentLang() === 'es' ? 'EN' : 'ES'}</button>
          <button class="btn btn--ghost" id="btn-logout" data-i18n="nav.logout">${t('nav.logout')}</button>
        </div>
        <button class="navbar__hamburger" id="hamburger">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero" id="hero">
      <div class="hero__bg"></div>
      <div class="hero__grid"></div>
      <div class="hero__content">
        <h1 class="hero__title">
          <span data-i18n="hero.title_1">${t('hero.title_1')}</span><br>
          <span class="text-gradient" data-i18n="hero.title_2">${t('hero.title_2')}</span>
        </h1>
        <p class="hero__subtitle" data-i18n="hero.subtitle">${t('hero.subtitle')}</p>
        <div class="hero__actions">
          <a href="#/challenges" class="btn btn--primary btn--lg" data-i18n="hero.cta_primary">${t('hero.cta_primary')}</a>
          <button class="btn btn--secondary btn--lg" data-i18n="hero.cta_secondary">${t('hero.cta_secondary')}</button>
        </div>
        <div class="hero__stats">
          <div class="hero__stat">
            <div class="hero__stat-value" id="stat-challenges">10+</div>
            <div class="hero__stat-label" data-i18n="hero.stat_challenges">${t('hero.stat_challenges')}</div>
          </div>
          <div class="hero__stat">
            <div class="hero__stat-value">6</div>
            <div class="hero__stat-label" data-i18n="hero.stat_technologies">${t('hero.stat_technologies')}</div>
          </div>
          <div class="hero__stat">
            <div class="hero__stat-value">3</div>
            <div class="hero__stat-label" data-i18n="hero.stat_levels">${t('hero.stat_levels')}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Ecosystem Section -->
    <section class="section bg-grid" id="ecosystem">
      <div class="container">
        <div class="section__header reveal">
          <span class="section__label" data-i18n="ecosystem.label">${t('ecosystem.label')}</span>
          <h2 class="section__title" data-i18n="ecosystem.title">${t('ecosystem.title')}</h2>
          <p class="section__subtitle" data-i18n="ecosystem.subtitle">${t('ecosystem.subtitle')}</p>
        </div>
        <div class="pillars">
          <div class="card card--glass pillar reveal reveal-delay-1">
            <div class="card__content">
              <div class="pillar__icon">🧪</div>
              <h3 class="pillar__title" data-i18n="ecosystem.pillar_1_title">${t('ecosystem.pillar_1_title')}</h3>
              <p class="pillar__desc" data-i18n="ecosystem.pillar_1_desc">${t('ecosystem.pillar_1_desc')}</p>
            </div>
          </div>
          <div class="card card--glass pillar reveal reveal-delay-2">
            <div class="card__content">
              <div class="pillar__icon">🔧</div>
              <h3 class="pillar__title" data-i18n="ecosystem.pillar_2_title">${t('ecosystem.pillar_2_title')}</h3>
              <p class="pillar__desc" data-i18n="ecosystem.pillar_2_desc">${t('ecosystem.pillar_2_desc')}</p>
            </div>
          </div>
          <div class="card card--glass pillar reveal reveal-delay-3">
            <div class="card__content">
              <div class="pillar__icon">📊</div>
              <h3 class="pillar__title" data-i18n="ecosystem.pillar_3_title">${t('ecosystem.pillar_3_title')}</h3>
              <p class="pillar__desc" data-i18n="ecosystem.pillar_3_desc">${t('ecosystem.pillar_3_desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us Section -->
    <section class="section" id="why">
      <div class="container">
        <div class="section__header reveal">
          <span class="section__label" data-i18n="why.label">${t('why.label')}</span>
          <h2 class="section__title" data-i18n="why.title">${t('why.title')}</h2>
          <p class="section__subtitle" data-i18n="why.subtitle">${t('why.subtitle')}</p>
        </div>
        <div class="stats-row">
          <div class="card card--glass stat-card reveal reveal-delay-1">
            <div class="card__content">
              <div style="font-size: 2rem; margin-bottom: var(--space-4);">🎯</div>
              <h3 class="stat-card__label" style="font-size: var(--text-lg); font-weight: var(--font-semibold); color: var(--text-primary); margin-bottom: var(--space-2);" data-i18n="why.feature_1_title">${t('why.feature_1_title')}</h3>
              <p class="stat-card__label" data-i18n="why.feature_1_desc">${t('why.feature_1_desc')}</p>
            </div>
          </div>
          <div class="card card--glass stat-card reveal reveal-delay-2">
            <div class="card__content">
              <div style="font-size: 2rem; margin-bottom: var(--space-4);">🛠️</div>
              <h3 class="stat-card__label" style="font-size: var(--text-lg); font-weight: var(--font-semibold); color: var(--text-primary); margin-bottom: var(--space-2);" data-i18n="why.feature_2_title">${t('why.feature_2_title')}</h3>
              <p class="stat-card__label" data-i18n="why.feature_2_desc">${t('why.feature_2_desc')}</p>
            </div>
          </div>
          <div class="card card--glass stat-card reveal reveal-delay-3">
            <div class="card__content">
              <div style="font-size: 2rem; margin-bottom: var(--space-4);">⚡</div>
              <h3 class="stat-card__label" style="font-size: var(--text-lg); font-weight: var(--font-semibold); color: var(--text-primary); margin-bottom: var(--space-2);" data-i18n="why.feature_3_title">${t('why.feature_3_title')}</h3>
              <p class="stat-card__label" data-i18n="why.feature_3_desc">${t('why.feature_3_desc')}</p>
            </div>
          </div>
          <div class="card card--glass stat-card reveal reveal-delay-4">
            <div class="card__content">
              <div style="font-size: 2rem; margin-bottom: var(--space-4);">📈</div>
              <h3 class="stat-card__label" style="font-size: var(--text-lg); font-weight: var(--font-semibold); color: var(--text-primary); margin-bottom: var(--space-2);" data-i18n="why.feature_4_title">${t('why.feature_4_title')}</h3>
              <p class="stat-card__label" data-i18n="why.feature_4_desc">${t('why.feature_4_desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="section bg-dots" id="contact">
      <div class="container">
        <div class="section__header reveal">
          <span class="section__label" data-i18n="contact.label">${t('contact.label')}</span>
          <h2 class="section__title" data-i18n="contact.title">${t('contact.title')}</h2>
          <p class="section__subtitle" data-i18n="contact.subtitle">${t('contact.subtitle')}</p>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-8); max-width: 900px; margin: 0 auto;">
          <div class="card card--glass reveal">
            <div class="card__content">
              <form id="demo-form">
                <div class="form-group">
                  <label class="form-label" data-i18n="contact.name">${t('contact.name')}</label>
                  <input type="text" class="form-input" placeholder="${t('contact.name')}" required>
                </div>
                <div class="form-group">
                  <label class="form-label" data-i18n="contact.email">${t('contact.email')}</label>
                  <input type="email" class="form-input" placeholder="${t('contact.email')}" required>
                </div>
                <div class="form-group">
                  <label class="form-label" data-i18n="contact.company">${t('contact.company')}</label>
                  <input type="text" class="form-input" placeholder="${t('contact.company')}">
                </div>
                <div class="form-group">
                  <label class="form-label" data-i18n="contact.role">${t('contact.role')}</label>
                  <input type="text" class="form-input" placeholder="${t('contact.role')}">
                </div>
                <button type="submit" class="btn btn--primary btn--block" data-i18n="contact.submit">${t('contact.submit')}</button>
              </form>
            </div>
          </div>
          <div class="reveal reveal-delay-2" style="display: flex; flex-direction: column; justify-content: center; padding: var(--space-6);">
            <ul style="display: flex; flex-direction: column; gap: var(--space-4);">
              ${(t('contact.features') || []).map(f => `
                <li style="display: flex; align-items: center; gap: var(--space-3); color: var(--text-secondary);">
                  <span style="color: var(--accent-tertiary-light); font-size: var(--text-lg);">✓</span>
                  <span>${f}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer__grid">
          <div>
            <div class="navbar__logo" style="margin-bottom: var(--space-2);">
              <div class="navbar__logo-icon">❄️</div>
              <span>Frozen Space</span>
            </div>
            <p class="footer__brand-desc" data-i18n="footer.desc">${t('footer.desc')}</p>
          </div>
          <div>
            <h4 class="footer__col-title" data-i18n="footer.platform">${t('footer.platform')}</h4>
            <div class="footer__links">
              <a href="#/challenges" class="footer__link" data-i18n="nav.challenges">${t('nav.challenges')}</a>
              <a href="#" class="footer__link" data-i18n="nav.tools">${t('nav.tools')}</a>
              <a href="#" class="footer__link" data-i18n="nav.progress">${t('nav.progress')}</a>
            </div>
          </div>
          <div>
            <h4 class="footer__col-title" data-i18n="footer.resources">${t('footer.resources')}</h4>
            <div class="footer__links">
              <a href="#" class="footer__link" data-i18n="footer.blog">${t('footer.blog')}</a>
              <a href="#" class="footer__link" data-i18n="footer.docs">${t('footer.docs')}</a>
            </div>
          </div>
          <div>
            <h4 class="footer__col-title" data-i18n="footer.company">${t('footer.company')}</h4>
            <div class="footer__links">
              <a href="#" class="footer__link" data-i18n="footer.about">${t('footer.about')}</a>
              <a href="#" class="footer__link" data-i18n="footer.privacy">${t('footer.privacy')}</a>
              <a href="#" class="footer__link" data-i18n="footer.terms">${t('footer.terms')}</a>
            </div>
          </div>
        </div>
        <div class="footer__bottom">
          <span>© ${new Date().getFullYear()} Frozen Space. <span data-i18n="footer.rights">${t('footer.rights')}</span></span>
          <span>Fernando 🚀</span>
        </div>
      </div>
    </footer>
  `;

  applyTranslations();
  setupHomeInteractions();

  // Return cleanup function
  return () => {
    // Cleanup if needed
  };
}

function setupHomeInteractions() {
  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // Hamburger menu
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  // Language toggle
  const langToggle = document.getElementById('lang-toggle');
  langToggle?.addEventListener('click', () => {
    toggleLang();
    langToggle.textContent = getCurrentLang() === 'es' ? 'EN' : 'ES';
  });

  // Logout
  document.getElementById('btn-logout')?.addEventListener('click', () => {
    clearAuth();
    navigate('/login');
  });

  // Scroll reveal with Intersection Observer
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  revealElements.forEach((el) => observer.observe(el));

  // Demo form
  document.getElementById('demo-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert(getCurrentLang() === 'es' ? '¡Solicitud enviada! Te contactaremos pronto.' : 'Request sent! We will contact you soon.');
  });

  // Smooth scroll for section links
  document.querySelectorAll('[data-section]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.getAttribute('data-section');
      const el = document.getElementById(section);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
