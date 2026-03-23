// =============================================
// Frozen Space - Auth Module
// =============================================

let currentUser = null;
let authListeners = [];

export function getUser() {
  if (!currentUser) {
    const stored = localStorage.getItem('fs-user');
    if (stored) {
      try {
        currentUser = JSON.parse(stored);
      } catch (e) {
        currentUser = null;
      }
    }
  }
  return currentUser;
}

export function setUser(user, token) {
  currentUser = user;
  if (user && token) {
    localStorage.setItem('fs-user', JSON.stringify(user));
    localStorage.setItem('fs-token', token);
  }
  authListeners.forEach(fn => fn(user));
}

export function clearAuth() {
  currentUser = null;
  localStorage.removeItem('fs-user');
  localStorage.removeItem('fs-token');
  authListeners.forEach(fn => fn(null));
}

export function isAuthenticated() {
  return !!localStorage.getItem('fs-token');
}

export function onAuthChange(fn) {
  authListeners.push(fn);
  return () => {
    authListeners = authListeners.filter(l => l !== fn);
  };
}
