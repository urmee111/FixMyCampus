import { apiRequest, setAuthToken, setAuthUser, clearAuthSession } from './client'

// POST /auth/login -> { token, user: { id, name, email, role } }
export async function login({ email, password }) {
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  setAuthToken(response.data.token)
  setAuthUser(response.data.user)
  return response
}

// POST /auth/signup -> 201 { token, user }. adminCode is only sent for the admin role.
export async function signup({ name, email, password, role = 'student', adminCode }) {
  const response = await apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role, ...(role === 'admin' ? { adminCode } : {}) }),
  })
  setAuthToken(response.data.token)
  setAuthUser(response.data.user)
  return response
}

export async function logout() {
  clearAuthSession()
  return { success: true }
}
