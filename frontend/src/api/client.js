// The ONE axios instance used by every API call.
// - baseURL comes from VITE_API_URL (see .env.example)
// - attaches the saved login token to every request
// - on a 401 (not logged in / token expired) it clears the login and goes to /login

import axios from 'axios';

// localStorage keys (also used by AuthContext)
export const TOKEN_KEY = 'token';
export const USER_KEY = 'user';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

// Before each request: add  Authorization: Bearer <token>
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// After each response: handle an expired / invalid login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // A 401 from /auth/login means "wrong password", not "session expired".
    // That one must stay on the page so the form can show the message.
    const isAuthCall = error.config?.url?.startsWith('/auth/');

    if (error.response?.status === 401 && !isAuthCall) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      if (window.location.pathname !== '/login') window.location.assign('/login');
    }
    return Promise.reject(error);
  },
);

// Readable message from our API error shape { success: false, error: { message } }
export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (!error.response) return 'Cannot reach the server. Check your connection.';
  return error.response.data?.error?.message || fallback;
}

// Per-field messages for forms: { title: 'Title is required', ... } (empty object if none)
export function getFieldErrors(error) {
  return error.response?.data?.error?.fields || {};
}

export default api;
