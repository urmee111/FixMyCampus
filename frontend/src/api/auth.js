// Auth endpoints. Each function returns response.data.data (the "data" part of our API shape).

import api from './client';

// POST /auth/signup  { name, email, password, role, adminCode? }  ->  { token, user }
export async function signup(payload) {
  const response = await api.post('/auth/signup', payload);
  return response.data.data;
}

// POST /auth/login  { email, password }  ->  { token, user }
export async function login(credentials) {
  const response = await api.post('/auth/login', credentials);
  return response.data.data;
}
