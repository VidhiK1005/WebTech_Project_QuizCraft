/**
 * Centralized API Service for QuizCraft
 * Connects React UI to Express backend endpoints.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Helper function to handle fetch calls
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Default headers
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  // If a logged-in user is stored in localStorage, attach their user id
  const storedUser = localStorage.getItem('quizcraft_user');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      if (user && user.id) {
        headers['x-user-id'] = user.id.toString();
      }
    } catch (e) {
      console.error('Error parsing stored user:', e);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Authentication
  login: (email, password) => 
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  register: (name, email, password) => 
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    }),

  logout: () => 
    request('/auth/logout', {
      method: 'POST'
    }),

  // Categories
  getCategories: () => 
    request('/categories'),

  // Quizzes
  getQuizzes: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.difficulty && params.difficulty !== 'All') query.append('difficulty', params.difficulty);
    if (params.search && params.search.trim()) query.append('search', params.search.trim());
    
    const qs = query.toString();
    return request(`/quizzes${qs ? `?${qs}` : ''}`);
  },

  getQuizById: (id) => 
    request(`/quizzes/${id}`),

  getQuizzesByCategory: (categoryId) => 
    request(`/quizzes/category/${categoryId}`),

  // Attempts
  submitAttempt: (attemptData) => 
    request('/attempts', {
      method: 'POST',
      body: JSON.stringify(attemptData)
    }),

  getAttemptById: (id) => 
    request(`/attempts/${id}`),

  // Users
  getUserProfile: (userId) => 
    request(`/users/${userId}`),

  getUserStats: (userId) => 
    request(`/users/${userId}/stats`),

  getUserAttempts: (userId) => 
    request(`/users/${userId}/attempts`)
};

export default api;
