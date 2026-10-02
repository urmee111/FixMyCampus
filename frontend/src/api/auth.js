import { apiRequest, setAuthToken, setAuthUser, clearAuthSession, USE_MOCK_API } from './client'
import { MOCK_USERS } from '../data/mockData'

export async function login({ email, password }) {
  if (USE_MOCK_API) {
    await new Promise((res) => setTimeout(res, 280))
    const isAdmin = email.toLowerCase().includes('admin')
    const user = isAdmin ? MOCK_USERS.admin : MOCK_USERS.student
    const token = `mock-jwt-token-${user.role}-${Date.now()}`
    setAuthToken(token)
    setAuthUser(user)
    return {
      success: true,
      data: {
        token,
        user,
      },
    }
  }

  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  if (response.data?.token) {
    setAuthToken(response.data.token)
    setAuthUser(response.data.user)
  }
  return response
}

export async function signup({ name, email, password, role = 'student', adminCode }) {
  if (USE_MOCK_API) {
    await new Promise((res) => setTimeout(res, 350))
    const user = {
      ...(role === 'admin' ? MOCK_USERS.admin : MOCK_USERS.student),
      id: Math.floor(Math.random() * 1000) + 10,
      name,
      email,
      role,
      department: role === 'admin' ? MOCK_USERS.admin.department : 'Engineering',
      studentId: `STU-${Date.now().toString().slice(-4)}`,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=128&q=80',
    }
    const token = `mock-jwt-token-${role}-${Date.now()}`
    setAuthToken(token)
    setAuthUser(user)
    return {
      success: true,
      data: {
        token,
        user,
      },
    }
  }

  const response = await apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role, ...(role === 'admin' ? { adminCode } : {}) }),
  })
  if (response.data?.token) {
    setAuthToken(response.data.token)
    setAuthUser(response.data.user)
  }
  return response
}

export async function getCurrentUser() {
  if (USE_MOCK_API) {
    await new Promise((res) => setTimeout(res, 120))
    const token = localStorage.getItem('fixmycampus_token')
    if (!token) return { success: true, data: { user: null } }
    const role = token.includes('admin') ? 'admin' : 'student'
    return {
      success: true,
      data: {
        user: role === 'admin' ? MOCK_USERS.admin : MOCK_USERS.student,
      },
    }
  }

  return apiRequest('/auth/me')
}

export async function logout() {
  clearAuthSession()
  return { success: true }
}
