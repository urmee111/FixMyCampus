/**
 * Centralized API Client
 * Wraps HTTP requests with standard headers, JWT auth injection,
 * and normalizes responses to match the project's { success: true, data } / { success: false, error } contract.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const TOKEN_KEY = 'fixmycampus_token'
const USER_KEY = 'fixmycampus_user'
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK !== 'false'

export const getAuthToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export const setAuthToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  } catch (e) {
    console.error('Error persisting auth token:', e)
  }
}

export const getAuthUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null')
  } catch {
    return null
  }
}

export const setAuthUser = (user) => {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(USER_KEY)
  } catch (error) {
    console.error('Error persisting auth user:', error)
  }
}

export const clearAuthSession = () => {
  setAuthToken(null)
  setAuthUser(null)
  window.dispatchEvent(new Event('fixmycampus:unauthorized'))
}

/**
 * Standardized request wrapper.
 * Returns { success: true, data } on success, or throws normalized { success: false, error: { code, message, fields } }
 */
export async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  // Handle FormData where Content-Type is auto-managed
  if (options.body instanceof FormData) {
    delete headers['Content-Type']
  }

  const url = `${BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    const payload = await response.json().catch(() => null)

    if (!response.ok) {
      const isAuthRequest = options.url?.startsWith('/auth/') || endpoint.startsWith('/auth/')
      if (response.status === 401 && !isAuthRequest) clearAuthSession()
      const errorObj = payload?.error || {
        code: `HTTP_${response.status}`,
        message: payload?.message || response.statusText || 'An unexpected error occurred',
        fields: payload?.fields || {},
      }
      const err = new Error(errorObj.message)
      err.response = {
        status: response.status,
        data: { success: false, error: errorObj },
      }
      err.error = errorObj
      throw err
    }

    return payload || { success: true, data: null }
  } catch (error) {
    if (error.error) {
      throw error
    }
    // Network or parse error
    const normalizedError = {
      code: 'NETWORK_ERROR',
      message: "We couldn't reach the campus server. Check your connection and try again.",
      fields: {},
    }
    const err = new Error(normalizedError.message)
    err.error = normalizedError
    throw err
  }
}
