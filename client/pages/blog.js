// =============================================
// Frozen Space - Blog Page
// =============================================

import { t, applyTranslations, getCurrentLang, toggleLang } from '../js/i18n.js';
import { getUser, isAuthenticated, clearAuth } from '../js/auth.js';
import { api } from '../js/api.js';
import { navigate } from '../js/router.js';

export async function renderBlogPage(container) {
  const user = getUser();
  const isAuth = isAuthenticated();

  container.innerHTML = `
    <!-- Navbar -->
    <nav class="navbar" id="navbar">
      <div class="navbar__inner">
        <a class="navbar__logo" href="#/home">
          <div class="navbar__logo-icon">❄️</div>
          <span>Frozen Space</span>
        </a>
        <div class="navbar__nav" id="nav-menu">
          <a class="navbar__link" href="#/home" data-i18n="nav.home">${t('nav.home') || 'Inicio'}</a>
          <a class="navbar__link" href="#/challenges" data-i18n="nav.challenges">${t('nav.challenges') || 'Desafíos'}</a>
          <a class="navbar__link active" href="#/blog" data-i18n="nav.blog">${t('nav.blog') || 'Blog'}</a>
        </div>
        <div class="navbar__actions">
          <button class="navbar__lang-toggle" id="lang-toggle">${getCurrentLang() === 'es' ? 'EN' : 'ES'}</button>
          <button class="btn btn--ghost" id="btn-logout" data-i18n="nav.logout">${t('nav.logout') || 'Cerrar Sesión'}</button>
        </div>
        <button class="navbar__hamburger" id="hamburger">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>

    <section class="section" style="margin-top: 80px;">
      <div class="container">
        <div class="section__header reveal">
          <div class="section__label-img" style="margin-bottom: var(--space-4);">
            <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=150&h=150&auto=format&fit=crop" 
                 alt="Student" 
                 style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid var(--accent-primary); box-shadow: var(--shadow-lg); margin: 0 auto;">
          </div>
          <h2 class="section__title" data-i18n="blog.title">${t('blog.title') || 'Tus posts nos importan'}</h2>
          <p class="section__subtitle" data-i18n="blog.subtitle">${t('blog.subtitle') || 'Seguí desarrollando tu potencial'}</p>
          <p class="blog-description" data-i18n="blog.description" style="max-width: 700px; margin: var(--space-4) auto 0; color: var(--text-secondary); line-height: 1.6;">
            ${t('blog.description') || 'Dejanos tus mejores estrategias para superar los desafíos. Cuál fue la mayor dificultad que tuviste o los momentos en que mejor te sentiste con el aprendizaje.'}
          </p>
        </div>

        ${isAuth ? `
          <div class="card card--glass reveal" style="margin-bottom: var(--space-12);">
            <div class="card__content">
              <h3 style="margin-bottom: var(--space-4);">Crear Nueva Entrada</h3>
              <form id="blog-form">
                <div class="form-group">
                  <label class="form-label">Título</label>
                  <input type="text" id="blog-title" class="form-input" placeholder="Título del post" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Contenido (Máx. 4000 caracteres)</label>
                  <textarea id="blog-content" class="form-input" style="min-height: 150px;" placeholder="¿Qué quieres compartir?" required maxlength="4000"></textarea>
                  <div id="char-count" style="text-align: right; font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px;">0 / 4000</div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
                  <div class="form-group">
                    <label class="form-label">Imagen URL 1 (Opcional)</label>
                    <input type="url" id="blog-image-1" class="form-input" placeholder="https://ejemplo.com/imagen1.jpg">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Imagen URL 2 (Opcional)</label>
                    <input type="url" id="blog-image-2" class="form-input" placeholder="https://ejemplo.com/imagen2.jpg">
                  </div>
                </div>
                <button type="submit" class="btn btn--primary" id="btn-publish">Publicar</button>
              </form>
            </div>
          </div>
        ` : `
          <div class="card card--glass reveal" style="margin-bottom: var(--space-12); text-align: center;">
            <div class="card__content">
              <p>Inicia sesión para publicar en el blog y dejar comentarios.</p>
              <a href="#/login" class="btn btn--secondary" style="margin-top: 10px;">Ir a Login</a>
            </div>
          </div>
        `}

        <div id="blog-posts" class="blog-grid">
          <div class="loader">Cargando posts...</div>
        </div>
      </div>
    </section>
  `;

  applyTranslations();
  setupBlogInteractions();
  loadPosts();

  if (isAuth) {
    setupBlogForm();
  }

  return () => {
    // Cleanup listeners if necessary
  };
}

function setupBlogInteractions() {
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

  initReveal();
}

function initReveal() {
  const revealElements = document.querySelectorAll('.reveal:not(.visible)');
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
}

async function loadPosts() {
  const postsContainer = document.getElementById('blog-posts');
  try {
    const posts = await api.getPosts();
    if (posts.length === 0) {
      postsContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No hay posts todavía.</p>';
      return;
    }

    postsContainer.innerHTML = posts.map(post => `
      <article class="card card--glass blog-post reveal" id="post-${post.id}">
        <div class="card__content">
          <div style="display: grid; grid-template-columns: ${post.image1 && post.image2 ? '1fr 1fr' : '1fr'}; gap: var(--space-4); margin-bottom: var(--space-6);">
            ${post.image1 ? `<img src="${post.image1}" alt="${post.title}" style="width: 100%; height: 250px; object-fit: cover; border-radius: var(--radius-lg);">` : ''}
            ${post.image2 ? `<img src="${post.image2}" alt="${post.title}" style="width: 100%; height: 250px; object-fit: cover; border-radius: var(--radius-lg);">` : ''}
          </div>
          <div class="blog-post__meta">
            <span class="blog-post__author">${post.author_name}</span>
            <span class="blog-post__date">${new Date(post.created_at).toLocaleDateString()}</span>
          </div>
          <h3 class="blog-post__title">${post.title}</h3>
          <div class="blog-post__content">${post.content.replace(/\n/g, '<br>')}</div>
          
          <div class="blog-post__comments">
            <h4 data-i18n="blog.comments_title">${t('blog.comments_title') || 'Comentarios'}</h4>
            <div class="comments-list" id="comments-${post.id}">
              ${post.comments && post.comments.length > 0 ? post.comments.map(c => `
                <div class="comment">
                  <strong>${c.user_name}:</strong> ${c.content}
                </div>
              `).join('') : '<p class="no-comments" style="font-size: var(--text-sm); color: var(--text-muted);">Sin comentarios.</p>'}
            </div>
            
            ${isAuthenticated() ? `
              <div class="comment-form-box" style="margin-top: var(--space-4); display: flex; gap: 8px;">
                <input type="text" class="form-input comment-input" id="input-comment-${post.id}" placeholder="Escribe un comentario..." style="flex: 1;">
                <button class="btn btn--sm btn--primary btn-send-comment" data-post-id="${post.id}">Enviar</button>
              </div>
            ` : ''}
          </div>
        </div>
      </article>
    `).join('');

    // Attach comment listeners
    document.querySelectorAll('.btn-send-comment').forEach(btn => {
      btn.addEventListener('click', async () => {
        const postId = btn.dataset.postId;
        const input = document.getElementById(`input-comment-${postId}`);
        const content = input.value.trim();
        if (content) {
          try {
            btn.disabled = true;
            await api.addComment(postId, content);
            input.value = '';
            loadPosts(); // Reload to show new comment
          } catch (err) {
            alert('Error al comentar: ' + err.message);
          } finally {
            btn.disabled = false;
          }
        }
      });
    });

    initReveal();

  } catch (err) {
    postsContainer.innerHTML = `<p style="color: var(--accent-danger); text-align: center;">Error: ${err.message}</p>`;
  }
}

function setupBlogForm() {
  const form = document.getElementById('blog-form');
  const contentArea = document.getElementById('blog-content');
  const charCount = document.getElementById('char-count');
  const publishBtn = document.getElementById('btn-publish');

  contentArea?.addEventListener('input', () => {
    const len = contentArea.value.length;
    charCount.textContent = `${len} / 4000`;
    
    if (len >= 4000) {
      charCount.style.color = 'var(--accent-danger)';
    } else if (len > 3500) {
      charCount.style.color = 'var(--accent-warning)';
    } else {
      charCount.style.color = 'var(--text-muted)';
    }

    if (len > 4000) {
      publishBtn.disabled = true;
    } else {
      publishBtn.disabled = false;
    }
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('blog-title').value;
    const content = contentArea.value;
    const image1 = document.getElementById('blog-image-1').value;
    const image2 = document.getElementById('blog-image-2').value;

    try {
      publishBtn.disabled = true;
      publishBtn.innerHTML = '<span class="spinner"></span>';
      await api.createPost({ title, content, image1, image2 });
      form.reset();
      charCount.textContent = '0 / 4000';
      publishBtn.innerHTML = 'Publicar';
      publishBtn.disabled = false;
      loadPosts();
    } catch (err) {
      alert('Error: ' + err.message);
      publishBtn.innerHTML = 'Publicar';
      publishBtn.disabled = false;
    }
  });
}
