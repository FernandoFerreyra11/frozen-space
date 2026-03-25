// =============================================
// Frozen Space - Main Application Entry
// =============================================

import { registerRoute, initRouter, navigate } from './router.js';
import { renderLoginPage } from '../pages/login.js';
import { renderHomePage } from '../pages/home.js';
import { renderChallengesPage } from '../pages/challenges.js';
import { renderBlogPage } from '../pages/blog.js';
import { isAuthenticated } from './auth.js';

// Register routes
registerRoute('/login', (container) => {
  renderLoginPage(container, false);
});

registerRoute('/register', (container) => {
  renderLoginPage(container, true);
});

registerRoute('/home', (container) => {
  return renderHomePage(container);
});

registerRoute('/challenges', (container) => {
  return renderChallengesPage(container);
});

registerRoute('/blog', (container) => {
  return renderBlogPage(container);
});

// Initialize router
const appEl = document.getElementById('app');

if (appEl) {
  initRouter(appEl);

  // If no hash, redirect
  if (!window.location.hash) {
    if (isAuthenticated()) {
      navigate('/home');
    } else {
      navigate('/login');
    }
  }
}
