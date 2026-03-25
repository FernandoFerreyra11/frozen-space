// =============================================
// Frozen Space - Challenges Module Page
// =============================================

import { t, applyTranslations, getCurrentLang, toggleLang } from '../js/i18n.js';
import { getUser, clearAuth } from '../js/auth.js';
import { navigate } from '../js/router.js';
import { api } from '../js/api.js';

const TECH_ICONS = {
  jira: { emoji: '📋', color: 'jira' },
  github: { emoji: '🐙', color: 'github' },
  bitbucket: { emoji: '🪣', color: 'bitbucket' },
  selenium: { emoji: '🌐', color: 'selenium' },
  cypress: { emoji: '🌲', color: 'cypress' },
  postman: { emoji: '📮', color: 'postman' },
};

let challenges = [];
let activeFilter = 'all';
let activeDifficulty = 'all';

export async function renderChallengesPage(container) {
  const user = getUser();

  container.innerHTML = `
    <!-- Navbar -->
    <nav class="navbar scrolled" id="navbar">
      <div class="navbar__inner">
        <a class="navbar__logo" href="#/home">
          <div class="navbar__logo-icon">❄️</div>
          <span>Frozen Space</span>
        </a>
        <div class="navbar__nav" id="nav-menu">
          <a class="navbar__link" href="#/home" data-i18n="nav.home">${t('nav.home')}</a>
          <a class="navbar__link active" href="#/challenges" data-i18n="nav.challenges">${t('nav.challenges')}</a>
          <a class="navbar__link" href="#/blog" data-i18n="nav.blog">${t('nav.blog') || 'Blog'}</a>
          <a class="navbar__link" href="#/home#contact" data-i18n="nav.contact">${t('nav.contact')}</a>
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

    <main style="padding-top: calc(var(--navbar-height) + var(--space-8)); min-height: 100vh;">
      <div class="container">
        <!-- Header -->
        <div class="section__header" style="margin-bottom: var(--space-8);">
          <span class="section__label" data-i18n="challenges.label">${t('challenges.label')}</span>
          <h1 class="section__title" data-i18n="challenges.title">${t('challenges.title')}</h1>
          <p class="section__subtitle" data-i18n="challenges.subtitle">${t('challenges.subtitle')}</p>
        </div>

        <!-- Filter Bar - Technology -->
        <div class="filter-bar" id="tech-filters">
          <button class="filter-btn active" data-filter="all" data-i18n="challenges.filter_all">${t('challenges.filter_all')}</button>
          <button class="filter-btn" data-filter="jira">📋 Jira</button>
          <button class="filter-btn" data-filter="github">🐙 GitHub</button>
          <button class="filter-btn" data-filter="bitbucket">🪣 Bitbucket</button>
          <button class="filter-btn" data-filter="selenium">🌐 Selenium</button>
          <button class="filter-btn" data-filter="cypress">🌲 Cypress</button>
          <button class="filter-btn" data-filter="postman">📮 Postman</button>
        </div>

        <!-- Filter Bar - Difficulty -->
        <div class="filter-bar" id="difficulty-filters" style="margin-top: calc(var(--space-3) * -1);">
          <button class="filter-btn active" data-difficulty="all" data-i18n="challenges.filter_all">${t('challenges.filter_all')}</button>
          <button class="filter-btn" data-difficulty="beginner">
            <span class="badge badge--beginner" style="font-size: inherit; padding: 0;"  data-i18n="challenges.difficulty.beginner">${t('challenges.difficulty.beginner')}</span>
          </button>
          <button class="filter-btn" data-difficulty="intermediate">
            <span class="badge badge--intermediate" style="font-size: inherit; padding: 0;" data-i18n="challenges.difficulty.intermediate">${t('challenges.difficulty.intermediate')}</span>
          </button>
          <button class="filter-btn" data-difficulty="advanced">
            <span class="badge badge--advanced" style="font-size: inherit; padding: 0;" data-i18n="challenges.difficulty.advanced">${t('challenges.difficulty.advanced')}</span>
          </button>
        </div>

        <!-- Challenges Grid -->
        <div class="challenges-grid" id="challenges-grid">
          <!-- Loading skeletons -->
          ${Array(6).fill('').map(() => `
            <div class="card">
              <div class="card__content">
                <div class="skeleton skeleton--title"></div>
                <div class="skeleton skeleton--text"></div>
                <div class="skeleton skeleton--text" style="width: 60%"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </main>

    <!-- Challenge Detail Modal -->
    <div class="modal-overlay" id="challenge-modal" style="display: none;">
      <div class="modal">
        <div class="modal__header">
          <h2 class="modal__title" id="modal-title"></h2>
          <button class="modal__close" id="modal-close">✕</button>
        </div>
        <div class="modal__body" id="modal-body"></div>
        <div class="modal__footer">
          <button class="btn btn--secondary" id="modal-cancel">Cerrar</button>
          <button class="btn btn--primary" id="modal-start" data-i18n="challenges.start_challenge">${t('challenges.start_challenge')}</button>
        </div>
      </div>
    </div>
  `;

  applyTranslations();
  setupChallengesInteractions();
  await loadChallenges();

  return () => {
    // Cleanup
  };
}

async function loadChallenges() {
  try {
    const data = await api.getChallenges();
    challenges = data.challenges || [];
    renderChallengeCards();
  } catch (err) {
    // If API fails, use fallback mock data
    challenges = getMockChallenges();
    renderChallengeCards();
  }
}

function renderChallengeCards() {
  const grid = document.getElementById('challenges-grid');
  if (!grid) return;

  const lang = getCurrentLang();
  let filtered = challenges;

  if (activeFilter !== 'all') {
    filtered = filtered.filter(c => c.technology === activeFilter);
  }
  if (activeDifficulty !== 'all') {
    filtered = filtered.filter(c => c.difficulty === activeDifficulty);
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-16); color: var(--text-muted);">
        <div style="font-size: 3rem; margin-bottom: var(--space-4);">🔍</div>
        <p>${lang === 'es' ? 'No se encontraron desafíos con estos filtros' : 'No challenges found with these filters'}</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map((challenge, i) => {
    const title = lang === 'es' ? challenge.title_es : challenge.title_en;
    const desc = lang === 'es' ? challenge.description_es : challenge.description_en;
    const tech = TECH_ICONS[challenge.technology] || { emoji: '📦', color: 'github' };
    const diffKey = `challenges.difficulty.${challenge.difficulty}`;
    const catKey = `challenges.category.${challenge.category}`;

    return `
      <div class="card card--interactive challenge-card" data-id="${challenge.id}" style="animation: fadeInUp 0.4s ease ${i * 0.08}s both;">
        <div class="card__content">
          <div class="challenge-card__header">
            <div class="challenge-card__icon challenge-card__icon--${challenge.technology}">
              ${tech.emoji}
            </div>
            <span class="badge badge--${challenge.difficulty}" data-i18n="${diffKey}">${t(diffKey)}</span>
          </div>
          <h3 class="challenge-card__title">${title}</h3>
          <p class="challenge-card__desc">${desc}</p>
          <div class="challenge-card__meta">
            <span class="challenge-card__meta-item">🕐 ${challenge.estimated_time} ${t('challenges.time')}</span>
            <span class="challenge-card__meta-item">📝 ${challenge.test_cases_count} ${t('challenges.test_cases')}</span>
            <span class="badge badge--tech">${challenge.technology.toUpperCase()}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Add click listeners
  grid.querySelectorAll('.challenge-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = parseInt(card.getAttribute('data-id'));
      openChallengeModal(id);
    });
  });
}

function openChallengeModal(id) {
  const challenge = challenges.find(c => c.id === id);
  if (!challenge) return;

  const lang = getCurrentLang();
  const title = lang === 'es' ? challenge.title_es : challenge.title_en;
  const desc = lang === 'es' ? challenge.description_es : challenge.description_en;
  const tech = TECH_ICONS[challenge.technology] || { emoji: '📦' };

  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = `
    <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-6);">
      <span class="challenge-card__icon challenge-card__icon--${challenge.technology}" style="width: 40px; height: 40px; font-size: var(--text-lg);">
        ${tech.emoji}
      </span>
      <span class="badge badge--${challenge.difficulty}">${t(`challenges.difficulty.${challenge.difficulty}`)}</span>
      <span class="badge badge--tech">${challenge.technology.toUpperCase()}</span>
    </div>
    <p style="color: var(--text-secondary); line-height: var(--leading-normal); margin-bottom: var(--space-6);">${desc}</p>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
      <div class="card card--glass" style="padding: var(--space-4);">
        <div class="card__content" style="text-align: center;">
          <div style="font-size: var(--text-2xl); font-weight: var(--font-bold);">${challenge.estimated_time}</div>
          <div style="font-size: var(--text-sm); color: var(--text-muted);">${lang === 'es' ? 'Minutos estimados' : 'Estimated minutes'}</div>
        </div>
      </div>
      <div class="card card--glass" style="padding: var(--space-4);">
        <div class="card__content" style="text-align: center;">
          <div style="font-size: var(--text-2xl); font-weight: var(--font-bold);">${challenge.test_cases_count}</div>
          <div style="font-size: var(--text-sm); color: var(--text-muted);">Test Cases</div>
        </div>
      </div>
    </div>
  `;

  const modal = document.getElementById('challenge-modal');
  modal.style.display = 'flex';

  // Start challenge button
  const startBtn = document.getElementById('modal-start');
  startBtn.onclick = async () => {
    try {
      await api.updateProgress(id, 'in_progress', 0);
    } catch (e) { /* Continue even if API fails */ }
    alert(lang === 'es' ? '¡Desafío iniciado! Esta funcionalidad está en desarrollo.' : 'Challenge started! This feature is under development.');
    modal.style.display = 'none';
  };
}

function setupChallengesInteractions() {
  // Hamburger
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  // Language
  const langToggle = document.getElementById('lang-toggle');
  langToggle?.addEventListener('click', () => {
    toggleLang();
    langToggle.textContent = getCurrentLang() === 'es' ? 'EN' : 'ES';
    renderChallengeCards();
  });

  // Logout
  document.getElementById('btn-logout')?.addEventListener('click', () => {
    clearAuth();
    navigate('/login');
  });

  // Tech filters
  document.getElementById('tech-filters')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    activeFilter = btn.getAttribute('data-filter');
    document.querySelectorAll('#tech-filters .filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderChallengeCards();
  });

  // Difficulty filters
  document.getElementById('difficulty-filters')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    const diff = btn.getAttribute('data-difficulty');
    if (!diff) return;
    activeDifficulty = diff;
    document.querySelectorAll('#difficulty-filters .filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderChallengeCards();
  });

  // Modal close
  document.getElementById('modal-close')?.addEventListener('click', () => {
    document.getElementById('challenge-modal').style.display = 'none';
  });
  document.getElementById('modal-cancel')?.addEventListener('click', () => {
    document.getElementById('challenge-modal').style.display = 'none';
  });
  document.getElementById('challenge-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'challenge-modal') {
      document.getElementById('challenge-modal').style.display = 'none';
    }
  });
}

function getMockChallenges() {
  return [
    { id: 1, title_es: 'Crear Test Cases en Jira para E-commerce', title_en: 'Create Test Cases in Jira for E-commerce', description_es: 'Aprende a crear y organizar test cases en Jira para un proyecto de e-commerce.', description_en: 'Learn to create and organize test cases in Jira for an e-commerce project.', technology: 'jira', difficulty: 'beginner', category: 'test_management', estimated_time: 45, test_cases_count: 12 },
    { id: 2, title_es: 'Automatizar Pruebas de API con Postman', title_en: 'Automate API Tests with Postman', description_es: 'Configura colecciones de Postman para automatizar pruebas de una REST API.', description_en: 'Set up Postman collections to automate REST API tests.', technology: 'postman', difficulty: 'intermediate', category: 'api_testing', estimated_time: 60, test_cases_count: 8 },
    { id: 3, title_es: 'Revisar un Pull Request en GitHub', title_en: 'Review a Pull Request on GitHub', description_es: 'Practica la revisión de código en GitHub. Identifica bugs y sugiere mejoras.', description_en: 'Practice code review on GitHub. Identify bugs and suggest improvements.', technology: 'github', difficulty: 'beginner', category: 'code_review', estimated_time: 30, test_cases_count: 6 },
    { id: 4, title_es: 'Configurar Pipeline CI/CD en Bitbucket', title_en: 'Configure CI/CD Pipeline in Bitbucket', description_es: 'Configura un pipeline de integración continua en Bitbucket Pipelines.', description_en: 'Configure a continuous integration pipeline in Bitbucket Pipelines.', technology: 'bitbucket', difficulty: 'advanced', category: 'ci_cd', estimated_time: 90, test_cases_count: 10 },
    { id: 5, title_es: 'Escribir Tests E2E con Cypress', title_en: 'Write E2E Tests with Cypress', description_es: 'Desarrolla tests end-to-end con Cypress para una aplicación web.', description_en: 'Develop end-to-end tests with Cypress for a web application.', technology: 'cypress', difficulty: 'intermediate', category: 'e2e_testing', estimated_time: 75, test_cases_count: 15 },
    { id: 6, title_es: 'Gestionar Bugs en Jira con Workflows', title_en: 'Manage Bugs in Jira with Workflows', description_es: 'Aprende a gestionar el ciclo de vida de bugs usando workflows en Jira.', description_en: 'Learn to manage the bug lifecycle using workflows in Jira.', technology: 'jira', difficulty: 'intermediate', category: 'bug_tracking', estimated_time: 50, test_cases_count: 8 },
    { id: 7, title_es: 'Tests con Selenium WebDriver', title_en: 'Tests with Selenium WebDriver', description_es: 'Escribe tests automatizados con Selenium WebDriver y Page Object Model.', description_en: 'Write automated tests with Selenium WebDriver and Page Object Model.', technology: 'selenium', difficulty: 'advanced', category: 'automation', estimated_time: 120, test_cases_count: 20 },
    { id: 8, title_es: 'Crear Reportes de Calidad en Jira', title_en: 'Create Quality Reports in Jira', description_es: 'Genera dashboards y reportes de calidad usando Jira.', description_en: 'Generate quality dashboards and reports using Jira.', technology: 'jira', difficulty: 'beginner', category: 'reporting', estimated_time: 40, test_cases_count: 5 },
    { id: 9, title_es: 'Integrar GitHub Actions para Testing', title_en: 'Integrate GitHub Actions for Testing', description_es: 'Configura GitHub Actions para ejecutar tests automatizados en cada push.', description_en: 'Configure GitHub Actions to run automated tests on every push.', technology: 'github', difficulty: 'advanced', category: 'ci_cd', estimated_time: 80, test_cases_count: 12 },
    { id: 10, title_es: 'Testing de Performance con Postman', title_en: 'Performance Testing with Postman', description_es: 'Ejecuta tests de carga y performance usando Postman y Newman.', description_en: 'Run load and performance tests using Postman and Newman.', technology: 'postman', difficulty: 'advanced', category: 'performance', estimated_time: 70, test_cases_count: 10 },
  ];
}
