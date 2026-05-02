import { auth } from '../firebaseConfig.js';

const API_BASE = '/api';

/**
 * Centralized API client with automatic Firebase Auth token injection.
 * All API calls go through this to ensure consistent auth + error handling.
 */
async function getAuthHeaders() {
  const user = auth.currentUser;
  if (!user) return {};
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

async function request(method, path, body = null, options = {}) {
  const headers = {
    ...(await getAuthHeaders()),
    ...(body && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
    ...options.headers,
  };

  const config = {
    method,
    headers,
    ...(body ? { body: body instanceof FormData ? body : JSON.stringify(body) } : {}),
  };

  const res = await fetch(`${API_BASE}${path}`, config);
  const data = await res.json();

  if (!res.ok) {
    const err = new Error(data.error || `Request failed: ${res.status}`);
    err.status = res.status;
    err.details = data.details || null;
    throw err;
  }

  return data.data !== undefined ? data.data : data;
}

// ── Auth ───────────────────────────────────────────────────
export const authAPI = {
  register: (body) => request('POST', '/auth/register', body),
  me: () => request('GET', '/auth/me'),
};

// ── Dashboard ──────────────────────────────────────────────
export const dashboardAPI = {
  stats: () => request('GET', '/dashboard/stats'),
  activity: () => request('GET', '/dashboard/activity'),
  healthMap: () => request('GET', '/dashboard/health-map'),
  standup: () => request('GET', '/dashboard/standup'),
};

// ── Tasks ──────────────────────────────────────────────────
export const tasksAPI = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request('GET', `/tasks${qs ? `?${qs}` : ''}`);
  },
  get: (id) => request('GET', `/tasks/${id}`),
  create: (body) => request('POST', '/tasks', body),
  update: (id, body) => request('PUT', `/tasks/${id}`, body),
  delete: (id) => request('DELETE', `/tasks/${id}`),
  updateStatus: (id, status) => request('PATCH', `/tasks/${id}/status`, { status }),
  addComment: (id, text) => request('POST', `/tasks/${id}/comments`, { text }),
};

// ── Teams ──────────────────────────────────────────────────
export const teamsAPI = {
  list: () => request('GET', '/teams'),
  get: (id) => request('GET', `/teams/${id}`),
  create: (body) => request('POST', '/teams', body),
  update: (id, body) => request('PUT', `/teams/${id}`, body),
  delete: (id) => request('DELETE', `/teams/${id}`),
  generateInvite: (id) => request('POST', `/teams/${id}/invite`),
  join: (code) => request('POST', `/teams/join/${code}`),
  removeMember: (teamId, uid) => request('DELETE', `/teams/${teamId}/members/${uid}`),
};

// ── Profile ────────────────────────────────────────────────
export const profileAPI = {
  get: () => request('GET', '/profile'),
  update: (body) => request('PUT', '/profile', body),
};

// ── Notifications ──────────────────────────────────────────
export const notificationsAPI = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request('GET', `/notifications${qs ? `?${qs}` : ''}`);
  },
  markRead: (id) => request('PATCH', `/notifications/${id}/read`),
  markAllRead: () => request('PATCH', '/notifications/read-all'),
};

// ── AI Features ────────────────────────────────────────────
export const aiAPI = {
  suggestAssignee: (body) => request('POST', '/ai/suggest-assignee', body),
  standup: (teamId) => request('GET', `/ai/standup/${teamId}`),
  burnout: (teamId) => request('GET', `/ai/burnout/${teamId}`),
  forecast: (teamId) => request('GET', `/ai/forecast/${teamId}`),
};

// ── Upload ─────────────────────────────────────────────────
export const uploadAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('POST', '/upload', formData);
  },
  delete: (fileId) => request('DELETE', `/upload/${encodeURIComponent(fileId)}`),
};
