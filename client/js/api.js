// =============================================
// Frozen Space - API Client
// =============================================

const API_PORT = 3001;
const BASE_URL = `http://${window.location.hostname}:${API_PORT}/api`;

function getToken() {
  return localStorage.getItem('fs-token');
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw { status: response.status, message: data.error || 'Error desconocido' };
    }

    return data;
  } catch (err) {
    if (err.status) throw err;
    throw { status: 0, message: 'Error de conexión con el servidor' };
  }
}

export const api = {
  // Auth
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name, email, password) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  getMe: () => request('/auth/me'),

  // Challenges
  getChallenges: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.technology) params.set('technology', filters.technology);
    if (filters.difficulty) params.set('difficulty', filters.difficulty);
    if (filters.category) params.set('category', filters.category);
    const qs = params.toString();
    return request(`/challenges${qs ? `?${qs}` : ''}`);
  },

  getChallenge: (id) => request(`/challenges/${id}`),

  getMyProgress: () => request('/challenges/progress/me'),

  updateProgress: (challengeId, status, score) =>
    request(`/challenges/${challengeId}/progress`, {
      method: 'POST',
      body: JSON.stringify({ status, score }),
    }),

  // Blog
  getPosts: () => request('/blog'),
  createPost: (postData) =>
    request('/blog', {
      method: 'POST',
      body: JSON.stringify(postData),
    }),
  addComment: (postId, content) =>
    request(`/blog/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
};
