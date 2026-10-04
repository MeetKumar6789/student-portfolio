export const BASE_URL = 'http://localhost:5000';
const TOKEN_KEY = 'task-manager-token';

export function getAuthToken() {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

async function request(endpoint, options = {}) {
  const { method = 'GET', body, headers = {} } = options;
  const token = ['/register', '/login'].includes(endpoint) ? null : getAuthToken();

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    if (response.status === 401 && token) {
      clearAuthToken();
      window.dispatchEvent(new CustomEvent('task-manager:unauthorized'));
    }

    const error = new Error(data.error || `Request failed with status ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return data;
}

export const api = {
  register: (credentials) => request('/register', { method: 'POST', body: credentials }),
  login: (credentials) => request('/login', { method: 'POST', body: credentials }),
  getCurrentUser: () => request('/me'),
  getTasks: () => request('/tasks'),
  createTask: (task) => request('/tasks', { method: 'POST', body: task }),
  updateTask: (id, task) => request(`/tasks/${id}`, { method: 'PUT', body: task }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
  getAuthToken,
  setAuthToken,
  clearAuthToken,
};

export default api;
