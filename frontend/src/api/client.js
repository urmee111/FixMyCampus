/**
 * Centralized API Client
 * Wraps HTTP requests with standard headers, JWT auth injection,
 * and normalizes responses to match the project's { success: true, data } / { success: false, error } contract.
 */

// VITE_API_BASE_URL is the only setting. Without it we use the local backend, but only while developing.
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '')).replace(/\/+$/, '')
const TOKEN_KEY = 'fixmycampus_token'
const USER_KEY = 'fixmycampus_user'

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

// Builds the error object every page understands: err.error = { code, message, fields }, err.response.status
function makeApiError(errorObj, status) {
  const err = new Error(errorObj.message)
  err.error = errorObj
  if (status) err.response = { status, data: { success: false, error: errorObj } }
  return err
}

/**
 * Standardized request wrapper.
 * Returns { success: true, data } on success, or throws an Error with err.error = { code, message, fields }
 * (the backend's { success: false, error } object, or a NETWORK_ERROR / BAD_RESPONSE one made here).
 */
export async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  // Handle FormData where Content-Type is auto-managed (the browser adds the multipart boundary)
  if (options.body instanceof FormData) {
    delete headers['Content-Type']
  }

  let response
  let payload
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers })
    payload = await response.json().catch(() => null)
  } catch {
    throw makeApiError({
      code: 'NETWORK_ERROR',
      message: "We couldn't reach the campus server. Check your connection and try again.",
      fields: {},
    })
  }

  if (!response.ok) {
    // A 401 on the login/signup form just means "wrong password". Anywhere else it means the session ended.
    const isAuthRequest = endpoint.startsWith('/auth/')
    if (response.status === 401 && !isAuthRequest) clearAuthSession()
    throw makeApiError(
      payload?.error || {
        code: `HTTP_${response.status}`,
        message: response.statusText || 'An unexpected error occurred',
        fields: {},
      },
      response.status,
    )
  }

  // A 200 that is not our { success, data } JSON (for example an HTML page from a wrong API address) is an error too
  if (!payload || payload.success !== true) {
    throw makeApiError({
      code: 'BAD_RESPONSE',
      message: 'The server sent an unexpected answer. Please try again in a moment.',
      fields: {},
    }, response.status)
  }

  return payload
}
