// =============================================
// Frozen Space - SPA Router
// =============================================

const routes = {};
let currentCleanup = null;

export function registerRoute(path, handler) {
  routes[path] = handler;
}

export function navigate(path) {
  window.location.hash = path;
}

export function getCurrentRoute() {
  return window.location.hash.slice(1) || '/login';
}

export function initRouter(appEl) {
  async function handleRoute() {
    const path = getCurrentRoute();
    const handler = routes[path];

    if (!handler) {
      // Check if user is authenticated
      const token = localStorage.getItem('fs-token');
      if (!token) {
        navigate('/login');
        return;
      }
      navigate('/home');
      return;
    }

    // Auth guard
    if (path !== '/login' && path !== '/register') {
      const token = localStorage.getItem('fs-token');
      if (!token) {
        navigate('/login');
        return;
      }
    }

    // Cleanup previous page
    if (currentCleanup && typeof currentCleanup === 'function') {
      currentCleanup();
    }

    // Page transition
    appEl.classList.add('page-exit');
    await new Promise(r => setTimeout(r, 150));
    appEl.innerHTML = '';
    appEl.classList.remove('page-exit');
    appEl.classList.add('page-enter');

    // Render new page
    currentCleanup = await handler(appEl);

    setTimeout(() => {
      appEl.classList.remove('page-enter');
    }, 400);
  }

  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}
